
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
