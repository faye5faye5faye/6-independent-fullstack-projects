// function generateReport

function generateReport(weatherData, variable, unit){

	// preperation
	if(variable == 'temperature'){
		unit = 'F'; 
		weatherData.map(function(elem){
			Object.keys(elem).map(function(key){
				if(!isNaN(elem[key])){elem[key] = elem[key] * 1.8 - 459.67;}
			})
 		});
	}

	let res = ''; 

	// Top 10 Cities with highest mean variable
	let average_obj = weatherData.reduce((acc, set) => {
		Object.entries(set).map((elem) => {
		if(elem[0] != 'datetime'){
			if(acc[elem[0]] == undefined){
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

	res += 'Top 10 Cities with highest mean '+ variable +'\n'
	highest_arr.map((elem) => (res += elem[0]+': ' + elem[1].toFixed(2) + ' ('+ unit +')\n'))

	res += 'Top 10 Cities with lowest mean '+ variable +'\n'
	lowest_arr.map((elem) => (res += elem[0]+': ' + elem[1].toFixed(2) + ' ('+ unit +')\n'))

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

	res += 'The average temperature over spring 2013 in New York is: '+ mean_spring_new_york.toFixed(2) +' ('+ unit +')\n'

	return res; 
}

module.exports = {
   generateReport : generateReport
}


