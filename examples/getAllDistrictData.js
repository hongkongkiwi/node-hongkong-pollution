var HongKongPollution = require('../index.js');

var hongKongPollution = new HongKongPollution({lang: 'en'});

hongKongPollution.getAllDistrictReadings()
  .then(function(allDistrictReadings) {
    // Format in a pretty way
    console.log(JSON.stringify(allDistrictReadings,null,1));
  }).catch(function(err) {
    console.error('There was an error!', err);
  });
