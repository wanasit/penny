
test("Test - Parse dollar sign", function() {

	var results = penny.parse('This is ２５円');
	ok(results.length == 1, JSON.stringify( results ) )

	if (results[0]) {
		ok(results[0].index == 8, JSON.stringify( results ) )
		ok(results[0].text == '２５円', JSON.stringify( results ) )
		ok(results[0].number == 25, JSON.stringify( results ) )
		ok(results[0].currency == 'JPY', JSON.stringify( results ) )
	}


	var results = penny.parse('This is 25円');
	ok(results.length == 1, JSON.stringify( results ) )

	if (results[0]) {
		ok(results[0].index == 8, JSON.stringify( results ) )
		ok(results[0].text == '25円', JSON.stringify( results ) )
		ok(results[0].number == 25, JSON.stringify( results ) )
		ok(results[0].currency == 'JPY', JSON.stringify( results ) )
	}
});

test("Test - Parse random string", function() {

	var results = penny.parse('This is 600万円 〜 1200万円');
	ok(results.length == 1, JSON.stringify( results ))


	// var results = penny.parse('年収：800万～2000万');
	// ok(results.length == 1, JSON.stringify( results ))


	// var results = penny.parse('年収：800万～2000万');
	// ok(results.length == 1, JSON.stringify( results ))

	// var results = penny.parse('年収：800万～2000万');
	// ok(results.length == 1, JSON.stringify( results ))

});





