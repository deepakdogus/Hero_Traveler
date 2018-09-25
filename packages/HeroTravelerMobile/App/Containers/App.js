import '../Config'
import React, { Component } from 'react'
import { Text } from 'react-native'
import { Provider } from 'react-redux'
import RootContainer from './RootContainer'
import createStore from '../Shared/Redux'
import branch from 'react-native-branch'
import {
  navToStoryFromOutsideLink,
  navToGuideFromOutsideLink
 } from '../Navigation/NavigationRouter'
import { parseNonBranchURL } from '../Shared/Lib/sharingMobile'

// create our store
const store = createStore()

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
class App extends Component {
  constructor() {
    super()
    Text.defaultProps.allowFontScaling = false
  }

  componentDidMount() {
    //deep linking logic
    branch.subscribe(({ error, params }) => {
      if (error) {
        console.error('Error from Branch: ' + error)
        return
      }
      if (params['+non_branch_link']) {
        //facebook/twitter (non-branch) link routing
        let obj = parseNonBranchURL(params['+non_branch_link'])
        obj['storyId']
        ? navToStoryFromOutsideLink(obj['storyId'], obj['title'])
        : navToGuideFromOutsideLink(obj['guideId'], obj['title'])
        return
      }
      if (!params['+clicked_branch_link']) {
        return
      }
      //branch deep link routing
      const title = params.$og_title
      const feedItemType = params.$canonical_url.split('/')[0]
      const feedItemId = params.$canonical_url.split('/')[1]
      feedItemType === 'story'
      ? navToStoryFromOutsideLink(feedItemId, title)
      : navToGuideFromOutsideLink(feedItemId, title)
    })
  }

  render () {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    )
  }
}

export default App
