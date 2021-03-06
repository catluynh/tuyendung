import { Layout, Menu, Breadcrumb, Input, Tooltip, Button } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
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

const { Option } = Select;

const { TabPane } = Tabs;
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const DashBoardQTVEmployer = () => {
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
  const [value, setValue] = useState(0);

  const getDataListFilters = async () => {
    const requestUrl = `http://ec2-13-213-53-29.ap-southeast-1.compute.amazonaws.com:4000/nhaTuyenDungs?${paramsString}`;
    try {
      const response = await axios.get(requestUrl);
      setRecruitments(response.data.data);
      setTotalCount(response?.data?.pagination?.total?.tong);
      setPagination(response?.data?.pagination);
      setIsSubmit(false);
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
      // tieuDe: newFilters.searchTerm,
    });
  };
  const [totalStatus, setTotalStatus] = useState();
  const [totalDungTuyen, setTotalDungTuyen] = useState();
  const [totalChoDuyet, setTotalChoDuyet] = useState();
  const [totalKhoa, setTotalKhoa] = useState();
  const [totalDaDuyet, setTotalDaDuyet] = useState();
  const [totalTuChoi, setTotalTuChoi] = useState();
  const [totalAll, setTotalAll] = useState();

  useEffect(() => {
    const getTotalStatus = async () => {
      const requestUrl = `http://ec2-13-213-53-29.ap-southeast-1.compute.amazonaws.com:4000/tinTuyenDungs/tongSoTinTheoTrangThai`;
      try {
        const response = await axios.get(requestUrl).then((res) => {
          res.data.data.map((item) => {
            if (item.trangThai == "D???ng tuy???n") setTotalDungTuyen(item.tong);
            if (item.trangThai == "Ch??? duy???t") setTotalChoDuyet(item.tong);
            if (item.trangThai == "Kh??a") setTotalKhoa(item.tong);
            if (item.trangThai == "???? duy???t") setTotalDaDuyet(item.tong);
            if (item.trangThai == "T??? ch???i") setTotalTuChoi(item.tong);
          });
        });

        setTotalStatus(response.data.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    getTotalStatus();
  }, []);
  const [isGetRecruitmentReviewLeast, setIsGetRecruitmentReviewLeast] =
    useState(false);
  const [recruitmentReviewLeast, setRecruitmentReviewLeast] = useState([]);
  useEffect(() => {
    const getRecruitmentReviewLeast = async () => {
      const requestUrl = `http://ec2-13-213-53-29.ap-southeast-1.compute.amazonaws.com:4000/tinTuyenDungs/tinTuyenDungCoNguyCoKhoa`;
      try {
        const response = await axios.get(requestUrl);
        setRecruitmentReviewLeast(response?.data?.data);
        console.log("response getRecruitmentReviewLeast", response);
      } catch (error) {
        console.log(error.response);
      }
    };
    getRecruitmentReviewLeast();
  }, [isGetRecruitmentReviewLeast]);

  //Kh??a t??i kho???n
  const handleAddButtonClickBlock = async (id) => {
    const requestUrl = `http://ec2-13-213-53-29.ap-southeast-1.compute.amazonaws.com:4000/quanTriViens/khoataikhoan/${id}`;
    try {
      const response = await axios.patch(requestUrl).then((res) => {
        if (res?.data?.status == "success") {
          setIsSubmit(true);
          toast.success("C???p nh???t th??nh c??ng", {
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

  //M??? kh??a t??i kho???n
  const handleAddButtonClickUnBlock = async (id) => {
    const requestUrl = `http://ec2-13-213-53-29.ap-southeast-1.compute.amazonaws.com:4000/quanTriViens/motaikhoan/${id}`;
    try {
      const response = await axios.patch(requestUrl).then((res) => {
        if (res?.data?.status == "success") {
          setIsSubmit(true);
          toast.success("C???p nh???t th??nh c??ng", {
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
    getDataListFilters();
  }, [isSubmit]);

  return (
    <Fragment>
      <Helmet>
        <title>[Admin] - Trang ch??? qu???n tr??? vi??n</title>
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
              <Breadcrumb.Item>T???ng quan</Breadcrumb.Item>
              <Breadcrumb.Item>Qu???n l?? nh?? tuy???n d???ng</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background bg-white"
              style={{
                padding: 24,
                minHeight: 360,
              }}
            >
              <strong>T???t c??? nh?? tuy???n d???ng</strong>
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
                    <TabPane
                      tab={`T???t c??? (${totalCount ? totalCount : 0})`}
                      key="6"
                    >
                      <div className="row">
                        <div className="col-2">
                          <PostFiltersForm onSubmit={handleFiltersChange} />
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
                            <RiRefreshLine className="me-2" /> L??m m???i
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
                                        <strong> T??n c??ng ty</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>?????a ch???</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>S??? ??i???n tho???i</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Email</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Tr???ng th??i</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-center text-white py-3">
                                        <strong>Thao t??c</strong>
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
                                              {item?.tenCongty}
                                            </p>
                                            <p className="address">
                                              <span className="created">
                                                Quy m??: {item?.quyMo} nh??n vi??n
                                              </span>
                                            </p>

                                            <p className="address">
                                              <span className="created">
                                                Ng??y t???o:{" "}
                                                {TimeUtils.formatDateTime(
                                                  item?.namThanhLap,
                                                  "DD-MM-YYYY"
                                                )}
                                              </span>
                                            </p>
                                            <p>
                                              <Link
                                                to={`/company/${item?._id}`}
                                                target="_blank"
                                              >
                                                Xem th??ng tin tr??n website
                                              </Link>
                                            </p>
                                          </td>
                                          <td className="align-middle">
                                            <span className="text-xs font-weight-bold d-flex align-items-center  text-center">
                                              <span>{item?.diaChi}</span>
                                            </span>
                                          </td>
                                          <td className="text-center align-middle">
                                            <span>{item?.sdt}</span>
                                          </td>
                                          <td className="text-center align-middle">
                                            <span>{item?.email}</span>
                                          </td>
                                          <td className="text-center align-middle">
                                            {item?.taiKhoan?.trangThai ? (
                                              <span>Ho???t ?????ng</span>
                                            ) : (
                                              <span>Kh??a</span>
                                            )}
                                          </td>
                                          <td
                                            className="text-center cursor-pointer align-middle pointer"
                                            onClick={(e) => {
                                              console.log("e", e);
                                            }}
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
                                                Chi ti???t
                                              </button>
                                              <ul
                                                class="dropdown-menu"
                                                aria-labelledby="dropdownMenuButton1"
                                              >
                                                <li>
                                                  <span class="dropdown-item">
                                                    Xem
                                                  </span>
                                                </li>
                                                {item?.taiKhoan?.trangThai ? (
                                                  <li
                                                    onClick={() => {
                                                      handleAddButtonClickBlock(
                                                        item?._id
                                                      );
                                                    }}
                                                  >
                                                    <span class="dropdown-item">
                                                      Kh??a
                                                    </span>
                                                  </li>
                                                ) : (
                                                  <li
                                                    onClick={() => {
                                                      handleAddButtonClickUnBlock(
                                                        item?._id
                                                      );
                                                    }}
                                                  >
                                                    <span class="dropdown-item">
                                                      M??? kh??a
                                                    </span>
                                                  </li>
                                                )}
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
                              Kh??ng c?? d??? li???u
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
            Ant Design ??2018 Created by Trung Vinh
          </Footer>
        </Layout>
      </Layout>
    </Fragment>
  );
};
export default DashBoardQTVEmployer;
