const express      = require('express');
const router       = express.Router();
const axios        = require('axios')
const User         = require('../models/User');
const Festival     = require('../models/Festival');



var eventful = require('eventful-node');
var client = new eventful.Client(`${process.env.EF_API_KEY}`);



router.get('/festivals/:page_number', (req, res, next) => {
  let prevOffset = Number(req.params.page_number) - 1
  let nextOffset = Number(req.params.page_number) + 1
  let showPrev = true;
  
  client.searchEvents({ 
    keywords: 'music-festival', 
    page_number: req.params.page_number,
    page_size: 20,
   }, function(err, data){

    
    // console.log(data.search.first_item) 
    // console.log(data.search.total_items) 
    // console.log(data.search.page_number)
    // console.log(prevOffset)  
    // console.log(nextOffset) 



    if(err){
        return console.error(err);
    }

    if(data){
      if(data.search.events.event[1].description === ""){
        data.search.events.event[1].description = "yo this is the update"
      } else{ 
        console.log(data.search.events.event[0].title)
        console.log(data.search.events.event[0].$.id)
        console.log(data.search.events.event[0].description)
        res.json(data.search.events.event)
      }
    }


       
        
      
      // console.log("this isnt my resjson ", + data)
      // console.log(data.search.events.event[6])
      // console.log('Recieved ' + data.search.first_item + ' events');
      // console.log('Recieved ' + data.search.total_items + ' events');
      // console.log('Recieved ' + data.search.page_size + ' pages');
      // console.log('Recieved ' + data.search.page_count + ' counts');
     
      // console.log('you dummy')
  
    // for(var i in data.search.events){
    //   let dataBack = data.search.events[i]
    //   // console.log(dataBack);
    //   console.log('HERE IS THE TITLE:' + dataBack[1].title)
    //   if(dataBack[1].description === ""){
    //     dataBack[1].description = "yo this is the update"
    //   }
    //   console.log('HERE IS THE TITLE:' + dataBack[1].description)
    //   console.log('HERE IS THE TITLE:' + dataBack[1].start_time)
    // }
  })
  // .then(data => {
  //   console.log(data.body);
  //   res.json(response)
  // 
  // }).catch(error => {
  //   res.json(error);
  // });

});


router.get('/festival/:id', (req, res, next)=>{
  axios.get(`http://api.eventful.com/json/events/get?app_key=${process.env.EF_API_KEY}&id=${req.params.id}`)
  .then((response)=>{
    res.json({infoFromApi: response.data})
  })
  .catch((err)=>{
    res.json(err)
  })
})



module.exports = router;