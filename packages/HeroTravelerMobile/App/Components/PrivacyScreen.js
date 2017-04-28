import React from 'react'
import {
  ScrollView,
  View,
  Text
} from 'react-native'

import {Colors} from '../Themes'
import styles from './Styles/PrivacyScreenStyles'

export default class PrivacyScreen extends React.Component {
  render () {
    return (
      <ScrollView style={styles.scrollViewWrapper}>
          <Text style={styles.headerText}>
            1. INFORMATION WE COLLECT
          </Text>
          <Text style={styles.bodyText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut blandit mauris, aliquet ultricies risus. Proin finibus justo sed est malesuada pulvinar. In in leo ligula. Nunc iaculis sodales pellentesque. Cras vel odio arcu. Nulla ultrices nulla mauris. Morbi scelerisque aliquam dignissim. Proin eget sodales nisi, nec hendrerit enim. Fusce auctor nisi dolor. Nam luctus nisl sit amet dui eleifend, iaculis dignissim arcu imperdiet. Praesent urna turpis, suscipit ut malesuada ut, ullamcorper a ante. Nunc id gravida lacus, et aliquet elit.
          </Text>
          <Text style={styles.bodyText}>
            Nulla rhoncus augue varius condimentum rhoncus. Nam pharetra arcu sodales, elementum eros in, vestibulum erat. Maecenas id tellus lorem. Etiam bibendum maximus placerat. Proin consequat consectetur augue aliquam accumsan. Nulla semper nulla in quam congue volutpat sit amet sed velit. Mauris molestie, ex at accumsan lobortis, dui felis posuere mauris, et consectetur purus arcu sit amet lacus. Vivamus at eros lectus.
          </Text>
          <Text style={styles.bodyText}>
            Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce nec metus non dolor vehicula interdum. Maecenas consequat consectetur purus, sit amet mattis nisi gravida vitae. Mauris in turpis vehicula purus cursus varius. Praesent sit amet lorem id nulla maximus interdum eu aliquet dui.
          </Text>
          <Text style={styles.bodyText}>
            Maecenas nec augue scelerisque, egestas nisi ut, viverra nisl. Maecenas non sollicitudin ante. Aliquam at efficitur lectus. Nam vulputate orci sed gravida imperdiet. Ut ante ante, ornare ac diam sed, maximus maximus ex. Donec pulvinar, quam sit amet maximus tincidunt, lectus leo pharetra justo, ac porttitor eros sapien quis ante. Aenean lorem nisi, sagittis a odio non, venenatis tincidunt mi. Pellentesque varius turpis auctor dui efficitur, nec vulputate purus luctus.
          </Text>
          <Text style={styles.bodyText}>
            Phasellus fermentum lorem vel magna volutpat tempor. Nulla et ante sed nulla mollis vestibulum nec quis ante. Praesent fermentum ante rutrum fringilla dapibus. In ac mauris faucibus, cursus odio ut, pharetra nisi. Fusce eu arcu dapibus, feugiat diam ac, euismod nulla. Phasellus odio odio, malesuada at augue eget, maximus sagittis nulla. In vitae odio imperdiet, porttitor dui sed, pharetra tortor. Nullam ullamcorper sit amet erat luctus semper. Suspendisse tincidunt ipsum id ligula lacinia, nec varius nunc varius. Etiam tellus nulla, dictum vel eleifend vitae, laoreet eget dui. Donec lobortis eu elit et dictum. Phasellus vestibulum nulla magna, malesuada luctus tortor mattis sed. Pellentesque eleifend non tellus quis sodales. Nunc consequat elit at felis elementum euismod laoreet vitae purus. Aliquam sed neque sed ligula ornare lacinia consequat eu augue.
          </Text>
          <Text style={styles.bodyText}>
            Nulla efficitur lacinia accumsan. Nulla vulputate hendrerit neque, eget ullamcorper leo accumsan quis. Aenean nec metus sed purus mollis fermentum id vitae risus. Ut nisl metus, aliquam eleifend turpis vel, molestie laoreet erat. Maecenas volutpat sapien at justo suscipit gravida. Vivamus nisl odio, condimentum nec ligula et, semper egestas justo. Morbi ac placerat nibh, et vestibulum nisi.
          </Text>
          <Text style={styles.headerText}>
            2. HOW WE USE YOUR INFORMATION
          </Text>
          <Text style={styles.bodyText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut blandit mauris, aliquet ultricies risus. Proin finibus justo sed est malesuada pulvinar. In in leo ligula. Nunc iaculis sodales pellentesque. Cras vel odio arcu. Nulla ultrices nulla mauris. Morbi scelerisque aliquam dignissim. Proin eget sodales nisi, nec hendrerit enim. Fusce auctor nisi dolor. Nam luctus nisl sit amet dui eleifend, iaculis dignissim arcu imperdiet. Praesent urna turpis, suscipit ut malesuada ut, ullamcorper a ante. Nunc id gravida lacus, et aliquet elit.
          </Text>
          <Text style={styles.bodyText}>
            Nulla rhoncus augue varius condimentum rhoncus. Nam pharetra arcu sodales, elementum eros in, vestibulum erat. Maecenas id tellus lorem. Etiam bibendum maximus placerat. Proin consequat consectetur augue aliquam accumsan. Nulla semper nulla in quam congue volutpat sit amet sed velit. Mauris molestie, ex at accumsan lobortis, dui felis posuere mauris, et consectetur purus arcu sit amet lacus. Vivamus at eros lectus.
          </Text>
          <Text style={styles.headerText}>
            3. SHARING OF YOUR INFORMATION
          </Text>
          <Text style={styles.bodyText}>
            Nulla rhoncus augue varius condimentum rhoncus. Nam pharetra arcu sodales, elementum eros in, vestibulum erat. Maecenas id tellus lorem. Etiam bibendum maximus placerat. Proin consequat consectetur augue aliquam accumsan. Nulla semper nulla in quam congue volutpat sit amet sed velit. Mauris molestie, ex at accumsan lobortis, dui felis posuere mauris, et consectetur purus arcu sit amet lacus. Vivamus at eros lectus.
          </Text>
          <Text style={styles.bodyText}>
            Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce nec metus non dolor vehicula interdum. Maecenas consequat consectetur purus, sit amet mattis nisi gravida vitae. Mauris in turpis vehicula purus cursus varius. Praesent sit amet lorem id nulla maximus interdum eu aliquet dui.
          </Text>
          <Text style={styles.bodyText}>
            Maecenas nec augue scelerisque, egestas nisi ut, viverra nisl. Maecenas non sollicitudin ante. Aliquam at efficitur lectus. Nam vulputate orci sed gravida imperdiet. Ut ante ante, ornare ac diam sed, maximus maximus ex. Donec pulvinar, quam sit amet maximus tincidunt, lectus leo pharetra justo, ac porttitor eros sapien quis ante. Aenean lorem nisi, sagittis a odio non, venenatis tincidunt mi. Pellentesque varius turpis auctor dui efficitur, nec vulputate purus luctus.
          </Text>
          <Text style={styles.bodyText}>
            Phasellus fermentum lorem vel magna volutpat tempor. Nulla et ante sed nulla mollis vestibulum nec quis ante. Praesent fermentum ante rutrum fringilla dapibus. In ac mauris faucibus, cursus odio ut, pharetra nisi. Fusce eu arcu dapibus, feugiat diam ac, euismod nulla. Phasellus odio odio, malesuada at augue eget, maximus sagittis nulla. In vitae odio imperdiet, porttitor dui sed, pharetra tortor. Nullam ullamcorper sit amet erat luctus semper. Suspendisse tincidunt ipsum id ligula lacinia, nec varius nunc varius. Etiam tellus nulla, dictum vel eleifend vitae, laoreet eget dui. Donec lobortis eu elit et dictum. Phasellus vestibulum nulla magna, malesuada luctus tortor mattis sed. Pellentesque eleifend non tellus quis sodales. Nunc consequat elit at felis elementum euismod laoreet vitae purus. Aliquam sed neque sed ligula ornare lacinia consequat eu augue.
          </Text>
          <Text style={styles.bodyText}>
            Nulla efficitur lacinia accumsan. Nulla vulputate hendrerit neque, eget ullamcorper leo accumsan quis. Aenean nec metus sed purus mollis fermentum id vitae risus. Ut nisl metus, aliquam eleifend turpis vel, molestie laoreet erat. Maecenas volutpat sapien at justo suscipit gravida. Vivamus nisl odio, condimentum nec ligula et, semper egestas justo. Morbi ac placerat nibh, et vestibulum nisi.
          </Text>
          <Text style={styles.headerText}>
            4. HOW WE STORE YOUR INFORMATION
          </Text>
          <Text style={styles.bodyText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut blandit mauris, aliquet ultricies risus. Proin finibus justo sed est malesuada pulvinar. In in leo ligula. Nunc iaculis sodales pellentesque. Cras vel odio arcu. Nulla ultrices nulla mauris. Morbi scelerisque aliquam dignissim. Proin eget sodales nisi, nec hendrerit enim. Fusce auctor nisi dolor. Nam luctus nisl sit amet dui eleifend, iaculis dignissim arcu imperdiet. Praesent urna turpis, suscipit ut malesuada ut, ullamcorper a ante. Nunc id gravida lacus, et aliquet elit.
          </Text>
          <Text style={styles.bodyText}>
            Nulla rhoncus augue varius condimentum rhoncus. Nam pharetra arcu sodales, elementum eros in, vestibulum erat. Maecenas id tellus lorem. Etiam bibendum maximus placerat. Proin consequat consectetur augue aliquam accumsan. Nulla semper nulla in quam congue volutpat sit amet sed velit. Mauris molestie, ex at accumsan lobortis, dui felis posuere mauris, et consectetur purus arcu sit amet lacus. Vivamus at eros lectus.
          </Text>
          <Text style={styles.headerText}>
            5. YOUR CHOICES ABOUT YOUR INFORMATION
          </Text>
          <Text style={styles.bodyText}>
            Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce nec metus non dolor vehicula interdum. Maecenas consequat consectetur purus, sit amet mattis nisi gravida vitae. Mauris in turpis vehicula purus cursus varius. Praesent sit amet lorem id nulla maximus interdum eu aliquet dui.
          </Text>
          <Text style={styles.bodyText}>
            Maecenas nec augue scelerisque, egestas nisi ut, viverra nisl. Maecenas non sollicitudin ante. Aliquam at efficitur lectus. Nam vulputate orci sed gravida imperdiet. Ut ante ante, ornare ac diam sed, maximus maximus ex. Donec pulvinar, quam sit amet maximus tincidunt, lectus leo pharetra justo, ac porttitor eros sapien quis ante. Aenean lorem nisi, sagittis a odio non, venenatis tincidunt mi. Pellentesque varius turpis auctor dui efficitur, nec vulputate purus luctus.
          </Text>
          <Text style={styles.headerText}>
            6. CHILDREN'S PRIVACY
          </Text>
          <Text style={styles.bodyText}>
            Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce nec metus non dolor vehicula interdum. Maecenas consequat consectetur purus, sit amet mattis nisi gravida vitae. Mauris in turpis vehicula purus cursus varius. Praesent sit amet lorem id nulla maximus interdum eu aliquet dui.
          </Text>
          <Text style={styles.bodyText}>
            Maecenas nec augue scelerisque, egestas nisi ut, viverra nisl. Maecenas non sollicitudin ante. Aliquam at efficitur lectus. Nam vulputate orci sed gravida imperdiet. Ut ante ante, ornare ac diam sed, maximus maximus ex. Donec pulvinar, quam sit amet maximus tincidunt, lectus leo pharetra justo, ac porttitor eros sapien quis ante. Aenean lorem nisi, sagittis a odio non, venenatis tincidunt mi. Pellentesque varius turpis auctor dui efficitur, nec vulputate purus luctus.
          </Text>
          <Text style={styles.headerText}>
            7. OTHER WEB SITES AND SERVICES
          </Text>
          <Text style={styles.bodyText}>
            Maecenas nec augue scelerisque, egestas nisi ut, viverra nisl. Maecenas non sollicitudin ante. Aliquam at efficitur lectus. Nam vulputate orci sed gravida imperdiet. Ut ante ante, ornare ac diam sed, maximus maximus ex. Donec pulvinar, quam sit amet maximus tincidunt, lectus leo pharetra justo, ac porttitor eros sapien quis ante. Aenean lorem nisi, sagittis a odio non, venenatis tincidunt mi. Pellentesque varius turpis auctor dui efficitur, nec vulputate purus luctus.
          </Text>
          <Text style={styles.headerText}>
            8. HOW TO CONTACT US ABOUT A DECEASED USER
          </Text>
          <Text style={styles.bodyText}>
            Maecenas nec augue scelerisque, egestas nisi ut, viverra nisl. Maecenas non sollicitudin ante. Aliquam at efficitur lectus. Nam vulputate orci sed gravida imperdiet. Ut ante ante, ornare ac diam sed, maximus maximus ex. Donec pulvinar, quam sit amet maximus tincidunt, lectus leo pharetra justo, ac porttitor eros sapien quis ante. Aenean lorem nisi, sagittis a odio non, venenatis tincidunt mi. Pellentesque varius turpis auctor dui efficitur, nec vulputate purus luctus.
          </Text>
          <Text style={styles.headerText}>
            9. HOW TO CONTACT US
          </Text>
          <Text style={styles.bodyText}>
            Maecenas nec augue scelerisque, egestas nisi ut, viverra nisl. Maecenas non sollicitudin ante. Aliquam at efficitur lectus. Nam vulputate orci sed gravida imperdiet. Ut ante ante, ornare ac diam sed, maximus maximus ex. Donec pulvinar, quam sit amet maximus tincidunt, lectus leo pharetra justo, ac porttitor eros sapien quis ante. Aenean lorem nisi, sagittis a odio non, venenatis tincidunt mi. Pellentesque varius turpis auctor dui efficitur, nec vulputate purus luctus.
          </Text>
          <Text style={styles.headerText}>
            10. CHANGES TO OUR PRIVACY POLICY
          </Text>
          <Text style={styles.bodyText}>
            Maecenas nec augue scelerisque, egestas nisi ut, viverra nisl. Maecenas non sollicitudin ante. Aliquam at efficitur lectus. Nam vulputate orci sed gravida imperdiet. Ut ante ante, ornare ac diam sed, maximus maximus ex. Donec pulvinar, quam sit amet maximus tincidunt, lectus leo pharetra justo, ac porttitor eros sapien quis ante. Aenean lorem nisi, sagittis a odio non, venenatis tincidunt mi. Pellentesque varius turpis auctor dui efficitur, nec vulputate purus luctus.
          </Text>
      </ScrollView>
    )
  }
}