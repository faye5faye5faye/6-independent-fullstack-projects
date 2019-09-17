const express = require('express');
const mongoose = require('mongoose'); 
const sanitize = require('mongo-sanitize');
const session = require('express-session');

const db = require('./db.js');
const Book = mongoose.model('Book');

const path = require('path');
const app = express();

app.set('trust proxy', 1); 
app.set('view engine', 'hbs');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use(express.static(path.resolve(__dirname, '../public'))); 
app.use(express.urlencoded({extended: false}));

const sessionOptions = { 
	secret: 'secret for signing session id', 
	saveUninitialized: false, 
	resave: false 
};
app.use(session(sessionOptions));


// your code goes here!

app.get("/", (req, res) => {
	res.redirect('/books'); 
}); 


app.get("/books", (req, res) => {
	req.session.count = (req.session.count || 0) + 1; 
	const counter = req.session.count; 


	let books;  
	if(req.query.select === undefined){
		Book.find(function(err, curr){
			if(err) {console.log(err);}
			else {
				books = curr; 
				res.render('book', {books, counter}); 
			}
		});
	}else{
		const key = req.query.select; 
		const value = req.query.value; 
	
		if(key === 'author'){
			Book.find({author: value}, function(err, curr){
			if(err) {console.log(err);}
			else if (curr.length === 0){
				res.render('book', {comment: 'Book not found!'}); 
			}else{
				books = curr;
				res.render('book', {books, counter}); 
			}
		}); 
		}else{
			Book.find({title: value}, function(err, curr){
			if(err) {console.log(err);}
			else if (curr.length === 0){
				res.render('book', {comment: 'Book not found!'}); 
			}else{
				books = curr;
				res.render('book', {books, counter}); 
			}
		}); 
		}
	}
});


app.get("/books-new", (req, res) => {
	req.session.count = (req.session.count || 0) + 1; 
	const counter = req.session.count; 


	res.render('create', {counter});
}); 


app.post("/books-new", (req, res) => {
	req.session.count = (req.session.count || 0) + 1; 
	const counter = req.session.count; 


	const title = sanitize(req.body.title); 
	const author = sanitize(req.body.author); 
	const isbn = sanitize(req.body.isbn); 

	const buffer = {}; 
	buffer['title'] = title; 
	buffer['author'] = author; 
	buffer['isbn'] = isbn; 

	if(title === '' || author === '' || isbn === ''){
		res.render('create', {comment: "Cannot create the book. Maybe try again?", counter}); 
	}else{
		const b = new Book(buffer);
		b.save((err) => {
			if(err) {
				res.render('create', {comment: "Cannot save the book. Maybe try again?", counter}); 
			} 
			else{
				res.redirect('/books');
			}
		}); 
	}
}); 



app.get("/books/:slug", (req, res) => {
	req.session.count = (req.session.count || 0) + 1; 
	const counter = req.session.count; 


	const slug = sanitize(req.params.slug); 
	Book.find({slug: slug}, function(err, curr){
		if(err){
			console.log(err); 
			res.render('book'); 
		}else if(curr.length === 0){
			res.render('temp', {comment: 'Oppsss Book was not found!!', counter: counter});
		}
		else{ 
			const reviews = curr[0]['reviews']; 
			// const title = curr[0]['title']; 
			// const author = curr[0]['author']; 

			if(reviews.length === 0){
				//, author, title
				res.render('each', {comment: 'No review yet!', slug: slug, counter: counter, author: curr[0]['author'], title: curr[0]['title']}); 
			}else{
				reviews.forEach((elem)=> { 
					if(elem["rating"] === 0){
						elem["stars"] = ""; 
					}else if(elem["rating"] === 1){
						elem["stars"] = "⭐️"; 
					}else if(elem["rating"] === 2){
						elem["stars"] = "⭐️⭐️"; 
					}else if(elem["rating"] === 3){
						elem["stars"] = "⭐️⭐️⭐️"; 
					}else if(elem["rating"] === 4){
						elem["stars"] = "⭐️⭐️⭐️⭐️"; 
					}else if(elem["rating"] === 5){
						elem["stars"] = "⭐️⭐️⭐️⭐️⭐️"; 
					}
				});
				res.render('each', {review: reviews, slug: slug, counter: counter, author: curr[0]['author'], title: curr[0]['title']}); 
			}
		}
	}); 
}); 


app.post("/books/:slug/comments", (req, res) => {
	req.session.count = (req.session.count || 0) + 1; 
	const counter = req.session.count; 


	const slug = sanitize(req.params.slug); 

	const name = sanitize(req.body.name); 
	const rating = sanitize(req.body.rating); 
	const text = sanitize(req.body.text); 
	let newReview = null; 
	if(rating !== '' && text !== ''){
		newReview = new db.Review({rating: rating, name : name, text : text});
		
		Book.findOneAndUpdate({slug: slug}, {$push: {reviews: newReview}}, function(err){
			if(err){
				console.log(err); 
				res.render('each', {comment: 'Review added failed!', slug: slug, counter: counter}); 
			}else{
				const redirectPath = "/books/" + slug; 
				res.redirect(redirectPath); 
			}
		}); 

	}else{
		res.render('each', {comment: 'Added failed! Some required values are left blank!', slug: slug, counter: counter}); 
	}
}); 


app.listen(3000);


