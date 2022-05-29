import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Input, Modal, DatePicker } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { Select } from "antd";
import { Checkbox } from "antd";
import moment from "moment";

const { Option } = Select;
const { RangePicker } = DatePicker;

const ExperienceModal = ({ showModal, onCloseModal, ...props }) => {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
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
      congTy: company,
      viTri: position,
      moTa: description,
      tuNgay: fromDate,
      denNgay: toDate,
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
        title="Kinh nghiệm làm việc"
        centered
        className="mt-78"
        visible={showModal}
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
        {/* <div className="pb-3">
          <p>
            <strong>Chức danh việc làm</strong>{" "}
            <span className="text-danger">(*)</span>
          </p>
          <Input
            // showCount
            // maxLength={20}
            onChange={(e) => {
              console.log("value", e.target.value);
              setPosition(e.target.value);
            }}
            value={position}
            size="default"
            placeholder="Ví dụ: Nhân viên kinh doanh"
          />
        </div> */}
        <div className="pb-3">
          <p>
            <strong>Chức danh việc làm</strong>{" "}
            <span className="text-danger">(*)</span>
          </p>
          <Select
            defaultValue="Chọn vị trí"
            style={{ width: "100%" }}
            onChange={(value) => {
              setPosition(value);
            }}
            size="default"
          >
            <Option value="Sinh viên">Sinh viên</Option>
            <Option value="Thực tập">Thực tập</Option>
            <Option value="Mới tốt nghiệp">Mới tốt nghiệp</Option>
            <Option value="Nhân viên">Nhân viên</Option>
            <Option value="Trưởng phòng">Trưởng phòng</Option>
            <Option value="Giám sát">Giám sát</Option>
            <Option value="Quản lý">Quản lý</Option>
            <Option value="Phó giám đốc">Phó giám đốc</Option>
            <Option value="Khác">Khác</Option>
          </Select>
        </div>
        <div className="pb-3">
          <p>
            <strong>Công ty / Tổ chức</strong>{" "}
            <span className="text-danger">(*)</span>
          </p>
          <Input
            // showCount
            // maxLength={20}
            onChange={(e) => {
              console.log("value", e.target.value);
              setCompany(e.target.value);
            }}
            value={company}
            size="default"
            placeholder="Ví dụ: Công ty cổ phẩn Alpaca"
          />
        </div>
        {/* <div className="pb-3">
          <p>
            <strong>Địa điểm</strong> <span className="text-danger">(*)</span>
          </p>
          <Select
            size="default"
            showSearch
            style={{ width: "100%" }}
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
          >
            <Option value="1">Hồ Chí Minh</Option>
            <Option value="2">Hà Nội</Option>
          </Select>
        </div> */}
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
            <strong>Tôi hiện đang làm việc tại đây</strong>
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
          <span className="px-2"> đến </span>
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
            <strong>Mô tả việc làm tại đây</strong>
          </p>
          <TextArea
            showCount
            maxLength={500}
            style={{ height: 120 }}
            onChange={(e) => {
              console.log("Change:", e.target.value);
              setDescription(e.target.value);
            }}
            placeholder="Mô tả việc làm tại đây"
          />
        </div>
        <span>
          Nên: Mô tả vị trí của bạn và bất kỳ những gì bạn đã từng học và làm
          việc tại đây.
        </span>
      </Modal>
    </div>
  );
};

ExperienceModal.propTypes = {};

export default ExperienceModal;
