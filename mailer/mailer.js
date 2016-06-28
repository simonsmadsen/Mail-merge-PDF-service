const imaps = require('imap-simple');
var PixlMail = require('pixl-mail');

module.exports = {

	onAttachments : {},

	config : {
		imap: {
			user: process.env.MAIL_USERNAME,
			password: process.env.MAIL_PASSWORD,
			host: process.env.IMAP_HOST,
			port: process.env.IMAP_PORT,
			tls: true,
			authTimeout: 3000
		}
	},

    open : function(OnDone){
    	imaps.connect(this.config).then(function (connection) {

 		  connection.openBox('INBOX').then(function(){
 		    OnDone(connection);	
 		  });		 		  
 		});
	},

	respond : function(mergedPDF,sender,connection){
		var self = this;
		let mail = new PixlMail( process.env.SMTP_HOST, process.env.SMTP_PORT );
		mail.setOption( 'secure', process.env.SMTP_SSL ); 
		mail.setOption( 'auth', { user: process.env.MAIL_USERNAME, pass: process.env.MAIL_PASSWORD} );
		var message = 
		'To: '+sender+'\n' + 
		'From: '+process.env.RESULT_MAIL_FROM+'\n' + 
		'Subject: '+process.env.RESULT_MAIL_SUBJECT+'\n' +
		'\n' +  
		process.env.RESULT_MAIL_MESSAGE+'.\n';

		var args = {
			attachments: [
				{ filename: process.env.RESULT_MAIL_ATTACH_FILENAME, path: mergedPDF},
			]
		};
		
		mail.send( message,args, function(err) {
			self.listen(connection);
			if (err) console.log( "Mail Error: " + err );
			console.log('Result sendt to : '+sender);
		} );
	},

    listen : function(connection){
        var self = this;
        setTimeout(function(){
				
			var searchCriteria = [['UNSEEN'],['!X-GM-LABELS','Merged']];
			var fetchOptions = { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)'], struct: true };

			connection.search(searchCriteria, fetchOptions).then(function (messages){
				var attachments = [];
		        messages.forEach(function (message) {
		        	connection.addMessageLabel(message.attributes.uid,'Merged',function(err){
		        		if(err){
		        			console.log(err);
		        		}
		        	});
		            var parts = imaps.getParts(message.attributes.struct);
		            attachments = attachments.concat(parts.filter(function (part) {
		                return part.disposition && part.disposition.type === 'ATTACHMENT';
		            }).map(function (part) {
		                return connection.getPartData(message, part)
		                    .then(function (partData) {
		                        return {
		                            filename: part.disposition.params.filename,
		                            from:message.parts[0].body.from[0],
		                            subject:message.parts[0].body.subject[0],
		                            message: partData
		                        };
		                    });
		            }));
		        });
		 
		        Promise.all(attachments).then(function(attachments){
		        	if(attachments.length > 1){
		        		self.onAttachments(attachments);
		        	}else{
		        		self.listen(connection);
		        	}
				});

	      	});        	
        },10000);
    }
};