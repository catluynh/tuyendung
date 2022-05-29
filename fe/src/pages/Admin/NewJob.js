import {
  Breadcrumb,
  Button,
  DatePicker,
  Input,
  InputNumber,
  Layout,
  Menu,
  Select,
  Tabs,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import axios from "axios";
import queryString from "query-string";
import React, { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { FaAngleDoubleRight } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useCommonContext } from "../../components/Search/context/commonContext";
import EmployeerApi from "../../services/employeer/employeerApi";
import TimeUtils from "../../utils/timeUtils";
import NavbarAdmin from "./components/navbar/NavbarAdmin";
import PreviewJobInfomation from "./components/previewJobInfomation";

const { Option } = Select;
const OPTIONS = ["Quận 1", "Quận 2", "Quận 3", "Quận 4"];
const { TabPane } = Tabs;
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const NewJob = () => {
  const history = useHistory();
  const [selectedItems, setSelectedItems] = useState([]);
  const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));
  const [isHideForm1, setIsHideForm1] = useState(false);
  const [isHideForm2, setIsHideForm2] = useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [placeWorks, setPLaceWorks] = useState([]);
  const [title, setTitle] = useState("");
  const [salary, setSalary] = useState();
  const { listCareers, levels, typeWorks, experiences } = useCommonContext();
  const [city, setCity] = useState(1);
  const [career, setCareer] = useState("");
  const [level, setLevel] = useState("");
  const [numberOfRecruits, setNumberOfRecruits] = useState(0);
  const [typeJob, setTypeJob] = useState("");
  const [salaryF, setSalaryF] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [districts, setDistricts] = useState([]);
  const [desJob, setDesJob] = useState("");
  const [isShowPreviewForm, setIsShowPreviewForm] = useState(false);
  const [districtName, setDistrictName] = useState("");
  const [trongKhoang, setTrongKhoang] = useState("");

  // const [salary, setSalary] = useState(1);
  const [experience, setExperience] = useState("");
  const [degree, setDegree] = useState("");
  const [gender, setGender] = useState("");
  const [ageTo, setAgeTo] = useState();
  const [ageFrom, setAgeFrom] = useState();
  const [desDesReq, setDesReq] = useState("");
  const [expirationDate, setExpirationDate] = useState();
  const [quyenLoi, setQuyenLoi] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [dataJobs, setDataJobs] = useState({});

  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
  });
  const paramsString = queryString.stringify(filters);
  console.log("paramsString", paramsString);
  const onHandleHideForm1 = () => {
    console.log(isHideForm1);
    setIsHideForm1(true);
    setIsHideForm2(false);
  };
  const onHandleShowForm1 = () => {
    console.log(isHideForm1);
    setIsHideForm1(false);
  };

  const [nameCity, setNameCity] = useState("");
  const getDataListDistrict = async () => {
    const requestUrl = `https://provinces.open-api.vn/api/p/${city}?depth=2`;
    try {
      const response = await axios.get(requestUrl);
      console.log("response getDataListDistric", response);
      setNameCity(response?.data.name);
      setDistricts(response);
    } catch (error) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    getDataListDistrict();
  }, [city]);

  // useEffect(() => {
  //   getDataListDistrict();
  // }, []);

  useEffect(() => {
    let mounted = true;
    const getDataListLocation = async () => {
      const requestUrl = `https://provinces.open-api.vn/api/?depth=2`;
      try {
        const response = await axios.get(requestUrl);
        setPLaceWorks(response.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    if (mounted) {
      getDataListLocation();
    }
    return () => {
      mounted = false;
      setPLaceWorks([]);
    };
  }, []);
  const [mucLuong, setMucLuong] = useState();
  const previewFormSave = async () => {
    const payload = {
      tieuDe: title,
      viTri: level,
      soLuongTuyen: numberOfRecruits,
      loaiCongViec: typeJob,
      mucLuong: trongKhoang ? salaryF + " - " + salaryMax + " triệu" : mucLuong,

      moTa: desJob,
      soNamKinhNghiem: experience,
      bangCap: degree,
      gioiTinh: gender,
      ngayHetHan: TimeUtils.formatDateTime(expirationDate, "YYYY-MM-DD"),
      yeuCau: desDesReq,
      phucLoi: quyenLoi,

      tuoiTu: ageFrom,
      denTuoi: ageTo,
      nganhNghe: career,
      diaDiem: {
        tinhThanhPho: districtName.split("-")[1],
        quanHuyen: districtName.split("-")[0],
      },
      lienHe: {
        ten: contact,
        sdt: phone,
        email,
      },
    };
    setDataJobs(payload);
    console.log("payload", payload);
    setIsPreview(true);
  };
  const handleClosePreview = () => {
    setIsPreview(false);
  };
  const onCreateNewJob = async (payload) => {
    console.log("payload onSubmit", payload);
    try {
      const response = await EmployeerApi.createRecruitment(payload).then(
        (res) => {
          if (res?.status == "success") {
            toast.success("Đăng tin tuyển dụng thành công", {
              position: "bottom-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            history.push("/employer/dashboard");
          }
        }
      );
      console.log("response", response);
    } catch (error) {
      console.log(error);
      toast.error(error.response);
      console.log(error.response);
    }
  };
  return (
    <Fragment>
      <Helmet>
        <title>[Employer] - Tạo mới tin tuyển dụng</title>
      </Helmet>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <NavbarAdmin />
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{
              padding: 0,
            }}
          />
          <Content
            style={{
              margin: "0 16px",
            }}
          >
            <Breadcrumb
              style={{
                margin: "16px 0",
              }}
            >
              <Breadcrumb.Item>Tổng quan</Breadcrumb.Item>
              <Breadcrumb.Item>Thêm mới tin</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background bg-white"
              style={{
                padding: 24,
                minHeight: 560,
              }}
            >
              {isPreview && (
                <>
                  <PreviewJobInfomation
                    detail={dataJobs}
                    closePreview={handleClosePreview}
                    onSubmit={onCreateNewJob}
                  />
                </>
              )}
              {!isPreview && (
                <>
                  {/* Tiêu đề tin tuyển dụng */}
                  <div>
                    <div className="row text-center">
                      <div className="col-12 border-bottom mb-2 bg-title">
                        <h4>
                          <strong>Tiêu đề tuyển dụng</strong>
                        </h4>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-2 my-2"></div>
                      <div className="col-8 my-2">
                        <p>
                          <strong>
                            Tiêu đề tuyển dụng
                            <span className="text-danger ps-1">*</span>
                          </strong>
                        </p>
                        <p>
                          <Input
                            placeholder="Ví dụ tuyển nhân viên kinh doanh"
                            size="large"
                            value={title}
                            onChange={(e) => {
                              console.log("eeeeee", e.target.value);
                              setTitle(e.target.value);
                            }}
                          />
                        </p>
                      </div>
                      <div className="col-2 my-2"></div>
                      <div className="col-2 my-2"></div>
                      <div className="col-8 my-2 bg-black">
                        <div className="bg-secondary px-2 py-3 rounded text-white">
                          <p className="text-underline">
                            <strong>Ví dụ:</strong> Tuyển nhân viên kinh doanh
                            không yêu cầu kinh nghiệm
                          </p>
                          <p className="text-underline">
                            <strong>Nên:</strong>{" "}
                            <ul>
                              <li>Viết tiếng việt có dấu</li>
                              <li>
                                Đề các chức danh, vi trí cần tuyển, số lương cần
                                tuyển
                              </li>
                            </ul>
                          </p>
                          <p className="text-underline">
                            <strong> Không nên:</strong>
                          </p>
                          <ul>
                            <li>Không để số điện thoại</li>
                            <li>Không để tên công ty</li>
                            <li>Không để email</li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-2 my-2 text-white"></div>
                    </div>
                  </div>

                  {/* Thông tin công việc */}
                  {/* <FormPostNew2 cities={placeWorks} /> */}
                  <>
                    <div className="row text-center">
                      <div className="col-12 border-bottom mb-2 mt-3 bg-title">
                        <h4>
                          <strong>Thông tin công việc</strong>
                        </h4>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6 my-2">
                        <p>
                          <strong>
                            Tỉnh/Thành phố
                            <span className="text-danger ps-1">*</span>
                          </strong>
                        </p>
                        <p>
                          <Select
                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Chọn nơi làm việc"
                            optionFilterProp="children"
                            onChange={(e) => {
                              setCity(e);
                            }}
                            onSearch={(value) => {
                              console.log("value onsearch", value);
                            }}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            size="large"
                          >
                            {placeWorks.map((city, index) => {
                              return (
                                <Fragment key={index}>
                                  <Option value={city?.code}>
                                    {city?.name}
                                  </Option>
                                </Fragment>
                              );
                            })}
                          </Select>
                        </p>
                      </div>
                      <div className="col-6 my-2">
                        <p>
                          <strong>
                            Quận/Huyện
                            <span className="text-danger ps-1">*</span>
                          </strong>
                        </p>
                        <p>
                          <Select
                            size="large"
                            // mode="multiple"
                            placeholder="Quận/Huyện"
                            onChange={(value) => {
                              setDistrictName(value);
                            }}
                            style={{ width: "100%" }}
                          >
                            {districts?.data?.districts &&
                              districts?.data?.districts.map((item, index) => (
                                <Select.Option
                                  key={index}
                                  value={
                                    item?.name + "-" + districts?.data?.name
                                  }
                                >
                                  {item?.name}
                                </Select.Option>
                              ))}
                          </Select>
                          {/* <Input
                  placeholder="123 đường ABC, Quận 1"
                  size="large"
                  value={district}
                  onChange={(e) => {
                    console.log("eeeeee", e.target.value);
                    setDistricts(e.target.value);
                  }}
                /> */}
                        </p>
                      </div>
                      <div className="col-6 my-2">
                        <p>
                          <strong>
                            Ngành nghề
                            <span className="text-danger ps-1">*</span>
                          </strong>
                        </p>
                        <p>
                          <Select
                            size="large"
                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Chọn ngành nghề"
                            optionFilterProp="children"
                            onChange={(value) => {
                              console.log("value onchange", value);
                              setCareer(value);
                            }}
                            onSearch={(value) => {
                              console.log("value onsearch", value);
                            }}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {listCareers.map((item, index) => (
                              <Option key={index} value={item._id}>
                                {item.tenNganhNghe}
                              </Option>
                            ))}
                          </Select>
                        </p>
                      </div>
                      <div className="col-6 my-2">
                        <p>
                          <strong>
                            Cấp bậc<span className="text-danger ps-1">*</span>
                          </strong>
                        </p>
                        <p>
                          <Select
                            size="large"
                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Chọn cấp bậc"
                            optionFilterProp="children"
                            onChange={(value) => {
                              console.log("value onchange", value);
                              setLevel(value);
                            }}
                            onSearch={(value) => {
                              console.log("value onsearch", value);
                            }}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {levels.map((level, index) => {
                              return (
                                <Option key={index} value={level.capBac}>
                                  {level.capBac}
                                </Option>
                              );
                            })}
                          </Select>
                        </p>
                      </div>
                    </div>
                    {/* 1. */}
                    <div className="row">
                      <div className="col-6 my-2">
                        <p>
                          <strong>
                            Số lượng tuyển
                            <span className="text-danger ps-1">*</span>
                          </strong>
                        </p>
                        <p>
                          <InputNumber
                            style={{ width: "100%" }}
                            min={1}
                            max={999}
                            defaultValue={1}
                            placeholder="123"
                            size="large"
                            onChange={(value) => {
                              console.log("so luong tuyen", value);
                              setNumberOfRecruits(value);
                            }}
                          />
                        </p>
                      </div>
                      <div className="col-6 my-2">
                        <p>
                          <strong>
                            Loại việc làm
                            <span className="text-danger ps-1">*</span>
                          </strong>
                        </p>
                        <p>
                          <Select
                            size="large"
                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Chọn loại hình công việc"
                            optionFilterProp="children"
                            onChange={(value) => {
                              console.log("value onchange", value);
                              console.log("type job", value);
                              setTypeJob(value);
                            }}
                            onSearch={(value) => {
                              console.log("value onsearch", value);
                            }}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {typeWorks.map((typeWork, index) => {
                              return (
                                <Option
                                  key={index}
                                  value={typeWork.loaiCongViec}
                                >
                                  {typeWork.loaiCongViec}
                                </Option>
                              );
                            })}
                          </Select>
                        </p>
                      </div>
                    </div>
                    {/* 2 */}
                    <div className="row">
                      <div className="col-3">
                        <p>
                          <strong>
                            Mức lương<span className="text-danger ps-1">*</span>
                          </strong>
                        </p>
                        <Select
                          size="large"
                          style={{ width: "100%" }}
                          defaultValue="Thỏa thuận"
                          onChange={(e) => {
                            console.log("E", e);
                            if (e == 1) {
                              console.log("Thỏa thuận");
                              setSalary(e);
                              setMucLuong("Thỏa thuận");
                            } else if (e == 0) {
                              console.log("co dinh");
                              setSalary(e);
                            } else {
                              console.log("trong khoang");
                              setSalary(e);
                            }
                          }}
                        >
                          <Option value="1">Thỏa thuận</Option>
                          <Option value="0">Cố định</Option>
                          <Option value="-1">Trong khoảng</Option>
                        </Select>
                      </div>
                      {salary == 1 && (
                        <div className="col-9">
                          <p>
                            <strong>Hiển thị</strong>
                          </p>
                          <Input
                            size="large"
                            style={{ width: "100%" }}
                            defaultValue="Thỏa thuận"
                            placeholder="Thỏa thuận"
                            disabled
                          />
                        </div>
                      )}
                      {salary == 0 && (
                        <>
                          <div className={`col-3`}>
                            <p>
                              <strong>
                                Tối thiểu
                                <span className="text-danger ps-1">*</span>
                              </strong>
                            </p>
                            <Input
                              size="large"
                              addonAfter="triệu"
                              onChange={(e) => {
                                console.log("toi thieu", e.target.value);
                                setMucLuong(e.target.value + " triệu");
                              }}
                            />
                          </div>
                          <div className="col-6">
                            <p>
                              <strong>Hiển thị</strong>
                            </p>
                            <Input size="large" value={mucLuong} disabled />
                          </div>
                        </>
                      )}
                      {salary == -1 && (
                        <>
                          <div className="col-3">
                            <p>
                              <strong>
                                Tối thiểu
                                <span className="text-danger ps-1">*</span>
                              </strong>
                            </p>
                            <Input
                              size="large"
                              addonAfter="triệu"
                              onChange={(e) => {
                                console.log("toi thieu 2", e.target.value);
                                setSalaryF(e.target.value);
                                setTrongKhoang(true);
                              }}
                            />
                          </div>
                          <div className="col-3">
                            <p>
                              <strong>
                                Tối đa
                                <span className="text-danger ps-1">*</span>
                              </strong>
                            </p>
                            <Input
                              size="large"
                              addonAfter="triệu"
                              onChange={(e) => {
                                console.log("toi da 2", e.target.value);
                                setSalaryMax(e.target.value);
                                setTrongKhoang(true);
                              }}
                            />
                          </div>
                          <div className="col-3">
                            <p>
                              <strong>Hiển thị</strong>
                            </p>
                            <Input
                              size="large"
                              addonAfter="triệu"
                              style={{ width: "100%" }}
                              placeholder="Thỏa thuận"
                              value={`${salaryF} - ${salaryMax}`}
                              disabled
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </>
                  {/* Mô tả công việc */}
                  {/* <FormPostNew3 /> */}
                  <div>
                    <div className="row text-center">
                      <div className="col-12 border-bottom mb-2 mt-3 bg-title">
                        <h4>
                          <strong>Mô tả công việc</strong>
                        </h4>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-2 my-2"></div>
                      <div className="col-8 my-2">
                        <p>
                          <strong>
                            Mô tả công việc
                            <span className="text-danger ps-1">*</span>
                          </strong>
                        </p>
                        <p>
                          <TextArea
                            rows={8}
                            placeholder=""
                            maxLength={1000}
                            onChange={(value) => {
                              console.log(
                                "Mo ta cong viec",
                                value.target.value
                              );
                              setDesJob(value.target.value);
                            }}
                          />
                        </p>
                      </div>
                      <div className="col-2 my-2"></div>
                      <div className="col-2 my-2"></div>
                      <div className="col-8 my-2 bg-black">
                        <div className="bg-secondary px-2 py-3 rounded text-white">
                          <p className="text-underline">
                            <strong>Nên:</strong>{" "}
                            <ul>
                              <li>Viết tiếng việt có dấu: </li>
                              <li>Mô tả công việc, nơi làm việc, giờ làm</li>
                              <li>Yêu cầu bằng cấp, kỹ năng</li>
                              <li>Phúc lợi khác ngoài lương</li>
                            </ul>
                          </p>
                          <p className="text-underline">
                            <strong> Không nên:</strong>
                          </p>
                          <ul>
                            <li>
                              Không điền số điện thoại/email trong nội dung
                            </li>
                            <li>
                              Không điền form ứng tuyển hoặc đường dẫn tới
                              website khác
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-2 my-2 text-white"></div>
                    </div>
                  </div>
                  {/* Yêu cầu ứng viên */}
                  {/* <FormPostNew4 /> */}
                  <>
                    <div className="row text-center">
                      <div className="col-12 border-bottom mb-2 mt-3 bg-title">
                        <h4>
                          <strong>Yêu cầu ứng viên</strong>
                        </h4>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6 my-2">
                        <p>
                          <strong>
                            Kinh nghiệm
                            <span className="text-danger ps-1">*</span>
                          </strong>
                        </p>
                        <p>
                          <Select
                            size="large"
                            placeholder="Chọn kinh nghiệm"
                            // value={selectedItems}
                            onChange={(value) => {
                              console.log("Value kinh nghiem", value);
                              setExperience(value);
                            }}
                            style={{ width: "100%" }}
                          >
                            {experiences.map((experience, index) => {
                              return (
                                <Option
                                  key={index}
                                  value={experience.kinhNghiem}
                                >
                                  {experience.kinhNghiem}
                                </Option>
                              );
                            })}
                          </Select>
                        </p>
                      </div>
                      <div className="col-6 my-2">
                        <p>
                          <strong>
                            Bằng cấp<span className="text-danger ps-1">*</span>
                          </strong>
                        </p>
                        <p>
                          <Select
                            size="large"
                            placeholder="Chọn bằng cấp"
                            // value={selectedItems}
                            onChange={(value) => {
                              console.log("Value bang cap", value);
                              setDegree(value);
                            }}
                            style={{ width: "100%" }}
                          >
                            <Option value="Sau đại học">Sau đại học</Option>
                            <Option value="Đại học">Đại học</Option>
                            <Option value="Cao Đẳng">Cao Đẳng</Option>
                            <Option value="Trung cấp">Trung cấp</Option>
                            <Option value="PHO_THONG">Phổ thông</Option>
                            <Option value="Trung học">Trung học</Option>
                            <Option value="Chưa tốt nghiệp">
                              Chưa tốt nghiệp
                            </Option>
                            <Option value="Nghề">Nghề</Option>
                            <Option value="Khác">Khác</Option>
                          </Select>
                        </p>
                      </div>
                      <div className="col-6 my-2">
                        <p>
                          <strong>
                            Giới tính<span className="text-danger ps-1">*</span>
                          </strong>
                        </p>
                        <p>
                          <Select
                            placeholder="Chọn giới tính"
                            style={{ width: "100%" }}
                            onChange={(value) => {
                              console.log("Chon gioi tinh: ", value);
                              setGender(value);
                            }}
                            size="large"
                          >
                            <Option value="Nam">Nam</Option>
                            <Option value="Nữ">Nữ</Option>
                            <Option value="Không phân biệt">
                              Không phân biệt
                            </Option>
                          </Select>
                        </p>
                      </div>
                      <div className="col-6 my-2">
                        <p>
                          <strong>
                            Ngày hết hạn
                            <span className="text-danger ps-1">*</span>
                          </strong>
                        </p>
                        <p>
                          <DatePicker
                            size="large"
                            style={{ width: "100%" }}
                            placeholder="Chọn ngày hết hạn"
                            format={"DD-MM-YYYY"}
                            onChange={(date, dateString) => {
                              console.log(date);
                              console.log(dateString);
                              setExpirationDate(date);
                            }}
                          />
                        </p>
                      </div>
                      <div className="col-6 my-2">
                        <p>
                          <strong>Tuổi từ:</strong>
                        </p>
                        <p>
                          <InputNumber
                            size="large"
                            style={{ width: "100%" }}
                            min={18}
                            max={60}
                            placeholder={18}
                            onChange={(e) => {
                              console.log("age", e);
                              setAgeFrom(e);
                            }}
                          />
                        </p>
                      </div>
                      <div className="col-6 my-2">
                        <p>
                          <strong>Đến:</strong>
                        </p>
                        <p>
                          <InputNumber
                            size="large"
                            style={{ width: "100%" }}
                            min={18}
                            max={60}
                            placeholder={18}
                            onChange={(e) => {
                              console.log("age", e);
                              setAgeTo(e);
                            }}
                          />
                        </p>
                      </div>

                      <div className="col-12 my-2">
                        <p>
                          <strong>
                            Mô tả yêu cầu
                            <span className="text-danger ps-1">*</span>
                          </strong>
                        </p>
                        <p>
                          <TextArea
                            rows={6}
                            placeholder=""
                            maxLength={1000}
                            onChange={(e) => {
                              console.log("mo ta yc", e);
                              setDesReq(e.target.value);
                            }}
                          />
                        </p>
                      </div>
                      <div className="col-12 my-2 bg-black">
                        <div className="bg-secondary px-2 py-3 rounded text-white">
                          <p className="text-underline">
                            Các kỹ năng chuyên môn của ứng viên để đáp ứng nhu
                            cầu công việc, các kỹ năng được ưu tiên của ứng
                            viên... vv
                          </p>
                          <p className="text-underline">
                            <strong>Ví dụ:</strong>{" "}
                            <ul>
                              <li>
                                Kinh nghiệm vận hành, bảo trì sửa chữa nhà
                                xưởng, tòa nhà trên 2 năm.
                              </li>
                              <li>
                                Kinh nghiệm chuyên ngành Cơ điện trên 5 năm
                              </li>
                              <li>
                                Tận dụng kiến thức kỹ thuật, đưa ra quyết định
                                nhanh chóng và giải quyết vấn đề. Tận dụng kinh
                                nghiệm đã tích lũy xác định vấn đề tiềm ẩn và
                                giải quyết mọi vấn đề càng sớm càng tốt
                              </li>
                            </ul>
                          </p>
                        </div>
                      </div>
                      <div className="col-12 my-2">
                        <p>
                          <strong>
                            Quyền lợi ứng viên:
                            <span className="text-danger ps-1">*</span>
                          </strong>
                        </p>
                        <p>
                          <TextArea
                            rows={6}
                            placeholder=""
                            maxLength={1000}
                            onChange={(e) => {
                              setQuyenLoi(e.target.value);
                            }}
                          />
                        </p>
                      </div>
                      <div className="col-12 my-2 bg-black">
                        <div className="bg-secondary px-2 py-3 rounded text-white">
                          <p className="text-underline">
                            <strong>
                              Những phúc lợi khi ứng viên tham gia vào công ty:
                            </strong>{" "}
                            <ul>
                              <li>Đóng BHXH, BHYT theo bộ luật lao động.</li>
                              <li>Chế độ nghỉ lễ Tết, đi du lịch hằng năm </li>
                              <li>
                                Được làm việc trong môi trường năng động, trẻ
                                trung, đầy nhiệt huyết.
                              </li>
                              <li>
                                Được tham gia các hoạt động team building và sự
                                kiện lớn trong năm độc đáo, hấp dẫn.{" "}
                              </li>

                              <li>Cơ hội thăng tiến, phát triển cao. </li>
                            </ul>
                          </p>
                        </div>
                      </div>
                      <div className="col-12 border-bottom mb-2 text-center mt-3 bg-title">
                        <h4>
                          <strong>Thông tin liên hệ</strong>
                        </h4>
                      </div>
                      <div className="col-4 my-2">
                        <p>
                          <strong>
                            Người liên hệ{" "}
                            <span className="text-danger ps-1">*</span>
                          </strong>
                        </p>
                        <p>
                          <Input
                            placeholder="Trung Vinh"
                            size="large"
                            onChange={(e) => {
                              console.log(e.target.value);
                              setContact(e.target.value);
                            }}
                          />
                        </p>
                      </div>
                      <div className="col-4 my-2">
                        <p>
                          <strong>
                            Số điện thoại <span>*</span>
                          </strong>
                        </p>
                        <p>
                          <Input
                            placeholder="0987999888"
                            size="large"
                            onChange={(e) => {
                              console.log(e.target.value);

                              setPhone(e.target.value);
                            }}
                          />
                        </p>
                      </div>
                      <div className="col-4 my-2">
                        <p>
                          <strong>
                            Email nhận hồ sơ <span>*</span>
                          </strong>
                        </p>
                        <p>
                          <Input
                            placeholder="nhatuyendung@gmail.com"
                            size="large"
                            onChange={(e) => {
                              console.log(e.target.value);

                              setEmail(e.target.value);
                            }}
                          />
                        </p>
                      </div>
                      {/* <div className="col-4 my-2"></div> */}
                      {/* Click to form preview */}
                      <div className="col-12 my-2">
                        <Button
                          size="large"
                          style={{ width: "100%" }}
                          type="primary"
                          onClick={() => {
                            previewFormSave();
                          }}
                        >
                          Tiếp tục <FaAngleDoubleRight className="ps-1" />
                        </Button>
                      </div>
                      {/* <div className="col-4 my-2"></div> */}
                    </div>
                  </>
                </>
              )}
            </div>
            <div></div>
          </Content>
          <Footer
            style={{
              textAlign: "center",
            }}
          >
            Ant Design ©2018 Created by Trung Vinh
          </Footer>
        </Layout>
      </Layout>
    </Fragment>
  );
};
export default NewJob;
