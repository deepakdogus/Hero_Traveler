import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import RoundedButton from '../RoundedButton'
import UserActions from '../../Shared/Redux/Entities/Users'
import {
  Container,
  Title,
  Text
} from './Shared'
import { Row } from '../FlexboxGrid'
import FormInput from '../FormInput'
import {
  Field,
  reduxForm,
  formValueSelector
} from 'redux-form'
import {
  validate,
  asyncValidate
} from '../../Shared/Lib/userFormValidation'

const StyledUsernameText = styled(Title)`
  font-size: 20px;
`

class ChangeTempUsername extends React.Component{

  static propTypes = {
    closeModal: PropTypes.func,
    username: PropTypes.string,
    user: PropTypes.object,
    invalid: PropTypes.bool,
    updating: PropTypes.bool,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
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
    this.props.updateUser(attrs)
  }

  render() {
    const {
      invalid,
      submitting,
      pristine,
      updating,
      user,
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
              disabled={invalid|| submitting || pristine}
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
  const users = state.entities.users.entities
  const user = users[state.session.userId]
  return {
    user,
    username: selector(state, 'username'),
    updating: state.entities.users.updating,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateUser: (updates) => dispatch(UserActions.updateUser(updates)),
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
})(connect(mapStateToProps, mapDispatchToProps)(ChangeTempUsername))