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
import {Actions as NavActions} from 'react-native-router-flux'

import CategoryFeedScreen from '../Explore/CategoryFeedScreen'
import CategoryActions from '../../Redux/CategoryRedux'
import ExploreGrid from '../../Components/ExploreGrid'
import styles from '../Styles/ExploreScreenStyles'

class ExploreScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { text: null }
  }

  componentDidMount() {
    this.props.loadCategories()
  }

  render () {
    let content

    if (this.props.categories.length && !this.state.text) {
      content = (
        <ExploreGrid
          onPress={(category) => NavActions.categoryFeed()}
          categories={this.props.categories} />
      )

    } else if (this.state.text) {
      content = (
        <CategoryFeedScreen />
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
              onChangeText={(text) => this.setState({text})}
            />
          </View>
          { !this.state.text ? <View style={styles.titleWrapper}>
            <Text style={styles.title}>EXPLORE</Text>
          </View> : null } 
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
