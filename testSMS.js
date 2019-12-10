// var Proxy = require('wcf.js').Proxy; 
// var BasicHttpBinding = require('wcf.js').BasicHttpBinding; 

// var binding = new BasicHttpBinding();

// //Ensure the proxy variable created below has a working wsdl link that actually loads wsdl    
// var proxy = new Proxy(binding, "http://sms.3300.ir/almassms.asmx");

// /*Ensure your message below looks like a valid working SOAP UI request*/
// var message = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:sil='http://YourNamespace'>" +
//                 "<soapenv:Header/>" +
//                 "<soapenv:Body>" +
//                 "<sil:YourMethod>" +
//                 "<sil:YourParameter1>83015348-b9dc-41e5-afe2-85e19d3703f9</sil:YourParameter1>" +
//                 "<sil:YourParameter2>IMUT</sil:YourParameter2>" +
//                 "</sil:YourMethod>" +
//                 "</soapenv:Body>" +
//                 "</soapenv:Envelope>";
// /*The message that you created above, ensure it works properly in SOAP UI rather copy a working request from SOAP UI*/

// /*proxy.send's second argument is the soap action; you can find the soap action in your wsdl*/
// proxy.send(message, "http://YourNamespace/IYourService/YourMethod", function (response, ctx) {
//     console.log(response);
//     /*Your response is in xml and which can either be used as it is of you can parse it to JSON etc.....*/
// });





// const soapRequest = require('easy-soap-request');
// const fs = require('fs');

// // example data
// const url = 'https://graphical.weather.gov/xml/SOAP_server/ndfdXMLserver.php';
// const sampleHeaders = {
//   'user-agent': 'sampleTest',
//   'Content-Type': 'text/xml;charset=UTF-8',
//   'soapAction': 'https://graphical.weather.gov/xml/DWMLgen/wsdl/ndfdXML.wsdl#LatLonListZipCode',
// };
// const xml = fs.readFileSync('test/zipCodeEnvelope.xml', 'utf-8');

// // usage of module
// (async () => {
//   const { response } = await soapRequest({ url: url, headers: sampleHeaders, xml: xml, timeout: 1000 }); // Optional timeout parameter(milliseconds)
//   const { headers, body, statusCode } = response;
//   console.log(headers);
//   console.log(body);
//   console.log(statusCode);
// })();



// var soap = require("soap");
// var url = 'http://sms.magfa.com/services/urn:SOAPSmsQueue?wsdl';

// reqURL = soap.createClient(url, function(err, client){
//     if(err) {
//         console.log(err);
//         return;
//     }

//     console.log('OK until here----------------------------');
//     console.log(client);

//     //console.log(client.lastMessage);

//     // client.StockQuote.StockQuoteSoap.GetQuote({symbol:'NKE'}, function(err, response){
//     //         if(err) {
//     //             console.log(err);
//     //             return;
//     //         }
//     //         console.log(response);
//     // });
// });



const axios = require('axios');
const config = require('config');

console.log(config.get('sms.smsUsername'));

axios.post('http://sms.3300.ir/api/wsSend.ashx', {
	"username": config.get('sms.smsUsername'),
	"password": config.get('sms.smsPassword'),
	"mobile": "09156187830",
	"message":"This is a test via NodeJs!",
	"line": config.get('sms.lineNumber'),
	"type":0,
	"template":0
})
    .then(response => console.log(response))
    .catch(err => console.log(err));