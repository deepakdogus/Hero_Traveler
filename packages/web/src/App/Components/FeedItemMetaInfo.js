import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import Icon from '../Shared/Web/Components/Icon'
import { Row } from '../Shared/Web/Components/FlexboxGrid'
import { displayLocationDetails } from '../Shared/Lib/locationHelpers'
import { showTravelDate, getTripDate } from '../Shared/Lib/dateHelpers'

const LocationIcon = styled(Icon)`
  width: 17px;
  height: 27px;
`

const TagsIcon = styled(Icon)`
  width: 23px;
  height: 23px;
`

const CostIcon = styled(Icon)`
  width: 25px;
  height: 25px;
`

const TravelTipsIcon = styled(Icon)`
  width: 25px;
  height: 25px;
`

const CalendarIcon = styled(Icon)`
  width: 22px;
  height: 22px;
`
const Text = styled.p`
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 0.2px;
`

const Label = styled(Text)`
  margin: 0;
`

const DetailText = styled(Text)`
  font-weight: 400;
  margin: 0;
  color: ${props => props.theme.Colors.grey};
`

const Container = styled.div`
  margin: 35px 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`
const InfoRow = styled(Row)`
  margin: 0 0 15px 0 !important;
  flex-wrap: nowrap;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
`

const IconWrapper = styled.div`
  width: 27px;
  text-align: center;
  margin-right: 20px;
`
const TextContainer = styled.div`
  min-height: 100%;
`

const StyledLink = styled(NavLink)`
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.redHighlights};
  letter-spacing: 0.2px;
  text-decoration: none;
`

function DetailRow({ Icon, iconName, label, hasValue, children }) {
  if (!hasValue) return null
  return (
    <InfoRow>
      <IconWrapper>
        <Icon name={iconName} />
      </IconWrapper>
      <TextContainer>
        <Label>{label}:</Label>
        {children}
      </TextContainer>
    </InfoRow>
  )
}

DetailRow.propTypes = {
  Icon: PropTypes.func,
  iconName: PropTypes.string,
  label: PropTypes.string,
  children: PropTypes.any,
  hasValue: PropTypes.bool,
}

export default class FeedItemMetaInfo extends React.Component {
  static propTypes = {
    feedItem: PropTypes.object,
  }

  renderCategoriesLinks = categories => {
    const keys = Object.keys(categories)
    const length = keys.length
    if (length === 0) return
    return keys.map((key, index) => {
      const category = categories[key]

      return (
        <StyledLink
          key={key}
          to={'/category/' + category.id}
        >
          {category.title}
          {index !== length - 1 ? ', ' : ''}
        </StyledLink>
      )
    })
  }

  getLocationText = () => {
    const { locationInfo, locations = [] } = this.props.feedItem
    if (locationInfo) return displayLocationDetails(locationInfo)
    else if (locations.length) return locations.map(displayLocationDetails).join(' - ')
  }

  getDuration = () => {
    const { duration } = this.props.feedItem
    if (!duration) return
    return `${duration} day${duration > 1 ? 's' : ''}`
  }

  render() {
    const { feedItem } = this.props
    return (
      <Container>
        <DetailRow
          Icon={LocationIcon}
          iconName='location'
          label='Location'
          hasValue
        >
          <DetailText>{this.getLocationText()}</DetailText>
        </DetailRow>
        <DetailRow
          Icon={TagsIcon}
          iconName='tag'
          label='Categories'
          hasValue={!!feedItem.categories.length}
        >
          {this.renderCategoriesLinks(feedItem.categories)}
        </DetailRow>
        <DetailRow
          Icon={CostIcon}
          iconName='cost'
          label='Cost'
          hasValue={!!feedItem.cost}
        >
          <DetailText>{feedItem.cost ? `$${feedItem.cost} USD` : ''}</DetailText>
        </DetailRow>
        <DetailRow
          Icon={CalendarIcon}
          iconName='date'
          label='Travel Date'
          hasValue={showTravelDate(feedItem)}
        >
          <DetailText>
            {getTripDate(feedItem)}
          </DetailText>
        </DetailRow>
        <DetailRow
          Icon={TravelTipsIcon}
          iconName='travelTips'
          label='Travel Tips'
          hasValue={!!feedItem.travelTips}
        >
          <DetailText>{feedItem.travelTips}</DetailText>
        </DetailRow>
        <DetailRow
          Icon={CalendarIcon}
          iconName='date'
          label='Duration'
          hasValue={!!feedItem.duration}
        >
          <DetailText>{this.getDuration()}</DetailText>
        </DetailRow>
      </Container>
    )
  }
}
