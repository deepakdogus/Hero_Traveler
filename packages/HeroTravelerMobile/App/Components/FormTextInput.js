import React from 'react';
import {View, Text, TextInput} from 'react-native';

export class FormTextInput extends React.Component {

  // This component is designed to be used in conjunction
  // with redux-form, so most of the parameters (styles, etc.) come
  // directly from the container.

  onFocus = (val) => {
    this.props.input.onFocus(val);
  }

  onBlur = (val) => {
    this.props.input.onBlur(val);
  }

  render() {
    const {input, meta, label, styles} = this.props;
    return (
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={styles.input}
          returnKeyType={this.props.returnKeyType || 'done'}
          onChangeText={input.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          value={input.value}
          multiline={this.props.multiline}
          placeholder={this.props.placeholder}
        />
        {!meta.pristine && !meta.active && meta.error &&
          <View style={styles.errorView}>
            <Text style={styles.error}>{meta.error}</Text>
          </View>
        }
      </View>
    )
  }
}

