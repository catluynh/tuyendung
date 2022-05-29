import axiosClient from "./axiosClient";

const profileApi = {
  createStudy: (payload) => {
    const url = `/ungtuyenviens/themHocVan`;
    return axiosClient.patch(url, payload);
  },
  deleteStudy: (id) => {
    const url = `/ungtuyenviens/xoaHocVan`;
    return axiosClient.patch(url, id);
  },
  updateStudy: (payload) => {
    const url = `/ungtuyenviens/capNhatHocVan`;
    return axiosClient.patch(url, payload);
  },
  createExperience: (payload) => {
    const url = `/ungtuyenviens/themKinhNghiemLamViec`;
    return axiosClient.patch(url, payload);
  },
  deleteExperience: (id) => {
    const url = `/ungtuyenviens/xoaKinhNghiemLamViec`;
    return axiosClient.patch(url, id);
  },
  updateExperience: (payload) => {
    const url = `/ungtuyenviens/capNhatKinhNghiemLamViec`;
    return axiosClient.patch(url, payload);
  },
  createSkill: (payload) => {
    console.log("api: ", payload);
    const url = `/ungtuyenviens/themKyNang`;
    return axiosClient.patch(url, payload);
  },
  deleteSkill: (id) => {
    const url = `/ungtuyenviens/xoaKyNang`;
    return axiosClient.patch(url, id);
  },
  updateSkill: (payload) => {
    const url = `/ungtuyenviens/capNhatKyNang`;
    return axiosClient.patch(url, payload);
  },
  updateCertificated: (payload) => {
    const url = `/ungtuyenviens/capNhatChungChi`;
    return axiosClient.patch(url, payload);
  },
  createCertificated: (payload) => {
    const url = `/ungtuyenviens/themChungChi`;
    return axiosClient.patch(url, payload);
  },
  deleteCertificated: (id) => {
    const url = `/ungtuyenviens/xoaChungChi`;
    return axiosClient.patch(url, id);
  },
  updateUngTuyenVien: (payload) => {
    const url = `/ungtuyenviens/${payload.taiKhoan}`;
    return axiosClient.patch(url, payload);
  },
  getUngTuyenVien: (userId) => {
    const url = `/ungtuyenviens/${userId}`;
    return axiosClient.get(url);
  },
};

export default profileApi;
