import React from 'react'
import {
  ScrollView,
  Text,
} from 'react-native'

import styles from './Styles/FAQScreenStyles'

export default class FAQScreen extends React.Component {
  render () {
    return (
      <ScrollView style={styles.root}>
        <Text style={styles.questionText}>
          What is HERO Traveler?
        </Text>
        <Text style={styles.answerText}>
          HERO Traveler is a first-of-its-kind platform that is all about coming together to share life’s incredible adventures.
        </Text>
        <Text style={styles.questionText}>
          How do I join HERO Traveler?
        </Text>
        <Text style={styles.answerText}>
          Signing up is free and painless. You can either sign up within the app by creating a unique username, or quickly sign up by tapping the “Sign Up with Facebook” or “Sign up with Twitter” buttons on the Sign Up page.
        </Text>
        <Text style={styles.questionText}>
          How do I post a story?
        </Text>
        <Text style={styles.answerText}>
          On the HERO Traveler App, simply tap the “plus” sign at the bottom of any page to bring up the option to create a story or start filming a video. 
        </Text>
        <Text style={styles.questionText}>
          Can I just post photos without any captions?
        </Text>
        <Text style={styles.answerText}>
          Of course! When creating a story, all you need is a cover photo and a title. However you want to curate your adventure is up to you!
        </Text>

        <Text style={styles.questionText}>
          Do I need to shoot videos within the HERO Traveler app?
        </Text>
        <Text style={styles.answerText}>
          Nope, feel free to import videos. But remember that HERO Traveler is based around vertical video content. So unless you want to end up like Greedo at the cantina, you better shoot straight.
        </Text>
        <Text style={styles.questionText}>
          How do I import a video?
        </Text>
        <Text style={styles.answerText}>
          After selecting the video option, simply tap at the bottom of the screen on “library” to bring up your videos from your camera roll.
        </Text>
        <Text style={styles.questionText}>
          Does HERO Traveler support 4K Video?
        </Text>
        <Text style={styles.answerText}>
          While you cannot take 4K videos within the app itself just yet, you can still import 4K videos.
        </Text>
        <Text style={styles.questionText}>
          How do I become a HERO Traveler Contributor?
        </Text>
        <Text style={styles.answerText}>
          Contributors are the cream of the crop, representing our most passionate users. To be labeled with the “Contributor” star on your profile, you must first publish 200 stories or more. To learn about other eligibility requirements, click here/ send us an email at contributors@herotraveler.com 
        </Text>
      </ScrollView>
    )
  }
}
