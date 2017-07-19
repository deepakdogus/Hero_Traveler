import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Icon from './Icon'
import {Row} from './FlexboxGrid'
import RoundedButton from './RoundedButton'
import VerticalCenter from './VerticalCenter'
import HorizontalDivider from './HorizontalDivider'

const LeftActionBarIcon = styled(Icon)`
  height: 16px;
  width: 21px;
  padding: 6.5px 4px;
`

const FacebookIocn = styled(Icon)`
  height: 16px;
  width: 8px;
  padding: 2px 6px;
`

const TwitterIcon = styled(Icon)`
  height: 16px;
  width: 20px;
  padding: 2px 0;
`
const AddIcon = styled(Icon)`
  height: 16px;
  width: 16px;
  padding: 2px 0;
`

const ActionBarContainer = styled(Row)`
  border-width: 1px 0;
  border-style: solid;
  border-color: ${props => props.theme.Colors.dividerGrey};
  padding: 20px 0;
`

const Count = styled.p`
  font-weight: 400;
  font-size: 20px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.5px;
  margin: 0;
  padding: 0 10px 0 5px;
`

const ActionButtonText = styled.span`
  font-weight: 400;
  font-size: 14px;
  color: ${props => props.theme.Colors.signupGrey};
  line-height: 20px;
  padding-left: 5px;
`

const Left = styled.div``
const Right = styled.div``

export default class StoryActionBar extends React.Component {
  static propTypes = {
    story: PropTypes.object,
    isLiked: PropTypes.bool,
  }

  render () {
    const {story, isLiked} = this.props
    return (
      <div>
        <HorizontalDivider color='lightGrey'/>
        <ActionBarContainer between='xs'>
          <Left>
            <Row>
              <RoundedButton type='grey' padding='even' margin='none'>
                <LeftActionBarIcon name={isLiked ? 'likeActiveWhite' : 'like'}/>
              </RoundedButton>
              <VerticalCenter>
                <Count>{story.counts.likes}</Count>
              </VerticalCenter>
              <RoundedButton type='grey' padding='even' margin='none'>
                <LeftActionBarIcon name='comment'/>
              </RoundedButton>
              <VerticalCenter>
                <Count>{story.counts.comments}</Count>
              </VerticalCenter>
            </Row>
          </Left>
          <Right>
            <Row>
              <RoundedButton type='lightGrey' margin='small'>
                <Row>
                  <AddIcon name='createStory'></AddIcon>
                  <ActionButtonText>Add to Collection</ActionButtonText>
                </Row>
              </RoundedButton>
              <RoundedButton type='facebook' padding='even' margin='small'>
                <FacebookIocn name='facebook-blue'></FacebookIocn>
              </RoundedButton>
              <RoundedButton type='twitter' padding='even' margin='small'>
                <TwitterIcon name='twitter-blue'></TwitterIcon>
              </RoundedButton>
              <RoundedButton type='lightGrey' padding='even' margin='small'>
                <TwitterIcon name='twitter-blue'></TwitterIcon>
              </RoundedButton>
            </Row>
          </Right>
        </ActionBarContainer>
        <HorizontalDivider color='lightGrey'/>
      </div>
    )
  }
}
