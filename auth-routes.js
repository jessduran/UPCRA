const bcrypt = require('bcrypt');
const express = require('express');
const User = require('./models').User;
const Work = require('./models').Work;
const PublishedWork = require('./models').PublishedWork;
const database = require('./database');
const router = new express.Router();

router.post('/signup', function(req, res){
	const student_id = req.body.student_id;
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	const confirm_password = req.body.confirm_password;

	User.findOne({ where: { email: email } }).then(
		function(user) {
			if (user !== null) {
				req.flash('signUpMessage', 'Email is already in use. ');
				return res.redirect('/');
			}

			if (password !== confirm_password) {
				req.flash('signUpMessage', 'Passwords do not match. ');
				return res.redirect('/');
			}

			const salt = bcrypt.genSaltSync();
			const hashedPassword = bcrypt.hashSync(password, salt);

			database.transaction(function(transac){
				return User.create({
					student_id: student_id,
					name: name,
					email: email,
					password: hashedPassword,
					salt: salt
				}, {transaction: transac}).then(function(){
					return res.redirect('/');
				});
			});
		});
});

router.post('/signin', function(req, res){
	const email = req.body.email;
	const password = req.body.password;
	const remember = req.body.remember;

	User.findOne({ where: { email: email} }).then(function(user){
			if (user == null){
				req.flash('signInMessage', 'Incorrect email. ');
				return res.redirect('/');
			}

			const match = bcrypt.compareSync(password, user.password);

			if(!match) {
				req.flash('signInMessage', 'Incorrect password. ');
				return res.redirect('/');
			}

			req.flash('statusMessage', 'Signed in successfully!');
			req.session.currentUser = user.email;

			if(remember) {
				req.session.cookie.maxAge = 1000 * 60 * 60;
			}

			var name = user.id;
			res.redirect('/profile');
	});
})

module.exports = router;
