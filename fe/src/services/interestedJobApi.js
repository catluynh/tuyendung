import axiosClient from "./axiosClient";

const InterestedJobApi = {
  creatInterestedJob: ({ tinTuyenDung }) => {
    console.log("tinTuyenDung", tinTuyenDung);
    const url = `/tinTuyenDungs/luuTinTuyenDung/${tinTuyenDung}`;
    return axiosClient.patch(url);
  },
  dropInterestedJob: ({ tinTuyenDung }) => {
    console.log("tinTuyenDung", tinTuyenDung);
    const url = `/tinTuyenDungs/huyLuuTinTuyenDung/${tinTuyenDung}`;
    return axiosClient.patch(url);
  },
  getListInterestedJob: () => {
    const url = `/tinTuyenDungs/tinTuyenDungDaLuu`;
    return axiosClient.get(url);
  },
};

export default InterestedJobApi;
