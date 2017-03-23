import React from 'react'
import {
  ScrollView,
  View,
  Text
} from 'react-native'
import {connect} from 'react-redux'
import _ from 'lodash'

import SignupActions from '../../Redux/SignupRedux'
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
              selected: this.getIsSelected(c)
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

  getIsSelected(category) {
    return _.includes(this.props.selectedCategories, category._id)
  }

  _toggleCategory = (category) => {
    const isSelected = this.getIsSelected(category)
    if (!isSelected) {
      this.props.selectCategory(category._id)
    } else {
      this.props.unselectCategory(category._id)
    }
  }
}

const mapStateToProps = (state) => {
  return {
    categories: state.categories.categories,
    selectedCategories: state.signup.selectedCategories
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    selectCategory: (categoryId) => dispatch(SignupActions.signupFollowCategory(categoryId)),
    unselectCategory: (categoryId) => dispatch(SignupActions.signupUnfollowCategory(categoryId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupTopicsScreen)
