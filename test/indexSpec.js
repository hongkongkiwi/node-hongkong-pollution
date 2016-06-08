var chai = require('chai');
var expect = chai.expect;
var HongKongPollution = require('../index');
var _ = require('underscore');

describe('HongKongPollution', function() {

  var hongKongPollution;

  describe('english langauge', function() {

    beforeEach(function(done) {
      hongKongPollution = new HongKongPollution({lang: 'en'});
      done();
    });

    it('should get pollution forecast', function(done) {
      hongKongPollution.getForecast()
        .then(function(forecast) {
          expect(forecast).to.have.all.keys(['GeneralStation', 'RoadsideStation', 'CurrentAQHIReport', 'lastBuildDate', 'pollDate']);
          expect(forecast.lastBuildDate).to.be.a('date');

          expect(forecast.GeneralStation).to.have.lengthOf(2);
          expect(forecast.GeneralStation[0]).to.have.all.keys(['ForecastPeriod','AQHIRisk']);
          expect(forecast.GeneralStation[1]).to.have.all.keys(['ForecastPeriod','AQHIRisk']);
          expect(forecast.GeneralStation[0].ForecastPeriod).to.be.a('string');
          expect(forecast.GeneralStation[1].ForecastPeriod).to.be.a('string');

          expect(forecast.RoadsideStation).to.have.lengthOf(2);
          expect(forecast.RoadsideStation[0]).to.have.all.keys(['ForecastPeriod','AQHIRisk']);
          expect(forecast.RoadsideStation[1]).to.have.all.keys(['ForecastPeriod','AQHIRisk']);
          expect(forecast.RoadsideStation[0].ForecastPeriod).to.be.a('string');
          expect(forecast.RoadsideStation[1].ForecastPeriod).to.be.a('string');

          expect(forecast.CurrentAQHIReport).to.have.lengthOf(2);
          expect(forecast.CurrentAQHIReport[0]).to.have.all.keys(['StationType','AQHIRisk','AQHIRange']);
          expect(forecast.CurrentAQHIReport[1]).to.have.all.keys(['StationType','AQHIRisk','AQHIRange']);

          expect(forecast.CurrentAQHIReport[0].StationType).to.equal('Roadside Stations');
          expect(forecast.CurrentAQHIReport[1].StationType).to.equal('General Stations');

          done();
        }).catch(done);
    });

    it('should get pollution breakdown for all districts', function(done) {
      hongKongPollution.getAllDistrictReadings()
        .then(function(allDistrictReadings) {
          expect(allDistrictReadings).to.have.keys(['Districts', 'lastBuildDate', 'pollDate']);
          expect(allDistrictReadings.Districts).to.have.lengthOf(3);
          expect(allDistrictReadings.Districts).to.have.deep.property('[0].Name','Hong Kong Island');
          expect(allDistrictReadings.Districts).to.have.deep.property('[1].Name','Kowloon');
          expect(allDistrictReadings.Districts).to.have.deep.property('[2].Name','New Territories');
          expect(allDistrictReadings.Districts[0]).to.have.keys(['Name', 'Stations']);
          expect(allDistrictReadings.Districts[1]).to.have.keys(['Name', 'Stations']);
          expect(allDistrictReadings.Districts[2]).to.have.keys(['Name', 'Stations']);

          done();
        }).catch(done);
    });

    it('should get pollution breakdown for a "Hong Kong Island"', function(done) {
      var name = 'Hong Kong Island';

      hongKongPollution.getDistrictReadings(name)
        .then(function(districtReadings) {
          expect(districtReadings).to.have.keys(['Districts', 'lastBuildDate', 'pollDate']);
          expect(districtReadings.Districts).to.have.lengthOf(1);
          expect(districtReadings.Districts[0]).to.have.keys(['Name', 'Stations']);
          expect(districtReadings.Districts[0].Name).to.equal(name);
          expect(districtReadings.Districts[0].Stations).to.have.length.above(0);
          _.each(districtReadings.Districts[0].Stations, function(station) {
            expect(station).to.have.keys(['Name', 'NO2', 'AQHI']);
          });

          done();
        }).catch(done);
    });

    it('should get pollution breakdown for a "Central & Western"', function(done) {
      var name = 'Central & Western';

      hongKongPollution.getDistrictReadings(name)
        .then(function(districtReadings) {
          expect(districtReadings).to.have.keys(['Districts', 'lastBuildDate', 'pollDate']);
          expect(districtReadings.Districts).to.have.lengthOf(1);
          expect(districtReadings.Districts[0]).to.have.keys(['Name', 'Stations']);
          expect(districtReadings.Districts[0].Stations).to.have.lengthOf(1);
          expect(districtReadings.Districts[0].Stations[0]).to.have.keys(['Name', 'NO2', 'AQHI']);
          expect(districtReadings.Districts[0].Stations[0].Name).to.equal(name);

          done();
        }).catch(done);
    });

    it('should fail to get pollution breakdown for a "Invalid District"', function(done) {
      var name = 'CInvalid District';

      hongKongPollution.getDistrictReadings(name)
        .then(function(districtReadings) {
          done(new Error('Should Fail!'));
        }, function(rejectionReason) {
          expect(rejectionReason).to.be.a('string');
          done();
        }).catch(done);
    });

    it('should get pollution AQHI history for all districts', function(done) {
      //var name = 'Central & Western';

      hongKongPollution.getAQHIHistory()
        .then(function(aqhiHistory) {
          //console.log(JSON.stringify(aqhiHistory,null,2));
          done();
        }).catch(done);
    });

    it('should get pollution AQHI history for "Kwun Tong" (74)', function(done) {
      var name = 'Kwun Tong';
      var Id = 74;

      hongKongPollution.getAQHIHistory(name)
        .then(function(aqhiHistory) {
          expect(aqhiHistory).to.not.be.undefined.and.to.not.be.null;
          expect(aqhiHistory[0]).to.have.keys(['Id', 'Name', 'StationType', 'LocationPin', 'PollutionData', 'pollDate']);
          expect(aqhiHistory[0].Id).to.equal(Id);
          expect(aqhiHistory[0].Name).to.equal(name);
          expect(aqhiHistory[0].PollutionData).to.have.length.above(0);

          done();
        }, function(reason) {
          done(new Error('should not reject!'));
        }).catch(done);
    });

    it('should get pollution AQHI history for ID: 73 (Eastern)', function(done) {
     var name = 'Eastern';
     var Id = 73;

      hongKongPollution.getAQHIHistory(Id)
        .then(function(aqhiHistory) {
          expect(aqhiHistory).to.not.be.undefined.and.to.not.be.null;
          expect(aqhiHistory[0]).to.have.keys(['Id', 'Name', 'StationType', 'LocationPin', 'PollutionData', 'pollDate']);
          expect(aqhiHistory[0].Id).to.equal(Id);
          expect(aqhiHistory[0].Name).to.equal(name);
          expect(aqhiHistory[0].PollutionData).to.have.length.above(0);

          done();
        }, function(reason) {
          done(new Error('should not reject!'));
        }).catch(done);
    });
  });
});
