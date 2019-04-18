import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import { Row, Col, Spin, message } from 'antd'
import { Link } from 'react-router-dom'
import get from 'lodash/get'
import find from 'lodash/find'
import values from 'lodash/values'
import truncate from 'lodash/truncate'
import isEmpty from 'lodash/isEmpty'

import GuideActions from '../../Shared/Redux/Entities/Guides'
import StoryActions from '../../Shared/Redux/Entities/Stories'
import EditFeedItemForm from '../../Components/Shared/EditFeedItemForm'
import StoriesInGuideTable from '../../Components/Stories/StoriesInGuideTable'

import StatsTable from '../../Components/Shared/StatsTable'

import {
  Wrapper,
  Breadcrumbs,
  MainWrapper,
  Title,
  Divider,
  Centered,
} from '../../Components/Shared/StyledEditComponents'

class EditGuide extends React.Component {
  componentDidMount(){
    const { record, getGuide, getStories, id } = this.props
    
    if (isEmpty(record)) {
      getGuide(id)
    }
    getStories(id)
  }

  handleCancel = () => {
    const { history } = this.props
    history.goBack()
  }

  handleDelete = () => {
    const { deleteGuide, history, id } = this.props
    const cb = () => {
      history.goBack()
    }
    deleteGuide({
      id,
      message,
      cb,
    })
  }

  handleSubmit = (values) => {
    const { putGuide, id } = this.props
    putGuide({
      id,
      values,
      message,
    })
  }

  renderTable = () => {
    const { record } = this.props

    return (
      <StatsTable
        title="Guide Stats"
        columns={[
          {
            title: 'Link',
            render: () => (
              <a href={`https://herotraveler.com/guides/${record.id}`}>
                {truncate(`herotraveler.com/guides/${record.id}`, 20)}
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
            title: '# Of Likes',
            text: get(record, 'counts.likes'),
          },
          {
            title: '# Of Comments',
            text: get(record, 'counts.comments'),
          },
          {
            title: 'Public',
            text: get(record, 'public'),
          },
          {
            title: 'Verified',
            text: get(record, 'verified'),
          },
        ]}
      />
    )
  }

  render() {
    const {
      record,
      isLoading,
      stories,
      isDeleting,
      isUpdating,
    } = this.props

    if (isLoading) return (<Centered><Spin /></Centered>)

    return (
      <Wrapper>
        <Breadcrumbs>
          <Link to="/guides">{`Guides > `}</Link>
          <span>{get(record, 'title')}</span>
        </Breadcrumbs>
        <MainWrapper>
          <Title>{get(record, 'title')}</Title>
          <Divider/>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <EditFeedItemForm
                type="guide"
                record={record}
                handleCancel={this.handleCancel}
                onSubmit={this.handleSubmit}
                onDelete={this.handleDelete}
                formLoading={isUpdating}
                isDeleting={isDeleting}
              />
            </Col>
            <Col xs={24} md={12}>
              {this.renderTable()}
            </Col>
          </Row>
          <Divider />
          <StoriesInGuideTable 
            list={stories || []}
          />
        </MainWrapper>
      </Wrapper>
    )
  }
}

EditGuide.propTypes = {
  record: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  getGuide: PropTypes.func.isRequired,
  putGuide: PropTypes.func.isRequired,
  deleteGuide: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  stories: PropTypes.array,
  id: PropTypes.string.isRequired,
  getStories: PropTypes.func.isRequired,
}

function mapStateToProps(state, ownProps) {
  const id = get(ownProps, 'match.params.id')
  const list = [...get(state, ['entities', 'guides', 'adminGuides', 'byId'], [])]
  const record = find(list, { id }) || {}
  const stories = values(get(state, ['entities', 'guides', 'storiesByGuide', id], []))
  return {
    record,
    isLoading: get(state, 'entities.guides.adminGuides.fetchStatus.fetching'),
    isDeleting: get(state, 'entities.guides.adminGuides.isDeleting'),
    isUpdating: get(state, 'entities.guides.adminGuides.isUpdating'),
    stories,
    id,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getGuide: (id) => dispatch(GuideActions.adminGetGuide(id)),
    putGuide: (payload) => dispatch(GuideActions.adminPutGuide(payload)),
    deleteGuide: (payload) => dispatch(GuideActions.adminDeleteGuide(payload)),
    getStories: (id) => dispatch(StoryActions.getGuideStories(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditGuide)
