import React from 'react'
import PropTypes from 'prop-types'
import {Cropper} from 'react-image-cropper'

const avataStyles = {
  clone: {
    borderRadius: '100%',
    border: '1px dashed #88f',
  },
  dotInnerNE: { display: 'none' },
  dotInnerNW: { display: 'none' },
  dotInnerSE: { display: 'none' },
  dotInnerSW: { display: 'none' },
  dotNE: { display: 'none' },
  dotNW: { display: 'none' },
  dotSE: { display: 'none' },
  dotSW: { display: 'none' },
  move: { outline: 'none' },
}

export default class ModifiedCropper extends React.Component {
  static propTypes = {
    isAvatar: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      srcLoaded: false,
      image: ''
    }
  }

  handleImageLoaded = () => {
    this.setState({srcLoaded: true})
  }

  render () {
    const {isAvatar} = this.props
    return (
      <div>
        {
          <Cropper
            src={this.props.src}
            ref='cloudinary'
            onImgLoad={this.handleImageLoaded}
            styles={isAvatar ? avataStyles : {}}
          />
        }
      </div>
    )
  }
}
