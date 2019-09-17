// function analyzeTemperature

/* 
the average temperature of different cities over:
	the entire time series
	a specific year
	a particular season
	the coldest and warmest dates / times and
	the top ten coldest and warmest cities in the dataset
*/

//array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
function analyzeTemperature (weatherData){ 
	let res = ''; 


	//the first ten lines of NY 
	res += 'The first 10 lines of Temperature in NY:\n'
 	let output_arr = weatherData.slice(0, 10); 
 	let output = output_arr.map(function(sub_obj){
 		let time = sub_obj['datetime']; 
 		let temperature = sub_obj['New York'];
 		res += 'At '+ time + ', the temperature in NY is ' + temperature.toFixed(2) +' (F)\n';
 	});
 	res += '\n'; 


	// the mean temperature in San Diego
	let mean_san_diego = parseFloat(weatherData.reduce((acc, curr) => {acc.push(curr['San Diego']);return acc;}, [])
	 					  .reduce((acc, curr) => {return acc + curr}, 0)
	 					  /weatherData.length)

	res += 'The mean temperature in San Diego is: ' + mean_san_diego.toFixed(2) + ' (F)\n'
	res += '\n'; 



	// the coldest, warmest time and temperature in New York
	let coldest_new_york = weatherData.reduce((acc, curr) => {
		if(acc[0] == -1){
			acc[0] = curr['datetime']
			acc[1] = curr['New York']
		}
		else{
			if(acc[1] > curr['New York']){
				acc[0] = curr['datetime']
				acc[1] = curr['New York']
			}
		}

		return acc
	}, [-1, 0])

	let warmest_new_york = weatherData.reduce((acc, curr) => {
		if(acc[0] == -1){
			acc[0] = curr['datetime']
			acc[1] = curr['New York']
		}
		else{
			if(acc[1] < curr['New York']){
				acc[0] = curr['datetime']
				acc[1] = curr['New York']
			}
		}
		return acc
	}, [-1, 0])

	res += 'The coldest time in New York is: ' + coldest_new_york[0] + '\n'
	res += 'The lowest temperature is: ' + coldest_new_york[1].toFixed(2) + ' (F)\n'

	res += 'The warmest time in New York is: ' + warmest_new_york[0] + '\n'
	res += 'The highest temperature is: ' + warmest_new_york[1].toFixed(2) + ' (F)\n'

	res += '\n'



	// Top 10 Cities with highest mean temperature
	let average_obj = weatherData.reduce((acc, set) => {
		Object.entries(set).map((elem) => {
		if(elem[0] != 'datetime'){
			if(!acc[elem[0]]){
				acc[elem[0]] = elem[1]; 
		    }
			else{
					acc[elem[0]] += elem[1]; 
				}
			}
		})
		return acc; 
	}, {})



	let average_arr = Object.entries(average_obj).map(function(pair){
		return [pair[0], (pair[1]/weatherData.length)]
	})

	average_arr.sort(function(a,b){
		return a[1] - b[1];
	});

	let lowest_arr = average_arr.slice(0, 10);
	let highest_arr = average_arr.reverse().slice(0, 10); 

	res += 'Top 10 Cities with highest mean temperature\n'
	highest_arr.map((elem) => (res += elem[0]+': ' + elem[1].toFixed(2) + ' (F)\n'))

	res += 'Top 10 Cities with lowest mean temperature\n'
	lowest_arr.map((elem) => (res += elem[0]+': ' + elem[1].toFixed(2) + ' (F)\n'))

	res += '\n'


	// the average temperature over spring 2013 in New York
	let lower_bound = Date.parse('2013-02-01 00:00:00')
	let upper_bound = Date.parse('2013-04-30 23:59:59')

	let buffer_spring_new_york = weatherData.reduce((acc, curr) => {
		let curr_time = Date.parse(curr['datetime'])
		if(curr_time >= lower_bound && curr_time <= upper_bound){
			acc[0] += curr['New York']
			acc[1] ++; 
		}
		return acc; 
	}, [0,0])

	let mean_spring_new_york = buffer_spring_new_york[0]/buffer_spring_new_york[1]

	res += 'The average temperature over spring 2013 in New York is: '+ mean_spring_new_york.toFixed(2) +' (F)'


	return res; 
}




module.exports = {
   analyzeTemperature : analyzeTemperature
}





