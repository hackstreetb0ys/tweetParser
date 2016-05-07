const assert = require('chai').assert;

describe('parser', function() 
{
	const parser = require('../src/parser.js');

	describe('#keyword_extraction', function () 
	{
		it('keywords', function () 
		{
			parser.parse('apple is doing good in this shit economy', function(err, actual)
				{					
					const expected = ['apple', 'shit', 'economy'];

					assert.equal(expected[0], actual[0]);
					assert.equal(expected[1], actual[1]);
					assert.equal(expected[2], actual[2]);
				}
			);
		});
	});
});
