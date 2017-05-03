import { put, select } from 'redux-saga/effects'
import {Actions as NavActions, ActionConst as NavActionConst} from 'react-native-router-flux'
import StartupActions from '../Redux/StartupRedux'
import SessionActions, {hasAuthData} from '../Redux/SessionRedux'
import ScreenActions from '../Redux/OpenScreenRedux'

// exported to make available for tests
// export const selectAvatar = (state) => state.github.avatar

const getHasAuthData = ({session}) => hasAuthData(session)

// process STARTUP actions
export function * startup (action) {
  // const avatar = yield select(selectAvatar)
  // // only get if we don't have it yet
  // if (!is(String, avatar)) {
  //   console.log('We dont have the avatar yet')
  //   yield put(GithubActions.userRequest('GantMan'))
  // } else {
  //   console.log('We have an avatar!')
  // }

  if (yield select(getHasAuthData)) {
    console.log('startup saga resume session')
    yield put(SessionActions.resumeSession())
  } else {
    console.log('startup saga hide splash')
    yield [
      put(StartupActions.hideSplash())
    ]
  }
}
