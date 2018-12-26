import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
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
import EditUserForm from '../../Components/Users/EditUserForm'
import UserStoriesTable from '../../Components/Users/UserStoriesTable'
import UserGuidesTable from '../../Components/Users/UserGuidesTable'

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

  handleHeroUpload = (fileObj) => {
    const { uploadHeroImage, record } = this.props
    this.setState({
      formSubmitting: true,
    })
    return new Promise((resolve, reject) => {
      uploadHeroImage({
        fileObj,
        category: record,
        resolve,
        reject,
      })
    }).finally(() => this.setState({
      formSubmitting: false,
    }))
  }

  handleChannelUpload = (fileObj) => {
    const { uploadChannelImage, record } = this.props
    this.setState({
      formSubmitting: true,
    })
    return new Promise((resolve, reject) => {
      uploadChannelImage({
        fileObj,
        category: record,
        resolve,
        reject,
      })
    }).finally(() => this.setState({
      formSubmitting: false,
    }))
  }

  renderTable = () => {
    const { record, stories, guides } = this.props
    return (
      <div>
        <SmallTitle>
          User Stats
        </SmallTitle>
        <TableStyled>
          <tbody>
            <TrStyled>
              <TdStyledGrey>Link</TdStyledGrey>
              <TdStyled>
                <a href={`https://herotraveler.com/profile/${record.id}`}>{truncate(`herotraveler.com/profile/${record.id}`, 20)}</a>
              </TdStyled>
            </TrStyled>
            <TrStyled>
              <TdStyledGrey>Member Since</TdStyledGrey>
              <TdStyled></TdStyled>
            </TrStyled>
            <TrStyled>
              <TdStyledGrey>Created On</TdStyledGrey>
              <TdStyled>{moment(record.createdAt).format('YYYY/MM/DD')}</TdStyled>
            </TrStyled>
            <TrStyled>
              <TdStyledGrey># Of Followers</TdStyledGrey>
              <TdStyled>{get(record, 'counts.followers')}</TdStyled>
            </TrStyled>
            <TrStyled>
              <TdStyledGrey>Following</TdStyledGrey>
              <TdStyled>{get(record, 'counts.following')}</TdStyled>
            </TrStyled>
            <TrStyled>
              <TdStyledGrey># Of Stories Published</TdStyledGrey>
              <TdStyled>{stories.length}</TdStyled>
            </TrStyled>
            <TrStyled>
              <TdStyledGrey># Of Guides Published</TdStyledGrey>
              <TdStyled>{guides.length}</TdStyled>
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
      stories,
      guides,
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
                onHeroUpload={this.handleHeroUpload}
                onChannelUpload={this.handleChannelUpload}
              />
            </Col>
            <Col xs={24} md={12}>
              {this.renderTable()}
            </Col>
          </Row>
          <Divider/>
          <UserStoriesTable 
            list={stories || []}
          />
          <UserGuidesTable 
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
  uploadHeroImage: PropTypes.func.isRequired,
  uploadChannelImage: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
}

function mapStateToProps(state) {
  const href = window.location.href
  const id = href.match(/([^\/]*)\/*$/)[1]
  const list = [...get(state, ['admin','users', 'list'], [])]
  const record = find(list, { id }) || {}
  const stories = filter(values(get(state, 'entities.stories.entities', [])), { author: id })
  const guides = filter(values(get(state, 'entities.guides.entities', [])), { author: id })
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
    uploadHeroImage: (payload) => dispatch(AdminUserActions.adminUploadUserHeroImage(payload)),
    uploadChannelImage: (payload) => dispatch(AdminUserActions.adminUploadUserChannelImage(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUser)
