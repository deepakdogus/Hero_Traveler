import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Form, Input, Button, Checkbox, Select, message } from 'antd'
import mapValues from 'lodash/mapValues'
import SingleImageUpload from '../SingleImageUpload'

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
      }
      else {
        message.error('Form was not submitted: please fix errors')
      }
    })
  }

  resetPassword = () => {
    const { resetPasswordRequest, form: { getFieldValue } } = this.props
    const email = getFieldValue('email')
    resetPasswordRequest(email)
    message.success('Password reset email was sent to the email above')
  }

  render() {
    const {
      formLoading,
      isDeleting,
      record,
    } = this.props

    const { getFieldDecorator } = this.props.form

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
          <Button className="login-form-forgot" onClick={this.resetPassword}>Resend Password Reset Email</Button>
        </FormItem>
        <FormItem {...formItemLayout} label="Role">
          {getFieldDecorator('role', {
            rules: [{ required: true, message: 'Please input role' }],
          })(
            <Select initialValue="user">
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
              <Option value="brand">Brand</Option>
              <Option value="contributor">Contributor</Option>
              <Option value="founding member">Founding Member</Option>
              <Option value="fellow">Fellow</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Channel Thumbnail Image">
          {getFieldDecorator('channelThumbnail', {
          })(
            <SingleImageUpload />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="Channel Hero Image">
          {getFieldDecorator('channelHeroImage', {
          })(
            <SingleImageUpload />
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
  resetPasswordRequest: PropTypes.func.isRequired,
}

const mapPropsToFields = ({ record }) => mapValues(record, value => Form.createFormField({ value }))

export default Form.create({ mapPropsToFields })(EditUserForm)
