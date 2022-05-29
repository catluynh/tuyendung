import { Button } from "antd";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import axiosClient from "../../services/axiosClient";

export const Payment = ({ }) => {
  useEffect(() => {
    const getPayMent = async () => {
      const requestUrl = `http://localhost:4000/tinTuyenDungs/thanhToan`;
      try {
        await axiosClient.post(requestUrl);
      } catch (error) {
        console.log(error.response);
      }
    };
    getPayMent();
  }, []);

  return (
    <>
      <Helmet>
        <title>Đang chuyển hướng đến trang thanh toán</title>
      </Helmet>
      <div className="login-wrapper d-flex justify-content-center py-4 my-5">
        <div className="bg-login mt-3" style={{ width: "35%" }}>
          <div
            className="card text-white mb-3"
            style={{ maxWidth: "100%", background: "#d4edda" }}
          >
            <div className="card-body">
              <p className="card-text text-center" style={{ color: "#155724" }}>
                Đang chuyển hướng đến trang thanh toán.
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
              <Link to="/employer/dashboard">
                <Button
                  style={{ width: "100%" }}
                  className="btn"
                  type="primary"
                  htmlType="submit"
                  size="default"
                >
                  Quay lại trang chủ
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
