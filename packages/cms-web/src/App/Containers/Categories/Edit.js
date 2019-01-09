import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import moment from 'moment'
import { Row, Col, Spin, message } from 'antd'
import { Link } from 'react-router-dom'
import get from 'lodash/get'
import find from 'lodash/find'
import truncate from 'lodash/truncate'
import isEmpty from 'lodash/isEmpty'

import AdminCategoryActions from '../../Shared/Redux/Admin/Categories'
import EditCategoryForm from '../../Components/Categories/EditCategoryForm'
import convertUrlsToImageFormat from '../../Utils/convertUrlsToImageFormat'

const Wrapper = styled.div``

const Breadcrumbs = styled.div``

const MainWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`

const Title = styled.h1`
  font-weight: bold;
`

const SmallTitle = styled.h3`
  font-weight: bold;
`

const Divider = styled.hr`
  border-bottom: 2px solid black;
  width: 100%;
`

const TableStyled = styled.table`
  border: 1px solid black;
  width: 100%;
`

const TrStyled = styled.tr`
  border: 1px solid black;
`

const TdStyledGrey = styled.td`
  border: 1px solid black;
  text-align: center;
  padding: 5px 15px;
  background-color: #efefef;
`

const TdStyled = styled.td`
  border: 1px solid black;
  padding: 5px 15px;
  text-align: center;
  min-width: 200px;
`

const Centered = styled.div`
  text-align: center;
`

class EditCategory extends React.Component {
  state = {
    formSubmitting: false,
    isDeleting: false,
  }

  componentDidMount(){
    //get user EditCategory on signUp and reset signUp redux
    const { record, getCategory, id } = this.props
    
    if (isEmpty(record)) {
      getCategory(id)
    }
  }

  handleCancel = () => {
    const { history } = this.props
    history.goBack()
  }

  handleDelete = () => {
    const { deleteCategory, history, id } = this.props
    this.setState({
      isDeleting: true,
    })
    new Promise((resolve, reject) => {
      deleteCategory({
        id,
        resolve,
        reject,
      })
    }).then(() => {
      this.setState({
        isDeleting: false,
      })
      message.success('Category was deleted')
      history.goBack()
    }).catch((e) => {
      this.setState({
        isDeleting: false,
      })
      message.error(e.toString())
    })
  }

  handleSubmit = (values) => {
    const { putCategory, id } = this.props
    this.setState({
      formSubmitting: true,
    })
    const { thumbnail, heroImage } = values
    values.image = convertUrlsToImageFormat(thumbnail, heroImage, 'categoryImage')
    new Promise((resolve, reject) => {
      putCategory({
        id,
        values,
        resolve,
        reject,
      })
    }).then(() => {
      this.setState({
        formSubmitting: false,
      })
      message.success('Category was updated')
    }).catch((e) => {
      this.setState({
        formSubmitting: false,
      })
      message.error(e.toString())
    })
  }

  renderTable = () => {
    const { record } = this.props
    return (
      <div>
        <SmallTitle>
          Category Stats
        </SmallTitle>
        <TableStyled>
          <tbody>
            <TrStyled>
              <TdStyledGrey>Link</TdStyledGrey>
              <TdStyled>
                <a href={`https://herotraveler.com/categories/${record.id}`}>{truncate(`herotraveler.com/categories/${record.id}`, 20)}</a>
              </TdStyled>
            </TrStyled>
            <TrStyled>
              <TdStyledGrey>Created By</TdStyledGrey>
              <TdStyled>
                <Link to={`/users/${get(record, 'author.id')}`}>{get(record, 'author.username')}</Link>
              </TdStyled>
            </TrStyled>
            <TrStyled>
              <TdStyledGrey>Date Created</TdStyledGrey>
              <TdStyled>{moment(record.createdAt).format('YYYY/MM/DD')}</TdStyled>
            </TrStyled>
            <TrStyled>
              <TdStyledGrey># Of Followers</TdStyledGrey>
              <TdStyled>{get(record, 'counts.followers')}</TdStyled>
            </TrStyled>
            <TrStyled>
              <TdStyledGrey># Of Stories</TdStyledGrey>
              <TdStyled>{get(record, 'counts.stories')}</TdStyled>
            </TrStyled>
            <TrStyled>
              <TdStyledGrey># Of Guides</TdStyledGrey>
              <TdStyled>{get(record, 'numberOfGuides')}</TdStyled>
            </TrStyled>
          </tbody>
        </TableStyled>
      </div>
    )
  }

  render() {
    const {
      record,
      isLoading,
    } = this.props

    const { formSubmitting, isDeleting } = this.state

    if (isLoading) return (<Centered><Spin /></Centered>)

    return (
      <Wrapper>
        <Breadcrumbs>
          <Link to="/categories">{`Categories > `}</Link>
          <span>{get(record, 'title')}</span>
        </Breadcrumbs>
        <MainWrapper>
          <Title>{get(record, 'title')}</Title>
          <Divider/>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <EditCategoryForm
                record={record}
                handleCancel={this.handleCancel}
                onSubmit={this.handleSubmit}
                onDelete={this.handleDelete}
                formLoading={formSubmitting}
                isDeleting={isDeleting}
              />
            </Col>
            <Col xs={24} md={12}>
              {this.renderTable()}
            </Col>
          </Row>
        </MainWrapper>
      </Wrapper>
    )
  }
}

EditCategory.propTypes = {
  record: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  getCategory: PropTypes.func.isRequired,
  putCategory: PropTypes.func.isRequired,
  deleteCategory: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
}

function mapStateToProps(state) {
  const href = window.location.href
  const id = href.match(/([^\/]*)\/*$/)[1]
  const list = [...get(state, ['admin','categories', 'list'], [])]
  const record = find(list, { id }) || {}
  return {
    record,
    isLoading: state.admin.categories.isLoading,
    id,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getCategory: (id) => dispatch(AdminCategoryActions.adminGetCategory(id)),
    putCategory: (payload) => dispatch(AdminCategoryActions.adminPutCategory(payload)),
    deleteCategory: (payload) => dispatch(AdminCategoryActions.adminDeleteCategory(payload)),
    uploadHeroImage: (payload) => dispatch(AdminCategoryActions.adminUploadCategoryHeroImage(payload)),
    uploadChannelImage: (payload) => dispatch(AdminCategoryActions.adminUploadCategoryChannelImage(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCategory)
