const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const consolidate = require('consolidate');
const database = require('./database');
const User = require('./models').User;
const Work = require('./models').Work;
const PublishedWork = require('./models').PublishedWork;
const multer = require('multer');

const app = express();

app.set('views', './templates');
app.engine('html', consolidate.nunjucks);

app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieparser('secret-cookie'));
app.use(session({ resave: false, saveUninitialized: false, secret: 'secret-cookie' }));
app.use(flash());

app.use('/static', express.static('./static'));
app.use('/files', express.static('./uploads'));
app.use(require('./auth-routes'));

app.get('/', function(req, res){
	res.render('index.html');
});

app.get('/profile', requireSignedIn, function(req, res){
	const email = req.session.currentUser;
	User.findOne({ where: { email: email } }).then(function(user) {
		res.render('profile.html',{
			user: user
		});
	});
});

const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, './uploads');
	},
	filename: function(req, file, cb){
		const ext = file.originalname.split('.').pop();
		const filename = (new Date()).getTime() + '.' + ext;
		cb(null, filename);
	}
});
const upload = multer({ storage: storage });


app.post('/upload-file', requireSignedIn, upload.single('file'),function(req, res){
	const email = req.session.currentUser;
	const title = req.body.title;
	const date = req.body.date;

	User.findOne({ where: { email: email } }).then(function(user){
		const user_id = user.id;
		database.transaction(function(transc){
			return Work.create({
				title: title,
				date: date,
				file: '/files/' + req.file.filename
			}, {transaction: transc}).then(function(
				work){
				return PublishedWork.create({
					user_id: user_id,
					work_id: work.id
				}, {transaction: transc});
			});
		});

	}).then(function(){
		req.flash('uploadMessage', 'File uploaded successfully!');
		return res.redirect('/profile');
	});
});

app.post('/search', function(req, res){
	const category = req.body.category;
	if(category == "title"){
		const searchFor = req.body.key;
		Work.findAll({ where: { title: { $iLike: '%' + searchFor + '%'}}
			}).then(function(works){
			res.render('search.html', {
				works: works
			});
		});
	}
	if(category == "field"){
		const searchFor = req.body.key;
		Work.findAll({ where: { field: { $iLike: '%' + searchFor + '%'}}
			}).then(function(works){
			res.render('search.html', {
				works: works
			});
		});
	}
});

app.get('/search', function(req, res){
	res.render('search.html');
})

app.get('/listing', function(req, res){
	
});


app.get('/file/:id', function(req, res){
	const work_id = req.params.id;

	PublishedWork.findOne({ where: {work_id: work_id} }).then(function(file){
		const user = file.user_id;
		User.findOne({ where: { id: file.user_id }}).then(function(user){
			Work.findOne({ where: { id: file.work_id }}).then(function(file){
				res.render('file.html', {
					file: file,
					user: user
				});
			});	
		});
		
	});
});

function requireSignedIn(req, res, next) {
    if (!req.session.currentUser) {
        return res.redirect('/');
    }
    next();
}

app.listen(3000, function(){
	console.log('Server now listening at port 3000');
});