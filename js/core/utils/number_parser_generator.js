"use strict";

var NUMBER_REGEXP = "-?\\d+";

var FLOAT_SEPARATOR = ".";

var FLOAT_CHAR_MAP = {
    "#": "\\d?",
    "0": "\\d"
};

function getRegExpByCharMap(formatString, charMap) {
    if(!formatString) return "";

    var result = "";

    for(var i = 0; i < formatString.length; i++) {
        var char = formatString.charAt(i);
        result = result + (charMap[char] || char);
    }

    return result;
}

function getRegExp(formatString) {
    var floatParts = formatString.split(FLOAT_SEPARATOR),
        integerRegexp = NUMBER_REGEXP,
        floatRegexp = getRegExpByCharMap(floatParts[1], FLOAT_CHAR_MAP);

    floatRegexp = "(" + "\\" + FLOAT_SEPARATOR + floatRegexp + ")?";

    var finalRegexp = "^" + integerRegexp + floatRegexp + "$";
    //console.log("formatString: " + formatString, "regexp: " + finalRegexp);

    return finalRegexp;
}

function generateNumberParser(format) {
    return function(text) {
        if(typeof text !== "string") {
            return null;
        }

        var formatRegExp = new RegExp(getRegExp(format), "g"),
            isValid = formatRegExp.test(text),
            value = parseFloat(text);

        if(!isValid || isNaN(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER) {
            return null;
        }

        return value;
    };
}

exports.generateNumberParser = generateNumberParser;
