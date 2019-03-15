import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Row, Col, message } from 'antd'
import { Link } from 'react-router-dom'
import get from 'lodash/get'

import CategoryActions from '../../Shared/Redux/Entities/Categories'
import EditCategoryForm from '../../Components/Categories/EditCategoryForm'
import prepareCategoryImages from '../../Utils/prepareCategoryImages'

const Wrapper = styled.div``

const Breadcrumbs = styled.div``

const MainWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`

class CreateCategory extends React.Component {
  state = {}

  handleCancel = () => {
    const { history } = this.props
    history.push('/categories')
  }

  handleSubmit = (values) => {
    const { postCategory, history } = this.props
    postCategory({
      values: prepareCategoryImages(values),
      history,
      message,
    })
  }

  render() {
    const { isUpdating } = this.props

    return (
      <Wrapper>
        <Breadcrumbs>
          <Link to="/categories">{`Categories > `}</Link>
          <span>Create Category</span>
        </Breadcrumbs>
        <MainWrapper>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <EditCategoryForm
                handleCancel={this.handleCancel}
                onSubmit={this.handleSubmit}
                formLoading={isUpdating}
              />
            </Col>
          </Row>
        </MainWrapper>
      </Wrapper>
    )
  }
}

CreateCategory.propTypes = {
  history: PropTypes.object.isRequired,
  postCategory: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  uploadHeroImage: PropTypes.func.isRequired,
  uploadChannelImage: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    isUpdating: get(state, 'entities.categories.adminCategories.isUpdating'),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    postCategory: (payload) => dispatch(CategoryActions.adminPostCategory(payload)),
    uploadHeroImage: (payload) =>
      dispatch(CategoryActions.adminUploadCategoryHeroImage(payload)),
    uploadChannelImage: (payload) =>
      dispatch(CategoryActions.adminUploadCategoryChannelImage(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCategory)
