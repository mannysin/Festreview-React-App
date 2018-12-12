const express      = require('express');
const router       = express.Router();
const axios        = require('axios')
const Review         = require('../models/User');
const Festival     = require('../models/Festival');



var eventful = require('eventful-node');
var client = new eventful.Client(`${process.env.EF_API_KEY}`);


router.get('/festivals/:page', (req, res, next)=>{
  axios.get(`http://api.eventful.com/json/events/search?app_key=${process.env.EF_API_KEY}&keywords=music-festival&date=all&sort_order=date&page_size=20&sort_direction=descending&page_number=${req.params.page}`)
  .then((response)=>{
    res.json({infoFromApi: response.data})
  })
  .catch((err)=>{
    res.json(err)
  })
})

router.get('/festival/:id', (req, res, next)=>{
  axios.get(`http://api.eventful.com/json/events/get?app_key=${process.env.EF_API_KEY}&id=${req.params.id}`)
  .then((response)=>{
    theID = response.data.id
    Festival.findOne({idAPI: theID})
    .then(festivalFromDB => {
      data = {
        oneFestival: response.data,
        fromDB: false,
        idAPI: theID
      }
      console.log("YOYOYO here I am ", festivalFromDB);
      if(festivalFromDB !== null) {
        
        data.oneFestival = festivalFromDB;
        data.fromDB = true;
        console.log("YOYOYO here I am in the DB ", festivalFromDB);
      }  
      res.json({infoFromApi: response.data})

    })
    .catch(err => {
      res.json(err);
    })    
  })
  .catch((err)=>{
    res.json(err)
  })
})

router.post('/festival/addFestival',  (req, res, next)=>{
  Festival.findOne({idAPI: req.body.id})
  .then(theFestival =>{
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



module.exports = router;