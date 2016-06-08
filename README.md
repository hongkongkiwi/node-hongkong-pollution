Hong Kong Air Quality Health Data API
=====================================

## What is this for?

Air Quality in Hong Kong is a big deal (mainly because it can vary considerably). I wanted to create a air monitoring solution that would tell me when it was more polluted outside. Luckily the government has a strong scientific team to monitor and give access via an official website an app. As part of the Hong Kong OpenData initiative they also offer [RSS feeds](http://www.aqhi.gov.hk/epd/ddata/html/out/aqhirss_Eng.xml) for the data.

I've found that the official feed is lacking a lot of detail, so instead of using that, I looked at the unofficial JSON feeds that the mobile app uses and created a helpful node module to parse those. They are a bit strange in terms of the formatting, so I've tried to kind of nudge it into a format that's a bit easier to process.


## Install

`npm install --save hongkong-pollution`


## Usage

When creating the instance, you can pass some options, for now, only the language code is supported, possible values are 'en' English, 'tc' Traditional Chinese or 'sc' Simplified Chinese.

```javascript
var HongKongPollution = require('hongkong-pollution');

var hkPollution = HongKongPollution({lang: 'en'});

hkPollution.getForecast().then(function(forecast){
    console.log(forecast);
});
```


## Supported Methods

* [`getForecast()`](https://github.com/hongkongkiwi/node-hongkong-pollution/blob/master/examples/getForecast.js)
* [`getAllDistrictReadings()`](https://github.com/hongkongkiwi/node-hongkong-pollution/blob/master/examples/getAllDistrictData.js)
* [`getDistrictReadings(districtName)`](https://github.com/hongkongkiwi/node-hongkong-pollution/blob/master/examples/getSpecificDistrictReading.js) - Note: districtName is optional
* [`getAQHIHistory(districtNameOrId)`](https://github.com/hongkongkiwi/node-hongkong-pollution/blob/master/examples/getSpecificDistrictReading.js) - Note: districtNameOrId is optional

## Example data

All methods return JSON, please see the examples linked above for more info on how to call each method.

```javascript
hongKongPollution.getForecast()
  .then(function(forecast) {
    var prettyJSON = JSON.stringify(forecast,null,1);
    console.log(prettyJSON);
});
```

Gives this response

```json
{
 "GeneralStation": [
  {
   "ForecastPeriod": "Today P.M.",
   "AQHIRisk": "Low to Moderate"
  },
  {
   "ForecastPeriod": "Tomorrow A.M.",
   "AQHIRisk": "Low to Moderate"
  }
 ],
 "RoadsideStation": [
  {
   "ForecastPeriod": "Today P.M.",
   "AQHIRisk": "Low to Moderate"
  },
  {
   "ForecastPeriod": "Tomorrow A.M.",
   "AQHIRisk": "Low to Moderate"
  }
 ],
 "CurrentAQHIReport": [
  {
   "StationType": "Roadside Stations",
   "AQHIRisk": "Low to Moderate",
   "AQHIRange": {
    "Lower": "3",
    "Upper": "4"
   }
  },
  {
   "StationType": "General Stations",
   "AQHIRisk": "Low to Moderate",
   "AQHIRange": {
    "Lower": "3",
    "Upper": "4"
   }
  }
 ],
 "lastBuildDate": "2016-06-07T16:00:00.000Z",
 "pollDate": "2016-06-08T07:57:46.401Z"
}
```


## Other Handy Modules

* [hongkong-weather](https://www.github.com/hongkongkiwi/node-hongkong-weather) - For Hong Kong Weather Information.

## Contributing

Feel free to submit any pull requests or add functionality, I'm usually pretty responsive.

If you like the module, please consider donating some bitcoin or litecoin.

__Bitcoin__

![LNzdZksXcCF6qXbuiQpHPQ7LUeHuWa8dDW](http://i.imgur.com/9rsCfv5.png?1)

__LiteCoin__

![LNzdZksXcCF6qXbuiQpHPQ7LUeHuWa8dDW](http://i.imgur.com/yF1RoHp.png?1)
