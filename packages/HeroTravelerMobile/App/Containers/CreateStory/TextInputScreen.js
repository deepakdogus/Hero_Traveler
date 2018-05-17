import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  View,
  TextInput,
} from 'react-native'
import {Actions as NavActions} from 'react-native-router-flux'
import NavBar from './NavBar'

import { Colors } from '../../Shared/Themes/'
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

  _updateText = (value) => {
    this.setState({text:value})
  }

  _setInputRef = (element) => {
    this.input = element
  }

  render () {

    return (
      <View style={styles.textInputContainer}>
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
            ref={this._setInputRef}
            style={styles.textInput}
            value={this.state.text}
            onChangeText={this._updateText}
            placeholder={this.props.placeholder}
            multiline={true}
          />
        </View>
      </View>
    )
  }
}

export default TextInputScreen
