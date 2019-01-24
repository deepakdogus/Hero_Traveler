import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Form, Input, Button, Checkbox, message } from 'antd'
import mapValues from 'lodash/mapValues'
import get from 'lodash/get'
import SingleImageUpload from '../SingleImageUpload'

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
        <FormItem {...formItemLayout} label="Title">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input title' }],
          })(
            <Input placeholder="title" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Thumbnail Image">
          {getFieldDecorator('thumbnail', {
          })(
            <SingleImageUpload />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="Hero Image">
          {getFieldDecorator('heroImage', {
          })(
            <SingleImageUpload />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="Category Interstitial Image (App)">
            {getFieldDecorator('interstitialImage', {
            })(
              <SingleImageUpload />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Category Sponsor Logo (Website)">
            {getFieldDecorator('categorySponsorLogo', {
            })(
              <SingleImageUpload />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Sponsor Link">
            {getFieldDecorator('sponsorLink', {
              rules: [],
            })(
              <Input placeholder="Add a link to a profile or website" />
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
            {this.props.onDelete && <ButtonStyled
              disabled={record.isDeleted}
              type="danger"
              icon="delete"
              loading={isDeleting}
              onClick={this.props.onDelete}
            >
              Delete Category
            </ButtonStyled>}
          </div>
        </FormItem>
      </Form>
    )
  }
}

EditCategoryForm.propTypes = {
  record: PropTypes.object,
  form: PropTypes.object.isRequired,
  handleCancel: PropTypes.func.isRequired,
  formLoading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  isDeleting: PropTypes.bool,
}

EditCategoryForm.defaultProps = {
  record: {},
  isDeleting: false,
}

const mapPropsToFields = ({ record }) => {
  const values = mapValues(record, (value, key) => {
    if (key === 'image') return undefined
    return Form.createFormField({ value })
  })
  values['thumbnail'] = Form.createFormField({ value: get(record, 'image') })
  values['heroImage'] = Form.createFormField({ value: get(record, 'image') })
  return values
}

export default Form.create({ mapPropsToFields })(EditCategoryForm)
