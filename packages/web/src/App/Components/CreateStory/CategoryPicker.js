import React from 'react';
import styled from 'styled-components'
import PropTypes from 'prop-types'
import onClickOutside from 'react-onclickoutside'
import HorizontalDivider from '../HorizontalDivider'

const TagPickerContainer = styled.div`
  position: absolute;
  z-index: 100;
  max-height: 250px;
  top: 20px;
  padding: 30px 15px;
  width: 250px;
  overflow: scroll;
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
    loadDefaultCategories: PropTypes.func,
    categoriesList: PropTypes.arrayOf(PropTypes.object),
  }

  handleClickOutside() {
    // If user clicks outside Picker, it is closed and default categories are reloaded so that if 
    // user reopens Picker, there are guaranteed to be options
    this.props.closePicker()
    this.props.loadDefaultCategories()
  }
  renderList(categoriesList) {
    return (
      categoriesList.map((tag) => {
        return (
          <div key={tag.id ? tag.id : tag.title}> {/* Tags do not yet have ids if they have just been entered by user*/}
            <Tag onClick={(e) => this.props.handleCategorySelect(e, { ...tag })}>{tag.title}</Tag>
            <StyledHorizontalDivider color='lighter-grey' opaque/>
          </div>
        )
      })
    )
  }

  render() {
    const { categoriesList } = this.props;
    return (
      <TagPickerContainer>
        {this.renderList(categoriesList)}
      </TagPickerContainer>
    )
  }
}

export default onClickOutside(CategoryPicker)
