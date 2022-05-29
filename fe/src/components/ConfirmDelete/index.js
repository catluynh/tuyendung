import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, Space } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { confirm } = Modal;
const ConfirmDelete = (props) => {
  function showDeleteConfirm() {
    confirm({
      title: "Are you sure delete this task?",
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }
  return (
    <>
      <Space wrap>
        <Button onClick={showDeleteConfirm} type="dashed">
          Delete
        </Button>
      </Space>
    </>
  );
};

ConfirmDelete.propTypes = {};

export default ConfirmDelete;
