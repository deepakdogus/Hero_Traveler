import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Field,
  reduxForm,
  formValueSelector,
} from 'redux-form'
import _ from 'lodash'

import RoundedButton from '../../Shared/Web/Components/RoundedButton'
import UserActions from '../../Shared/Redux/Entities/Users'
import {
  Container,
  Title,
  Text,
  ErrorMessage,
} from './Shared'
import { Row } from '../../Shared/Web/Components/FlexboxGrid'
import FormInput from '../FormInput'
import {
  validate,
  asyncValidate,
} from '../../Shared/Lib/userFormValidation'

const Prompt = styled(Text)`
  margin: 0 0 25px;
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
    error: PropTypes.string,
  }

  componentDidUpdate(prevProps) {
    if (!this.props.user.usernameIsTemporary) {
      this.props.closeModal()
    }
  }

  _handleSubmit = (e) => {
    e.preventDefault()
    const attrs = {
      username: this.props.username,
    }
    this.props.updateUser(attrs)
  }

  render() {
    const {
      invalid,
      submitting,
      pristine,
      updating,
      error,
    } = this.props

    return(
      <Container>
        <Title>Sign Up</Title>
        <Prompt>Let&#39;s start by choosing your username</Prompt>
        <form onSubmit={this._handleSubmit}>
          <Field
            name={'username'}
            component={FormInput}
            type='text'
            placeholder='Username'
          />
          <Row center='xs'>
            <RoundedButton
              text='Save'
              margin='small'
              type='submit'
              disabled={invalid || submitting || pristine}
            />
          </Row>
        </form>
        {(!invalid && updating) && (
          <Text>Updating Username...</Text>
        )}
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
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
    error: _.get(state, 'entities.users.error.message'),
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
  },
})(connect(mapStateToProps, mapDispatchToProps)(ChangeTempUsername))
