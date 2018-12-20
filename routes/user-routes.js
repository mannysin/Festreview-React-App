const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');

const User = require('../models/User');

const passport = require('passport');


router.post('/signup', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  


    if(password.length < 7){
        res.status(400).json({ message: 'Please make your password at least 8 characters long for security purposes.' });
        return;
    }
  
    User.findOne({ username }, (err, foundUser) => {

        if(err){
            res.status(500).json({message: "Oops, something happened, please try signing up again."});
            return;
        }

        if (foundUser) {
            res.status(400).json({ message: 'This username is already taken! Please choose another one.' });
            return;
        }
  
        const salt     = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);
  
        const aNewUser = new User({
            username: username,
            password: hashPass,
            firstName: "Fest",
            lastName: "Goer",
            avatar: "https://www.edgehill.ac.uk/health/files/2017/12/blank-profile.png",
            bio: "Avid fest goer ready to provide honest and concise reviews!",
        });
  
        aNewUser.save(err => {
            if (err) {
                res.status(400).json({ message: 'Saving user to database went wrong.' });
                return;
            }
            
            req.login(aNewUser, (err) => {

                if (err) {
                    res.status(500).json({ message: 'Login after signup went bad.' });
                    return;
                }

                res.json(aNewUser);
            });
        });
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, theUser, failureDetails) => {
        if (err) {
            res.json({ message: 'Something went wrong authenticating user' });
            return;
        }
    
        if (!theUser) {
            res.json(failureDetails);
            return;
        }

        req.login(theUser, (err) => {
            if (err) {
                res.json({ message: 'Session save went bad.' });
                return;
            }

            res.json(theUser);
        });
    })(req, res, next);
});

router.post('/logout', (req, res, next) => {
    req.logout();
    res.json({ message: 'Log out success!' });
});


router.get('/loggedin', (req, res, next) => {
    console.log('hi', req.user)
    if (req.isAuthenticated()) {
        res.json(req.user);
        return;
    }
    res.status(500).json({ message: 'Unauthorized', loggedInUser:false });
});

router.get('/profile/:_id', (req, res, next)=>{
    User.findById(req.params._id).populate('reviews').populate('comments')
    .then(userFromDB => {
        console.log('what the heck', userFromDB)
      res.json(userFromDB);
    })
    .catch(err => {
        res.status(500).json({ message: 'Unauthorized', loggedInUser:false });
    })
  })
  
//   router.get('/profile/:_id/edit-profile', (req, res, next)=>{
//     User.findById(req.params._id)
//     .then(userFromDB => {
//         console.log("iamauseriamauser", userFromDB)
//       res.json(userFromDB);
//     })
//     .catch(err => {
//       res.json(err);
//     })
//   })
  
  router.post('/:_id/update', (req, res, next)=>{
    const changes = req.body;
  
    User.findByIdAndUpdate(req.params._id, changes)
    .then((response)=> {
      res.json(response);
    })
    .catch((err)=>{
        res.json(err)
    })
  });




module.exports = router;
