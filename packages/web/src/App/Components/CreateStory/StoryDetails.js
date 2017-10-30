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
import MultiTagPicker from './MultiTagPicker'
import TagTileGrid from './TagTileGrid'
import {Title} from './Shared'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import RadioButtonChecked from 'material-ui/svg-icons/toggle/radio-button-checked';
import {feedExample} from '../../Containers/Feed_TEST_DATA'

//test tags
let testTagNames = [];
const categoriesExample = feedExample[Object.keys(feedExample)[0]].categories
for (var i=0; i<categoriesExample.length; i++)
    testTagNames.push(categoriesExample[i].title)

const Container = styled.div`
`

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

export default class StoryDetails extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    workingDraft: PropTypes.object,
    onInputChange: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      showTagPicker: false,
      showDayPicker: false,
      day: '',
      tileTags: [],
      listTags: testTagNames.sort(),
    };
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

  handleTagClick = (event) => {
    let clickedTag = event.target.innerHTML;
    this.setState({
      listTags: _.pull(this.state.listTags, clickedTag),
      tileTags: this.state.tileTags.concat([clickedTag]),
      showTagPicker: !this.state.showTagPicker,
    })
  }

  handleTileClick = (event) => {
    event.stopPropagation();
    let clickedTile = event.target.attributes.getNamedItem('data-tagName').value;
    this.setState({
      listTags: this.state.listTags.concat([clickedTile]).sort(),
      tileTags: _.pull(this.state.tileTags, clickedTile),
      showPicker: undefined,
    })
  }

  togglePicker = (name) => {
    let nextPickerState = name
    if (this.state.showPicker === name) nextPickerState = undefined
    this.setState({ showPicker: nextPickerState })
 }

  toggleDayPicker = () => this.togglePicker('day')
  toggleTagPicker = () => this.togglePicker('tag')

  formatTripDate = (day) => {
    if (!day) return undefined
    else return Moment(day).format('MM-DD-YYYY')
  }

  render() {
    const {workingDraft, onInputChange} = this.props
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
          {this.state.showPicker === 'day' &&
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
            placeholder={!this.state.tileTags.length ? 'Add tags' : ''}
            value={''}
            onClick={this.toggleTagPicker}
          />
          {!!this.state.tileTags.length &&
            <TagTileGrid
              tileTags={this.state.tileTags}
              handleTileClick={this.handleTileClick}
            />
          }
          {this.state.showPicker === 'tag' &&
            <MultiTagPicker
              handleTagClick={this.handleTagClick}
              listTags={this.state.listTags}
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
