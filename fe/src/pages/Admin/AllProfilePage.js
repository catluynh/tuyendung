import {
  Layout,
  Menu,
  Breadcrumb,
  Input,
  Tooltip,
  Button,
  Dropdown,
  Modal,
} from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import React, { Fragment, useEffect, useMemo, useState } from "react";
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
import ModalProfileDetail from "./components/modals/ModalProfileDetail";
import axiosClient from "../../services/axiosClient";
import { toast } from "react-toastify";
import NavbarAdmin from "./components/navbar/NavbarAdmin";
import { RiRefreshLine } from "react-icons/ri";

const { Option } = Select;

const { TabPane } = Tabs;
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const AllProfilePage = () => {
  const [isSubmit, setIsSubmit] = useState([]);
  const [collapsed, setCollapsed] = React.useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalProducts: 1,
  });

  const [recruitments, setRecruitments] = useState([]);

  const [value, setValue] = useState(0);
  useEffect(() => {
    const paramsString = queryString.stringify(filters);
    console.log("paramsString", paramsString);
  }, [filters]);
  //HANDLE PAGINATION
  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage.selected + 1,
    });
  };

  const getDataListFilters = async () => {
    const paramsString = queryString.stringify(filters);
    try {
      const response = await RecruitmentApi.getListProfile(paramsString);
      const a = recruitments.find((yeuCauDoTuoi) => (yeuCauDoTuoi = true));
      setRecruitments(response.data);
      setPagination(response.pagination);
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
      let total = 0;
      const requestUrl = `http://ec2-13-213-53-29.ap-southeast-1.compute.amazonaws.com:4000/donUngTuyens/demDonUngTuyenTheoTrangThai`;
      try {
        const response = await axiosClient.get(requestUrl).then((res) => {
          res.data.map((item) => {
            if (item.trangThai == "??ang ???ng tuy???n") setTotalDangUT(item.tong);
            if (item.trangThai == "???? ???ng tuy???n") setTotalDaUT(item.tong);
            if (item.trangThai == "Th???t b???i") setTotalTuChoi(item.tong);
            total = total + item.tong;
            setTotalAll(total);
            setIsSubmit(false);
          });
        });
      } catch (error) {
        console.log(error.response);
      }
    };
    getTotalApplication();
  }, []);

  // ???ng vi??m ti???m n??ng
  const handleAddButtonClickTalent = async (id) => {
    try {
      const requestUrl = `http://ec2-13-213-53-29.ap-southeast-1.compute.amazonaws.com:4000/donUngTuyens/themDonUngTuyenTiemNang/${id}`;
      await axios.patch(requestUrl).then((res) => {
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

  // Modal confirm don ung tuyen
  const confirmDeleteProfile = (id) =>
    Modal.confirm({
      title: `B???n ch???c ch???n mu???n x??a ????n ???ng tuy???n n??y?`,
      // content: "first",
      onOk: async () => {
        try {
          const requestUrl = `http://ec2-13-213-53-29.ap-southeast-1.compute.amazonaws.com:4000/donUngTuyens/${id}`;
          await axios.delete(requestUrl).then((res) => {
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
          Modal.error({
            title: "error",
            content: error.message,
          });
        }
      },
    });

  useEffect(() => {
    getDataListFilters();
  }, [isSubmit]);

  return (
    <Fragment>
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
              <Breadcrumb.Item>T???ng quan</Breadcrumb.Item>
              <Breadcrumb.Item>T???t c??? ????n ???ng tuy???n</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background bg-white"
              style={{
                padding: 24,
                minHeight: 360,
              }}
            >
              <strong>T???t c??? ????n ???ng tuy???n</strong>
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
                      tab={`T???t c??? (${totalAll ? totalAll : 0})`}
                      key="4"
                    >
                      <div className="row">
                        <div className="col-2">
                          <PostFiltersForm
                            onSubmit={handleFiltersChange}
                            title="T??n tin tuy???n d???ng"
                          />
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
                                        <strong> Th??ng tin ???ng vi??n</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Tin tuy???n d???ng</strong>
                                      </th>
                                      <th className="text-secondary text-center opacity-7 ps-2 text-center text-white py-3">
                                        <strong> Tr???ng th??i</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-center text-white py-3">
                                        <strong>Thao t??c</strong>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {recruitments.map((item, index) => {
                                      const {
                                        ungTuyenVien,
                                        tinTuyenDung,
                                        trangThai,
                                        thongTinLienHe
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
                                              {thongTinLienHe?.ten}
                                            </p>
                                            <p className="text-sm mb-0">
                                              {thongTinLienHe?.sdt}
                                            </p>
                                            <p className="text-sm mb-0">
                                              {thongTinLienHe?.email}
                                            </p>
                                            <p className="address">
                                              <span className="created">
                                                Ng??y n???p:{" "}
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
                                                Xem th??ng tin ???ng tuy???n vi??n
                                              </span>
                                            </p>
                                          </td>
                                          <td className="">
                                            <p className="text-sm fw-bold mb-0">
                                              {tinTuyenDung?.tieuDe}
                                            </p>
                                            <p className="text-sm mb-0">
                                              S??? l?????ng tuy???n :{" "}
                                              {tinTuyenDung?.soLuongTuyen}
                                            </p>
                                            <p className="text-sm mb-0">
                                              S??? l?????ng ???? tuy???n:{" "}
                                              {tinTuyenDung?.soLuongDaTuyen}
                                            </p>

                                            <p className="text-sm mb-0">
                                              Khu v???c:{" "}
                                              {tinTuyenDung?.diaDiem
                                                ?.tinhThanhPho +
                                                "-" +
                                                tinTuyenDung?.diaDiem
                                                  ?.quanHuyen}
                                            </p>
                                            <p className="text-sm mb-0">
                                              Ng??y h???t h???n:{" "}
                                              {TimeUtils.formatDateTime(
                                                tinTuyenDung?.ngayHetHan,
                                                "DD-MM-YYYY"
                                              )}{" "}
                                            </p>
                                          </td>
                                          <td className="text-center align-middle">
                                            <>
                                              {trangThai == "Th???t b???i" ? (
                                                <span>T??? ch???i</span>
                                              ) : trangThai ==
                                                "???? ???ng tuy???n" ? (
                                                <span>Ch???p nh???n</span>
                                              ) : (
                                                <span>{trangThai}</span>
                                              )}
                                            </>
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
                                                Chi ti???t
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
                                                <li
                                                  onClick={() => {
                                                    handleAddButtonClickTalent(
                                                      item?.donTuyenDung._id
                                                    );
                                                  }}
                                                >
                                                  <>
                                                    {trangThai ==
                                                    "Th???t b???i" ? null : (
                                                      <span class="dropdown-item">
                                                        ???ng vi??n ti???m n??ng
                                                      </span>
                                                    )}
                                                  </>
                                                </li>
                                                <li
                                                  onClick={() => {
                                                    confirmDeleteProfile(
                                                      item?.donTuyenDung?._id
                                                    );
                                                  }}
                                                >
                                                  <span class="dropdown-item">
                                                    X??a
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
                    <TabPane
                      tab={`??ang ???ng tuy???n (${totalDangUT ? totalDangUT : 0})`}
                      key="1"
                    >
                      <div className="row">
                        <div className="col-2">
                          <PostFiltersForm onSubmit={handleFiltersChange} />
                        </div>
                        <div className="col-2">
                          <Select
                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Th???i gian n???p ????n"
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
                            <Option value="jack">????ng g???n nh???t</Option>
                            <Option value="lucy">????ng c?? nh???t</Option>
                          </Select>
                        </div>
                        {/* <div className="col-1 me-3">
                          <Button
                            style={{ width: "120px" }}
                            className="d-flex align-items-center justify-content-center"
                            type="primary"
                            icon={<SearchOutlined />}
                          >
                            T??m ki???m
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
                            L??m m???i
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
                                        <strong> Th??ng tin ???ng vi??n</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Tin tuy???n d???ng</strong>
                                      </th>
                                      <th className="text-secondary text-center opacity-7 ps-2 text-center text-white py-3">
                                        <strong> Tr???ng th??i</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-center text-white py-3">
                                        <strong>Thao t??c</strong>
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
                                                Ng??y n???p:{" "}
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
                                                Xem th??ng tin ???ng tuy???n vi??n
                                              </span>
                                            </p>
                                          </td>
                                          <td className="">
                                            <p className="text-sm fw-bold mb-0">
                                              {tinTuyenDung?.tieuDe}
                                            </p>
                                            <p className="text-sm mb-0">
                                              S??? l?????ng tuy???n :{" "}
                                              {tinTuyenDung?.soLuongTuyen}
                                            </p>
                                            <p className="text-sm mb-0">
                                              S??? l?????ng ???? tuy???n:{" "}
                                              {tinTuyenDung?.soLuongDaTuyen}
                                            </p>

                                            <p className="text-sm mb-0">
                                              Khu v???c:{" "}
                                              {tinTuyenDung?.diaDiem
                                                ?.tinhThanhPho +
                                                "-" +
                                                tinTuyenDung?.diaDiem
                                                  ?.quanHuyen}
                                            </p>
                                            <p className="text-sm mb-0">
                                              Ng??y h???t h???n:{" "}
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
                                                Chi ti???t
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
                                                <li
                                                  onClick={() => {
                                                    handleAddButtonClickTalent(
                                                      item?.donTuyenDung._id
                                                    );
                                                  }}
                                                >
                                                  <span class="dropdown-item">
                                                    ???ng vi??n ti???m n??ng
                                                  </span>
                                                </li>
                                                <li
                                                  onClick={() => {
                                                    confirmDeleteProfile(
                                                      item?.donTuyenDung?._id
                                                    );
                                                  }}
                                                >
                                                  <span class="dropdown-item">
                                                    X??a
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
                    <TabPane
                      tab={`Ch???p nh???n (${totalDaUT ? totalDaUT : 0})`}
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
                            <RiRefreshLine className="me-2" />
                            L??m m???i
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
                                        <strong> Th??ng tin ???ng vi??n</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Tin tuy???n d???ng</strong>
                                      </th>
                                      <th className="text-secondary text-center opacity-7 ps-2 text-center text-white py-3">
                                        <strong> Tr???ng th??i</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-center text-white py-3">
                                        <strong>Thao t??c</strong>
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
                                                Ng??y n???p:{" "}
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
                                                Xem th??ng tin ???ng tuy???n vi??n
                                              </span>
                                            </p>
                                          </td>
                                          <td className="">
                                            <p className="text-sm fw-bold mb-0">
                                              {tinTuyenDung?.tieuDe}
                                            </p>
                                            <p className="text-sm mb-0">
                                              S??? l?????ng tuy???n :{" "}
                                              {tinTuyenDung?.soLuongTuyen}
                                            </p>
                                            <p className="text-sm mb-0">
                                              S??? l?????ng ???? tuy???n:{" "}
                                              {tinTuyenDung?.soLuongDaTuyen}
                                            </p>

                                            <p className="text-sm mb-0">
                                              Khu v???c:{" "}
                                              {tinTuyenDung?.diaDiem
                                                ?.tinhThanhPho +
                                                "-" +
                                                tinTuyenDung?.diaDiem
                                                  ?.quanHuyen}
                                            </p>
                                            <p className="text-sm mb-0">
                                              Ng??y h???t h???n:{" "}
                                              {TimeUtils.formatDateTime(
                                                tinTuyenDung?.ngayHetHan,
                                                "DD-MM-YYYY"
                                              )}{" "}
                                            </p>
                                          </td>
                                          <td className="text-center align-middle">
                                            {trangThai == "???? ???ng tuy???n" && (
                                              <span>Ch???p nh???n</span>
                                            )}
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
                                                Chi ti???t
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
                                                <li
                                                  onClick={() => {
                                                    handleAddButtonClickTalent(
                                                      item?.donTuyenDung._id
                                                    );
                                                  }}
                                                >
                                                  <span class="dropdown-item">
                                                    ???ng vi??n ti???m n??ng
                                                  </span>
                                                </li>
                                                <li
                                                  onClick={() => {
                                                    confirmDeleteProfile(
                                                      item?.donTuyenDung?._id
                                                    );
                                                  }}
                                                >
                                                  <span class="dropdown-item">
                                                    X??a
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
                              Kh??ng c?? d??? li???u
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
                      tab={`T??? ch???i(${totalTuChoi ? totalTuChoi : 0})`}
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
                                        <strong> Th??ng tin ???ng vi??n</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-white py-3">
                                        <strong>Tin tuy???n d???ng</strong>
                                      </th>
                                      <th className="text-secondary text-center opacity-7 ps-2 text-center text-white py-3">
                                        <strong> Tr???ng th??i</strong>
                                      </th>
                                      <th className="text-secondary opacity-7 ps-2 text-center text-white py-3">
                                        <strong>Thao t??c</strong>
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
                                                Ng??y n???p:{" "}
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
                                                Xem th??ng tin ???ng tuy???n vi??n
                                              </span>
                                            </p>
                                          </td>
                                          <td className="">
                                            <p className="text-sm fw-bold mb-0">
                                              {tinTuyenDung?.tieuDe}
                                            </p>
                                            <p className="text-sm mb-0">
                                              S??? l?????ng tuy???n :{" "}
                                              {tinTuyenDung?.soLuongTuyen}
                                            </p>
                                            <p className="text-sm mb-0">
                                              S??? l?????ng ???? tuy???n:{" "}
                                              {tinTuyenDung?.soLuongDaTuyen}
                                            </p>

                                            <p className="text-sm mb-0">
                                              Khu v???c:{" "}
                                              {tinTuyenDung?.diaDiem
                                                ?.tinhThanhPho +
                                                "-" +
                                                tinTuyenDung?.diaDiem
                                                  ?.quanHuyen}
                                            </p>
                                            <p className="text-sm mb-0">
                                              Ng??y h???t h???n:{" "}
                                              {TimeUtils.formatDateTime(
                                                tinTuyenDung?.ngayHetHan,
                                                "DD-MM-YYYY"
                                              )}{" "}
                                            </p>
                                          </td>
                                          <td className="text-center align-middle">
                                            <>
                                              {trangThai == "Th???t b???i" && (
                                                <span>T??? ch???i</span>
                                              )}
                                            </>
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
                                                Chi ti???t
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
                                                <li
                                                  onClick={() => {
                                                    confirmDeleteProfile(
                                                      item?.donTuyenDung?._id
                                                    );
                                                  }}
                                                >
                                                  <span class="dropdown-item">
                                                    X??a
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
                              Kh??ng c?? d??? li???u
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
            {renderModalProfile}
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
export default AllProfilePage;
