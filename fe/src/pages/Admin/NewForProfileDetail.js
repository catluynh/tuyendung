import {
  Breadcrumb,
  Button,
  Layout,
  Menu,
  Select,
  Tabs,
  DatePicker,
} from "antd";
import queryString from "query-string";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import PostFiltersForm from "../../components/Admin/PostFiltersForm";
import axiosClient from "../../services/axiosClient";
import axios from "axios";
import RecruitmentApi from "../../services/recruitmentApi";
import TimeUtils from "../../utils/timeUtils";
import ModalProfileDetail from "./components/modals/ModalProfileDetail";
import NavbarAdmin from "./components/navbar/NavbarAdmin";
import { useParams } from "react-router-dom";
import { RiMailSendLine, RiRefreshLine } from "react-icons/ri";
const { RangePicker } = DatePicker;

const { Option } = Select;

const { TabPane } = Tabs;
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const NewForProfileDetail = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    trangThai: 6,
  });

  const [recruitments, setRecruitments] = useState([]);

  const params = useParams();

  // console.log("paramsString", paramsString);
  const [type, setType] = useState();
  const [value, setValue] = useState(0);
  useEffect(() => {
    console.log("filters", filters);
    const paramsString = queryString.stringify(filters);
    console.log("filters paramsString", paramsString);
  }, [filters]);

  useEffect(() => {
    let mounted = true;
    const getDataListFilters = async () => {
      const paramsString = queryString.stringify(filters);
      try {
        const response = await RecruitmentApi.getListProfileByRecruitment({
          paramsString,
          id: params.id,
        });
        console.log("data by trung vinh", response.data);
        setRecruitments(response.data);
        // setTotalCount(response.pagination.total);
      } catch (error) {
        console.log(error.response);
      }
    };
    if (mounted) {
      getDataListFilters();
    }
    return () => {
      mounted = false;
      setRecruitments([]);
    };
  }, [filters]);

  const prevPage = async () => {
    const pg = page === 1 ? 1 : page - 1;
    // getListData(pg);
    setPage(pg);
  };
  const nextPage = async () => {
    const pg = page < Math.ceil(totalCount / pageSize) ? page + 1 : page;
    // getListData(pg);
    setPage(pg);
  };
  const handleFiltersStatusChange = (newFilters) => {
    console.log("New filters: ", newFilters);
    console.log("+VINH+;", {
      ...filters,
      page: 1,
      trangThai: newFilters,
    });
    setFilters({
      ...filters,
      page: 1,
      trangThai: newFilters,
    });
  };
  const handleFiltersChange = (newFilters) => {
    console.log("New filters: ", newFilters);
    setFilters({
      ...filters,
      page: 1,
      tieuDe: newFilters.searchTerm,
    });
  };

  const [userProfile, setUserProfile] = useState();
  const [isShowModalProfile, setIsShowModalProfile] = useState(false);
  const handleAddButtonClickProfile = (item) => {
    // console.log("E", item);
    setUserProfile(item);
    // e.preventDefault();
    setIsShowModalProfile(true);
  };
  const handleSubmitModalProfile = () => {
    console.log("Submit modal profile");
  };
  const renderModalProfile = useMemo(() => {
    if (!isShowModalProfile) return null;

    return (
      <ModalProfileDetail
        showModal={isShowModalProfile}
        onCloseModal={() => {
          setIsShowModalProfile(false);
          // clearErrors();
        }}
        user={userProfile}
        onSubmit={handleSubmitModalProfile}
      />
    );
  }, [isShowModalProfile]);
  const [totalStatusApplication, setTotalStatusApplication] = useState();
  const [totalDangUT, setTotalDangUT] = useState();
  const [totalDaUT, setTotalDaUT] = useState();
  const [totalTuChoi, setTotalTuChoi] = useState();
  const [totalAll, setTotalAll] = useState();
  useEffect(() => {
    const getTotalApplication = async () => {
      const requestUrl = `http://ec2-13-213-53-29.ap-southeast-1.compute.amazonaws.com:4000/donUngTuyens/demDonUngTuyentheoTin/${params?.id}`;
      try {
        const response = await axiosClient.get(requestUrl).then((res) => {
          let total = 0;
          res.data.map((item) => {
            if (item.trangThai == "Đang ứng tuyển") setTotalDangUT(item.tong);
            if (item.trangThai == "Đã ứng tuyển") setTotalDaUT(item.tong);
            if (item.trangThai == "Thất bại") setTotalTuChoi(item.tong);
            total = total + item.tong;
            setTotalAll(total);
          });
        });
      } catch (error) {
        console.log(error.response);
      }
    };
    getTotalApplication();
  }, []);

  const [recruitmentById, setRecruitmentById] = useState();
  useEffect(() => {
    const getRecruitmentById = async () => {
      const requestUrl = `http://ec2-13-213-53-29.ap-southeast-1.compute.amazonaws.com:4000/tinTuyenDungs/${params?.id}`;
      try {
        await axiosClient.get(requestUrl).then((res) => {
          setRecruitmentById(res.data);
        });
      } catch (error) {
        console.log(error.response);
      }
    };
    getRecruitmentById();
  }, []);

  const handleSendEmailTalent = async (recruitment) => {
    const requestUrlTalent = `http://ec2-13-213-53-29.ap-southeast-1.compute.amazonaws.com:4000/donUngTuyens/donUngTuyenTiemNang`;
    const requestUrlSendEmail = `http://ec2-13-213-53-29.ap-southeast-1.compute.amazonaws.com:4000/tinTuyenDungs/sendEmail`;
    try {
      await axiosClient.get(requestUrlTalent).then(res => {
        res?.data?.map(async item => {
          if (item?.donTuyenDung?.tinTuyenDung?.nganhNghe?._id === recruitment?.nganhNghe?._id) {
            const sendMail = {
              email: 'catluynh99@gmail.com', //item?.donTuyenDung?.ungTuyenVien?.taiKhoan?.email,
              subject: `Jobs Board gửi ${item?.donTuyenDung?.ungTuyenVien?.ten} việc làm mới phù hợp với bạn ngày ${TimeUtils.formatDateTime(
                recruitment?.ngayTao,
                "DD-MM-YYYY"
              )}`,
              message: `Xin chào <strong>${item?.donTuyenDung?.ungTuyenVien?.ten}</strong> <br> <strong>Jobs Board</strong> gửi bạn việc làm phù hợp mới ngày ${TimeUtils.formatDateTime(
                recruitment?.ngayTao,
                "DD-MM-YYYY"
              )} <br> Vui lòng click vào link này để biết thêm thông tin chi tiết: http://ec2-13-213-53-29.ap-southeast-1.compute.amazonaws.com:3000/job-detail/${recruitment._id}`
            }
            await axios.post(requestUrlSendEmail, sendMail)
          }
        })
      })

      // const requestUrl = `http://ec2-13-213-53-29.ap-southeast-1.compute.amazonaws.com:4000/tinTuyenDungs/${id}`;
      // await axios.delete(requestUrl).then((res) => {
      //   if (res?.data?.status == "success") {
      //     setIsSubmit(true);
      //     toast.success("Cập nhật thành công", {
      //       position: "bottom-right",
      //       autoClose: 1000,
      //       hideProgressBar: false,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       progress: undefined,
      //     });
      //   }
      // });
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <Fragment>
      <Helmet>
        <title>[Employer] - Chi tiết các hồ sơ thuộc tin tuyển dụng</title>
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
              <Breadcrumb.Item>Tin tuyển dụng</Breadcrumb.Item>
              <Breadcrumb.Item>Đơn tuyển dụng</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background bg-white"
              style={{
                padding: 24,
                minHeight: 360,
              }}
            >
              <strong>Tất cả đơn ứng tuyển</strong>
              <div className="row mt-3">
                <div className="col-12">
                  <div className="row mt-3">
                    <div className="col-12">
                      <h5>
                        <strong>{recruitmentById?.tieuDe}</strong>
                      </h5>
                    </div>
                    <div className="col-12">
                      <div>
                        <span>
                          Địa điểm:{" "}
                          <span className="ps-5">
                            {recruitmentById?.diaDiem?.quanHuyen},{" "}
                            {recruitmentById?.diaDiem?.tinhThanhPho}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div>
                        <span>
                          Mức lương:{" "}
                          <span className="ps-4">
                            {recruitmentById?.mucLuong}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div>
                        <span>
                          Trạng thái:
                          <span className="ps-4">
                            {recruitmentById?.trangThai}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div>
                        <span>
                          Ngày hết hạn:{" "}
                          <span className="ps-4">
                            {TimeUtils.formatDateTime(
                              recruitmentById?.ngayHetHan,
                              "DD-MM-YYYY"
                            )}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <Tabs
                    defaultActiveKey="6"
                    value={value}
                    onChange={(e) => {
                      setValue(e);
                      handleFiltersStatusChange(e);
                      console.log("key ABC", e);
                    }}
                  >
                    <TabPane
                      tab={`Tất cả (${totalAll ? totalAll : 0})`}
                      key="4"
                    >
                      <div className="row">
                        <div className="col-6">
                          <RangePicker style={{ width: "100%" }} />
                        </div>
                        <div className="col-1 ms-3">
                          <Button
                            className="d-flex align-items-center justify-content-center"
                            type="primary"
                            // icon={<GrFormRefresh />}
                            onClick={() => {
                              window.location.reload();
                            }}
                          >
                            <RiRefreshLine className="me-2" />
                            Làm mới
                          </Button>
                        </div>
                        <div className="col-4 ms-3">
                          <Button
                            className="d-flex align-items-center justify-content-center"
                            type="primary"
                            onClick={() => {
                              handleSendEmailTalent(recruitmentById);
                            }}
                          >
                            <RiMailSendLine className="me-2" /> Gửi email tin tuyển dụng đến
                            ứng viên tiềm năng
                          </Button>
                        </div>
                      </div>

                      <div className="row mt-3">
                        <div className="col-12">
                          <div className="card mb-4">
                            <div className="card-body px-0 pt-0 pb-2">
                              <div className="table-responsive p-0">
                                <table className="table align-items-center justify-content-center mb-0">
                                  <thead className="bg-dark">
                                    <tr>
                                      <th className="text-secondary opacity-7 text-white py-3 text-center">
                                        <strong>STT</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong> Thông tin ứng viên</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Tin tuyển dụng</strong>
                                      </th>
                                      <th className="text-secondary text-center opacity-7 ps-2 text-center text-white py-3">
                                        <strong> Trạng thái xử lý</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-center text-white py-3">
                                        <strong>Thao tác</strong>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {recruitments.map((item, index) => {
                                      const {
                                        ungTuyenVien,
                                        tinTuyenDung,
                                        trangThai,
                                        tiemNang,
                                      } = item?.donTuyenDung;
                                      return (
                                        <tr key={index}>
                                          <td className="align-middle">
                                            <p className="text-sm font-weight-bold mb-0 text-center">
                                              {index + 1}
                                            </p>
                                          </td>
                                          <td>
                                            <span
                                              style={{
                                               

                                              }}>
                                              {" "}
                                              {tiemNang && "Tiềm năng"}{" "}
                                            </span>
                                            <p className="text-sm fw-bold mb-0">
                                              {ungTuyenVien?.ten}
                                            </p>
                                            <p className="text-sm mb-0">
                                              {ungTuyenVien?.sdt}
                                            </p>
                                            <p className="text-sm mb-0">
                                              {ungTuyenVien?.taiKhoan?.email}
                                            </p>
                                            <p className="address">
                                              <span className="created">
                                                Ngày nộp:{" "}
                                                {TimeUtils.formatDateTime(
                                                  item?.ngayUngTuyen,
                                                  "DD-MM-YYYY"
                                                )}
                                              </span>
                                            </p>
                                            <p>
                                              <span
                                                className="text-success pointer"
                                                onClick={() => {
                                                  handleAddButtonClickProfile(
                                                    item
                                                  );
                                                }}
                                              >
                                                Xem thông tin ứng tuyến viên
                                              </span>
                                            </p>
                                          </td>
                                          <td className="">
                                            <p className="text-sm fw-bold mb-0">
                                              {tinTuyenDung?.tieuDe}
                                            </p>
                                            <p className="text-sm mb-0">
                                              Số lượng tuyển :{" "}
                                              {tinTuyenDung?.soLuongTuyen}
                                            </p>
                                            <p className="text-sm mb-0">
                                              Số lượng đã tuyển:{" "}
                                              {tinTuyenDung?.soLuongDaTuyen}
                                            </p>

                                            <p className="text-sm mb-0">
                                              Khu vực:{" "}
                                              {tinTuyenDung?.diaDiem
                                                ?.tinhThanhPho +
                                                "-" +
                                                tinTuyenDung?.diaDiem
                                                  ?.quanHuyen}
                                            </p>
                                            <p className="text-sm mb-0">
                                              Ngày hết hạn:{" "}
                                              {TimeUtils.formatDateTime(
                                                tinTuyenDung?.ngayHetHan,
                                                "DD-MM-YYYY"
                                              )}{" "}
                                            </p>
                                          </td>
                                          <td className="text-center align-middle">
                                            <span>{trangThai}</span>
                                          </td>
                                          <td
                                            className=" cursor-pointer pointer align-middle"
                                          // onClick={(e) => {
                                          //   console.log("e", e);
                                          // }}
                                          >
                                            {/* <span className="text-xs font-weight-bold pointer">
                                              <FaEllipsisV />
                                            </span> */}
                                            <div class="dropdown">
                                              <button
                                                class="btn btn-secondary dropdown-toggle"
                                                type="button"
                                                id="dropdownMenuButton1"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                              >
                                                Chi tiết
                                              </button>
                                              <ul
                                                class="dropdown-menu"
                                                aria-labelledby="dropdownMenuButton1"
                                              >
                                                <li
                                                  onClick={() => {
                                                    handleAddButtonClickProfile(
                                                      item
                                                    );
                                                  }}
                                                >
                                                  <span class="dropdown-item">
                                                    Xem
                                                  </span>
                                                </li>
                                                <li>
                                                  <span class="dropdown-item">
                                                    Ứng tuyển viên năng
                                                  </span>
                                                </li>
                                                <li>
                                                  <span class="dropdown-item">
                                                    Xóa
                                                  </span>
                                                </li>
                                              </ul>
                                            </div>
                                          </td>
                                        </tr>
                                  );
                                    })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      {recruitments.length < 1 && (
                        <div className="col-12">
                          <div
                            className="alert alert-warning text-center"
                            role="alert"
                          >
                            Không có dữ liệu
                          </div>
                        </div>
                      )}
                      {/* <div className="col-12">
                          Showing {totalCount === 0 ? 0 : offset + 1} to{" "}
                          {offset + 10 > totalCount
                            ? totalCount
                            : offset + pageSize}{" "}
                          of {totalCount}
                        </div> */}
                      <div className="col-12">
                        <nav aria-label="Page navigation example">
                          <ul className="pagination justify-content-center">
                            <li
                              className={`page-item ${page <= 1 ? "disabled drop" : ""
                                }`}
                            >
                              <button
                                type="button"
                                className="page-link"
                                disabled={page <= 1}
                                onClick={() => {
                                  prevPage();
                                }}
                              >
                                Trang truớc
                              </button>
                            </li>
                            <li
                              className={`page-item ${page >= totalCount ? "disabled drop" : ""
                                }`}
                            >
                              <button
                                className="page-link"
                                type="button"
                                disabled={page >= totalCount}
                                onClick={() => {
                                  nextPage();
                                }}
                              >
                                Trang sau
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </TabPane>
                  <TabPane
                    tab={`Đang ứng tuyển (${totalDangUT ? totalDangUT : 0})`}
                    key="1"
                  >
                    <div className="row">
                      <div className="col-6">
                        <RangePicker style={{ width: "100%"}} />
                      </div>
                      <div className="col-1 ms-3">
                        <Button
                          className="d-flex align-items-center justify-content-center"
                          type="primary"
                          // icon={<GrFormRefresh />}
                          onClick={() => {
                            window.location.reload();
                          }}
                        >
                          Làm mới
                        </Button>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12">
                        <div className="card mb-4">
                          <div className="card-body px-0 pt-0 pb-2">
                            <div className="table-responsive p-0">
                              <table className="table align-items-center justify-content-center mb-0">
                                <thead className="bg-dark">
                                  <tr>
                                    <th className="text-secondary opacity-7 text-white py-3 text-center">
                                      <strong>STT</strong>
                                    </th>
                                    <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                      <strong> Thông tin ứng viên</strong>
                                    </th>
                                    <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                      <strong>Tin tuyển dụng</strong>
                                    </th>
                                    <th className="text-secondary text-center opacity-7 ps-2 text-center text-white py-3">
                                      <strong> Trạng thái</strong>
                                    </th>
                                    <th className="text-secondary opacity-7 ps-2 text-center text-white py-3">
                                      <strong>Thao tác</strong>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {recruitments.map((item, index) => {
                                    const {
                                      ungTuyenVien,
                                      tinTuyenDung,
                                      trangThai,
                                    } = item?.donTuyenDung;
                                    return (
                                      <tr key={index}>
                                        <td className="align-middle">
                                          <p className="text-sm font-weight-bold mb-0 text-center">
                                            {index + 1}
                                          </p>
                                        </td>
                                        <td>
                                          <p className="text-sm fw-bold mb-0">
                                            {ungTuyenVien?.ten}
                                          </p>
                                          <p className="text-sm mb-0">
                                            {ungTuyenVien?.sdt}
                                          </p>
                                          <p className="text-sm mb-0">
                                            {ungTuyenVien?.taiKhoan?.email}
                                          </p>
                                          <p className="address">
                                            <span className="created">
                                              Ngày nộp:{" "}
                                              {TimeUtils.formatDateTime(
                                                item?.ngayUngTuyen,
                                                "DD-MM-YYYY"
                                              )}
                                            </span>
                                          </p>
                                          <p>
                                            <span
                                              className="text-success pointer"
                                              onClick={() => {
                                                handleAddButtonClickProfile(
                                                  item
                                                );
                                              }}
                                            >
                                              Xem thông tin ứng tuyến viên
                                            </span>
                                          </p>
                                        </td>
                                        <td className="">
                                          <p className="text-sm fw-bold mb-0">
                                            {tinTuyenDung?.tieuDe}
                                          </p>
                                          <p className="text-sm mb-0">
                                            Số lượng tuyển :{" "}
                                            {tinTuyenDung?.soLuongTuyen}
                                          </p>
                                          <p className="text-sm mb-0">
                                            Số lượng đã tuyển:{" "}
                                            {tinTuyenDung?.soLuongDaTuyen}
                                          </p>

                                          <p className="text-sm mb-0">
                                            Khu vực:{" "}
                                            {tinTuyenDung?.diaDiem
                                              ?.tinhThanhPho +
                                              "-" +
                                              tinTuyenDung?.diaDiem
                                                ?.quanHuyen}
                                          </p>
                                          <p className="text-sm mb-0">
                                            Ngày hết hạn:{" "}
                                            {TimeUtils.formatDateTime(
                                              tinTuyenDung?.ngayHetHan,
                                              "DD-MM-YYYY"
                                            )}{" "}
                                          </p>
                                        </td>
                                        <td className="text-center align-middle">
                                          <span>{trangThai}</span>
                                        </td>
                                        <td
                                          className=" cursor-pointer pointer align-middle"
                                        // onClick={(e) => {
                                        //   console.log("e", e);
                                        // }}
                                        >
                                          {/* <span className="text-xs font-weight-bold pointer">
                                              <FaEllipsisV />
                                            </span> */}
                                          <div class="dropdown">
                                            <button
                                              class="btn btn-secondary dropdown-toggle"
                                              type="button"
                                              id="dropdownMenuButton1"
                                              data-bs-toggle="dropdown"
                                              aria-expanded="false"
                                            >
                                              Chi tiết
                                            </button>
                                            <ul
                                              class="dropdown-menu"
                                              aria-labelledby="dropdownMenuButton1"
                                            >
                                              <li
                                                onClick={() => {
                                                  handleAddButtonClickProfile(
                                                    item
                                                  );
                                                }}
                                              >
                                                <span class="dropdown-item">
                                                  Xem
                                                </span>
                                              </li>
                                              <li>
                                                <span class="dropdown-item">
                                                  Ứng tuyển viên năng
                                                </span>
                                              </li>
                                              <li>
                                                <span class="dropdown-item">
                                                  Xóa
                                                </span>
                                              </li>
                                            </ul>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      {recruitments.length < 1 && (
                        <div className="col-12">
                          <div
                            className="alert alert-warning text-center"
                            role="alert"
                          >
                            Không có dữ liệu
                          </div>
                        </div>
                      )}
                      {/* <div className="col-12">
                          Showing {totalCount === 0 ? 0 : offset + 1} to{" "}
                          {offset + 10 > totalCount
                            ? totalCount
                            : offset + pageSize}{" "}
                          of {totalCount}
                        </div> */}
                      <div className="col-12">
                        <nav aria-label="Page navigation example">
                          <ul className="pagination justify-content-center">
                            <li
                              className={`page-item ${page <= 1 ? "disabled drop" : ""
                                }`}
                            >
                              <button
                                type="button"
                                className="page-link"
                                disabled={page <= 1}
                                onClick={() => {
                                  prevPage();
                                }}
                              >
                                Trang truớc
                              </button>
                            </li>
                            <li
                              className={`page-item ${page >= totalCount ? "disabled drop" : ""
                                }`}
                            >
                              <button
                                className="page-link"
                                type="button"
                                disabled={page >= totalCount}
                                onClick={() => {
                                  nextPage();
                                }}
                              >
                                Trang sau
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </TabPane>
                  <TabPane
                    tab={`Đã ứng tuyển (${totalDaUT ? totalDaUT : 0})`}
                    key="2"
                  >
                    <div className="row">
                      <div className="col-6">
                        <RangePicker style={{ width: "100%" }} />
                      </div>
                      <div className="col-1 ms-3">
                        <Button
                          className="d-flex align-items-center justify-content-center"
                          type="primary"
                          // icon={<GrFormRefresh />}
                          onClick={() => {
                            window.location.reload();
                          }}
                        >
                          Làm mới
                        </Button>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12">
                        <div className="card mb-4">
                          <div className="card-body px-0 pt-0 pb-2">
                            <div className="table-responsive p-0">
                              <table className="table align-items-center justify-content-center mb-0">
                                <thead className="bg-dark">
                                  <tr>
                                    <th className="text-secondary opacity-7 text-white py-3 text-center">
                                      <strong>STT</strong>
                                    </th>
                                    <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                      <strong> Thông tin ứng viên</strong>
                                    </th>
                                    <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                      <strong>Tin tuyển dụng</strong>
                                    </th>
                                    <th className="text-secondary text-center opacity-7 ps-2 text-center text-white py-3">
                                      <strong> Trạng thái</strong>
                                    </th>
                                    <th className="text-secondary opacity-7 ps-2 text-center text-white py-3">
                                      <strong>Thao tác</strong>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {recruitments.map((item, index) => {
                                    const {
                                      ungTuyenVien,
                                      tinTuyenDung,
                                      trangThai,
                                    } = item?.donTuyenDung;
                                    return (
                                      <tr key={index}>
                                        <td className="align-middle">
                                          <p className="text-sm font-weight-bold mb-0 text-center">
                                            {index + 1}
                                          </p>
                                        </td>
                                        <td>
                                          <p className="text-sm fw-bold mb-0">
                                            {ungTuyenVien?.ten}
                                          </p>
                                          <p className="text-sm mb-0">
                                            {ungTuyenVien?.sdt}
                                          </p>
                                          <p className="text-sm mb-0">
                                            {ungTuyenVien?.taiKhoan?.email}
                                          </p>
                                          <p className="address">
                                            <span className="created">
                                              Ngày nộp:{" "}
                                              {TimeUtils.formatDateTime(
                                                item?.ngayUngTuyen,
                                                "DD-MM-YYYY"
                                              )}
                                            </span>
                                          </p>
                                          <p>
                                            <span
                                              className="text-success pointer"
                                              onClick={() => {
                                                handleAddButtonClickProfile(
                                                  item
                                                );
                                              }}
                                            >
                                              Xem thông tin ứng tuyến viên
                                            </span>
                                          </p>
                                        </td>
                                        <td className="">
                                          <p className="text-sm fw-bold mb-0">
                                            {tinTuyenDung?.tieuDe}
                                          </p>
                                          <p className="text-sm mb-0">
                                            Số lượng tuyển :{" "}
                                            {tinTuyenDung?.soLuongTuyen}
                                          </p>
                                          <p className="text-sm mb-0">
                                            Số lượng đã tuyển:{" "}
                                            {tinTuyenDung?.soLuongDaTuyen}
                                          </p>

                                          <p className="text-sm mb-0">
                                            Khu vực:{" "}
                                            {tinTuyenDung?.diaDiem
                                              ?.tinhThanhPho +
                                              "-" +
                                              tinTuyenDung?.diaDiem
                                                ?.quanHuyen}
                                          </p>
                                          <p className="text-sm mb-0">
                                            Ngày hết hạn:{" "}
                                            {TimeUtils.formatDateTime(
                                              tinTuyenDung?.ngayHetHan,
                                              "DD-MM-YYYY"
                                            )}{" "}
                                          </p>
                                        </td>
                                        <td className="text-center align-middle">
                                          <span>{trangThai}</span>
                                        </td>
                                        <td
                                          className=" cursor-pointer pointer align-middle"
                                        // onClick={(e) => {
                                        //   console.log("e", e);
                                        // }}
                                        >
                                          {/* <span className="text-xs font-weight-bold pointer">
                                              <FaEllipsisV />
                                            </span> */}
                                          <div class="dropdown">
                                            <button
                                              class="btn btn-secondary dropdown-toggle"
                                              type="button"
                                              id="dropdownMenuButton1"
                                              data-bs-toggle="dropdown"
                                              aria-expanded="false"
                                            >
                                              Chi tiết
                                            </button>
                                            <ul
                                              class="dropdown-menu"
                                              aria-labelledby="dropdownMenuButton1"
                                            >
                                              <li
                                                onClick={() => {
                                                  handleAddButtonClickProfile(
                                                    item
                                                  );
                                                }}
                                              >
                                                <span class="dropdown-item">
                                                  Xem
                                                </span>
                                              </li>
                                              <li>
                                                <span class="dropdown-item">
                                                  Ứng tuyển viên năng
                                                </span>
                                              </li>
                                              <li>
                                                <span class="dropdown-item">
                                                  Xóa
                                                </span>
                                              </li>
                                            </ul>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      {recruitments.length < 1 && (
                        <div className="col-12">
                          <div
                            className="alert alert-warning text-center"
                            role="alert"
                          >
                            Không có dữ liệu
                          </div>
                        </div>
                      )}
                      {/* <div className="col-12">
                          Showing {totalCount === 0 ? 0 : offset + 1} to{" "}
                          {offset + 10 > totalCount
                            ? totalCount
                            : offset + pageSize}{" "}
                          of {totalCount}
                        </div> */}
                      <div className="col-12">
                        <nav aria-label="Page navigation example">
                          <ul className="pagination justify-content-center">
                            <li
                              className={`page-item ${page <= 1 ? "disabled drop" : ""
                                }`}
                            >
                              <button
                                type="button"
                                className="page-link"
                                disabled={page <= 1}
                                onClick={() => {
                                  prevPage();
                                }}
                              >
                                Trang truớc
                              </button>
                            </li>
                            <li
                              className={`page-item ${page >= totalCount ? "disabled drop" : ""
                                }`}
                            >
                              <button
                                className="page-link"
                                type="button"
                                disabled={page >= totalCount}
                                onClick={() => {
                                  nextPage();
                                }}
                              >
                                Trang sau
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </TabPane>
                  <TabPane
                    tab={`Từ chối(${totalTuChoi ? totalTuChoi : 0})`}
                    key="0"
                  >
                    <div className="row">
                      <div className="col-2">
                        <PostFiltersForm onSubmit={handleFiltersChange} />
                      </div>
                      <div className="col-2">
                        <Select
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Thời gian tạo"
                          optionFilterProp="children"
                          onChange={(value) => {
                            console.log("Value", value);
                          }}
                          onSearch={(value) => {
                            console.log("Value search", value);
                          }}
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          <Option value="jack">Jack</Option>
                          <Option value="lucy">Lucy</Option>
                          <Option value="tom">Tom</Option>
                        </Select>
                      </div>
                      <div className="col-2">
                        <Select
                          style={{ width: "100%" }}
                          defaultValue="lucy"
                          onChange={(value) => {
                            console.log("Value", value);
                          }}
                        >
                          <Option value="jack">Đăng gần nhất</Option>
                          <Option value="lucy">Đăng cũ nhất</Option>
                        </Select>
                      </div>
                      {/* <div className="col-1 me-3">
                          <Button
                            style={{ width: "120px" }}
                            className="d-flex align-items-center justify-content-center"
                            type="primary"
                            icon={<SearchOutlined />}
                          >
                            Tìm kiếm
                          </Button>
                        </div> */}
                      <div className="col-1 ms-3">
                        <Button
                          className="d-flex align-items-center justify-content-center"
                          type="primary"
                          // icon={<GrFormRefresh />}
                          onClick={() => {
                            window.location.reload();
                          }}
                        >
                          Làm mới
                        </Button>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12">
                        <div className="card mb-4">
                          <div className="card-body px-0 pt-0 pb-2">
                            <div className="table-responsive p-0">
                              <table className="table align-items-center justify-content-center mb-0">
                                <thead className="bg-dark">
                                  <tr>
                                    <th className="text-secondary opacity-7 text-white py-3 text-center">
                                      <strong>STT</strong>
                                    </th>
                                    <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                      <strong> Thông tin ứng viên</strong>
                                    </th>
                                    <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                      <strong>Tin tuyển dụng</strong>
                                    </th>
                                    <th className="text-secondary text-center opacity-7 ps-2 text-center text-white py-3">
                                      <strong> Trạng thái</strong>
                                    </th>
                                    <th className="text-secondary opacity-7 ps-2 text-center text-white py-3">
                                      <strong>Thao tác</strong>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {recruitments.map((item, index) => {
                                    const {
                                      ungTuyenVien,
                                      tinTuyenDung,
                                      trangThai,
                                    } = item?.donTuyenDung;
                                    return (
                                      <tr key={index}>
                                        <td className="align-middle">
                                          <p className="text-sm font-weight-bold mb-0 text-center">
                                            {index + 1}
                                          </p>
                                        </td>
                                        <td>
                                          <p className="text-sm fw-bold mb-0">
                                            {ungTuyenVien?.ten}
                                          </p>
                                          <p className="text-sm mb-0">
                                            {ungTuyenVien?.sdt}
                                          </p>
                                          <p className="text-sm mb-0">
                                            {ungTuyenVien?.taiKhoan?.email}
                                          </p>
                                          <p className="address">
                                            <span className="created">
                                              Ngày nộp:{" "}
                                              {TimeUtils.formatDateTime(
                                                item?.ngayUngTuyen,
                                                "DD-MM-YYYY"
                                              )}
                                            </span>
                                          </p>
                                          <p>
                                            <span
                                              className="text-success pointer"
                                              onClick={() => {
                                                handleAddButtonClickProfile(
                                                  item
                                                );
                                              }}
                                            >
                                              Xem thông tin ứng tuyến viên
                                            </span>
                                          </p>
                                        </td>
                                        <td className="">
                                          <p className="text-sm fw-bold mb-0">
                                            {tinTuyenDung?.tieuDe}
                                          </p>
                                          <p className="text-sm mb-0">
                                            Số lượng tuyển :{" "}
                                            {tinTuyenDung?.soLuongTuyen}
                                          </p>
                                          <p className="text-sm mb-0">
                                            Số lượng đã tuyển:{" "}
                                            {tinTuyenDung?.soLuongDaTuyen}
                                          </p>

                                          <p className="text-sm mb-0">
                                            Khu vực:{" "}
                                            {tinTuyenDung?.diaDiem
                                              ?.tinhThanhPho +
                                              "-" +
                                              tinTuyenDung?.diaDiem
                                                ?.quanHuyen}
                                          </p>
                                          <p className="text-sm mb-0">
                                            Ngày hết hạn:{" "}
                                            {TimeUtils.formatDateTime(
                                              tinTuyenDung?.ngayHetHan,
                                              "DD-MM-YYYY"
                                            )}{" "}
                                          </p>
                                        </td>
                                        <td className="text-center align-middle">
                                          <span>{trangThai}</span>
                                        </td>
                                        <td
                                          className=" cursor-pointer pointer align-middle"
                                        // onClick={(e) => {
                                        //   console.log("e", e);
                                        // }}
                                        >
                                          {/* <span className="text-xs font-weight-bold pointer">
                                              <FaEllipsisV />
                                            </span> */}
                                          <div class="dropdown">
                                            <button
                                              class="btn btn-secondary dropdown-toggle"
                                              type="button"
                                              id="dropdownMenuButton1"
                                              data-bs-toggle="dropdown"
                                              aria-expanded="false"
                                            >
                                              Chi tiết
                                            </button>
                                            <ul
                                              class="dropdown-menu"
                                              aria-labelledby="dropdownMenuButton1"
                                            >
                                              <li
                                                onClick={() => {
                                                  handleAddButtonClickProfile(
                                                    item
                                                  );
                                                }}
                                              >
                                                <span class="dropdown-item">
                                                  Xem
                                                </span>
                                              </li>
                                              <li>
                                                <span class="dropdown-item">
                                                  Ứng tuyển viên năng
                                                </span>
                                              </li>
                                              <li>
                                                <span class="dropdown-item">
                                                  Xóa
                                                </span>
                                              </li>
                                            </ul>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      {recruitments.length < 1 && (
                        <div className="col-12">
                          <div
                            className="alert alert-warning text-center"
                            role="alert"
                          >
                            Không có dữ liệu
                          </div>
                        </div>
                      )}
                      {/* <div className="col-12">
                          Showing {totalCount === 0 ? 0 : offset + 1} to{" "}
                          {offset + 10 > totalCount
                            ? totalCount
                            : offset + pageSize}{" "}
                          of {totalCount}
                        </div> */}
                      <div className="col-12">
                        <nav aria-label="Page navigation example">
                          <ul className="pagination justify-content-center">
                            <li
                              className={`page-item ${page <= 1 ? "disabled drop" : ""
                                }`}
                            >
                              <button
                                type="button"
                                className="page-link"
                                disabled={page <= 1}
                                onClick={() => {
                                  prevPage();
                                }}
                              >
                                Trang truớc
                              </button>
                            </li>
                            <li
                              className={`page-item ${page >= totalCount ? "disabled drop" : ""
                                }`}
                            >
                              <button
                                className="page-link"
                                type="button"
                                disabled={page >= totalCount}
                                onClick={() => {
                                  nextPage();
                                }}
                              >
                                Trang sau
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
          <div></div>
          {renderModalProfile}
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
    </Fragment >
  );
};
export default NewForProfileDetail;
