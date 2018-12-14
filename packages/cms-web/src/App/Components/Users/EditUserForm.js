import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Form, Input, Button, Icon, Upload, Checkbox, Select } from 'antd'
import get from 'lodash/get'

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
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const {
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
    };

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
            <Input placeholder="username" value={record.username} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Email">
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input email' }],
          })(
            <Input placeholder="email" value={record.email} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Password">
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input password' }],
          })(
            <Input type="password" placeholder="password" />
          )}
          <a className="login-form-forgot" href="">Resend Password Reset Email</a>
        </FormItem>
        <FormItem {...formItemLayout} label="Role">
          {getFieldDecorator('role', {
            rules: [{ required: true, message: 'Please input role' }],
          })(
            <Select defaultValue="contributor">
              <Option value="contributor">contributor</Option>
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
          {getFieldDecorator('featuredUser', {
            valuePropName: 'checked',
            initialValue: false,
          })(
            <Checkbox>Featured User</Checkbox>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('makeThisUserChannel', {
            valuePropName: 'checked',
            initialValue: false,
          })(
            <Checkbox>Make this user a channel</Checkbox>
          )}
        </FormItem>
        <FormItem>
          <div>
            <ButtonStyled type="primary" htmlType="submit">Save Changes</ButtonStyled>
            <ButtonStyled type="default" htmlType="submit">Cancel</ButtonStyled>
            <br/>
            <ButtonStyled type="danger" htmlType="submit" icon="delete">Delete User</ButtonStyled>
          </div>
        </FormItem>
      </Form>
    )
  }
}

EditUserForm.propTypes = {
  record: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
}

export default Form.create()(EditUserForm)
