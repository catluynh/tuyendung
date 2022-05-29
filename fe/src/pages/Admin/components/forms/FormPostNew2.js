import React, { Fragment, useEffect, useState } from "react";
import { Button, Input, InputNumber, Select } from "antd";
import EmployeerApi from "../../../../services/employeer/employeerApi";
import { useCommonContext } from "../../../../components/Search/context/commonContext";

const { Option } = Select;
const OPTIONS = ["Quận 1", "Quận 2", "Quận 3", "Quận 4"];

const FormPostNew2 = ({ cities }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [salary, setSalary] = useState(1);
  const { listCareers, levels, typeWorks } = useCommonContext();
  const [city, setCity] = useState("");
  const [career, setCareer] = useState("");
  const [level, setLevel] = useState("");
  const [numberOfRecruits, setNumberOfRecruits] = useState(0);
  const [typeJob, setTypeJob] = useState("");
  const [salaryF, setSalaryF] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [district, setDistrict] = useState("");

  // const [city, setCity] = useState("");

  const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));
  useEffect(() => {
    console.log("Salary", salaryF);
  }, [salaryF]);
  return (
    <Fragment>
      <>
        <div className="row text-center">
          <div className="col-12 border-bottom mb-2 mt-3 bg-title">
            <h4>
              <strong>Thông tin công việc</strong>
            </h4>
          </div>
        </div>

        <div className="row">
          <div className="col-6 my-2">
            <p>
              <strong>
                Nơi làm việc<span className="text-danger ps-1">*</span>
              </strong>
            </p>
            <p>
              <Select
                style={{ width: "100%" }}
                showSearch
                placeholder="Chọn nơi làm việc"
                optionFilterProp="children"
                onChange={(e) => {
                  console.log("value onchange code", e);
                  // if(value){
                  //   cities.filter((item, index) => {
                  //     return item === value ?  :
                  //   })
                  // }
                  // setCity(e.target.value);
                  setCity(e);
                }}
                onSearch={(value) => {
                  console.log("value onsearch", value);
                }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                size="large"
              >
                {cities.map((city, index) => {
                  return (
                    <Fragment key={index}>
                      <Option value={city?.name}>{city?.name}</Option>
                    </Fragment>
                  );
                })}
              </Select>
            </p>
          </div>
          <div className="col-6 my-2">
            <p>
              <strong>
                Quận/Huyện<span className="text-danger ps-1">*</span>
              </strong>
            </p>
            <p>
              <Select
                size="large"
                mode="multiple"
                placeholder="Quận/Huyện"
                onChange={(value) => {
                  console.log("Quan huyen: ", value);
                }}
                style={{ width: "100%" }}
              >
                {filteredOptions.map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
              {/* <Input
                placeholder="123 đường ABC, Quận 1"
                size="large"
                value={district}
                onChange={(e) => {
                  console.log("eeeeee", e.target.value);
                  setDistrict(e.target.value);
                }}
              /> */}
            </p>
          </div>
          <div className="col-6 my-2">
            <p>
              <strong>
                Ngành nghề<span className="text-danger ps-1">*</span>
              </strong>
            </p>
            <p>
              <Select
                size="large"
                style={{ width: "100%" }}
                showSearch
                placeholder="Chọn ngành nghề"
                optionFilterProp="children"
                onChange={(value) => {
                  console.log("value onchange", value);
                  setCareer(value);
                }}
                onSearch={(value) => {
                  console.log("value onsearch", value);
                }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {listCareers.map((item, index) => (
                  <Option key={index} value={item.tenNganhNghe}>
                    {item.tenNganhNghe}
                  </Option>
                ))}
              </Select>
            </p>
          </div>
          <div className="col-6 my-2">
            <p>
              <strong>
                Cấp bậc<span className="text-danger ps-1">*</span>
              </strong>
            </p>
            <p>
              <Select
                size="large"
                style={{ width: "100%" }}
                showSearch
                placeholder="Chọn cấp bậc"
                optionFilterProp="children"
                onChange={(value) => {
                  console.log("value onchange", value);
                  setLevel(value);
                }}
                onSearch={(value) => {
                  console.log("value onsearch", value);
                }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {levels.map((level, index) => {
                  return (
                    <Option key={index} value={level.capBac}>
                      {level.capBac}
                    </Option>
                  );
                })}
              </Select>
            </p>
          </div>
        </div>
        {/* 1. */}
        <div className="row">
          <div className="col-6 my-2">
            <p>
              <strong>
                Số lượng tuyển<span className="text-danger ps-1">*</span>
              </strong>
            </p>
            <p>
              <InputNumber
                style={{ width: "100%" }}
                min={1}
                max={999}
                defaultValue={1}
                placeholder="123"
                size="large"
                onChange={(value) => {
                  console.log("so luong tuyen", value);
                  setNumberOfRecruits(value);
                }}
              />
            </p>
          </div>
          <div className="col-6 my-2">
            <p>
              <strong>
                Loại việc làm<span className="text-danger ps-1">*</span>
              </strong>
            </p>
            <p>
              <Select
                size="large"
                style={{ width: "100%" }}
                showSearch
                placeholder="Chọn loại hình công việc"
                optionFilterProp="children"
                onChange={(value) => {
                  console.log("value onchange", value);
                  console.log("type job", value);
                  setTypeJob(value);
                }}
                onSearch={(value) => {
                  console.log("value onsearch", value);
                }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {typeWorks.map((typeWork, index) => {
                  return (
                    <Option key={index} value={typeWork.loaiCongViec}>
                      {typeWork.loaiCongViec}
                    </Option>
                  );
                })}
              </Select>
            </p>
          </div>
        </div>
        {/* 2 */}
        <div className="row">
          <div className="col-3">
            <p>
              <strong>
                Mức lương<span className="text-danger ps-1">*</span>
              </strong>
            </p>
            <Select
              style={{ width: "100%" }}
              defaultValue="Thỏa thuận"
              onChange={(e) => {
                console.log("E", e);
                if (e == 1) {
                  console.log("Thỏa thuận");
                  setSalary(e);
                } else if (e == 0) {
                  console.log("co dinh");
                  setSalary(e);
                } else {
                  console.log("trong khoang");
                  setSalary(e);
                }
              }}
            >
              <Option value="1">Thỏa thuận</Option>
              <Option value="0">Cố định</Option>
              <Option value="-1">Trong khoảng</Option>
            </Select>
          </div>
          {salary == 1 && (
            <div className="col-9">
              <p>
                <strong>Hiển thị</strong>
              </p>
              <Input
                style={{ width: "100%" }}
                placeholder="Thỏa thuận"
                disabled
              />
            </div>
          )}
          {salary == 0 && (
            <>
              <div className={`col-3`}>
                <p>
                  <strong>
                    Tối thiểu<span className="text-danger ps-1">*</span>
                  </strong>
                </p>
                <Input
                  addonAfter="triệu"
                  onChange={(e) => {
                    console.log("toi thieu", e.target.value);
                    setSalaryF(e.target.value);
                  }}
                />
              </div>
              <div className="col-6">
                <p>
                  <strong>Hiển thị</strong>
                </p>
                <Input
                  addonAfter="triệu"
                  defaultValue={salaryF ? salaryF : ""}
                  value={salaryF}
                  disabled
                />
              </div>
            </>
          )}
          {salary == -1 && (
            <>
              <div className="col-3">
                <p>
                  <strong>
                    Tối thiểu<span className="text-danger ps-1">*</span>
                  </strong>
                </p>
                <Input
                  addonAfter="triệu"
                  onChange={(e) => {
                    console.log("toi thieu 2", e.target.value);
                    setSalaryF(e.target.value);
                  }}
                />
              </div>
              <div className="col-3">
                <p>
                  <strong>
                    Tối đa<span className="text-danger ps-1">*</span>
                  </strong>
                </p>
                <Input
                  addonAfter="triệu"
                  onChange={(e) => {
                    console.log("toi da 2", e.target.value);
                    setSalaryMax(e.target.value);
                  }}
                />
              </div>
              <div className="col-3">
                <p>
                  <strong>Hiển thị</strong>
                </p>
                <Input
                  addonAfter="triệu"
                  style={{ width: "100%" }}
                  placeholder="Thỏa thuận"
                  value={`${salaryF} - ${salaryMax}`}
                  disabled
                />
              </div>
            </>
          )}
        </div>
      </>
    </Fragment>
  );
};

FormPostNew2.propTypes = {};

export default FormPostNew2;
