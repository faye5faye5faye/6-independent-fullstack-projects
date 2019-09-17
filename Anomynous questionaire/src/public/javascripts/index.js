// TODO 
// Add client side JavaScript
//

function cb(){
	const main = document.querySelector('main'); 
	const answertext = document.querySelector('#answer-text');
	const modalanswer = document.querySelector('#modal-answer');
	const currId = modalanswer.getAttribute('value'); 

	const xhr = new XMLHttpRequest();
	xhr.open('POST', '/questions/'+ currId +'/answers/', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	const newbtn = document.getElementById(currId);
	const answer = answertext.value;
	xhr.send('answer=' + answer);

	xhr.addEventListener('load', function(){
		const newanswer = document.createElement('li'); 

		const check = JSON.parse(xhr.responseText); 
			if(check.key === 'error'){
				console.log(check.value); 
			}else{
				const buffer = check.answers; 
				newanswer.textContent = buffer[buffer.length - 1]; 
				main.insertBefore(newanswer, newbtn); 
				modalanswer.classList.add('modal'); 
			}
		answertext.value = ''; 
	}); 
}


function answer(){
	const modalanswer = document.querySelector('#modal-answer');
	const okbtn = document.querySelector('#create-answer'); 
	const cancelbtn = modalanswer.querySelector('.close');
	const answertext = document.querySelector('#answer-text');

	const currId = this.getAttribute('id'); 
	modalanswer.classList.add('open'); 
	modalanswer.classList.remove('modal'); 
	modalanswer.setAttribute('value', currId); 

	okbtn.addEventListener('click', cb); 

	cancelbtn.addEventListener('click', function(){
		modalanswer.classList.add('modal'); 
		answertext.value = ''; 
	});
}

function addnewquestion(){
	const modalquestion = document.querySelector('#modal-question'); 
	const questiontext = document.querySelector('#question-text');
	const question = questiontext.value;

	const xhr = new XMLHttpRequest();
	xhr.open('POST', '/questions/', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	xhr.send('question=' + question); 

	xhr.addEventListener('load', function(){
		const main = document.querySelector('main'); 
		const elem = JSON.parse(xhr.responseText); 
		if(elem.key === 'error'){
			console.log(elem.value); 
		}else{
			const curr = document.createElement('h3'); 
			curr.textContent = elem.question;

			const newbtn = document.createElement('input'); 
			newbtn.setAttribute('type', "button"); 
			newbtn.setAttribute('value', "Add An Answer");

			const answers = elem.answers; 
			answers.forEach((a) => {
				const ans = document.createElement('li'); 
				ans.textContent = a; 
				curr.appendChild(ans);	
			});

			main.appendChild(curr);
			curr.setAttribute('_id', elem['_id']); 

			main.appendChild(newbtn);
			newbtn.setAttribute('id', elem['_id']); 
			newbtn.addEventListener('click', answer); 
			// newbtn.classList.add('');  
			questiontext.value = ''; 
		}
		modalquestion.classList.add('modal');
	}); 
}


function Modal(){
	const okbtn = document.querySelector('#create-question');
	const modalquestion = document.querySelector('#modal-question'); 
	const cancelbtn = modalquestion.querySelector('.close');
	const questiontext = document.querySelector('#question-text');

	modalquestion.classList.remove('modal'); 
	modalquestion.classList.add('open'); 
	// modalquestion.classList.add('modal-content'); 

	okbtn.addEventListener('click', addnewquestion); 

	cancelbtn.addEventListener('click', function(){
		modalquestion.classList.add('modal'); 
		questiontext.value = ''; 
	}); 
}


function loadAll(){
	const xhr = new XMLHttpRequest();
	xhr.open('GET', '/questions/', true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	
	xhr.addEventListener('load', function(){
		// console.log(xhr.responseText)
		if (xhr.status >= 200 && xhr.status < 400) {
			const main = document.querySelector('main'); 
			const messages = JSON.parse(xhr.responseText);

			messages.forEach((elem) => {
				const curr = document.createElement('h3'); 
				// curr.classList.add('content'); 
				curr.textContent = elem.question;

				const answers = elem.answers; 

				const newbtn = document.createElement('input'); 
				main.appendChild(curr);
				main.appendChild(newbtn);
				curr.setAttribute('_id', elem['_id']); 
				newbtn.setAttribute('type', "button"); 
				newbtn.setAttribute('value', "Add An Answer"); 
				newbtn.setAttribute('id', elem['_id']); 

				answers.forEach((a) => {
					const ans = document.createElement('li'); 
					ans.textContent = a; 
					main.insertBefore(ans, newbtn); 
				});
				
				newbtn.addEventListener('click', answer);
			}); 
		
		}else{
			console.log('something went wrong!'); 
		}
	});
	xhr.send();
}


function main(){
	loadAll(); 
	const askbtn = document.querySelector('#btn-show-modal-question'); 
	askbtn.addEventListener('click', Modal); 

}

document.addEventListener("DOMContentLoaded", main);
