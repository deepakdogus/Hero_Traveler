import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Checkbox, message } from 'antd'
import mapValues from 'lodash/mapValues'
import FormControls from './FormControls'

const FormItem = Form.Item

class EditFeedItemForm extends React.Component {
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
      type,
      handleCancel,
      onDelete,
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
        
        <FormItem {...formItemLayout} label="Sponsored by">
          {getFieldDecorator('sponsor', {
            rules: [],
          })(
            <Input placeholder="sponsored by" />,
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('featured', {
            valuePropName: 'checked',
            initialValue: false,
          })(
            <Checkbox>Feature</Checkbox>,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('pinned', {
            valuePropName: 'checked',
            initialValue: false,
          })(
            <Checkbox>Pin</Checkbox>,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('flagged', {
            valuePropName: 'checked',
            initialValue: false,
          })(
            <Checkbox>Flag</Checkbox>,
          )}
        </FormItem>
        <FormControls
          entity={type}
          record={record}
          onCancel={handleCancel}
          onDelete={onDelete}
          isDeleting={isDeleting}
          formLoading={formLoading}
        />
      </Form>
    )
  }
}

EditFeedItemForm.propTypes = {
  type: PropTypes.string.isRequired,
  record: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  handleCancel: PropTypes.func.isRequired,
  formLoading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool.isRequired,
}

const mapPropsToFields = ({ record }) =>
  mapValues(record, value => Form.createFormField({ value }))

export default Form.create({ mapPropsToFields })(EditFeedItemForm)
