import axiosClient from "./axiosClient";

const portfolioApi = {
  getAccountById: (userId) => {
    const url = `/taiKhoans/${userId}`;
    return axiosClient.get(url);
  },
  updateAccountById: (userId, payload) => {
    const url = `/taiKhoans/${userId}`;
    return axiosClient.patch(url, { ...payload, email: payload.updateEmail });
  },
};

export default portfolioApi;
