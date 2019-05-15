import firebase from 'firebase'
import 'firebase/firestore'

import env from '../Config/Env'

const config = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  databaseURL: env.FIREBASE_DATABASE_URL,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
}

export const initializeFirebase = () => {
  firebase.initializeApp(config)
}

export const getFirestore = () => firebase.firestore()
