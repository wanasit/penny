
test("Test - Module status", function() {

	ok(penny, 	'Load: penny');

	ok(penny.Penny, 'Load: penny.penny');

	ok(penny.Parser, 'Load: penny.Parser');

	ok(penny.Refiner, 'Load: penny.Refiner');

	ok(penny.ParsedResult, 'Load: penny.ParsedResult');

	ok(penny.parse, 'Check function [parse]');

	ok(penny.options, 'Check [options] object');

	ok(penny.strict, 'Check [strict] object');

	ok(penny.general, 'Check [general] object');

});

test("Test - Parse dollar sign", function() {

	var results = penny.parse('This is $25');
	ok(results.length == 1, JSON.stringify( results ) )

	if (results[0]) {
		ok(results[0].index == 8, JSON.stringify( results ) )
		ok(results[0].text == '$25', JSON.stringify( results ) )
		ok(results[0].number == 25, JSON.stringify( results ) )
		ok(results[0].currency == 'US', JSON.stringify( results ) )
	}


	var results = penny.parse('This is $80,000');
	ok(results.length == 1, JSON.stringify( results ) )

	if (results[0]) {
		ok(results[0].index == 8, JSON.stringify( results ) )
		ok(results[0].text == '$80,000', JSON.stringify( results ) )
		ok(results[0].number == 80000, JSON.stringify( results ) )
		ok(results[0].currency == 'US', JSON.stringify( results ) )
	}
});


test("Test - General Numbers", function() {

	var results = penny.parse('150,000.00');
	ok(results.length == 1, JSON.stringify( results ) )

	if (results[0]) {
		ok(results[0].index == 0, JSON.stringify( results ) )
		ok(results[0].text == '150,000.00', JSON.stringify( results ) )
		ok(results[0].number == 150000.00, JSON.stringify( results ) )
		ok(!results[0].currency, JSON.stringify( results ) )
	}
});



