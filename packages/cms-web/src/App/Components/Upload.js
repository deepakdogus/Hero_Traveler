import React from 'react'
import PropTypes from 'prop-types'

import { Upload, Icon, message } from 'antd'

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

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
  return isJPG && isPNG && isLt2M
}

class SingleFileUpload extends React.Component {
  state = {
    loading: false,
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }))
    }
  }

  handleUpload = (handledFileProps) => {
    const { onUpload } = this.props
    const { file } = handledFileProps
    const reader = new FileReader()

    reader.onload = (event) => {
      file.uri = reader.result
      onUpload(file)
    }
    reader.readAsDataURL(file)
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    const imageUrl = this.state.imageUrl
    return (
      <Upload
        name="image"
        listType="picture-card"
        className="image-uploader"
        showUploadList
        customRequest={this.handleUpload}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="image" /> : uploadButton}
      </Upload>
    )
  }
}

SingleFileUpload.propTypes = {
  onUpload: PropTypes.func.isRequired,
}

export default SingleFileUpload
