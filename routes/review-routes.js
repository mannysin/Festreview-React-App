const express    = require('express');
const router     = express.Router();
const Review     = require('../models/Review');
const Festival   = require('../models/Festival');
const User       = require('../models/User');

router.post('/:id/addReview', (req, res, next)=>{
  const newReview = req.body;
    // newReview.author = req.user.username;
  console.log('this is it', req.body, req.params, req.user)
  Review.create(newReview).then(createdReview => {
     console.log(">>>>>>>>>>>>>>>>>>>>>>???? ", createdReview);
     Festival.findOne({idAPI:req.params.id}).then(festivalFromDB => {
        console.log("festival prior to pushing review ^^^^^^^^^^^^^^^^^ ", festivalFromDB);
        festivalFromDB.reviews.push(createdReview),
        console.log("******************** ", festivalFromDB);
        festivalFromDB.save()
        .then(updatedFestival => {
            // User.findByIdAndUpdate(req.user._id, {$push: {reviews: createdReview._id}})
            // .then(updatedUser => {
            //     console.log("the updated user info with review added to user reviews --------- ", updatedUser);
            //     res.redirect('/reviews');
            //     console.log("############################# ", updatedfestival);
            //     res.json(updatedUser)
            // })
            console.log(updatedFestival)
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
    console.log('reviews ID', req.params.ID)
    Review.findOne({idAPI: req.params.ID}).populate('author').populate({path : 'comments', populate: {path: 'author'}})
    .then((theReview)=>{

        res.json(theReview)
    })
    .catch((err)=>{
        next(err);
    })
});

router.get('/reviews/:ID/edit', (req, res, next)=>{
    console.log('reviews ID', req.params.ID)
    Review.findById(req.params.ID)
    .then((theReview)=>{
            if(!req.user._id.equals(theReview.author)) {
                req.flash("error", "You can only edit your own posts.");
                res.json(theReview);
            }
        res.json(theReview)    
    })
    .catch((err)=>{
        next(err);
    })
});

router.post('/reviews/:ID', (req, res, next)=>{
    if(!req.user.ID) {
        res.json({message: 'You can only edit your own posts!'})
        res.json("/reviews");
        return
    }
    Review.findByIdAndUpdate(req.params.ID, {
        author: req.user._id,
        title: req.body.title,
        comment: req.body.comment
    })
    .then(()=>{
        res.json('/reviews');
    })
    .catch((err)=>{
        res.json(err);
    })
});

router.post('/reviews/:ID/delete', (req, res, next)=>{
    Review.findById(req.params.ID).populate('author')
    .then((theReview)=>{
        if(!req.user._id.equals(theReview.author)) {
            console.log('NOT DELETED', theReview, this.state)
            res.json({message: 'You can only delete your own posts!'})
            return
        }
    Review.findByIdAndRemove(req.params.ID).populate('author')
    .then((deletedReview)=>{
        if(deletedReview === null){
            res.json({message: 'sorry this review could not be found'})
            return;
        } 

        res.json([
            {message: 'Review successfully deleted!'},
            deletedReview
        ])
    })
    .catch((err)=>{
        next(err);
    })


    
    .catch((err)=>{
        next(err);
    })
    })
  });


module.exports = router;