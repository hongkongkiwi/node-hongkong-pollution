module.exports = function(async) {
  async.objectMap = function ( obj, func, cb ) {
    var i, arr = [], keys = Object.keys( obj );
    for ( i = 0; i < keys.length; i += 1 ) {
      var wrapper = {};
      wrapper[keys[i]] = obj[keys[i]];
      arr[i] = wrapper;
    }
    this.map( arr, func, function( err, data ) {
      if ( err ) { return cb( err ); }
      var res = {};
      for ( i = 0; i < data.length; i += 1 ) {
          res[keys[i]] = data[i];
      }
      return cb( err, res );
    });
  };
  return async;
};
