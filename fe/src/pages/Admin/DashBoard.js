import { Breadcrumb, Button, Layout, Menu, Select, Tabs } from "antd";
import axios from "axios";
import queryString from "query-string";
import React, { Fragment, useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import PostFiltersForm from "../../components/Admin/PostFiltersForm";
import axiosClient from "../../services/axiosClient";
import RecruitmentApi from "../../services/recruitmentApi";
import TimeUtils from "../../utils/timeUtils";
import NavbarAdmin from "./components/navbar/NavbarAdmin";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import Pagination from "../../components/Pagination/Pagination";
import { RiRefreshLine } from "react-icons/ri";
import io from 'socket.io-client'

const { Option } = Select;

const { TabPane } = Tabs;
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const MainNavigationAdmin = () => {

  const [socket, setSocket] = useState(null);
  useEffect(async () => {
    if (!socket) {
      const st = io.connect('http://ec2-3-0-177-195.ap-southeast-1.compute.amazonaws.com:4000')
      setSocket(st)

    }
  }, [socket])

  const [isSubmit, setIsSubmit] = useState([]);

  const [collapsed, setCollapsed] = React.useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
  });

  const [recruitments, setRecruitments] = useState([]);
  const paramsString = queryString.stringify(filters);
  console.log("paramsString", paramsString);
  const [type, setType] = useState();
  const onHandleChangeType = (value) => {
    setType(value);
  };
  const [value, setValue] = useState(0);

  const [pagination, setPagination] = useState({
    page: 1,
    totalProducts: 1,
  });
  //HANDLE PAGINATION
  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage.selected + 1,
    });
  };

  const getListData = async (pg = page, pgSize = pageSize) => {
    try {
      const params = {
        page: pg,
        limit: 15,
        // tieuDe: "",
        // trangThai: "",
      };

      const response =
        await RecruitmentApi.getListRecruitmentByEmployerFilterParams(params);
      console.log("response:::", response);
      setRecruitments(response.data);
      setIsSubmit(false);
      setTotalCount(response.pagination.total);
    } catch (error) {
      console.log(error.response);
    }
  };

  const getDataListFilters = async () => {
    const requestUrl = `http://ec2-3-0-177-195.ap-southeast-1.compute.amazonaws.com:4000/tinTuyenDungs/timKiemTheoNhaTuyenDung?${paramsString}`;
    try {
      const response = await axiosClient.get(requestUrl);
      console.log("responseresponse", response.data);
      setRecruitments(response.data);
      setTotalCount(response.pagination.total);
      setPagination(response.pagination);
      setIsSubmit(false);
      socket.on('res-duyet-tin-tuyen-dung', (data) => {
        getDataListFilters();
      })
      console.log('socket', socket)
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      getDataListFilters();
    }
    return () => {
      mounted = false;
      setRecruitments([]);
    };
  }, [filters]);

  useEffect(() => {
    getListData();
  }, [page]);

  const prevPage = async () => {
    const pg = page === 1 ? 1 : page - 1;
    getListData(pg);
    setPage(pg);
  };
  const nextPage = async () => {
    const pg = page < Math.ceil(totalCount / pageSize) ? page + 1 : page;
    getListData(pg);
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
  const [totalStatus, setTotalStatus] = useState();
  const [totalDungTuyen, setTotalDungTuyen] = useState();
  const [totalChoDuyet, setTotalChoDuyet] = useState();
  const [totalKhoa, setTotalKhoa] = useState();
  const [totalDaDuyet, setTotalDaDuyet] = useState();
  const [totalTuChoi, setTotalTuChoi] = useState();
  const [totalAll, setTotalAll] = useState();

  const getTotalStatus = async () => {
    const requestUrl = `http://ec2-3-0-177-195.ap-southeast-1.compute.amazonaws.com:4000/tinTuyenDungs/tongSoTinTheoTrangThaiNhaTuyenDung`;
    try {
      const response = await axiosClient.get(requestUrl).then((res) => {
        let total = 0;
        res.data.map((item) => {
          if (item.trangThai == "Dừng tuyển") setTotalDungTuyen(item.tong);
          if (item.trangThai == "Chờ duyệt") setTotalChoDuyet(item.tong);
          if (item.trangThai == "Khóa") setTotalKhoa(item.tong);
          if (item.trangThai == "Đã duyệt") setTotalDaDuyet(item.tong);
          if (item.trangThai == "Từ chối") setTotalTuChoi(item.tong);
          total = total + item.tong;
          setTotalAll(total);
          setIsSubmit(false);
        });
      });
      socket.on('res-duyet-tin-tuyen-dung', (data) => {
        getTotalStatus();
        console.log('sau sokcet', totalChoDuyet);
      })
      setTotalStatus(response.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    getTotalStatus();
  }, []);

  // xóa tin
  const handleAddButtonClickDetailDelete = async (id) => {
    try {
      const requestUrl = `http://ec2-3-0-177-195.ap-southeast-1.compute.amazonaws.com:4000/tinTuyenDungs/${id}`;
      await axios.delete(requestUrl).then((res) => {
        if (res?.data?.status == "success") {
          setIsSubmit(true);
          toast.success("Cập nhật thành công", {
            position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  // dừng tin
  const handleAddButtonClickDetailStop = async (id) => {
    try {
      const requestUrl = `http://ec2-3-0-177-195.ap-southeast-1.compute.amazonaws.com:4000/tinTuyenDungs/dungTuyen/${id}`;
      await axios.patch(requestUrl).then((res) => {
        if (res?.data?.status == "success") {
          setIsSubmit(true);
          toast.success("Cập nhật thành công", {
            position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    // getListData();
    getTotalStatus();
    getDataListFilters();
  }, [isSubmit]);

  return (
    <Fragment>
      <Helmet>
        <title>[Employer] - Trang chủ nhà tuyển dụng</title>
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
              <Breadcrumb.Item>Quản lý tin đăng</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background bg-white"
              style={{
                padding: 24,
                minHeight: 360,
              }}
            >
              <strong>Tất cả tin tuyển dụng</strong>
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
                      key="6"
                    >
                      <div className="row">
                        <div className="col-2">
                          <PostFiltersForm onSubmit={handleFiltersChange} />
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
                            <RiRefreshLine className="me-2" /> Làm mới
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
                                        <strong> Tin tuyển dụng</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Hồ sơ</strong>
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
                                      return (
                                        <tr key={index}>
                                          <td className="align-middle">
                                            <p className="text-sm font-weight-bold mb-0 text-center">
                                              {index + 1}
                                            </p>
                                          </td>
                                          <td>
                                            <p className="text-sm fw-bold mb-0">
                                              {item?.tieuDe}
                                            </p>
                                            <p className="text-sm mb-0">
                                              {item?.diaDiem?.tinhThanhPho} :{" "}
                                              {item?.diaDiem?.quanHuyen}
                                            </p>
                                            <p className="address">
                                              <span className="created">
                                                Ngày tạo:{" "}
                                                {TimeUtils.formatDateTime(
                                                  item?.ngayTao,
                                                  "DD-MM-YYYY"
                                                )}
                                              </span>
                                              &nbsp;
                                              <span className="apply-date">
                                                Hạn nộp:{" "}
                                                {TimeUtils.formatDateTime(
                                                  item?.ngayHetHan,
                                                  "DD-MM-YYYY"
                                                )}
                                              </span>
                                            </p>
                                            <p>
                                              <Link
                                                to={`/job-detail/${item._id}`}
                                                target="_blank"
                                              >
                                                Xem tin đăng trên website
                                              </Link>
                                            </p>
                                          </td>
                                          <td className="align-middle">
                                            <Link
                                              to={`/employer/job/detail/${item?._id}`}
                                            >
                                              <span className="text-xs font-weight-bold d-flex align-items-center  text-center">
                                                <FaUserPlus className="text-danger" />{" "}
                                                &nbsp; Xem hồ sơ của tin
                                              </span>
                                            </Link>
                                          </td>
                                          <td className="text-center align-middle">
                                            <>
                                              {item?.trangThai == "Đã duyệt" ? (
                                                <span>Đang tuyển dụng</span>
                                              ) : (
                                                item?.trangThai
                                              )}
                                            </>
                                          </td>
                                          <td className="text-center cursor-pointer align-middle pointer">
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
                                                <>
                                                  {item?.trangThai ==
                                                    "Đã duyệt" ? (
                                                    <>
                                                      <li
                                                        onClick={() => {
                                                          handleAddButtonClickDetailStop(
                                                            item?._id
                                                          );
                                                        }}
                                                      >
                                                        <span class="dropdown-item">
                                                          Dừng tuyển dụng
                                                        </span>
                                                      </li>
                                                    </>
                                                  ) : null}
                                                </>
                                                <li
                                                  onClick={() => {
                                                    handleAddButtonClickDetailDelete(
                                                      item?._id
                                                    );
                                                  }}
                                                >
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

                        <div className="col-12">
                          {recruitments.length !== 0 && (
                            <Pagination
                              onPageChange={handlePageChange}
                              pagination={pagination}
                            />
                          )}
                        </div>
                      </div>
                    </TabPane>
                    <TabPane
                      tab={`Chờ duyệt (${totalChoDuyet ? totalChoDuyet : 0})`}
                      key="1"
                    >
                      <div className="row">
                        <div className="col-2">
                          <PostFiltersForm onSubmit={handleFiltersChange} />
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
                            <RiRefreshLine className="me-2" /> Làm mới
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
                                        <strong> Tin tuyển dụng</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Hồ sơ</strong>
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
                                      return (
                                        <tr key={index + 1}>
                                          <td className="align-middle">
                                            <p className="text-sm font-weight-bold mb-0 text-center">
                                              {index}
                                            </p>
                                          </td>
                                          <td>
                                            <p className="text-sm fw-bold mb-0">
                                              {item?.tieuDe}
                                            </p>
                                            <p className="text-sm mb-0">
                                              {item?.diaDiem?.tinhThanhPho} :{" "}
                                              {item?.diaDiem?.quanHuyen}
                                            </p>
                                            <p className="address">
                                              <span className="created">
                                                Ngày tạo:{" "}
                                                {TimeUtils.formatDateTime(
                                                  item?.ngayTao,
                                                  "DD-MM-YYYY"
                                                )}
                                              </span>
                                              &nbsp;
                                              <span className="apply-date">
                                                Hạn nộp:{" "}
                                                {TimeUtils.formatDateTime(
                                                  item?.ngayHetHan,
                                                  "DD-MM-YYYY"
                                                )}
                                              </span>
                                            </p>
                                            <p>
                                              <Link
                                                to={`/job-detail/${item._id}`}
                                                target="_blank"
                                              >
                                                Xem tin đăng trên website
                                              </Link>
                                            </p>
                                          </td>
                                          <td className="align-middle">
                                            <span className="text-xs font-weight-bold d-flex align-items-center  text-center">
                                              <FaUserPlus className="text-danger" />{" "}
                                              &nbsp; Xem hồ sơ của tin
                                            </span>
                                          </td>
                                          <td className="text-center align-middle">
                                            <span>{item?.trangThai}</span>
                                          </td>
                                          <td className="text-center cursor-pointer align-middle pointer">
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
                                                    handleAddButtonClickDetailDelete(
                                                      item?._id
                                                    );
                                                  }}
                                                >
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

                        <div className="col-12">
                          {recruitments.length !== 0 && (
                            <Pagination
                              onPageChange={handlePageChange}
                              pagination={pagination}
                            />
                          )}
                        </div>
                      </div>
                    </TabPane>
                    <TabPane
                      tab={`Đang tuyển dụng (${totalDaDuyet ? totalDaDuyet : 0
                        })`}
                      key="2"
                    >
                      <div className="row">
                        <div className="col-2">
                          <PostFiltersForm onSubmit={handleFiltersChange} />
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
                            <RiRefreshLine className="me-2" /> Làm mới
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
                                        <strong> Tin tuyển dụng</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Hồ sơ</strong>
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
                                      return (
                                        <tr key={index + 1}>
                                          <td className="align-middle">
                                            <p className="text-sm font-weight-bold mb-0 text-center">
                                              {index}
                                            </p>
                                          </td>
                                          <td>
                                            <p className="text-sm fw-bold mb-0">
                                              {item?.tieuDe}
                                            </p>
                                            <p className="text-sm mb-0">
                                              {item?.diaDiem?.tinhThanhPho} :{" "}
                                              {item?.diaDiem?.quanHuyen}
                                            </p>
                                            <p className="address">
                                              <span className="created">
                                                Ngày tạo:{" "}
                                                {TimeUtils.formatDateTime(
                                                  item?.ngayTao,
                                                  "DD-MM-YYYY"
                                                )}
                                              </span>
                                              &nbsp;
                                              <span className="apply-date">
                                                Hạn nộp:{" "}
                                                {TimeUtils.formatDateTime(
                                                  item?.ngayHetHan,
                                                  "DD-MM-YYYY"
                                                )}
                                              </span>
                                            </p>
                                            <p>
                                              <Link
                                                to={`/job-detail/${item._id}`}
                                                target="_blank"
                                              >
                                                Xem tin đăng trên website
                                              </Link>
                                            </p>
                                          </td>
                                          <td className="align-middle">
                                            <span className="text-xs font-weight-bold d-flex align-items-center  text-center">
                                              <FaUserPlus className="text-danger" />{" "}
                                              &nbsp; 1 hồ sơ mới
                                            </span>
                                          </td>
                                          <td className="text-center align-middle">
                                            <>
                                              {item?.trangThai ==
                                                "Đã duyệt" && (
                                                  <span>Đang tuyển dụng</span>
                                                )}
                                            </>
                                          </td>
                                          <td className="text-center cursor-pointer align-middle pointer">
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
                                                    handleAddButtonClickDetailStop(
                                                      item?._id
                                                    );
                                                  }}
                                                >
                                                  <span class="dropdown-item">
                                                    Dừng tuyển dụng
                                                  </span>
                                                </li>
                                                <li
                                                  onClick={() => {
                                                    handleAddButtonClickDetailDelete(
                                                      item?._id
                                                    );
                                                  }}
                                                >
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

                        <div className="col-12">
                          {recruitments.length !== 0 && (
                            <Pagination
                              onPageChange={handlePageChange}
                              pagination={pagination}
                            />
                          )}
                        </div>
                      </div>
                    </TabPane>
                    <TabPane
                      tab={`Dừng tuyển(${totalDungTuyen ? totalDungTuyen : 0})`}
                      key="3"
                    >
                      <div className="row">
                        <div className="col-2">
                          <PostFiltersForm onSubmit={handleFiltersChange} />
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
                            <RiRefreshLine className="me-2" /> Làm mới
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
                                        <strong> Tin tuyển dụng</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Hồ sơ</strong>
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
                                      return (
                                        <tr key={index + 1}>
                                          <td className="align-middle">
                                            <p className="text-sm font-weight-bold mb-0 text-center">
                                              {index}
                                            </p>
                                          </td>
                                          <td>
                                            <p className="text-sm fw-bold mb-0">
                                              {item?.tieuDe}
                                            </p>
                                            <p className="text-sm mb-0">
                                              {item?.diaDiem?.tinhThanhPho} :{" "}
                                              {item?.diaDiem?.quanHuyen}
                                            </p>
                                            <p className="address">
                                              <span className="created">
                                                Ngày tạo:{" "}
                                                {TimeUtils.formatDateTime(
                                                  item?.ngayTao,
                                                  "DD-MM-YYYY"
                                                )}
                                              </span>
                                              &nbsp;
                                              <span className="apply-date">
                                                Hạn nộp:{" "}
                                                {TimeUtils.formatDateTime(
                                                  item?.ngayHetHan,
                                                  "DD-MM-YYYY"
                                                )}
                                              </span>
                                            </p>
                                            <p>
                                              <Link
                                                to={`/job-detail/${item._id}`}
                                                target="_blank"
                                              >
                                                Xem tin đăng trên website
                                              </Link>
                                            </p>
                                          </td>
                                          <td className="align-middle">
                                            <span className="text-xs font-weight-bold d-flex align-items-center  text-center">
                                              <FaUserPlus className="text-danger" />{" "}
                                              &nbsp; Xem hồ sơ của tin
                                            </span>
                                          </td>
                                          <td className="text-center align-middle">
                                            <span>{item?.trangThai}</span>
                                          </td>
                                          <td className="text-center cursor-pointer align-middle pointer">
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
                                                    handleAddButtonClickDetailDelete(
                                                      item?._id
                                                    );
                                                  }}
                                                >
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
                        <div className="col-12">
                          {recruitments.length !== 0 && (
                            <Pagination
                              onPageChange={handlePageChange}
                              pagination={pagination}
                            />
                          )}
                        </div>
                      </div>
                    </TabPane>
                    <TabPane
                      tab={`Khóa (${totalKhoa ? totalKhoa : 0})`}
                      key="0"
                    >
                      <div className="row">
                        <div className="col-2">
                          <PostFiltersForm onSubmit={handleFiltersChange} />
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
                                        <strong> Tin tuyển dụng</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Hồ sơ</strong>
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
                                      return (
                                        <tr key={index + 1}>
                                          <td className="align-middle">
                                            <p className="text-sm font-weight-bold mb-0 text-center">
                                              {index}
                                            </p>
                                          </td>
                                          <td>
                                            <p className="text-sm fw-bold mb-0">
                                              {item?.tieuDe}
                                            </p>
                                            <p className="text-sm mb-0">
                                              {item?.diaDiem?.tinhThanhPho} :{" "}
                                              {item?.diaDiem?.quanHuyen}
                                            </p>
                                            <p className="address">
                                              <span className="created">
                                                Ngày tạo:{" "}
                                                {TimeUtils.formatDateTime(
                                                  item?.ngayTao,
                                                  "DD-MM-YYYY"
                                                )}
                                              </span>
                                              &nbsp;
                                              <span className="apply-date">
                                                Hạn nộp:{" "}
                                                {TimeUtils.formatDateTime(
                                                  item?.ngayHetHan,
                                                  "DD-MM-YYYY"
                                                )}
                                              </span>
                                            </p>
                                            <p>
                                              <Link
                                                to={`/job-detail/${item._id}`}
                                                target="_blank"
                                              >
                                                Xem tin đăng trên website
                                              </Link>
                                            </p>
                                          </td>
                                          <td className="align-middle">
                                            <span className="text-xs font-weight-bold d-flex align-items-center  text-center">
                                              <FaUserPlus className="text-danger" />{" "}
                                              &nbsp; Xem hồ sơ của tin
                                            </span>
                                          </td>
                                          <td className="text-center align-middle">
                                            <span>{item?.trangThai}</span>
                                          </td>
                                          <td className="text-center cursor-pointer align-middle pointer">
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
                                                    handleAddButtonClickDetailDelete(
                                                      item?._id
                                                    );
                                                  }}
                                                >
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

                        <div className="col-12">
                          {recruitments.length !== 0 && (
                            <Pagination
                              onPageChange={handlePageChange}
                              pagination={pagination}
                            />
                          )}
                        </div>
                      </div>
                    </TabPane>
                    <TabPane
                      tab={`Từ chối (${totalTuChoi ? totalTuChoi : 0})`}
                      key="4"
                    >
                      <div className="row">
                        <div className="col-2">
                          <PostFiltersForm onSubmit={handleFiltersChange} />
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
                            <RiRefreshLine className="me-2" /> Làm mới
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
                                        <strong> Tin tuyển dụng</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Hồ sơ</strong>
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
                                      return (
                                        <tr key={index + 1}>
                                          <td className="align-middle">
                                            <p className="text-sm font-weight-bold mb-0 text-center">
                                              {index}
                                            </p>
                                          </td>
                                          <td>
                                            <p className="text-sm fw-bold mb-0">
                                              {item?.tieuDe}
                                            </p>
                                            <p className="text-sm mb-0">
                                              {item?.diaDiem?.tinhThanhPho} :{" "}
                                              {item?.diaDiem?.quanHuyen}
                                            </p>
                                            <p className="address">
                                              <span className="created">
                                                Ngày tạo:{" "}
                                                {TimeUtils.formatDateTime(
                                                  item?.ngayTao,
                                                  "DD-MM-YYYY"
                                                )}
                                              </span>
                                              &nbsp;
                                              <span className="apply-date">
                                                Hạn nộp:{" "}
                                                {TimeUtils.formatDateTime(
                                                  item?.ngayHetHan,
                                                  "DD-MM-YYYY"
                                                )}
                                              </span>
                                            </p>
                                            <p>
                                              <Link
                                                to={`/job-detail/${item._id}`}
                                                target="_blank"
                                              >
                                                Xem tin đăng trên website
                                              </Link>
                                            </p>
                                          </td>
                                          <td className="align-middle">
                                            <span className="text-xs font-weight-bold d-flex align-items-center  text-center">
                                              <FaUserPlus className="text-danger" />{" "}
                                              &nbsp; Xem hồ sơ của tin
                                            </span>
                                          </td>
                                          <td className="text-center align-middle">
                                            <span>{item?.trangThai}</span>
                                          </td>
                                          <td className="text-center cursor-pointer align-middle pointer">
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
                                                    handleAddButtonClickDetailDelete(
                                                      item?._id
                                                    );
                                                  }}
                                                >
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
                        <div className="col-12">
                          {recruitments.length !== 0 && (
                            <Pagination
                              onPageChange={handlePageChange}
                              pagination={pagination}
                            />
                          )}
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
                      </div>
                    </TabPane>
                  </Tabs>
                </div>
              </div>
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
export default MainNavigationAdmin;
