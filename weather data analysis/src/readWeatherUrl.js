// require request
// require analytic.js
const request = require('request')
const a = require('./analytic.js')


function request_info(curr_resource){
	let front = 'http://jvers.com/csci-ua.0480-spring2019-008/homework/02/'; 
	let back = '.json'; 
	let url = front + curr_resource + back; 
	request(url, function(error, response, body){
		let data = JSON.parse(body);
		let variable = data.variable; 
		let unit = data.unit; 
		let next = data.next; 
		let weatherData = data.response;

		console.log(a.generateReport(weatherData, variable, unit));

		if(next != undefined && next != null){
			request_info(next);
		}
	})
}


request_info('temperature-resource');

