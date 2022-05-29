import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Button, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";

const FormPostNew3 = ({ onHandleHideForm1, onHandleShowForm1 }) => {
  const [desJob, setDesJob] = useState("");
  return (
    <Fragment>
      <div>
        <div className="row text-center">
          <div className="col-12 border-bottom mb-2 mt-3 bg-title">
            <h4>
              <strong>Mô tả công việc</strong>
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-2 my-2"></div>
          <div className="col-8 my-2">
            <p>
              <strong>
                Mô tả công việc<span className="text-danger ps-1">*</span>
              </strong>
            </p>
            <p>
              <TextArea
                rows={8}
                placeholder=""
                maxLength={1000}
                onChange={(value) => {
                  console.log("Mo ta cong viec", value.target.value);
                  setDesJob(value.target.value);
                }}
              />
            </p>
          </div>
          <div className="col-2 my-2"></div>
          <div className="col-2 my-2"></div>
          <div className="col-8 my-2 bg-black">
            <div className="bg-secondary px-2 py-3 rounded text-white">
              <p className="text-underline">
                <strong>Nên:</strong>{" "}
                <ul>
                  <li>Viết tiếng việt có dấu: </li>
                  <li>Mô tả công việc, nơi làm việc, giờ làm</li>
                  <li>Yêu cầu bằng cấp, kỹ năng</li>
                  <li>Phúc lợi khác ngoài lương</li>
                </ul>
              </p>
              <p className="text-underline">
                <strong> Không nên:</strong>
              </p>
              <ul>
                <li>Không điền số điện thoại/email trong nội dung</li>
                <li>
                  Không điền form ứng tuyển hoặc đường dẫn tới website khác
                </li>
              </ul>
            </div>
          </div>
          <div className="col-2 my-2 text-white"></div>
        </div>
      </div>
    </Fragment>
  );
};

FormPostNew3.propTypes = {};

export default FormPostNew3;
