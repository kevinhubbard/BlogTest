var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {

	var moment = req.app.locals.moment();
	var db = req.db;
	var posts = db.get('posts');
	posts.find({},{}, function(err, posts){
		res.render('index', { title: 'Home', data: posts, moment: moment.format("MM-DD")});
	});
  
});

module.exports = router;
