import React, { Component } from 'react'
import { Text } from 'react-native'
import { Provider } from 'react-redux'
// import RootContainer from './RootContainer'
import createStore from '../Shared/Redux'

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
    Text.defaultProps = Text.defaultProps || {}
    Text.defaultProps.allowFontScaling = false
  }

  render() {
    return (
      <Provider store={store}>
        <Text style={{marginTop: 20}}>
          Testing 4
        </Text>
      </Provider>
    )
    // return (
    //   <Provider store={store}>
    //     <RootContainer />
    //   </Provider>
    // )
  }
}

export default App
