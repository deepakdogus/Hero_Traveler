export function displayLocationWeb(locationInfo = {}) {
  const {name, locality, state, country} = locationInfo
  const locationArray = []

  if (name) locationArray.push(name)
  if (locality && locality !== name) locationArray.push(locality)
  if (state && state !== locality) locationArray.push(state)
  if (country) locationArray.push(country)
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
  displayLocationWeb,
  displayLocationDetails,
}
