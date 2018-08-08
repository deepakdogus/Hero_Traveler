import React from 'react'
import PropTypes from 'prop-types'
import DraftEditorPlaceholder from 'draft-js/lib/DraftEditorPlaceholder.react'
import cx from 'draft-js/node_modules/fbjs/lib/cx'

import Caption from '../MediaCaption'

export default class CustomPlaceholder extends DraftEditorPlaceholder {
  static propTypes = {
    text: PropTypes.string,
    accessibilityID: PropTypes.string,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.text !== nextProps.text
  }

  render() {
    const className = cx({
      'public/DraftEditorPlaceholder/root': true,
      'public/DraftEditorPlaceholder/hasFocus': true,
    })

    const contentStyle = {
      whiteSpace: 'pre-wrap',
    }

    return (
      <div className={className} style={{width: '100%'}}>
        <Caption
          className={cx('public/DraftEditorPlaceholder/inner')}
          id={this.props.accessibilityID}
          style={contentStyle}>
          {this.props.text}
        </Caption>
      </div>
    )
  }
}
