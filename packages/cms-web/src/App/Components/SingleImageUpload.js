import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import get from 'lodash/get'

import { Upload, Icon, Modal, message } from 'antd'

import CloudinaryAPI from '../Services/CloudinaryAPI'
import getImageUrl from '../Shared/Lib/getImageUrl'

const FullWidthImg = styled.img`
  width: 100%;
`

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  if (!isJPG && !isPNG) {
    message.error('You can only upload JPG or PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 5
  if (!isLt2M) {
    message.error('Image must smaller than 5MB!')
  }
  return (isJPG || isPNG) && isLt2M
}

class SingleImageUpload extends React.Component {
  state = {
    loading: false,
    previewVisible: false,
    previewImage: '',
    fileList: [],
  }

  static getDerivedStateFromProps(props, state) {
    if (props.value !== get(state, 'fileList.0.url')) {
      const { fileList } = state
      const url = props.id === 'thumbnail' || props.id === 'channelThumbnail'
        ? getImageUrl(props.value, 'gridItemThumbnail')
        : getImageUrl(props.value)
      return {
        fileList: [{
          uid: fileList.length + 1,
          name: 'image',
          status: 'done',
          url,
        }],
        loading: false,
      }
    }

    // Return null to indicate no change to state.
    return null
  }

  componentDidMount = () => {
    const { value, id } = this.props
    if (!value) return
    const { fileList } = this.state
    const url = id === 'thumbnail' || id === 'channelThumbnail'
        ? getImageUrl(value, 'gridItemThumbnail')
        : getImageUrl(value)
    this.setState({
      fileList: [{
        uid: fileList.length + 1,
        name: 'image',
        status: 'done',
        url,
      }],
    })
  }

  handleUpload = (handledFileProps) => {
    this.setState({ loading: true })
    const { onChange } = this.props
    const { file } = handledFileProps
    const reader = new FileReader()

    reader.onload = (event) => {
      file.uri = reader.result
      CloudinaryAPI.uploadMediaFile(file, 'image')
        .then((response) => {
          message.success('File was uploaded')
          onChange(get(response, 'data'))
        })
        .catch((e) => {
          message.error(`Error uploading file: ${e.toString()}`)
          this.setState({ loading: false })
        })
    }
    reader.readAsDataURL(file)
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleCancel = () => this.setState({ previewVisible: false })

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    const { previewVisible, previewImage, fileList } = this.state
    return (
      <div>
        <Upload
          name="image"
          listType="picture-card"
          className="image-uploader"
          fileList={fileList}
          customRequest={this.handleUpload}
          handlePreview={this.handlePreview}
          beforeUpload={beforeUpload}
        >
          {fileList.length > 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <FullWidthImg alt="example" src={previewImage} />
        </Modal>
      </div>
    )
  }
}

SingleImageUpload.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.object,
  id: PropTypes.string,
}

SingleImageUpload.defaultProps = {
  onChange: () => {},
}

export default SingleImageUpload
