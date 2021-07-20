/**
 * Function that converts a number to a number with a
 * language-sensitive representation of this number.
 * @param    {Number}  number - Number to convert
 * @return {String} String with a language-sensitive number
 */
export const languageSensitiveNum = (number) => {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];

    if (decimalDigits != null && decimalDigits.length >= 2) {
        return `${integerDigits}.${decimalDigits}`;
    } else if (decimalDigits != null) {
        return `${integerDigits}.${decimalDigits}0`;
    } else {
        return `${integerDigits}.00`;
    }
};

/**
 * Function that take string and return the same value but with
 * capitalized first letter.
 * @param    {String}  string - String to convert
 * @return {String} String with a capitalized first letter.
 */
export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
