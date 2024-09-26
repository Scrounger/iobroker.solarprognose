/*
 * Created with @iobroker/create-adapter v2.6.5
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';
import moment from 'moment';
import * as schedule from 'node-schedule';

import * as myTypes from './lib/myTypes';
import * as myHelper from './lib/helper';

class Solarprognose extends utils.Adapter {
	testMode = false;

	apiEndpoint = 'https://www.solarprognose.de/web/solarprediction/api/v1';
	updateSchedule: schedule.Job | undefined = undefined;
	myTranslation: { [key: string]: any; } | undefined;

	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: 'solarprognose',
			useFormatDate: true
		});
		this.on('ready', this.onReady.bind(this));
		this.on('stateChange', this.onStateChange.bind(this));
		// this.on('objectChange', this.onObjectChange.bind(this));
		// this.on('message', this.onMessage.bind(this));
		this.on('unload', this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	private async onReady(): Promise<void> {
		const logPrefix = '[onReady]:';

		try {
			// Initialize your adapter here
			await this.loadTranslation();
			await this.updateData();

		} catch (error: any) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 */
	private onUnload(callback: () => void): void {
		try {
			if (this.updateSchedule) this.updateSchedule.cancel()

			callback();
		} catch (e) {
			callback();
		}
	}

	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	// /**
	//  * Is called if a subscribed object changes
	//  */
	// private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
	// 	if (obj) {
	// 		// The object was changed
	// 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
	// 	} else {
	// 		// The object was deleted
	// 		this.log.info(`object ${id} deleted`);
	// 	}
	// }

	/**
	 * Is called if a subscribed state changes
	 */
	private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires 'common.messagebox' property to be set to true in io-package.json
	//  */
	// private onMessage(obj: ioBroker.Message): void {
	// 	if (typeof obj === 'object' && obj.message) {
	// 		if (obj.command === 'send') {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info('send command');

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
	// 		}
	// 	}
	// }

	private async updateData(): Promise<void> {
		const logPrefix = '[updateData]:';

		try {
			if (this.config.project && this.config.accessToken && this.config.solarprognoseItem && this.config.solarprognoseId) {
				const url = `${this.apiEndpoint}?access-token=${this.config.accessToken}&project=${this.config.project}&item=${this.config.solarprognoseItem}&id=${this.config.solarprognoseId}&type=hourly&_format=json`;
				const response = await this.downloadData(url);

				this.log.silly(JSON.stringify(response));

				if (response) {
					if (response.status === 0) {
						await this.createOrUpdateState(this.namespace, myTypes.stateDefinition['statusResponse'], response.status, 'statusResponse', true);

						await this.processData(response.data);

						if (this.updateSchedule) this.updateSchedule.cancel()
						const nextUpdateTime = this.getNextUpdateTime(response.preferredNextApiRequestAt);
						this.updateSchedule = schedule.scheduleJob(nextUpdateTime.toDate(), async () => {
							this.updateData();
						});

						await this.createOrUpdateState(this.namespace, myTypes.stateDefinition['lastUpdate'], moment().format(`ddd ${this.dateFormat} HH:mm:ss`), 'lastUpdate');

						this.log.info(`${logPrefix} data successfully updated, next update: ${nextUpdateTime.format(`ddd ${this.dateFormat} HH:mm:ss`)}`);

					} else {
						this.log.error(`${logPrefix} data received with error code: ${response.status} - ${myTypes.stateDefinition.statusResponse.common.states[response.status]}`);
					}
				} else {
					this.log.error(`${logPrefix} no data received!`);
				}

			} else {
				this.log.error(`${logPrefix} settings missing. Please check your adapter configuration!`);
			}
		} catch (error: any) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}

	private async processData(data: { [key: number]: Array<number> } | number) {
		const logPrefix = '[processData]:';

		try {
			if (data) {
				const jsonResult: Array<myTypes.myJsonStructure> = [];

				for (const [timestamp, arr] of Object.entries(data)) {
					jsonResult.push({
						human: moment(parseInt(timestamp) * 1000).format(`ddd ${this.dateFormat} HH:mm`),
						timestamp: parseInt(timestamp),
						val: arr[0],
						total: arr[1]
					});

					await this.createOrUpdateState(this.namespace, myTypes.stateDefinition['jsonTable'], JSON.stringify(jsonResult), 'jsonTable');
				}

			} else {
				this.log.error(`${logPrefix} received data has no forecast data!`);
			}

		} catch (error: any) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}

	private async downloadData(url: string): Promise<myTypes.dataStructure | undefined> {
		const logPrefix = '[downloadData]:';

		try {
			if (!this.testMode) {
				const response: any = await fetch(url);

				if (response.status === 200) {
					this.log.debug(`${logPrefix} data successfully received`);

					return await response.json();
				} else {
					this.log.error(`${logPrefix} status code: ${response.status}`);
				}
			} else {
				this.log.warn(`${logPrefix} Test mode is active!`);

				const { default: data } = await import('../test/testData.json', { assert: { type: "json" } });
				return data;
			}
		} catch (error: any) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}

		return undefined;
	}

	private async createOrUpdateState(idChannel: string, stateDef: myTypes.tStateDefinition, val: string | number, key: string, forceUpdate: boolean = false): Promise<boolean> {
		const logPrefix = '[createOrUpdateState]:';

		try {
			const id = `${idChannel}.${stateDef.id}`

			stateDef.common.name = this.getTranslation(key);

			if (stateDef.common.unit && Object.prototype.hasOwnProperty.call(this.config, stateDef.common.unit)) {
				//@ts-ignore
				stateDef.common.unit = this.getTranslation(this.config[stateDef.common.unit]) || stateDef.common.unit
			}

			if (!await this.objectExists(id)) {
				this.log.debug(`${logPrefix} creating state '${id}'`);

				const obj = {
					type: 'state',
					common: stateDef.common,
					native: {}
				};

				//@ts-ignore
				await this.setObjectAsync(id, obj);
			} else {
				// update State if needed
				const obj = await this.getObjectAsync(id);


				if (obj && obj.common) {
					if (JSON.stringify(obj.common) !== JSON.stringify(stateDef.common)) {
						await this.extendObject(id, { common: stateDef.common });
						this.log.debug(`${logPrefix} updated common properties of state '${id}'`);
					}
				}
			}

			if (forceUpdate) {
				await this.setState(id, val, true);
				this.log.silly(`${logPrefix} value of state '${id}' updated (force: ${forceUpdate})`);

				return true;
			} else {
				let changedObj: any = undefined;

				changedObj = await this.setStateChangedAsync(id, val, true);

				if (changedObj && Object.prototype.hasOwnProperty.call(changedObj, 'notChanged') && !changedObj.notChanged) {
					this.log.silly(`${logPrefix} value of state '${id}' changed`);
					return !changedObj.notChanged
				}
			}
		} catch (err: any) {
			console.error(`${logPrefix} error: ${err.message}, stack: ${err.stack}`);
		}

		return false;
	}

	private getNextUpdateTime(preferredNextApiRequestAt: myTypes.preferredNextApiRequestAt | undefined): moment.Moment {
		const logPrefix = '[getNextUpdateTime]:';

		let nextUpdate = moment().add(1, 'hours');

		try {
			if (preferredNextApiRequestAt && preferredNextApiRequestAt.epochTimeUtc) {
				const nextApiRequestLog = moment(preferredNextApiRequestAt.epochTimeUtc * 1000).format(`ddd ${this.dateFormat} HH:mm:ss`);

				if (!moment().isBefore(moment(preferredNextApiRequestAt.epochTimeUtc * 1000))) {
					// 'preferredNextApiRequestAt' is in the past
					this.log.debug(`${logPrefix} preferredNextApiRequestAt: '${nextApiRequestLog}' is in the past! Next update: ${nextUpdate.format(`ddd ${this.dateFormat} HH:mm:ss`)}`);
				} else if ((moment(preferredNextApiRequestAt.epochTimeUtc * 1000).diff(moment()) / (1000 * 60 * 60)) >= 1.1) {
					// 'preferredNextApiRequestAt' is more than one hour in the future
					this.log.debug(`${logPrefix} preferredNextApiRequestAt: '${nextApiRequestLog}' is more than one hour in the future! Next update: ${nextUpdate.format(`ddd ${this.dateFormat} HH:mm:ss`)}`);
				} else {
					// using 'preferredNextApiRequestAt'
					nextUpdate = moment(preferredNextApiRequestAt.epochTimeUtc * 1000);
					this.log.debug(`${logPrefix} next update: ${moment(preferredNextApiRequestAt.epochTimeUtc * 1000).format(`ddd ${this.dateFormat} HH:mm:ss`)} by 'preferredNextApiRequestAt'`);
				}
			} else {
				this.log.debug(`${logPrefix} no 'preferredNextApiRequestAt' exist, next update: ${nextUpdate.format(`ddd ${this.dateFormat} HH:mm:ss`)}`);
			}

		} catch (err: any) {
			console.error(`${logPrefix} error: ${err.message}, stack: ${err.stack}`);
		}

		return nextUpdate;
	}

	private async loadTranslation(): Promise<void> {
		const logPrefix = '[loadTranslation]:';

		try {
			moment.locale(this.language || 'en');

			const fileName = `../admin/i18n/${this.language || 'en'}/translations.json`

			this.myTranslation = (await import(fileName, { assert: { type: 'json' } })).default;

			this.log.debug(`${logPrefix} translation data loaded from '${fileName}'`);

		} catch (err: any) {
			console.error(`${logPrefix} error: ${err.message}, stack: ${err.stack}`);
		}
	}

	private getTranslation(str: string): string {
		const logPrefix = '[getTranslation]:';

		try {
			if (this.myTranslation && this.myTranslation[str]) {
				return this.myTranslation[str];
			} else {
				this.log.warn(`${logPrefix} no translation for key '${str}' exists!`);
			}
		} catch (err: any) {
			console.error(`${logPrefix} error: ${err.message}, stack: ${err.stack}`);
		}

		return str;
	}
}

if (require.main !== module) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new Solarprognose(options);
} else {
	// otherwise start the instance directly
	(() => new Solarprognose())();
}