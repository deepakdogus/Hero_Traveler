import React from 'react'
import styles from './Styles/ProfileViewStyles'
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient'
import { Colors, Metrics } from '../Themes'
import Loader from './Loader'
import StoryList from './StoryList'
import formatCount from '../Lib/formatCount'
import getImageUrl from '../Lib/getImageUrl'
import Avatar from './Avatar'

const Tab = ({text, onPress, selected}) => {
  return (
    <TouchableOpacity style={[styles.tab, selected ? styles.tabSelected : null]} onPress={onPress}>
      <Text style={[styles.tabText, selected ? styles.tabTextSelected : null]}>{text}</Text>
    </TouchableOpacity>
  )
}

export default class ProfileView extends React.Component {
  render() {
    const { user, stories, fetchStatus, editable, profileImage } = this.props
    let cog
    let buttons
    let tabs

    /* If the editable flag === true then the component will display the user's edit profile view,
       otherwise it will show the view that the user sees when looking at other profiles
    */

    if (editable === true) {
      cog = (
        <TouchableOpacity style={styles.settingsCog} onPress={() => NavActions.settings({type: 'push'})}>
          <Icon name='cog' size={25} color={Colors.snow} />
        </TouchableOpacity>
      )

      buttons = (
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => alert('edit profile')}>
          <Text style={styles.buttonsText}>EDIT PROFILE</Text>
        </TouchableOpacity>
      )

      tabs = (
        <View style={styles.tabnavEdit}>
          <Tab selected={true} onPress={() => alert('stories')} text='STORIES' />
          <Tab onPress={() => alert('drafts')} text='DRAFT' />
          <Tab onPress={() => alert('bookmarks')} text='BOOKMARKS' />
        </View>
      )

    } else {
      cog = null

      buttons = (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => alert('FOLLOWING')}>
            <Text style={styles.buttonsText}>FOLLOWING</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => alert('MESSAGE')}>
            <Text style={styles.buttonsText}>MESSAGE</Text>
          </TouchableOpacity>
        </View>
      )

      tabs = (
        <View style={styles.tabnavEdit}>
          <Tab selected={false} onPress={() => alert('stories')} text='STORIES' />
        </View>
      )
    }

    const gradientStyle = profileImage ? ['rgba(0,0,0,.6)', 'transparent', 'rgba(0,0,0,.6)'] : ['transparent', 'rgba(0,0,0,.6)']
    return (
      <ScrollView style={[
        this.props.hasTabbar ? styles.containerWithTabbar : null,
        styles.root,
        this.props.style,
      ]}>
        <Image
          style={[styles.coverImage, profileImage ? null : styles.noCoverImage]}
          resizeMode='cover'
          source={{uri: profileImage || ''}}
        >
        <View style={styles.gradientWrapper}>
          <LinearGradient colors={gradientStyle} style={styles.gradient}>
            <View style={styles.coverInner}>
              {cog}
              <View style={styles.nameWrapper}>
                <Text style={styles.titleText}>{user.username}</Text>
                <View style={styles.nameSeparator} />
                <Text style={styles.italicText}>{user.profile.fullName}</Text>
              </View>
              <Avatar avatarUrl={getImageUrl(user.profile.avatar)} />
              <TouchableOpacity onPress={() => alert('read bio')}>
                <Text style={styles.italicText}>Read Bio</Text>
              </TouchableOpacity>
              <View style={styles.followersWrapper}>
                <View style={styles.firstFollowerColumn}>
                  <TouchableOpacity
                    onPress={() => alert('list followers')}
                    style={[styles.followersColumn]}>
                    <Text style={styles.followerNumber}>{formatCount(user.counts.followers)}</Text>
                    <Text style={styles.followerLabel}>Followers</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => alert('list following')}
                  style={styles.followersColumn}>
                  <Text style={styles.followerNumber}>{formatCount(user.counts.following)}</Text>
                  <Text style={styles.followerLabel}>Following</Text>
                </TouchableOpacity>
              </View>
              {buttons}
            </View>
            <Text style={styles.contributor}>
              <Icon name='star' color={Colors.red} size={15} style={styles.contributorIcon} />
              <Text style={styles.contributorText}>&nbsp;&nbsp;&nbsp;CONTRIBUTOR</Text>
            </Text>
          </LinearGradient>
          </View>
        </Image>
        <View style={styles.tabs}>
          {tabs}
          {stories.length > 0 &&
            <StoryList
              stories={stories}
              height={200}
              titleStyle={styles.storyTitleStyle}
              subtitleStyle={styles.subtitleStyle}
              editable={editable}
              forProfile={true}
              onPressStory={story => NavActions.story({storyId: story.id})}
              onPressLike={story => alert(`Story ${story.id} liked`)}
            />
          }
          {fetchStatus.loaded && stories.length === 0 &&
            <View style={styles.noStories}>
              <Text style={styles.noStoriesText}>You have no stories published</Text>
            </View>
          }
          {!fetchStatus.loaded && fetchStatus.fetching &&
            <View style={styles.spinnerWrapper}>
              <Loader
                style={styles.spinner}
                spinnerColor={Colors.background} />
            </View>
          }
        </View>
      </ScrollView>
    )
  }
}
