import React, {Component} from 'react'
import {
  ScrollView,
  View,
  Text,
  ListView,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native'
import {connect} from 'react-redux'

import CategoryActions from '../../Redux/CategoryRedux'
import ExploreGrid from '../../Components/ExploreGrid'
import styles from '../Styles/ExploreScreenStyles'

class ExploreScreen extends Component {

  componentDidMount() {
    this.props.loadCategories()
  }

  render () {
    let content

    if (this.props.categories.length) {
      content = (
        <ExploreGrid
          onPress={(category) => alert(`Category ${category.title} pressed`)}
          categories={this.props.categories} />
      )
    } else {
      content = (
        <Text>No categories yet</Text>
      )
    }

    return (
      <ScrollView style={[styles.containerWithTabbar, styles.root]}>
        <View style={styles.header}>
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder='Search'
              placeholderTextColor='#757575'
              onTextChange={() => {}}
            />
          </View>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>EXPLORE</Text>
          </View>
        </View>
        {content}
      </ScrollView>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(ExploreScreen)
