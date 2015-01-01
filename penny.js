!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.penny=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/wanasit/Workspace_Node/Opensources/penny/src/options.js":[function(require,module,exports){

var GeneralNumberParser = require('./parsers/GeneralNumberParser').Parser;
var JPNumberParser = require('./parsers/JP/JPNumberParser').Parser;

var JPUnitExtractRefiner    = require('./refiners/JP/JPUnitExtractRefiner').Refiner;
var JPYenSignExtractRefiner    = require('./refiners/JP/JPYenSignExtractRefiner').Refiner;
var DollarSignExtractRefiner = require('./refiners/US/DollarSignExtractRefiner').Refiner;

var MergeRangeRefiner = require('./refiners/MergeRangeRefiner').Refiner;
var OverlapRemovalRefiner = require('./refiners/OverlapRemovalRefiner').Refiner;

exports.strictOption = function () {

    return exports.generalOption();
};

exports.generalOption = function () {
    return {
        parsers: [
            new GeneralNumberParser(),
            new JPNumberParser()
        ],
        refiners: [
            new DollarSignExtractRefiner(),
            new JPUnitExtractRefiner(),
            new JPYenSignExtractRefiner(),
            new MergeRangeRefiner(),
            new OverlapRemovalRefiner()
        ]
    }
}



},{"./parsers/GeneralNumberParser":"/Users/wanasit/Workspace_Node/Opensources/penny/src/parsers/GeneralNumberParser.js","./parsers/JP/JPNumberParser":"/Users/wanasit/Workspace_Node/Opensources/penny/src/parsers/JP/JPNumberParser.js","./refiners/JP/JPUnitExtractRefiner":"/Users/wanasit/Workspace_Node/Opensources/penny/src/refiners/JP/JPUnitExtractRefiner.js","./refiners/JP/JPYenSignExtractRefiner":"/Users/wanasit/Workspace_Node/Opensources/penny/src/refiners/JP/JPYenSignExtractRefiner.js","./refiners/MergeRangeRefiner":"/Users/wanasit/Workspace_Node/Opensources/penny/src/refiners/MergeRangeRefiner.js","./refiners/OverlapRemovalRefiner":"/Users/wanasit/Workspace_Node/Opensources/penny/src/refiners/OverlapRemovalRefiner.js","./refiners/US/DollarSignExtractRefiner":"/Users/wanasit/Workspace_Node/Opensources/penny/src/refiners/US/DollarSignExtractRefiner.js"}],"/Users/wanasit/Workspace_Node/Opensources/penny/src/parsers/GeneralNumberParser.js":[function(require,module,exports){
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


},{"../result":"/Users/wanasit/Workspace_Node/Opensources/penny/src/result.js","./parser":"/Users/wanasit/Workspace_Node/Opensources/penny/src/parsers/parser.js"}],"/Users/wanasit/Workspace_Node/Opensources/penny/src/parsers/JP/JPNumberParser.js":[function(require,module,exports){
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


},{"../../result":"/Users/wanasit/Workspace_Node/Opensources/penny/src/result.js","../parser":"/Users/wanasit/Workspace_Node/Opensources/penny/src/parsers/parser.js","./util":"/Users/wanasit/Workspace_Node/Opensources/penny/src/parsers/JP/util.js"}],"/Users/wanasit/Workspace_Node/Opensources/penny/src/parsers/JP/util.js":[function(require,module,exports){
/*
    
    
*/

var hankaku = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ';
var zenkaku = '１２３４５６７８９０ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ　';

exports.zenkakuToHankaku = function (word) {
  for (var i = 0, n = zenkaku.length; i < n; i++) {
    word = word.replace(new RegExp(zenkaku[i], 'gm'), hankaku[i]);
  }
  return word.replace(/^\s+|\s+$/g, ''); // trim head and tail white space
};

exports.hankakuToZenkaku = function (word) {
  for (var i = 0, n = hankaku.length; i < n; i++) {
    word = word.replace(new RegExp(hankaku[i], 'gm'), zenkaku[i]);
  }
  return word.replace(/^\s+|\s+$/g, ''); // trim head and tail white space
};


},{}],"/Users/wanasit/Workspace_Node/Opensources/penny/src/parsers/parser.js":[function(require,module,exports){

function Parser() {

    this.pattern = function() { return /./i; }

    this.extract = function(text, match, opt){ return null; }

    this.execute = function(text, opt) {

        var results = [];
        var regex = this.pattern();

        var remainingText = text;
        var match = regex.exec(remainingText);

        while (match) {

            // Calculate match index on the full text;
            match.index += text.length - remainingText.length;

            var result = this.extract(text, match, opt);
            if (result) {
                // If success, start from the end of the result
                remainingText = text.substring(result.index + result.text.length);
                results.push(result);
            } else {
                // If fail, move on by 1
                remainingText = text.substring(match.index + 1);
            }

            match = regex.exec(remainingText);
        }

        if (this.refiners) {
            this.refiners.forEach(function () {
                results = refiner.refine(results, text, options);
            });
        }

        return results;
    }
}

exports.Parser = Parser;

},{}],"/Users/wanasit/Workspace_Node/Opensources/penny/src/penny.js":[function(require,module,exports){

var Penny = function(option) {

    this.option = option;
    this.parsers = new Object(option.parsers);
    this.refiners = new Object(option.refiners);
}

Penny.prototype.parse = function(text, opt) {

    opt = opt || {};

    var allResults = [];

    this.parsers.forEach(function (parser) {
        var results = parser.execute(text, opt);
        allResults = allResults.concat(results);
    });
    
    allResults.sort(function(a, b) {
        return a.index - b.index;
    });

    this.refiners.forEach(function (refiner) {
        allResults = refiner.refine(text, allResults, opt);
    });
    
    return allResults;
};

exports.Penny = Penny;
exports.Parser = require('./parsers/parser').Parser;
exports.Refiner = require('./refiners/refiner').Filter;
exports.Filter = require('./refiners/refiner').Filter;
exports.ParsedResult = require('./result').ParsedResult;

exports.options = require('./options');

exports.strict = new Penny(exports.options.strictOption());
exports.general = new Penny(exports.options.generalOption());

exports.parse = function () {
    return exports.general.parse.apply(exports.general, arguments);
}

},{"./options":"/Users/wanasit/Workspace_Node/Opensources/penny/src/options.js","./parsers/parser":"/Users/wanasit/Workspace_Node/Opensources/penny/src/parsers/parser.js","./refiners/refiner":"/Users/wanasit/Workspace_Node/Opensources/penny/src/refiners/refiner.js","./result":"/Users/wanasit/Workspace_Node/Opensources/penny/src/result.js"}],"/Users/wanasit/Workspace_Node/Opensources/penny/src/refiners/JP/JPUnitExtractRefiner.js":[function(require,module,exports){
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

},{"../refiner":"/Users/wanasit/Workspace_Node/Opensources/penny/src/refiners/refiner.js"}],"/Users/wanasit/Workspace_Node/Opensources/penny/src/refiners/JP/JPYenSignExtractRefiner.js":[function(require,module,exports){
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

},{"../refiner":"/Users/wanasit/Workspace_Node/Opensources/penny/src/refiners/refiner.js"}],"/Users/wanasit/Workspace_Node/Opensources/penny/src/refiners/MergeRangeRefiner.js":[function(require,module,exports){
/*
  
*/
var Refiner = require('./refiner').Refiner;

var PATTERN = new RegExp("^\\s*(and|to|-|~|ー|〜|～)?\\s*$");

function isAbleToMerge(text, prevResult, curResult){

    var textBetween = text.substring(prevResult.index + prevResult.text.length, curResult.index);
    return textBetween.length > 0 && textBetween.match(PATTERN);
}


function mergeResult(text, fromResult, toResult) {

    fromResult = fromResult.clone();
    fromResult.numberMax = Math.max(toResult.number, fromResult.number);
    fromResult.numberMin = Math.min(toResult.number, fromResult.number);
    fromResult.number = fromResult.numberMin;

    var startIndex = Math.min(fromResult.index, toResult.index);
    var endIndex = Math.max(
                fromResult.index + fromResult.text.length, 
                toResult.index + toResult.text.length);

    fromResult.index = startIndex;
    fromResult.text  = text.substring(startIndex, endIndex);

    for (var tag in toResult.tags) {
        fromResult.tags[tag] = toResult.tags[tag];
    }

    fromResult.tags['MergeRangeResult'] = true;
    return fromResult;
}

exports.Refiner = function MergeRangeResult() {
	Refiner.call(this);
	
	this.refine = function(text, results, opt) { 

        if (results.length < 2) return results;
        
        var mergedResult = []
        var currResult = null;
        var prevResult = null;
        
        for (var i=1; i<results.length; i++){
            currResult = results[i];
            prevResult = results[i-1];
            
            if (!prevResult.numberMin && !currResult.numberMax 
                && isAbleToMerge(text, prevResult, currResult)) {
                prevResult = mergeResult(text, prevResult, currResult);
                currResult = null;
                i += 1;
            }
            
            mergedResult.push(prevResult);
        }
        
        if (currResult != null) {
            mergedResult.push(currResult);
        }

        return mergedResult;
    }
}
},{"./refiner":"/Users/wanasit/Workspace_Node/Opensources/penny/src/refiners/refiner.js"}],"/Users/wanasit/Workspace_Node/Opensources/penny/src/refiners/OverlapRemovalRefiner.js":[function(require,module,exports){
/*
  
*/
var Refiner = require('./refiner').Refiner;

exports.Refiner = function OverlapRemovalRefiner() {
	Refiner.call(this);
	

	this.refine = function(text, results, opt) { 

        if (results.length < 2) return results;
        
        var filteredResults = [];
        var prevResult = results[0];
        
        for (var i=1; i<results.length; i++){
            
            var result = results[i];
            
            // If overlap, compare the length and discard the shorter one
            if (result.index < prevResult.index + prevResult.text.length) {
                if (result.text.length > prevResult.text.length){
                    prevResult = result;
                }
                
            } else {
                filteredResults.push(prevResult);
                prevResult = result;
            }
        }
        
        // The last one
        if (prevResult != null) {
            filteredResults.push(prevResult);
        }
        
        return filteredResults;
    }
}
},{"./refiner":"/Users/wanasit/Workspace_Node/Opensources/penny/src/refiners/refiner.js"}],"/Users/wanasit/Workspace_Node/Opensources/penny/src/refiners/US/DollarSignExtractRefiner.js":[function(require,module,exports){
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

},{"../refiner":"/Users/wanasit/Workspace_Node/Opensources/penny/src/refiners/refiner.js"}],"/Users/wanasit/Workspace_Node/Opensources/penny/src/refiners/refiner.js":[function(require,module,exports){
/*
                                  
  
*/
exports.Refiner = function Refiner() { 

    this.refine = function(text, results, opt) { return results; };
}

exports.Filter = function Filter() { 
    
    Refiner.call(this);

    this.isValid = function(text, result, opt) { return true; }
    this.refine = function(text, results, opt) { 

        var filteredResult = [];
        for (var i=0; i=results.length; i++) {

            if (this.isValid(results[i])) {
                filteredResult.push(results[i]);
            }
        }

        return filteredResult;
    }
}
},{}],"/Users/wanasit/Workspace_Node/Opensources/penny/src/result.js":[function(require,module,exports){

function ParsedResult(result){

    result = result || {};

    this.index = result.index;
    this.text  = result.text;
    
    this.number = result.number;
    this.numberMin = result.numberMin;
    this.numberMax = result.numberMax;
    this.currency = result.currency;

    this.tags = result.tags || {};
    if (result.tag) {
    	this.tags[result.tag] = true;
    }
}

ParsedResult.prototype.clone = function() {
    return new ParsedResult(this);
}

exports.ParsedResult = ParsedResult;
},{}]},{},["/Users/wanasit/Workspace_Node/Opensources/penny/src/penny.js"])("/Users/wanasit/Workspace_Node/Opensources/penny/src/penny.js")
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL29wdGlvbnMuanMiLCJzcmMvcGFyc2Vycy9HZW5lcmFsTnVtYmVyUGFyc2VyLmpzIiwic3JjL3BhcnNlcnMvSlAvSlBOdW1iZXJQYXJzZXIuanMiLCJzcmMvcGFyc2Vycy9KUC91dGlsLmpzIiwic3JjL3BhcnNlcnMvcGFyc2VyLmpzIiwic3JjL3Blbm55LmpzIiwic3JjL3JlZmluZXJzL0pQL0pQVW5pdEV4dHJhY3RSZWZpbmVyLmpzIiwic3JjL3JlZmluZXJzL0pQL0pQWWVuU2lnbkV4dHJhY3RSZWZpbmVyLmpzIiwic3JjL3JlZmluZXJzL01lcmdlUmFuZ2VSZWZpbmVyLmpzIiwic3JjL3JlZmluZXJzL092ZXJsYXBSZW1vdmFsUmVmaW5lci5qcyIsInNyYy9yZWZpbmVycy9VUy9Eb2xsYXJTaWduRXh0cmFjdFJlZmluZXIuanMiLCJzcmMvcmVmaW5lcnMvcmVmaW5lci5qcyIsInNyYy9yZXN1bHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbnZhciBHZW5lcmFsTnVtYmVyUGFyc2VyID0gcmVxdWlyZSgnLi9wYXJzZXJzL0dlbmVyYWxOdW1iZXJQYXJzZXInKS5QYXJzZXI7XG52YXIgSlBOdW1iZXJQYXJzZXIgPSByZXF1aXJlKCcuL3BhcnNlcnMvSlAvSlBOdW1iZXJQYXJzZXInKS5QYXJzZXI7XG5cbnZhciBKUFVuaXRFeHRyYWN0UmVmaW5lciAgICA9IHJlcXVpcmUoJy4vcmVmaW5lcnMvSlAvSlBVbml0RXh0cmFjdFJlZmluZXInKS5SZWZpbmVyO1xudmFyIEpQWWVuU2lnbkV4dHJhY3RSZWZpbmVyICAgID0gcmVxdWlyZSgnLi9yZWZpbmVycy9KUC9KUFllblNpZ25FeHRyYWN0UmVmaW5lcicpLlJlZmluZXI7XG52YXIgRG9sbGFyU2lnbkV4dHJhY3RSZWZpbmVyID0gcmVxdWlyZSgnLi9yZWZpbmVycy9VUy9Eb2xsYXJTaWduRXh0cmFjdFJlZmluZXInKS5SZWZpbmVyO1xuXG52YXIgTWVyZ2VSYW5nZVJlZmluZXIgPSByZXF1aXJlKCcuL3JlZmluZXJzL01lcmdlUmFuZ2VSZWZpbmVyJykuUmVmaW5lcjtcbnZhciBPdmVybGFwUmVtb3ZhbFJlZmluZXIgPSByZXF1aXJlKCcuL3JlZmluZXJzL092ZXJsYXBSZW1vdmFsUmVmaW5lcicpLlJlZmluZXI7XG5cbmV4cG9ydHMuc3RyaWN0T3B0aW9uID0gZnVuY3Rpb24gKCkge1xuXG4gICAgcmV0dXJuIGV4cG9ydHMuZ2VuZXJhbE9wdGlvbigpO1xufTtcblxuZXhwb3J0cy5nZW5lcmFsT3B0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhcnNlcnM6IFtcbiAgICAgICAgICAgIG5ldyBHZW5lcmFsTnVtYmVyUGFyc2VyKCksXG4gICAgICAgICAgICBuZXcgSlBOdW1iZXJQYXJzZXIoKVxuICAgICAgICBdLFxuICAgICAgICByZWZpbmVyczogW1xuICAgICAgICAgICAgbmV3IERvbGxhclNpZ25FeHRyYWN0UmVmaW5lcigpLFxuICAgICAgICAgICAgbmV3IEpQVW5pdEV4dHJhY3RSZWZpbmVyKCksXG4gICAgICAgICAgICBuZXcgSlBZZW5TaWduRXh0cmFjdFJlZmluZXIoKSxcbiAgICAgICAgICAgIG5ldyBNZXJnZVJhbmdlUmVmaW5lcigpLFxuICAgICAgICAgICAgbmV3IE92ZXJsYXBSZW1vdmFsUmVmaW5lcigpXG4gICAgICAgIF1cbiAgICB9XG59XG5cblxuIiwiLypcbiAgICBcbiAgICBcbiovXG5cbnZhciBQYXJzZXIgPSByZXF1aXJlKCcuL3BhcnNlcicpLlBhcnNlcjtcbnZhciBQYXJzZWRSZXN1bHQgPSByZXF1aXJlKCcuLi9yZXN1bHQnKS5QYXJzZWRSZXN1bHQ7XG5cbnZhciBQQVRURVJOID0gbmV3IFJlZ0V4cCgnKF58W15cXGRdKScgKyBcbiAgICAnKCcgKyBcbiAgICAgICAgJ1xcXFxkezEsM30nICtcbiAgICAgICAgJyg/OicgK1xuICAgICAgICAgICAgJyg/OixcXFxcZHszfSkqfFxcXFxkKycgK1xuICAgICAgICAnKScgK1xuICAgICAgICAnKD86XFxcXC5cXFxcZCspPycgKyBcbiAgICAnKSg/IVxcXFxkKScsICdpJyk7XG5cbmV4cG9ydHMuUGFyc2VyID0gZnVuY3Rpb24gR2VuZXJhbE51bWJlclBhcnNlcigpe1xuICAgIFxuICAgIFBhcnNlci5jYWxsKHRoaXMpO1xuICAgICAgICBcbiAgICB0aGlzLnBhdHRlcm4gPSBmdW5jdGlvbigpIHsgcmV0dXJuIFBBVFRFUk47IH1cbiAgICBcbiAgICB0aGlzLmV4dHJhY3QgPSBmdW5jdGlvbih0ZXh0LCBtYXRjaCwgb3B0KXsgXG4gICAgICAgIFxuICAgICAgICB2YXIgbnVtYmVyID0gbWF0Y2hbMl07XG4gICAgICAgIG51bWJlciA9IG51bWJlci5yZXBsYWNlKCcsJywgJycpO1xuICAgICAgICBudW1iZXIgPSBwYXJzZUZsb2F0KG51bWJlcik7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZWRSZXN1bHQoe1xuICAgICAgICAgICAgdGV4dDogbWF0Y2hbMl0sXG4gICAgICAgICAgICBpbmRleDogbWF0Y2guaW5kZXggKyBtYXRjaFsxXS5sZW5ndGgsXG4gICAgICAgICAgICBudW1iZXI6IG51bWJlcixcbiAgICAgICAgICAgIHRhZzogJ0dlbmVyYWxOdW1iZXJQYXJzZXInXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuIiwiLypcbiAgICBcbiAgICBcbiovXG5cblxudmFyIHV0aWwgICA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIFBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcicpLlBhcnNlcjtcbnZhciBQYXJzZWRSZXN1bHQgPSByZXF1aXJlKCcuLi8uLi9yZXN1bHQnKS5QYXJzZWRSZXN1bHQ7XG5cbnZhciBQQVRURVJOID0gLyhb77yRLe+8mV17MSwzfSgsW++8kC3vvJldezN9KSooXFwuW++8kC3vvJldKik/KS87XG5cbmV4cG9ydHMuUGFyc2VyID0gZnVuY3Rpb24gSlBOdW1iZXJQYXJzZXIoKXtcbiAgICBcbiAgICBQYXJzZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgXG4gICAgdGhpcy5wYXR0ZXJuID0gZnVuY3Rpb24oKSB7IHJldHVybiBQQVRURVJOOyB9XG5cbiAgICB0aGlzLmV4dHJhY3QgPSBmdW5jdGlvbih0ZXh0LCBtYXRjaCwgb3B0KXsgXG5cbiAgICAgICAgdmFyIG51bWJlciA9IG1hdGNoWzFdO1xuICAgICAgICBudW1iZXIgPSB1dGlsLnplbmtha3VUb0hhbmtha3UobnVtYmVyKTtcbiAgICAgICAgbnVtYmVyID0gbnVtYmVyLnJlcGxhY2UoJywnLCAnJyk7XG4gICAgICAgIG51bWJlciA9IHBhcnNlRmxvYXQobnVtYmVyKTtcblxuICAgICAgICBpZiAobWF0Y2hbMl0gPT0gJ+S4hycpIHtcbiAgICAgICAgICAgIG51bWJlciAqPSAxMDAwMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2hbMl0gPT0gJ+WNgycpIHtcbiAgICAgICAgICAgIG51bWJlciAqPSAxMDAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaFsyXSA9PSAn5YSEJykge1xuICAgICAgICAgICAgbnVtYmVyICo9IDEwMDAwMDAwMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUGFyc2VkUmVzdWx0KHtcbiAgICAgICAgICAgIHRleHQ6IG1hdGNoWzBdLFxuICAgICAgICAgICAgaW5kZXg6IG1hdGNoLmluZGV4LFxuICAgICAgICAgICAgbnVtYmVyOiBudW1iZXIsXG4gICAgICAgICAgICB0YWc6ICdKUE51bWJlclBhcnNlcidcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4iLCIvKlxuICAgIFxuICAgIFxuKi9cblxudmFyIGhhbmtha3UgPSAnMTIzNDU2Nzg5MGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVogJztcbnZhciB6ZW5rYWt1ID0gJ++8ke+8ku+8k++8lO+8le+8lu+8l++8mO+8me+8kO+9ge+9gu+9g++9hO+9he+9hu+9h++9iO+9ie+9iu+9i++9jO+9je+9ju+9j++9kO+9ke+9ku+9k++9lO+9le+9lu+9l++9mO+9me+9mu+8oe+8ou+8o++8pO+8pe+8pu+8p++8qO+8qe+8qu+8q++8rO+8re+8ru+8r++8sO+8se+8su+8s++8tO+8te+8tu+8t++8uO+8ue+8uuOAgCc7XG5cbmV4cG9ydHMuemVua2FrdVRvSGFua2FrdSA9IGZ1bmN0aW9uICh3b3JkKSB7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gemVua2FrdS5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICB3b3JkID0gd29yZC5yZXBsYWNlKG5ldyBSZWdFeHAoemVua2FrdVtpXSwgJ2dtJyksIGhhbmtha3VbaV0pO1xuICB9XG4gIHJldHVybiB3b3JkLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTsgLy8gdHJpbSBoZWFkIGFuZCB0YWlsIHdoaXRlIHNwYWNlXG59O1xuXG5leHBvcnRzLmhhbmtha3VUb1plbmtha3UgPSBmdW5jdGlvbiAod29yZCkge1xuICBmb3IgKHZhciBpID0gMCwgbiA9IGhhbmtha3UubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgd29yZCA9IHdvcmQucmVwbGFjZShuZXcgUmVnRXhwKGhhbmtha3VbaV0sICdnbScpLCB6ZW5rYWt1W2ldKTtcbiAgfVxuICByZXR1cm4gd29yZC5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7IC8vIHRyaW0gaGVhZCBhbmQgdGFpbCB3aGl0ZSBzcGFjZVxufTtcblxuIiwiXG5mdW5jdGlvbiBQYXJzZXIoKSB7XG5cbiAgICB0aGlzLnBhdHRlcm4gPSBmdW5jdGlvbigpIHsgcmV0dXJuIC8uL2k7IH1cblxuICAgIHRoaXMuZXh0cmFjdCA9IGZ1bmN0aW9uKHRleHQsIG1hdGNoLCBvcHQpeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24odGV4dCwgb3B0KSB7XG5cbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgdmFyIHJlZ2V4ID0gdGhpcy5wYXR0ZXJuKCk7XG5cbiAgICAgICAgdmFyIHJlbWFpbmluZ1RleHQgPSB0ZXh0O1xuICAgICAgICB2YXIgbWF0Y2ggPSByZWdleC5leGVjKHJlbWFpbmluZ1RleHQpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuXG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgbWF0Y2ggaW5kZXggb24gdGhlIGZ1bGwgdGV4dDtcbiAgICAgICAgICAgIG1hdGNoLmluZGV4ICs9IHRleHQubGVuZ3RoIC0gcmVtYWluaW5nVGV4dC5sZW5ndGg7XG5cbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB0aGlzLmV4dHJhY3QodGV4dCwgbWF0Y2gsIG9wdCk7XG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgc3VjY2Vzcywgc3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSByZXN1bHRcbiAgICAgICAgICAgICAgICByZW1haW5pbmdUZXh0ID0gdGV4dC5zdWJzdHJpbmcocmVzdWx0LmluZGV4ICsgcmVzdWx0LnRleHQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgZmFpbCwgbW92ZSBvbiBieSAxXG4gICAgICAgICAgICAgICAgcmVtYWluaW5nVGV4dCA9IHRleHQuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdGNoID0gcmVnZXguZXhlYyhyZW1haW5pbmdUZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlZmluZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnJlZmluZXJzLmZvckVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdHMgPSByZWZpbmVyLnJlZmluZShyZXN1bHRzLCB0ZXh0LCBvcHRpb25zKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxufVxuXG5leHBvcnRzLlBhcnNlciA9IFBhcnNlcjtcbiIsIlxudmFyIFBlbm55ID0gZnVuY3Rpb24ob3B0aW9uKSB7XG5cbiAgICB0aGlzLm9wdGlvbiA9IG9wdGlvbjtcbiAgICB0aGlzLnBhcnNlcnMgPSBuZXcgT2JqZWN0KG9wdGlvbi5wYXJzZXJzKTtcbiAgICB0aGlzLnJlZmluZXJzID0gbmV3IE9iamVjdChvcHRpb24ucmVmaW5lcnMpO1xufVxuXG5QZW5ueS5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbih0ZXh0LCBvcHQpIHtcblxuICAgIG9wdCA9IG9wdCB8fCB7fTtcblxuICAgIHZhciBhbGxSZXN1bHRzID0gW107XG5cbiAgICB0aGlzLnBhcnNlcnMuZm9yRWFjaChmdW5jdGlvbiAocGFyc2VyKSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gcGFyc2VyLmV4ZWN1dGUodGV4dCwgb3B0KTtcbiAgICAgICAgYWxsUmVzdWx0cyA9IGFsbFJlc3VsdHMuY29uY2F0KHJlc3VsdHMpO1xuICAgIH0pO1xuICAgIFxuICAgIGFsbFJlc3VsdHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLmluZGV4IC0gYi5pbmRleDtcbiAgICB9KTtcblxuICAgIHRoaXMucmVmaW5lcnMuZm9yRWFjaChmdW5jdGlvbiAocmVmaW5lcikge1xuICAgICAgICBhbGxSZXN1bHRzID0gcmVmaW5lci5yZWZpbmUodGV4dCwgYWxsUmVzdWx0cywgb3B0KTtcbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gYWxsUmVzdWx0cztcbn07XG5cbmV4cG9ydHMuUGVubnkgPSBQZW5ueTtcbmV4cG9ydHMuUGFyc2VyID0gcmVxdWlyZSgnLi9wYXJzZXJzL3BhcnNlcicpLlBhcnNlcjtcbmV4cG9ydHMuUmVmaW5lciA9IHJlcXVpcmUoJy4vcmVmaW5lcnMvcmVmaW5lcicpLkZpbHRlcjtcbmV4cG9ydHMuRmlsdGVyID0gcmVxdWlyZSgnLi9yZWZpbmVycy9yZWZpbmVyJykuRmlsdGVyO1xuZXhwb3J0cy5QYXJzZWRSZXN1bHQgPSByZXF1aXJlKCcuL3Jlc3VsdCcpLlBhcnNlZFJlc3VsdDtcblxuZXhwb3J0cy5vcHRpb25zID0gcmVxdWlyZSgnLi9vcHRpb25zJyk7XG5cbmV4cG9ydHMuc3RyaWN0ID0gbmV3IFBlbm55KGV4cG9ydHMub3B0aW9ucy5zdHJpY3RPcHRpb24oKSk7XG5leHBvcnRzLmdlbmVyYWwgPSBuZXcgUGVubnkoZXhwb3J0cy5vcHRpb25zLmdlbmVyYWxPcHRpb24oKSk7XG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuZ2VuZXJhbC5wYXJzZS5hcHBseShleHBvcnRzLmdlbmVyYWwsIGFyZ3VtZW50cyk7XG59XG4iLCIvKlxuICBcbiovXG52YXIgUmVmaW5lciA9IHJlcXVpcmUoJy4uL3JlZmluZXInKS5SZWZpbmVyO1xuXG52YXIgUE9TVEZJWF9VTklUX1NJR05fUEFUVEVSTiA9IC9eXFxzKijkuId85Y2DfOWEhCkvO1xuXG5leHBvcnRzLlJlZmluZXIgPSBmdW5jdGlvbiBKUFVuaXRFeHRyYWN0UmVmaW5lcigpIHtcbiAgICBSZWZpbmVyLmNhbGwodGhpcyk7XG4gICAgXG4gICAgdGhpcy5yZWZpbmUgPSBmdW5jdGlvbih0ZXh0LCByZXN1bHRzLCBvcHQpIHtcbiAgICAgICAgXG4gICAgICAgIHJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbihyZXN1bHQpIHtcblxuICAgICAgICAgICAgdmFyIHRleHRBZnRlciA9IHRleHQuc3Vic3RyaW5nKHJlc3VsdC5pbmRleCArIHJlc3VsdC50ZXh0Lmxlbmd0aCk7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBQT1NURklYX1VOSVRfU0lHTl9QQVRURVJOLmV4ZWModGV4dEFmdGVyKTtcbiAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC50ZXh0ICA9IHJlc3VsdC50ZXh0ICsgbWF0Y2hbMF07XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoWzFdID09ICfkuIcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5udW1iZXIgKj0gMTAwMDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChtYXRjaFsxXSA9PSAn5Y2DJykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQubnVtYmVyICo9IDEwMDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChtYXRjaFsxXSA9PSAn5YSEJykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQubnVtYmVyICo9IDEwMDAwMDAwMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbn1cbiIsIi8qXG4gIFxuKi9cbnZhciBSZWZpbmVyID0gcmVxdWlyZSgnLi4vcmVmaW5lcicpLlJlZmluZXI7XG5cbnZhciBQUkVGSVhfWUVOX1NJR05fUEFUVEVSTiA9IC8owqV877+lKVxccyokLztcbnZhciBQT1NURklYX1lFTl9TSUdOX1BBVFRFUk4gPSAvXlxccyrlhoYvO1xuXG5leHBvcnRzLlJlZmluZXIgPSBmdW5jdGlvbiBKUFllblNpZ25FeHRyYWN0UmVmaW5lcigpIHtcbiAgICBSZWZpbmVyLmNhbGwodGhpcyk7XG4gICAgXG4gICAgdGhpcy5yZWZpbmUgPSBmdW5jdGlvbih0ZXh0LCByZXN1bHRzLCBvcHQpIHtcbiAgICAgICAgXG4gICAgICAgIHJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHRleHRCZWZvcmUgPSB0ZXh0LnN1YnN0cmluZygwLCByZXN1bHQuaW5kZXgpO1xuICAgICAgICAgICAgdmFyIG1hdGNoID0gUFJFRklYX1lFTl9TSUdOX1BBVFRFUk4uZXhlYyh0ZXh0QmVmb3JlKTtcbiAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC50ZXh0ICA9IG1hdGNoWzBdICsgcmVzdWx0LnRleHQ7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmluZGV4ID0gbWF0Y2guaW5kZXg7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmN1cnJlbmN5ID0gJ0pQWSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0ZXh0QWZ0ZXIgPSB0ZXh0LnN1YnN0cmluZyhyZXN1bHQuaW5kZXggKyByZXN1bHQudGV4dC5sZW5ndGgpO1xuICAgICAgICAgICAgdmFyIG1hdGNoID0gUE9TVEZJWF9ZRU5fU0lHTl9QQVRURVJOLmV4ZWModGV4dEFmdGVyKTtcbiAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC50ZXh0ICA9IHJlc3VsdC50ZXh0ICsgbWF0Y2hbMF07XG4gICAgICAgICAgICAgICAgcmVzdWx0LmN1cnJlbmN5ID0gJ0pQWSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbn1cbiIsIi8qXG4gIFxuKi9cbnZhciBSZWZpbmVyID0gcmVxdWlyZSgnLi9yZWZpbmVyJykuUmVmaW5lcjtcblxudmFyIFBBVFRFUk4gPSBuZXcgUmVnRXhwKFwiXlxcXFxzKihhbmR8dG98LXx+fOODvHzjgJx8772eKT9cXFxccyokXCIpO1xuXG5mdW5jdGlvbiBpc0FibGVUb01lcmdlKHRleHQsIHByZXZSZXN1bHQsIGN1clJlc3VsdCl7XG5cbiAgICB2YXIgdGV4dEJldHdlZW4gPSB0ZXh0LnN1YnN0cmluZyhwcmV2UmVzdWx0LmluZGV4ICsgcHJldlJlc3VsdC50ZXh0Lmxlbmd0aCwgY3VyUmVzdWx0LmluZGV4KTtcbiAgICByZXR1cm4gdGV4dEJldHdlZW4ubGVuZ3RoID4gMCAmJiB0ZXh0QmV0d2Vlbi5tYXRjaChQQVRURVJOKTtcbn1cblxuXG5mdW5jdGlvbiBtZXJnZVJlc3VsdCh0ZXh0LCBmcm9tUmVzdWx0LCB0b1Jlc3VsdCkge1xuXG4gICAgZnJvbVJlc3VsdCA9IGZyb21SZXN1bHQuY2xvbmUoKTtcbiAgICBmcm9tUmVzdWx0Lm51bWJlck1heCA9IE1hdGgubWF4KHRvUmVzdWx0Lm51bWJlciwgZnJvbVJlc3VsdC5udW1iZXIpO1xuICAgIGZyb21SZXN1bHQubnVtYmVyTWluID0gTWF0aC5taW4odG9SZXN1bHQubnVtYmVyLCBmcm9tUmVzdWx0Lm51bWJlcik7XG4gICAgZnJvbVJlc3VsdC5udW1iZXIgPSBmcm9tUmVzdWx0Lm51bWJlck1pbjtcblxuICAgIHZhciBzdGFydEluZGV4ID0gTWF0aC5taW4oZnJvbVJlc3VsdC5pbmRleCwgdG9SZXN1bHQuaW5kZXgpO1xuICAgIHZhciBlbmRJbmRleCA9IE1hdGgubWF4KFxuICAgICAgICAgICAgICAgIGZyb21SZXN1bHQuaW5kZXggKyBmcm9tUmVzdWx0LnRleHQubGVuZ3RoLCBcbiAgICAgICAgICAgICAgICB0b1Jlc3VsdC5pbmRleCArIHRvUmVzdWx0LnRleHQubGVuZ3RoKTtcblxuICAgIGZyb21SZXN1bHQuaW5kZXggPSBzdGFydEluZGV4O1xuICAgIGZyb21SZXN1bHQudGV4dCAgPSB0ZXh0LnN1YnN0cmluZyhzdGFydEluZGV4LCBlbmRJbmRleCk7XG5cbiAgICBmb3IgKHZhciB0YWcgaW4gdG9SZXN1bHQudGFncykge1xuICAgICAgICBmcm9tUmVzdWx0LnRhZ3NbdGFnXSA9IHRvUmVzdWx0LnRhZ3NbdGFnXTtcbiAgICB9XG5cbiAgICBmcm9tUmVzdWx0LnRhZ3NbJ01lcmdlUmFuZ2VSZXN1bHQnXSA9IHRydWU7XG4gICAgcmV0dXJuIGZyb21SZXN1bHQ7XG59XG5cbmV4cG9ydHMuUmVmaW5lciA9IGZ1bmN0aW9uIE1lcmdlUmFuZ2VSZXN1bHQoKSB7XG5cdFJlZmluZXIuY2FsbCh0aGlzKTtcblx0XG5cdHRoaXMucmVmaW5lID0gZnVuY3Rpb24odGV4dCwgcmVzdWx0cywgb3B0KSB7IFxuXG4gICAgICAgIGlmIChyZXN1bHRzLmxlbmd0aCA8IDIpIHJldHVybiByZXN1bHRzO1xuICAgICAgICBcbiAgICAgICAgdmFyIG1lcmdlZFJlc3VsdCA9IFtdXG4gICAgICAgIHZhciBjdXJyUmVzdWx0ID0gbnVsbDtcbiAgICAgICAgdmFyIHByZXZSZXN1bHQgPSBudWxsO1xuICAgICAgICBcbiAgICAgICAgZm9yICh2YXIgaT0xOyBpPHJlc3VsdHMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgY3VyclJlc3VsdCA9IHJlc3VsdHNbaV07XG4gICAgICAgICAgICBwcmV2UmVzdWx0ID0gcmVzdWx0c1tpLTFdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIXByZXZSZXN1bHQubnVtYmVyTWluICYmICFjdXJyUmVzdWx0Lm51bWJlck1heCBcbiAgICAgICAgICAgICAgICAmJiBpc0FibGVUb01lcmdlKHRleHQsIHByZXZSZXN1bHQsIGN1cnJSZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgcHJldlJlc3VsdCA9IG1lcmdlUmVzdWx0KHRleHQsIHByZXZSZXN1bHQsIGN1cnJSZXN1bHQpO1xuICAgICAgICAgICAgICAgIGN1cnJSZXN1bHQgPSBudWxsO1xuICAgICAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbWVyZ2VkUmVzdWx0LnB1c2gocHJldlJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChjdXJyUmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIG1lcmdlZFJlc3VsdC5wdXNoKGN1cnJSZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1lcmdlZFJlc3VsdDtcbiAgICB9XG59IiwiLypcbiAgXG4qL1xudmFyIFJlZmluZXIgPSByZXF1aXJlKCcuL3JlZmluZXInKS5SZWZpbmVyO1xuXG5leHBvcnRzLlJlZmluZXIgPSBmdW5jdGlvbiBPdmVybGFwUmVtb3ZhbFJlZmluZXIoKSB7XG5cdFJlZmluZXIuY2FsbCh0aGlzKTtcblx0XG5cblx0dGhpcy5yZWZpbmUgPSBmdW5jdGlvbih0ZXh0LCByZXN1bHRzLCBvcHQpIHsgXG5cbiAgICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoIDwgMikgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIFxuICAgICAgICB2YXIgZmlsdGVyZWRSZXN1bHRzID0gW107XG4gICAgICAgIHZhciBwcmV2UmVzdWx0ID0gcmVzdWx0c1swXTtcbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGk9MTsgaTxyZXN1bHRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHJlc3VsdHNbaV07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIElmIG92ZXJsYXAsIGNvbXBhcmUgdGhlIGxlbmd0aCBhbmQgZGlzY2FyZCB0aGUgc2hvcnRlciBvbmVcbiAgICAgICAgICAgIGlmIChyZXN1bHQuaW5kZXggPCBwcmV2UmVzdWx0LmluZGV4ICsgcHJldlJlc3VsdC50ZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQudGV4dC5sZW5ndGggPiBwcmV2UmVzdWx0LnRleHQubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICAgICAgcHJldlJlc3VsdCA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkUmVzdWx0cy5wdXNoKHByZXZSZXN1bHQpO1xuICAgICAgICAgICAgICAgIHByZXZSZXN1bHQgPSByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIFRoZSBsYXN0IG9uZVxuICAgICAgICBpZiAocHJldlJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgICAgICBmaWx0ZXJlZFJlc3VsdHMucHVzaChwcmV2UmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkUmVzdWx0cztcbiAgICB9XG59IiwiLypcbiAgXG4qL1xudmFyIFJlZmluZXIgPSByZXF1aXJlKCcuLi9yZWZpbmVyJykuUmVmaW5lcjtcblxudmFyIFBSRUZJWF9ET0xMQVJfU0lHTl9QQVRURVJOID0gL1xcJFxccyokLztcblxuZXhwb3J0cy5SZWZpbmVyID0gZnVuY3Rpb24gVVNEb2xsYXJTaWduRXh0cmFjdFJlZmluZXIoKSB7XG4gICAgUmVmaW5lci5jYWxsKHRoaXMpO1xuICAgIFxuICAgIHRoaXMucmVmaW5lID0gZnVuY3Rpb24odGV4dCwgcmVzdWx0cywgb3B0KSB7XG5cbiAgICAgICAgcmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uKHJlc3VsdCkge1xuXG4gICAgICAgICAgICB2YXIgdGV4dEJlZm9yZSA9IHRleHQuc3Vic3RyaW5nKDAsIHJlc3VsdC5pbmRleCk7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBQUkVGSVhfRE9MTEFSX1NJR05fUEFUVEVSTi5leGVjKHRleHRCZWZvcmUpO1xuICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnRleHQgID0gbWF0Y2hbMF0gKyByZXN1bHQudGV4dDtcbiAgICAgICAgICAgICAgICByZXN1bHQuaW5kZXggPSBtYXRjaC5pbmRleDtcbiAgICAgICAgICAgICAgICByZXN1bHQuY3VycmVuY3kgPSAnVVNEJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxufVxuIiwiLypcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgXG4qL1xuZXhwb3J0cy5SZWZpbmVyID0gZnVuY3Rpb24gUmVmaW5lcigpIHsgXG5cbiAgICB0aGlzLnJlZmluZSA9IGZ1bmN0aW9uKHRleHQsIHJlc3VsdHMsIG9wdCkgeyByZXR1cm4gcmVzdWx0czsgfTtcbn1cblxuZXhwb3J0cy5GaWx0ZXIgPSBmdW5jdGlvbiBGaWx0ZXIoKSB7IFxuICAgIFxuICAgIFJlZmluZXIuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuaXNWYWxpZCA9IGZ1bmN0aW9uKHRleHQsIHJlc3VsdCwgb3B0KSB7IHJldHVybiB0cnVlOyB9XG4gICAgdGhpcy5yZWZpbmUgPSBmdW5jdGlvbih0ZXh0LCByZXN1bHRzLCBvcHQpIHsgXG5cbiAgICAgICAgdmFyIGZpbHRlcmVkUmVzdWx0ID0gW107XG4gICAgICAgIGZvciAodmFyIGk9MDsgaT1yZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzVmFsaWQocmVzdWx0c1tpXSkpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZFJlc3VsdC5wdXNoKHJlc3VsdHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkUmVzdWx0O1xuICAgIH1cbn0iLCJcbmZ1bmN0aW9uIFBhcnNlZFJlc3VsdChyZXN1bHQpe1xuXG4gICAgcmVzdWx0ID0gcmVzdWx0IHx8IHt9O1xuXG4gICAgdGhpcy5pbmRleCA9IHJlc3VsdC5pbmRleDtcbiAgICB0aGlzLnRleHQgID0gcmVzdWx0LnRleHQ7XG4gICAgXG4gICAgdGhpcy5udW1iZXIgPSByZXN1bHQubnVtYmVyO1xuICAgIHRoaXMubnVtYmVyTWluID0gcmVzdWx0Lm51bWJlck1pbjtcbiAgICB0aGlzLm51bWJlck1heCA9IHJlc3VsdC5udW1iZXJNYXg7XG4gICAgdGhpcy5jdXJyZW5jeSA9IHJlc3VsdC5jdXJyZW5jeTtcblxuICAgIHRoaXMudGFncyA9IHJlc3VsdC50YWdzIHx8IHt9O1xuICAgIGlmIChyZXN1bHQudGFnKSB7XG4gICAgXHR0aGlzLnRhZ3NbcmVzdWx0LnRhZ10gPSB0cnVlO1xuICAgIH1cbn1cblxuUGFyc2VkUmVzdWx0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUGFyc2VkUmVzdWx0KHRoaXMpO1xufVxuXG5leHBvcnRzLlBhcnNlZFJlc3VsdCA9IFBhcnNlZFJlc3VsdDsiXX0=
