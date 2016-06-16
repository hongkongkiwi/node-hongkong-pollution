var Promise = require('bluebird');
var rp = require('request-promise');
var _ = require('underscore');
var async = require('async');
async = require('./lib/async.objectMap')(async); // Add objectMap function
var moment = require('moment');
var debug = require('debug')('pollution')

var HongKongPollution = function(options) {
  this.options = _.extendOwn({
    lang: 'en'
  }, options);

  debug("Class Initialized", options);
};

HongKongPollution.prototype.getForecast = function() {
  debug(" -> getForecast()");

  var self = this;

  var options = {
    method: 'GET',
    baseUrl: 'http://61.244.113.113/json',
    uri: '/forecast.json',
    json: true
  };

  return rp(options)
    .then(function(forecast) {
      return new Promise(function (resolve, reject) {
        async.map(forecast.data.GeneralStation, function(generalStation, callback) {
          if (self.options.lang === 'en') {
            generalStation = {
              ForecastPeriod: generalStation.ForecastPeriod,
              AQHIRisk: generalStation.AQHIRisk
            };
          } else {
            generalStation = {
              ForecastPeriod: generalStation["ForecastPeriod_" + self.options.lang],
              AQHIRisk: generalStation["AQHIRisk_" + self.options.lang]
            };
          }
          callback(null, generalStation);
        }, function(err, generalStations) {
          forecast.data.GeneralStation = generalStations;
          async.map(forecast.data.RoadsideStation, function(roadsideStation, callback) {
            if (self.options.lang === 'en') {
              roadsideStation = {
                ForecastPeriod: roadsideStation.ForecastPeriod,
                AQHIRisk: roadsideStation.AQHIRisk
              };
            } else {
              roadsideStation = {
                ForecastPeriod: roadsideStation["ForecastPeriod_" + self.options.lang],
                AQHIRisk: roadsideStation["AQHIRisk_" + self.options.lang]
              };
            }
            callback(null, roadsideStation);
          }, function(err, roadsideStations) {
            forecast.data.RoadsideStation = roadsideStations;
            async.map(forecast.data.CurrentAQHIReport, function(currentReport, callback) {
              var langCode;
              if (self.options.lang === 'en') langCode = 'EN';
              else if (self.options.lang === 'tc') langCode = 'CT';
              else if (self.options.lang === 'sc') langCode = 'CS';
              currentReport = {
                StationType: currentReport['StationType' + langCode],
                AQHIRisk: currentReport['AQHIRisk' + langCode],
                AQHIRange: {
                  Lower: currentReport.AQHIRange.split(" to ")[0],
                  Upper: currentReport.AQHIRange.split(" to ")[1]
                }
              };
              callback(null, currentReport);
            }, function(err, currentReports) {
              forecast.data.CurrentAQHIReport = currentReports;
              forecast.data.pollDate = moment().toDate();
              forecast.data.lastBuildDate = moment(forecast.data.lastBuildDate, "YYYY-MM-DD HH:mm").toDate();
              resolve(forecast.data);
            });
          });
        });
      });
    });
};

HongKongPollution.prototype.getAllDistrictReadings = function() {
  debug(" -> getAllDistrictReadings()");
  return this.getDistrictReadings();
};

HongKongPollution.prototype.getDistrictReadings = function(districtName) {
  debug(" -> getDistrictReadings(\"" + districtName + "\")");
  var self = this;

  var options = {
    method: 'GET',
    baseUrl: 'http://61.244.113.113/json',
    uri: '/district.json',
    json: true
  };

  return rp(options)
    .then(function(districts) {
      var lastBuildDate = moment(districts.lastBuildDate, "YYYY-MM-DD HH:mm",'en').toDate();
      return new Promise(function (resolve, reject) {
        async.map(districts.data, function(district, callback) {
          district = {Name: district[self.options.lang + '_name'], Stations: district.data};
          async.map(district.Stations, function(station, callback) {
            station = {
              Name: station[self.options.lang + '_name'],
              NO2: station.stations[0],
              AQHI: station.aqhi
            };
            callback(null, station);
          }, function(err, stations) {
            district.Stations = stations;
            callback(null, district);
          });
        }, function(err, districts) {
          var districtReadings = {Districts: districts, lastBuildDate: lastBuildDate, pollDate: moment().toDate()};
          if (districtName) {
            var foundDistrict = false;
            foundDistrict = _.find(districtReadings.Districts, function(district) {
              return (district.Name === districtName);
            });
            if (!foundDistrict) {
              var foundStation = false;
              _.each(districtReadings.Districts, function(district) {
                district.Stations = _.filter(district.Stations, function(station) {
                  return (station.Name === districtName);
                });
                if (district.Stations.length > 0) {
                  foundStation = true;
                  districtReadings.Districts = [district];
                }
              });
              if (!foundDistrict && !foundStation) {
                reject('No Such District or Station!');
              } else {
                resolve(districtReadings);
              }
            } else {
              districtReadings.Districts = [foundDistrict];
              resolve(districtReadings);
            }
          } else {
            resolve(districtReadings);
          }
        });
      });
    });
};

HongKongPollution.prototype.getAQHIHistory = function(stationNameOrId) {
  debug(" -> getAQHIHistory(\"" + stationNameOrId + "\")");
  var self = this;

  var options = {
    method: 'GET',
    baseUrl: 'http://61.244.113.113/json',
    uri: '/aqhi.json',
    json: true
  };

  return rp(options)
    .then(function(aqhi) {
      return new Promise(function (resolve, reject) {
        async.objectMap(aqhi.data, function(station,callback) {
          var id = _.pairs(station)[0][0];
          var value = _.pairs(station)[0][1];

          newStation = {
            Id: parseInt(id),
            Name: value[self.options.lang + '_name'],
            StationType: value.StationType,
            LocationPin: value.pin,
            PollutionData: value.data,
            pollDate: moment().toDate()
          };

          async.map(newStation.PollutionData, function(stationHistory,callback) {
            stationHistory.AQHI = stationHistory.aqhi;
            delete stationHistory.aqhi;
            stationHistory.DateTime = moment(stationHistory.DateTime, "YYYY-MM-DD HH:mm").toDate();
            callback(null, stationHistory);
          }, function(err, stationHistory) {
            newStation.PollutionData = stationHistory;
            callback(null, newStation);
          });

        }, function(err, stations) {
          aqhi.data = _.values(stations);
          if (stationNameOrId) {
            if (!_.isNumber(stationNameOrId) && !_.isString(stationNameOrId)) {
              throw Error("Unhandled stationNameOrId type! Must be string or number");
            }
            aqhi.data = [_.find(aqhi.data, function(station) {
              return (_.isString(stationNameOrId) && station.Name === stationNameOrId) || (_.isNumber(stationNameOrId) && station.Id === stationNameOrId);
            })];

            if (!aqhi.data || _.isEmpty(aqhi.data)) {
              reject('Could not find that Station ID or Name');
            } else {
              resolve(aqhi.data);
            }
          } else {
            resolve(aqhi.data);
          }
        });
      });
    });
};

module.exports = HongKongPollution;
