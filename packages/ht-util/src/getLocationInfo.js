var rp = require('request-promise')

function errorResponse(locationString) {
  return Promise.reject(new Error('Google.FailedLocation', {
    messageParams: {
      placeId: locationString
    },
  }))
}

function formatLocationInfo(result) {
  const addressComponents = {}
  result.address_components.forEach(component => {
    if (component.types) component.types.forEach(type => {
      if (type !== 'political') addressComponents[type] = component.long_name
    })
  })

  return {
    name: result.name,
    locality: addressComponents.sublocality_level_1 || addressComponents.locality,
    state: addressComponents.administrative_area_level_1,
    country: addressComponents.country,
    latitude: result.geometry.location.lat,
    longitude: result.geometry.location.lng,
  }

}

export default function getLocationInfo(locationString) {
  // getting place details through google places API

  var getPlacesSearch = {
    uri: 'https://maps.googleapis.com/maps/api/place/textsearch/json?query='+locationString+'&key='+process.env.GOOGLE_API_KEY,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };

  return rp(getPlacesSearch)
  .then(function (response) {
    if (response.status !== 'OK') return errorResponse(locationString)
    if (response && response.results && response.results.length) {
      var getDetailsSearch = {
        uri: 'https://maps.googleapis.com/maps/api/place/details/json?key='+process.env.GOOGLE_API_KEY+'&placeid='+response.results[0].place_id,
        headers: {
          'User-Agent': 'Request-Promise'
        },
        json: true
      }

      return rp(getDetailsSearch)
      .then(function (response) {
        if (response.status !== 'OK') return errorResponse(locationString)
        return formatLocationInfo(response.result)
      })
    }
    return {}
  });
}
