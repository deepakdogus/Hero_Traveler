import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Moment from 'moment'
import _ from 'lodash'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked'
import RadioButtonChecked from 'material-ui/svg-icons/toggle/radio-button-checked'

import { Row } from '../FlexboxGrid'
import Icon from '../Icon'
import HorizontalDivider from '../HorizontalDivider'
import GoogleLocator from './GoogleLocator'
import ReactDayPicker from './ReactDayPicker'
import { Title } from './Shared'
import TagSelector from './TagSelector'
import VerticalCenter from '../VerticalCenter'
import Tile from './Tile'
import { displayLocationDetails } from '../../Shared/Lib/locationHelpers'

const Container = styled.div`
  padding: 14px 0px 14px 0px;
  position: relative;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 14px 15px;
  }
`

const TravelTipsContainer = styled(Container)``

export const InputRowContainer = styled(Container)`
  display: flex;
  align-items: center;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 14px 15px 14px 0px;
  }
`

const StyledTitle = styled(Title)`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-size: 28px;
  letter-spacing: .6px;
  text-transform: uppercase;
`

const ActivitySelectRow = styled(Row)`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
`

const DetailLabel = styled.label`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .2px;
  padding-left: 2px;
`

const ActivityDetailLabel = styled(DetailLabel)`
  margin-right: 40px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin-right: 0px;
    margin-bottom: 10px;
  }
`

const PrivacyLabel = styled(DetailLabel)`
  font-size: 16px;
`

export const StyledInput = styled.input`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 18px;
  letter-spacing: .7px;
  width: 80%;
  color: ${props => props.theme.Colors.background};
  border-width: 0;
  margin-left: 25px;
  outline: none;
  ::placeholder {
    font-family: ${props => props.theme.Fonts.type.base};
    color: ${props => props.theme.Colors.navBarText};
  }
`
const IconWithMargin = styled(Icon)`
  margin-left: 2px;
`
const LocationIcon = styled(IconWithMargin)`
  height: 34px;
  width: 23px;
`

const DateIcon = styled(IconWithMargin)`
  height: 26px;
  width: 30px;
`
const TagIcon = styled(IconWithMargin)`
  height: 26px;
  width: 26px;
`

const CheckIcon = styled(TagIcon)``

const HashtagIcon = styled(IconWithMargin)`
  height: 35px;
  width: 35px;
`

const CostIcon = styled(IconWithMargin)`
  height: 30px;
  width: 30px;
`

const InfoIcon = styled(CostIcon)``

export const IconWrapper = styled.div`
  width: 35px;
  text-align: center;
`

const StyledReactDayPicker = styled(ReactDayPicker)`
  position: absolute;
`

const TravelTipsInput = styled.textarea`
  font-family: ${props => props.theme.Fonts.type.base};
  ::placeholder {
    font-family: ${props => props.theme.Fonts.type.base};
    color: ${props => props.theme.Colors.navBarText};
  }
  color: ${props => props.theme.Colors.background};
  font-size: 16px;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  letter-spacing: .7px;
  width: 100%;
  height: 160px;
  resize: none;
  border-width: 1px;
  border-color: ${props => props.theme.Colors.navBarText};
  border-radius: 2.5px;
  padding: 10px;
  margin-top: 5px;
  box-sizing: border-box;
`

const styles = {
  radioButton: {
    display: 'inline-block',
    width: '25%',
    marginRight: '15px',
  },
  radioButtonLabel: {
    fontWeight: 600,
    fontSize: 18,
    color: '#1a1c21',
    letterSpacing: .7,
  },
  radioIcon: {
    fill: '#ed1e2e',
  },
  radioButtonGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  radioButtonFilled: {
    fill: '#ed1e2e',
  },
}

const TilesWrapper = styled.div`
  margin-left: 50px;
  flex-direction: column;
  align-items: start;
  display: flex;
`

function sortCategories(categories) {
  return categories.sort((a,b) => {
    if (a.title < b.title) return -1
    else return 1
  })
}

const formatCategories = (categories) => sortCategories(_.values(categories))

function isSameTag(a, b){
  return a.title === b.title
}

const buttons = ['see', 'do', 'eat', 'stay']

export default class FeedItemDetails extends React.Component {
  static propTypes = {
    workingDraft: PropTypes.object,
    onInputChange: PropTypes.func,
    categories: PropTypes.object,
    isGuide: PropTypes.bool,
    reroute: PropTypes.func,
  }
  constructor(props) {
    super(props)

    // may need to refactor the positioning of this logic
    let categoriesList = []
    if (props.categories && props.workingDraft) {
      const formattedCategoriesList = formatCategories(props.categories)
      categoriesList = _.differenceWith(formattedCategoriesList, props.workingDraft.categories, isSameTag)
    }

    this.state = {
      showCategoryPicker: false,
      showDayPicker: false,
      day: '',
      categoryInputText: '',
      categoriesList,
      hashtagsList: [],
      address: _.get(this.props.workingDraft, ['locationInfo', 'name'], ''),
    }
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(this.props.categories).length !== Object.keys(nextProps.categories).length && nextProps.workingDraft){
      const categoriesList = formatCategories(nextProps.categories)
      this.updateCategoriesList(_.differenceWith(categoriesList, nextProps.workingDraft.categories, isSameTag))
    }
  }

  handleLocationSelect = (addressObj) => {
    const { isGuide } = this.props
    const {location, locationInfo} = addressObj
    if (!location && locationInfo) {
      if (isGuide) {
        this.setState({address: ''})
        this.props.onInputChange({
          locations: [...this.props.workingDraft.locations, locationInfo],
        })
      }
      else {
        this.setState({address: locationInfo.name})
        this.props.onInputChange({locationInfo: locationInfo})
      }
    }
    else {
      this.setState({address: location})
    }
  }

  handleDayClick = (day) => {
    this.toggleDayPicker()
    this.props.onInputChange({
      tripDate: day,
    })
  }

  handleRadioChange = (event, value) => {
    this.props.onInputChange({type: value})
  }

  togglePicker = (name) => {
    const stateKey = `show${name}Picker`
    const currentVal = this.state[stateKey]
    this.setState({ [stateKey]: !currentVal})
 }

  toggleDayPicker = () => this.togglePicker('Day')

  toggleCategoryPicker = () => this.togglePicker('Category')

  formatTripDate = (day) => {
    if (!day) return undefined
    else return Moment(day).format('MM-DD-YYYY')
  }

  handleTagAdd = (event, tag, type = 'categories') => {
    event.stopPropagation()
    const tagTitle = event.target.innerHTML || tag
    // If it is already a category in DB, we need to fetch the whole object
    const clickedTag = _.find(
      type === 'categories' ? this.state.categoriesList : [],
      tag => tag.title === tagTitle,
    ) || { title: tagTitle }
    const updatedTags = this.props.workingDraft[type].concat([clickedTag])

    if (type === 'categories') this.loadDefaultCategories([clickedTag])
    else this.loadDefaultHashtags()

    this.props.onInputChange({ [type]: updatedTags })
  }

  handleTagRemove = (event, clickedTitle, type = 'categories') => {
    event.stopPropagation()
    const selectedTagsOfType = this.props.workingDraft[type]
    const clickedTag = _.find(
      selectedTagsOfType,
      tag => tag.title === clickedTitle,
    )
    const updatedTags = _.differenceWith(selectedTagsOfType, [clickedTag], isSameTag)
    if (type === 'categories') {
      this.updateCategoriesList(
        sortCategories(this.state.categoriesList.concat([clickedTag])),
      )
    }
    this.props.onInputChange({ [type]: updatedTags })
  }

  updateCategoriesList = (newCategoriesList) => {
    this.setState({
      categoriesList: newCategoriesList,
    })
  }

  updateHashtagsList = (newHashtagsList) => {
    this.setState({
      hashtagsList: newHashtagsList,
    })
  }

  handleCategoryInputTextChange = (text) => {
    this.setState({
      categoryInputText: text,
    })
    if (!text.length) {
      this.loadDefaultCategories()
    }
  }

  loadDefaultCategories = (excludeThese = []) => {
    if (this.props.categories && this.props.workingDraft) {
      const categoriesList = formatCategories(this.props.categories)
      this.updateCategoriesList(_.differenceWith(categoriesList, [...this.props.workingDraft.categories, ...excludeThese], isSameTag))
    }
  }

  loadDefaultHashtags = () => this.setState({hashtagsList: []})

  onGenericChange = (event) => {
    this.props.onInputChange({
      [event.target.name]: event.target.value,
    })
  }

  togglePrivacy = () => {
    this.props.onInputChange({
      isPrivate: !this.props.workingDraft.isPrivate,
    })
  }

  getCostPlaceHolderText = (type) =>{
    if (type === 'stay') return 'Cost Per Night'
    return 'Cost Per Person'
  }

  renderLocations() {
    return (
      <TilesWrapper>
      {
        this.props.workingDraft.locations.map((location, index) => {
          return <Tile
            key={index}
            text={displayLocationDetails(location)}
          />
        })
      }
      </TilesWrapper>
    )
  }

  render() {
    const {
      workingDraft,
      isGuide,
    } = this.props
    const {
      showDayPicker,
      categoriesList,
      hashtagsList,
    } = this.state
    // normally this only happens when you just published a draft
    if (!workingDraft) return null

    return (
      <Container>
        {!isGuide &&
          <div>
            <StyledTitle>{workingDraft.title} DETAILS</StyledTitle>
            <br/>
            <br/>
          </div>
        }
        {!isGuide &&
          <InputRowContainer>
            <ActivitySelectRow>
              <ActivityDetailLabel>Activity: </ActivityDetailLabel>
                <RadioButtonGroup
                  valueSelected={workingDraft.type}
                  name="activity"
                  style={styles.radioButtonGroup}
                  onChange={this.handleRadioChange}
                >
                  {buttons.map((button, index) => {
                    return (
                      <RadioButton
                        key={index}
                        value={button}
                        label={button.toUpperCase()}
                        style={styles.radioButton}
                        labelStyle={styles.radioButtonLabel}
                        checkedIcon={<RadioButtonChecked style={styles.radioButtonFilled} />}
                        uncheckedIcon={<RadioButtonUnchecked/>}
                      />
                    )
                  })}
                </RadioButtonGroup>
            </ActivitySelectRow>
          </InputRowContainer>
        }
        {isGuide &&
          <InputRowContainer>
            <IconWrapper>
              <InfoIcon name='info'/>
            </IconWrapper>
            <StyledInput
              placeholder='Title'
              value={workingDraft.title}
              name='title'
              onChange={this.onGenericChange}
            />
          </InputRowContainer>
        }
        <HorizontalDivider color='lighter-grey' opaque/>
        <InputRowContainer>
          <IconWrapper>
            <LocationIcon name='location'/>
          </IconWrapper>
          <GoogleLocator
            onChange={this.handleLocationSelect}
            address={this.state.address}
          />
        </InputRowContainer>
        {isGuide && this.renderLocations()}
        {!isGuide && <HorizontalDivider color='lighter-grey' opaque/>}
        {!isGuide &&
          <InputRowContainer>
            <IconWrapper>
              <DateIcon name='date'/>
            </IconWrapper>
            <StyledInput
              type='text'
              placeholder={'MM-DD-YYYY'}
              value={this.formatTripDate(workingDraft.tripDate)}
              onClick={this.toggleDayPicker}
              readOnly
            />
            {showDayPicker &&
              <StyledReactDayPicker
                handleDayClick={this.handleDayClick}
                togglePicker={this.toggleDayPicker}
              />
            }
          </InputRowContainer>
        }
        <HorizontalDivider color='lighter-grey' opaque/>
        <TagSelector
          handleTagAdd={this.handleTagAdd}
          loadDefaultTags={this.loadDefaultCategories}
          handleTagRemove={this.handleTagRemove}
          updateTagsList={this.updateCategoriesList}
          isSameTag={isSameTag}
          Icon={TagIcon}
          iconName='tag'
          selectedTags={workingDraft.categories}
          tagsList={categoriesList}
        />
        {!isGuide && <HorizontalDivider color='lighter-grey' opaque/>}
        {!isGuide &&
          <TagSelector
            handleTagAdd={this.handleTagAdd}
            loadDefaultTags={this.loadDefaultHashtags}
            handleTagRemove={this.handleTagRemove}
            updateTagsList={this.updateHashtagsList}
            isSameTag={isSameTag}
            Icon={HashtagIcon}
            iconName='hashtag'
            selectedTags={workingDraft.hashtags}
            tagsList={hashtagsList}
          />
        }
        <HorizontalDivider color='lighter-grey' opaque/>
        {isGuide &&
          <InputRowContainer>
            <IconWrapper>
              <DateIcon name='date'/>
            </IconWrapper>
            <StyledInput
              type='number'
              placeholder='How many days is this guide?'
              value={workingDraft.duration}
              min='1'
              name='duration'
              onChange={this.onGenericChange}
            />
          </InputRowContainer>
        }
        {isGuide && <HorizontalDivider color='lighter-grey' opaque/>}
        <InputRowContainer>
          <IconWrapper>
            <CostIcon name='cost'/>
          </IconWrapper>
          <StyledInput
            type='number'
            placeholder={this.getCostPlaceHolderText(workingDraft.type)}
            value={workingDraft.cost}
            min='0'
            name='cost'
            onChange={this.onGenericChange}
          />
        </InputRowContainer>
        <HorizontalDivider color='lighter-grey' opaque/>
        <TravelTipsContainer>
          <DetailLabel>
            {isGuide ? 'Overview' : 'Travel Tips'}
          </DetailLabel>
          <TravelTipsInput
            value={isGuide ? workingDraft.travelTips : workingDraft.travelTips}
            name='travelTips'
            placeholder={
              isGuide
              ? `What's your guide about?`
              : 'What should your fellow travelers know?'
            }
            onChange={this.onGenericChange}
          />
        </TravelTipsContainer>
        {isGuide &&
          <Container>
            <Row>
              <IconWrapper>
                <CheckIcon
                  name={workingDraft.isPrivate ? 'greyCheck' : 'redCheck'}
                  onClick={this.togglePrivacy}
                />
              </IconWrapper>
              <VerticalCenter>
                <PrivacyLabel>
                  Make this guide public
                </PrivacyLabel>
              </VerticalCenter>
            </Row>
          </Container>
        }
      </Container>
    )
  }
}
