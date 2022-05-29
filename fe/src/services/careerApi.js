import axiosClient from "./axiosClient";

const CareerApi = {
  getListCareer: () => {
    const url = `/nganhNghes`;
    return axiosClient.get(url);
  },
  getListCareerTrends: () => {
    const url = `/nganhNghes/xuHuongNganhNghe`;
    return axiosClient.get(url);
  },
};

export default CareerApi;
