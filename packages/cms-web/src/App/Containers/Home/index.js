import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import moment from 'moment'
import { DatePicker, Spin, Button, message } from 'antd'
import { Link } from 'react-router-dom'
import get from 'lodash/get'
import AdminStatsActions from '../../Shared/Redux/Admin/Stats'

const { RangePicker } = DatePicker

const Wrapper = styled.div``

const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const HomeDiv = styled.div`
  display: flex;
`

const WelcomeDiv = styled.div`
  display: flex;
  font-weight: bold;
`

const MainWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`

const Title = styled.h1`
  font-weight: bold;
`

const Divider = styled.hr`
  border-bottom: 2px solid black;
  width: 100%;
`

const TableStyled = styled.table`
  border: 1px solid black;
  width: 100%;
  margin-top: 20px;
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

const NewTable = styled.div`
  margin-top: 30px;
`

const StyledButton = styled(Button)`
  margin-left: 30px;
`

const dateFormat = 'DD/MM/YYYY'

class HomePage extends React.Component {
  state = {
    dates: [moment().subtract(1, 'months'), moment()],
    newIsLoading: false,
    totalIsLoading: false,
  }

  componentDidMount = () => {
    this.fetchTotal()
    this.fetchNew()
  }

  fetchNew = () => {
    const { dates } = this.state
    const { getNew } = this.props

    getNew({
      params: {
        dateFrom: dates[0].format('YYYY/MM/DD'),
        dateTill: dates[1].format('YYYY/MM/DD'),
      },
      message,
    })
  }

  fetchTotal = () => {
    const { getTotal } = this.props
    getTotal({
      message,
    })
  }

  onFilterChange = (date, dateString) => {
    this.setState({
      dates: date,
    })
  }

  renderTotalTable = () => {
    const { totalStats, totalIsLoading } = this.props
    if (totalIsLoading) return (<Centered><Spin /></Centered>)
    return (
      <TableStyled>
        <tbody>
          <TrStyled>
            <TdStyledGrey>Total Stories</TdStyledGrey>
            <TdStyled>
              <Link to='/stories'>{totalStats.totalStories}</Link>
            </TdStyled>
          </TrStyled>
          <TrStyled>
            <TdStyledGrey>Total Guides</TdStyledGrey>
            <TdStyled>
              <Link to='/guides'>{totalStats.totalGuides}</Link>
            </TdStyled>
          </TrStyled>
          <TrStyled>
            <TdStyledGrey>Total Users</TdStyledGrey>
            <TdStyled>
              <Link to='/users'>{totalStats.totalUsers}</Link>
            </TdStyled>
          </TrStyled>
          <TrStyled>
            <TdStyledGrey>Flagged Stories</TdStyledGrey>
            <TdStyled>
              <Link to='/stories'>{totalStats.totalFlaggedStories}</Link>
            </TdStyled>
          </TrStyled>
        </tbody>
      </TableStyled>
    )
  }

  renderNewTable = () => {
    const { newStats, newIsLoading } = this.props
    if (newIsLoading) return (<Centered><Spin /></Centered>)
    return (
      <TableStyled>
        <tbody>
          <TrStyled>
            <TdStyledGrey>New Stories</TdStyledGrey>
            <TdStyled>
              <Link to='/stories'>{newStats.totalStories}</Link>
            </TdStyled>
          </TrStyled>
          <TrStyled>
            <TdStyledGrey>New Guides</TdStyledGrey>
            <TdStyled>
              <Link to='/guides'>{newStats.totalGuides}</Link>
            </TdStyled>
          </TrStyled>
          <TrStyled>
            <TdStyledGrey>New Users</TdStyledGrey>
            <TdStyled>
              <Link to='/users'>{newStats.totalUsers}</Link>
            </TdStyled>
          </TrStyled>
        </tbody>
      </TableStyled>
    )
  }

  render() {
    const {
      profile,
    } = this.props

    const { dates } = this.state

    return (
      <Wrapper>
        <TopRow>
          <HomeDiv>
            Home
          </HomeDiv>
          <WelcomeDiv>
            Welcome back {profile.fullName}!
          </WelcomeDiv>
        </TopRow>
        <MainWrapper>
          <Title>Site Overview</Title>
          <Divider/>
          {this.renderTotalTable()}
          <NewTable>
            <RangePicker
              defaultValue={dates}
              format={dateFormat}
              onChange={this.onFilterChange}
            />
            <StyledButton type="primary" onClick={this.fetchNew}>Filter</StyledButton>
            {this.renderNewTable()}
          </NewTable>
        </MainWrapper>
      </Wrapper>
    )
  }
}

HomePage.propTypes = {
  getTotal: PropTypes.func.isRequired,
  getNew: PropTypes.func.isRequired,
  totalStats: PropTypes.object.isRequired,
  newStats: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  newIsLoading: PropTypes.bool.isRequired,
  totalIsLoading: PropTypes.bool.isRequired,
}

function mapStateToProps(state) {
  const totalStats = get(state, 'admin.stats.total', {})
  const newStats = get(state, 'admin.stats.new', {})
  const userId = state.session.userId
  const profile = get(state, ['entities', 'users', 'entities', userId, 'profile'], {})
  return {
    totalStats,
    newStats,
    profile, 
    newIsLoading: get(state, 'admin.stats.newIsLoading'),
    totalIsLoading: get(state, 'admin.stats.totalIsLoading'),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getTotal: (payload) => dispatch(AdminStatsActions.adminGetTotalStats(payload)),
    getNew: (payload) => dispatch(AdminStatsActions.adminGetNewStats(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
