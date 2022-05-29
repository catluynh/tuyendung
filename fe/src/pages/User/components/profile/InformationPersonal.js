import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Modal,
  Select,
  Avatar,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { getUserProfile } from "../../../../utils/localStorage";
import { AntDesignOutlined } from "@ant-design/icons";
import axiosClient from "../../../../services/axiosClient";
import axios from "axios";

const { Option } = Select;
const InformationPersonal = ({ showModal, onCloseModal, ...props }) => {
  const user = getUserProfile();
  console.log("user, ", user);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [numbers, setNumbers] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const dateFormat = "YYYY-MM-DD";
  const userId = getUserProfile();
  const resetValue = () => {
    console.log("3. Reset value");
    // setValue(`${prefixName}.name`, null);
    // setValue(`${prefixName}.note`, null);
    // setValue(`${prefixName}.attachments`, null);
  };
  console.log("userId", userId?.taiKhoan._id);
  const save = () => {
    const payload = {
      ten: name,
      sdt: numbers,
      gioiTinh: gender,
      diaChi: address,
      // soNamKinhNghiem: "Chưa có kinh nghiệm",
      avatar: selectedImage,
      ngaySinh: birthDate,
      taiKhoan: userId?.taiKhoan._id,
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
        className="mt-78"
        title="Cập nhật thông tin liên hệ"
        centered
        visible={showModal}
        // onOk={() => {
        //   console.log("Submit ok");
        // }}
        onCancel={() => {
          onCloseModal(false);
        }}
        width={500}
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
            className="mt-78"
          >
            Lưu
          </Button>,
        ]}
      >
        <div className="pb-3 d-flex align-items-center justify-content-center">
          {selectedImage && (
            <Avatar
              size={{
                xs: 24,
                sm: 32,
                md: 40,
                lg: 64,
                xl: 80,
                xxl: 100,
              }}
              src={URL.createObjectURL(selectedImage)}
              icon={<AntDesignOutlined />}
            />
          )}
        </div>
        <div className="pb-3">
          <input
            accept="image/*"
            id="icon-button-file"
            type="file"
            name="file"
            onChange={(event) => {
              let formData = new FormData();
              formData.append("file", event.target.files[0]);
              const requestUrl = `http://ec2-3-0-177-195.ap-southeast-1.compute.amazonaws.com:4000/ungtuyenviens/capNhatAvatar`;
              axios({
                method: "patch",
                url: requestUrl,
                data: formData,
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              });
              setSelectedImage(event.target.files[0]);
            }}
            // hidden
          />
        </div>
        <div className="pb-3">
          <p>
            <strong>Họ tên</strong> <span className="text-danger">(*)</span>
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
            placeholder="Ví dụ: Trung Vinh"
          />
        </div>
        <div className="pb-3">
          <p>
            <strong>Ngày sinh</strong> <span className="text-danger">(*)</span>
          </p>
          <span className="pe-2">
            <DatePicker
              className="form-control"
              format={dateFormat}
              onChange={(date, dateString) => {
                console.log(date);
                console.log(dateString);
                setBirthDate(dateString);
              }}
            />
          </span>
        </div>
        <div className="pb-3">
          <p>
            <strong>Số điện thoại</strong>{" "}
            <span className="text-danger">(*)</span>
          </p>
          <Input
            // showCount
            // maxLength={20}
            onChange={(e) => {
              console.log("value", e.target.value);
              setNumbers(e.target.value);
            }}
            value={numbers}
            size="default"
            placeholder="Ví dụ: 0987059059"
          />
        </div>
        <div className="pb-3">
          <p>
            <strong>Email liên hệ</strong>{" "}
            <span className="text-danger">(*)</span>
          </p>
          <Input
            // showCount
            // maxLength={20}
            onChange={(e) => {
              console.log("value", e.target.value);
              setEmail(e.target.value);
            }}
            value={email}
            size="default"
            placeholder="Ví dụ: hello.trungvinh@gmail.com"
          />
        </div>
        <div className="pb-3">
          <p>
            <strong>Địa chỉ hiện tại</strong>{" "}
            <span className="text-danger">(*)</span>
          </p>
          <Input
            // showCount
            // maxLength={20}
            onChange={(e) => {
              console.log("value", e.target.value);
              setAddress(e.target.value);
            }}
            value={address}
            size="default"
            placeholder="Ví dụ: 185 Điện Biên Phủ, Quận 1, Hồ Chí Minh"
          />
          <div className="pb-3">
            <p>
              <strong>Chức danh việc làm</strong>{" "}
              <span className="text-danger">(*)</span>
            </p>
            <Select
              defaultValue="Chọn giới tính"
              style={{ width: "100%" }}
              onChange={(value) => {
                setGender(value);
              }}
              size="default"
            >
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

InformationPersonal.propTypes = {};

export default InformationPersonal;
