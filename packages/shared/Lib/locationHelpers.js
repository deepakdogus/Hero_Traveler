export function displayLocation(locationInfo = {}) {
  const {name, state, country} = locationInfo
  console.log("locationInfo is", locationInfo)
  const locationArray = []

  if (locationInfo.name) locationArray.push(name)
  if (locationInfo.country === 'United States') {
    if (locationInfo.state) locationArray.push(locationInfo.state)
    else if (locationInfo.locality) locationArray.push(locationInfo.locality)
  }
  else if (locationInfo.country) locationArray.push(locationInfo.country)
  return locationArray.join(', ')
}

export function displatLocationDetails(locationInfo) {
  return "TEST 2"
}

export default {
  displayLocation,
  displatLocationDetails,
}
