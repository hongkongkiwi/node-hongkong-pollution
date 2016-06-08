var HongKongPollution = require('../index.js');

var hongKongPollution = new HongKongPollution({lang: 'en'});

hongKongPollution.getAQHIHistory()
  .then(function(aqhiHistory) {
    // Format in a pretty way
    console.log(JSON.stringify(aqhiHistory,null,1));
  }).catch(function(err) {
    console.error('There was an error!', err);
  });
