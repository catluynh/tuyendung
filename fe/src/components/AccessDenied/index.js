import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { Button } from "antd";
import { Link } from "react-router-dom";

const AccessDenied = (props) => {
  return (
    <Fragment>
      <>
        <Helmet>
          <title>403 Access Denied</title>
        </Helmet>
        <div className="login-wrapper d-flex justify-content-center py-4 my-5">
          <div className="bg-login mt-3" style={{ width: "35%" }}>
            <div
              className="card text-dark mb-3"
              style={{ maxWidth: "100%", background: "#d4edda" }}
            >
              <div className="card-body">
                <p
                  className="card-text text-center"
                  style={{ color: "danger" }}
                >
                  403 - Bạn không có quyền truy cập vào trang này
                </p>
                <p>
                  <Link to="/">
                  <Button className="rounded" style={{width: "100%"}}><strong>
                  Về trang chủ</strong></Button>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    </Fragment>
  );
};

AccessDenied.propTypes = {};

export default AccessDenied;
