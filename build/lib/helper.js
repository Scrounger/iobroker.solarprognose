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
var helper_exports = {};
__export(helper_exports, {
  isChannelCommonEqual: () => isChannelCommonEqual,
  isStateCommonEqual: () => isStateCommonEqual,
  zeroPad: () => zeroPad
});
module.exports = __toCommonJS(helper_exports);
function zeroPad(source, places) {
  const zero = places - source.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + source;
}
function isStateCommonEqual(objCommon, myCommon) {
  return objCommon.name === myCommon.name && objCommon.type === myCommon.type && objCommon.read === myCommon.read && objCommon.write === objCommon.write && objCommon.role === myCommon.role && objCommon.def === myCommon.def && objCommon.unit === myCommon.unit && objCommon.icon === myCommon.icon && objCommon.desc == myCommon.desc && objCommon.max === myCommon.max && objCommon.min === myCommon.min && JSON.stringify(objCommon.states) === JSON.stringify(myCommon.states);
}
function isChannelCommonEqual(objCommon, myCommon) {
  return objCommon.name === myCommon.name && objCommon.icon == myCommon.icon && objCommon.desc === myCommon.desc && objCommon.role === myCommon.role;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isChannelCommonEqual,
  isStateCommonEqual,
  zeroPad
});
//# sourceMappingURL=helper.js.map
