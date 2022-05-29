import axiosClient from "./axiosClient";

const RecruitmentApplicantApi = {
  createRecruitmentApplicant: (data) => {
    console.log(
      "🚀 ~ file: recruitmentApplicant.js ~ line 5 ~ createRecruitmentApplicant",
      data
    );
    const url = `/ungtuyenviens`;
    return axiosClient.post(url, {
      loiGioiThieu: data.loiGioiThieu,
      taiKhoan: data.taiKhoan,
    });
  },
  updateRecruitmentApplicant: ({ loiGioiThieu, taiKhoan }) => {
    console.log(
      "🚀 ~ file: recruitmentApplicant.js ~ line 5 ~ updateRecruitmentApplicant",
      loiGioiThieu,
      taiKhoan
    );
    const url = `/ungtuyenviens/${taiKhoan}`;
    return axiosClient.patch(url, {
      loiGioiThieu,
    });
  },
  getRecruitmentApplicantById: (id) => {
    const url = `/ungtuyenviens/${id}`;
    return axiosClient.get(url);
  },
};

export default RecruitmentApplicantApi;
