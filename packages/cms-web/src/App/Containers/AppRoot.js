import React, {Component} from 'react'
import {ThemeProvider} from 'styled-components'
import { Provider } from 'react-redux'
import {ConnectedRouter} from 'react-router-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { CookiesProvider } from 'react-cookie'

import createStore from '../Shared/Redux'
import {history} from '../Shared/Redux/Routes'
import themes from '../Shared/Themes'

import Routes from '../Routes'

const store = createStore()

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
