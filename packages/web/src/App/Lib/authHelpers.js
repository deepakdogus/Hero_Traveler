import UXActions from '../Redux/UXRedux'

export const runIfAuthed = (sessionUserId, fn, fnArguments) =>
  sessionUserId
    ? fn(...fnArguments)
    : UXActions.openGlobalModal('login')
