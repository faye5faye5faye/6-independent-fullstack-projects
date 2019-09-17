// app.js
// ======
// bring in dependencies like path, fs, etc.
// express setup goes here

// bring in vfs/FileSystem.js b
// let declare a global variable containing the instance of the class
// contained in FileSystem.js


// read init.json with path.join(__dirname, 'vfs', 'init.json')
// in callback:
// 1. parse json with JSON.parse
// 2. instantiate FileSystem object with object created from parsing init.json
// 3. listen on port 3000


const express = require('express'); 
const path = require('path'); 
const fs = require('./vfs/FileSystem.js');

const app = express(); 

let OS; 

app.set('view engine', 'hbs'); 

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.resolve(__dirname, 'public'))); 


app.get('/', (req, res) => {
	res.render('index'); 
}); 

app.post('/vfs', (req, res) => {
	if(OS === undefined){
		OS = req.query.select;
	}
	
	const command = req.body.command; 

	let pathArr;
	if(req.body.path === '' || req.body.path === '/'){
		pathArr = ['']; 
	}else{
		pathArr = req.body.path.split('/'); 
	}
	const content = req.body.content;

	const file = new fs.FileSystem(); 

	if(command === 'mkdir'){
		let output = ''; 
		if(pathArr.length > 1 && pathArr[pathArr.length - 1] === ''){
			pathArr.pop(); 
		}
		const check = file.makeDirectory(pathArr, content); 
		if(check === 0){
			const arr1 = file.traverseAndList(pathArr); 
			res.render('terminal', {arr1 : arr1, class : OS});
		}
		else if(check === 1){
			output = 'mkdir: ' + content + ': File exists'; 
			res.render('terminal', {output: output, class : OS});
		}
		else{
			output = 'mkdir: No such file or directory'; 
			res.render('terminal', {output: output, class : OS});
		}
	}
	else if(command === 'write'){
		const curr = file.write(pathArr, content); 
		if(curr){
			res.render('terminal', {class : OS});
		}else{
			res.render('terminal', {output: 'No such file or directory', class : OS});
		}
	}
	else{
		res.render('terminal', {class : OS});
	}

}); 


app.get('/vfs', (req, res) => {
	if(OS === undefined){
		OS = req.query.select;
	}

	const command = req.query.command;
	const option = req.query.option;
	const path = req.query.path;

	const file = new fs.FileSystem(); 

	// ls 
	if(command === 'ls'){
		let curr;

		if(path === '/' || path === ''){curr = file.find(['']); }
		else{curr = file.find(path.split('/'));}

		const arr1 = []; 
		const arr2 = []; 
		let output = ''; 

		if(curr === null){
			output = 'ls: No such file or directory'; 
			res.render('terminal', {output: output, class : OS});
		}else if (option === '-l'){
			
				if(curr.hasOwnProperty('files')){
					for(const e in curr['files']){
						let buffer = ''; 
						buffer += curr['files'][e]['permission'] + ' '; 
						buffer += curr['files'][e]['hard-links'] + ' '; 
						buffer += curr['files'][e]['owner-name'] + ' ';
						buffer += curr['files'][e]['owner-group'] + ' '; 
						buffer += curr['files'][e]['size'] + ' '; 
						buffer += curr['files'][e]['last-modified'] + ' ';
						buffer += e; 
						arr1.push(buffer); 
					}
				
				res.render('terminal', {arr1: arr1, class : OS});
			}
			else{
				if(curr.hasOwnProperty('files')){
					for(const e in curr['files']){
						let buffer = ''; 
						buffer += e; 
						arr2.push(buffer); 
					}
				}
				res.render('terminal', {arr2: arr2, class : OS});
			}
		}
	}
	// tree
	else if(command === 'tree'){
		let treeArr; 
		if(path === '/' || path === ''){treeArr = file.tree(['']); } 
		else{treeArr = file.tree(path.split('/')); } 

		if(treeArr !== []){
			res.render('terminal', {treeArr: treeArr, class : OS}); 
		}
		else{
			res.render('terminal', {output: 'tree: No such file or directory', class : OS}); 
		}
	}

	// cat
	else if(command === 'cat'){
		let output = ''; 

		if(path === '/' || path === ''){output = file.cat(['']);} 
		else{output = file.cat(path.split('/'));}

		res.render('terminal', {output: output, class : OS}); 
	}
	else{
		res.render('terminal', {class : OS}); 
	}
}); 



app.listen(3000); 


