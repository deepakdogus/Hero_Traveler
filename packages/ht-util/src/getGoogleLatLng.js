var rp = require('request-promise')

export default function getGoogleLatLng(locationString) {
  // getting place details through google places API
  var options = {
    uri: 'https://maps.googleapis.com/maps/api/place/textsearch/json?query='+locationString+'&key='+process.env.GOOGLE_API_KEY,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };
  return rp(options)
  .then(function (response) {
    if (response.status !== 'OK') {
      return Promise.reject(new Error('Google.FailedLocation', {
        messageParams: {
          placeId: locationString
        },
      }));
    }
    if (response && response.results && response.results.length) {
      return {
        latitude: response.results[0].geometry.location.lat,
        longitude: response.results[0].geometry.location.lng,
      }
    }
    return {}
  });
}
