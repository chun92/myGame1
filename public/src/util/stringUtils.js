export class StringUtils {
    static getNthNumber(number, digit) {
        return number.toLocaleString('en-US', {
            minimumIntegerDigits: digit,
            useGrouping: false
        });
    }
}