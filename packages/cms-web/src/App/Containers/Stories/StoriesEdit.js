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

import AdminStoryActions from '../../Shared/Redux/Admin/Stories'
import EditStoryOrGuideForm from '../../Components/Shared/EditStoryOrGuideForm'

import StatsTable from '../../Components/Shared/StatsTable'

import {
  Wrapper,
  Breadcrumbs,
  MainWrapper,
  Title,
  Divider,
  Centered,
} from '../../Components/Shared/StyledEditComponents'

class EditStory extends React.Component {
  state = {
    formSubmitting: false,
    isDeleting: false,
  }

  componentDidMount(){
    //get user EditStory on signUp and reset signUp redux
    const { record, getStory, id } = this.props
    
    if (isEmpty(record)) {
      getStory(id)
    }
  }

  handleCancel = () => {
    const { history } = this.props
    history.goBack()
  }

  handleDelete = () => {
    const { deleteStory, history, id } = this.props
    this.setState({
      isDeleting: true,
    })
    new Promise((resolve, reject) => {
      deleteStory({
        id,
        resolve,
        reject,
      })
    }).then(() => {
      this.setState({
        isDeleting: false,
      })
      message.success('Story was deleted')
      history.goBack()
    }).catch((e) => {
      this.setState({
        isDeleting: false,
      })
      message.error(e.toString())
    })
  }

  handleSubmit = (values) => {
    const { putStory, id } = this.props
    this.setState({
      formSubmitting: true,
    })
    new Promise((resolve, reject) => {
      putStory({
        id,
        values,
        resolve,
        reject,
      })
    }).then(() => {
      this.setState({
        formSubmitting: false,
      })
      message.success('Story was updated')
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
        title="Story Stats"
        columns={[
          {
            title: 'Link',
            render: () => (
              <a href={`https://herotraveler.com/stories/${record.id}`}>
                {truncate(`herotraveler.com/stories/${record.id}`, 20)}
              </a>),
          },
          {
            title: 'Date Published',
            text: moment(record.createdAt).format('YYYY/MM/DD'),
          },
          {
            title: 'Author',
            render: () => (
              <Link to={`/users/${get(record, 'author.id')}`}>
                {get(record, 'author.username')}
              </Link>),
          },
          {
            title: 'Location',
            text: get(record, 'locationInfo.name'),
          },
          {
            title: 'Activity Type',
            text: get(record, 'type'),
          },
          {
            title: 'Categories',
            text: get(record, 'categories', []).map(i => i.title).join(', '),
          },
          {
            title: 'Hashtags',
            text: get(record, 'hashtags', []).join(', '),
          },
          {
            title: '# Of Likes',
            text: get(record, 'counts.likes'),
          },
          {
            title: '# Of Comments',
            text: get(record, 'counts.comments'),
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
          <Link to="/stories">{`Stories > `}</Link>
          <span>{get(record, 'title')}</span>
        </Breadcrumbs>
        <MainWrapper>
          <Title>{get(record, 'title')}</Title>
          <Divider/>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <EditStoryOrGuideForm
                type="story"
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

EditStory.propTypes = {
  record: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  getStory: PropTypes.func.isRequired,
  putStory: PropTypes.func.isRequired,
  deleteStory: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
}

function mapStateToProps(state, ownProps) {
  const id = get(ownProps, 'match.params.id')
  const list = [...get(state, ['admin','stories', 'list'], [])]
  const record = find(list, { id }) || {}
  return {
    record,
    isLoading: state.admin.stories.isLoading,
    id,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getStory: (id) => dispatch(AdminStoryActions.adminGetStory(id)),
    putStory: (payload) => dispatch(AdminStoryActions.adminPutStory(payload)),
    deleteStory: (payload) => dispatch(AdminStoryActions.adminDeleteStory(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditStory)
