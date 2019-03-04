
export const fetching = () => ({
  fetching: true,
  loaded: false,
})

export const fetchingSuccess = () => ({
  fetching: false,
  loaded: true,
})

export const fetchingError = () => ({
  fetching: false,
  loaded: false,
})
