import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Input, Modal, DatePicker, Select, Checkbox } from "antd";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import { use } from "i18next";
import TimeUtils from "../../../../utils/timeUtils";

const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

const UpdateEducationModal = ({
  showModal,
  onCloseModal,
  isEdit,
  ...props
}) => {
  const [degree, setDegree] = useState("");
  const [typeDegree, setTypeDegree] = useState("");
  const [school, setSchool] = useState("");
  const [specialized, setSpecialized] = useState("");
  const [description, setDescription] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const resetValue = () => {
    console.log("3. Reset value");
    // setValue(`${prefixName}.name`, null);
    // setValue(`${prefixName}.note`, null);
    // setValue(`${prefixName}.attachments`, null);
  };
  const save = () => {
    // let data = watch(prefixName);
    // console.log("running save()");
    // onSubmitCreate(payload);
    const payload = {
      // bangCap: degree,
      loaiBang: typeDegree,
      donViDaoTao: school,
      chuyenNganh: specialized,
      moTa: description,
      tuNgay: fromDate,
      denNgay: toDate,
    };
    console.log("payload", payload);
    if (isEdit) {
      console.log("Call update");
    } else {
      console.log("Call create");
      onSubmitCreate(payload);
    }
    // onSubmitCreate();
    // console.log("Add success");
  };
  const onSubmitCreate = (payload) => {
    props.onSubmit(payload);
    resetValue();
    onCloseModal();
  };
  function handleChange(value) {
    setTypeDegree(value);
  }
  return (
    <div>
      <Modal
        title="Chỉnh sửa học vấn bằng cấp"
        centered
        visible={showModal}
        // onOk={() => {
        //   console.log("Submit ok");
        // }}
        onCancel={() => {
          onCloseModal(false);
        }}
        className="mt-78"
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
        <div className="pb-3">
          <p>
            <strong>Bằng cấp</strong> <span className="text-danger">(*)</span>
          </p>
          <Input
            // showCount
            // maxLength={20}
            placeholder="Ví dụ: Cử nhân công nghệ thông tin"
            onChange={(e) => {
              console.log("value", e.target.value);
              setDegree(e.target.value);
            }}
            value={degree}
            size="default"
            // defaultValue={}
          />
        </div>
        <div className="pb-3">
          <p>
            <strong>Loại bằng</strong> <span className="text-danger">(*)</span>
          </p>
          <Select
            defaultValue="Chọn loại"
            style={{ width: "100%" }}
            onChange={handleChange}
            size="default"
          >
            <Option value="SAU_DAI_HOC">Cao học</Option>
            <Option value="DAI_HOC">Đại học</Option>
            <Option value="CAO_DANG">Cao đẳng</Option>
            <Option value="TRUNG_CAP">Trung cấp</Option>
            <Option value="PHO_THONG">Phổ thông</Option>
            <Option value="TRUNG_HOC">Trung học</Option>
            <Option value="CHUA_TOT_NGHIEP">Chưa tốt nghiệp</Option>
            <Option value="NGHE">Nghề</Option>
            <Option value="KHAC">Khác</Option>
          </Select>
        </div>
        <div className="pb-3">
          <p>
            <strong>Tên trường</strong> <span className="text-danger">(*)</span>
          </p>
          <Input
            // showCount
            // maxLength={20}
            onChange={(e) => {
              setSchool(e.target.value);
            }}
            value={school}
            size="default"
          />
        </div>
        <div className="pb-3">
          <p>
            <strong>Chuyên ngành</strong>{" "}
            <span className="text-danger">(*)</span>
          </p>
          <Input
            // showCount
            // maxLength={20}
            onChange={(e) => {
              console.log("value", e.target.value);
              setSpecialized(e.target.value);
            }}
            value={specialized}
            size="default"
            placeholder="Ví dụ: Công nghệ thông tin, Kinh tế, ..."
          />
        </div>
        <div className="pb-3">
          <Checkbox
            onChange={(e) => {
              console.log(`checked = ${e.target.checked}`);
              if (e.target.checked) {
                setIsChecked(true);
              } else {
                setIsChecked(false);
              }
            }}
          >
            <strong>Tôi hiện đang học tại đây</strong>
          </Checkbox>
        </div>
        <div className="pb-3">
          <span className="pe-2">
            <DatePicker
              format={dateFormat}
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
        <div className="pb-3">
          <p>
            <strong>Mô tả thêm</strong>
          </p>
          <TextArea
            showCount
            maxLength={500}
            style={{ height: 120 }}
            onChange={(e) => {
              console.log("Change:", e.target.value);
              setDescription(e.target.value);
            }}
            value={description}
          />
        </div>
        <span>
          Nên: Mô tả những kiến thức bạn đã học và thành tích đạt được
        </span>
      </Modal>
    </div>
  );
};

UpdateEducationModal.propTypes = {};

export default UpdateEducationModal;
