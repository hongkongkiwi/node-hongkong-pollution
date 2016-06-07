var Promise = require('bluebird');
var rp = require('request-promise');
var _ = require('underscore');
var async = require('async');

var HongKongPollution = function(options) {
  this.options = _.extendOwn({
    lang: 'en'
  }, options);
};

HongKongPollution.prototype.getForecast = function() {
  var options = {
    method: 'GET',
    baseUrl: 'http://61.244.113.113/json',
    uri: '/forecast.json',
    json: true
  };

  return rp(options)
    .then(function(forecast) {
      return forecast.data;
    });
};

HongKongPollution.prototype.getDistrictReadings = function() {
  var self = this;

  var options = {
    method: 'GET',
    baseUrl: 'http://61.244.113.113/json',
    uri: '/district.json',
    json: true
  };

  return rp(options)
    .then(function(districts) {
      return new Promise(function (resolve, reject) {
        async.map(districts.data, function(district, callback) {
          district = {name: district[self.options.lang + '_name'], stations: district.data};
          async.map(district.stations, function(station, callback) {
            station.name = station[self.options.lang + '_name'];
            station.NO2 = station.stations[0];
            station = _.pick(station,'name','NO2','aqhi');
            callback(null, station);
          }, function(err, stations) {
            district.stations = stations;
            callback(null, district);
          });
        }, function(err, districts) {
          resolve({districts: districts, date: districts.lastBuildDate});
        });
      });
    });
};

HongKongPollution.prototype.getAQHIHistory = function() {
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
        resolve(aqhi);
      });
    });
};

module.exports = HongKongPollution;
