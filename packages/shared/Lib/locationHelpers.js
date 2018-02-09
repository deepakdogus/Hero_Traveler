export function displayLocation(locationInfo = {}) {
  const {name, locality, state, country} = locationInfo
  const locationArray = []

  if (name) locationArray.push(name)
  if (country === 'United States') {
    if (state) locationArray.push(state)
    else if (locality) locationArray.push(locality)
  }
  else if (country) locationArray.push(country)
  return locationArray.join(', ')
}

export function displayLocationDetails(locationInfo = {}) {
  const {locality, state, country} = locationInfo
  const locationArray = []
  if (locality) locationArray.push(locality)
  if (state) locationArray.push(state)
  if (country) locationArray.push(country)
  return locationArray.join(', ')
}

export default {
  displayLocation,
  displayLocationDetails,
}
