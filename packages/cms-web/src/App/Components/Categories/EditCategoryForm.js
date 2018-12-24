import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Form, Input, Button, Icon, Upload, Checkbox, message } from 'antd'
import mapValues from 'lodash/mapValues'
import SingleFileUpload from '../Upload'

const FormItem = Form.Item

const ButtonStyled = styled(Button)`
  margin-top: 10px;
  margin-right: 10px;
`

class EditCategoryForm extends React.Component {
  state = {
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { form, onSubmit } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        onSubmit(values)
      }
      else {
        message.error('Form was not submitted: please fix errors')
      }
    })
  }

  handleHeroUpload = (file) => {
    const { onUpload } = this.props
    onUpload(file)
  }

  render() {
    const {
      formLoading,
      isDeleting,
      record,
    } = this.props

    const { getFieldDecorator } = this.props.form

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    )

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }

    return (
      <Form
        layout="vertical"
        onSubmit={this.handleSubmit}
        className="login-form"
        style={{ marginTop: '20px' }}
      >
        <FormItem {...formItemLayout} label="Title">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input title' }],
          })(
            <Input placeholder="title" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Channel Thumbnail">
          {getFieldDecorator('channelThumbnail', {
          })(
            <SingleFileUpload onUpload={() => {}} />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="Channel Hero Image">
          {getFieldDecorator('channelHeroImage', {
          })(
            <SingleFileUpload onUpload={this.handleHeroUpload} />
          )}
        </FormItem>
        
        <FormItem>
          {getFieldDecorator('featured', {
            valuePropName: 'checked',
            initialValue: false,
          })(
            <Checkbox>Feature category in Explore page</Checkbox>
          )}
        </FormItem>
        <FormItem>
          <div>
            <ButtonStyled type="primary" htmlType="submit" loading={formLoading}>Save Changes</ButtonStyled>
            <ButtonStyled type="default" onClick={this.props.handleCancel}>Cancel</ButtonStyled>
            <br/>
            <ButtonStyled
              disabled={record.isDeleted}
              type="danger"
              icon="delete"
              loading={isDeleting}
              onClick={this.props.onDelete}
            >
              Delete Category
            </ButtonStyled>
          </div>
        </FormItem>
      </Form>
    )
  }
}

EditCategoryForm.propTypes = {
  record: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  handleCancel: PropTypes.func.isRequired,
  formLoading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool.isRequired,
}

const mapPropsToFields = ({ record }) => mapValues(record, value => Form.createFormField({ value }))

export default Form.create({ mapPropsToFields })(EditCategoryForm)
