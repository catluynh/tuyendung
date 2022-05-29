import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Checkbox, DatePicker, Input, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";

const CertificatedModal = ({ showModal, onCloseModal, ...props }) => {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const dateFormat = "YYYY-MM-DD";

  const resetValue = () => {
    console.log("3. Reset value");
    // setValue(`${prefixName}.name`, null);
    // setValue(`${prefixName}.note`, null);
    // setValue(`${prefixName}.attachments`, null);
  };
  const save = () => {
    // let data = watch(prefixName);
    console.log("running save()");
    // onSubmitCreate(payload);
    const payload = {
      tenChungChi: name,
      donViCungCap: department,
      ngayCap: fromDate,
      ngayHetHan: toDate,
    };
    onSubmitCreate(payload);
  };
  const onSubmitCreate = (payload) => {
    props.onSubmit(payload);
    resetValue();
    onCloseModal();
  };

  return (
    <div>
      <Modal
        title="Thêm Chứng chỉ / giấy chứng nhận"
        centered
        visible={showModal}
        // onOk={() => {
        //   console.log("Submit ok");
        // }}
        onCancel={() => {
          onCloseModal(false);
        }}
        width={700}
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
        <div className="pb-3">
          <p>
            <strong>Tên chứng chỉ</strong>{" "}
            <span className="text-danger">(*)</span>
          </p>
          <Input
            // showCount
            // maxLength={20}
            onChange={(e) => {
              console.log("value", e.target.value);
              setName(e.target.value);
            }}
            value={name}
            size="default"
            placeholder="Toeic 990, IELTS6.5"
          />
        </div>
        <div className="pb-3">
          <p>
            <strong>Đơn vị cung cấp</strong>{" "}
            <span className="text-danger">(*)</span>
          </p>
          <Input
            // showCount
            // maxLength={20}
            onChange={(e) => {
              console.log("value", e.target.value);
              setDepartment(e.target.value);
            }}
            value={department}
            size="default"
            placeholder="Ví dụ: IIG"
          />
        </div>
        <div className="pb-3">
          <Checkbox
            onChange={(e) => {
              console.log(`checked = ${e.target.checked}`);
              if (e.target.checked) {
                setIsChecked(true);
                setToDate(new Date());
              } else {
                setIsChecked(false);
              }
            }}
          >
            <strong>Chứng chỉ này chưa hết hạn</strong>
          </Checkbox>
        </div>
        <div className="pb-3">
          <span className="pe-2">
            <DatePicker
              format={""}
              onChange={(date, dateString) => {
                console.log(date);
                console.log(dateString);
                setFromDate(dateString);
              }}
            />
          </span>

          {/* Đến */}
          <span className="px-2"> đến </span>
          {/* Đến */}
          {isChecked ? (
            <span>
              <strong>Hiện tại</strong>
            </span>
          ) : (
            <>
              <span className="pe-2">
                <DatePicker
                  format={dateFormat}
                  onChange={(date, dateString) => {
                    console.log(date, dateString);
                    setToDate(dateString);
                  }}
                />
              </span>
            </>
          )}
        </div>
        {/* <div className="pb-3">
          <p>
            <strong>Mô tả chứng chỉ</strong>
          </p>
          <TextArea
            showCount
            maxLength={200}
            style={{ height: 120 }}
            onChange={(e) => {
              console.log("Change:", e.target.value);
            }}
          />
        </div> */}
      </Modal>
    </div>
  );
};

CertificatedModal.propTypes = {};

export default CertificatedModal;
