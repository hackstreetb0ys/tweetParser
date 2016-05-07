const _rabbitmqUrl = '?';
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
		// Use the default 'amq.topic' exchange 
		_connection.queue('my-queue', function (q) 
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

				_insertDocument(documentData);
				
				queue.shift();
			});
		});      		
	});
};
