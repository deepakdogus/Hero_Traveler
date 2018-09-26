import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import RoundedButton from '../RoundedButton'
import {
  Container,
  Title,
  Text
} from './Shared'
import { Row } from '../FlexboxGrid'
import FormInput from '../FormInput'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import HeroAPI from '../../Shared/Services/HeroAPI'

const api = HeroAPI.create()

const StyledUsernameText = styled(Title)`
  font-size: 20px;
`

const StyledForm = styled.form`
  padding-bottom: 25px;
`

export const Constants = {
  USERNAME_MIN_LENGTH: 2,
  USERNAME_MAX_LENGTH: 20,
  USERNAME_REGEX: /(?=^.{1,20}$)^[a-zA-Z][a-zA-Z0-9]*[._-]?[a-zA-Z0-9]+$/,
}

const asyncValidate = (values) => {
  return api.signupCheck(values)
  .then(response => {
    const {data} = response
    const errors = {}
    Object.keys(data).forEach(key => {
      if (data[key]) errors[key] = `That ${key} is already taken`
    })
    if (Object.keys(errors).length) throw errors
    return {}
  })

}

const validate = (values) => {
  const errors = {}

  if (!values.username) {
    errors.username = 'Required'
  } else if (values.username.length < Constants.USERNAME_MIN_LENGTH || values.username.length > Constants.USERNAME_MAX_LENGTH) {
    errors.username = `Must be between ${Constants.USERNAME_MIN_LENGTH} and ${Constants.USERNAME_MAX_LENGTH} characters`
  } else if (!Constants.USERNAME_REGEX.test(values.username)) {
    errors.username = 'Usernames may contain letters, numbers, _ and -'
  }

  return errors
}


class ChangeTempUsername extends React.Component{

  static propTypes = {
    closeModal: PropTypes.func,
    params: PropTypes.object,
    username: PropTypes.string,
    invalid: PropTypes.bool,
    updating: PropTypes.bool,
    fetching: PropTypes.bool,
    updateUser: PropTypes.func,
  }

  componentDidUpdate(prevProps) {
    if (!!prevProps.updating && prevProps.updating && !this.props.updating) {
      this.props.closeModal()
    }
  }

  _handleSubmit = (e) => {
    e.preventDefault()
    const attrs = {
      username: this.props.username
    }
      this.props.params.updateUser(attrs)
  }

  render() {
    const {
      invalid,
      updating,
      params: {
        user
      }
    } = this.props

    return(
      <Container>
        <Title>Change Temp Username</Title>
        <Text>Do you want to change your username?</Text>
        <StyledUsernameText>{user.username}</StyledUsernameText>
        <form onSubmit={this._handleSubmit}>
          <Field
            name={'username'}
            component={FormInput}
            type='text'
            placeholder='Username'
          />
          <Row center='xs'>
            <RoundedButton
              text="No"
              margin='small'
              type='blackWhite'
              onClick={this.props.closeModal}
            />
            <RoundedButton
              text='Yes'
              margin='small'
              type='submit'
            />
          </Row>
        </form>
        {(!invalid && updating) &&
          <Text>Updating Username...</Text>
        }
      </Container>
    )
  }
}

const selector = formValueSelector('changeTempUsername')

function mapStateToProps(state) {
  return {
    username: selector(state, 'username'),
    updating: state.entities.users.updating,
  }
}

export default reduxForm({
  form: 'changeTempUsername',
  validate,
  asyncValidate,
  destroyOnUnmount: true,
  asyncBlurFields: ['username'],
  initialValues: {
    username: '',
  }
})(connect(mapStateToProps)(ChangeTempUsername))