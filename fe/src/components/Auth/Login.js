import { Button } from "antd";
import React, { Fragment, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, useHistory } from "react-router-dom";
import { login } from "../../redux/actions/authActions";
import Logo from "../../assets/logo/logo_remove_bg.png";
import "./Login.css";
import { logoStyle, maxWH } from "../../utils/style";
import { IMAGE_LOGO, UNG_TUYEN_VIEN } from "../../constansts/common";
import { NHA_TUYEN_DUNG, QUAN_TRI_VIEN } from "../../utils/roles";

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { register, errors, handleSubmit } = useForm({});
  const user = useSelector((state) => state.userLogin);
  const { isAuthenticated } = useSelector((state) => state.userLogin);
  console.log("isAuthenticated", isAuthenticated);

  const onSubmit = async (data) => {
    const payload = {
      tenDangNhap: data.dangNhapTenTaiKhoan?.trim(),
      matKhau: data.dangNhapMatKhau?.trim(),
    };
    dispatch(login(payload));
  };
  useEffect(() => {
    if (user?.user?.taiKhoan?.loaiTaiKhoan === NHA_TUYEN_DUNG) {
      console.log("Role ntd");
      history.push("/employer/dashboard");
    } else if (user?.user?.taiKhoan?.loaiTaiKhoan === UNG_TUYEN_VIEN) {
      console.log("Role utv");
      history.push("/");
    } else if (user?.user?.taiKhoan?.loaiTaiKhoan === QUAN_TRI_VIEN) {
      console.log("Role qtv");
      history.push("/admin/dashboard");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isAuthenticated) {
    return <Redirect to="/" />;
  } else {
    <Redirect to="/login" />;
  }

  return (
    <Fragment>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <meta charSet="utf-8" />
        <title>Đăng nhập tài khoản | jobboard.com</title>
      </Helmet>

      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <div
              className="d-flex justify-content-center mt-5"
              style={{ padding: "50px" }}
            >
              <div className="bg-login center-screen">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="d-flex align-items-center justify-content-center">
                    <div style={{ width: "148px", height: "42px" }}>
                      <img src={IMAGE_LOGO} style={maxWH}></img>
                    </div>
                  </div>
                  <div className="py-2 text-center">
                    <h3>Đăng nhập</h3>
                  </div>
                  <div className="admin-modal-content">
                    <div className="input-wrapper">
                      <div className="input-wrapper-item mb-3">
                        <input
                          name="dangNhapTenTaiKhoan"
                          type="text"
                          className="form__input"
                          placeholder="zunggzing"
                          ref={register({
                            required: true,
                            minLength: 8,
                            maxLength: 30,
                          })}
                        />
                        <label htmlFor="adminUsername" className="form__label">
                          Tên tài khoản
                        </label>
                      </div>
                      <div className="error-input">
                        {errors.dangNhapTenTaiKhoan &&
                          errors.dangNhapTenTaiKhoan.type === "required" && (
                            <p>Vui lòng nhập tên tài khoản của bạn</p>
                          )}
                        {errors.dangNhapTenTaiKhoan &&
                          errors.dangNhapTenTaiKhoan.type === "minLength" && (
                            <p>Vui lòng nhập tối thiểu 8 ký tự</p>
                          )}
                        {errors.dangNhapTenTaiKhoan &&
                          errors.dangNhapTenTaiKhoan.type === "maxLength" && (
                            <p>Vui lòng nhập ít hơn 30 ký tự</p>
                          )}
                      </div>
                    </div>
                    <div className="input-wrapper">
                      <div className="input-wrapper-item mb-3">
                        <input
                          name="dangNhapMatKhau"
                          type="password"
                          className="form__input"
                          placeholder="********"
                          ref={register({ required: true, minLength: 8 })}
                        />
                        <label htmlFor="adminPassword" className="form__label">
                          Mật khẩu
                        </label>
                      </div>
                      <div className="error-input">
                        {errors.dangNhapMatKhau &&
                          errors.dangNhapMatKhau.type === "required" && (
                            <p>Vui lòng nhập mật khẩu của bạn</p>
                          )}
                        {errors.dangNhapMatKhau &&
                          errors.dangNhapMatKhau.type === "minLength" && (
                            <p>Vui lòng nhập tối thiểu 8 ký tự</p>
                          )}
                      </div>
                    </div>
                  </div>
                  <p className="float-end">
                    <Link
                      to="/forgot-password"
                      className="text-decoration-none"
                      style={{ fontSize: "13px" }}
                    >
                      Quên mật khẩu
                    </Link>
                  </p>
                  <div>
                    <Button
                      className="btn form-control"
                      type="primary"
                      htmlType="submit"
                      size="large"
                    >
                      Đăng nhập
                    </Button>
                  </div>
                </form>
                <p className="pt-3">
                  Bạn chưa có tài khoản?{" "}
                  <Link to="/sign-up" className="text-decoration-none">
                    Đăng ký
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
