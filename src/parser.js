const _retext = require('retext');
const _keywords = require('retext-keywords');
const _nlcstToString = require('nlcst-to-string');
const _sentiment = require('retext-sentiment');
const _normalize = require('nlcst-normalize');

exports.parse = function( text, callback )
{
	_extractKeywords( text, callback );
};

exports.sentimentScore = function( text, callback )
{
	_retext().use( _sentiment ).use(function () 
	{
	    return function (cst) 
	    {
	        callback( cst );
	    };
	}).process(text);
};

exports.extractKeywords = function( text, callback )
{
	text = text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
	text = text.replace(/^rt\W/g, '');
	text = text.replace(/\Wrt\W/g, '');

	_retext().use( _keywords ).process(text, function ( err, file )
		{
			const space = file.namespace('retext');

			var keywords = [];

	        space.keywords.forEach(function (keyword) 
	        {
	            keywords.push( _normalize( _nlcstToString( keyword.matches[0].node ) ) );
	        });
	        
	        callback( err, keywords );
		}
	);
};
