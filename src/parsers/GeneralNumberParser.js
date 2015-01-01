/*
    
    
*/

var Parser = require('./parser').Parser;
var ParsedResult = require('../result').ParsedResult;

var PATTERN = new RegExp('(^|[^\d])' + 
    '(' + 
        '\\d{1,3}' +
        '(?:' +
            '(?:,\\d{3})*|\\d+' +
        ')' +
        '(?:\\.\\d+)?' + 
    ')(?!\\d)', 'i');

exports.Parser = function GeneralNumberParser(){
    
    Parser.call(this);
        
    this.pattern = function() { return PATTERN; }
    
    this.extract = function(text, match, opt){ 
        
        var number = match[2];
        number = number.replace(',', '');
        number = parseFloat(number);

        return new ParsedResult({
            text: match[2],
            index: match.index + match[1].length,
            number: number,
            tag: 'GeneralNumberParser'
        });
    }
}

