import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Checkbox, Select, message } from 'antd'
import mapValues from 'lodash/mapValues'
import get from 'lodash/get'
import SingleImageUpload from '../SingleImageUpload'
import FormControls from '../Shared/FormControls'

import { Divider } from '../Shared/StyledEditComponents'

const Option = Select.Option
const FormItem = Form.Item

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
      handleCancel,
      onDelete,
    } = this.props

    const { getFieldDecorator, getFieldValue } = this.props.form

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
            <Input placeholder="username" />,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Email">
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input email' }],
          })(
            <Input placeholder="email" />,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Password">
          <Button
            className="login-form-forgot"
            onClick={this.resetPassword}
          >
            Resend Password Reset Email
          </Button>
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
            </Select>,
          )}
        </FormItem>
        
        <FormItem>
          {getFieldDecorator('isFeatured', {
            valuePropName: 'checked',
            initialValue: false,
          })(
            <Checkbox>Featured User</Checkbox>,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('isChannel', {
            valuePropName: 'checked',
            initialValue: false,
          })(
            <Checkbox>Make this user a channel</Checkbox>,
          )}
        </FormItem>
        {getFieldValue('isChannel') && <div>
          <Divider />

          <h2>Channel Image Assets</h2>

          <FormItem {...formItemLayout} label="Channel Thumbnail Image">
            {getFieldDecorator('channelThumbnail', {
            })(
              <SingleImageUpload />,
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Channel Hero Image">
            {getFieldDecorator('channelHeroImage', {
            })(
              <SingleImageUpload />,
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Channel Interstitial Image (App)">
            {getFieldDecorator('interstitialImage', {
            })(
              <SingleImageUpload />,
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Channel Sponsor Logo (Website)">
            {getFieldDecorator('channelSponsorLogo', {
            })(
              <SingleImageUpload />,
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Sponsor Link">
            {getFieldDecorator('sponsorLink', {
              rules: [],
            })(
              <Input placeholder="Add a link to a profile or website" />,
            )}
          </FormItem>

          <Divider />
        </div>}
        <FormControls
          formLoading={formLoading}
          handleCancel={handleCancel}
          onDelete={onDelete}
          entity="user"
          isDeleting={isDeleting}
          record={record}
        />
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

const mapPropsToFields = ({ record }) => {
  const values = mapValues(record, (value, key) => {
    if (key === 'channelImage') return undefined
    return Form.createFormField({ value })
  })
  values['channelThumbnail'] =
    Form.createFormField({ value: get(record, 'channelImage') })
  values['channelHeroImage'] =
    Form.createFormField({ value: get(record, 'channelImage') })
  return values
}

export default Form.create({ mapPropsToFields })(EditUserForm)
