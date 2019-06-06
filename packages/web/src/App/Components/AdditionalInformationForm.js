import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import styled from 'styled-components'
import { getLatLng, geocodeByPlaceId } from 'react-places-autocomplete'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked'
import RadioButtonChecked from 'material-ui/svg-icons/toggle/radio-button-checked'

import RoundedButton from '../../Shared/Web/Components/RoundedButton'
import { WrappedNavLink } from '../../Shared/Web/Components/NavLinkStyled'
import { Title, Subtitle } from './SignupSocial'
import HorizontalDivider from '../../Components/HorizontalDivider'
import DropdownDatePicker from '../../Components/DropdownDatePicker'
import GoogleLocator from '../../Components/GoogleLocator'

import { formatLocationWeb } from '../../Shared/Lib/formatLocation'
import '../../Components/CreateStory/Styles/GoogleLocatorStyles.css'

const TopicsContainer = styled.div`
  margin-bottom: 30px;
`

const NavLinkContainer = styled(TopicsContainer)`
  width: 100%;
  position: fixed;
  top: 85px;
  display: flex;
  justify-content: flex-end;
  z-index: 1;
`

const Container = styled.div`
  margin: 100px 7.5%;
  text-align: center;
`

const SizedDiv = styled.div`
  max-width: 540px;
  margin: 0 auto;
`

const DescriptionTitle = styled.p`
  margin-bottom: 0;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 600;
  letter-spacing: 0.7px;
  font-size: 17px;
  color: ${props => props.theme.Colors.background};
`

const AddInfoContainer = styled.div`
  margin-top: 50px;
  text-align: left;
`

const Section = styled.div`
  margin-bottom: 50px;
`

const SectionLabel = styled.p`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 600;
  font-size: 15px;
  color: ${props => props.theme.Colors.background};
`

const SectionContent = styled.div`
  margin-top: 15px;
`

const GenderRow = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.Colors.navBarText};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    flex-direction: column;
  }
`

const DropdownContainer = styled.div`
  position: absolute;
  top: 35px;
  left: 0px;
  background-color: white;
  border: none;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  width: 100%;
  z-index: 100;
  margin: 10px 0px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    top: 45px;
  }
`

const InactiveAutocompleteItemContainer = styled.div`
  background-color: #ffffff;
  color: #555555;
  cursor: pointer;
`

const ActiveAutocompleteItemContainer = styled(InactiveAutocompleteItemContainer)`
  background-color: ${props => props.theme.Colors.lightGreyAreas};
`

const AutocompleteItem = styled.div`
  padding: 10px;
`

const StyledLocation = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.2px;
  color: ${props => props.theme.Colors.background};
  margin: 0px;
`

const StyledAddress = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0.2px;
  color: ${props => props.theme.Colors.grey};
  margin: 0px;
`

const StyledHorizontalDivider = styled(HorizontalDivider)`
  padding: 0;
  border-width: 1px;
  margin: 0 10px;
`

const InputRow = styled.div`
  position: relative;
  border-bottom: 1px solid ${props => props.theme.Colors.navBarText};
`

const Input = styled.input`
  width: ${props => props.width || '100%'};
  padding: 10px 0;
  font-weight: 400;
  letter-spacing: 0.7px;
  font-size: 16px;
  border: none;
  color: ${props => props.theme.Colors.background};
  &::placeholder {
    color: ${props => props.theme.Colors.grey};
  }
  &:disabled {
    color: ${props => props.theme.Colors.navBarText};
  }
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 15px 0;
    width: 100%;
  }
`

// radio button Styles
const styles = {
  radioButton: {
    justifyContent: 'flex-end',
  },
  radioButtonLabel: {
    fontWeight: '400',
    letterSpacing: '0.7px',
    fontSize: '16px',
    border: 'none',
    color: '#757575',
  },
  radioIcon: {
    fill: '#ed1e2e',
  },
  radioButtonGroup: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  radioButtonFilled: {
    fill: '#ed1e2e',
  },
  radioButtonUnfilled: {
    fill: '#bdbdbd',
  },
}

class AdditionalInformationForm extends Component {
  static propTypes = {
    updateUser: PropTypes.func,
  }

  state = {
    address: '',
    locationInfo: null,
    birthday: null,
    gender: '',
    genderSelfDescribed: '',
    modalVisible: false,
    submitted: false,
  }

  handleHometownChange = address => this.setState({ address })

  handleHometownSelect = async (address, placeId) => {
    this.setState({ address })
    let locationInfo = await formatLocationWeb(
      address,
      placeId,
      geocodeByPlaceId,
      getLatLng,
    )
    this.setState({ locationInfo, location: locationInfo.name })
  }

  handleBirthdaySelect = momentDate => {
    const birthday = momentDate.toDate()
    if (birthday instanceof Date && !isNaN(birthday)) {
      this.setState({ birthday })
    }
  }

  selectGenderOption = (event, gender) => {
    this.setState({ gender, genderSelfDescribed: '' })
  }

  onGenderTextChange = event => {
    const genderSelfDescribed = event.target.value
    if (!genderSelfDescribed) this.setState({ gender: 'other' })
    this.setState({ genderSelfDescribed })
  }

  onClickNext = () => {
    const { locationInfo, birthday, gender, genderSelfDescribed } = this.state

    // data prep
    const attrs = {}
    if (locationInfo) attrs.locationInfo = locationInfo
    if (birthday) attrs.birthday = birthday
    if (genderSelfDescribed) attrs.gender = genderSelfDescribed.toLowerCase()
    else if (gender) attrs.gender = gender.toLowerCase()

    // update user
    if (Object.keys(attrs).length) this.props.updateUser(attrs)

    // induce navigation
    this.setState({ submitted: true })
  }

  renderHometownInput = ({ getInputProps, suggestions, getSuggestionItemProps }) => (
    <InputRow>
      <Input
        {...getInputProps({
          placeholder: 'Hometown',
        })}
      />
      <DropdownContainer>
        {suggestions.map((suggestion, idx) => {
          const AutocompleteContainer = suggestion.active
            ? ActiveAutocompleteItemContainer
            : InactiveAutocompleteItemContainer
          if (suggestion.types.includes('country')) return null
          return (
            <AutocompleteContainer
              key={suggestion.placeId}
              {...getSuggestionItemProps(suggestion)}
            >
              <AutocompleteItem>
                <StyledLocation>{suggestion.formattedSuggestion.mainText}</StyledLocation>
                <StyledAddress>
                  {suggestion.formattedSuggestion.secondaryText}
                </StyledAddress>
              </AutocompleteItem>
              {idx !== suggestions.length - 1 && (
                <StyledHorizontalDivider
                  color="lighter-grey"
                  opaque
                />
              )}
            </AutocompleteContainer>
          )
        })}
      </DropdownContainer>
    </InputRow>
  )

  render() {
    const { address, gender, genderSelfDescribed } = this.state
    const startRange = moment()
      .subtract(100, 'years')
      .format('YYYY-MM-DD')
    const endRange = moment()
      .subtract(13, 'years')
      .format('YYYY-MM-DD')

    return (
      <TopicsContainer>
        <Container>
          <SizedDiv>
            <Title>WELCOME!</Title>
            <DescriptionTitle>
              Tell us about yourself so we can better customize your experience.
            </DescriptionTitle>
            <Subtitle>
              (This is optional info that is not visible to other users)
            </Subtitle>
            <AddInfoContainer>
              <Section>
                <GoogleLocator
                  value={address}
                  searchOptions={{ types: ['(regions)'] }}
                  onChange={this.handleHometownChange}
                  onSelect={this.handleHometownSelect}
                  renderChildren={this.renderHometownInput}
                />
              </Section>
              <Section>
                <SectionLabel>Birthday</SectionLabel>
                <SectionContent>
                  <DropdownDatePicker
                    name="birthday"
                    startRange={startRange}
                    endRange={endRange}
                    onChange={this.handleBirthdaySelect}
                  />
                </SectionContent>
              </Section>
              <Section>
                <SectionLabel>Gender</SectionLabel>
                <SectionContent>
                  <GenderRow>
                    <RadioButtonGroup
                      valueSelected={this.state.gender}
                      name="gender"
                      style={styles.radioButtonGroup}
                      onChange={this.selectGenderOption}
                      row
                    >
                      <RadioButton
                        value={'male'}
                        label={'Male'}
                        style={styles.radioButton}
                        labelStyle={styles.radioButtonLabel}
                        checkedIcon={
                          <RadioButtonChecked style={styles.radioButtonFilled} />
                        }
                        uncheckedIcon={
                          <RadioButtonUnchecked style={styles.radioButtonUnfilled} />
                        }
                      />
                      <RadioButton
                        value={'female'}
                        label={'Female'}
                        style={styles.radioButton}
                        labelStyle={styles.radioButtonLabel}
                        checkedIcon={
                          <RadioButtonChecked style={styles.radioButtonFilled} />
                        }
                        uncheckedIcon={
                          <RadioButtonUnchecked style={styles.radioButtonUnfilled} />
                        }
                      />
                      <RadioButton
                        value={'other'}
                        label={'Other:'}
                        style={styles.radioButton}
                        inputStyle={{ backgroundColor: 'green' }}
                        labelStyle={styles.radioButtonLabel}
                        checkedIcon={
                          <RadioButtonChecked style={styles.radioButtonFilled} />
                        }
                        uncheckedIcon={
                          <RadioButtonUnchecked style={styles.radioButtonUnfilled} />
                        }
                      />
                    </RadioButtonGroup>
                    <Input
                      width={'200px'}
                      placeholder="Self Describe"
                      value={
                        !['male', 'female', 'other'].includes(genderSelfDescribed)
                          ? genderSelfDescribed
                          : ''
                      }
                      disabled={['male', 'female'].includes(gender) || gender !== 'other'}
                      onChange={this.onGenderTextChange}
                    />
                  </GenderRow>
                </SectionContent>
              </Section>
            </AddInfoContainer>
          </SizedDiv>
        </Container>
      </TopicsContainer>
    )
  }
}

export default AdditionalInformationForm
