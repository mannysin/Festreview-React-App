const express    = require('express');
const router     = express.Router();
const Review     = require('../models/Review');
const Comment    = require('../models/Comment');
const User       = require('../models/User');

router.get('/:id/comments/new', (req, res, next) => {
  Review.findById(req.params.id).populate('author')
  .then((review)=>{
      res.json({review})
  })
  .catch((err)=>{
      res.json(err);
  })
});

router.post('/:id/comments/create', (req, res, next)=>{
  // if(!req.user) {
  //   res.status(500).json("error", "You must be logged in to post! Not a member? Sign up!");
  // }
  const newComment = req.body;
  newComment.author = req.user._id;
  newComment.review = req.params.id;
    Comment.create(newComment)
    .then((comment)=>{
      Review.findByIdAndUpdate(req.params.id, {$push: {comments: comment._id}})
      .then((user)=>{
        User.findByIdAndUpdate(req.user._id, {$push: {comments: comment._id}})
        .then(x => {
          res.json(comment);
        })
      })
      .catch((err)=>{
        res.json(err)
      })
      .catch((err) =>{
        res.json (err)
      })
    })
    .catch((err)=>{
        res.json(err)
    })
});

router.get('/comments/:ID', (req, res, next)=>{
  Comment.findById(req.params.ID).populate('author').populate('review')
  .then((theComment)=>{
      res.json(theComment)
  })
  .catch((err)=>{
      res.json(err);
  })
});

router.post('/comments/:ID/delete', (req, res, next)=>{
  Comment.findByIdAndRemove(req.params.ID)
  .then((deletedComment)=>{
    if(deletedComment === null){
        res.json({message: 'sorry this comment could not be found'})
        return;
    } 

    res.json([
        {message: 'Comment successfully deleted!'},
        deletedComment
    ])
})
.catch((err)=>{
    res.json(err)
})
});

module.exports = router;