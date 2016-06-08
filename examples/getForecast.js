var HongKongPollution = require('../index.js');

var hongKongPollution = new HongKongPollution({lang: 'en'});

hongKongPollution.getForecast()
  .then(function(forecast) {
    // Format in a pretty way
    console.log(JSON.stringify(forecast,null,1));
  }).catch(function(err) {
    console.error('There was an error!', err);
  });
