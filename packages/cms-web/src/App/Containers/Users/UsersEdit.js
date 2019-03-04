import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import { Row, Col, Spin, message } from 'antd'
import { Link } from 'react-router-dom'
import get from 'lodash/get'
import find from 'lodash/find'
import filter from 'lodash/filter'
import truncate from 'lodash/truncate'
import isEmpty from 'lodash/isEmpty'
import values from 'lodash/values'

import AdminUserActions from '../../Shared/Redux/Admin/Users'
import StoryActions from '../../Shared/Redux/Entities/Stories'
import GuideActions from '../../Shared/Redux/Entities/Guides'
import LoginActions from '../../Shared/Redux/LoginRedux'
import EditUserForm from '../../Components/Users/EditUserForm'
import UserItemsTable from '../../Components/Users/UserItemsTable'
import convertUrlsToImageFormat from '../../Utils/convertUrlsToImageFormat'

import StatsTable from '../../Components/Shared/StatsTable'

import {
  Wrapper,
  Breadcrumbs,
  MainWrapper,
  Title,
  Divider,
  Centered,
} from '../../Components/Shared/StyledEditComponents'

class EditUser extends React.Component {
  state = {
    formSubmitting: false,
    isDeleting: false,
  }

  componentDidMount(){
    //get user EditUser on signUp and reset signUp redux
    const { record, getUser, getStories, getGuides, id } = this.props
    
    if (isEmpty(record)) {
      getUser(id)
    }
    getStories(id)
    getGuides(id)
  }

  handleCancel = () => {
    const { history } = this.props
    history.goBack()
  }

  handleDelete = () => {
    const { deleteUser, history, id } = this.props
    this.setState({
      isDeleting: true,
    })
    new Promise((resolve, reject) => {
      deleteUser({
        id,
        resolve,
        reject,
      })
    }).then(() => {
      this.setState({
        isDeleting: false,
      })
      message.success('User was deleted')
      history.goBack()
    }).catch((e) => {
      this.setState({
        isDeleting: false,
      })
      message.error(e.toString())
    })
  }

  handleSubmit = (values) => {
    const { putUser, id } = this.props
    this.setState({
      formSubmitting: true,
    })
    const {
      channelThumbnail,
      channelHeroImage,
      channelSponsorLogo,
      interstitialImage,
    } = values
    if ((channelThumbnail && channelThumbnail.public_id)
        || (channelHeroImage && channelHeroImage.public_id)) {
      values.channelImage
        = convertUrlsToImageFormat(channelThumbnail, channelHeroImage, 'channelImage')
    }
    if (channelSponsorLogo && channelSponsorLogo.public_id) {
      values.channelSponsorLogo
        = convertUrlsToImageFormat(undefined, channelSponsorLogo, 'channelSponsorLogo')
    }
    if (interstitialImage && interstitialImage.public_id) {
      values.interstitialImage
        = convertUrlsToImageFormat(undefined, interstitialImage, 'interstitialImage')
    }
    
    new Promise((resolve, reject) => {
      putUser({
        id,
        values,
        resolve,
        reject,
      })
    }).then(() => {
      this.setState({
        formSubmitting: false,
      })
      message.success('User was updated')
    }).catch((e) => {
      this.setState({
        formSubmitting: false,
      })
      message.error(e.toString())
    })
  }

  renderTable = () => {
    const { record, stories, guides } = this.props

    return (
      <StatsTable
        title="User Stats"
        columns={[
          {
            title: 'Link',
            render: () => (
              <a href={`https://herotraveler.com/profile/${record.id}`}>
                {truncate(`herotraveler.com/profile/${record.id}`, 20)}
              </a>),
          },
          {
            title: 'Member Since',
            text: moment(record.createdAt).format('YYYY/MM/DD'),
          },
          {
            title: 'Created On',
            text: '',
          },
          {
            title: '# Of Followers',
            text: get(record, 'counts.followers'),
          },
          {
            title: 'Following',
            text: get(record, 'counts.following'),
          },
          {
            title: '# Of Stories Published',
            text: stories.length,
          },
          {
            title: '# Of Guides Published',
            text: guides.length,
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
      guides,
      resetPasswordRequest,
    } = this.props

    const { formSubmitting, isDeleting } = this.state

    if (isLoading) return (<Centered><Spin /></Centered>)

    return (
      <Wrapper>
        <Breadcrumbs>
          <Link to="/users">{`Users > `}</Link>
          <span>{get(record, 'profile.fullName')}</span>
        </Breadcrumbs>
        <MainWrapper>
          <Title>{get(record, 'profile.fullName')}</Title>
          <Divider/>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <EditUserForm
                record={record}
                handleCancel={this.handleCancel}
                onSubmit={this.handleSubmit}
                onDelete={this.handleDelete}
                formLoading={formSubmitting}
                isDeleting={isDeleting}
                resetPasswordRequest={resetPasswordRequest}
              />
            </Col>
            <Col xs={24} md={12}>
              {this.renderTable()}
            </Col>
          </Row>
          <Divider/>
          <UserItemsTable
            type="stories"
            list={stories || []}
          />
          <UserItemsTable 
            type="guides"
            list={guides || []}
          />
        </MainWrapper>
      </Wrapper>
    )
  }
}

EditUser.propTypes = {
  record: PropTypes.object.isRequired,
  stories: PropTypes.array,
  history: PropTypes.object.isRequired,
  getUser: PropTypes.func.isRequired,
  putUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  getStories: PropTypes.func.isRequired,
  getGuides: PropTypes.func.isRequired,
  guides: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
  resetPasswordRequest: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
}

function mapStateToProps(state, ownProps) {
  const id = get(ownProps, 'match.params.id')
  const list = [...get(state, ['admin','users', 'list'], [])]
  const record = find(list, { id }) || {}
  const stories
    = filter(values(get(state, 'entities.stories.entities', [])), { author: id })
  const guides
    = filter(values(get(state, 'entities.guides.entities', [])), { author: id })
  return {
    record,
    isLoading: state.admin.users.isLoading,
    stories,
    guides,
    id,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getUser: (id) => dispatch(AdminUserActions.adminGetUser(id)),
    putUser: (payload) => dispatch(AdminUserActions.adminPutUser(payload)),
    deleteUser: (payload) => dispatch(AdminUserActions.adminDeleteUser(payload)),
    getStories: (id) => dispatch(StoryActions.fromUserRequest(id)),
    getGuides: (id) => dispatch(GuideActions.getUserGuides(id)),
    resetPasswordRequest: email => dispatch(LoginActions.resetPasswordRequest(email)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUser)
