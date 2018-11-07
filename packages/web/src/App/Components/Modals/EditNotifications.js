import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import EditNotificationRow from '../EditNotificationRow'

const notificationTypes = [
  { text: 'New Followers', value: 'user_new_follower' },
  { text: 'Story Liked', value: 'story_like' },
  { text: 'New Comments', value: 'story_comment' },
]

const Container = styled.div`
  padding: 25px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 0;
  }
`
export default class EditNotifications extends React.Component {

  static propTypes = {
    attemptUpdateUser: PropTypes.func,
    userEntitiesUpdating: PropTypes.bool,
    userEntitiesError: PropTypes.object,
    userNotificationTypes: PropTypes.arrayOf(PropTypes.string)
  }

  constructor(props){
    super(props)
    this.state = {
      typesMap: [],
    }
  }

  componentDidMount(){
    this.updateTypesMap(this.props)
  }

  componentDidUpdate(prevProps){
    if(prevProps.userNotificationTypes !== this.props.userNotificationTypes && this.props.userNotificationTypes){
      this.updateTypesMap(this.props)
    }
  }

  updateTypesMap = (propsToUse) => {
    this.setState({
      typesMap: notificationTypes.map(type => {
        if(propsToUse.userNotificationTypes.includes(type.value)){
          return {...type, isNotifying: true}
        }
        else {
          return {...type, isNotifying: false}
        }
      }),
    })
  }

  toggleNotificationSwitch = (identifier) => {
    const newTypesMap = this.state.typesMap.map(type => {
      if(type.value === identifier){
        return {...type, isNotifying: !type.isNotifying}
      }
      else{
        return {...type}
      }
    })

    this.props.attemptUpdateUser({
      notificationTypes: newTypesMap.filter(type => (!!type.isNotifying)).map(type => type.value)
    })
  }

  renderEditNotificationRows(notificationTypes) {
    return this.state.typesMap.map((notificationType, index) => {
      return (
        <EditNotificationRow
          index={index}
          key={notificationType.text}
          text={notificationType.text}
          toggleNotificationSwitch={this.toggleNotificationSwitch}
          logOnChange={this.logOnChange}
          checked={notificationType.isNotifying}
          value={notificationType.value}
        />
      )
    })
  }

  render() {
    return (
      <Container>
        {this.renderEditNotificationRows(notificationTypes)}
      </Container>
    )
  }
}
