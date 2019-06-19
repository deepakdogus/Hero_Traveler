const getButtonText = type => {
  switch (type) {
    case 'booking':
      return 'Book Now'
    case 'signup':
      return 'Sign Up'
    case 'info':
    default:
      return 'More Info'
  }
}

const handleClickActionButton = (link, fn) => () => {
  if (link.substring(0, 7) !== 'http://' && link.substring(0, 8) !== 'https://') {
    return fn(`http://${link}`)
  }
  fn(link)
}

export {
  getButtonText,
  handleClickActionButton,
}
