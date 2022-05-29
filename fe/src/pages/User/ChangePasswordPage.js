import { Button, Layout } from "antd";
import React, { useRef } from "react";
import Helmet from "react-helmet";
import { useForm } from "react-hook-form";
import { AiOutlineCheck } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../../redux/actions/authActions";
import authService from "../../services/authService";
import MainNavigation from "../../components/Layout/MainNavigation";
import { Content } from "antd/lib/layout/layout";
import FooterHome from "../../components/Footer/FooterHome";

const ChangePasswordPage = (props) => {
  const { register, watch, errors, handleSubmit } = useForm({});
  const dispatch = useDispatch();
  const history = useHistory();
  const password = useRef({});
  password.current = watch("newPassword", "");
  const currentUser = useSelector((state) => state.userLogin);
  console.log("currentUser:::", currentUser);
  console.log("props:::", props);
  const onSubmit = async (data) => {
    const payload = {
      matKhauHienTai: data?.oldPassword?.trim(),
      matKhau: data?.newPassword?.trim(),
      xacNhanMatKhau: data?.newConfirmPassword?.trim(),
    };
    try {
      await authService.changePasword(
        payload.matKhauHienTai,
        payload.matKhau,
        payload.xacNhanMatKhau
      );
      toast.success("Thay đổi mật khẩu thành công", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      history.replace("/");
    } catch (err) {
      const errors = err.response.data.message.split("-");
      errors.forEach((err) =>
        toast.error(err, {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      );
    }
  };
  const logoutHandler = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Đăng xuất thành công", {
      position: "bottom-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    history.push("/login");
  };
  return (
    <>
      {" "}
      <Helmet>
        <title>Setting account | jobboard.com</title>
      </Helmet>
      <MainNavigation />
      <Layout>
        <div className="container pt-5 bottom-footer">
          <div className="mt-65">
            <Content>
              <div className="bg-white px-2 pt-1">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row my-4">
                    <div className="col-2"></div>
                    <div className="col-8">
                      <div className="row ">
                        <div className="col-12">
                          <div className="pb-4 mb-2">
                            <h5>
                              <b style={{ fontSize: "18px" }}>
                                Thay đổi mật khẩu
                              </b>
                            </h5>
                          </div>
                        </div>
                        {/* Mật khẩu cũ */}
                        <div className="col-4">
                          <p>
                            <b>Mật khẩu cũ</b>
                          </p>
                        </div>
                        <div className="col-8">
                          <div className="input-wrapper">
                            <div
                              className="input-wrapper-item mb-3"
                              style={{ width: "100%" }}
                            >
                              <input
                                name="oldPassword"
                                type="password"
                                className="form__input"
                                placeholder="Mật khẩu hiện tại"
                                ref={register({ required: true, minLength: 8 })}
                              />
                            </div>
                            <div className="error-input">
                              {errors.oldPassword &&
                                errors.oldPassword.type === "required" && (
                                  <p>Vui lòng nhập mật khẩu hiện tại của bạn</p>
                                )}
                              {errors.oldPassword &&
                                errors.oldPassword.type === "minLength" && (
                                  <p>Vui lòng nhập tối thiểu 8 ký tự</p>
                                )}
                            </div>
                          </div>
                        </div>
                        {/* Mật khẩu mới của bạn */}
                        <div className="col-4">
                          <p>
                            <b>Mật khẩu mới</b>
                          </p>
                        </div>
                        <div className="col-8">
                          <div className="input-wrapper">
                            <div
                              className="input-wrapper-item mb-3"
                              style={{ width: "100%" }}
                            >
                              <input
                                name="newPassword"
                                type="password"
                                className="form__input"
                                placeholder="Mật khẩu mới của bạn"
                                ref={register({ required: true, minLength: 8 })}
                              />
                            </div>
                            <div className="error-input">
                              {errors.newPassword &&
                                errors.newPassword.type === "required" && (
                                  <p>Vui lòng nhập mật khẩu mới của bạn</p>
                                )}
                              {errors.newPassword &&
                                errors.newPassword.type === "minLength" && (
                                  <p>Vui lòng nhập tối thiểu 8 ký tự</p>
                                )}
                            </div>
                          </div>
                        </div>
                        {/* Nhập lại mật khẩu mới */}
                        <div className="col-4">
                          <p>
                            <b>Nhập lại mật khẩu mới</b>
                          </p>
                        </div>
                        <div className="col-8">
                          <div className="input-wrapper">
                            <div
                              className="input-wrapper-item mb-3"
                              style={{ width: "100%" }}
                            >
                              <input
                                name="newConfirmPassword"
                                type="password"
                                className="form__input"
                                placeholder="Nhập lại mật khẩu mới"
                                ref={register({
                                  required: true,
                                  minLength: 8,
                                  validate: (value) =>
                                    value === password.current ||
                                    "Mật khẩu nhập lại không chính xác",
                                })}
                              />
                            </div>
                            <div className="error-input">
                              {errors.newConfirmPassword &&
                                errors.newConfirmPassword.type ===
                                  "required" && (
                                  <p>Vui lòng nhập lại mật khẩu mới của bạn</p>
                                )}
                              {errors.newConfirmPassword &&
                                errors.newConfirmPassword.type ===
                                  "minLength" && (
                                  <p>Vui lòng nhập tối thiểu 8 ký tự</p>
                                )}
                              {errors.newConfirmPassword && (
                                <p>{errors.newConfirmPassword.message}</p>
                              )}
                            </div>
                          </div>
                        </div>{" "}
                        <div className="col-4"></div>
                        <div className="col-4" style={{ fontSize: "14px" }}>
                          <Button
                            className="btn form-control"
                            type="primary"
                            htmlType="submit"
                            size="large"
                          >
                            <AiOutlineCheck size={14} /> &nbsp; Cập nhật mật
                            khẩu
                          </Button>
                        </div>
                        <div className="col-4"></div>
                      </div>
                    </div>
                    <div className="col-2"></div>
                  </div>
                </form>
                <div className="row mt-4 text-center">
                  <div className="col-2"></div>
                  <div className="col-8">
                    <p>Bạn quên mật khẩu cũ?</p>
                    <p>
                      Vui lòng{" "}
                      <a onClick={logoutHandler}>
                        <u style={{ color: "blue" }}>đăng xuất tài khoản</u>
                      </a>{" "}
                      sau đó sử dụng chức năng quên mật khẩu của hệ thống.
                    </p>
                  </div>
                  <div className="col-2"></div>
                </div>
              </div>
            </Content>
          </div>
        </div>
      </Layout>
      <FooterHome />
    </>
  );
};

ChangePasswordPage.propTypes = {};

export default ChangePasswordPage;
