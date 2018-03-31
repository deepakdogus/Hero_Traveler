import PropTypes from 'prop-types'
import { Actions as NavActions } from 'react-native-router-flux'
import React, { Component } from 'react'
import {map} from 'ramda'
import { Image, ScrollView, View, Text } from 'react-native'
import { connect } from 'react-redux'
import { find } from 'lodash'
import SearchBar from '../../Components/SearchBar'

import ListItem from '../../Components/ListItem'
import GuideListItem from '../../Components/GuideListItem'
import storyCoverStyles from '../CreateStory/2_StoryCoverScreenStyles'
import GuideActions from '../../Shared/Redux/Entities/Guides'
import NavBar from '../CreateStory/NavBar'

import { Images, Colors, Metrics } from '../../Shared/Themes'

import styles from '../Styles/AddToGuide'


const mapStateToProps = (state, ownProps) => {
  // Integrate mapping of guides to user here.
  const guides = []
  for (let guideKey of Object.keys(state.entities.guides.entities)) {
    guides.push(state.entities.guides.entities[guideKey])
  }
  return {
    user: state.entities.users.entities[state.session.userId],
    accessToken: find(state.session.tokens, { type: 'access' }),
    guides,
    fetching: state.entities.guides.fetchStatus.fetching,
    loaded: state.entities.guides.fetchStatus.loaded,
    status: state.entities.guides.fetchStatus
  }
}

const mapDispatchToProps = dispatch => ({
  getUserGuides: userId => dispatch(GuideActions.getUserGuides(userId)),
})

class AddToGuide extends Component {
  static defaultProps = {
    onCancel: NavActions.pop,
    onDone: NavActions.pop,
  }

  static propTypes = {
    onCancel: PropTypes.func,
    onDone: PropTypes.func,
  }

  state = {
    loading: true,
  }

  onDone = () => {
    NavActions.pop()
  }

  componentDidMount = () => {
    this.props.getUserGuides(this.props.user.id)
  }

  // Replace with getDerivedStateFromProps in React@16.3+
  componentWillReceiveProps = (nextProps) => {
    if (this.state.loading !== nextProps.fetching) {
      this.setState({
        loading: nextProps.fetching,
      })
    }
  }

  render = () => {
    const { loading } = this.state
    const { guides, onCancel, onDone, story } = this.props
    return (
      <View style={storyCoverStyles.root}>
        <ScrollView keyboardShouldPersistTaps="handled" bounces={false} stickyHeaderIndices={[0]}>
          <NavBar
            onLeft={onCancel}
            leftTitle={'Cancel'}
            title={'ADD TO GUIDE'}
            isRightValid={false}
            onRight={this.onDone}
            rightTitle={'Done'}
            rightTextStyle={storyCoverStyles.navBarRightTextStyle}
            style={storyCoverStyles.navBarStyle}
          />
          <View style={styles.list}>
            <SearchBar
              iconStyles={styles.searchBarIcon}
              selectionColor={Colors.red}
              cancelButton={false}
              autoFocus={false}
              // Should these not be onChange?
              onCancel={() => {}}
              onSearch={() => {}}
              inputStyles={styles.searchBarInput}
              placeholderTextColor={Colors.grey}
              containerStyles={styles.searchBar}
            />
            <GuideListItem create onPress={() => NavActions.createGuide({story})}/>
            { loading && (
              <View>
                <Text>Loading...</Text>
              </View>
            )}
            {/* Images that are uploaded don't display, the actual path isn't returned? */}
            {
              guides && guides.length &&
              guides.map((guide, idx) => (
                <GuideListItem key={`guide--${idx}`} label={guide.title}/>
              ))
            }
          </View>
        </ScrollView>
      </View>
    )
  }
}

const ConnectedAddToGuide = connect(mapStateToProps, mapDispatchToProps)(
  AddToGuide
)

export default ConnectedAddToGuide
