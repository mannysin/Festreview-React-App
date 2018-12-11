const express      = require('express');
const router       = express.Router();
const axios      = require('axios')
const User         = require('../models/User');
const Festival     = require('../models/Festival');



var eventful = require('eventful-node');
var client = new eventful.Client(`${process.env.EF_API_KEY}`);


router.get('/events', (req, res, next) => {
  


  client.searchEvents({ keywords: 'music-festival' }, function(err, data){
    console.log(data.search.events.event)  
    
    if(err){
        return console.error(err);
    }

    if(data){
      res.json(data.search.events.event)
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



module.exports = router;