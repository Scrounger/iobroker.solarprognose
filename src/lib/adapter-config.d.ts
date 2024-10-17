// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
	namespace ioBroker {
		interface AdapterConfig {
			project: string;
			accessToken: string;
			solarprognoseItem: string;
			solarprognoseId: number;
			solarprognoseAlgorithm: string;
			jsonTableEnabled: boolean;
			hourlyEnabled: boolean;
			dailyEnabled: boolean;
			dailyMax: number;
			accuracyEnabled: number;
			todayEnergyObject: string;
			dailyInterpolation: boolean;
		}
	}
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export { };