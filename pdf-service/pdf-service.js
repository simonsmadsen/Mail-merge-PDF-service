const merge = require('easy-pdf-merge');
const fs = require('fs');

module.exports = {

	saveAttachments: function(attachments,incCounter,onAllAttachmentsSaved){
		let self = this;
	    if(incCounter < attachments.length){
			fs.appendFile('./pdf-files/downloaded_'+incCounter+'.pdf', new Buffer(attachments[incCounter].message), function (err) {
			   self.saveAttachments(attachments,incCounter +1,onAllAttachmentsSaved);
			});
	    }else{
	      onAllAttachmentsSaved();	
	    }
	},

	emptyDir : function(dirPath) {
		try { 
			var files = fs.readdirSync(dirPath); 
		}
		catch(e) { 
			return; 
		}
        if (files.length > 0){
			for (var i = 0; i < files.length; i++) {
				var filePath = dirPath + '/' + files[i];
				if (fs.statSync(filePath).isFile()){
					fs.unlinkSync(filePath);	
				}else{
					rmDir(filePath);	
				}
        	}
        }
    },

  	merge: function(attachments,onDone){
		let self = this;

		let filenames = [];
	    for(i = 0; i < attachments.length; i++){
	    	filenames[i] = './pdf-files/downloaded_'+i+'.pdf';
	    }

	    self.emptyDir('./pdf-files');
	   
	  	self.saveAttachments(attachments,0,function(){
	   		merge(filenames,'./pdf-files/margedFile.pdf',function(err){
	   			onDone('./pdf-files/margedFile.pdf');
			});
	  	});
  	},

};