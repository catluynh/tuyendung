import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Button, DatePicker, Input, InputNumber, Select } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { FaAngleDoubleRight } from "react-icons/fa";
import { useCommonContext } from "../../../../components/Search/context/commonContext";
const { Option } = Select;
const OPTIONS = ["Apples", "Nails", "Bananas", "Helicopters"];
const AGES = [
  {
    1: 1,
  },
];

const FormPostNew4 = ({ onHandleHideForm1 }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [salary, setSalary] = useState(1);
  const [experience, setExperience] = useState("");
  const [degree, setDegree] = useState("");
  const [gender, setGender] = useState("");
  const [ageTo, setAgeTo] = useState();
  const [ageFrom, setAgeFrom] = useState();
  const [desDesReq, setDesReq] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [quyenLoi, setQuyenLoi] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const { experiences } = useCommonContext();
  // const handleChange = (selectedItems) => {
  //   setSelectedItems(selectedItems);
  // };
  const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));
  return (
    <Fragment>
      <>
        <div className="row text-center">
          <div className="col-12 border-bottom mb-2 mt-3 bg-title">
            <h4>
              <strong>Yêu cầu ứng viên</strong>
            </h4>
          </div>
        </div>

        <div className="row">
          <div className="col-6 my-2">
            <p>
              <strong>
                Kinh nghiệm<span className="text-danger ps-1">*</span>
              </strong>
            </p>
            <p>
              <Select
                size="large"
                placeholder="Chọn kinh nghiệm"
                // value={selectedItems}
                onChange={(value) => {
                  console.log("Value kinh nghiem", value);
                  setExperience(value);
                }}
                style={{ width: "100%" }}
              >
                {experiences.map((experience, index) => {
                  return (
                    <Option key={index} value={experience.kinhNghiem}>
                      {experience.kinhNghiem}
                    </Option>
                  );
                })}
              </Select>
            </p>
          </div>
          <div className="col-6 my-2">
            <p>
              <strong>
                Bằng cấp<span className="text-danger ps-1">*</span>
              </strong>
            </p>
            <p>
              <Select
                size="large"
                placeholder="Chọn bằng cấp"
                // value={selectedItems}
                onChange={(value) => {
                  console.log("Value bang cap", value);
                  setDegree(value);
                }}
                style={{ width: "100%" }}
              >
                <Option value="Sau đại học">Sau đại học</Option>
                <Option value="Đại học">Đại học</Option>
                <Option value="Cao Đẳng">Cao Đẳng</Option>
                <Option value="Trung cấp">Trung cấp</Option>
                <Option value="PHO_THONG">Phổ thông</Option>
                <Option value="Trung học">Trung học</Option>
                <Option value="Chưa tốt nghiệp">Chưa tốt nghiệp</Option>
                <Option value="Nghề">Nghề</Option>
                <Option value="Khác">Khác</Option>
              </Select>
            </p>
          </div>
          <div className="col-6 my-2">
            <p>
              <strong>
                Giới tính<span className="text-danger ps-1">*</span>
              </strong>
            </p>
            <p>
              <Select
                placeholder="Chọn giới tính"
                style={{ width: "100%" }}
                onChange={(value) => {
                  console.log("Chon gioi tinh: ", value);
                  setGender(value);
                }}
                size="large"
              >
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
                <Option value="Khác">Khác</Option>
              </Select>
            </p>
          </div>
          <div className="col-6 my-2">
            <p>
              <strong>
                Ngày hết hạn<span className="text-danger ps-1">*</span>
              </strong>
            </p>
            <p>
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Chọn ngày hết hạn"
                format={"DD-MM-YYYY"}
                onChange={(date, dateString) => {
                  console.log(date);
                  console.log(dateString);
                  setExpirationDate(dateString);
                }}
              />
            </p>
          </div>
          <div className="col-6 my-2">
            <p>
              <strong>Tuổi từ:</strong>
            </p>
            <p>
              <InputNumber
                size="large"
                style={{ width: "100%" }}
                min={18}
                max={60}
                placeholder={18}
                onChange={(e) => {
                  console.log("age", e);
                  setAgeFrom(e);
                }}
              />
            </p>
          </div>
          <div className="col-6 my-2">
            <p>
              <strong>Đến:</strong>
            </p>
            <p>
              <InputNumber
                size="large"
                style={{ width: "100%" }}
                min={18}
                max={60}
                placeholder={18}
                onChange={(e) => {
                  console.log("age", e);
                  setAgeTo(e);
                }}
              />
            </p>
          </div>

          <div className="col-12 my-2">
            <p>
              <strong>
                Mô tả yêu cầu<span className="text-danger ps-1">*</span>
              </strong>
            </p>
            <p>
              <TextArea
                rows={6}
                placeholder=""
                maxLength={1000}
                onChange={(e) => {
                  console.log("mo ta yc", e);
                  setDesReq(e.target.value);
                }}
              />
            </p>
          </div>
          <div className="col-12 my-2 bg-black">
            <div className="bg-secondary px-2 py-3 rounded text-white">
              <p className="text-underline">
                Các kỹ năng chuyên môn của ứng viên để đáp ứng nhu cầu công
                việc, các kỹ năng được ưu tiên của ứng viên... vv
              </p>
              <p className="text-underline">
                <strong>Ví dụ:</strong>{" "}
                <ul>
                  <li>
                    Kinh nghiệm vận hành, bảo trì sửa chữa nhà xưởng, tòa nhà
                    trên 2 năm.
                  </li>
                  <li>Kinh nghiệm chuyên ngành Cơ điện trên 5 năm</li>
                  <li>
                    Tận dụng kiến thức kỹ thuật, đưa ra quyết định nhanh chóng
                    và giải quyết vấn đề. Tận dụng kinh nghiệm đã tích lũy xác
                    định vấn đề tiềm ẩn và giải quyết mọi vấn đề càng sớm càng
                    tốt
                  </li>
                </ul>
              </p>
            </div>
          </div>
          <div className="col-12 my-2">
            <p>
              <strong>
                Quyền lợi ứng viên:<span className="text-danger ps-1">*</span>
              </strong>
            </p>
            <p>
              <TextArea
                rows={6}
                placeholder=""
                maxLength={1000}
                onChange={(e) => {
                  setQuyenLoi(e.target.value);
                }}
              />
            </p>
          </div>
          <div className="col-12 my-2 bg-black">
            <div className="bg-secondary px-2 py-3 rounded text-white">
              <p className="text-underline">
                <strong>
                  Những phúc lợi khi ứng viên tham gia vào công ty:
                </strong>{" "}
                <ul>
                  <li>Đóng BHXH, BHYT theo bộ luật lao động.</li>
                  <li>Chế độ nghỉ lễ Tết, đi du lịch hằng năm </li>
                  <li>
                    Được làm việc trong môi trường năng động, trẻ trung, đầy
                    nhiệt huyết.
                  </li>
                  <li>
                    Được tham gia các hoạt động team building và sự kiện lớn
                    trong năm độc đáo, hấp dẫn.{" "}
                  </li>

                  <li>Cơ hội thăng tiến, phát triển cao. </li>
                </ul>
              </p>
            </div>
          </div>
          <div className="col-12 border-bottom mb-2 text-center mt-3 bg-title">
            <h4>
              <strong>Thông tin liên hệ</strong>
            </h4>
          </div>
          <div className="col-4 my-2">
            <p>
              <strong>
                Người liên hệ <span className="text-danger ps-1">*</span>
              </strong>
            </p>
            <p>
              <Input
                placeholder="Trung Vinh"
                size="large"
                onChange={(e) => {
                  console.log(e.target.value);
                  setContact(e.target.value);
                }}
              />
            </p>
          </div>
          <div className="col-4 my-2">
            <p>
              <strong>
                Số điện thoại <span>*</span>
              </strong>
            </p>
            <p>
              <Input
                placeholder="0987999888"
                size="large"
                onChange={(e) => {
                  console.log(e.target.value);

                  setPhone(e.target.value);
                }}
              />
            </p>
          </div>
          <div className="col-4 my-2">
            <p>
              <strong>
                Email nhận hồ sơ <span>*</span>
              </strong>
            </p>
            <p>
              <Input
                placeholder="nhatuyendung@gmail.com"
                size="large"
                onChange={(e) => {
                  console.log(e.target.value);

                  setEmail(e.target.value);
                }}
              />
            </p>
          </div>
          {/* <div className="col-4 my-2"></div> */}
          <div className="col-12 my-2">
            <Button size="large" style={{ width: "100%" }} type="primary">
              Tiếp tục <FaAngleDoubleRight className="ps-1" />
            </Button>
          </div>
          {/* <div className="col-4 my-2"></div> */}
        </div>
      </>
    </Fragment>
  );
};

FormPostNew4.propTypes = {};

export default FormPostNew4;
