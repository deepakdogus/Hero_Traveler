import React from 'react'
import PropTypes from 'prop-types'
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
import prepareCategoryImages from '../../Utils/prepareCategoryImages'

import StatsTable from '../../Components/Shared/StatsTable'

import {
  Wrapper,
  Breadcrumbs,
  MainWrapper,
  Title,
  Divider,
  Centered,
} from '../../Components/Shared/StyledEditComponents'

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
    
    new Promise((resolve, reject) => {
      putCategory({
        id,
        values: prepareCategoryImages(values),
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
      <StatsTable
        title="Category Stats"
        columns={[
          {
            title: 'Link',
            render: () => (
              <a href={`https://herotraveler.com/categories/${record.id}`}>
                {truncate(`herotraveler.com/categories/${record.id}`, 20)}
              </a>),
          },
          {
            title: 'Created By',
            render: () => (
              <Link to={`/users/${get(record, 'author.id')}`}>
                {get(record, 'author.username')}
              </Link>),
          },
          {
            title: 'Date Created',
            text: moment(record.createdAt).format('YYYY/MM/DD'),
          },
          {
            title: '# Of Followers',
            text: get(record, 'counts.followers'),
          },
          {
            title: '# Of Stories',
            text: get(record, 'counts.stories'),
          },
          {
            title: '# Of Guides',
            text: get(record, 'numberOfGuides'),
          },
        ]}
      />
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

function mapStateToProps(state, ownProps) {
  const id = get(ownProps, 'match.params.id')
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
    deleteCategory: (payload) =>
      dispatch(AdminCategoryActions.adminDeleteCategory(payload)),
    uploadHeroImage: (payload) =>
      dispatch(AdminCategoryActions.adminUploadCategoryHeroImage(payload)),
    uploadChannelImage: (payload) =>
      dispatch(AdminCategoryActions.adminUploadCategoryChannelImage(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCategory)
