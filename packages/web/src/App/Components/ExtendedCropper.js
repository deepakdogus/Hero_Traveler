import { Cropper } from 'react-image-cropper'
import ReactDOM from 'react-dom'

const MINIMUM_DIM = 140

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

    // if frame width larger than img width
    if (width > imgWidth) {
      width = imgWidth
    }
    // if frame height larger than img height
    if (height > imgHeight) {
      height = imgHeight
    }

    /* start REHASH STUDIO code extending v. 1.1.1
     * frame dimensions should always be gte to the MINIMUM_DIM
     */
    if (height < MINIMUM_DIM) height = MINIMUM_DIM
    if (width < MINIMUM_DIM) width = MINIMUM_DIM
    /* end REHASH STUDIO code changes */

    this.setState({
        toImgLeft4Style: left,
        toImgTop4Style: top,
        frameWidth4Style: width,
        frameHeight4Style: height,
      }, function () {
        if (callback) callback(_this4)
      },
    )
  }

  frameDotMove(dir, e) {
    var pageX = e.pageX ? e.pageX : e.targetTouches[0].pageX
    var pageY = e.pageY ? e.pageY : e.targetTouches[0].pageY
    var _props5 = this.props,
      ratio = _props5.ratio,
      fixedRatio = _props5.fixedRatio
    var _state7 = this.state,
      startPageX = _state7.startPageX,
      startPageY = _state7.startPageY,
      originX = _state7.originX,
      originY = _state7.originY,
      frameWidth4Style = _state7.frameWidth4Style,
      frameHeight4Style = _state7.frameHeight4Style,
      frameWidth = _state7.frameWidth,
      frameHeight = _state7.frameHeight,
      imgWidth = _state7.imgWidth,
      imgHeight = _state7.imgHeight

    if (pageY !== 0 && pageX !== 0) {
      // current drag position offset x and y to first drag start position
      var _x = pageX - startPageX
      var _y = pageY - startPageY

      var _width = 0
      var _height = 0
      var _top = 0
      var _left = 0

      /* start REHASH STUDIO code extending v. 1.1.1
       * needsCalc condition to disallow setting cropper to sizes smaller than
       * our minimum
       */
      var needsCalc = true
      // have not abstract, just calc width, height, left, top in each direction
      switch (dir) {
        case 'e':
          _width = frameWidth + _x
          _height = fixedRatio ? _width / ratio : frameHeight
          _left = originX
          _top = fixedRatio ? originY - (_x / ratio) * 0.5 : originY
          if (frameWidth + _x <= MINIMUM_DIM) needsCalc = false
          break
        case 'n':
          _height = frameHeight - _y
          _width = fixedRatio ? _height * ratio : frameWidth
          _left = fixedRatio ? originX + _y * ratio * 0.5 : originX
          _top = originY + _y
          if (frameHeight - _y <= MINIMUM_DIM) needsCalc = false
          break
        case 'w':
          _width = frameWidth - _x
          _height = fixedRatio ? _width / ratio : frameHeight
          _left = originX + _x
          _top = fixedRatio ? originY + (_x / ratio) * 0.5 : originY
          if (frameWidth - _x <= MINIMUM_DIM) needsCalc = false
          break
        case 's':
          _height = frameHeight + _y
          _width = fixedRatio ? _height * ratio : frameWidth
          _left = fixedRatio ? originX - _y * ratio * 0.5 : originX
          _top = originY
          if (frameHeight + _y <= MINIMUM_DIM) needsCalc = false
          break
        default:
          break
      }

      if (_width > imgWidth || _height > imgHeight) {
        if (frameWidth4Style >= imgWidth || frameHeight4Style >= imgHeight) {
          return false
        }
      }

      if (needsCalc) {
        return this.calcPosition(_width, _height, _left, _top)
      }
      /* end REHASH STUDIO code changes */
    }
  }

  initStyles() {
    var _this2 = this

    var container = ReactDOM.findDOMNode(this.refs.container)
    this.setState(
      {
        imgWidth: container.offsetWidth,
      },
      function() {
        // calc frame width height
        var _props = _this2.props,
          originX = _props.originX,
          originY = _props.originY,
          disabled = _props.disabled

        if (disabled) return
        var _state = _this2.state,
          imgWidth = _state.imgWidth,
          imgHeight = _state.imgHeight
        var _state2 = _this2.state,
          frameWidth = _state2.frameWidth,
          frameHeight = _state2.frameHeight

        var maxLeft = imgWidth - frameWidth
        var maxTop = imgHeight - frameHeight

        if (originX + frameWidth >= imgWidth) {
          originX = imgWidth - frameWidth
          _this2.setState({ originX })
        }
        if (originY + frameHeight >= imgHeight) {
          originY = imgHeight - frameHeight
          _this2.setState({ originY: originY })
        }

        /* REHASH STUDIO code extending v. 1.1.1
         * center the cropper tool in the image on page load
         */
        if (!originX && !originY) {
          originX = (imgWidth - frameHeight) / 2
          originY = (imgWidth - frameHeight) / 2
        }
        /* end REHASH STUDIO code changes */

        _this2.setState({ maxLeft: maxLeft, maxTop: maxTop })
        // calc clone position
        _this2.calcPosition(frameWidth, frameHeight, originX, originY, function() {
          var _state3 = _this2.state,
            frameWidth4Style = _state3.frameWidth4Style,
            frameHeight4Style = _state3.frameHeight4Style,
            toImgTop4Style = _state3.toImgTop4Style,
            toImgLeft4Style = _state3.toImgLeft4Style

          _this2.setState({
            frameWidth: frameWidth4Style,
            frameHeight: frameHeight4Style,
            originX: toImgLeft4Style,
            originY: toImgTop4Style,
          })
        })
      },
    )
  }
}
