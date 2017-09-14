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
  &::placeholder{
    font-family: ${props => props.theme.Fonts.type.base};
    color: ${props => props.theme.Colors.navBarText};
  };
  &::-moz-placeholder{
    font-family: ${props => props.theme.Fonts.type.base};
    color: ${props => props.theme.Colors.navBarText};
  };
  &:-ms-input-placeholder{
    font-family: ${props => props.theme.Fonts.type.base};
    color: ${props => props.theme.Colors.navBarText};
  };
  &:-moz-placeholder{
    font-family: ${props => props.theme.Fonts.type.base};
    color: ${props => props.theme.Colors.navBarText};
  };
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
    closeImage: PropTypes.func,
    caption: PropTypes.string,
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
      day: Moment(day).format('MM-DD-YYYY'),
      showDayPicker: !this.state.showDayPicker,
    })
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
      showTagPicker: false,
    })
  }

  toggleDayPicker = () => this.setState({ showDayPicker: !this.state.showDayPicker })

  toggleTagPicker = () => {
    this.setState({ showTagPicker: !this.state.showTagPicker })
  }

  render() {
    return (
      <Container>
        <StyledTitle>{this.props.title} DETAILS</StyledTitle>
        <br/>
        <br/>
        <InputRowContainer>
          <LocationIcon name='location'/>
          <GoogleLocator/>
        </InputRowContainer>
        <HorizontalDivider color='lighter-grey' opaque/>
        <InputRowContainer>
          <DateIcon name='date'/>
          <StyledInput
            type='text'
            placeholder={'MM-DD-YYYY'}
            value={this.state.day}
            onClick={this.toggleDayPicker}
          />
          {this.state.showDayPicker &&
            <StyledReactDayPicker
              handleDayClick={this.handleDayClick}
            />
          }
        </InputRowContainer>
        <HorizontalDivider color='lighter-grey' opaque/>
        <InputRowContainer onClick={this.toggleTagPicker}>
          <TagIcon name='tag'/>
          <StyledInput
            type='text'
            placeholder={!this.state.tileTags.length ? 'Add tags' : ''}
            value={''}
          />
          {!!this.state.tileTags.length &&
            <TagTileGrid
              tileTags={this.state.tileTags}
              handleTileClick={this.handleTileClick}
            />
          }
          {this.state.showTagPicker &&
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
              <RadioButtonGroup name="activity" defaultSelected="eat" style={styles.radioButtonGroup}>
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
