import 'filepond/dist/filepond.min.css'

import React from 'react'
import PropTypes from 'prop-types'
import {FilePond, registerPlugin} from 'react-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import axios from 'axios'

import env from '../../../Config/Env'

registerPlugin(
  FilePondPluginFileValidateType,
)

export default class VideoUpload extends React.Component {
  allowMultiple;
  allowDrop;
  acceptedFileTypes;
  maxFiles;
  serverUrl;
  process;
  revert;
  restore;
  fetch;
  load;
  allowRevert;
  allowFileTypeValidation;
  uploadVideoApi;

  constructor(props) {
    super(props)
    this.allowDrop = props.allowDrop || true
    this.allowMultiple = props.allowMultiple || true
    this.acceptedFileTypes = props.acceptedFileTypes || ['video/*']
    this.maxFiles = props.maxFiles || 5
    this.allowRevert = props.allowRevert || true
    this.uploadVideoApi = axios.create({
      baseURL: this.serverUrl || env.API_URL,
    })
    this.server = {
      url: this.serverUrl || env.API_URL,
      process: (fieldName, file, metadata, load, error, progress, abort) => {
        const formData = new FormData()
        const CancelToken = axios.CancelToken
        const source = CancelToken.source()

        formData.append(fieldName, file, file.name)

        this.uploadVideoApi
          .post(
            '/files/video-upload',
            formData, {
              cancelToken: source.token,
              onUploadProgress: (e) => {
                progress(false, e.loaded, e.total)
              },
            })
          .then((response) => {
            load(response.data)
          })
          .catch((err) => {
            error(err)
          })

        return {
          abort: () => {
            source.cancel('Operation canceled by the user.')
            abort()
          }
        }
      },
      revert: this.revert || function (uniqueFileId, load, error) {
        this.uploadVideoApi.delete('/files/video-upload', {data: {publicId: uniqueFileId}})
          .catch((err) => error(err))
      },
      restore: this.restore || null,
      fetch: this.fetch || null,
      load: this.load || null,
    }
    this.allowFileTypeValidation = props.allowFileTypeValidation || true
  }

  render() {
    return (
      <FilePond
        allowMultiple={this.allowMultiple}
        allowDrop={this.allowDrop}
        maxFiles={this.maxFiles}
        allowRevert={this.allowRevert}
        acceptedFileTypes={this.acceptedFileTypes}
        allowFileTypeValidation={this.allowFileTypeValidation}
        server={this.server}
      />
    )
  }
}

VideoUpload.propTypes = {
  allowDrop: PropTypes.bool,
  allowMultiple: PropTypes.bool,
  acceptedFileTypes: PropTypes.string,
  maxFiles: PropTypes.number,
  allowRevert: PropTypes.bool,
  serverUrl: PropTypes.string,
  process: PropTypes.string,
  revert: PropTypes.string,
  restore: PropTypes.string,
  fetch: PropTypes.string,
  load: PropTypes.string,
  allowFileTypeValidation: PropTypes.bool,
}
