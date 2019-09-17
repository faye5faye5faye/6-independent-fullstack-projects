// main.js

function createBoard(a, arr){
	let x = 0;
	let y = 0; 
	const dic = ['🍋','🥐','🍑','🍔','🍙','💊','💡','🎱','🥑','🌸','🐱','🍄','🌽','🍬','🍧','🍕','🍞','🍅']; 
	if(a === 4){
		x = 2; y = 2; 
	}
	else if(a === 16){
		x = 4; y = 4; 
	}else if(a === 36){
		x = 6; y = 6; 
	}else if(a % 4 === 0){
		x = 4; y = parseInt(a/4); 
	}else{
		x = 2; y = parseInt(a/2); 
	}

	if(arr.length < a){
		const bufArr = dic.slice(0, parseInt(a/2)); 
		arr = [...bufArr, ...bufArr];

		let one, two, tmp; 
		for(let i = 0; i < 3 * arr.length; i++){
			one = parseInt(Math.random() * arr.length); 
			two = parseInt(Math.random() * arr.length); 
			if(one !== two){
				tmp = arr[one]; 
				arr[one] = arr[two]; 
				arr[two] = tmp;
			}
		}
	}

	const table = document.createElement('table'); 
	table.setAttribute('id', 'board');


	for(let i = 0; i < y; i++){
		const tr = document.createElement('tr'); 
		for(let j = 0; j < x; j++){
			const td = document.createElement('td'); 
			const counter = i * x + j; 
			td.setAttribute('id', counter);
			td.textContent = arr[counter];
			tr.appendChild(td); 
		}
		table.appendChild(tr); 
	}

	return table; 

}

function checkFaces(faces, cards){
	if(faces.length !== cards){
		return false; 
	}else{
		const dic = {}; 
		let flag = true; 
		faces.forEach((elem) => {
			if(dic.hasOwnProperty(elem)){
				dic[elem] ++; 
			}else{
				dic[elem] = 1; 
			}
		});

		faces.forEach((elem) => {
			if(dic[elem] !== 2){
				flag = false; 
			}
		});

		return flag;
	}
}

function main(){
	const myStorage = window.localStorage;
	myStorage.setItem('history', '');
	const bufferId = [-1,-1]; 
    const bufferValue = [-1,-1]; 

	const btn = document.getElementsByClassName('play-btn')[0];
	const gobackbtn = document.getElementsByClassName('error-btn')[0];
	const start = document.getElementsByClassName('start')[0];
	const game = document.getElementsByClassName('game')[0];
	const reset = document.getElementsByClassName('reset-btn')[0];
	const errorMessage = document.getElementsByClassName('error-message')[0];

	// create new element
	const success = document.createElement('p');
	const failure = document.createElement('p');
	const quit = document.createElement('button');
	const againbtn = document.createElement('button');
	const lastScore = document.createElement('p');
	againbtn.textContent = 'play again'; 

	document.getElementsByClassName('reset')[0].appendChild(againbtn);
	document.getElementsByClassName('reset')[0].appendChild(lastScore);
	againbtn.classList.add('click'); 
	lastScore.classList.add('click'); 
	reset.classList.add('click'); 
	quit.textContent = 'quit'; 
	gobackbtn.classList.add('click'); 
	quit.classList.add('click'); 
	quit.setAttribute('class', 'quit'); 

	const matchMessage = document.createElement('matchMessage');
	const nonMatchMessage = document.createElement('nonMatchMessage');
	matchMessage.textContent = 'Match! Press OK.'; 
	nonMatchMessage.textContent = 'No Match. Press OK.'; 

	const okbtn = document.createElement('button');
	okbtn.classList.add('click'); 
	okbtn.textContent = 'OK'; 
	success.textContent = 'success!!'; 
	success.setAttribute('class', 'success');
	failure.textContent = 'failure!!'; 
	failure.setAttribute('class', 'failure');
	const turnMessage = document.createElement('p');
	game.appendChild(okbtn); 
	game.appendChild(quit);
	game.insertBefore(turnMessage, quit); 
	game.insertBefore(matchMessage, quit);
	game.insertBefore(nonMatchMessage, quit);
	game.insertBefore(okbtn, quit); 
	// okbtn.appendChild(success); 
	// okbtn.appendChild(failure); 
	game.insertBefore(success, quit); 
	game.insertBefore(failure, quit); 
	// game.appendChild(quit);
	success.classList.add('click'); 
	failure.classList.add('click'); 


	// better create a new css class for it
	matchMessage.classList.add('click'); 
	nonMatchMessage.classList.add('click');

	let cards, turns, faces, counter, hands;
	quit.classList.add('click');  

	btn.addEventListener('click', function(){
		againbtn.classList.add('click'); 

		if(game.querySelector('#board') !== null){
			const oldboard = game.querySelector('#board'); 
			game.removeChild(oldboard); 
		}

		turnMessage.classList.add('click'); 
		okbtn.classList.add('click'); 
		success.classList.add('click'); 
		failure.classList.add('click'); 

		cards = parseInt(document.getElementById('total-cards').value);
		turns = parseInt(document.getElementById('max-turns').value); 
		faces = document.getElementById('card-faces').value.split(','); 
		if(faces.length === 1 && faces[0] === ''){
			faces.splice(0); 
		}
		// show the turn
		game.classList.remove('game'); 
	
		counter = 0;
		hands = 0;

		quit.classList.add('click'); 

		if(cards > 36 || cards < 2 || cards % 2 === 1 || isNaN(cards)){ 
			errorMessage.textContent = "Please re-enter the number of cards (must be even number)!";
			errorMessage.classList.remove('error-message');
			cards = parseInt(document.getElementById('total-cards').value);
		}
		else if(turns < cards/2 || isNaN(turns)){
			errorMessage.textContent = "Please re-enter the max turns!";
			errorMessage.classList.remove('error-message'); 
			turns = parseInt(document.getElementById('max-turns').value); 
		}
		else if(faces.length > 0 && !checkFaces(faces, cards)){
			errorMessage.textContent = "Please re-enter the preset values of faces!";
			errorMessage.textContent += "(the preset values must contain exactly two of every symbol and its number should be cards)";
			errorMessage.classList.remove('error-message');
			faces = document.getElementById('card-faces').value.split(',');
		}
		else{

			success.classList.add('click'); 
			failure.classList.add('click'); 
			turnMessage.classList.remove('click'); 
			turnMessage.textContent = 'Turn ' + hands + '/' + turns;
			quit.classList.remove('click');  
			errorMessage.classList.add('error-message');
			// list.insertBefore(newItem, list.childNodes[0]);
			// to add the grid to the board and show it
			const board = createBoard(cards, faces);

			if(game.querySelector('#board') === null){
				game.insertBefore(board, matchMessage);
				// game.appendChild(board);
			}else{
				const oldboard = game.querySelector('#board'); 
				game.replaceChild(board, oldboard); 
			}
			

			// add event listener for the elements with tag td
			const td = document.getElementsByTagName('td'); 
			for(let i = 0; i < cards; i++){
				td[i].classList.add('td'); 
			}


			for(let i = 0; i < cards; i++){

				td[i].addEventListener('click', function(){

					if(counter === 0){
						this.classList.toggle('td');

						bufferValue[0] = this.textContent; 
						bufferId[0] = this.getAttribute('id');
						counter ++; 
						turnMessage.textContent = 'Turn ' + hands + '/' + turns; 
					}
					else if(counter === 1){
						okbtn.classList.remove('click');
						hands ++;
						turnMessage.textContent = 'Turn ' + hands + '/' + turns; 
						counter ++; 
						this.classList.toggle('td');

						bufferValue[1] = this.textContent; 
						bufferId[1] = this.getAttribute('id');

						if(bufferId[0] !== bufferId[1] && bufferValue[0] === bufferValue[1]){
							matchMessage.classList.remove('click'); 
						}else{
							nonMatchMessage.classList.remove('click'); 
						}


						okbtn.addEventListener('click', () => { 
							matchMessage.classList.add('click'); 
							nonMatchMessage.classList.add('click'); 

							if(bufferId[0] !== bufferId[1] && bufferValue[0] === bufferValue[1]){
								td[bufferId[0]].classList.remove('td');
								td[bufferId[0]].setAttribute('class', 'store');

								td[bufferId[1]].classList.remove('td');
								td[bufferId[1]].setAttribute('class', 'store');	

							}
							else{
								td[bufferId[0]].classList.add('td');
								td[bufferId[1]].classList.add('td'); 
							}

							if(document.querySelectorAll('.store').length === cards){
								reset.classList.remove('click');
								board.classList.add('click');
								success.classList.remove('click');
								quit.classList.add('click');
								againbtn.classList.remove('click'); 

								// const last = myStorage.getItem('history'); 
								// lastScore.classList.remove('click');
								// console.log(myStorage.getItem('history'))
								// if(last === ''){
								// 	lastScore.textContent = 'This is the first game; no history yet!'; 
								// 	const buffer = turnMessage.textContent;
								// 	myStorage.clear(); 
								// 	myStorage.setItem('history', buffer);
								// }else{
								// 	lastScore.textContent = last; 
								// 	const buffer = turnMessage.textContent;
								// 	myStorage.clear(); 
								// 	myStorage.setItem('history', buffer);
								// }
								// lastScore.classList.remove('click'); 
								

								againbtn.addEventListener('click', () => { 

									for(let i = 0; i < cards; i++){
										td[i].removeAttribute('class');	
										td[i].classList.add('td');

									}
									board.classList.remove('click');
									hands = 0; 
									turnMessage.textContent = 'Turn ' + hands + '/' + turns;

									againbtn.classList.add('click'); 
									success.classList.add('click');
									reset.classList.add('click');
									quit.classList.remove('click');
									lastScore.classList.add('click'); 
				
								});

								reset.addEventListener('click', () => { 
									board.classList.add('click');
									start.classList.remove('click');
									game.classList.add('game'); 
									// game.removeChild(board); 
									matchMessage.classList.add('click'); 
									nonMatchMessage.classList.add('click'); 
									reset.classList.add('click');
									againbtn.classList.add('click'); 
									lastScore.classList.add('click'); 
									
								});
							}

							else if(hands >= turns){

								reset.classList.remove('click');
								board.classList.add('click');
								quit.classList.add('click');
								failure.classList.remove('click');
								againbtn.classList.remove('click'); 

								// const last = myStorage.getItem('history'); 
								// console.log(myStorage.getItem('history'))
								// if(last === ''){
								// 	lastScore.textContent = 'This is the first game; no history yet!'; 
								// }else{
								// 	lastScore.textContent = last; 
								// }
								// lastScore.classList.remove('click'); 
								// const buffer = turnMessage.textContent;
								// myStorage.setItem('history', buffer); 


								againbtn.addEventListener('click', () => { 

									for(let i = 0; i < cards; i++){
										td[i].removeAttribute('class');	
										td[i].classList.add('td');

									}
									board.classList.remove('click');
									hands = 0; 
									turnMessage.textContent = 'Turn ' + hands + '/' + turns;

									againbtn.classList.add('click'); 
									failure.classList.add('click');
									reset.classList.add('click');
									quit.classList.remove('click');
									lastScore.classList.add('click'); 

								});

								reset.addEventListener('click', () => { 

									start.classList.remove('click');
									game.classList.add('game'); 
									// game.removeChild(board); 
									matchMessage.classList.add('click'); 
									nonMatchMessage.classList.add('click'); 
									reset.classList.add('click');
									againbtn.classList.add('click'); 
									lastScore.classList.add('click'); 

								});
							}
							okbtn.classList.add('click');
							counter = 0; 
						});
					}
			});

			game.classList.remove('game');
	
			// to hide all the input fields
			start.classList.add('click');
			
			// to show the reset button
			quit.classList.remove('click');
			// const resetButton = document.getElementsByClassName('reset-btn')[0];

		}

			quit.addEventListener('click', function(){
				start.classList.remove('click');
				game.classList.add('game'); 
				// game.removeChild(board); 
				quit.classList.add('quit');
				matchMessage.classList.add('click'); 
				nonMatchMessage.classList.add('click'); 
				lastScore.classList.add('click'); 
			});
		}	
	});	
}

document.addEventListener('DOMContentLoaded', main); 


