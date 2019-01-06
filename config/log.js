const amqp = require('amqplib/callback_api');
const fs = require('fs');

amqp.connect('amqp://hhyulfhn:MhgdjSCJurUHEvV84_i0Hp6YqM2h2jip@hound.rmq.cloudamqp.com/hhyulfhn',
 function(err, conn){
	conn.createChannel(function(err, ch){
		var q = 'searches';
		ch.assertQueue(q, {durable:false});
		console.log("[*]In attesa di nuovi messaggi.", q);
		ch.consume(q, function(msg){
			fs.appendFile('log.txt','\n'+msg.content.toString(), function(err){
				if(err) 
					throw err;
			});
			console.log("[X] Received %s", msg.content.toString());
		}, {noAck : true});
	});
});