 const _retext = require('retext');
 const _keywords = require('retext-keywords');
 const nlcstToString = require('nlcst-to-string');

exports.parse = function( text, callback )
{
	_extractKeywords( text, callback );
};

const _extractKeywords = function( text, callback )
{
	_retext().use( _keywords ).process(text, function ( err, file )
		{
			// TODO: handle err

			const space = file.namespace('retext');

			var keywords = [];

	        space.keywords.forEach(function (keyword) 
	        {
	            keywords.push( nlcstToString(keyword.matches[0].node) );
	        });
	        
	        callback( err, keywords );
		}
	);
};
