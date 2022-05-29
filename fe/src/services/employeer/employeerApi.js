import axiosClient from "../axiosClient";

const EmployeerApi = {
  getListCity: () => {
    const url = `https://provinces.open-api.vn/api/?depth=2`;
    return axiosClient.get(url);
  },
  createRecruitment: (payload) => {
    console.log("payload", payload);
    const url = `/tinTuyenDungs`;
    return axiosClient.post(url, payload);
  },
};

export default EmployeerApi;
