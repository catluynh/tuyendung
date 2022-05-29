import axiosClient from "./axiosClient";

const AppliedJobApi = {
  getListAppliedJob: () => {
    const url = `/donUngTuyens/timKiemTheoUngTuyenVien`;
    return axiosClient.get(url);
  },
};

export default AppliedJobApi;
