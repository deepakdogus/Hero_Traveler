export function displayLocationPreview(locationInfo = {}) {
  const { name, locality, state, country } = locationInfo
  const locationArray = []
  if (name) locationArray.push(name)
  if (country === 'United States') {
    if (state) locationArray.push(state)
    else if (locality) locationArray.push(locality)
  }
  else if (country && country !== name) { locationArray.push(country) }
  return locationArray.join(', ')
}

export function displayLocationDetails(locationInfo = {}) {
  const { name, locality, state, country } = locationInfo
  const locationArray = []
  if (name) locationArray.push(name)
  if (locality && locality !== name) locationArray.push(locality)
  if (country === 'United States') {
    if (state && state !== locality) locationArray.push(state)
  }
  else if (country && country !== name) { locationArray.push(country) }
  return locationArray.join(', ')
}

export default {
  displayLocationPreview,
  displayLocationDetails
}
