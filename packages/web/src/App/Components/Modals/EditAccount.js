import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import InputWithLabel from '../InputWithLabel'
import VerticalCenter from '../VerticalCenter'
import RoundedButton from '../RoundedButton'
import CenteredButtons from '../CenteredButtons'
import { ErrorMessage, FetchingMessage } from './Shared/'

const Container = styled.div``

const InputContainer = styled.div`
  font-family: ${props => props.theme.Fonts.type.base};
  font-style: none;
  padding: 25px;
`

export default class EditAccount extends React.Component {
  static propTypes = {
    attemptUpdateUser: PropTypes.func,
    userEntitiesUpdating: PropTypes.bool,
    userEntitiesError: PropTypes.object,
    userProfile: PropTypes.object,
    userEmail: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = {
      name: this.props.userProfile.fullName,
      email: this.props.userEmail,
      success: false,
      localError: '',
    }
  }

  componentDidMount() {
    this.loadInitial()
  }


  componentWillReceiveProps(newProps) {
    if (this.props.userEntitiesUpdating && !newProps.userEntitiesUpdating && !newProps.userEntitiesError) {
      this.setState({
        success: true,
      })
    }
  } 

  loadInitial = () => {
    this.setState({
      email: this.props.userEmail,
      name: this.props.userProfile.fullName,
    })
  }

  onChangeText = (e) => {
    const text = e.target.value
    const field = e.target.id
    this.setState({
      [field]: text
    })
  }

  cancel = () => {
    this.setState({
      localError: '',
      success: false,
    })
    this.loadInitial()
  }

  submit = () => {
    const updates = {}
    if (this.state.name !== this.props.userProfile.fullName){
      updates.profile = { ...this.props.userProfile, fullName: this.state.name }
    }
    if (this.state.email !== this.props.userEmail){
      updates.email = this.state.email
    }
    if (!(Object.keys(updates).length)) {
      this.setState({
        localError: 'There are no changes to save.'
      })
    } else {
      this.setState({
        localError: ''
      })
      this.props.attemptUpdateUser(updates)      
    }
  }

  renderButtonLeft = () => {
    // should make this close the modal or something or empty field
    return (
      <VerticalCenter>
        <RoundedButton
          text={'Cancel'}
          margin='none'
          width='116px'
          type='blackWhite'
          padding='mediumEven'
          onClick={this.cancel}
        />
      </VerticalCenter>
    )
  }

  renderButtonRight = () => {
    return (
      <VerticalCenter>
        <RoundedButton
          text={'Save Changes'}
          margin='none'
          width='180px'
          padding='mediumEven'
          onClick={this.submit}
        />
      </VerticalCenter>
    )
  }

  render() {
    const { userEntitiesUpdating, userEntitiesError } = this.props
    return (
      <Container>
        <InputContainer>
          <InputWithLabel
            id='name'
            name='name'
            placeholder='John Doe'
            label='Name'
            value={this.state.name}
            onChange={this.onChangeText}
          />
        </InputContainer>
        <InputContainer>
          <InputWithLabel
            id='email'
            name='email'
            placeholder='jdoe@gmail.com'
            label='Email'
            value={this.state.email}
            onChange={this.onChangeText}
          />
        </InputContainer>
        { this.state.localError && <ErrorMessage> {this.state.localError} </ErrorMessage> }
        { !!(userEntitiesError) && <ErrorMessage> {userEntitiesError.toString()} </ErrorMessage> }
        { userEntitiesUpdating ? <FetchingMessage>  Updating... </FetchingMessage> : null }
        { this.state.success && <FetchingMessage>  You have successfully changed your info. </FetchingMessage>}
        <CenteredButtons
          buttonsToRender={[
            this.renderButtonLeft,
            this.renderButtonRight,
          ]}
        />
      </Container>
    )
  }
}
