export const PositionBase = Object.freeze({
    LEFT_TOP: 'left_top',
    RIGHT_TOP: 'right_top',
    LEFT_BOTTOM: 'left_bottom',
    RIGHT_BOTTOM: 'right_bottom',
    LEFT_MID: 'left_mid',
    RIGHT_MID: 'right_mid',
    TOP_MID: 'top_mid',
    BOTTOM_MID: 'bottom_mid',
    CENTER: 'center',
    NONE: 'none'
});

export class StringUtils {
    static getNthNumber(number, digit) {
        return number.toLocaleString('en-US', {
            minimumIntegerDigits: digit,
            useGrouping: false
        });
    }
}