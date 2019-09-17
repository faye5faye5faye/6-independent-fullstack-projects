// require fs 
// require tempAnalytic.js

//path fixed

const t = require('./tempAnalytic.js')

const fs = require('fs');

fs.readFile('../historical-hourly-weather-data-json/temperature.json', 'utf8', function(err, data) {
		if (err) {
		console.log('uh oh', err);
		} 
		else {
			const obj_original = JSON.parse(data);
			let weatherData = obj_original;

			weatherData.map(function(elem){
				Object.keys(elem).map(function(key){
					if(!isNaN(elem[key])){elem[key] = parseFloat((elem[key] * 1.8 - 459.67).toFixed(2))};
				})
 			});

 			let res = t.analyzeTemperature(weatherData);
 			console.log(res)
		}
	});




// Number.parseFloat(x).toFixed(2)
