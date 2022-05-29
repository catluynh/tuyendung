import { Layout, Menu, Breadcrumb, Input, Tooltip, Button } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import io from 'socket.io-client'
import React, { Fragment, useEffect, useRef, useState } from "react";
import { FaListUl, FaUserPlus } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";
import { Link } from "react-router-dom";
import { Tabs } from "antd";
import { Select } from "antd";
import { GrFormRefresh } from "react-icons/gr";
import { FaEllipsisV } from "react-icons/fa";
import RecruitmentApi from "../../services/recruitmentApi";
import TimeUtils from "../../utils/timeUtils";
import ReactPaginate from "react-paginate";
import Pagination from "../../components/Pagination/Pagination";
import PostFiltersForm from "../../components/Admin/PostFiltersForm";
import queryString from "query-string";
import axios from "axios";
import { Helmet } from "react-helmet";
import NavbarQTV from "./components/navbar/NavbarQTV";
import { toast } from "react-toastify";
import { RiRefreshLine } from "react-icons/ri";
import { useCommonContext } from "../../components/Search/context/commonContext";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const { TabPane } = Tabs;
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;



const DashBoardQTV = () => {
  const [socket, setSocket] = useState(null);
  useEffect(async () => {
    if (!socket) {
      const st = io.connect('http://localhost:4000')
      setSocket(st)

    }
  }, [socket])

  const { t } = useTranslation();
  const { listCareers, levels, typeWorks } = useCommonContext();
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

  const [recruitments, setRecruitments] = useState([]);
  const paramsString = queryString.stringify(filters);
  const [type, setType] = useState();
  const [value, setValue] = useState(0);

  const getDataListFilters = async () => {
    const requestUrl = `http://localhost:4000/tinTuyenDungs/soLuongDanhGiaTheoTin?${paramsString}`;
    try {
      const response = await axios.get(requestUrl);
      setRecruitments(response.data.data);
      setTotalCount(response?.data?.pagination?.total);
      setPagination(response?.data?.pagination);
      setIsSubmit(false);
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

  // const prevPage = async () => {
  //   const pg = page === 1 ? 1 : page - 1;
  //    getListData(pg);
  //   setPage(pg);
  // };
  // const nextPage = async () => {
  //   const pg = page < Math.ceil(totalCount / pageSize) ? page + 1 : page;
  //   // getListData(pg);
  //   setPage(pg);
  // };
  const handleFiltersStatusChange = (newFilters) => {

    setFilters({
      ...filters,
      page: 1,
      trangThai: newFilters,
    });
  };
  const handleFiltersChange = (newFilters) => {
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
    const requestUrl = `http://localhost:4000/tinTuyenDungs/tongSoTinTheoTrangThai`;
    try {
      const response = await axios.get(requestUrl).then((res) => {
        let total = 0;
        res.data.data.map((item) => {
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

      setTotalStatus(response.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    getTotalStatus();
  }, []);
  const [isGetRecruitmentReviewLeast, setIsGetRecruitmentReviewLeast] =
    useState(false);
  const [recruitmentReviewLeast, setRecruitmentReviewLeast] = useState([]);
  const [totalReviewLeast, setTotalReviewLeast] = useState([]);
  const getRecruitmentReviewLeast = async () => {
    const requestUrl = `http://localhost:4000/tinTuyenDungs/tinTuyenDungCoNguyCoKhoa`;
    try {
      const response = await axios.get(requestUrl);
      setRecruitmentReviewLeast(response?.data?.data);
      setTotalReviewLeast(response?.data?.pagination?.total);
      setIsSubmit(false);
    } catch (error) {
      console.log(error.response);
    }
  };
  useEffect(() => {

    getRecruitmentReviewLeast();
  }, [isGetRecruitmentReviewLeast]);

  // xóa tin
  const handleAddButtonClickDetailDelete = async (id) => {
    try {
      const requestUrl = `http://localhost:4000/tinTuyenDungs/${id}`;
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

  // duyệt tin
  const handleAddButtonClickDetailAccept = async (id) => {
    try {
      const requestUrl = `http://localhost:4000/tinTuyenDungs/duyetTin/${id}`;
      await axios.patch(requestUrl).then(async (res) => {
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
          await socket.emit("duyet-tin-tuyen-dung", { id: id })
          console.log('socket', socket)
        }
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  // mở / khóa tin
  const handleAddButtonClickDetailBlock = async (id) => {
    try {
      const requestUrl = `http://localhost:4000/tinTuyenDungs/khoaTin/${id}`;
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

  // Từ chối
  const handleAddButtonClickDetailDeny = async (id) => {
    try {
      const requestUrl = `http://localhost:4000/tinTuyenDungs/tuChoiTin/${id}`;
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
    getTotalStatus();
    getDataListFilters();
    getRecruitmentReviewLeast();
  }, [isSubmit]);

  return (
    <Fragment>
      <Helmet>
        <title>[Admin] - Trang chủ quản trị viên</title>
      </Helmet>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <NavbarQTV />
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
                      setIsGetRecruitmentReviewLeast(false);

                      if (e == 9) {
                        setIsGetRecruitmentReviewLeast(true);
                      }
                    }}
                  >
                    <TabPane tab={`Tất cả (${totalAll})`} key="6">
                      <div className="row">
                        <div className="col-2">
                          <PostFiltersForm onSubmit={handleFiltersChange} />
                        </div>
                        <div className="col-2">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue="Chọn ngành nghề"
                            onChange={(e) => {
                              if (e) {
                                // selectCareer(e);
                                // delete filters.tieuDe;
                                // delete filters.linhVuc;
                                // delete filters.diaDiem;
                                // delete filters.soNamKinhNghiem;
                                // delete filters.tuNgay;
                                // delete filters.denNgay;
                                // delete filters.viTri;
                                // delete filters.loaiCongViec;
                                setFilters({
                                  ...filters,
                                  page: 1,
                                  nganhNghe: e,
                                });
                              }
                            }}
                          >
                            {listCareers.map((career, index) => {
                              return (
                                <Option key={index} value={career.tenNganhNghe}>
                                  {career.tenNganhNghe}
                                </Option>
                              );
                            })}
                          </Select>
                        </div>
                        <div className="col-2">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue="Chọn cấp bậc"
                            onChange={(e) => {
                              // delete filters.tieuDe;
                              // delete filters.nganhNghe;
                              // delete filters.linhVuc;
                              // delete filters.soNamKinhNghiem;
                              // delete filters.tuNgay;
                              // delete filters.denNgay;
                              // delete filters.diaDiem;
                              // delete filters.loaiCongViec;
                              setFilters({
                                ...filters,
                                page: 1,
                                viTri: e,
                              });
                            }}
                          >
                            {levels.map((level, index) => {
                              return (
                                <Option key={index} value={level.capBac}>
                                  {level.capBac}
                                </Option>
                              );
                            })}
                          </Select>
                        </div>
                        <div className="col-3">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue={t("common.typeWork")}
                            onChange={(e) => {
                              // delete filters.tieuDe;
                              // delete filters.nganhNghe;
                              // delete filters.linhVuc;
                              // delete filters.soNamKinhNghiem;
                              // delete filters.tuNgay;
                              // delete filters.denNgay;
                              // delete filters.viTri;
                              // delete filters.diaDiem;
                              setFilters({
                                ...filters,
                                page: 1,
                                loaiCongViec: e,
                              });
                            }}
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
                        </div>
                        <div className="col-1">
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
                                        <strong>Tin tuyển dụng</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Hồ sơ</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Trạng thái</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
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
                                            <p className="text-sm mb-0">
                                              {item?.soLuotDanhGia == 0 ? (
                                                <span className="fst-italic">
                                                  Không có lượt đánh giá nào
                                                </span>
                                              ) : (
                                                <>
                                                  <span>
                                                    Số lượt đánh giá:{" "}
                                                  </span>
                                                  {item?.soLuotDanhGia}
                                                </>
                                              )}
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
                                            <span>{item?.trangThai}</span>
                                          </td>
                                          <td className=" cursor-pointer pointer align-middle">
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
                                                    "Chờ duyệt" ? (
                                                    <>
                                                      <li
                                                        onClick={() => {
                                                          handleAddButtonClickDetailAccept(
                                                            item?._id
                                                          );
                                                        }}
                                                      >
                                                        <span class="dropdown-item">
                                                          Duyệt
                                                        </span>
                                                      </li>
                                                      <li
                                                        onClick={() => {
                                                          handleAddButtonClickDetailDeny(
                                                            item?._id
                                                          );
                                                        }}
                                                      >
                                                        <span class="dropdown-item">
                                                          Từ chối
                                                        </span>
                                                      </li>
                                                    </>
                                                  ) : item?.trangThai ==
                                                    "Đã duyệt" ? (
                                                    <>
                                                      <li
                                                        onClick={() => {
                                                          handleAddButtonClickDetailBlock(
                                                            item?._id
                                                          );
                                                        }}
                                                      >
                                                        <span class="dropdown-item">
                                                          Khóa
                                                        </span>
                                                      </li>
                                                    </>
                                                  ) : item?.trangThai ==
                                                    "Khóa" ? (
                                                    <>
                                                      <li
                                                        onClick={() => {
                                                          handleAddButtonClickDetailBlock(
                                                            item?._id
                                                          );
                                                        }}
                                                      >
                                                        <span class="dropdown-item">
                                                          Mở khóa
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
                      tab={`Chờ xét duyệt (${totalChoDuyet ? totalChoDuyet : 0
                        })`}
                      key="1"
                    >
                      <div className="row">
                        <div className="col-2">
                          <PostFiltersForm onSubmit={handleFiltersChange} />
                        </div>
                        <div className="col-2">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue="Chọn ngành nghề"
                            onChange={(e) => {
                              if (e) {
                                // selectCareer(e);
                                // delete filters.tieuDe;
                                // delete filters.linhVuc;
                                // delete filters.diaDiem;
                                // delete filters.soNamKinhNghiem;
                                // delete filters.tuNgay;
                                // delete filters.denNgay;
                                // delete filters.viTri;
                                // delete filters.loaiCongViec;
                                setFilters({
                                  ...filters,
                                  page: 1,
                                  nganhNghe: e,
                                });
                              }
                            }}
                          >
                            {listCareers.map((career, index) => {
                              return (
                                <Option key={index} value={career.tenNganhNghe}>
                                  {career.tenNganhNghe}
                                </Option>
                              );
                            })}
                          </Select>
                        </div>
                        <div className="col-2">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue="Chọn cấp bậc"
                            onChange={(e) => {
                              // delete filters.tieuDe;
                              // delete filters.nganhNghe;
                              // delete filters.linhVuc;
                              // delete filters.soNamKinhNghiem;
                              // delete filters.tuNgay;
                              // delete filters.denNgay;
                              // delete filters.diaDiem;
                              // delete filters.loaiCongViec;
                              setFilters({
                                ...filters,
                                page: 1,
                                viTri: e,
                              });
                            }}
                          >
                            {levels.map((level, index) => {
                              return (
                                <Option key={index} value={level.capBac}>
                                  {level.capBac}
                                </Option>
                              );
                            })}
                          </Select>
                        </div>
                        <div className="col-3">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue={t("common.typeWork")}
                            onChange={(e) => {
                              // delete filters.tieuDe;
                              // delete filters.nganhNghe;
                              // delete filters.linhVuc;
                              // delete filters.soNamKinhNghiem;
                              // delete filters.tuNgay;
                              // delete filters.denNgay;
                              // delete filters.viTri;
                              // delete filters.diaDiem;
                              setFilters({
                                ...filters,
                                page: 1,
                                loaiCongViec: e,
                              });
                            }}
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
                        </div>
                        <div className="col-1">
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
                                        <strong>Tin tuyển dụng</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Hồ sơ</strong>
                                      </th>
                                      <th className="text-secondary text-center opacity-7 ps-2 text-center text-white py-3">
                                        <strong>Trạng thái</strong>
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
                                                    handleAddButtonClickDetailAccept(
                                                      item?._id
                                                    );
                                                  }}
                                                >
                                                  <span class="dropdown-item">
                                                    Duyệt
                                                  </span>
                                                </li>
                                                <li
                                                  onClick={() => {
                                                    handleAddButtonClickDetailDeny(
                                                      item?._id
                                                    );
                                                  }}
                                                >
                                                  <span class="dropdown-item">
                                                    Từ chối
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
                      tab={`Đã duyệt (${totalDaDuyet ? totalDaDuyet : 0})`}
                      key="2"
                    >
                      <div className="row">
                        <div className="col-2">
                          <PostFiltersForm onSubmit={handleFiltersChange} />
                        </div>
                        <div className="col-2">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue="Chọn ngành nghề"
                            onChange={(e) => {
                              if (e) {
                                // selectCareer(e);
                                // delete filters.tieuDe;
                                // delete filters.linhVuc;
                                // delete filters.diaDiem;
                                // delete filters.soNamKinhNghiem;
                                // delete filters.tuNgay;
                                // delete filters.denNgay;
                                // delete filters.viTri;
                                // delete filters.loaiCongViec;
                                setFilters({
                                  ...filters,
                                  page: 1,
                                  nganhNghe: e,
                                });
                              }
                            }}
                          >
                            {listCareers.map((career, index) => {
                              return (
                                <Option key={index} value={career.tenNganhNghe}>
                                  {career.tenNganhNghe}
                                </Option>
                              );
                            })}
                          </Select>
                        </div>
                        <div className="col-2">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue="Chọn cấp bậc"
                            onChange={(e) => {
                              // delete filters.tieuDe;
                              // delete filters.nganhNghe;
                              // delete filters.linhVuc;
                              // delete filters.soNamKinhNghiem;
                              // delete filters.tuNgay;
                              // delete filters.denNgay;
                              // delete filters.diaDiem;
                              // delete filters.loaiCongViec;
                              setFilters({
                                ...filters,
                                page: 1,
                                viTri: e,
                              });
                            }}
                          >
                            {levels.map((level, index) => {
                              return (
                                <Option key={index} value={level.capBac}>
                                  {level.capBac}
                                </Option>
                              );
                            })}
                          </Select>
                        </div>
                        <div className="col-3">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue={t("common.typeWork")}
                            onChange={(e) => {
                              // delete filters.tieuDe;
                              // delete filters.nganhNghe;
                              // delete filters.linhVuc;
                              // delete filters.soNamKinhNghiem;
                              // delete filters.tuNgay;
                              // delete filters.denNgay;
                              // delete filters.viTri;
                              // delete filters.diaDiem;
                              setFilters({
                                ...filters,
                                page: 1,
                                loaiCongViec: e,
                              });
                            }}
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
                        </div>
                        <div className="col-1">
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
                                        <strong>Tin tuyển dụng</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Hồ sơ</strong>
                                      </th>
                                      <th className="text-secondary text-center opacity-7 ps-2 text-center text-white py-3">
                                        <strong>Trạng thái</strong>
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
                                            <p className="text-sm mb-0">
                                              {item?.soLuotDanhGia == 0 ? (
                                                <span className="fst-italic">
                                                  Không có lượt đánh giá nào
                                                </span>
                                              ) : (
                                                <>
                                                  <span>
                                                    Số lượt đánh giá:{" "}
                                                  </span>
                                                  {item?.soLuotDanhGia}
                                                </>
                                              )}
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
                                                    handleAddButtonClickDetailBlock(
                                                      item?._id
                                                    );
                                                  }}
                                                >
                                                  <span class="dropdown-item">
                                                    Khóa
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
                        <div className="col-2">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue="Chọn ngành nghề"
                            onChange={(e) => {
                              if (e) {
                                // selectCareer(e);
                                // delete filters.tieuDe;
                                // delete filters.linhVuc;
                                // delete filters.diaDiem;
                                // delete filters.soNamKinhNghiem;
                                // delete filters.tuNgay;
                                // delete filters.denNgay;
                                // delete filters.viTri;
                                // delete filters.loaiCongViec;
                                setFilters({
                                  ...filters,
                                  page: 1,
                                  nganhNghe: e,
                                });
                              }
                            }}
                          >
                            {listCareers.map((career, index) => {
                              return (
                                <Option key={index} value={career.tenNganhNghe}>
                                  {career.tenNganhNghe}
                                </Option>
                              );
                            })}
                          </Select>
                        </div>
                        <div className="col-2">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue="Chọn cấp bậc"
                            onChange={(e) => {
                              // delete filters.tieuDe;
                              // delete filters.nganhNghe;
                              // delete filters.linhVuc;
                              // delete filters.soNamKinhNghiem;
                              // delete filters.tuNgay;
                              // delete filters.denNgay;
                              // delete filters.diaDiem;
                              // delete filters.loaiCongViec;
                              setFilters({
                                ...filters,
                                page: 1,
                                viTri: e,
                              });
                            }}
                          >
                            {levels.map((level, index) => {
                              return (
                                <Option key={index} value={level.capBac}>
                                  {level.capBac}
                                </Option>
                              );
                            })}
                          </Select>
                        </div>
                        <div className="col-3">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue={t("common.typeWork")}
                            onChange={(e) => {
                              // delete filters.tieuDe;
                              // delete filters.nganhNghe;
                              // delete filters.linhVuc;
                              // delete filters.soNamKinhNghiem;
                              // delete filters.tuNgay;
                              // delete filters.denNgay;
                              // delete filters.viTri;
                              // delete filters.diaDiem;
                              setFilters({
                                ...filters,
                                page: 1,
                                loaiCongViec: e,
                              });
                            }}
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
                        </div>
                        <div className="col-1">
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
                                        <strong>Tin tuyển dụng</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Hồ sơ</strong>
                                      </th>
                                      <th className="text-secondary text-center opacity-7 ps-2 text-center text-white py-3">
                                        <strong>Trạng thái</strong>
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
                                            <p className="text-sm mb-0">
                                              {item?.soLuotDanhGia == 0 ? (
                                                <span className="fst-italic">
                                                  Không có lượt đánh giá nào
                                                </span>
                                              ) : (
                                                <>
                                                  <span>
                                                    Số lượt đánh giá:{" "}
                                                  </span>
                                                  {item?.soLuotDanhGia}
                                                </>
                                              )}
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
                        <div className="col-2">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue="Chọn ngành nghề"
                            onChange={(e) => {
                              if (e) {
                                // selectCareer(e);
                                // delete filters.tieuDe;
                                // delete filters.linhVuc;
                                // delete filters.diaDiem;
                                // delete filters.soNamKinhNghiem;
                                // delete filters.tuNgay;
                                // delete filters.denNgay;
                                // delete filters.viTri;
                                // delete filters.loaiCongViec;
                                setFilters({
                                  ...filters,
                                  page: 1,
                                  nganhNghe: e,
                                });
                              }
                            }}
                          >
                            {listCareers.map((career, index) => {
                              return (
                                <Option key={index} value={career.tenNganhNghe}>
                                  {career.tenNganhNghe}
                                </Option>
                              );
                            })}
                          </Select>
                        </div>
                        <div className="col-2">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue="Chọn cấp bậc"
                            onChange={(e) => {
                              // delete filters.tieuDe;
                              // delete filters.nganhNghe;
                              // delete filters.linhVuc;
                              // delete filters.soNamKinhNghiem;
                              // delete filters.tuNgay;
                              // delete filters.denNgay;
                              // delete filters.diaDiem;
                              // delete filters.loaiCongViec;
                              setFilters({
                                ...filters,
                                page: 1,
                                viTri: e,
                              });
                            }}
                          >
                            {levels.map((level, index) => {
                              return (
                                <Option key={index} value={level.capBac}>
                                  {level.capBac}
                                </Option>
                              );
                            })}
                          </Select>
                        </div>
                        <div className="col-3">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue={t("common.typeWork")}
                            onChange={(e) => {
                              // delete filters.tieuDe;
                              // delete filters.nganhNghe;
                              // delete filters.linhVuc;
                              // delete filters.soNamKinhNghiem;
                              // delete filters.tuNgay;
                              // delete filters.denNgay;
                              // delete filters.viTri;
                              // delete filters.diaDiem;
                              setFilters({
                                ...filters,
                                page: 1,
                                loaiCongViec: e,
                              });
                            }}
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
                        </div>
                        <div className="col-1">
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
                                        <strong>Tin tuyển dụng</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Hồ sơ</strong>
                                      </th>
                                      <th className="text-secondary text-center opacity-7 ps-2 text-center text-white py-3">
                                        <strong>Trạng thái</strong>
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
                                            <p className="text-sm mb-0">
                                              {item?.soLuotDanhGia == 0 ? (
                                                <span className="fst-italic">
                                                  Không có lượt đánh giá nào
                                                </span>
                                              ) : (
                                                <>
                                                  <span>
                                                    Số lượt đánh giá:{" "}
                                                  </span>
                                                  {item?.soLuotDanhGia}
                                                </>
                                              )}
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
                                                    handleAddButtonClickDetailBlock(
                                                      item?._id
                                                    );
                                                  }}
                                                >
                                                  <span class="dropdown-item">
                                                    Mở khóa
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
                      tab={`Từ chối (${totalTuChoi ? totalTuChoi : 0})`}
                      key="4"
                    >
                      <div className="row">
                        <div className="col-2">
                          <PostFiltersForm onSubmit={handleFiltersChange} />
                        </div>
                        <div className="col-2">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue="Chọn ngành nghề"
                            onChange={(e) => {
                              if (e) {
                                // selectCareer(e);
                                // delete filters.tieuDe;
                                // delete filters.linhVuc;
                                // delete filters.diaDiem;
                                // delete filters.soNamKinhNghiem;
                                // delete filters.tuNgay;
                                // delete filters.denNgay;
                                // delete filters.viTri;
                                // delete filters.loaiCongViec;
                                setFilters({
                                  ...filters,
                                  page: 1,
                                  nganhNghe: e,
                                });
                              }
                            }}
                          >
                            {listCareers.map((career, index) => {
                              return (
                                <Option key={index} value={career.tenNganhNghe}>
                                  {career.tenNganhNghe}
                                </Option>
                              );
                            })}
                          </Select>
                        </div>
                        <div className="col-2">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue="Chọn cấp bậc"
                            onChange={(e) => {
                              // delete filters.tieuDe;
                              // delete filters.nganhNghe;
                              // delete filters.linhVuc;
                              // delete filters.soNamKinhNghiem;
                              // delete filters.tuNgay;
                              // delete filters.denNgay;
                              // delete filters.diaDiem;
                              // delete filters.loaiCongViec;
                              setFilters({
                                ...filters,
                                page: 1,
                                viTri: e,
                              });
                            }}
                          >
                            {levels.map((level, index) => {
                              return (
                                <Option key={index} value={level.capBac}>
                                  {level.capBac}
                                </Option>
                              );
                            })}
                          </Select>
                        </div>
                        <div className="col-3">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue={t("common.typeWork")}
                            onChange={(e) => {
                              // delete filters.tieuDe;
                              // delete filters.nganhNghe;
                              // delete filters.linhVuc;
                              // delete filters.soNamKinhNghiem;
                              // delete filters.tuNgay;
                              // delete filters.denNgay;
                              // delete filters.viTri;
                              // delete filters.diaDiem;
                              setFilters({
                                ...filters,
                                page: 1,
                                loaiCongViec: e,
                              });
                            }}
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
                        </div>
                        <div className="col-1">
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
                                        <strong>Tin tuyển dụng</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Hồ sơ</strong>
                                      </th>
                                      <th className="text-secondary text-center opacity-7 ps-2 text-center text-white py-3">
                                        <strong>Trạng thái</strong>
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
                                            <p className="text-sm mb-0">
                                              {item?.soLuotDanhGia == 0 ? (
                                                <span className="fst-italic">
                                                  Không có lượt đánh giá nào
                                                </span>
                                              ) : (
                                                <>
                                                  <span>
                                                    Số lượt đánh giá:{" "}
                                                  </span>
                                                  {item?.soLuotDanhGia}
                                                </>
                                              )}
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
                      tab={`Đánh giá kém (${totalReviewLeast ? totalReviewLeast : 0
                        })`}
                      key="9"
                    >
                      <div className="row">
                        <div className="col-3">
                          <PostFiltersForm onSubmit={handleFiltersChange} />
                        </div>
                        <div className="col-2">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue="Chọn ngành nghề"
                            onChange={(e) => {
                              if (e) {
                                // selectCareer(e);
                                // delete filters.tieuDe;
                                // delete filters.linhVuc;
                                // delete filters.diaDiem;
                                // delete filters.soNamKinhNghiem;
                                // delete filters.tuNgay;
                                // delete filters.denNgay;
                                // delete filters.viTri;
                                // delete filters.loaiCongViec;
                                setFilters({
                                  ...filters,
                                  page: 1,
                                  nganhNghe: e,
                                });
                              }
                            }}
                          >
                            {listCareers.map((career, index) => {
                              return (
                                <Option key={index} value={career.tenNganhNghe}>
                                  {career.tenNganhNghe}
                                </Option>
                              );
                            })}
                          </Select>
                        </div>
                        <div className="col-2">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue="Chọn cấp bậc"
                            onChange={(e) => {
                              // delete filters.tieuDe;
                              // delete filters.nganhNghe;
                              // delete filters.linhVuc;
                              // delete filters.soNamKinhNghiem;
                              // delete filters.tuNgay;
                              // delete filters.denNgay;
                              // delete filters.diaDiem;
                              // delete filters.loaiCongViec;
                              setFilters({
                                ...filters,
                                page: 1,
                                viTri: e,
                              });
                            }}
                          >
                            {levels.map((level, index) => {
                              return (
                                <Option key={index} value={level.capBac}>
                                  {level.capBac}
                                </Option>
                              );
                            })}
                          </Select>
                        </div>
                        <div className="col-3">
                          <Select
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            defaultValue={t("common.typeWork")}
                            onChange={(e) => {
                              // delete filters.tieuDe;
                              // delete filters.nganhNghe;
                              // delete filters.linhVuc;
                              // delete filters.soNamKinhNghiem;
                              // delete filters.tuNgay;
                              // delete filters.denNgay;
                              // delete filters.viTri;
                              // delete filters.diaDiem;
                              setFilters({
                                ...filters,
                                page: 1,
                                loaiCongViec: e,
                              });
                            }}
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
                        </div>
                        <div className="col-1">
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
                                        <strong>Tin tuyển dụng</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Hồ sơ</strong>
                                      </th>
                                      <th className="text-secondary text-center opacity-7 ps-2 text-center text-white py-3">
                                        <strong>Trạng thái</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-center text-white py-3">
                                        <strong>Thao tác</strong>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {recruitmentReviewLeast.map(
                                      (item, index) => {
                                        return (
                                          <tr key={index + 1}>
                                            <td className="align-middle">
                                              <p className="text-sm font-weight-bold mb-0 text-center">
                                                {index}
                                              </p>
                                            </td>
                                            <td>
                                              <p className="text-sm fw-bold mb-0">
                                                {item?.tinTuyenDung?.tieuDe}
                                              </p>
                                              <p className="text-sm mb-0">
                                                {
                                                  item?.tinTuyenDung?.diaDiem
                                                    ?.tinhThanhPho
                                                }{" "}
                                                :{" "}
                                                {
                                                  item?.tinTuyenDung?.diaDiem
                                                    ?.quanHuyen
                                                }
                                              </p>
                                              <p className="address">
                                                <span className="created">
                                                  Ngày tạo:{" "}
                                                  {TimeUtils.formatDateTime(
                                                    item?.tinTuyenDung?.ngayTao,
                                                    "DD-MM-YYYY"
                                                  )}
                                                </span>
                                                &nbsp;
                                                <span className="apply-date">
                                                  Hạn nộp:{" "}
                                                  {TimeUtils.formatDateTime(
                                                    item?.tinTuyenDung
                                                      ?.ngayHetHan,
                                                    "DD-MM-YYYY"
                                                  )}
                                                </span>
                                              </p>
                                              <p className="text-sm mb-0">
                                                {item?.soLuotDanhGia == 0 ? (
                                                  <span className="fst-italic">
                                                    Không có lượt đánh giá nào
                                                  </span>
                                                ) : (
                                                  <>
                                                    <span>
                                                      Số lượt đánh giá:{" "}
                                                    </span>
                                                    {item?.soLuotDanhGia}
                                                  </>
                                                )}
                                              </p>
                                              <p>
                                                <Link
                                                  to={`/job-detail/${item?.tinTuyenDung?._id}`}
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
                                              <span>
                                                {item?.tinTuyenDung?.trangThai}
                                              </span>
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
                                                    {item?.tinTuyenDung?.trangThai == 'Khóa' ? (
                                                      <li
                                                        onClick={() => {
                                                          handleAddButtonClickDetailBlock(
                                                            item?.tinTuyenDung?._id
                                                          );
                                                        }}
                                                      >
                                                        <span class="dropdown-item">
                                                          Mở khóa
                                                        </span>
                                                      </li>
                                                    ) : item?.tinTuyenDung?.trangThai == 'Đã duyệt' ? (
                                                      <li
                                                        onClick={() => {
                                                          handleAddButtonClickDetailBlock(
                                                            item?.tinTuyenDung?._id
                                                          );
                                                        }}
                                                      >
                                                        <span class="dropdown-item">
                                                          Khóa
                                                        </span>
                                                      </li>
                                                    )
                                                      : (null)}
                                                  </>
                                                  <li
                                                    onClick={() => {
                                                      handleAddButtonClickDetailDelete(
                                                        item?.tinTuyenDung?._id
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
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        {recruitmentReviewLeast.length < 1 && (
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
                          {recruitmentReviewLeast.length !== 0 && (
                            <Pagination
                              onPageChange={handlePageChange}
                              pagination={pagination}
                            />
                          )}
                        </div>
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
export default DashBoardQTV;
