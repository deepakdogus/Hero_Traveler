import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Avatar from '../Avatar'
import RoundedButton from '../RoundedButton'
import getImageUrl from '../../Shared/Lib/getImageUrl'

const UserContainer = styled.div`
	margin: 0 3%;
	display: flex;
	position: relative;
`

const VerticalCenter = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`
const UserInfo = styled(VerticalCenter)`
	padding-left: 25px;
`

const Right = styled(VerticalCenter)`
	position: absolute;
	height: 100%;
	right: 0;
`

const UserName = styled.p`
	margin: 0;
`

const Followers = styled.p`
	margin: 0;
	color: ${props => props.theme.Colors.signupGrey};
`


export default class SocialMediaRow extends Component {
	 static propTypes = {
    user: PropTypes.object,
    isSelected: PropTypes.bool,
  }

  render() {
  	const {user, isSelected} = this.props
    return (
			<UserContainer>
				<Avatar 
					avatarUrl={getImageUrl(user.profile.avatar)}
					size='large'
				/>
				<UserInfo>
					<UserName>{user.profile.fullName}</UserName>
					<Followers>{user.counts.followers} followers</Followers>
				</UserInfo>
				<Right>
					<RoundedButton 
						text={isSelected ? 'FOLLOWING' : '+ FOLLOW'}
						type={isSelected ? undefined : 'blackWhite'}
						margin='none'
					/>
				</Right>
			</UserContainer>
    )
  }
}
