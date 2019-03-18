import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import _ from 'lodash'

import CategoryActions from '../../Shared/Redux/Entities/Categories'
import SignupActions from '../../Shared/Redux/SignupRedux'
import UXActions from '../../Redux/UXRedux'

import RoundedButton from '../../Shared/Web/Components/RoundedButton'
import ExploreGrid from '../../Components/ExploreGrid'
import { WrappedNavLink } from '../../Shared/Web/Components/NavLinkStyled'
import {
  Title,
  Subtitle,
} from './SignupSocial'

const TopicsContainer = styled.div`
  margin-bottom: 30px;
`

const NavLinkContainer = styled(TopicsContainer)`
  width: 100%;
  position: fixed;
  top: 85px;
  display: flex;
  justify-content: flex-end;
  z-index: 1;
`

const Container = styled.div`
  margin: 100px 7.5%;
  text-align: center;
`

const SizedDiv = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`

class SignupTopics extends Component {
  static propTypes = {
    categories: PropTypes.object,
    fetchStatus: PropTypes.bool,
    selectedCategories: PropTypes.arrayOf(PropTypes.string),
    loadCategories: PropTypes.func,
    getSelectedCategories: PropTypes.func,
    selectCategory: PropTypes.func,
    unselectCategory: PropTypes.func,
    user: PropTypes.object,
    openGlobalModal: PropTypes.func,
    updateUser: PropTypes.func,
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

  _openChangeTempUsernameModal = () => {
    this.props.openGlobalModal('changeTempUsername')
  }

  render() {
    return (
        <TopicsContainer>
          <NavLinkContainer>
            <WrappedNavLink to='/signup/social'>
              <RoundedButton
                text='Next >'
                margin='none'
              />
            </WrappedNavLink>
          </NavLinkContainer>
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
        </TopicsContainer>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const users = state.entities.users.entities
  const user = users[state.session.userId]
  let {
    fetchStatus: categoriesFetchStatus,
    entities: categories,
  } = state.entities.categories

  return {
    user,
    categories,
    categoriesFetchStatus,
    selectedCategories: state.signup.selectedCategories,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    getSelectedCategories: () => dispatch(SignupActions.signupGetUsersCategories()),
    selectCategory: (categoryId) => dispatch(SignupActions.signupFollowCategory(categoryId)),
    unselectCategory: (categoryId) => dispatch(SignupActions.signupUnfollowCategory(categoryId)),
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupTopics)
