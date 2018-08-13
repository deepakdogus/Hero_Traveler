export default function formatLocationWeb (result) {
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
    formattedAdress: result.formatted_address,
    country: addressComponents.country,
  }
}