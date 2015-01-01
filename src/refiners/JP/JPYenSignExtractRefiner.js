/*
  
*/
var Refiner = require('../refiner').Refiner;

var PREFIX_YEN_SIGN_PATTERN = /(¥|￥)\s*$/;
var POSTFIX_YEN_SIGN_PATTERN = /^\s*円/;

exports.Refiner = function JPYenSignExtractRefiner() {
    Refiner.call(this);
    
    this.refine = function(text, results, opt) {
        
        results.forEach(function(result) {
            
            var textBefore = text.substring(0, result.index);
            var match = PREFIX_YEN_SIGN_PATTERN.exec(textBefore);
            if (match) {
                result.text  = match[0] + result.text;
                result.index = match.index;
                result.currency = 'JPY';
            }

            var textAfter = text.substring(result.index + result.text.length);
            var match = POSTFIX_YEN_SIGN_PATTERN.exec(textAfter);
            if (match) {
                result.text  = result.text + match[0];
                result.currency = 'JPY';
            }
        });

        return results;
    }
}
