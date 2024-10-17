export function zeroPad(source: any, places: number): string {
    const zero = places - source.toString().length + 1;
    return Array(+(zero > 0 && zero)).join('0') + source;
}

export function isStateCommonEqual(objCommon: ioBroker.StateCommon, myCommon: ioBroker.StateCommon): boolean {

    return objCommon.name === myCommon.name &&
        objCommon.type === myCommon.type &&
        objCommon.read === myCommon.read &&
        objCommon.write === objCommon.write &&
        objCommon.role === myCommon.role &&
        objCommon.def === myCommon.def &&
        objCommon.unit === myCommon.unit &&
        objCommon.icon === myCommon.icon &&
        objCommon.desc == myCommon.desc &&
        objCommon.max === myCommon.max &&
        objCommon.min === myCommon.min &&
        JSON.stringify(objCommon.states) === JSON.stringify(myCommon.states)
}

export function isChannelCommonEqual(objCommon: ioBroker.ChannelCommon, myCommon: ioBroker.ChannelCommon): boolean {
    return objCommon.name === myCommon.name &&
        objCommon.icon == myCommon.icon &&
        objCommon.desc === myCommon.desc &&
        objCommon.role === myCommon.role
}