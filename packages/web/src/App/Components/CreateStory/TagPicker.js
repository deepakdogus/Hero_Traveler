import React, {Component} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import onClickOutside from 'react-onclickoutside'
import HorizontalDivider from '../HorizontalDivider'

const TagPickerContainer = styled.div`
  position: absolute;
  z-index: 100;
  max-height: 250px;
  top: 20px;
  left: -172px;
  padding: 8px 15px 0px 15px;
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
  letter-spacing: 0.2px;
  font-size: 14px;
  padding: 8px 0;
  margin: 0;
  cursor: pointer;
`
const StyledHorizontalDivider = styled(HorizontalDivider)`
  border-width: 1px;
`

const BottomSpacer = styled.div`
  width: 100%;
  margin-top: 8px;
`

class TagOption extends Component {
  static propTypes = {
    tag: PropTypes.object,
    handleTagSelect: PropTypes.func,
    isUseDivider: PropTypes.bool,
  }

  onClickOption = (event) => {
    const {tag, handleTagSelect} = this.props
    handleTagSelect(event, tag)
  }

  render() {
    const {tag, isUseDivider} = this.props
    return (
      <div key={tag.id ? tag.id : tag.title}> {/* Tags do not yet have ids if they have just been entered by user*/}
        <Tag onClick={this.onClickOption}>{tag.title}</Tag>
        { isUseDivider
          ? <StyledHorizontalDivider color='lighter-grey' opaque/>
          : <BottomSpacer />
        }
      </div>
    )
  }
}

class TagPicker extends Component {

  static propTypes = {
    closePicker: PropTypes.func,
    handleTagSelect: PropTypes.func,
    loadDefaultTags: PropTypes.func,
    tagsList: PropTypes.arrayOf(PropTypes.object),
  }

  handleClickOutside() {
    // If user clicks outside Picker, it is closed and default tags are reloaded so that if
    // user reopens Picker, there are guaranteed to be options
    this.props.closePicker()
    this.props.loadDefaultTags()
  }

  renderList(tagsList) {
    return (
      tagsList.map((tag, index, arr) => {
        return (
          <TagOption
            key={tag.id ? tag.id : tag.title}
            tag={tag}
            handleTagSelect={this.props.handleTagSelect}
            isUseDivider={index !== (arr.length - 1)}
          />
        )
      })
    )
  }

  render() {
    const { tagsList } = this.props
    if (tagsList.length === 0) return null
    return (
      <TagPickerContainer>
        {this.renderList(tagsList)}
      </TagPickerContainer>
    )
  }
}

export default onClickOutside(TagPicker)
