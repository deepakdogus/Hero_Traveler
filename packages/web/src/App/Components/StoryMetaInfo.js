import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {NavLink} from 'react-router-dom'
import _ from 'lodash'

import Icon from './Icon'
import {Row} from './FlexboxGrid'
import { displayLocationDetails } from '../Shared/Lib/locationHelpers'

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
  weight: 25px;
  height: 25px;
`

const IconWrapper = styled.div`
  width: 27px;
  text-align: center;
`

const Text = styled.p`
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .7px;
`

const Label = styled(Text)`
  margin: 0;
`

const Location = styled(Text)`
  font-weight: 400;
  margin: 0;
  color: ${props => props.theme.Colors.grey};
`

const Container = styled.div`
  margin: 35px 0;
`
const InfoRow = styled(Row)`
  margin: 0 0 15px 0 !important;
`

const TextContainer = styled.div`
  margin-left: 20px;
`

const StyledLink = styled(NavLink)`
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.redHighlights};
  letter-spacing: .7px;
  text-decoration: none;
`

function DetailRow({Icon, iconName, label, children}) {
  if (
    (typeof children === 'object' && !_.get(children, 'props.children'))
    || (typeof children === 'string' && !children)
    || typeof children === 'undefined'
  ) return null

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
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ])
}

export default class StoryMetaInfo extends React.Component {
  static propTypes = {
    story: PropTypes.object,
  }

  renderCategoriesLinks = (categories) => {
    const keys = Object.keys(categories)
    const length = keys.length
    if (length === 0) return
    return keys.map((key, index) => {
      const categorie = categories[key]

      return (
        <StyledLink key={key} to={'/category/' + categorie.id} >
          {categorie.title}{index !== length - 1 ? ', ' : ''}
        </StyledLink>
      )
    })
  }

  render() {
    const {story} = this.props
    return (
      <Container>
        <DetailRow
          Icon={LocationIcon}
          iconName='location'
          label='Location'
        >
          <Location>{displayLocationDetails(story.locationInfo)}</Location>
        </DetailRow>
        <DetailRow
          Icon={TagsIcon}
          iconName='tag'
          label='Categories'
        >
          <Location>{this.renderCategoriesLinks(story.categories)}</Location>
        </DetailRow>
        <DetailRow
          Icon={CostIcon}
          iconName='cost'
          label='Cost'
        >
          {story.cost ? `$${story.cost} USD` : ''}
        </DetailRow>
        <DetailRow
          Icon={TravelTipsIcon}
          iconName='travelTips'
          label='Travel Tips'
        >
          {story.travelTips}
        </DetailRow>
      </Container>
    )
  }
}
