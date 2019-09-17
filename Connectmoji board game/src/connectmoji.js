const wcwidth = require('wcwidth');

function generateBoard(row, col, fill = null){
	var arr = Array(row * col);
	for (var i = 0; i<arr.length; i++){
		arr[i] = fill; 
	}

	return {
		data : arr, 
		rows : row, 
		cols : col
	}
}


function rowColToIndex(board, row, col){
	return board.cols * row + col; 
}


function indexToRowCol(board, i){
	return {
		row : Math.floor(i / board.cols), 
		col : i % board.cols
	}
}

function setCell(board, row, col, value){
	var new_board = generateBoard(board.rows, board.cols); 
	let index = rowColToIndex(new_board, row, col); 
	new_board.data = board.data.slice();
	new_board.data[index] = value; 
	return new_board; 
}


function setCells(board, ...arguments){
	var new_board = generateBoard(board.rows, board.cols); 
	new_board.data = board.data.slice();
	let index; 

	for(const elem of arguments) {
		index = rowColToIndex(new_board, elem.row, elem.col);
		new_board.data[index] = elem.val; 
	}
	return new_board; 
}


// bugs exist in this function 
function boardToString(board, empty = null){
	let res = "";
	let width = 0; 
	if(board == null) return res;

	for(const elem of board.data){
		if(elem != empty) {
			width = (width > wcwidth(elem)) ? width : wcwidth(elem);
		}
	}

	// if all the elements in the board.data are null
	// adjust the width to be 1 -> for the preparation of 
	// initilasing the space

	// the width of the longest element 
	if(width == 0) width = 1; 

	// the function printing a fixed number of space
	let space = function(n){
		let output = ''; 
		for(let i = 0; i<n; i++) output += ' '; 
		return output; 
	}

	let horizontal_board = function(n){
		let output = ''; 
		for(let i = 0; i<n; i++) output += '-'; 
		return output; 
	}

	for(let i =0; i <board.rows + 2; i++){
		for(let j =0; j<board.cols; j++){
			if(i == board.rows && j > 0) res += '+';
			else res += '|';

			if(i == board.rows) res += horizontal_board(width + 2);

			else if (i == board.rows + 1) res += space(Math.floor((width + 1)/2)) 
				+ String.fromCharCode(65 + j) + space(Math.ceil((width + 1)/2));

			else {
				let index = rowColToIndex(board, i, j);
				let curr = board.data[index]; 

				if(curr == empty) res += space(width + 2);

				else if(wcwidth(curr) < width) {
					let local_width = wcwidth(curr); 

					res += space(Math.floor((width + 2 - local_width)/2)) 
				+ curr + space(Math.ceil((width + 2 - local_width)/2));
				}

				else {res += space(1) + curr + space(1);}
			}
		}
		res += '|'; 
		if(i < board.rows + 1) res += '\n'; 
	}
	return res;  	
}


// can i wrap the process in a function 
function letterToCol(letter){
	if(letter < 'A' || letter > 'Z' || letter.length > 1) return null; 

	let diff = letter.charCodeAt(0) - 'A'.charCodeAt(0); 
	return diff; 	
}


function getEmptyRowCol(board, letter, empty = null){
	let c = letterToCol(letter); 
	let last = null;  

	if(c < board.cols && c != null) {
		for(row = 0; row < board.rows; row ++){
			let index = rowColToIndex(board, row, c)
		
			if(board.data[index] != empty) break; 
			else last = row;
		}
	}

	row = last; 
	if(c == null || row == null) return null; 
	return {
		row: last, 
		col: c
	};
}


function getAvailableColumns(board, empty = null){
	let arr = Array();

	for(let col = 0; col < board.cols; col ++){
		if(board.data[col] == empty) arr.push(String.fromCharCode(65 + col));
	} 

	return arr; 
}

function hasConsecutiveValues(board, row, col, n){
	let flag = false; 
	let count = 0; 
	let symbol = board.data[rowColToIndex(board, row, col)];
	// check on the row
	let start = (col - n + 1 > 0) ? col - n + 1 : 0; 
	let end = (col + n - 1  < board.cols - 1) ? col + n - 1 : board.cols - 1; 
 
	for(let c = start;  c <= end; c++){
		let index = rowColToIndex(board, row, c); 
		if(board.data[index] == symbol) count ++; 
		else count = 0; 
		if(count >= n) flag = true;
	}


	// check on the column
	start = (row - n + 1 > 0) ? row - n + 1 : 0; 
	end = (row + n - 1 < board.rows - 1) ? row + n - 1 : board.cols - 1; 

	count = 0; 
 
	for(let r = start;  r <= end; r++){
		let index = rowColToIndex(board, r, col); 
		if(board.data[index] == symbol) count ++; 
		else count = 0; 
		if(count >= n) flag = true;
	}


	// check on the diagonal
	let left_diff = (row < col) ? row : col; 
	let right_diff =(board.rows - row -1 < board.cols - col - 1) ? board.rows - row -1 : board.cols -col - 1; 

	count = 0; 
 
	for(let i = -left_diff; i <= right_diff; i++){
		let index = rowColToIndex(board, row + i, col + i); 
		if(board.data[index] == symbol) count ++; 
		else count = 0; 
		if(count >= n) flag = true;
	}


	left_diff = (board.rows - row -1 < col) ? board.rows - row -1 : col; 
	right_diff =(row < board.cols - col -1) ? row : board.cols - col - 1; 

	count = 0; 
 
	for(let i = -left_diff; i <= right_diff; i++){
		let index = rowColToIndex(board, row - i, col + i); 
		if(board.data[index] == symbol) count ++; 
		else count = 0; 
		if(count >= n) flag = true;
	}

	return flag; 
}


function autoplay(board, s, numConsecutive, empty = null){
	let count = 0; 
	let player_a, player_b; 

	for(const elem of s){
		if(count == 0) player_a = elem; 
		else if(count == 1) player_b = elem; 
		count ++; 
	}

	let start = wcwidth(player_a) + wcwidth(player_b); 

	let res = new Object();
	let r ,c; 
	res.board =  board; 
	res.pieces = [player_a, player_b]; 

	for(let i = start; i<s.length; i++){ 
		let step = s.charAt(i); 
		if(getEmptyRowCol(res.board, step, empty) == null){
			res.error = {
				num : i - start + 1, 
				val : ((i - start) % 2 == 0) ? player_a : player_b, 
				col : step,
			}
			res.lastPieceMoved = res.error.val; 
			res.board = null; 

			return res; 
		}

		let obj = getEmptyRowCol(res.board , step, empty); 
		r = obj.row; c = obj.col; 


		// the calculation of step here is a little out of order
		// due to the fact that we are calculating the result for 
		// the next inning since we already have a winner

		if((i - start) % 2 == 0){
			res.board = setCell(res.board , r, c, player_a);  
			if(hasConsecutiveValues(res.board , r, c, numConsecutive)) {
				if (i == s.length -1){
					res.winner = player_a; 

				}

				else{
					res.error = {
						num : i - start + 2, 
						val : player_b, 
						col : step 
					};
					res.board = null; 
					res.lastPieceMoved = res.error.val; 

					return res; 
				}
			} 
		}

		// the calculation of step here is a little out of order
		// due to the fact that we are calculating the result for 
		// the next inning since we already have a winner

		else{
			res.board = setCell(res.board , r, c, player_b);  
			if(hasConsecutiveValues(res.board , r, c, numConsecutive)) {
				if (i == s.length -1){
					res.winner = player_b; 

				}

				else{
					res.error = {
						num : i - start + 2, 
						val : player_a, 
						col : step 
					};
					res.board = null; 
					res.lastPieceMoved = res.error.val;

					return res; 
				}
			} 
		}

		res.lastPieceMoved = ((i - start ) % 2 == 0) ? player_a : player_b; 
	}
	return res; 
}


module.exports = {
    generateBoard: generateBoard,
    autoplay: autoplay,
    rowColToIndex : rowColToIndex, 
    indexToRowCol : indexToRowCol,
    setCell : setCell, 
    setCells : setCells, 
    letterToCol : letterToCol, 
    getEmptyRowCol : getEmptyRowCol, 
    getAvailableColumns :  getAvailableColumns, 
    hasConsecutiveValues : hasConsecutiveValues, 
    boardToString : boardToString, 
}

