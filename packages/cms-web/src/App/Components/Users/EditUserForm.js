import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Form, Input, Button, Icon, Upload, Checkbox, Select, message } from 'antd'
import mapValues from 'lodash/mapValues'

const Option = Select.Option
const FormItem = Form.Item

const ButtonStyled = styled(Button)`
  margin-top: 10px;
  margin-right: 10px;
`

class EditUserForm extends React.Component {
  state = {
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { form, onSubmit } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        onSubmit(values)
      } else {
        message.error('Form was not submitted: please fix errors')
      }
    })
  }

  render() {
    const {
      formLoading,
      isDeleting,
      record
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
        <FormItem {...formItemLayout} label="Username">
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input username' }],
          })(
            <Input placeholder="username" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Email">
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input email' }],
          })(
            <Input placeholder="email" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Password">
          {getFieldDecorator('password', {
            rules: [],
          })(
            <Input type="password" placeholder="password" />
          )}
          <a className="login-form-forgot" href="">Resend Password Reset Email</a>
        </FormItem>
        <FormItem {...formItemLayout} label="Role">
          {getFieldDecorator('role', {
            rules: [{ required: true, message: 'Please input role' }],
          })(
            <Select initialValue="contributor">
              <Option value="contributor">contributor</Option>
              <Option value="admin">admin</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Channel Thumbnail">
          {getFieldDecorator('channelThumbnail', {
          })(
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="//jsonplaceholder.typicode.com/posts/"
              beforeUpload={() => {}}
              onChange={() => {}}
            >
              {uploadButton}
            </Upload>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="Channel Hero Image">
          {getFieldDecorator('channelHeroImage', {
          })(
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="//jsonplaceholder.typicode.com/posts/"
              beforeUpload={() => {}}
              onChange={() => {}}
            >
              {uploadButton}
            </Upload>
          )}
        </FormItem>
        
        <FormItem>
          {getFieldDecorator('isFeatured', {
            valuePropName: 'checked',
            initialValue: false,
          })(
            <Checkbox>Featured User</Checkbox>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('isChannel', {
            valuePropName: 'checked',
            initialValue: false,
          })(
            <Checkbox>Make this user a channel</Checkbox>
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
              Delete User
            </ButtonStyled>
          </div>
        </FormItem>
      </Form>
    )
  }
}

EditUserForm.propTypes = {
  record: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  handleCancel: PropTypes.func.isRequired,
  formLoading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool.isRequired,
}

const mapPropsToFields = ({ record }) => mapValues(record, value => Form.createFormField({ value }))

export default Form.create({ mapPropsToFields })(EditUserForm)
