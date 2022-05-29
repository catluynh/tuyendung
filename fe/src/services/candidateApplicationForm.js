import axiosClient from "./axiosClient";

const CandidateApplicationForm = {
  createApplicationForm: ({
    ungTuyenVien,
    tinTuyenDung,
    guiEmail,
    thongTinLienHe,
  }) => {
    const url = `/donUngTuyens`;
    return axiosClient.post(url, {
      ungTuyenVien,
      tinTuyenDung,
      guiEmail,
      thongTinLienHe,
    });
  },
};

export default CandidateApplicationForm;
