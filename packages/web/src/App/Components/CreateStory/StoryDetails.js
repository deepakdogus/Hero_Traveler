import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Moment from 'moment'
import _ from 'lodash'
import {Row} from '../FlexboxGrid'
import Icon from '../Icon'
import HorizontalDivider from '../HorizontalDivider'
import GoogleLocator from './GoogleLocator'
import ReactDayPicker from './ReactDayPicker'
import CategoryPicker from './CategoryPicker'
import CategoryTileGridAndInput from './CategoryTileGridAndInput'
import {Title} from './Shared'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked'
import RadioButtonChecked from 'material-ui/svg-icons/toggle/radio-button-checked'

const Container = styled.div`
  padding: 14px 0px 14px 0px;
  position: relative;
`

const InputRowContainer = styled(Container)`
  display: flex;
  align-items: center;
`

const StyledTitle = styled(Title)`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-size: 28px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`

const ActivitySelectRow = styled(Row)``

const DetailLabel = styled.label`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .7px;
  padding-left: 2px;
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

const HashtagIcon = styled(IconWithMargin)`
  height: 35px;
  width: 35px;
`

const CostIcon = styled(IconWithMargin)`
  height: 30px;
  width: 30px;
`

const IconWrapper = styled.div`
  width: 35px;
  text-align: center;
`

const StyledReactDayPicker = styled(ReactDayPicker)`
  position: absolute;
`

const RelativePositionAncestor = styled.div`
  position: relative;
  width: 100px;
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
  border-width: 2.5px;
  border-color: ${props => props.theme.Colors.navBarText};
  border-radius: 2.5px;
  padding: 10px;
  margin-top: 5px;
`

const styles = {
  radioButton: {
    display: 'inline-block',
    width: 120,
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
    marginLeft: 40,
    display: 'flex',
    alignItems: 'center',
  },
  radioButtonFilled: {
    fill: '#ed1e2e',
  }
}

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

export default class StoryDetails extends React.Component {
  static propTypes = {
    workingDraft: PropTypes.object,
    onInputChange: PropTypes.func,
    categories: PropTypes.object,
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
      address: _.get(this.props.workingDraft, ['locationInfo', 'name'], '')
    };
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(this.props.categories).length !== Object.keys(nextProps.categories).length && nextProps.workingDraft){
      const categoriesList = formatCategories(nextProps.categories)
      this.updateCategoriesList(_.differenceWith(categoriesList, nextProps.workingDraft.categories, isSameTag))
    }
  }

  handleLocationSelect = (addressObj) => {
    const {location, locationInfo} = addressObj
    if (!location && locationInfo) {
      this.setState({address: locationInfo.name})
      this.props.onInputChange({locationInfo: locationInfo})
    } else {
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

  handleCategorySelect = (event, category) => {
    event.stopPropagation()
    const categoryTitle = event.target.innerHTML || category
    // If it is already a category in DB, we need to fetch the whole object
    const clickedCategory = _.find(this.state.categoriesList, cat => cat.title === categoryTitle) || { title: categoryTitle }
    const categories = this.props.workingDraft.categories.concat([clickedCategory])
    this.loadDefaultCategories([clickedCategory])
    this.setState({categoryInputText: ''})
    this.props.onInputChange({categories})
  }

  handleCategoryRemove = (event, tagTitle) => {
    event.stopPropagation()
    const clickedCategoryTitle = tagTitle
    const clickedCategory = _.find(this.props.workingDraft.categories, cat => cat.title === clickedCategoryTitle)
    const categories = _.differenceWith(this.props.workingDraft.categories, [clickedCategory], isSameTag)
    this.updateCategoriesList(sortCategories(this.state.categoriesList.concat([clickedCategory])))
    this.props.onInputChange({categories})
  }

  updateCategoriesList = (newCategoriesList) => {
    this.setState({
      categoriesList: newCategoriesList
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

  onGenericChange = (event) => {
    this.props.onInputChange({
      [event.target.name]: event.target.value,
    })
  }

  render() {
    const {workingDraft} = this.props
    const {showDayPicker, showCategoryPicker, categoriesList} = this.state

    // normally this only happens when you just published a draft
    if (!workingDraft) return null
    return (
      <Container>
        <StyledTitle>{workingDraft.title} DETAILS</StyledTitle>
        <br/>
        <br/>
        <InputRowContainer>
          <ActivitySelectRow>
            <DetailLabel>Activity: </DetailLabel>
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
        <HorizontalDivider color='lighter-grey' opaque/>
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
        <HorizontalDivider color='lighter-grey' opaque/>
        <InputRowContainer>
          <IconWrapper>
            <TagIcon name='tag'/>
          </IconWrapper>
          <CategoryTileGridAndInput
            selectedCategories={this.props.workingDraft.categories}
            handleCategoryRemove={this.handleCategoryRemove}
            inputOnClick={this.toggleCategoryPicker}
            categories={categoriesList}
            addCategory={this.handleCategorySelect}
            updateCategoriesList={this.updateCategoriesList}
            categoryInputText={this.state.categoryInputText}
            handleTextInput={this.handleCategoryInputTextChange}
            isSameTag={isSameTag}
          >
        {/* Making the Category Picker a child so we can position it absolutely, relative
          to where the last category tile is
        */}
          {
            showCategoryPicker &&
            <RelativePositionAncestor>
              <CategoryPicker
                closePicker={this.toggleCategoryPicker}
                handleCategorySelect={this.handleCategorySelect}
                categoriesList={categoriesList}
                loadDefaultCategories={this.loadDefaultCategories}
              />
            </RelativePositionAncestor>
          }
          </CategoryTileGridAndInput>
        </InputRowContainer>
        <HorizontalDivider color='lighter-grey' opaque/>
        <InputRowContainer>
          <IconWrapper>
            <CostIcon name='cost'/>
          </IconWrapper>
          <StyledInput
            type='number'
            placeholder='Cost (USD)'
            value={workingDraft.cost}
            min='0'
            name='cost'
            onChange={this.onGenericChange}
          />
        </InputRowContainer>
        <HorizontalDivider color='lighter-grey' opaque/>
        <Container>
          <DetailLabel>
            Travel Tips
          </DetailLabel>
          <TravelTipsInput
            value={workingDraft.travelTips}
            name='travelTips'
            placeholder='What should your fellow travelers know?'
            onChange={this.onGenericChange}
          />
        </Container>
      </Container>
    )
  }
}
