import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";

const ApplyJobModal = ({ modalVisible, onCloseModal, ...props }) => {
  return (
    <Fragment>
      <Modal
        title="Vertically centered modal dialog"
        centered
        visible={modalVisible}
        // onOk={() => setModalVisible(false)}
        // onCancel={() => setModalVisible(false)}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
    </Fragment>
  );
};

ApplyJobModal.propTypes = {};
ApplyJobModal.defaultProps = {
  showModal: false,
};
export default ApplyJobModal;
