!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.penny=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var USDollarSignParser = require('./parsers/US/USDollarSignParser').Parser;

var JPYenSignParser = require('./parsers/JP/JPYenSignParser').Parser;
var JPYenSignWithCommaParser = require('./parsers/JP/JPYenSignWithCommaParser').Parser;

var GeneralNumberParser = require('./parsers/GeneralNumberParser').Parser;

var MergeRangeRefiner = require('./refiners/MergeRangeRefiner').Refiner;
var OverlapRemovalRefiner = require('./refiners/OverlapRemovalRefiner').Refiner;

exports.strictOptions = function () {
    return {
        parsers: [
        	new USDollarSignParser(),
        	new JPYenSignParser()
        ],
        refiners: [
            new MergeRangeRefiner(),
            new OverlapRemovalRefiner()
        ]
    }
};

exports.generalOptions = function () {

	var options = exports.strictOptions();
	options.parsers.push(new GeneralNumberParser());

	return options;
}



},{"./parsers/GeneralNumberParser":2,"./parsers/JP/JPYenSignParser":3,"./parsers/JP/JPYenSignWithCommaParser":4,"./parsers/US/USDollarSignParser":6,"./refiners/MergeRangeRefiner":9,"./refiners/OverlapRemovalRefiner":10}],2:[function(require,module,exports){
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


},{"../result":12,"./parser":7}],3:[function(require,module,exports){
/*
    
    
*/


var util = require('./util');
var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;

var PATTERN = /([０-９\d]+)(万|千|億)?円/;

exports.Parser = function JPYenSignParser(){
    
    Parser.call(this);
        
    this.pattern = function() { return PATTERN; }
    
    this.extract = function(text, match, opt){ 
        
        var number = match[1];
        number = util.zenkakuToHankaku(number);
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
        	currency: 'JP',
            tag: 'JPYenSignParser'
        });
    }
}


},{"../../result":12,"../parser":7,"./util":5}],4:[function(require,module,exports){
/*
    
    
*/


var util = require('./util');
var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;

var PATTERN = /([1-9１-９]{1,3}(,[０-９\d]{3})*(\.[０-９\d]*)?)(万|千|億)?円/;

exports.Parser = function JPYenSignWithCommaParser(){
    
    Parser.call(this);
        
    this.pattern = function() { return PATTERN; }

    this.extract = function(text, match, opt){ 

        var number = match[1];
        number = util.zenkakuToHankaku(number);
        number = number.replace.replace(',', '');
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
            currency: 'JP',
            tag: 'JPYenSignWithCommaParser'
        });
    }
}


},{"../../result":12,"../parser":7,"./util":5}],5:[function(require,module,exports){
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


},{}],6:[function(require,module,exports){
/*
    
    
*/

var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;

var PATTERN = /\$\s*(\d{1,3}(,\d{3})*(\.\d*)?)/;

exports.Parser = function USDollarSignParser(){
    
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
        	currency: 'US',
            tag: 'USDollarSignParser'
        });
    }
}


},{"../../result":12,"../parser":7}],7:[function(require,module,exports){

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

},{}],8:[function(require,module,exports){

var Penny = function(options) {

    this.options = options;
    this.parsers = new Object(options.parsers);
    this.refiners = new Object(options.refiners);
}

Penny.prototype.parse = function(text, opt) {

    opt = opt || {};

    var allResults = [];

    this.parsers.forEach(function (parser) {
        var results = parser.execute(text, opt);
        allResults = allResults.concat(results);
    });
    
    // Sort allResults
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

exports.strict = new Penny(exports.options.strictOptions());
exports.general = new Penny(exports.options.generalOptions());

exports.parse = function () {
    return exports.general.parse.apply(exports.general, arguments);
}

},{"./options":1,"./parsers/parser":7,"./refiners/refiner":11,"./result":12}],9:[function(require,module,exports){
/*
  
*/
var Refiner = require('./refiner').Refiner;

var PATTERN = new RegExp("^\\s*(and|to|-|~|ー|〜)?\\s*$");

function isAbleToMerge(text, prevResult, curResult){
    
    var textBetween = text.substring(prevResult.index + prevResult.text.length, curResult.index);
    return textBetween.match(PATTERN);
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
},{"./refiner":11}],10:[function(require,module,exports){
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
},{"./refiner":11}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){

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
},{}]},{},[8])(8)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvb3B0aW9ucy5qcyIsInNyYy9wYXJzZXJzL0dlbmVyYWxOdW1iZXJQYXJzZXIuanMiLCJzcmMvcGFyc2Vycy9KUC9KUFllblNpZ25QYXJzZXIuanMiLCJzcmMvcGFyc2Vycy9KUC9KUFllblNpZ25XaXRoQ29tbWFQYXJzZXIuanMiLCJzcmMvcGFyc2Vycy9KUC91dGlsLmpzIiwic3JjL3BhcnNlcnMvVVMvVVNEb2xsYXJTaWduUGFyc2VyLmpzIiwic3JjL3BhcnNlcnMvcGFyc2VyLmpzIiwic3JjL3Blbm55LmpzIiwic3JjL3JlZmluZXJzL01lcmdlUmFuZ2VSZWZpbmVyLmpzIiwic3JjL3JlZmluZXJzL092ZXJsYXBSZW1vdmFsUmVmaW5lci5qcyIsInNyYy9yZWZpbmVycy9yZWZpbmVyLmpzIiwic3JjL3Jlc3VsdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG52YXIgVVNEb2xsYXJTaWduUGFyc2VyID0gcmVxdWlyZSgnLi9wYXJzZXJzL1VTL1VTRG9sbGFyU2lnblBhcnNlcicpLlBhcnNlcjtcblxudmFyIEpQWWVuU2lnblBhcnNlciA9IHJlcXVpcmUoJy4vcGFyc2Vycy9KUC9KUFllblNpZ25QYXJzZXInKS5QYXJzZXI7XG52YXIgSlBZZW5TaWduV2l0aENvbW1hUGFyc2VyID0gcmVxdWlyZSgnLi9wYXJzZXJzL0pQL0pQWWVuU2lnbldpdGhDb21tYVBhcnNlcicpLlBhcnNlcjtcblxudmFyIEdlbmVyYWxOdW1iZXJQYXJzZXIgPSByZXF1aXJlKCcuL3BhcnNlcnMvR2VuZXJhbE51bWJlclBhcnNlcicpLlBhcnNlcjtcblxudmFyIE1lcmdlUmFuZ2VSZWZpbmVyID0gcmVxdWlyZSgnLi9yZWZpbmVycy9NZXJnZVJhbmdlUmVmaW5lcicpLlJlZmluZXI7XG52YXIgT3ZlcmxhcFJlbW92YWxSZWZpbmVyID0gcmVxdWlyZSgnLi9yZWZpbmVycy9PdmVybGFwUmVtb3ZhbFJlZmluZXInKS5SZWZpbmVyO1xuXG5leHBvcnRzLnN0cmljdE9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFyc2VyczogW1xuICAgICAgICBcdG5ldyBVU0RvbGxhclNpZ25QYXJzZXIoKSxcbiAgICAgICAgXHRuZXcgSlBZZW5TaWduUGFyc2VyKClcbiAgICAgICAgXSxcbiAgICAgICAgcmVmaW5lcnM6IFtcbiAgICAgICAgICAgIG5ldyBNZXJnZVJhbmdlUmVmaW5lcigpLFxuICAgICAgICAgICAgbmV3IE92ZXJsYXBSZW1vdmFsUmVmaW5lcigpXG4gICAgICAgIF1cbiAgICB9XG59O1xuXG5leHBvcnRzLmdlbmVyYWxPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuXG5cdHZhciBvcHRpb25zID0gZXhwb3J0cy5zdHJpY3RPcHRpb25zKCk7XG5cdG9wdGlvbnMucGFyc2Vycy5wdXNoKG5ldyBHZW5lcmFsTnVtYmVyUGFyc2VyKCkpO1xuXG5cdHJldHVybiBvcHRpb25zO1xufVxuXG5cbiIsIi8qXG4gICAgXG4gICAgXG4qL1xuXG52YXIgUGFyc2VyID0gcmVxdWlyZSgnLi9wYXJzZXInKS5QYXJzZXI7XG52YXIgUGFyc2VkUmVzdWx0ID0gcmVxdWlyZSgnLi4vcmVzdWx0JykuUGFyc2VkUmVzdWx0O1xuXG52YXIgUEFUVEVSTiA9IC8oXFxkezEsM30oLFxcZHszfSkqKFxcLlxcZCopPykvO1xuXG5leHBvcnRzLlBhcnNlciA9IGZ1bmN0aW9uIEdlbmVyYWxOdW1iZXJQYXJzZXIoKXtcbiAgICBcbiAgICBQYXJzZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgXG4gICAgdGhpcy5wYXR0ZXJuID0gZnVuY3Rpb24oKSB7IHJldHVybiBQQVRURVJOOyB9XG4gICAgXG4gICAgdGhpcy5leHRyYWN0ID0gZnVuY3Rpb24odGV4dCwgbWF0Y2gsIG9wdCl7IFxuXG4gICAgICAgIHZhciBudW1iZXIgPSBtYXRjaFsxXTtcbiAgICAgICAgbnVtYmVyID0gbnVtYmVyLnJlcGxhY2UoJywnLCAnJyk7XG4gICAgICAgIG51bWJlciA9IHBhcnNlRmxvYXQobnVtYmVyKTtcblxuICAgICAgICByZXR1cm4gbmV3IFBhcnNlZFJlc3VsdCh7XG4gICAgICAgICAgICB0ZXh0OiBtYXRjaFswXSxcbiAgICAgICAgICAgIGluZGV4OiBtYXRjaC5pbmRleCxcbiAgICAgICAgICAgIG51bWJlcjogbnVtYmVyLFxuICAgICAgICAgICAgdGFnOiAnR2VuZXJhbE51bWJlclBhcnNlcidcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4iLCIvKlxuICAgIFxuICAgIFxuKi9cblxuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIFBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcicpLlBhcnNlcjtcbnZhciBQYXJzZWRSZXN1bHQgPSByZXF1aXJlKCcuLi8uLi9yZXN1bHQnKS5QYXJzZWRSZXN1bHQ7XG5cbnZhciBQQVRURVJOID0gLyhb77yQLe+8mVxcZF0rKSjkuId85Y2DfOWEhCk/5YaGLztcblxuZXhwb3J0cy5QYXJzZXIgPSBmdW5jdGlvbiBKUFllblNpZ25QYXJzZXIoKXtcbiAgICBcbiAgICBQYXJzZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgXG4gICAgdGhpcy5wYXR0ZXJuID0gZnVuY3Rpb24oKSB7IHJldHVybiBQQVRURVJOOyB9XG4gICAgXG4gICAgdGhpcy5leHRyYWN0ID0gZnVuY3Rpb24odGV4dCwgbWF0Y2gsIG9wdCl7IFxuICAgICAgICBcbiAgICAgICAgdmFyIG51bWJlciA9IG1hdGNoWzFdO1xuICAgICAgICBudW1iZXIgPSB1dGlsLnplbmtha3VUb0hhbmtha3UobnVtYmVyKTtcbiAgICAgICAgbnVtYmVyID0gcGFyc2VGbG9hdChudW1iZXIpO1xuXG4gICAgICAgIGlmIChtYXRjaFsyXSA9PSAn5LiHJykge1xuICAgICAgICAgICAgbnVtYmVyICo9IDEwMDAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaFsyXSA9PSAn5Y2DJykge1xuICAgICAgICAgICAgbnVtYmVyICo9IDEwMDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoWzJdID09ICflhIQnKSB7XG4gICAgICAgICAgICBudW1iZXIgKj0gMTAwMDAwMDAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZWRSZXN1bHQoe1xuICAgICAgICBcdHRleHQ6IG1hdGNoWzBdLFxuICAgICAgICBcdGluZGV4OiBtYXRjaC5pbmRleCxcbiAgICAgICAgXHRudW1iZXI6IG51bWJlcixcbiAgICAgICAgXHRjdXJyZW5jeTogJ0pQJyxcbiAgICAgICAgICAgIHRhZzogJ0pQWWVuU2lnblBhcnNlcidcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4iLCIvKlxuICAgIFxuICAgIFxuKi9cblxuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIFBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcicpLlBhcnNlcjtcbnZhciBQYXJzZWRSZXN1bHQgPSByZXF1aXJlKCcuLi8uLi9yZXN1bHQnKS5QYXJzZWRSZXN1bHQ7XG5cbnZhciBQQVRURVJOID0gLyhbMS0577yRLe+8mV17MSwzfSgsW++8kC3vvJlcXGRdezN9KSooXFwuW++8kC3vvJlcXGRdKik/KSjkuId85Y2DfOWEhCk/5YaGLztcblxuZXhwb3J0cy5QYXJzZXIgPSBmdW5jdGlvbiBKUFllblNpZ25XaXRoQ29tbWFQYXJzZXIoKXtcbiAgICBcbiAgICBQYXJzZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgXG4gICAgdGhpcy5wYXR0ZXJuID0gZnVuY3Rpb24oKSB7IHJldHVybiBQQVRURVJOOyB9XG5cbiAgICB0aGlzLmV4dHJhY3QgPSBmdW5jdGlvbih0ZXh0LCBtYXRjaCwgb3B0KXsgXG5cbiAgICAgICAgdmFyIG51bWJlciA9IG1hdGNoWzFdO1xuICAgICAgICBudW1iZXIgPSB1dGlsLnplbmtha3VUb0hhbmtha3UobnVtYmVyKTtcbiAgICAgICAgbnVtYmVyID0gbnVtYmVyLnJlcGxhY2UucmVwbGFjZSgnLCcsICcnKTtcbiAgICAgICAgbnVtYmVyID0gcGFyc2VGbG9hdChudW1iZXIpO1xuXG4gICAgICAgIGlmIChtYXRjaFsyXSA9PSAn5LiHJykge1xuICAgICAgICAgICAgbnVtYmVyICo9IDEwMDAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaFsyXSA9PSAn5Y2DJykge1xuICAgICAgICAgICAgbnVtYmVyICo9IDEwMDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoWzJdID09ICflhIQnKSB7XG4gICAgICAgICAgICBudW1iZXIgKj0gMTAwMDAwMDAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZWRSZXN1bHQoe1xuICAgICAgICAgICAgdGV4dDogbWF0Y2hbMF0sXG4gICAgICAgICAgICBpbmRleDogbWF0Y2guaW5kZXgsXG4gICAgICAgICAgICBudW1iZXI6IG51bWJlcixcbiAgICAgICAgICAgIGN1cnJlbmN5OiAnSlAnLFxuICAgICAgICAgICAgdGFnOiAnSlBZZW5TaWduV2l0aENvbW1hUGFyc2VyJ1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbiIsIi8qXG4gICAgXG4gICAgXG4qL1xuXG52YXIgaGFua2FrdSA9ICcxMjM0NTY3ODkwYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWiAnO1xudmFyIHplbmtha3UgPSAn77yR77yS77yT77yU77yV77yW77yX77yY77yZ77yQ772B772C772D772E772F772G772H772I772J772K772L772M772N772O772P772Q772R772S772T772U772V772W772X772Y772Z772a77yh77yi77yj77yk77yl77ym77yn77yo77yp77yq77yr77ys77yt77yu77yv77yw77yx77yy77yz77y077y177y277y377y477y577y644CAJztcblxuZXhwb3J0cy56ZW5rYWt1VG9IYW5rYWt1ID0gZnVuY3Rpb24gKHdvcmQpIHtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSB6ZW5rYWt1Lmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgIHdvcmQgPSB3b3JkLnJlcGxhY2UobmV3IFJlZ0V4cCh6ZW5rYWt1W2ldLCAnZ20nKSwgaGFua2FrdVtpXSk7XG4gIH1cbiAgcmV0dXJuIHdvcmQucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpOyAvLyB0cmltIGhlYWQgYW5kIHRhaWwgd2hpdGUgc3BhY2Vcbn07XG5cbmV4cG9ydHMuaGFua2FrdVRvWmVua2FrdSA9IGZ1bmN0aW9uICh3b3JkKSB7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gaGFua2FrdS5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICB3b3JkID0gd29yZC5yZXBsYWNlKG5ldyBSZWdFeHAoaGFua2FrdVtpXSwgJ2dtJyksIHplbmtha3VbaV0pO1xuICB9XG4gIHJldHVybiB3b3JkLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTsgLy8gdHJpbSBoZWFkIGFuZCB0YWlsIHdoaXRlIHNwYWNlXG59O1xuXG4iLCIvKlxuICAgIFxuICAgIFxuKi9cblxudmFyIFBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcicpLlBhcnNlcjtcbnZhciBQYXJzZWRSZXN1bHQgPSByZXF1aXJlKCcuLi8uLi9yZXN1bHQnKS5QYXJzZWRSZXN1bHQ7XG5cbnZhciBQQVRURVJOID0gL1xcJFxccyooXFxkezEsM30oLFxcZHszfSkqKFxcLlxcZCopPykvO1xuXG5leHBvcnRzLlBhcnNlciA9IGZ1bmN0aW9uIFVTRG9sbGFyU2lnblBhcnNlcigpe1xuICAgIFxuICAgIFBhcnNlci5jYWxsKHRoaXMpO1xuICAgICAgICBcbiAgICB0aGlzLnBhdHRlcm4gPSBmdW5jdGlvbigpIHsgcmV0dXJuIFBBVFRFUk47IH1cbiAgICBcbiAgICB0aGlzLmV4dHJhY3QgPSBmdW5jdGlvbih0ZXh0LCBtYXRjaCwgb3B0KXsgXG5cbiAgICAgICAgdmFyIG51bWJlciA9IG1hdGNoWzFdO1xuICAgICAgICBudW1iZXIgPSBudW1iZXIucmVwbGFjZSgnLCcsICcnKTtcbiAgICAgICAgbnVtYmVyID0gcGFyc2VGbG9hdChudW1iZXIpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUGFyc2VkUmVzdWx0KHtcbiAgICAgICAgXHR0ZXh0OiBtYXRjaFswXSxcbiAgICAgICAgXHRpbmRleDogbWF0Y2guaW5kZXgsXG4gICAgICAgIFx0bnVtYmVyOiBudW1iZXIsXG4gICAgICAgIFx0Y3VycmVuY3k6ICdVUycsXG4gICAgICAgICAgICB0YWc6ICdVU0RvbGxhclNpZ25QYXJzZXInXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuIiwiXG5mdW5jdGlvbiBQYXJzZXIoKSB7XG5cbiAgICB0aGlzLnBhdHRlcm4gPSBmdW5jdGlvbigpIHsgcmV0dXJuIC8uL2k7IH1cblxuICAgIHRoaXMuZXh0cmFjdCA9IGZ1bmN0aW9uKHRleHQsIG1hdGNoLCBvcHQpeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24odGV4dCwgb3B0KSB7XG5cbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgdmFyIHJlZ2V4ID0gdGhpcy5wYXR0ZXJuKCk7XG5cbiAgICAgICAgdmFyIHJlbWFpbmluZ1RleHQgPSB0ZXh0O1xuICAgICAgICB2YXIgbWF0Y2ggPSByZWdleC5leGVjKHJlbWFpbmluZ1RleHQpO1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuXG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgbWF0Y2ggaW5kZXggb24gdGhlIGZ1bGwgdGV4dDtcbiAgICAgICAgICAgIG1hdGNoLmluZGV4ICs9IHRleHQubGVuZ3RoIC0gcmVtYWluaW5nVGV4dC5sZW5ndGg7XG5cbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB0aGlzLmV4dHJhY3QodGV4dCwgbWF0Y2gsIG9wdCk7XG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgc3VjY2Vzcywgc3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSByZXN1bHRcbiAgICAgICAgICAgICAgICByZW1haW5pbmdUZXh0ID0gdGV4dC5zdWJzdHJpbmcocmVzdWx0LmluZGV4ICsgcmVzdWx0LnRleHQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgZmFpbCwgbW92ZSBvbiBieSAxXG4gICAgICAgICAgICAgICAgcmVtYWluaW5nVGV4dCA9IHRleHQuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdGNoID0gcmVnZXguZXhlYyhyZW1haW5pbmdUZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlZmluZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnJlZmluZXJzLmZvckVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdHMgPSByZWZpbmVyLnJlZmluZShyZXN1bHRzLCB0ZXh0LCBvcHRpb25zKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxufVxuXG5leHBvcnRzLlBhcnNlciA9IFBhcnNlcjtcbiIsIlxudmFyIFBlbm55ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnBhcnNlcnMgPSBuZXcgT2JqZWN0KG9wdGlvbnMucGFyc2Vycyk7XG4gICAgdGhpcy5yZWZpbmVycyA9IG5ldyBPYmplY3Qob3B0aW9ucy5yZWZpbmVycyk7XG59XG5cblBlbm55LnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKHRleHQsIG9wdCkge1xuXG4gICAgb3B0ID0gb3B0IHx8IHt9O1xuXG4gICAgdmFyIGFsbFJlc3VsdHMgPSBbXTtcblxuICAgIHRoaXMucGFyc2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChwYXJzZXIpIHtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBwYXJzZXIuZXhlY3V0ZSh0ZXh0LCBvcHQpO1xuICAgICAgICBhbGxSZXN1bHRzID0gYWxsUmVzdWx0cy5jb25jYXQocmVzdWx0cyk7XG4gICAgfSk7XG4gICAgXG4gICAgLy8gU29ydCBhbGxSZXN1bHRzXG4gICAgdGhpcy5yZWZpbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChyZWZpbmVyKSB7XG4gICAgICAgIGFsbFJlc3VsdHMgPSByZWZpbmVyLnJlZmluZSh0ZXh0LCBhbGxSZXN1bHRzLCBvcHQpO1xuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBhbGxSZXN1bHRzO1xufTtcblxuZXhwb3J0cy5QZW5ueSA9IFBlbm55O1xuZXhwb3J0cy5QYXJzZXIgPSByZXF1aXJlKCcuL3BhcnNlcnMvcGFyc2VyJykuUGFyc2VyO1xuZXhwb3J0cy5SZWZpbmVyID0gcmVxdWlyZSgnLi9yZWZpbmVycy9yZWZpbmVyJykuRmlsdGVyO1xuZXhwb3J0cy5GaWx0ZXIgPSByZXF1aXJlKCcuL3JlZmluZXJzL3JlZmluZXInKS5GaWx0ZXI7XG5leHBvcnRzLlBhcnNlZFJlc3VsdCA9IHJlcXVpcmUoJy4vcmVzdWx0JykuUGFyc2VkUmVzdWx0O1xuXG5leHBvcnRzLm9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbnMnKTtcblxuZXhwb3J0cy5zdHJpY3QgPSBuZXcgUGVubnkoZXhwb3J0cy5vcHRpb25zLnN0cmljdE9wdGlvbnMoKSk7XG5leHBvcnRzLmdlbmVyYWwgPSBuZXcgUGVubnkoZXhwb3J0cy5vcHRpb25zLmdlbmVyYWxPcHRpb25zKCkpO1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBleHBvcnRzLmdlbmVyYWwucGFyc2UuYXBwbHkoZXhwb3J0cy5nZW5lcmFsLCBhcmd1bWVudHMpO1xufVxuIiwiLypcbiAgXG4qL1xudmFyIFJlZmluZXIgPSByZXF1aXJlKCcuL3JlZmluZXInKS5SZWZpbmVyO1xuXG52YXIgUEFUVEVSTiA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqKGFuZHx0b3wtfH5844O8fOOAnCk/XFxcXHMqJFwiKTtcblxuZnVuY3Rpb24gaXNBYmxlVG9NZXJnZSh0ZXh0LCBwcmV2UmVzdWx0LCBjdXJSZXN1bHQpe1xuICAgIFxuICAgIHZhciB0ZXh0QmV0d2VlbiA9IHRleHQuc3Vic3RyaW5nKHByZXZSZXN1bHQuaW5kZXggKyBwcmV2UmVzdWx0LnRleHQubGVuZ3RoLCBjdXJSZXN1bHQuaW5kZXgpO1xuICAgIHJldHVybiB0ZXh0QmV0d2Vlbi5tYXRjaChQQVRURVJOKTtcbn1cblxuXG5mdW5jdGlvbiBtZXJnZVJlc3VsdCh0ZXh0LCBmcm9tUmVzdWx0LCB0b1Jlc3VsdCkge1xuXG4gICAgZnJvbVJlc3VsdCA9IGZyb21SZXN1bHQuY2xvbmUoKTtcbiAgICBmcm9tUmVzdWx0Lm51bWJlck1heCA9IE1hdGgubWF4KHRvUmVzdWx0Lm51bWJlciwgZnJvbVJlc3VsdC5udW1iZXIpO1xuICAgIGZyb21SZXN1bHQubnVtYmVyTWluID0gTWF0aC5taW4odG9SZXN1bHQubnVtYmVyLCBmcm9tUmVzdWx0Lm51bWJlcik7XG4gICAgZnJvbVJlc3VsdC5udW1iZXIgPSBmcm9tUmVzdWx0Lm51bWJlck1pbjtcblxuICAgIHZhciBzdGFydEluZGV4ID0gTWF0aC5taW4oZnJvbVJlc3VsdC5pbmRleCwgdG9SZXN1bHQuaW5kZXgpO1xuICAgIHZhciBlbmRJbmRleCA9IE1hdGgubWF4KFxuICAgICAgICAgICAgICAgIGZyb21SZXN1bHQuaW5kZXggKyBmcm9tUmVzdWx0LnRleHQubGVuZ3RoLCBcbiAgICAgICAgICAgICAgICB0b1Jlc3VsdC5pbmRleCArIHRvUmVzdWx0LnRleHQubGVuZ3RoKTtcblxuICAgIGZyb21SZXN1bHQuaW5kZXggPSBzdGFydEluZGV4O1xuICAgIGZyb21SZXN1bHQudGV4dCAgPSB0ZXh0LnN1YnN0cmluZyhzdGFydEluZGV4LCBlbmRJbmRleCk7XG5cbiAgICBmb3IgKHZhciB0YWcgaW4gdG9SZXN1bHQudGFncykge1xuICAgICAgICBmcm9tUmVzdWx0LnRhZ3NbdGFnXSA9IHRvUmVzdWx0LnRhZ3NbdGFnXTtcbiAgICB9XG5cbiAgICBmcm9tUmVzdWx0LnRhZ3NbJ01lcmdlUmFuZ2VSZXN1bHQnXSA9IHRydWU7XG4gICAgcmV0dXJuIGZyb21SZXN1bHQ7XG59XG5cbmV4cG9ydHMuUmVmaW5lciA9IGZ1bmN0aW9uIE1lcmdlUmFuZ2VSZXN1bHQoKSB7XG5cdFJlZmluZXIuY2FsbCh0aGlzKTtcblx0XG5cdHRoaXMucmVmaW5lID0gZnVuY3Rpb24odGV4dCwgcmVzdWx0cywgb3B0KSB7IFxuXG4gICAgICAgIGlmIChyZXN1bHRzLmxlbmd0aCA8IDIpIHJldHVybiByZXN1bHRzO1xuICAgICAgICBcbiAgICAgICAgdmFyIG1lcmdlZFJlc3VsdCA9IFtdXG4gICAgICAgIHZhciBjdXJyUmVzdWx0ID0gbnVsbDtcbiAgICAgICAgdmFyIHByZXZSZXN1bHQgPSBudWxsO1xuICAgICAgICBcbiAgICAgICAgZm9yICh2YXIgaT0xOyBpPHJlc3VsdHMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjdXJyUmVzdWx0ID0gcmVzdWx0c1tpXTtcbiAgICAgICAgICAgIHByZXZSZXN1bHQgPSByZXN1bHRzW2ktMV07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghcHJldlJlc3VsdC5udW1iZXJNaW4gJiYgIWN1cnJSZXN1bHQubnVtYmVyTWF4IFxuICAgICAgICAgICAgICAgICYmIGlzQWJsZVRvTWVyZ2UodGV4dCwgcHJldlJlc3VsdCwgY3VyclJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcHJldlJlc3VsdCA9IG1lcmdlUmVzdWx0KHRleHQsIHByZXZSZXN1bHQsIGN1cnJSZXN1bHQpO1xuICAgICAgICAgICAgICAgIGN1cnJSZXN1bHQgPSBudWxsO1xuICAgICAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbWVyZ2VkUmVzdWx0LnB1c2gocHJldlJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChjdXJyUmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIG1lcmdlZFJlc3VsdC5wdXNoKGN1cnJSZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1lcmdlZFJlc3VsdDtcbiAgICB9XG59IiwiLypcbiAgXG4qL1xudmFyIFJlZmluZXIgPSByZXF1aXJlKCcuL3JlZmluZXInKS5SZWZpbmVyO1xuXG5leHBvcnRzLlJlZmluZXIgPSBmdW5jdGlvbiBPdmVybGFwUmVtb3ZhbFJlZmluZXIoKSB7XG5cdFJlZmluZXIuY2FsbCh0aGlzKTtcblx0XG5cblx0dGhpcy5yZWZpbmUgPSBmdW5jdGlvbih0ZXh0LCByZXN1bHRzLCBvcHQpIHsgXG5cbiAgICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoIDwgMikgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIFxuICAgICAgICB2YXIgZmlsdGVyZWRSZXN1bHRzID0gW107XG4gICAgICAgIHZhciBwcmV2UmVzdWx0ID0gcmVzdWx0c1swXTtcbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGk9MTsgaTxyZXN1bHRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHJlc3VsdHNbaV07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIElmIG92ZXJsYXAsIGNvbXBhcmUgdGhlIGxlbmd0aCBhbmQgZGlzY2FyZCB0aGUgc2hvcnRlciBvbmVcbiAgICAgICAgICAgIGlmIChyZXN1bHQuaW5kZXggPCBwcmV2UmVzdWx0LmluZGV4ICsgcHJldlJlc3VsdC50ZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQudGV4dC5sZW5ndGggPiBwcmV2UmVzdWx0LnRleHQubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICAgICAgcHJldlJlc3VsdCA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkUmVzdWx0cy5wdXNoKHByZXZSZXN1bHQpO1xuICAgICAgICAgICAgICAgIHByZXZSZXN1bHQgPSByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIFRoZSBsYXN0IG9uZVxuICAgICAgICBpZiAocHJldlJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgICAgICBmaWx0ZXJlZFJlc3VsdHMucHVzaChwcmV2UmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkUmVzdWx0cztcbiAgICB9XG59IiwiLypcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgXG4qL1xuZXhwb3J0cy5SZWZpbmVyID0gZnVuY3Rpb24gUmVmaW5lcigpIHsgXG5cbiAgICB0aGlzLnJlZmluZSA9IGZ1bmN0aW9uKHRleHQsIHJlc3VsdHMsIG9wdCkgeyByZXR1cm4gcmVzdWx0czsgfTtcbn1cblxuZXhwb3J0cy5GaWx0ZXIgPSBmdW5jdGlvbiBGaWx0ZXIoKSB7IFxuICAgIFxuICAgIFJlZmluZXIuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuaXNWYWxpZCA9IGZ1bmN0aW9uKHRleHQsIHJlc3VsdCwgb3B0KSB7IHJldHVybiB0cnVlOyB9XG4gICAgdGhpcy5yZWZpbmUgPSBmdW5jdGlvbih0ZXh0LCByZXN1bHRzLCBvcHQpIHsgXG5cbiAgICAgICAgdmFyIGZpbHRlcmVkUmVzdWx0ID0gW107XG4gICAgICAgIGZvciAodmFyIGk9MDsgaT1yZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzVmFsaWQocmVzdWx0c1tpXSkpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZFJlc3VsdC5wdXNoKHJlc3VsdHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkUmVzdWx0O1xuICAgIH1cbn0iLCJcbmZ1bmN0aW9uIFBhcnNlZFJlc3VsdChyZXN1bHQpe1xuXG4gICAgcmVzdWx0ID0gcmVzdWx0IHx8IHt9O1xuXG4gICAgdGhpcy5pbmRleCA9IHJlc3VsdC5pbmRleDtcbiAgICB0aGlzLnRleHQgID0gcmVzdWx0LnRleHQ7XG4gICAgXG4gICAgdGhpcy5udW1iZXIgPSByZXN1bHQubnVtYmVyO1xuICAgIHRoaXMubnVtYmVyTWluID0gcmVzdWx0Lm51bWJlck1pbjtcbiAgICB0aGlzLm51bWJlck1heCA9IHJlc3VsdC5udW1iZXJNYXg7XG4gICAgdGhpcy5jdXJyZW5jeSA9IHJlc3VsdC5jdXJyZW5jeTtcblxuICAgIHRoaXMudGFncyA9IHJlc3VsdC50YWdzIHx8IHt9O1xuICAgIGlmIChyZXN1bHQudGFnKSB7XG4gICAgXHR0aGlzLnRhZ3NbcmVzdWx0LnRhZ10gPSB0cnVlO1xuICAgIH1cbn1cblxuUGFyc2VkUmVzdWx0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUGFyc2VkUmVzdWx0KHRoaXMpO1xufVxuXG5leHBvcnRzLlBhcnNlZFJlc3VsdCA9IFBhcnNlZFJlc3VsdDsiXX0=
