import { put, select, call } from 'redux-saga/effects'
import StartupActions from '../Redux/StartupRedux'
import SessionActions, {hasAuthData} from '../Redux/SessionRedux'
import LoginActions from '../Redux/LoginRedux'
import ScreenActions from '../Redux/OpenScreenRedux'

// exported to make available for tests
// export const selectAvatar = (state) => state.github.avatar

const getHasAuthData = ({session}) => {
  return hasAuthData(session)
}

// process STARTUP actions
export function * startup () {
  yield put(StartupActions.startupStarted())
}

export function * heroStartup(api, {deeplinkObject}) {
  if (yield select(getHasAuthData)) {
    yield put(SessionActions.resumeSession())

    if (deeplinkObject.action === 'resetpassword') {
      alert('You must logout to reset a password from an email link')
    }

    if (deeplinkObject.action === 'emailverify') {
      yield call(api.emailVerify, deeplinkObject.id)
    }

  } else {

    console.log('does not have auth data')
    if (deeplinkObject.action === 'resetpassword') {
      yield ScreenActions.openScreen('resetPassword', {type: 'push', token: deeplinkObject.id})
    }

    yield put(StartupActions.hideSplash())
  }
}
