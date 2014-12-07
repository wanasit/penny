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