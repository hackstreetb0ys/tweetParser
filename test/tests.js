const assert = require('chai').assert;

describe('parser', function() 
{
	const parser = require('../src/parser.js');

	describe('#keywords', function () 
	{
		it('keyword_extraction', function () 
		{
			parser.extractKeywords('apple is doing good in this shit economy', function(err, actual)
				{					
					const expected = ['apple', 'shit', 'economy'];

					assert.equal(expected[0], actual[0]);
					assert.equal(expected[1], actual[1]);
					assert.equal(expected[2], actual[2]);
				}
			);
		});

		describe('#stipping_useless_crap', function () 
		{
			it('urls', function () 
			{
				parser.extractKeywords('apple is doing good http://someurl.com/test', function( err, result )
					{					
						const expected = ['apple'];

						assert.equal(expected[0], result[0]);
					}
				);
			});

			it('one_letter_keywords', function () 
			{
				parser.extractKeywords('i like apple', function( err, result )
					{					
						const expected = ['apple'];

						assert.equal(expected[0], result[0]);
					}
				);
			});

			it('rt', function () 
			{
				parser.extractKeywords('rt apple is doing good http://someurl.com/test', function( err, result )
					{					
						const expected = ['apple'];

						assert.equal(expected[0], result[0]);
					}
				);
			});

			it('rt:', function () 
			{
				parser.extractKeywords('rt: apple is doing good http://someurl.com/test', function( err, result )
					{					
						const expected = ['apple'];

						assert.equal(expected[0], result[0]);
					}
				);
			});
		});
	});

	describe('#sentiment_scoring', function () 
	{
		it('negative_sentiment', function () 
		{
			parser.sentimentScore('apple is doing good in this shit economy', function( result )
				{					
					const expected = -1;
					const actual = result.data.polarity;

					assert.equal(expected, actual);
				}
			);
		});

		it('positive_sentiment', function () 
		{
			parser.sentimentScore('i really love apple, they are the best, honestly.', function( result )
				{					
					const expected = 6;
					const actual = result.data.polarity;

					assert.equal(expected, actual);
				}
			);
		});
	});
});
