/*
  
*/
var Refiner = require('../refiner').Refiner;

var PREFIX_DOLLAR_SIGN_PATTERN = /\$\s*$/;

exports.Refiner = function USDollarSignExtractRefiner() {
    Refiner.call(this);
    
    this.refine = function(text, results, opt) {

        results.forEach(function(result) {

            var textBefore = text.substring(0, result.index);
            var match = PREFIX_DOLLAR_SIGN_PATTERN.exec(textBefore);
            if (match) {
                result.text  = match[0] + result.text;
                result.index = match.index;
                result.currency = 'USD';
            }
        });

        return results;
    }
}
