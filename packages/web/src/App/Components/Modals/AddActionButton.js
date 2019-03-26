import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { AbstractAddButton } from '../../Shared/AbstractComponents'
import OnClickOutsideModal from './OnClickOutsideModal'
import { Title } from './Shared'
import RoundedButton from '../RoundedButton'
import { StyledInput as Input } from '../CreateStory/FeedItemDetails'

import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import Icon from '../Icon'

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 550px;
`

const ContentContainer = styled.div``

const TypeContainer = styled.div`
  margin-bottom: 40px;
`

const Label = styled.div`
  margin-bottom: 10px;
  width: 100%;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.7px;
  color: ${props => props.theme.Colors.background};
`

const ButtonTypeRow = styled.div`
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.Colors.navBarText};
`

const ButtonTypeText = styled.p`
  margin: 0;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-size: 15px;
  font-weight: 400;
  letter-spacing: 0.7px;
`

const Checkbox = styled(Icon)`
  border-color: ${props => props.theme.Colors.snow};
  border-style: solid;
  border-width: 1px;
  border-radius: 50%;
  background-color: ${props => props.theme.Colors.snow};
`

const StyledInput = styled(Input)`
  margin: 0;
  padding: 10px 0;
  width: 100%;
  border-bottom: 1px solid ${props => props.theme.Colors.navBarText};
`

const DeleteText = styled.div`
  margin: 30px 0 0;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.7px;
  color: ${props => props.theme.Colors.redHighlights};
  cursor: pointer;
`

const SubmitError = styled(DeleteText)`
  font-weight: 400;
`

const ConfirmButtonRow = styled.div`
  display: flex;
`

const StyledRoundedButton = styled(RoundedButton)`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  text-transform: uppercase;
  width: 160px;
  padding: 9px;
  letter-spacing: 0.6px;
`

class AddActionButton extends AbstractAddButton {
  static propTypes = { ...AbstractAddButton.propTypes, closeModal: PropTypes.func }

  handleChangeText = event => this.setState({ link: event.target.value.trim() })

  handleDeleteButton = () => this.setState({ link: '', type: '', hasDeletedButton: true })

  handleConfirm = () => {
    const { type, link, hasDeletedButton } = this.state

    this.setState({ hasAttemptedSubmit: true })
    if (this.isValid(link)) {
      if (link === '' && hasDeletedButton) {
        this.props.updateWorkingDraft({ actionButton: { type: '', link: '' } })
      }
      else {
        this.props.updateWorkingDraft({ actionButton: { type, link } })
      }
      this.props.closeModal()
    }
  }

  render() {
    const { type, link, hasAttemptedSubmit, hasDeletedButton } = this.state
    return (
      <OnClickOutsideModal>
        <FlexContainer>
          <Title>Add a Button</Title>
          <ContentContainer>
            <TypeContainer>
              <Label>Choose a button:</Label>
              <ButtonTypeRow>
                <ButtonTypeText>More info button</ButtonTypeText>
                <Checkbox
                  name={type === 'info' ? 'redCheck' : 'greyCheck'}
                  onClick={this.setMoreInfoType}
                />
              </ButtonTypeRow>
              <ButtonTypeRow>
                <ButtonTypeText>Book now button</ButtonTypeText>
                <Checkbox
                  name={type === 'booking' ? 'redCheck' : 'greyCheck'}
                  onClick={this.setBookNowType}
                />
              </ButtonTypeRow>
              <ButtonTypeRow>
                <ButtonTypeText>Sign up button</ButtonTypeText>
                <Checkbox
                  name={type === 'signup' ? 'redCheck' : 'greyCheck'}
                  onClick={this.setSignupType}
                />
              </ButtonTypeRow>
            </TypeContainer>
            <Label>Add a Url to your button:</Label>
            <StyledInput
              type="text"
              placeholder="Enter Url"
              value={link || ''}
              onChange={this.handleChangeText}
            />
            {!!link
              && hasAttemptedSubmit
              && !this.isValidUrl(link)
              && (
                <SubmitError>Please make sure your Url is valid</SubmitError>
            )}
            {!!this.props.currentLink
              && this.props.currentLink === link
              && !hasDeletedButton
              && (
                <DeleteText onClick={this.handleDeleteButton}>Delete button</DeleteText>
            )}
          </ContentContainer>
          <ConfirmButtonRow>
            <StyledRoundedButton
              text="Cancel"
              type="blackWhite"
              onClick={this.props.closeModal}
              margin={'small'}
            />
            <StyledRoundedButton
              text={this.props.currentLink ? 'Save Button' : 'Create Button'}
              onClick={this.handleConfirm}
              buttonProps={`&& { width: 200px }`}
              margin={'small'}
              padding={'smallEven'}
            />
          </ConfirmButtonRow>
        </FlexContainer>
        <div />
      </OnClickOutsideModal>
    )
  }
}

const mapState = ({ storyCreate }) => {
  const hasActionButton = storyCreate.workingDraft && storyCreate.workingDraft.actionButton
  return {
    currentLink: hasActionButton ? storyCreate.workingDraft.actionButton.link : '',
    buttonType: hasActionButton ? storyCreate.workingDraft.actionButton.type : '',
  }
}

const mapDispatch = dispatch => ({
  updateWorkingDraft: story => dispatch(StoryCreateActions.updateWorkingDraft(story)),
})

export default connect(
  mapState,
  mapDispatch,
)(AddActionButton)
