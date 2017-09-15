"use strict";

var typeUtils = require("../core/utils/type"),
    stringUtils = require("../core/utils/string"),
    numberFormatter = require("../localization/number"),
    dateLocalization = require("../localization/date"),
    generateDateFormat = require("../core/utils/date_format_generator").generateDateFormat,
    getLanguageID = require("../localization/language_codes").getLanguageId,
    UNSUPPORTED_FORMAT_MAPPING = {
        quarter: "shortDate",
        quarterAndYear: "shortDate",
        minute: "longTime",
        millisecond: "longTime"
    },
    ARABIC_ZERO_CODE = 1632,
    DEFINED_NUMBER_FORMTATS = {
        thousands: "#,##0{0},&quot;K&quot;",
        millions: "#,##0{0},,&quot;M&quot;",
        billions: "#,##0{0},,,&quot;B&quot;",
        trillions: "#,##0{0},,,,&quot;T&quot;",
        percent: "0{0}%",
        decimal: "#{0}",
        "fixedpoint": "#,##0{0}",
        exponential: "0{0}E+00",
        currency: " "
    };

require("../localization/currency");

var excelFormatConverter = module.exports = {
    _applyPrecision: function(format, precision) {
        var result,
            i;

        if(precision > 0) {
            result = format !== "decimal" ? "." : "";
            for(i = 0; i < precision; i++) {
                result = result + "0";
            }

            return result;
        }
        return "";
    },

    _getCurrencyFormat: function(currency) {
        return numberFormatter.getOpenXmlCurrencyFormat(currency);
    },

    _hasArabicDigits: function(text) {
        var code;

        for(var i = 0; i < text.length; i++) {
            code = text.charCodeAt(i);
            if(code >= ARABIC_ZERO_CODE && code < ARABIC_ZERO_CODE + 10) {
                return true;
            }
        }
        return false;
    },

    _convertDateFormat: function(format) {
        format = UNSUPPORTED_FORMAT_MAPPING[format && format.type || format] || format;

        var that = this,
            formattedValue = (dateLocalization.format(new Date(2009, 8, 8, 6, 5, 4), format) || "").toString(),
            result = generateDateFormat(format);

        result = that._getLanguageInfo(formattedValue) + result;

        return result;
    },

    _getLanguageInfo: function(defaultPattern) {
        var languageID = getLanguageID(),
            languageIDStr = languageID ? languageID.toString(16) : "",
            languageInfo = "";

        if(this._hasArabicDigits(defaultPattern)) {
            while(languageIDStr.length < 3) {
                languageIDStr = "0" + languageIDStr;
            }
            languageInfo = "[$-2010" + languageIDStr + "]";
        } else if(languageIDStr) {
            languageInfo = "[$-" + languageIDStr + "]";
        }

        return languageInfo;
    },

    _convertNumberFormat: function(format, precision, currency) {
        var result,
            excelFormat = format === "currency" ? this._getCurrencyFormat(currency) : DEFINED_NUMBER_FORMTATS[format.toLowerCase()];

        if(excelFormat) {
            result = stringUtils.format(excelFormat, this._applyPrecision(format, precision));
        }

        return result;
    },

    convertFormat: function(format, precision, type, currency) {
        if(typeUtils.isDefined(format)) {
            if(type === "date") {
                return excelFormatConverter._convertDateFormat(format);
            } else {
                if(typeUtils.isString(format) && DEFINED_NUMBER_FORMTATS[format.toLowerCase()]) {
                    return excelFormatConverter._convertNumberFormat(format, precision, currency);
                }
            }
        }
    }
};
