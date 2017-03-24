import mongooseHidden from 'mongoose-hidden'

export default mongooseHidden({
  defaultHidden: {
    __v: true
  }
})
