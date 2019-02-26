import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Checkbox, message } from 'antd'
import mapValues from 'lodash/mapValues'
import get from 'lodash/get'
import SingleImageUpload from '../SingleImageUpload'
import FormControls from '../Shared/FormControls'

const FormItem = Form.Item

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
      onDelete,
      handleCancel,
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
            <Input placeholder="title" />,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Thumbnail Image">
          {getFieldDecorator('thumbnail', {
          })(
            <SingleImageUpload />,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="Hero Image">
          {getFieldDecorator('heroImage', {
          })(
            <SingleImageUpload />,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="Category Interstitial Image (App)">
            {getFieldDecorator('interstitialImage', {
            })(
              <SingleImageUpload />,
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Category Sponsor Logo (Website)">
            {getFieldDecorator('categorySponsorLogo', {
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
        
        <FormItem>
          {getFieldDecorator('featured', {
            valuePropName: 'checked',
            initialValue: false,
          })(
            <Checkbox>Feature category in Explore page</Checkbox>,
          )}
        </FormItem>
        <FormControls
          formLoading={formLoading}
          handleCancel={handleCancel}
          onDelete={onDelete}
          entity="category"
          isDeleting={isDeleting}
          record={record}
        />
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
