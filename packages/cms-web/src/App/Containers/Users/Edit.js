import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import moment from 'moment'
import { Input, Icon, Button, Row, Col, Spin } from 'antd'
import { Link } from 'react-router-dom'
import get from 'lodash/get'
import find from 'lodash/find'
import truncate from 'lodash/truncate'
import isEmpty from 'lodash/isEmpty'
import values from 'lodash/values'

import AdminActions from '../../Shared/Redux/AdminRedux'
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
  }

  componentDidMount(){
    //get user EditUser on signUp and reset signUp redux
    const { record, getUser, getStories } = this.props
    
    const href = window.location.href  
    const id = href.match(/([^\/]*)\/*$/)[1]
    if (isEmpty(record)) {
      getUser(id)
    }
    getStories(id)
  }

  renderTable = () => {
    const { record } = this.props
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
              <TdStyled></TdStyled>
            </TrStyled>
            <TrStyled>
              <TdStyledGrey># Of Guides Published</TdStyledGrey>
              <TdStyled></TdStyled>
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
  guides: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
}

function mapStateToProps(state) {
  const href = window.location.href
  const id = href.match(/([^\/]*)\/*$/)[1]
  const list = [...get(state, ['admin','users', 'list'], [])]
  const record = find(list, { id }) || {}
  const stories = values(get(state, 'entities.stories.entities', []))
  const guides = values(get(state, 'entities.guides.entities', []))
  return {
    record,
    isLoading: state.admin.users.isLoading,
    stories,
    guides,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getUser: (id) => dispatch(AdminActions.adminGetUser(id)),
    getStories: (id) => dispatch(StoryActions.fromUserRequest(id)),
    getGuides: (id) => dispatch(GuideActions.getUserGuides(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUser)
