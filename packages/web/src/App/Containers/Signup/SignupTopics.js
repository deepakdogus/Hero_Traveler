import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import _ from 'lodash'

import CategoryActions from '../../Shared/Redux/Entities/Categories'
import SignupActions from '../../Shared/Redux/SignupRedux'

import Header from '../../Components/Signup/Header'
import RoundedButton from '../../Components/RoundedButton'
import ExploreGrid from '../../Components/ExploreGrid'
import NavLinkStyled from '../../Components/NavLinkStyled'

const Container = styled.div`
  margin: 0 7.5%;
  text-align: center;
`
const Title = styled.p`
  font-weight: 400;
  font-size: 35px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.2px;
`

const Subtitle = styled.p`
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: .7px;
  margin-bottom: 30px;
`

const SizedDiv = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`

class SignupTopics extends Component {
  static propTypes = {
    categories: PropTypes.object,
    fetchStatus: PropTypes.bool,
    loadCategories: PropTypes.func,
    getSelectedCategories: PropTypes.func,
  }

  componentDidMount() {
    this.props.loadCategories()
    this.props.getSelectedCategories()
  }

  getIsSelected = (categoryId) => {
    return _.includes(this.props.selectedCategories, categoryId)
  }

  _toggleCategory = (categoryId) => {
    const isSelected = this.getIsSelected(categoryId)
    if (!isSelected) this.props.selectCategory(categoryId)
    else this.props.unselectCategory(categoryId)
  }

  render() {
    return (
        <div>
          <Header>
            <NavLinkStyled to='/signup/social'>
              <RoundedButton text='Next >'></RoundedButton>
            </NavLinkStyled>
          </Header>
          <Container>
            <SizedDiv>
              <Title>WELCOME!</Title>
              <Subtitle>Pick some topics you are interested in. We will use them to customize your reading list based on your interests.</Subtitle>
              <ExploreGrid
                categories={this.props.categories}
                onClickCategory={this._toggleCategory}
                getIsSelected={this.getIsSelected}
              />
            </SizedDiv>
          </Container>
        </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  let {
    fetchStatus: categoriesFetchStatus,
    entities: categories,
  } = state.entities.categories;

  return {
    categories,
    categoriesFetchStatus,
    selectedCategories: state.signup.selectedCategories
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    getSelectedCategories: () => dispatch(SignupActions.signupGetUsersCategories()),
    selectCategory: (categoryId) => dispatch(SignupActions.signupFollowCategory(categoryId)),
    unselectCategory: (categoryId) => dispatch(SignupActions.signupUnfollowCategory(categoryId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupTopics)
