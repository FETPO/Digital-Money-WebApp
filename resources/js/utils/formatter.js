import numeral from "numeral";

export function formatData(number) {
    return numeral(number).format("0[.]0b");
}

export function formatPercent(number) {
    return numeral(number / 100).format("0[.]0%");
}

export function formatNumber(number) {
    return numeral(number).format("0[.]0a");
}

export function formatDollar(number) {
    return numeral(number).format("$0[.]0a");
}
