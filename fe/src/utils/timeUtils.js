import moment from "moment";
export default class TimeUtils {
  static formatDateTime(data, typeFormat = "DD/MM/YYYY HH:mm") {
    return moment(data).format(typeFormat);
  }
}
