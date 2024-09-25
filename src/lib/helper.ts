export function zeroPad(source: any, places: number): string {
    let zero = places - source.toString().length + 1;
    return Array(+(zero > 0 && zero)).join('0') + source;
}