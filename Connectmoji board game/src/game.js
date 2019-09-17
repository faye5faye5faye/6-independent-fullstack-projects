// require your module, connectmoji
// require any other modules that you need, like clear and readline-sync
const c = require('./connectmoji.js');
const readlineSync = require('readline-sync');
const clear = require('clear'); 

// for each inning
function innings(board, first_go, player_a, player_b, numConsecutive){
	let flag = false;
	let row  = board.rows; 
	let col = board.cols; 
	let inning = 0; 
	let letter; 

	while(!flag && c.getAvailableColumns(board, null).length != 0){
		let res; 
		let random; 

		if((first_go == 'C' && inning % 2 == 0) || (first_go == 'P' && inning % 2 == 1)){
			readlineSync.question('\nPress <ENTER> to see computer move');
			do{
				random = parseInt((Math.random() * row) + 1); 
				letter = String.fromCharCode(65 + random); 
				res = c.getEmptyRowCol(board, letter, null);
				if(res != null) break; 

			}while(res == null); 
		}

		else{
			do{
				letter = readlineSync.question('\nChoose a column letter to drop your piece in\n> ');
				res = c.getEmptyRowCol(board, letter, null);
				if(res != null) break; 
				console.log('Oops, that is not a valid move, try again!');
			}while(res == null); 
		}
		
		// the row/col of next step
		let r_next = res.row; 
		let c_next = res.col; 

		if(inning % 2 == 0) board = c.setCell(board, r_next, c_next, player_a); 
		else board = c.setCell(board, r_next, c_next, player_b);

		flag = c.hasConsecutiveValues(board, r_next, c_next, numConsecutive);  

		if(flag == true) {
			winner = (inning % 2 == 0) ? player_a : player_b; 
			break; 
		}

		clear(); 
		console.log("...dropping in column " +letter); 
		console.log(c.boardToString(board)); 
		inning ++; 
	}

	if(flag == false) {
		console.log('\nNo winner. So sad 😭');
	}
	else {
		clear(); 
		console.log("...dropping in column " +letter); 
		console.log(c.boardToString(board)); 
		console.log('\nWinner is ' + winner);	
	}
}




// command line game - computer and player 
function start_the_game(){
	//assume that the player always puts in a valid format

	// the first answer
	// get the row, col, consecutive number
	let first_answer = readlineSync.question('Enter the number of rows, columns, and consecutive "pieces" for win\n' + 
		'(all separated by commas... for example: 6,7,4)\n> ');
	
	let row, col, numConsecutive; 
	if(first_answer.trim() == ''){
		row = 6; 
		col = 7; 
		numConsecutive = 4; 
	}
	else{
		let arr = first_answer.split(','); 
		row = parseInt(arr[0]); 
		col = parseInt(arr[1]); 
		numConsecutive = arr[2]; 
	}

	console.log('Using row, col and consecutive: ' + row + ' ' + col + ' ' + numConsecutive); 
	// print out a empty line
	console.log(); 

	// the second question 
	// get the symbols of the players
	let player = '😎'; 
	let computer = '💻';

	let second_answer = readlineSync.question('Enter two characters that represent the player and computer' + '\n' +
			'(separated by a comma... for example: P,C)\n> ');
	if(second_answer.trim() != ''){
		let arr = second_answer.split(','); 
		if(arr[0] != '' && arr[0] != undefined){
			player = arr[0]; 
		}

		if(arr[1] != '' && arr[1] != undefined){
			computer = arr[1]; 
		}
	}

	console.log('Using player and computer characters: ' + player + ' ' + computer);
    // print out a empty line
	console.log(); 

	
	// the third question 
	// get the player who goes first

	let first_go = 'P';
	let third_answer = readlineSync.question('Who goes first, (P)layer or (C)omputer?\n> ');
	if(third_answer.trim() != 'P' && third_answer.trim() != 'C'); 
	else first_go = third_answer.trim(); 

	if(first_go == 'P') {
		console.log('Player goes first'); 

	}
	else console.log('Computer goes first'); 


	// start of the game
	let player_a = player; 
	let player_b = computer; 

	if(first_go == 'C'){
		[player_a, player_b] = [player_b, player_a]; 
	}

	let board = c.generateBoard(row, col); 
	readlineSync.question('Press <ENTER> to start game');
	clear(); 
	console.log(c.boardToString(board)); 

	innings(board, first_go, player_a, player_b, numConsecutive); 

}


// start_the_game(); 



// pass in the result returned by autoPlay()
function continue_the_game(res, first_go, numConsecutive){ 

	if(res.pieces[0] == res.lastPieceMoved) {
		player_a = res.pieces[1];
		player_b = res.pieces[0];
	}

	else {
		player_a = res.pieces[0];
		player_b = res.pieces[1];
	}

	innings(res.board, first_go, player_a, player_b, numConsecutive); 

}




function the_game(){

	var arg = process.argv;


	// no command line input
	if(arg.length== 2) {
		start_the_game(); 
	}

	// command line input
	else{
		const arr = process.argv[2]; 
		const lst = arr.split(','); 

		// the symbol used by the user
		var player = lst[0]; 
		var s = lst[1]; 
		var row = parseInt(lst[2]); 
		var col = parseInt(lst[3]); 
		var numConsecutive = parseInt(lst[4]); 


		var board = c.generateBoard(row, col); 

		var res = c.autoplay(board, s, numConsecutive); 

		var board = res.board; 
		var winner = res.winner; 
		var error = res.error; 

		if(error != undefined) console.log("something went wrong!");
		else{
			readlineSync.question('Press <ENTER> to start game');
			if (winner != undefined){
				clear(); 
				console.log(c.boardToString(board)); 
				console.log('\nWinner is ' + winner);
			}

			else{
				clear(); 
				var first_go;
				if(res.lastPieceMoved == player) first_go = 'C'; 
				else first_go = 'P'; 
				// print out an empty line to compensate for the dropping sentence afterwards
				console.log(c.boardToString(board)); 
				continue_the_game(res, first_go, numConsecutive); 
			}
		}
	}
}



the_game(); 



