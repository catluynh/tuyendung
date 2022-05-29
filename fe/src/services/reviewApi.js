import axiosClient from "./axiosClient";

const ReviewApi = {
  getReviewById: (id) => {
    const url = `/danhGias/danhGiaTheoTin/${id}`;
    return axiosClient.get(url);
  },
  getReviewFilterById: (id, param) => {
    console.log("param", param);
    console.log("id", id);
    const url = `/danhGias/danhGiaTheoTin/${id}?${param}`;
    return axiosClient.get(url);
  },
  creareReview: (payload) => {
    console.log("payload api", payload);
    const url = `/danhGias`;
    return axiosClient.post(url, payload);
  },
};

export default ReviewApi;
