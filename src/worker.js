const _rabbitmqUrl = 'rabbit';
const _elasticSearchUrl = '?';


const _parser = require('./parser.js');

const _amqp = require('amqp');
const _connection = _amqp.createConnection( { host: _rabbitmqUrl } );

const _elasticSearch = require('elasticsearch');
const _elasticSearchClient = new _elasticSearch.Client( { host: _elasticSearchUrl } );

const _forEachRabbitItem = function( itemHandler )
{
	_connection.on('ready', function () 
	{
		_connection.queue('tweets', function (q) 
		{
		  // Catch all messages 
		  q.bind('#');

		  // Receive messages 
		  q.subscribe({ ack: true }, function( message ) 
			{
				itemHandler(message, q) 
			});
		});
	});
};

const _insertDocument = function(data)
{
	_elasticSearchClient.index({
		index: 'tweets',
		type: 'tweet',
		body: data
	});
};

exports.startParsing = function()
{
	_forEachRabbitItem(function( item, queue )
	{		
		const messageText = item.text;

		var documentData = {};

		_parser.extractKeywords( messageText, function( err, result )
		{
			documentData.entities = result;

			_parser.sentimentScore( messageText, function( result )
			{
				documentData.sentimentScore = result.data.polarity;

				documentData.dateSaved = new Date().getTime();

				console.log(documentData);
				
				// _insertDocument(documentData);
				
				queue.shift();
			});
		});      		
	});
};
