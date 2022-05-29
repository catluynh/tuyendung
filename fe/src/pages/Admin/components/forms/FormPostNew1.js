import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Button, Input, Select } from "antd";

const FormPostNew1 = () => {
  const [title, setTitle] = useState("");
  console.log("title", title);
  return (
    <Fragment>
      <div>
        <div className="row text-center">
          <div className="col-12 border-bottom mb-2 bg-title">
            <h4>
              <strong>Tiêu đề tuyển dụng</strong>
            </h4>
          </div>
        </div>

        <div className="row">
          <div className="col-2 my-2"></div>
          <div className="col-8 my-2">
            <p>
              <strong>
                Tiêu đề tuyển dụng<span className="text-danger ps-1">*</span>
              </strong>
            </p>
            <p>
              <Input
                placeholder="Ví dụ tuyển nhân viên kinh doanh"
                size="large"
                value={title}
                onChange={(e) => {
                  console.log("eeeeee", e.target.value);
                  setTitle(e.target.value);
                }}
              />
            </p>
          </div>
          <div className="col-2 my-2"></div>
          <div className="col-2 my-2"></div>
          <div className="col-8 my-2 bg-black">
            <div className="bg-secondary px-2 py-3 rounded text-white">
              <p className="text-underline">
                <strong>Ví dụ:</strong> Tuyển nhân viên kinh doanh không yêu cầu
                kinh nghiệm
              </p>
              <p className="text-underline">
                <strong>Nên:</strong>{" "}
                <ul>
                  <li>Viết tiếng việt có dấu</li>
                  <li>
                    Đề các chức danh, vi trí cần tuyển, số lương cần tuyển
                  </li>
                </ul>
              </p>
              <p className="text-underline">
                <strong> Không nên:</strong>
              </p>
              <ul>
                <li>Không để số điện thoại</li>
                <li>Không để tên công ty</li>
                <li>Không để email</li>
              </ul>
            </div>
          </div>
          <div className="col-2 my-2 text-white"></div>
        </div>
      </div>
    </Fragment>
  );
};

FormPostNew1.propTypes = {};

export default FormPostNew1;
