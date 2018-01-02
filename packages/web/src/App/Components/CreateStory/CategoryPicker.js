import React from 'react';
import styled from 'styled-components'
import PropTypes from 'prop-types'
import onClickOutside from "react-onclickoutside"

import HorizontalDivider from '../HorizontalDivider'

const TagPickerContainer = styled.div`
  position: absolute;
  z-index: 100;
  left: 50px;
  top: 56px;
  padding: 30px 15px;
  width: 290px;
  overflow: auto;
  background-color: white;
  outline: none;
  -webkit-box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
`

const Tag = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  color: ${props => props.theme.Colors.background};
  font-weight: 600;
  letter-spacing: 0.7px;
  font-size: 14px;
  padding: 8px 0;
  margin: 0;
  cursor: pointer;
`
const StyledHorizontalDivider = styled(HorizontalDivider)`
  border-width: 1px;
`

class CategoryPicker extends React.Component {

static propTypes = {
    closePicker: PropTypes.func,
    handleCategorySelect: PropTypes.func,
    listTags: PropTypes.arrayOf(PropTypes.string),
    categoriesList: PropTypes.arrayOf(PropTypes.object),
  }

  handleClickOutside() {
    this.props.closePicker()
    this.props.loadDefaultCategories()
  }
  renderList(categoriesList) {
    return (
      categoriesList.map((tag) => {
        return (
          <div key={tag.id ? tag.id : tag.title}>
            <Tag onClick={this.props.handleCategorySelect}>{tag.title}</Tag>
            <StyledHorizontalDivider color='lighter-grey' opaque/>
          </div>
        )
      })
    )
  }

  render() {
    const {categoriesList, closePicker} = this.props;
    return (
      <TagPickerContainer>
        {this.renderList(categoriesList)}
      </TagPickerContainer>
    )
  }
}

export default onClickOutside(CategoryPicker)
