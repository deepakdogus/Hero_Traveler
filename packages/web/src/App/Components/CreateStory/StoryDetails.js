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

const Container = styled.div``

const InputRowContainer = styled(Container)`
  padding: 20px 0px 14px 0px;
  position: relative;
`

const StyledTitle = styled(Title)`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-size: 28px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`

const ActivitySelectRow = styled(Row)`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .7px;
  margin: 8px;
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

const LocationIcon = styled(Icon)`
  height: 34px;
  width: 23px;
  margin-bottom: -12px;
  margin-left: 2px;
`

const DateIcon = styled(Icon)`
  height: 26px;
  width: 30px;
  margin-bottom: -8px;
`
const TagIcon = styled(Icon)`
  height: 26px;
  margin-left: 2px;
`

const StyledReactDayPicker = styled(ReactDayPicker)`
  position: absolute;
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
  },
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
      showTagPicker: false,
      showDayPicker: false,
      day: '',
      categoryInputText: '',
      categoriesList,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(this.props.categories).length !== Object.keys(nextProps.categories).length && nextProps.workingDraft){
      const categoriesList = formatCategories(nextProps.categories)
      this.updateCategoriesList(_.differenceWith(categoriesList, nextProps.workingDraft.categories, isSameTag))
    }
  }


  handleDayClick = (day) => {
    this.setState({
      showPicker: undefined,
    })
    this.props.onInputChange({
      tripDate: day,
    })
  }

  handleRadioChange = (event, value) => {
    this.props.onInputChange({type: value})
  }

  togglePicker = (name) => {
    let nextPickerState = name
    if (this.state.showPicker === name) nextPickerState = undefined
    this.setState({ showPicker: nextPickerState })
 }

  toggleDayPicker = () => this.togglePicker('day')
  toggleTagPicker = () => this.togglePicker('category')

  formatTripDate = (day) => {
    if (!day) return undefined
    else return Moment(day).format('MM-DD-YYYY')
  }

  handleCategoryAdd = (categoryName) => { 
    this.updateCategoriesList([ {title: categoryName}, ...this.state.categoriesList ])
  }

  handleCategorySelect = (event, category) => {
    event.stopPropagation()
    const categoryTitle = event.target.innerHTML
    const clickedCategory = category || { title: categoryTitle }
    const categories = this.props.workingDraft.categories.concat([clickedCategory])
    this.updateCategoriesList(_.differenceWith(this.state.categoriesList, [clickedCategory], isSameTag))
    this.setState({
      showPicker: 'category',
      categoryInputText: '',
    })
    this.props.onInputChange({categories})
  }

  handleCategoryRemove = (event, tagId) => {
    event.stopPropagation()
    const clickedCategoryId = tagId
    const clickedCategory = this.props.categories[clickedCategoryId] || _.find(this.props.workingDraft.categories, cat => cat.id === clickedCategoryId)
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
  }

  loadDefaultCategories = () => {
    if (this.props.categories && this.props.workingDraft) {
      const categoriesList = formatCategories(this.props.categories)
      this.updateCategoriesList(_.differenceWith(categoriesList, this.props.workingDraft.categories, isSameTag))
    }
  }

  render() {
    const {workingDraft, onInputChange } = this.props
    const {showPicker, categoriesList} = this.state

    // normally this only happens when you just published a draft
    if (!workingDraft) return null
    return (
      <Container>
        <StyledTitle>{workingDraft.title} DETAILS</StyledTitle>
        <br/>
        <br/>
        <InputRowContainer>
          <LocationIcon name='location'/>
          <GoogleLocator
            onChange={onInputChange}
            address={workingDraft.location}
          />
        </InputRowContainer>
        <HorizontalDivider color='lighter-grey' opaque/>
        <InputRowContainer>
          <DateIcon name='date'/>
          <StyledInput
            type='text'
            placeholder={'MM-DD-YYYY'}
            value={this.formatTripDate(workingDraft.tripDate)}
            onClick={this.toggleDayPicker}
            readOnly
          />
          {showPicker === 'day' &&
            <StyledReactDayPicker
              handleDayClick={this.handleDayClick}
            />
          }
        </InputRowContainer>
        <HorizontalDivider color='lighter-grey' opaque/>
        <InputRowContainer>
          <TagIcon name='tag'/>        
          <CategoryTileGrid
            selectedCategories={this.props.workingDraft.categories}
            handleCategoryRemove={this.handleCategoryRemove}
            inputOnClick={this.toggleTagPicker}
            categories={categoriesList}
            addCategory={this.handleCategoryAdd}
            updateCategoriesList={this.updateCategoriesList}
            categoryInputText={this.state.categoryInputText}
            handleTextInput={this.handleCategoryInputTextChange}
          />
          {showPicker === 'category' &&
            <CategoryPicker
              closePicker={this.togglePicker}
              handleCategorySelect={this.handleCategorySelect}
              categoriesList={categoriesList}
              loadDefaultCategories={this.loadDefaultCategories}
            />
          }
        </InputRowContainer>
        <HorizontalDivider color='lighter-grey' opaque/>
        <InputRowContainer>
          <ActivitySelectRow>
            <label>Activity: </label>
              <RadioButtonGroup
                valueSelected={workingDraft.type}
                name="activity"
                style={styles.radioButtonGroup}
                onChange={this.handleRadioChange}
              >
                <RadioButton
                  value="eat"
                  label="EAT"
                  style={styles.radioButton}
                  labelStyle={styles.radioButtonLabel}
                  checkedIcon={<RadioButtonChecked style={{fill: '#ed1e2e'}} />}
                  uncheckedIcon={<RadioButtonUnchecked/>}
                />
                <RadioButton
                  value="stay"
                  label="STAY"
                  style={styles.radioButton}
                  labelStyle={styles.radioButtonLabel}
                  checkedIcon={<RadioButtonChecked style={{fill: '#ed1e2e'}} />}
                  uncheckedIcon={<RadioButtonUnchecked/>}
                />
                <RadioButton
                  value="do"
                  label="DO"
                  style={styles.radioButton}
                  labelStyle={styles.radioButtonLabel}
                  checkedIcon={<RadioButtonChecked style={{fill: '#ed1e2e'}} />}
                  uncheckedIcon={<RadioButtonUnchecked/>}
                />
              </RadioButtonGroup>
          </ActivitySelectRow>
        </InputRowContainer>
        <HorizontalDivider color='lighter-grey' opaque/>
      </Container>
    )
  }
}
