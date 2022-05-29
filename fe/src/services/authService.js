import axiosClient from "./axiosClient";

const authService = {
  logIn: (tenDangNhap, matKhau) => {
    const url = "/auth/dangnhap";
    return axiosClient.post(url, { tenDangNhap, matKhau });
  },
  registerUser: (tenDangNhap, email, matKhau, xacNhanMatKhau, loaiTaiKhoan) => {
    const url = "/auth/dangki";
    return axiosClient.post(url, {
      tenDangNhap,
      email,
      matKhau,
      xacNhanMatKhau,
      loaiTaiKhoan,
    });
  },
  logout: () => {
    return localStorage.removeItem("user");
  },
  forgotPasword: (email) => {
    const url = "/auth/quenmatkhau";
    return axiosClient.post(url, {
      email,
    });
  },
  resetPasword: (password, confirmPassword, token) => {
    const url = `/auth/datlaiMatKhau/${token}`;
    return axiosClient.patch(url, {
      matKhau: password,
      xacNhanMatKhau: confirmPassword,
    });
  },
  changePasword: (matKhauHienTai, matKhau, xacNhanMatKhau) => {
    const url = `/auth/doimatkhau`;
    return axiosClient.patch(url, {
      matKhauHienTai,
      matKhau,
      xacNhanMatKhau,
    });
  },
};

export default authService;
