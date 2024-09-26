// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
	namespace ioBroker {
		interface AdapterConfig {
			project: string;
			accessToken: string;
			solarprognoseItem: string;
			solarprognoseId: number;
			jsonTableEnabled: boolean;
			hourlyEnabled: boolean;
			dailyEnabled: boolean;
			dailyMax: number;
		}
	}
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export { };