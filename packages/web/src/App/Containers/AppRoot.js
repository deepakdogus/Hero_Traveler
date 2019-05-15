import React, {Component} from 'react'
import {ThemeProvider} from 'styled-components'
import { Provider } from 'react-redux'
import {ConnectedRouter} from 'react-router-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { CookiesProvider } from 'react-cookie'

import { initializeFirebase } from '../Services/Firebase'

import createStore from '../Shared/Redux'
import {history} from '../Redux/Routes'
import themes from '../Shared/Themes'

import Routes from './Routes'

const store = createStore()

initializeFirebase()

class AppRoot extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <MuiThemeProvider>
            <ThemeProvider theme={themes}>
              <CookiesProvider>
                <Routes />
              </CookiesProvider>
            </ThemeProvider>
          </MuiThemeProvider>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default AppRoot
