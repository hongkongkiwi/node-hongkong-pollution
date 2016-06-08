var HongKongPollution = require('../index.js');

var hongKongPollution = new HongKongPollution({lang: 'en'});

var name = 'Hong Kong Island';

hongKongPollution.getDistrictReadings(name)
  .then(function(districtReadings) {
    // Format in a pretty way
    console.log(JSON.stringify(districtReadings,null,1));
  }).catch(function(err) {
    console.error('There was an error!', err);
  });
