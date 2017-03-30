import { put, select } from 'redux-saga/effects'
import {Actions as NavActions, ActionConst as NavActionConst} from 'react-native-router-flux'

// exported to make available for tests
// export const selectAvatar = (state) => state.github.avatar

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
}
