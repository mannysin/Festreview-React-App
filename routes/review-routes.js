const express    = require('express');
const router     = express.Router();
const Review     = require('../models/Review');
const User       = require('../models/User');
const Festival   = require('../models/Festival')

router.post('/:id/addReview', (req, res, next)=>{
    // if(!req.user) {
    //     res.status(500).json("error", "You must be logged in to post! Not a member? Sign up!");
    //   }
//   const newReview = req.body;
    // newReview.author = req.user.username;
    // newReview.test.push("testy");
    console.log("WTFWTFWTFWTFWTFWTFWTFWTFWTFWTFWTFWTFWTFWTFWTFWTFWTFWTFWTFWTFWTFWTFWTFWTF &*&*&*&**&*&*&&*&*&*&*&*", req.body);
    Festival.findOne({idAPI: req.params.id}) 
    .then(festivalFromDB => {
  console.log('asdfasdfasdfasdfasdfasdfasdfasdf', festivalFromDB)
  
    Review.create(req.body)
  .then(createdReview => {
    console.log(">>>    >>>>>>    >>>>>    >>>>     >>>> ", createdReview);
    
        // console.log("festival prior to pushing review ^^^^^^^^^^^^^^^^^ ", festivalFromDB);
        festivalFromDB.reviews.push(createdReview._id),
        // console.log("******************** ", festivalFromDB);
        festivalFromDB.save()
        // console.log("<>>><><>><><>><><>><<>><<><><<><>><<>><><", req.user)
        .then(updatedFestival => {
            console.log("ytrdfghjkuytrdcvbhjuytrdfcvbhjuytredfghytredfvbghuytredfcvbghytredcfvghuytrdcvghi98765435678765434567876543wsdfghjytrfdcvbhjuytredcvgbhytrdcvhjui876543e5678976543wsdfghjiuytredcvbjo9876543werthjnbvcdse56789876543ewrtghbvcdser567543ertghbvdserty987654efgbvcdser4567");
            createdReview.set({festival: updatedFestival._id})
            // createdReview.set({author: theUser._id})
            createdReview.save()
            .then(updatedReview => {
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ", updatedReview);
                // console.log("############################# ", updatedFestival);
                // res.json(updatedFestival);
                
                updatedReview.set({author: req.user._id})
                updatedReview.save()
                .then((updatedReviewUser) => {
                    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%% ", updatedReviewUser);
                    console.log("############################# ", updatedFestival);
                    res.json(updatedFestival);
                })
                .catch(err => {
                    res.json(err);
                })
            })
            .catch(err => {
                res.json(err);
            })
        })
        .catch(err => {
          res.json(err);
        })
      })
      .catch(err => {
        res.json(err);
      })
  })
  .catch(err => {
    res.json(err);
  })
})

router.get('/reviews/:ID', (req, res, next)=>{
    Review.findById(req.params.ID).populate('author').populate({path : 'comments', populate: {path: 'author'}})
    .then((theReview)=>{

        res.render('reviews/details', theReview)
    })
    .catch((err)=>{
        next(err);
    })
});

router.get('/reviews/:ID/edit', (req, res, next)=>{
    Review.findById(req.params.ID)
    .then((theReview)=>{
            if(!req.user._id.equals(theReview.author)) {
                req.flash("error", "You can only edit your own posts.");
                res.redirect("/reviews");
            }
        res.render('reviews/edit', {theReview: theReview})    
    })
    .catch((err)=>{
        next(err);
    })
});

router.post('/reviews/:ID', (req, res, next)=>{
    if(!req.user.ID) {
        req.flash("error", "You must be the author to edit a review!");
        res.redirect("/reviews");
        return
    }
    Review.findByIdAndUpdate(req.params.ID, {
        author: req.user._id,
        title: req.body.title,
        comment: req.body.comment
    })
    .then(()=>{
        res.redirect('/reviews');
    })
    .catch((err)=>{
        next(err);
    })
});

router.post('/reviews/:ID/delete', (req, res, next)=>{
    Review.findById(req.params.ID).populate('author')
    .then((theReview)=>{
        if(!req.user._id.equals(theReview.author)) {
            req.flash("error", "You can only delete your own posts!");
            res.redirect("/reviews");
            return
        }
    Review.findByIdAndRemove(req.params.ID).populate('author')
    .then((x)=>{
        res.redirect('/reviews')
        })   
    })
    .catch((err)=>{
        next(err);
    })


    
    .catch((err)=>{
        next(err);
    })
  });


module.exports = router;