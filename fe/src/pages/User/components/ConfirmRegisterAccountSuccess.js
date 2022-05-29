import { Button } from "antd";
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export const ConfirmRegisterAccountSuccess = ({ email }) => {
  return (
    <>
      <Helmet>
        <title>Xác thực email thành công | jobboard.com</title>
      </Helmet>
      <div className="login-wrapper d-flex justify-content-center py-4 my-5">
        <div className="bg-login mt-3" style={{ width: "35%" }}>
          <div
            className="card text-white mb-3"
            style={{ maxWidth: "100%", background: "#d4edda" }}
          >
            <div className="card-body">
              <p className="card-text text-center" style={{ color: "#155724" }}>
                Xác thực tài khoản thành công.
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
              <Link to="/login">
                <Button
                  style={{ width: "100%" }}
                  className="btn"
                  type="primary"
                  htmlType="submit"
                  size="default"
                >
                  Quay lại đăng nhập
                </Button>
              </Link>
            </div>
            <div className="col-3"></div>
          </div>
        </div>
      </div>
    </>
  );
};
