/*
    
    
*/

var Parser = require('./parser').Parser;
var ParsedResult = require('../result').ParsedResult;

var PATTERN = /(\d{1,3}(,\d{3})*(\.\d*)?)/;

exports.Parser = function GeneralNumberParser(){
    
    Parser.call(this);
        
    this.pattern = function() { return PATTERN; }
    
    this.extract = function(text, match, opt){ 

        var number = match[1];
        number = number.replace(',', '');
        number = parseFloat(number);

        return new ParsedResult({
            text: match[0],
            index: match.index,
            number: number,
            tag: 'GeneralNumberParser'
        });
    }
}

