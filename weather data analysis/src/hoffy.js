// add higher order functions here
/* 
no: 
while loops
for loops
for ... in loops
for ... of loops
forEach method 
*/ 




function parseMoves(s){
	let buffer = [...s]; 
	let player_1 = buffer.slice(0,1)[0]; 
	let player_2 = buffer.slice(1,2)[0]; 
	let arr = buffer.slice(2,); 

	let steps = [...arr.entries()];
	let res = steps.map(function(ele){
		return {val : ele[0]%2 == 0 ? player_1 : player_2, col : ele[1]}; 
	}); 
	return res; 
}



function shortestString(...arguments){
	let res; 
	let arr = [...arguments];  
	if (arr.length == 0) return res;

	const checker = (last, curr) => (last.length < curr.length) ? last : curr; 

	res = arr.reduce(checker); 

	return res; 
}

//'awefwae', 'b', 'cd'
// console.log(shortestString('awefwae', 'b', 'cd'));  

function repeatCall(fn, n, arg){
	if(n == 0) return; 
	fn(arg); 
	repeatCall(fn, n-1, arg); 
}

function repeatCallAllArgs(fn, n, ...arg){
	if(n == 0) return; 
	let arr = [...arg]; 
	fn.apply(null, arr); 
	repeatCallAllArgs(fn, n-1, ...arg); 
}

function steppedForEach(arr, fn, step){
	if(arr.length == 0) return; 
	let curr = arr.slice(0, step); 
	let next = arr.slice(step,); 
	fn.apply(null, curr); 
	steppedForEach(next, fn, step); 
}

// steppedForEach([1, 2, 3, 4, 5, 6], (a, b, c) => console.log('' + a + b + c),  3);

function constrainDecorator(fn, min, max){
	return function(arg){
		let res = fn(arg);
		if (res > max) res = max; 
		else if (res < min) res = min; 
		return res;
	}
}

// const constrainedParseInt = constrainDecorator(parseInt, -10, 10);
// constrainedParseInt(-12); 


function limitCallsDecorator(fn, n){
	let count = 0; 
	return function(args){
		if(count++ < n) return fn(args); 
		else return undefined; 
	}
}


function bundleArgs(fn, ...arguments){
	let arr = [...arguments]; 
	return function(...input){
		return fn(...arr, ...input);
	}
}



function sequence(...arguments){
	// helper
	let arr = [...arguments];
	return function helper(arg){
		if(arr.length == 1) return arr[0](arg); 

		let next_arg = arr[0](arg); 
		arr = arr.slice(1,);
		return helper(next_arg);
	}
}





module.exports = {
    parseMoves: parseMoves,
    shortestString: shortestString,
    repeatCall : repeatCall, 
    repeatCallAllArgs : repeatCallAllArgs,
    steppedForEach : steppedForEach, 
    limitCallsDecorator : limitCallsDecorator, 
    constrainDecorator : constrainDecorator, 
    bundleArgs : bundleArgs, 
    sequence :  sequence, 
}


