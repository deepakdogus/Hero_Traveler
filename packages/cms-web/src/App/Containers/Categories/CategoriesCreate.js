import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Row, Col, message } from 'antd'
import { Link } from 'react-router-dom'

import AdminCategoryActions from '../../Shared/Redux/Admin/Categories'
import EditCategoryForm from '../../Components/Categories/EditCategoryForm'
import prepareCategoryImages from '../../Utils/prepareCategoryImages'

const Wrapper = styled.div``

const Breadcrumbs = styled.div``

const MainWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`

class CreateCategory extends React.Component {
  state = {
    formSubmitting: false,
    isDeleting: false,
    heroImage: undefined,
    channelImage: undefined,
  }

  handleCancel = () => {
    const { history } = this.props
    history.push('/categories')
  }

  handleSubmit = (values) => {
    const { postCategory, history } = this.props
    this.setState({
      formSubmitting: true,
    })

    new Promise((resolve, reject) => {
      postCategory({
        values: prepareCategoryImages(values),
        resolve,
        reject,
      })
    }).then(() => {
      this.setState({
        formSubmitting: false,
      })
      message.success('Category was created')
      history.goBack()
    }).catch((e) => {
      this.setState({
        formSubmitting: false,
      })
      message.error(e.toString())
    })
  }

  render() {
    const { formSubmitting } = this.state

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
                formLoading={formSubmitting}
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
  uploadHeroImage: PropTypes.func.isRequired,
  uploadChannelImage: PropTypes.func.isRequired,
}

function mapDispatchToProps(dispatch) {
  return {
    postCategory: (payload) => dispatch(AdminCategoryActions.adminPostCategory(payload)),
    uploadHeroImage: (payload) =>
      dispatch(AdminCategoryActions.adminUploadCategoryHeroImage(payload)),
    uploadChannelImage: (payload) =>
      dispatch(AdminCategoryActions.adminUploadCategoryChannelImage(payload)),
  }
}

export default connect(undefined, mapDispatchToProps)(CreateCategory)
