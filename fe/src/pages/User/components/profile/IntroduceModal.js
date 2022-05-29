import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { ProfileContext } from "../../../../context/ProfileContextProvider";

const IntroduceModal = ({ showModal, onCloseModal, isEdit, ...props }) => {
  const [introduce, setIntroduce] = useState("");

  console.log(" modal isEdit", isEdit);

  const save = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const payload = {
      loiGioiThieu: introduce,
      taiKhoan: user.taiKhoan._id,
    };

    onSubmitCreate(payload);
  };
  const onSubmitCreate = (payload) => {
    props.onSubmit(payload);
    onCloseModal();
  };
  const onSubmitUpdate = (payload) => {
    props.onSubmit(payload);
    onCloseModal();
  };

  return (
    <div>
      <Modal
        title="Giới thiệu"
        centered
        visible={showModal}
        // onOk={() => {
        //   console.log("Submit ok");
        // }}
        onCancel={() => {
          onCloseModal(false);
        }}
        width={800}
        footer={[
          <Button
            key="back"
            onClick={() => {
              console.log("Cancel");
              onCloseModal(false);
            }}
          >
            Hủy bỏ
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              save();
            }}
          >
            Lưu
          </Button>,
        ]}
      >
        <p>
          <strong>Giới thiệu bản thân</strong>
        </p>
        <TextArea
          showCount
          maxLength={500}
          style={{ height: 120 }}
          onChange={(e) => {
            setIntroduce(e.target.value);
          }}
          defaultValue={props?.detail?.data?.loiGioiThieu}
        />
      </Modal>
    </div>
  );
};

IntroduceModal.propTypes = {};

export default IntroduceModal;
