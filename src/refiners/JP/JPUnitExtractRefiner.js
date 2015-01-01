/*
  
*/
var Refiner = require('../refiner').Refiner;

var POSTFIX_UNIT_SIGN_PATTERN = /^\s*(万|千|億)/;

exports.Refiner = function JPUnitExtractRefiner() {
    Refiner.call(this);
    
    this.refine = function(text, results, opt) {
        
        results.forEach(function(result) {

            var textAfter = text.substring(result.index + result.text.length);
            var match = POSTFIX_UNIT_SIGN_PATTERN.exec(textAfter);
            if (match) {
                result.text  = result.text + match[0];
                if (match[1] == '万') {
                    result.number *= 10000;
                }
                if (match[1] == '千') {
                    result.number *= 1000;
                }
                if (match[1] == '億') {
                    result.number *= 100000000;
                }
            }
        });

        return results;
    }
}
