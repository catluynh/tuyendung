import { Button } from "antd";
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export const RegisterAccountSuccess = ({ email }) => {
  return (
    <>
      <Helmet>
        <title>Yêu cầu xác thực email | jobboard.com</title>
      </Helmet>
      <div className="login-wrapper d-flex justify-content-center py-4 my-5">
        <div className="bg-login mt-3" style={{ width: "35%" }}>
          <h5 className="text-center">
            <b>Kiểm tra email</b>
          </h5>
          <div
            className="card text-white mb-3"
            style={{ maxWidth: "100%", background: "#d4edda" }}
          >
            <div className="card-body">
              <p className="card-text" style={{ color: "#155724" }}>
                Hãy kiểm tra email <b>{email}</b>. Sau đó nhấn vào link trong
                hộp thư để xác thực tài khoản vừa đăng ký. <br></br>Trường hợp
                nếu bạn chưa nhận được. Vui lòng đợi 3s hoặc kiểm tra trong thư
                mục spam spam.
              </p>
            </div>
          </div>

          <Link to="/login">
            <Button
              className="btn form-control"
              type="primary"
              htmlType="submit"
              size="large"
            >
              Quay lại đăng nhập
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};
