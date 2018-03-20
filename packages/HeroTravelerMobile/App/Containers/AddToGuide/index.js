import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import React, { Component } from 'react'
import { Image, ScrollView, View, Text } from 'react-native'
import { connect } from 'react-redux'
import { find } from 'lodash'
import SearchBar from '../../Components/SearchBar'

import ListItem from '../../Components/ListItem'
import GuideListItem from '../../Components/GuideListItem'
import storyCoverStyles from '../CreateStory/2_StoryCoverScreenStyles'
import NavBar from '../CreateStory/NavBar'

import { Images, Colors, Metrics } from '../../Shared/Themes'

import styles from './addtoguide.style'

const mapStateToProps = state => ({
  user: state.entities.users.entities[state.session.userId],
  accessToken: find(state.session.tokens, { type: 'access' }),
})

const mapDispatchToProps = () => ({})

class AddToGuide extends Component {
  static defaultProps = {
    onCancel: Actions.pop,
    onDone: Actions.pop,
  }

  static propTypes = {
    onCancel: PropTypes.func,
    onDone: PropTypes.func,
  }

  render = () => {
    const { onCancel, onDone } = this.props
    const dummyGuides = [
      {
        coverImage: Images.usageExamples,
        title: 'India'
      },
      {
        active: true,
        coverImage: Images.usageExamples,
        title: 'Africa',
      },
      {
        coverImage: Images.usageExamples,
        title: 'Japan'
      }
    ]
    return (
      <View style={storyCoverStyles.root}>
        <ScrollView keyboardShouldPersistTaps="handled" bounces={false}>
          <NavBar
            onLeft={onCancel}
            leftTitle={'Cancel'}
            title={'ADD TO GUIDE'}
            isRightValid={false}
            onRight={onDone}
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

            <GuideListItem create/>

            {dummyGuides.map((guide, idx) => (
              <GuideListItem active={guide.active} img={guide.coverImage} label={guide.title} key={`guide--${idx}`}/>
            ))}
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
