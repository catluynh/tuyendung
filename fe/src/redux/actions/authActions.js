import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
} from "../constants/authConstants";
import "react-toastify/dist/ReactToastify.css";
import authService from "../../services/authService";
import { toast } from "react-toastify";
import axios from "axios";

export const login = (payload) => async (dispatch) => {
  console.log(payload);
  const { tenDangNhap, matKhau } = payload;
  dispatch({ type: USER_LOGIN_REQUEST });
  try {
    const response = await authService.logIn(tenDangNhap, matKhau);
    localStorage.setItem("user", JSON.stringify(response));
    localStorage.setItem("token", JSON.stringify(response.token));
    dispatch({ type: USER_LOGIN_SUCCESS, payload: response });
    toast.success("Đăng nhập thành công", {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data.message, {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response.data,
    });
  }
};
// export const registerUser = (payload) => async (dispatch) => {
//   const { tenDangNhap, email, matKhau, xacNhanMatKhau, loaiTaiKhoan } = payload;
//   dispatch({
//     type: USER_REGISTER_REQUEST,
//   });
//   try {
//     const response = await authService.registerUser(
//       tenDangNhap,
//       email,
//       matKhau,
//       xacNhanMatKhau,
//       loaiTaiKhoan
//     );
//     dispatch({ type: USER_REGISTER_SUCCESS, payload: response });
//     localStorage.setItem("token", response.token);
//     localStorage.setItem("user", JSON.stringify(response));
//     toast.success("Đăng ký thành công", {
//       position: "top-right",
//       autoClose: 2000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//     });
//   } catch (error) {
//     console.log(error.response?.data.message);

//     toast.error(error.response?.data.message, {
//       position: "top-right",
//       autoClose: 2000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//     });
//     dispatch({
//       type: USER_REGISTER_FAIL,
//       payload: error.response.data,
//     });
//   }
// };
export const logout = () => (dispatch) => {
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: USER_LOGOUT });
};
