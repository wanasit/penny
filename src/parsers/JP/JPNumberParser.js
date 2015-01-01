/*
    
    
*/


var util   = require('./util');
var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;

var PATTERN = /([１-９]{1,3}(,[０-９]{3})*(\.[０-９]*)?)/;

exports.Parser = function JPNumberParser(){
    
    Parser.call(this);
        
    this.pattern = function() { return PATTERN; }

    this.extract = function(text, match, opt){ 

        var number = match[1];
        number = util.zenkakuToHankaku(number);
        number = number.replace(',', '');
        number = parseFloat(number);

        if (match[2] == '万') {
            number *= 10000;
        }
        if (match[2] == '千') {
            number *= 1000;
        }
        if (match[2] == '億') {
            number *= 100000000;
        }

        return new ParsedResult({
            text: match[0],
            index: match.index,
            number: number,
            tag: 'JPNumberParser'
        });
    }
}

