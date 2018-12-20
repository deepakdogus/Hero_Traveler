import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import moment from 'moment'
import { Row, Col, Spin, message } from 'antd'
import { Link } from 'react-router-dom'
import get from 'lodash/get'
import find from 'lodash/find'
import values from 'lodash/values'
import truncate from 'lodash/truncate'
import isEmpty from 'lodash/isEmpty'

import AdminGuideActions from '../../Shared/Redux/Admin/Guides'
import StoryActions from '../../Shared/Redux/Entities/Stories'
import EditGuideForm from '../../Components/Guides/EditGuideForm'
import StoriesInGuideTable from '../../Components/Stories/StoriesInGuideTable'

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

class EditGuide extends React.Component {
  state = {
    formSubmitting: false,
    isDeleting: false,
  }

  componentDidMount(){
    //get user EditGuide on signUp and reset signUp redux
    const { record, getGuide, id } = this.props
    
    if (isEmpty(record)) {
      getGuide(id)
    }
  }

  handleCancel = () => {
    const { history } = this.props
    history.goBack()
  }

  handleDelete = () => {
    const { deleteGuide, history, id } = this.props
    this.setState({
      isDeleting: true,
    })
    new Promise((resolve, reject) => {
      deleteGuide({
        id,
        resolve,
        reject,
      })
    }).then(() => {
      this.setState({
        isDeleting: false,
      })
      message.success('Guide was deleted')
      history.goBack()
    }).catch((e) => {
      this.setState({
        isDeleting: false,
      })
      message.error(e.toString())
    })
  }

  handleSubmit = (values) => {
    const { putGuide, id } = this.props
    this.setState({
      formSubmitting: true,
    })
    new Promise((resolve, reject) => {
      putGuide({
        id,
        values,
        resolve,
        reject,
      })
    }).then(() => {
      this.setState({
        formSubmitting: false,
      })
      message.success('Guide was updated')
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
          Guide Stats
        </SmallTitle>
        <TableStyled>
          <tbody>
            <TrStyled>
              <TdStyledGrey>Link</TdStyledGrey>
              <TdStyled>
                <a href={`https://herotraveler.com/stories/${record.id}`}>{truncate(`herotraveler.com/stories/${record.id}`, 20)}</a>
              </TdStyled>
            </TrStyled>
            <TrStyled>
              <TdStyledGrey>Date Published</TdStyledGrey>
              <TdStyled>{moment(record.createdAt).format('YYYY/MM/DD')}</TdStyled>
            </TrStyled>
            <TrStyled>
              <TdStyledGrey>Author</TdStyledGrey>
              <TdStyled>
                <Link to={`/users/${get(record, 'author.id')}`}>{get(record, 'author.username')}</Link>
              </TdStyled>
            </TrStyled>
            <TrStyled>
              <TdStyledGrey>Location</TdStyledGrey>
              <TdStyled>
                {get(record, 'location.name')}
              </TdStyled>
            </TrStyled>
            <TrStyled>
              <TdStyledGrey># Of Likes</TdStyledGrey>
              <TdStyled>{get(record, 'counts.likes')}</TdStyled>
            </TrStyled>
            <TrStyled>
              <TdStyledGrey># Of Comments</TdStyledGrey>
              <TdStyled>{get(record, 'counts.comments')}</TdStyled>
            </TrStyled>
            <TrStyled>
              <TdStyledGrey>Public</TdStyledGrey>
              <TdStyled>
                {get(record, 'public')}
              </TdStyled>
            </TrStyled>
            <TrStyled>
              <TdStyledGrey>Verified</TdStyledGrey>
              <TdStyled>
                {get(record, 'verified')}
              </TdStyled>
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
    } = this.props

    const { formSubmitting, isDeleting } = this.state

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
              <EditGuideForm
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
  stories: PropTypes.array,
  id: PropTypes.string.isRequired,
}

function mapStateToProps(state) {
  const href = window.location.href
  const id = href.match(/([^\/]*)\/*$/)[1]
  const list = [...get(state, ['admin','guides', 'list'], [])]
  const record = find(list, { id }) || {}
  const stories = values(get(state, 'entities.stories.entities', []))
  return {
    record,
    isLoading: state.admin.guides.isLoading,
    stories,
    id,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getGuide: (id) => dispatch(AdminGuideActions.adminGetGuide(id)),
    putGuide: (payload) => dispatch(AdminGuideActions.adminPutGuide(payload)),
    deleteGuide: (payload) => dispatch(AdminGuideActions.adminDeleteGuide(payload)),
    getStories: (id) => dispatch(StoryActions.getGuideStories(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditGuide)
