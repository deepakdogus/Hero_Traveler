import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import RoundedButton from '../../RoundedButton'
import Icon from '../../Icon'
import {Row} from '../../FlexboxGrid'
import VerticalCenter from '../../VerticalCenter'

const FacebookIcon = styled(Icon)`
  height: 21.5px;
  width: 11px;
  padding: 0 7px;
  margin-right: 25px;
`

const TwitterIcon = styled(Icon)`
  height: 20px;
  width: 25px;
  margin-right: 25px;
  margin-left: -21px;
`

const SocialMediaText = styled.p`
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .7px;
  color: ${props => props.theme.Colors.white};
  margin: 7px 0;
`

/*
There is finicky styling for the social media buttons (In order to make the text aligned and
the Icons the same size) so to keep other files clear I am doing the ugly work here
*/
export default class SocialMediaButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    iconName: PropTypes.string.isRequired,
    page: PropTypes.oneOf(['login', 'signup']),
    type: PropTypes.string,
  }

  getIcon() {
    return this.props.iconName === 'facebookLarge' ? FacebookIcon : TwitterIcon
  }

  render() {
    const {
      type,
      iconName,
      page,
      onClick
    } = this.props
    const SelectedIcon = this.getIcon()

    return (
        <RoundedButton
          width='100%'
          margin='vertical'
          type={type}
          onClick={onClick}
        >
          <Row center='xs'>
            <VerticalCenter>
              <SelectedIcon name={iconName}/>
            </VerticalCenter>
            <SocialMediaText>{page === 'login' ? 'Login' : 'Sign up'} with
              <strong> {type === 'facebookSignup' ? 'Facebook' : 'Twitter'}</strong>
            </SocialMediaText>
          </Row>
        </RoundedButton>
    )
  }
}
