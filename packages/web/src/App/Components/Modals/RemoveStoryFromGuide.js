import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import GuideActions from '../../Shared/Redux/Entities/Guides'
import {Row} from '../FlexboxGrid'
import RoundedButton from '../RoundedButton'
import {Title} from './Shared'

const Container = styled.div``

const StyledTitle = styled(Title)`
  color: ${props => props.theme.Colors.background};
  font-size: 16px;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 600;
  letter-spacing: .7px;
`

const ButtonRow = styled(Row)`
  padding-top: 25px;
`

class RemoveStoryFromGuide extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func,
    updateGuide: PropTypes.func,
    guide: PropTypes.object,
    storyId: PropTypes.string,
  }

  removeStoryFromGuide = () => {
    const {
      updateGuide,
      guide,
      storyId,
    } = this.props
    const filteredStories = guide.stories.filter((id) => id !== storyId)
    updateGuide({
      id: guide.id,
      stories: filteredStories,
    })
    this.props.closeModal()
  }

  render() {
    return (
      <Container>
        <StyledTitle>
          Are you sure you want to remove this story from this guide?
        </StyledTitle>
        <ButtonRow center='xs'>
          <RoundedButton
            width='120px'
            margin='small'
            type='blackWhite'
            text='No'
            padding='mediumEven'
            onClick={this.props.closeModal}
          />
          <RoundedButton
            width='120px'
            padding='mediumEven'
            margin='small'
            text='Yes'
            onClick={this.removeStoryFromGuide}
          />
        </ButtonRow>
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { storyId, guideId } = state.ux.params
  return {
    storyId,
    guide: state.entities.guides.entities[guideId],
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    updateGuide: guide => dispatch(GuideActions.updateGuide(guide)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RemoveStoryFromGuide)
