var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var mongo = require('mongodb');
var monk = require('monk');
var url = 'mongodb://heroku_rmccmj2z:8imor4kqhtosqbp7d90ra71183@ds255347.mlab.com:55347/heroku_rmccmj2z';
var db = monk(url);


// get blog page
router.get('/add', function(req, res, next){
	res.render('post', {title: 'Add blog Post'});
});

router.post('/add',  upload.single('mainimage'), function(req, res, next){
	//get form values
	var title = req.body.title;
	var category = req.body.category;
	var body = req.body.body;
	var author = req.body.author;
	var date = new Date();


	if(req.body.file){
		var mainimage = req.body.file.filename;
	} else {
		var mainimage = 'noimage.jpg';
	}

	req.checkBody('title', 'Title field is required').notEmpty();
	req.checkBody('body', 'Body field is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('addpost', {
			"errors": errors
		});
	} else {
		var post = db.get('posts');
		post.insert({
			"title": title,
			"body": body,
			"category": category,
			"date": date,
			"author": author,
			"mainimage": mainimage
		}, function(err, post){
			if(err) {
				res.send(err);
			}	else {
				req.flash('success', "Post Added");
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;