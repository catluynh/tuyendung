import axiosClient from "./axiosClient";

const FieldCompanyApi = {
  getListFieldsCompany: () => {
    const url = `/linhVucs`;
    return axiosClient.get(url);
  },
};

export default FieldCompanyApi;
