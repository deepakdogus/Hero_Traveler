import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Form, Button } from 'antd'
import capitalize from 'lodash/capitalize'

const ButtonStyled = styled(Button)`
  margin-top: 10px;
  margin-right: 10px;
`

const FormItem = Form.Item

const FormControls = ({
    formLoading,
    onCancel,
    record,
    isDeleting,
    onDelete,
    entity,
  }) => {
  return (
    <FormItem>
      <div>
        <ButtonStyled
          type="primary"
          htmlType="submit"
          loading={formLoading}
        >
          Save Changes
        </ButtonStyled>
        <ButtonStyled
          type="default"
          onClick={onCancel}
        >
          Cancel
        </ButtonStyled>
        <br/>
        <ButtonStyled
          disabled={record.isDeleted}
          type="danger"
          icon="delete"
          loading={isDeleting}
          onClick={onDelete}
        >
          Delete&nbsp;{capitalize(`${entity}`)}
        </ButtonStyled>
      </div>
    </FormItem>
  )
}

FormControls.propTypes = {
  entity: PropTypes.string.isRequired,
  record: PropTypes.object.isRequired,
  isDeleting: PropTypes.bool,
  formLoading: PropTypes.bool,
  onDelete: PropTypes.func,
  onCancel: PropTypes.func,
}

FormControls.defaultProps = {
  record: {},
}

export default FormControls
