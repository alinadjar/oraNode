const axios = require('axios');
const config = require('config');
const _ = require('lodash');

module.exports = async (mobileNumber, message) => {


	let response;


	try {
		response = await axios.post(config.get('sms.endpoint'), {
			"username": config.get('sms.username'),
			"password": config.get('sms.password'),// '3434'
			"mobile": mobileNumber,//_.toString(mobileNumber),
			"message": message,
			"line": config.get('sms.lineNumber'),
			"type": 0,
			"template": 0
		});


		//console.log('=======================================' + response);
		console.log(response.status);
		return response.status;
	} catch (ex) {
		console.log('###############################>>>>> inside Catch:');
		// console.log(ex);

		return -1;
	}
}


// module.exports = (mobileNumber, message) => {
	
	// axios.post(config.get('sms.endpoint'), {
		// 	"username": config.get('sms.username'),
		// 	"password": config.get('sms.password'),
		// 	"mobile": mobileNumber,//_.toString(mobileNumber),
		// 	"message": message,
		// 	"line": config.get('sms.lineNumber'),
		// 	"type":0,
		// 	"template":0
	// })
	//     .then(response => {
	// 		if(response.status === 200){
	// 			console.log('SMS sent Successfully.');
	// 			console.log(response.status);
	// 			console.log(response);			
	// 		}
	// 		else 
	// 		{
	// 			console.log('SMS failed. ==> status: '+ response.status);
	// 		}		
	// 	})
	//     .catch(err => console.log(err));

// }