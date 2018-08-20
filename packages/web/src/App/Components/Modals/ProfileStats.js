import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {Row} from '../FlexboxGrid'
import Icon from '../Icon'
import ProfileStatsCountsCol from '../ProfileStatsCountsCol'
import {
  RightTitle,
  Text,
  RightModalCloseX,
} from './Shared'

const Container = styled.div``

const Divider = styled.div`
  width: 1px;
  background-color: ${props => props.theme.Colors.dividerGrey};
  margin: 0 20px;
`

const StyledText = styled(Text)`
  color: ${props => props.theme.Colors.background};
  margin: 0 0 5px;
`

const TabText = styled(Text)`
  color: ${props => props.isActive ? props.theme.Colors.background : props.theme.Colors.dividerGrey};
  margin: 0;
`

const StatsTabBar = styled(Row)`
  padding: 25px 0 15px;
  border-bottom: ${props => `1px solid ${props.theme.Colors.lightGreyAreas}`};
`

const ContentContainer = styled.div`
  margin: 0 5%;
  text-align: center;
`

const Points = styled.p`
  font-weight: 600;
  font-size: 25px;
  color: ${props => props.theme.Colors.redHighlights};
  letter-spacing: .7px;
  margin: 0;
`

const Space = styled.div`
  height: 40px;
`

const StatsContainer = styled.div``
const HowContainer = styled.div``

const HowText =  styled(Text)`
  text-align: left;
`

export default class ProfileStats extends React.Component {
  static propTypes = {
    profile: PropTypes.object,
    closeModal: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {tab: 'stats'}
  }

  setTabStats = () => {
    this.setState({tab: 'stats'})
  }

  setTabHow = () => {
    this.setState({tab: 'how'})
  }

  render() {
    const {profile} = this.props
    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <RightTitle>{profile.username.toUpperCase()} STATS</RightTitle>
          <ContentContainer>
            <StatsTabBar center='xs'>
              <TabText
                isActive={this.state.tab === 'stats'}
                onClick={this.setTabStats}
              >Stats</TabText>
              <Divider />
              <TabText
                isActive={this.state.tab === 'how'}
                onClick={this.setTabHow}
              >How it Works</TabText>
            </StatsTabBar>
            <Space />

            { this.state.tab === 'stats' &&
              <StatsContainer>
                <StyledText>POINTS EARNED</StyledText>
                <Row center='xs'>
                  <Icon name='profileBadge'/>
                  <Points>1,139</Points>
                </Row>
                <Row center='xs'>
                  <ProfileStatsCountsCol
                    iconName='story'
                    count={32}
                    text='Stories'
                  />
                  <ProfileStatsCountsCol
                    iconName='video'
                    count={15}
                    text='videos'
                  />
                  <ProfileStatsCountsCol
                    iconName='date'
                    count={7}
                    text='Itineraries'
                  />
                </Row>
              </StatsContainer>
            }

            { this.state.tab === 'how' &&
              <HowContainer>
                <HowText>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ultricies blandit ligula a hendrerit. In porttitor pharetra mauris. Nam vitae sem erat. Phasellus gravida dolor antem vel porttitor nibh iaculis ut. Quisque sed orci ut dui fringilla maximus. Suspendisse aliquam ipsum in ex semper malesuada. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse ac ex tincidunt arcu venenatis pellentesque. Phasellus consectetur mattis ligula vitae vehicula. Fuscu mollis elementum felis, vitae egestas ante auctor nec. Cras facilisis aliquet imperdiet. Suspendisse quis vulputate magna. Sed tincidunt efficitur quem, ac ultrices diam tempor vel.</HowText>
              </HowContainer>
            }
          </ContentContainer>
      </Container>
    )
  }
}

