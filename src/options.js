
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


