const express    = require('express');
const router     = express.Router();
const Review     = require('../models/Review');
const User       = require('../models/User');

router.post('/:id/addReview', (req, res, next)=>{
  const newReview = req.body;
    // newReview.author = req.user.username;
    newReview.test = "hm";
  
  Review.create({newReview})
  .then(createdReview => {
    // console.log(">>>>>>>>>>>>>>>>>>>>>> ", createdReview);
    Festival.findById(req.params.id) 
      .then(festivalFromDB => {
        // console.log("festival prior to pushing review ^^^^^^^^^^^^^^^^^ ", festivalFromDB);
        festivalFromDB.test2.push(createdReview),
        festivalFromDB.test.push(createdReview),
        festivalFromDB.soundRating.push(createdReview.soundRating),
        console.log("******************** ", festivalFromDB);
        festivalFromDB.save()
        .then(updatedFestival => {
          // console.log("############################# ", updatedfestival);
          res.json(updatedFestival)
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