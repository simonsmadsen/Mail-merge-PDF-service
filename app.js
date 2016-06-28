process.env.TZ = 'Europe/Amsterdam';
const env = require('env-deploy')(__dirname);
const mailer = require('./mailer/mailer.js');
const pdfService = require('./pdf-service/pdf-service.js');

console.log('running . . .');

mailer.open(function(connection){
 	
	mailer.onAttachments = function(attachments){
	    pdfService.merge(attachments,function(mergedPDF){
      		mailer.respond(mergedPDF,attachments[0].from,connection);
    	});
    };

 	mailer.listen(connection);
});