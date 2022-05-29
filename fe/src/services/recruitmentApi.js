import axiosClient from "./axiosClient";

const RecruitmentApi = {
  getListRecruitment: () => {
    const url = `/tinTuyenDungs`;
    return axiosClient.get(url);
  },
  getListRecruitmentApproved: (params) => {
    console.log("[Vinh]", params);
    const url = `/tinTuyenDungs/timKiemTheoNhieuTieuChi?${params}`;
    return axiosClient.get(url);
  },
  getListRecruitmentFilterParams: (params) => {
    console.log("params api", params);
    const url = `/tinTuyenDungs/timKiemTheoNhieuTieuChi`;
    return axiosClient.get(url, { params });
  },

  getListTopNewsRecruitments: () => {
    const url = `/tinTuyenDungs/tinNoiBat`;
    return axiosClient.get(url);
  },
  getRecruitmentById: (id) => {
    const url = `/tinTuyenDungs/${id}`;
    return axiosClient.get(url);
  },
  getRecruitmentByIdAndStatus: (id, idUtv) => {
    const url = `/tinTuyenDungs/getByIdTrangThai/${id}?idUtv=${idUtv}`;
    return axiosClient.get(url);
  },
  getListProfileByRecruitment: (params) => {
    const url = `/donUngTuyens/timKiemTheoTinTuyenDung/${params.id}?${params.paramsString}`;
    return axiosClient.get(url);
  },
  getListProfile: (params) => {
    const url = `/donUngTuyens/timKiemTheoNhaTuyenDung1?${params}`;
    return axiosClient.get(url);
  },
  getListProfileTalent: (params) => {
    const url = `/donUngTuyens/donUngTuyenTiemNang?${params}`;
    return axiosClient.get(url);
  },
  getListRecruitmentByEmployer: () => {
    const url = `/tinTuyenDungs/timKiemTheoNhaTuyenDung`;
    return axiosClient.get(url);
  },
  getListRecruitmentByEmployerFilterParams: (params) => {
    const url = `/tinTuyenDungs/timKiemTheoNhaTuyenDung`;
    return axiosClient.get(url, { params });
  },
  updateRecruitmentStopById: (id) => {
    const url = `tinTuyenDungs/dungTuyen/${id}`;
    return axiosClient.patch(url);
  },
};

export default RecruitmentApi;
