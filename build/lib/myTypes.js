"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var myTypes_exports = {};
__export(myTypes_exports, {
  stateDefinition: () => stateDefinition
});
module.exports = __toCommonJS(myTypes_exports);
const commonDef = {
  number: {
    type: "number",
    read: true,
    write: false,
    role: "value",
    def: null
  },
  string: {
    type: "string",
    read: true,
    write: false,
    role: "value",
    def: null
  }
};
const stateDefinition = {
  statusResponse: {
    id: "status",
    common: {
      ...commonDef.number,
      ...{
        name: "api status response",
        states: {
          0: "OK",
          "-2": "INVALID ACCESS TOKEN",
          "-3": "MISSING PARAMETER ACCESS TOKEN",
          "-4": "EMPTY PARAMETER ACCESS TOKEN",
          "-5": "INVALID TYPE",
          "-6": "MISSING TYPE",
          "-7": "INVALID ID",
          "-8": "ACCESS DENIED",
          "-9": "INVALID ITEM",
          "-10": "INVALID TOKEN",
          "-11": "NO SOLAR DATA AVAILABLE",
          "-12": "NO DATA",
          "-13": "INTERNAL ERROR",
          "-14": "UNKNOWN ERROR",
          "-15": "INVALID START DAY",
          "-16": "INVALID END DAY",
          "-17": "INVALID DAY",
          "-18": "INVALID WEATHER SERVICE ID",
          "-19": "DAILY QUOTA EXCEEDED",
          "-20": "INVALID OR MISSING ELEMENT ITEM",
          "-21": "NO PARAMETER",
          "-22": "INVALID PERIOD",
          "-23": "INVALID START EPOCH TIME",
          "-24": "INVALID END EPOCH TIME",
          "-25": "ACCESS DENIED TO ITEM DUE TO LIMIT",
          "-26": "NO CLEARSKY VALUES",
          "-27": "MISSING INPUT ID AND TOKEN",
          "-28": "INVALID ALGORITHM",
          "-29": "FAILED TO LOAD WEATHER LOCATION ITEM"
        }
      }
    }
  },
  jsonTable: {
    id: "json",
    common: {
      name: "json table",
      type: "json",
      read: true,
      write: false,
      role: "json",
      def: "{}"
    }
  },
  lastUpdate: {
    id: "lastUpdate",
    common: commonDef.string
  },
  accuracy: {
    id: "accuracy",
    common: commonDef.number
  },
  date: {
    id: "date",
    common: commonDef.string
  },
  power: {
    id: "power",
    common: { ...commonDef.number, ...{ unit: "kW" } }
  },
  energy: {
    id: "energy",
    common: { ...commonDef.number, ...{ unit: "kWh" } }
  },
  energy_now: {
    id: "energy_now",
    common: { ...commonDef.number, ...{ unit: "kWh" } }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  stateDefinition
});
//# sourceMappingURL=myTypes.js.map
