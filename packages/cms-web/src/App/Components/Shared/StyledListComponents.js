import styled from 'styled-components'

export const Wrapper = styled.div``

export const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 50px;
`

export const Header = styled.div`
  display: flex;
`

export const SearchContainer = styled.div`
  display: flex;
`

export const LeftSpaceWrapper = styled.div`
  margin-left: 20px;
`

export const LeftSpaceSpan = styled.div`
  margin-left: 20px;
`

export const MiddleRow = styled.div`
  display: flex;
  margin-bottom: 20px;
`

export const FilterRow = styled.div`
  display: flex;
  margin-bottom: 20px;
`

export const ActionRow = styled.div`
  margin-bottom: 16px;
`

export const Tab = styled.div`
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'regular'};
  color: ${props => props.active ? 'black' : '#008dff'};
`

export const SquareImg = styled.img`
  height: 90px;
  width: 90px;
`

export const Divider = styled.hr`
  border-bottom: 2px solid black;
  width: 100%;
  margin-bottom: 50px;
`
