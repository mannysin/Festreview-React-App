const express      = require('express');
const router       = express.Router();
const axios        = require('axios')
const Review       = require('../models/Review');
const Festival     = require('../models/Festival');



var eventful = require('eventful-node');
var client = new eventful.Client(`${process.env.EF_API_KEY}`);


router.get('/festivals/:page', (req, res, next)=>{
  axios.get(`http://api.eventful.com/json/events/search?app_key=${process.env.EF_API_KEY}&keywords=music-festival&date=all&sort_order=date&page_size=10&sort_direction=descending&page_number=${req.params.page}`)
  .then((response)=>{
    res.json(response.data)
  })
  .catch((err)=>{
    res.json(err)
  })
})

router.get('/festivals/na/:page', (req, res, next)=>{
  axios.get(`http://api.eventful.com/json/events/search?app_key=${process.env.EF_API_KEY}&keywords=music-festival&l=United+States&date=all&sort_order=date&page_size=10&sort_direction=descending&page_number=${req.params.page}`)
  .then((response)=>{
    console.log(response.data);
    res.json(response.data)
  })
  .catch((err)=>{
    res.json(err)
  })
})

router.get('/festival/:id', (req, res, next)=>{
  axios.get(`http://api.eventful.com/json/events/get?app_key=${process.env.EF_API_KEY}&id=${req.params.id}`)
  .then((response)=>{
    // console.log("hmmmmmmmmm", response.data)
    theID = response.data.id
    // console.log("lvl1 YOYOYO here I am ", theID);
    Festival.findOne({idAPI: theID}).populate('reviews')
    .then(festivalFromDB => {
      // console.log("the response ------------------------------- ", festivalFromDB, response.data)
      data = {
        oneFestival: response.data,
        fromDB: false,
        idAPI: theID,
        // console.log("YOYOYO here I am ", theTitle);
      }
      if(festivalFromDB) {
        
        data.oneFestival = festivalFromDB;
        data.fromDB = true;
        // console.log("YOYOYO here I am in the DB ................................................ ", festivalFromDB);
      }  
      console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< here I AM in the API", response.data)
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", data);
      res.json(data);

    })
    .catch(err => {
      res.json(err);
    })    
  })
  .catch((err)=>{
    res.json(err)
  })
})

router.post('/fest/addFestival',  (req, res, next)=>{
  Festival.findOne({title: req.body.title})
  .then(theFestival =>{
    console.log("adding a fest to the DB", theFestival)
    if(theFestival !== null){
      res.json(theFestival)
    } else {
      Festival.create(req.body)
      .then(theFestival =>{
        res.json(theFestival)
      })
      .catch((err)=>{
        res.json(err)
      })
    }
  })
  .catch((err)=>{
    res.json(err)
  })
})

router.get('/:id/addReview', (req, res, next)=>{
  Festival.findById(req.params.id)
  .then((theFestival)=>{
    res.json({theFestival: theFestival})
  })
  .catch((err)=>{
    res.json(err)
  })    
})

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
        console.log("******************** ", createdReview);
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



module.exports = router;