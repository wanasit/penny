
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