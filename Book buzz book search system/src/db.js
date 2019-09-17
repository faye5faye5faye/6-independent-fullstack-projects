// db.js

const mongoose = require('mongoose'); 
const URLSlugs = require('mongoose-url-slugs');

// set the two schemas
const ReviewSchema = new mongoose.Schema({
	rating: {type : Number, required: true, min: 0, max: 5},
	name: String, 
	text: {type : String, required: true},
});

const BookSchema = new mongoose.Schema({
	title: {type : String, required: true},
	author: {type : String, required: true},
	isbn: {type : String, required: true},
	reviews: [ReviewSchema]
});

BookSchema.plugin(URLSlugs('title author'));

// register for models
const Review = mongoose.model('Review', ReviewSchema); 
const Book = mongoose.model('Book', BookSchema); 


// mongoose.model("Reviews", ReviewSchema); 
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/hw05', {useNewUrlParser: true});


module.exports = {
	Book, Review
};
