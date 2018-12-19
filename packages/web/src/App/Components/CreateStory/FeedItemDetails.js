import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Moment from 'moment'
import _ from 'lodash'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked'
import RadioButtonChecked from 'material-ui/svg-icons/toggle/radio-button-checked'

import { Grid, Row } from '../FlexboxGrid'
import Icon from '../Icon'
import HorizontalDivider from '../HorizontalDivider'
import FeedItemDetailsLocator from './FeedItemDetailsLocator'
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
    margin: 0 15px;
  }
`

const StyledTitle = styled(Title)`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-size: 28px;
  letter-spacing: .6px;
  text-transform: uppercase;
`

const StyledGrid = styled(Grid)`
  margin-left: 0px;
  width: 90%;
`

const VerticallyCenterRow = styled(Row)`
  align-items: center;
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
  margin-left: 5px;
`

export const StyledInput = styled.input`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 18px;
  letter-spacing: .2px;
  width: 80%;
  color: ${props => props.theme.Colors.background};
  border-width: 0;
  margin: 10px 0 10px 25px;
  outline: none;
  ::placeholder {
    font-family: ${props => props.theme.Fonts.type.base};
    color: ${props => props.theme.Colors.navBarText};
  }
`

const StyledCheckbox = styled.input`
  @supports (zoom:1.2) {
    zoom: 1.7
  }
  @supports not (zoom:1.2) {
    transform: scale(1.5);
  }
  margin: 2px 0 0;
`

const IconWithMargin = styled(Icon)`
  margin-left: 2px;
  width: 30px;
  height: 30px;
`

const EnlargedIcon = styled(IconWithMargin)`
  width: 35px;
  height: 35px;
`

const HashtagIcon = styled(EnlargedIcon)``

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
  letter-spacing: .2px;
  width: 100%;
  height: 160px;
  resize: none;
  border-width: 1px;
  border-color: ${props => props.theme.Colors.navBarTextLowOpacity};
  border-radius: 2.5px;
  padding: 10px;
  margin-top: 5px;
  box-sizing: border-box;
`

const Spacer = styled.div`
  height: 45px;
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
    letterSpacing: .2,
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
  margin-left: 15px;
  flex-direction: row;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
`

const StyledDivider = styled(HorizontalDivider)`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0.5em 15px;
  }
`

const sortCategories = (categories) => {
  return categories.sort((a,b) => {
    if (a.title < b.title) return -1
    else return 1
  })
}

const formatCategories = (categories) => sortCategories(_.values(categories))

const isSameTag = (a, b) => a.title === b.title

const isSameLocation = (a, b) => {
  // use coords over names to prevent match of distinct location with duplicate names
  return a.latitude === b.latitude && a.longitude === b.longitude
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
    if (!day) return Moment().format('MM-DD-YYYY')
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

  handleTileRemove = (event, clickedTitle, type = 'categories') => {
    event.stopPropagation()
    const findByTitleFns = {
      categories: tile => tile.title === clickedTitle,
      locations: tile => displayLocationDetails(tile) === clickedTitle,
    }
    const isSameFns = {
      categories: isSameTag,
      locations: isSameLocation,
    }
    const selectedTilesOfType = this.props.workingDraft[type]

    const clickedTile = _.find(selectedTilesOfType, findByTitleFns[type])
    if (!clickedTile) return

    const updatedTiles = _.differenceWith(
      selectedTilesOfType,
      [clickedTile], isSameFns[type],
    )

    if (type === 'categories') {
      this.updateCategoriesList(
        sortCategories(this.state.categoriesList.concat([clickedTile])),
      )
    }
    this.props.onInputChange({ [type]: updatedTiles })
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
    const handleLocationTileRemove = (event, clickedTitle) => {
      this.handleTileRemove(event, clickedTitle, 'locations')
    }

    return (
      <StyledGrid>
        <VerticallyCenterRow>
          {!!this.props.workingDraft.locations.length && <TilesWrapper>
            {
              this.props.workingDraft.locations.map((location, index) => {
                return <Tile
                  key={index}
                  text={displayLocationDetails(location)}
                  handleTileRemove={handleLocationTileRemove}
                />
              })
            }
          </TilesWrapper>
          }
          <FeedItemDetailsLocator
            onChange={this.handleLocationSelect}
            address={this.state.address}
            isGuide={true}
          />
        </VerticallyCenterRow>
      </StyledGrid>
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
        {isGuide && <Spacer />}
        {isGuide &&
          <InputRowContainer>
            <IconWrapper>
              <IconWithMargin name='infoLarge'/>
            </IconWrapper>
            <StyledInput
              placeholder='Title'
              value={workingDraft.title}
              name='title'
              onChange={this.onGenericChange}
              autoComplete='off'
            />
          </InputRowContainer>
        }
        <StyledDivider color='lighter-grey' opaque/>
        <InputRowContainer>
          <IconWrapper>
            <EnlargedIcon name='locationLarge'/>
          </IconWrapper>
          {isGuide
            ? this.renderLocations()
            : <FeedItemDetailsLocator
                onChange={this.handleLocationSelect}
                address={this.state.address}
              />
          }
        </InputRowContainer>
        {!isGuide && <StyledDivider color='lighter-grey' opaque/>}
        {!isGuide &&
          <InputRowContainer>
            <IconWrapper>
              <EnlargedIcon name='dateLarge'/>
            </IconWrapper>
            <StyledInput
              type='text'
              placeholder={this.formatTripDate()}
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
        <StyledDivider color='lighter-grey' opaque/>
        <TagSelector
          handleTagAdd={this.handleTagAdd}
          loadDefaultTags={this.loadDefaultCategories}
          handleTileRemove={this.handleTileRemove}
          updateTagsList={this.updateCategoriesList}
          isSameTag={isSameTag}
          Icon={EnlargedIcon}
          iconName='tagLarge'
          selectedTags={workingDraft.categories}
          tagsList={categoriesList}
        />
        {!isGuide && <StyledDivider color='lighter-grey' opaque/>}
        {!isGuide &&
          <TagSelector
            handleTagAdd={this.handleTagAdd}
            loadDefaultTags={this.loadDefaultHashtags}
            handleTileRemove={this.handleTileRemove}
            updateTagsList={this.updateHashtagsList}
            isSameTag={isSameTag}
            Icon={HashtagIcon}
            iconName='hashtag'
            selectedTags={workingDraft.hashtags}
            tagsList={hashtagsList}
          />
        }
        <StyledDivider color='lighter-grey' opaque/>
        {isGuide &&
          <InputRowContainer>
            <IconWrapper>
              <EnlargedIcon name='dateLarge'/>
            </IconWrapper>
            <StyledInput
              type='number'
              placeholder='How many days is this guide?'
              value={workingDraft.duration}
              min='1'
              name='duration'
              onChange={this.onGenericChange}
              autoComplete='off'
            />
          </InputRowContainer>
        }
        {isGuide && <StyledDivider color='lighter-grey' opaque/>}
        <InputRowContainer>
          <IconWrapper>
            <IconWithMargin name='costLarge'/>
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
        <StyledDivider color='lighter-grey' opaque/>
        <Spacer />
        <TravelTipsContainer>
          <DetailLabel>
            {isGuide ? 'Overview' : 'Travel Tips'}
          </DetailLabel>
          <TravelTipsInput
            value={isGuide ? workingDraft.description : workingDraft.travelTips}
            name={isGuide ? 'description' : 'travelTips'}
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
              <VerticalCenter>
                <StyledCheckbox
                  checked={workingDraft.isPrivate || false}
                  type='checkbox'
                  onClick={this.togglePrivacy}
                />
              </VerticalCenter>
              <VerticalCenter>
                <PrivacyLabel>
                  Make this guide private
                </PrivacyLabel>
              </VerticalCenter>
            </Row>
          </Container>
        }
      </Container>
    )
  }
}
