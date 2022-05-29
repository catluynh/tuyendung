import { Button } from "antd";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../../services/authService";
import { ForgotPasswordSuccess } from "./components/ForgotPasswordSuccess";

export const FogotPasswordPage = () => {
  const { register, errors, handleSubmit } = useForm({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const onSubmit = async (data) => {
    const payload = {
      email: data.emailForgotPassword?.trim(),
    };
    const { email } = payload;
    console.log(email);
    setEmail(email);
    await authService
      .forgotPasword(email)
      .then((data) => {
        setIsSuccess(true);
        console.log("Thanh cong");
        toast.info(data?.message, {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        setIsSuccess(false);
        toast.error("Email không tồn tại", {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };
  return (
    <>
      <Helmet>
        <title>Quên mật khẩu | jobboard.com</title>
      </Helmet>
      {!isSuccess && (
        <div className="container mt-5">
          <div className="row mt-5">
            <div className="col-12 mt-5">
              <div className="d-flex justify-content-center py-4 mt-5">
                <div className="bg-login center-screen">
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
                    <div className="py-2 text-center">
                      <h3>Bạn quên mật khẩu?</h3>
                    </div>
                    <div>
                      <p>
                        Đừng lo, chúng tôi sẽ gửi cho bạn một tin nhắn giúp bạn
                        đặt lại mật khẩu qua email đăng ký tài khoản.
                      </p>
                    </div>
                    <div className="admin-modal-content">
                      <div className="input-wrapper">
                        <div
                          className="input-wrapper-item mb-3"
                          style={{ width: "100%" }}
                        >
                          <input
                            name="emailForgotPassword"
                            type="email"
                            className="form__input"
                            placeholder="Email"
                            ref={register({
                              required: true,
                              pattern: /^\S+@\S+$/i,
                            })}
                          />
                          <label
                            htmlFor="emailRegister"
                            className="form__label"
                          >
                            Email
                          </label>
                        </div>
                        <div className="error-input">
                          {errors.emailForgotPassword &&
                            errors.emailForgotPassword.type === "required" && (
                              <p>Vui lòng nhập email của bạn</p>
                            )}
                          {errors.emailForgotPassword &&
                            errors.emailForgotPassword.type === "pattern" && (
                              <p>Vui lòng nhập email hợp lệ</p>
                            )}
                        </div>
                        <p>
                          Bằng việc thực hiện đổi mật khẩu, bạn đã đồng ý với{" "}
                          <a className="text-decoration-none">
                            Điều khoản dịch vụ
                          </a>{" "}
                          và{" "}
                          <a className="text-decoration-none">
                            Chính sách bảo mật của chúng tôi
                          </a>
                        </p>
                      </div>
                    </div>

                    <div>
                      <Button
                        className="btn form-control"
                        type="primary"
                        htmlType="submit"
                        size="large"
                      >
                        Đổi mật khẩu
                      </Button>
                    </div>
                  </form>
                  <p className="pt-3 text-center">
                    Bạn sử dụng jobboard.com lần đâu?{" "}
                    <Link to="/sign-up" className="text-decoration-none">
                      Hãy đăng ký
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSuccess && <ForgotPasswordSuccess email={email} />}
    </>
  );
};
