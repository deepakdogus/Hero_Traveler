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
import CategoryTileGrid from './CategoryTileGrid'
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

const StyledInput = styled.input`
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
  margin-bottom: -8px;
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

function formatCategories(categories) {
  const titleToCategory = {}
  const categoriesList = sortCategories(Object.keys(categories).map(key => {
    const category = categories[key]
    titleToCategory[category.title] = category
    return category
  }))
  return {
    titleToCategory,
    categoriesList,
  }
}

function isSameTag(a, b){
  return a.id === b.id && a.title === b.title
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
      const formatedCategories = formatCategories(props.categories)
      categoriesList = _.differenceWith(formatedCategories.categoriesList, props.workingDraft.categories, isSameTag)
      this.titleToCategory = formatedCategories.titleToCategory
    }
    //

    this.state = {
      showTagPicker: false,
      showDayPicker: false,
      day: '',
      categoriesList,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(this.props.categories).length !== Object.keys(nextProps.categories).length && nextProps.workingDraft){
      const {categoriesList, titleToCategory} = formatCategories(nextProps.categories)
      this.titleToCategory = titleToCategory
      this.setState({
        categoriesList: _.differenceWith(categoriesList, nextProps.workingDraft.categories, isSameTag)
      })
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

  handleCategorySelect = (event) => {
    event.stopPropagation()
    const categoryTitle = event.target.innerHTML
    const clickedCategory = this.titleToCategory[categoryTitle]
    const categories = this.props.workingDraft.categories.concat([clickedCategory])
    this.setState({
      categoriesList: _.differenceWith(this.state.categoriesList, [clickedCategory], isSameTag),
      showPicker: 'category',
    })
    this.props.onInputChange({categories})
  }

  handleCategoryRemove = (event) => {
    event.stopPropagation()
    const clickedCategoryId = event.target.attributes.getNamedItem('data-tagName').value
    const clickedCategory = this.props.categories[clickedCategoryId]
    const categories = _.differenceWith(this.props.workingDraft.categories, [clickedCategory], isSameTag)
    this.setState({
      categoriesList: sortCategories(this.state.categoriesList.concat([clickedCategory])),
    })
    this.props.onInputChange({categories})
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

  render() {
    const {workingDraft, onInputChange} = this.props
    const {showPicker, categoriesList } = this.state
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
          <StyledInput
            type='text'
            placeholder={'Add tags'}
            value={''}
            onClick={this.toggleTagPicker}
          />
          {!!this.props.workingDraft.categories.length &&
            <CategoryTileGrid
              selectedCategories={this.props.workingDraft.categories}
              handleCategoryRemove={this.handleCategoryRemove}
            />
          }
          {showPicker === 'category' &&
            <CategoryPicker
              closePicker={this.togglePicker}
              handleCategorySelect={this.handleCategorySelect}
              categoriesList={categoriesList}
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
