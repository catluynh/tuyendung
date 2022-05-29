import recruitmentApi from "../../../services/recruitmentApi";

class JobServices {
  static async loadAllApiData() {
    const listRecruitment = await recruitmentApi.getListRecruitment()
    return {
        listRecruitment,
    }
  }
}


export default JobServices;
