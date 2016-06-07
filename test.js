var hkPollution = new HongKongPollution({lang: 'en'});

// hkPollution.getPollutionForecast()
//   .then(function(forecast) {
//     console.log(JSON.stringify(forecast,null,2));
//   });

// hkPollution.getDistrictReadings()
//   .then(function(districts) {
//     console.log(JSON.stringify(districts,null,2));
//   });

hkPollution.getAQHIHistory()
  .then(function(aqhi) {
    console.log(JSON.stringify(aqhi.data[0],null,2));
  });
