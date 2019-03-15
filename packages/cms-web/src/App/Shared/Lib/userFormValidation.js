import HeroAPI from '../../Shared/Services/HeroAPI'

const api = HeroAPI.create()

// These should be in ht-util
// but there appears to be a symlink bug with RN/lerna

export const FieldConstraints = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 64,
  USERNAME_MIN_LENGTH: 5,
  USERNAME_MAX_LENGTH: 20,
  USERNAME_REGEX: /(?=^.{5,20}$)^[a-zA-Z][a-zA-Z0-9]*[._-]?[a-zA-Z0-9]+$/,
  FULLNAME_MAX_LENGTH: 255,
  EMAIL_REGEX: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
}

export const validate = (values, _props, fields) => {
  const errors = {}

  if (!fields) {
    fields = [
      'fullName',
      'username',
      'email',
      'password',
      'confirmPassword',
    ]
  }

  const checkField = (fieldName) => {
    return fields.indexOf(fieldName) > -1
  }

  if (checkField('fullName')) {
    if (!values.fullName) {
      errors.fullName = 'Required'
    }
  }

  if (checkField('username')) {
    if (!values.username) {
      errors.username = 'Required'
    } else if (values.username.length < FieldConstraints.USERNAME_MIN_LENGTH || values.username.length > FieldConstraints.USERNAME_MAX_LENGTH) {
      errors.username = `Must be between ${FieldConstraints.USERNAME_MIN_LENGTH} and ${FieldConstraints.USERNAME_MAX_LENGTH} characters`
    } else if (!FieldConstraints.USERNAME_REGEX.test(values.username)) {
      errors.username = 'Usernames may contain letters, numbers, _ and -'
    }
  }

  if (checkField('email')) {
    if (!values.email) {
      errors.email = 'Required'
    } else if (!FieldConstraints.EMAIL_REGEX.test(values.email)) {
      errors.email = 'Invalid email address'
    }
  }

  if (checkField('password')) {
    if (!values.password) {
      errors.password = 'Required'
    } else if (values.password.length < FieldConstraints.PASSWORD_MIN_LENGTH || values.password.length > FieldConstraints.PASSWORD_MAX_LENGTH) {
      errors.password = `Passwords must be ${FieldConstraints.PASSWORD_MIN_LENGTH} to ${FieldConstraints.PASSWORD_MAX_LENGTH} characters long`
    }
  }

  if (checkField('confirmPassword')) {
    if (!values.confirmPassword || values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords must match'
    }
  }

  return errors
}

let originalUsername = ""
export const setOriginalUsername = function(username){
  originalUsername = username
}

// refactor this ignore logic
export const asyncValidate = (values, dispatch, ignoreUsername, ignoreEmail) => {
  return api.signupCheck(values)
  .then(response => {
    const {data} = response
    const errors = {}
    for (let key in data) {
      if (
        data[key]
        && !(ignoreUsername && key !== 'username')
        && !(ignoreEmail && key === 'email')
      ) {
        if (
          data[key]
          && (key !== 'username' || originalUsername !== values.username)
        ) errors[key] = `That ${key} is already taken`
      }
    }
    if (Object.keys(errors).length) throw errors
    return {}
  })
}
