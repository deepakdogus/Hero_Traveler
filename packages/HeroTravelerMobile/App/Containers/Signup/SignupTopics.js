import React from 'react'
import {
  ScrollView,
  View,
  Text
} from 'react-native'
import {connect} from 'react-redux'
import _ from 'lodash'

import CategoryActions from '../../Redux/CategoryRedux'
import ExploreGrid from '../../Components/ExploreGrid'
import styles from './SignupTopicsStyles'

class SignupTopicsScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedCategories: {}
    }
  }

  componentDidMount() {
    this.props.loadCategories()
  }

  render () {
    let content

    if (this.props.categories.length) {
      content = (
        <ExploreGrid
          onPress={this._toggleCategory}
          categories={this.props.categories.map(c => {
            return {
              ...c,
              selected: this.getIsChecked(c)
            }
          })} />
      )
    } else {
      content = (
        <Text>No categories yet</Text>
      )
    }

    return (
      <ScrollView style={[styles.containerWithNavbar, styles.root]}>
        <View style={styles.header}>
          <Text style={styles.title}>WELCOME!</Text>
          <Text style={styles.subtitle}>Select topics to follow</Text>
        </View>
        {content}
      </ScrollView>
    )
  }

  getIsChecked(category) {
    return _.get(this.state, `selectedCategories.${category._id}`, false)
  }

  _toggleCategory = (category) => {
    const isChecked = this.getIsChecked(category)
    console.log('isChecked', isChecked)
    this.setState({
      selectedCategories: {
        ...this.state.selectedCategories,
        [category._id]: !isChecked
      }
    })
  }
}

const mapStateToProps = (state) => {
  return {
    categories: state.categories.categories
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupTopicsScreen)
