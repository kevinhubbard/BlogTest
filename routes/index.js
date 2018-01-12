var express = require('express');
var router = express.Router();
var monk = require('monk');
var url = 'localhost:27017/blog';
var db = monk(url);

/* GET home page. */
router.get('/', function(req, res, next) {
	var db = req.db;
	var posts = db.get('posts');
	posts.find({},{}, function(err, posts){
		res.render('index', { title: 'Home', data: posts });
	});
  
});

module.exports = router;
