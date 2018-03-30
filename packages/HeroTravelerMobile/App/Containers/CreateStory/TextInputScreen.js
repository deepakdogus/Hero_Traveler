import _ from 'lodash'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import {connect} from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'
import NavBar from './NavBar'

import { Metrics, Colors } from '../../Shared/Themes/'
import styles from './TextInputScreenStyles'

class TextInputScreen extends Component {

  input;

  static propTypes = {
    text: PropTypes.string,
    title: PropTypes.string,
    placeholder: PropTypes.string,
    onDone: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      text: '',
      isInputFocused: false,
    }
  }

  componentDidMount() {
    this.input.focus();
  }

  _onLeft = () => {
    NavActions.pop()
  }

  _done = () => {
    this.props.onDone(this.state.text)
  }

  render () {

    return (
      <View style={{flex: 1, position: 'relative'}}>
        <NavBar
          title={this.props.title}
          leftTitle='Cancel'
          onLeft={this._onLeft}
          leftTextStyle={{paddingLeft: 10}}
          onRight={this._done}
          rightTitle='Done'
          rightTextStyle={{color: Colors.red}}
        />
        <View style={styles.root}>
          <TextInput
            ref={(element)=>{this.input = element}}
            style={styles.textInput}
            value={this.state.text}
            onChangeText={(value)=>{this.setState({text:value})}}
            placeholder={this.props.placeholder}
            multiline={true}
          />
        </View>
      </View>
    )
  }
}

export default connect(
  state => ({}),
  dispatch => ({})
)(TextInputScreen)
