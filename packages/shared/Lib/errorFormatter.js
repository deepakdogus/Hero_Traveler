import _ from 'lodash'

export default function errorFormatter(responseObject) {
  if (_.get(responseObject, 'data.message')) {
    return responseObject.data.message
  }

  if (responseObject.problem) {
    return responseObject.problem
  }
}
