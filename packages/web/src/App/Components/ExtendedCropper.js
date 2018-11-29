import {Cropper} from 'react-image-cropper'

export default class ExtendedCropper extends Cropper {
  calcPosition = (width, height, left, top, callback) => {
    var _this4 = this

    var _state4 = this.state,
        imgWidth = _state4.imgWidth,
        imgHeight = _state4.imgHeight
    var _props3 = this.props,
        ratio = _props3.ratio,
        fixedRatio = _props3.fixedRatio
    // width < 0 or height < 0, frame invalid

    if (width < 0 || height < 0) return false
    // if ratio is fixed
    if (fixedRatio) {
        // adjust by width
        if (width / imgWidth > height / imgHeight) {
            if (width > imgWidth) {
                width = imgWidth
                left = 0
                height = width / ratio
            }
        }
        else {
            // adjust by height
            if (height > imgHeight) {
                height = imgHeight
                top = 0
                width = height * ratio
            }
        }
    }
    // frame width plus offset left, larger than img's width
    if (width + left > imgWidth) {
        if (fixedRatio) {
            // if fixed ratio, adjust left with width
            left = imgWidth - width
        }
        else {
            // resize width with left
            width = width - (width + left - imgWidth)
        }
    }
    // frame heigth plust offset top, larger than img's height
    if (height + top > imgHeight) {
        if (fixedRatio) {
            // if fixed ratio, adjust top with height
            top = imgHeight - height
        }
        else {
            // resize height with top
            height = height - (height + top - imgHeight)
        }
    }
    // left is invalid
    if (left < 0) {
        left = 0
    }
    // top is invalid
    if (top < 0) {
        top = 0
    }
    // ALLEN ADD NEW TOP + LEFT LOGIC HERE

    // if frame width larger than img width
    if (width > imgWidth) {
        width = imgWidth
    }
    // if frame height larger than img height
    if (height > imgHeight) {
        height = imgHeight
    }

    if (height < 140) {
        height = 140
    }
    if (width < 140) {
        width = 140
    }

    this.setState({
        toImgLeft4Style: left,
        toImgTop4Style: top,
        frameWidth4Style: width,
        frameHeight4Style: height,
    }, function () {
        if (callback) callback(_this4)
    })
  }
}
