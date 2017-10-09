"use strict";

var FLOAT_SEPARATOR = ".";
var GROUP_SEPARATOR = ",";
var ESCAPING_CHAR = "'";

function escapeFormat(formatString) {
    return formatString.replace(/[.*+?^${}()|\[\]\\]/g, "\\$&");
}

function getGroupSizes(formatString) {
    return formatString.split(GROUP_SEPARATOR).slice(1).map(function(str) {
        return str.length;
    });
}

function getIntegerPartRegExp(formatString) {
    var result = escapeFormat(formatString);
    result = result.replace(new RegExp("([0#\\" + GROUP_SEPARATOR + "]+)$"), "($1)");

    var groupSizes = getGroupSizes(formatString),
        requiredDigitCount = formatString.split("0").length - 1;

    result = result.replace(/0/g, "\\d");

    if(formatString.indexOf("#" + GROUP_SEPARATOR) >= 0 && groupSizes.length) {
        var firstGroupSize = groupSizes[0],
            lastGroupSize = groupSizes[groupSizes.length - 1];

        result = result.replace(new RegExp("[#\\" + GROUP_SEPARATOR + "]+"),
            "([1-9]\\d{0," + (firstGroupSize - 1) + "},)(\\d{" + firstGroupSize + "},)*\\d{" +
            lastGroupSize + "}|([1-9]\\d{0," + (lastGroupSize - 1 - requiredDigitCount) + "})?");
    } else {
        result = result.replace(/#+/g, "([1-9]\\d*)?" + (requiredDigitCount ? "" : "|[0]"));
    }
    return result;
}

function getFloatPartRegExp(formatString) {
    if(!formatString) return "()";

    var result = escapeFormat(FLOAT_SEPARATOR + formatString);
    result = result.replace(new RegExp("^(\\\\" + FLOAT_SEPARATOR + "0[0#]*)"), "($1)");
    result = result.replace(new RegExp("^(\\\\" + FLOAT_SEPARATOR + "[0#]*)"), "($1)?");
    result = result.replace(/0/g, "\\d");
    result = result.replace(/#/g, "\\d?");
    return result;
}

function getRegExp(formatString) {
    var floatParts = formatString.split(FLOAT_SEPARATOR),
        integerRegexp = getIntegerPartRegExp(floatParts[0]),
        floatRegExp = getFloatPartRegExp(floatParts[1]);

    return integerRegexp + floatRegExp;
}

function getSignParts(format) {
    var signParts = format.split(";");

    if(signParts.length === 1) {
        signParts.push("-" + signParts[0]);
    }

    return signParts;
}

function checkParserArguments(format, text) {
    return format && text && typeof format === "string" && typeof text === "string";
}

function isPercentFormat(format) {
    return format.slice(-1) === "%";
}

function generateNumberParser(format) {
    return function(text) {
        if(!checkParserArguments(format, text)) {
            return null;
        }

        var signParts = getSignParts(format),
            regExpText = signParts.map(getRegExp).join("|"),
            parseResult = new RegExp("^(" + regExpText + ")$").exec(text);

        if(!parseResult) {
            return null;
        }

        var signPartResultCount = parseResult.length / 2 - 1,
            isNegative = parseResult[signPartResultCount + 2],
            integerResultIndex = isNegative ? signPartResultCount + 2 : 2,
            floatResultIndex = integerResultIndex + signPartResultCount - 1,
            integerPart = parseResult[integerResultIndex].replace(new RegExp(GROUP_SEPARATOR, "g"), ""),
            floatPart = parseResult[floatResultIndex];

        var value = parseInt(integerPart) || 0;

        if(value > Number.MAX_SAFE_INTEGER) {
            return null;
        }

        if(floatPart) {
            value += parseFloat(floatPart) || 0;
        }

        if(isNegative) {
            value = -value;
        }

        if(isPercentFormat(format)) {
            value = value / 100;
        }

        return value;
    };
}

var formatRules = {
    "#": {
        regexp: "\\d*",
        empty: ""
    },

    "0": {
        regexp: "\\d",
        empty: "0"
    }
};

function getFormatString(format, value) {
    var stringValue = (value || "").toString(),
        specialFormatChars = Object.keys(formatRules),
        isProcessingPrevented = false,
        resultString = "";

    for(var i = 0; i < format.length; i++) {
        var formatChar = format.charAt(i);

        if(formatChar === ESCAPING_CHAR) {
            isProcessingPrevented = !isProcessingPrevented;
        }

        if(isProcessingPrevented || specialFormatChars.indexOf(formatChar) === -1) {
            if(formatChar !== ESCAPING_CHAR) resultString += formatChar;
            stringValue = stringValue.replace(new RegExp("^" + escapeFormat(formatChar)), "");
            continue;
        }

        var formatRule = formatRules[formatChar],
            formatRegExp = new RegExp("^" + formatRule.regexp);

        var matches = stringValue.match(formatRegExp);

        resultString += matches ? matches[0] : formatRule.empty;
        stringValue = stringValue.replace(formatRegExp, "");
    }

    return resultString;
}

function reverseString(str) {
    return str.toString().split("").reverse().join("");
}

function isPercentFormat(format) {
    return format.indexOf("%") !== -1 && !format.match(/'[^']*%[^']*'/g);
}

function getMaxPrecision(floatFormat) {
    if(!floatFormat) return 0;
    return floatFormat.replace(/[^#0]/g, "").length;
}

function generateNumberFormatter(format) {
    return function(value) {
        if(typeof value !== "number" || isNaN(value)) return "";

        var signParts = getSignParts(format),
            numberFormat = signParts[value > 0 || 1 / value === Infinity ? 0 : 1];

        if(isPercentFormat(numberFormat)) {
            value = value * 100;
        }

        var floatParts = numberFormat.split(FLOAT_SEPARATOR),
            maxFloatPrecision = getMaxPrecision(floatParts[1]);

        value = value.toFixed(maxFloatPrecision);

        var valueIntegerPart = parseInt(Math.abs(value)),
            valueFloatPart = value.toString().split(FLOAT_SEPARATOR)[1],
            integerString = reverseString(getFormatString(reverseString(floatParts[0]), reverseString(valueIntegerPart))),
            floatString = maxFloatPrecision ? getFormatString(floatParts[1], valueFloatPart) : "";

        if(!integerString.match(/\d/)) integerString += "0";

        var formatString = integerString + (floatString.match(/\d/) ? FLOAT_SEPARATOR : "") + floatString;

        return formatString;
    };
}

exports.generateNumberParser = generateNumberParser;
exports.generateNumberFormatter = generateNumberFormatter;
