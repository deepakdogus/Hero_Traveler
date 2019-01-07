import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import get from 'lodash/get'

import { Upload, Icon, Modal, message } from 'antd'

import CloudinaryAPI from '../Services/CloudinaryAPI'

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

class SingleFileUpload extends React.Component {
  state = {
    loading: false,
    previewVisible: false,
    previewImage: '',
    fileList: [],
  }

  componentDidMount = () => {
    const { value } = this.props
    if (!value || value === '') return
    const { fileList } = this.state
    this.setState({
      fileList: [{
        uid: fileList.length + 1,
        name: 'image',
        status: 'done',
        url: value,
      }],
    })
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (nextProps.value !== this.props.value) {
      const { fileList } = this.state
      this.setState({
        fileList: [{
          uid: fileList.length + 1,
          name: 'image',
          status: 'done',
          url: nextProps.value,
        }],
        loading: false,
      })
    }
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
          onChange(get(response, 'data.secure_url'))
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

SingleFileUpload.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
}

SingleFileUpload.defaultProps = {
  onChange: () => {},
}

export default SingleFileUpload
