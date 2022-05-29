import { Spin, Alert } from 'antd';
import React from 'react'
import PropTypes from 'prop-types'

const Spinner = props => {
  return (
    <Spin tip="Loading...">
  </Spin>
  )
}

Spinner.propTypes = {}

export default Spinner
