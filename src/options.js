
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


