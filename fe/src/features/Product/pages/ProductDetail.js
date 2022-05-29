import {
  Avatar,
  Button,
  Col,
  Comment,
  Layout,
  Row,
  Tabs,
  Timeline,
  Tooltip,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import React, {
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { BiPaperPlane } from "react-icons/bi";
import {
  Redirect,
  useHistory,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import FooterHome from "../../../components/Footer/FooterHome";
import JobProvider from "../../../components/JobHome/context/jobCommonContext";
import MainNavigation from "../../../components/Layout/MainNavigation";
import SearchCommon from "../../../components/Search";
import { useCommonContext } from "../../../components/Search/context/commonContext";
import RecruitmentApi from "../../../services/recruitmentApi";
import ProductCompanyGeneralInfomation from "../components/ProductCompanyGeneralInfomation";
import ProductGeneralInfomation from "../components/ProductGeneralInfomation";
import ProductHeader from "../components/ProductHeader";
import { ProductContext, useProductContext } from "../context/ProductContext";
import { HeartOutlined } from "@ant-design/icons";
import InterestedJobApi from "../../../services/interestedJobApi";
import { toast } from "react-toastify";
import { getUserProfile } from "../../../utils/localStorage";
import ApplyJobModal from "../components/modal/ApplyJobModal";
import CandidateApplicationForm from "../../../services/candidateApplicationForm";
import { useSelector } from "react-redux";
import moment from "moment";
import { AiFillStar } from "react-icons/ai";
import ReviewApi from "../../../services/reviewApi";
import TimeUtils from "../../../utils/timeUtils";
import queryString from "query-string";
import axios from "axios";
import JobList from "../../../components/RelatedJobs/components/JobList";

const { TabPane } = Tabs;

const ProductDetail = (props) => {
  const { t } = useTranslation();
  const params = useParams();
  const { slug } = params;
  const match = useRouteMatch();
  const { isSubmit, setIsSubmit, detail, setDetail } = useProductContext();
  const { location, listCareers, companyFields } = useCommonContext();
  const [phucLois, setPhucLois] = useState(detail.phucLoi || "");
  const [moTas, setMoTas] = useState(detail.moTa || "");
  const [yeuCaus, setYeuCaus] = useState(detail.yeuCau || "");
  const [isShowModal, setIsShowModal] = useState(false);
  const [checkAppliedJob, setCheckAppliedJob] = useState();
  const [role, setRole] = useState();
  const history = useHistory();
  const { isAuthenticated } = useSelector((state) => state?.userLogin);
  const userId = useSelector((state) => state?.userLogin?.user?.taiKhoan._id);
  const [reviews, setReviews] = useState([]);
  const [filterReview, setFilterReview] = useState({});
  const [filterRelatedJob, setFilterRelatedJob] = useState({
    limit: 20,
    page: 1,
    trangThai: 2,
  });
  const [recruitmentsLinhVuc, setRecruitmentsLinhVuc] = useState([]);
  // Việc làm liên quan
  const getListRelatedJob = async () => {
    const paramsString = queryString.stringify(filterRelatedJob);
    try {
      const response = await RecruitmentApi.getListRecruitmentFilterParams(
        filterRelatedJob
      );
      setRecruitmentsLinhVuc(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const paramsString = queryString.stringify(filterReview);
  const getListTabReveiew = async () => {
    try {
      const params = {
        paramsString,
      };
      const response = await ReviewApi.getReviewFilterById(
        slug,
        params.paramsString
      );
      setReviews(response);
    } catch (error) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    getListTabReveiew();
  }, [filterReview]);

  //CALL API
  const getListReviewById = async () => {
    // setLoading(true);
    try {
      const response = await ReviewApi.getReviewById(slug);
      setReviews(response);
      // setLoading(false);
    } catch (error) {
      // setLoading(false);
      console.log("error", error);
    }
  };
  useEffect(() => {
    getListReviewById();
  }, []);

  useEffect(() => {
    getListRelatedJob();
  }, [filterRelatedJob]);

  //CALL API
  const getRecruitmentByIdAndStatus = async () => {
    // setLoading(true);
    try {
      const response = await RecruitmentApi.getRecruitmentByIdAndStatus(
        slug,
        user?.taiKhoan._id
      );
      if (response?.data.length === 0) {
        history.push("/404-error");
      } else {
        setDetail(response?.data);
        setCheckAppliedJob(response?.checkUngTuyen);
        setPhucLois(response?.data.phucLoi);
        setYeuCaus(response?.data.yeuCau);
        setMoTas(response?.data.moTa);
        setRole(user?.taiKhoan.loaiTaiKhoan);
        // setLoading(false);
      }
    } catch (error) {
      // setLoading(false);
      console.log("error", error);
    }
  };

  const splitRequirement = () => {
    if (yeuCaus.indexOf(".") > -1) {
      let values = yeuCaus.split(".");
      return values.map((value, index) => (
        <Timeline.Item key={index} color="gray">
          {value}
        </Timeline.Item>
      ));
    }
  };

  const splitDescription = () => {
    if (moTas.indexOf(".") > -1) {
      let values = moTas.split(".");
      return values.map((value, index) => (
        <Timeline.Item key={index} color="gray">
          {value}
        </Timeline.Item>
      ));
    }
  };

  const splitPhucLoi = () => {
    if (phucLois.indexOf(".") > -1) {
      let values = phucLois.split(".");
      return values.map((value, index) => (
        <Timeline.Item key={index} color="gray">
          {value}
        </Timeline.Item>
      ));
    }
  };
  const user = getUserProfile();
  const handleSubmitFavorite = async () => {
    const payload = {
      tinTuyenDung: props?.jobs?._id,
      ungTuyenVien: user?.taiKhoan._id,
    };
    try {
      const response = await InterestedJobApi.creatInterestedJob(payload);
      if (response.status === "success") {
        toast.success("Lưu việc làm quan tâm thành công", {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response);
      console.log(error.response);
    }
  };

  useEffect(() => {
    let timeout = null;
    if (slug) {
      timeout = setTimeout(() => getRecruitmentByIdAndStatus(), 1000);
    }
    return () => clearTimeout(timeout);
  }, [slug, user?.taiKhoan._id]);

  const handleSubmitModal = async (payload) => {
    try {
      await CandidateApplicationForm.createApplicationForm(payload);
      // setDetail(response);
      // setIsSuccessSubmit(true);
      toast.success("Ứng tuyển thành công", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error(error.response?.data.message, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const renderModalApplyJob = useMemo(() => {
    if (!isShowModal) return null;

    return (
      <ApplyJobModal
        showModal={isShowModal}
        onCloseModal={() => {
          setIsShowModal(false);
          // clearErrors();
        }}
        onSubmit={handleSubmitModal}
        // detail={detail}
        // isEdit={isEdit}
      />
    );
  }, [isShowModal]);

  const handleAddButtonClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      setIsShowModal(true);
    } else {
      history.replace("/login");
    }
  };
  const [totalFirstStar, setTotalFirstStar] = useState();
  const [totalSecondStar, setTotalSecondStar] = useState();
  const [totalThreeStar, setTotalThreeStar] = useState();
  const [totalFourStar, setTotalFourStar] = useState();
  const [totalFiveStar, setTotalFiveStar] = useState();
  const [totalAll, setTotalAll] = useState();

  useEffect(() => {
    const getTotalStatus = async () => {
      const requestUrl = `http://ec2-13-213-53-29.ap-southeast-1.compute.amazonaws.com:4000/danhGias/demDanhGiaTheoXepLoai/${slug}`;
      try {
        const response = await axios.get(requestUrl).then((res) => {
          let total = 0;
          res.data.data.map((item) => {
            if (item.danhGia.xepLoai == 1) setTotalFirstStar(item.tong);
            if (item.danhGia.xepLoai == 2) setTotalSecondStar(item.tong);
            if (item.danhGia.xepLoai == 3) setTotalThreeStar(item.tong);
            if (item.danhGia.xepLoai == 4) setTotalFourStar(item.tong);
            if (item.danhGia.xepLoai == 5) setTotalFiveStar(item.tong);
            total = total + item.tong;
            setTotalAll(total);
          });
        });
        // setTotalStatus(response.data.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    getTotalStatus();
  }, []);

  return (
    <Fragment>
      <Helmet>
        <title>Product Detail | jobboard.com</title>
      </Helmet>
      <MainNavigation />
      <div className="mt-65">
        <SearchCommon
          careers={listCareers}
          fields={companyFields}
          locations={location}
        />
      </div>

      <Layout>
        <JobProvider>
          <div className="container bottom-footer">
            <Content>
              <div className="bg-white px-3 mt-4 mb-2 py-3">
                <ProductHeader
                  tieuDe={detail.tieuDe}
                  companyInfo={detail.nhaTuyenDung}
                  ngayHetHan={detail.ngayHetHan}
                  checkAppliedJob={checkAppliedJob}
                  role={role}
                />
              </div>
              <div className="my-2">
                <div className="card-container my-3 py-3">
                  <Tabs
                    defaultActiveKey="1"
                    style={{ width: "100%" }}
                    onChange={(key) => {
                      if (key == 3) {
                        console.log("key", key);
                        setFilterRelatedJob({
                          ...filterRelatedJob,
                          nganhNghe: detail?.nganhNghe?.tenNganhNghe,
                        });
                      }
                    }}
                  >
                    <TabPane tab={t("productDetail.tabs.header.tab1")} key="1">
                      <div className="px-3 py-3 bg-white ">
                        <ProductGeneralInfomation
                          viTri={detail.viTri}
                          soLuongTuyen={detail?.soLuongTuyen}
                          kinhNghiem={detail?.soNamKinhNghiem}
                          gioiTinh={detail?.gioiTinh}
                          mucLuong={detail?.mucLuong}
                          hinhThucLamViec={detail?.loaiCongViec}
                          moTa={splitDescription()}
                          yeuCau={splitRequirement()}
                          phucLoi={splitPhucLoi()}
                          diaDiem={detail?.diaDiem}
                          nganhNghe={detail?.nganhNghe}
                          tuoiTu={detail?.tuoiTu}
                          denTuoi={detail?.denTuoi}
                        />
                      </div>
                      {/* Mô tả công việc */}
                      <div className="px-3 py-3 bg-white ">
                        <Row gutter={[32, 8]}>
                          <Col span={24}>
                            <div className="px-3 mt-3">
                              <Row>
                                <Col span={24}>
                                  <div>
                                    <p className="fw-bolder mb-3">
                                      Cách thức ứng tuyển
                                    </p>
                                    <span className="pb-1">
                                      Ứng viên nộp hồ sơ trực tuyến bằng cách
                                      bấm{" "}
                                      <span className="text-highlight fw-bold">
                                        Ứng tuyển ngay{" "}
                                      </span>
                                      dưới đây.
                                    </span>
                                    <Row gutter={[32, 8]}>
                                      <Col span={6}>
                                        <>
                                          {checkAppliedJob == false ? (
                                            role == "nha_tuyen_dung" ? (
                                              <Button
                                                disabled={true}
                                                className="form-control d-flex align-items-center justify-content-center py-4 my-4"
                                                type="primary"
                                                icon={<BiPaperPlane />}
                                                onClick={handleAddButtonClick}
                                              >
                                                <span className="ps-2">
                                                  Không thực hiện được
                                                </span>
                                              </Button>
                                            ) : role == "ung_tuyen_vien" ? (
                                              <Button
                                                className="form-control d-flex align-items-center justify-content-center py-4 my-4"
                                                type="primary"
                                                icon={<BiPaperPlane />}
                                                onClick={handleAddButtonClick}
                                              >
                                                <span className="ps-2">
                                                  {t("productDetail.applyNow")}
                                                </span>
                                              </Button>
                                            ) : role == undefined ? (
                                              <Button
                                                className="form-control d-flex align-items-center justify-content-center py-4 my-4"
                                                type="primary"
                                                icon={<BiPaperPlane />}
                                                onClick={handleAddButtonClick}
                                              >
                                                <span className="ps-2">
                                                  {t("productDetail.applyNow")}
                                                </span>
                                              </Button>
                                            ) : null
                                          ) : checkAppliedJob == true ? (
                                            <Button
                                              disabled={true}
                                              className="form-control d-flex align-items-center justify-content-center py-4 my-4"
                                              type="primary"
                                              icon={<BiPaperPlane />}
                                              onClick={handleAddButtonClick}
                                            >
                                              <span className="ps-2">
                                                Đã ứng tuyển
                                              </span>
                                            </Button>
                                          ) : null}
                                        </>
                                      </Col>

                                      <Col span={3}>
                                        <Button
                                          className="form-control d-flex align-items-center justify-content-center py-4 my-4"
                                          icon={<HeartOutlined />}
                                          onClick={() => {
                                            handleSubmitFavorite();
                                          }}
                                        >
                                          {t("productDetail.saveRecruitment")}
                                        </Button>
                                      </Col>
                                      <Col span={15}></Col>
                                      <Col span={24}>
                                        <p>Hạn nộp hồ sơ: 01/06/2022</p>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </TabPane>
                    <TabPane tab={t("productDetail.tabs.header.tab2")} key="2">
                      <div className="px-3 py-3 bg-white rounded">
                        <ProductCompanyGeneralInfomation
                          companyInfo={detail.nhaTuyenDung}
                        />
                      </div>
                    </TabPane>
                    <TabPane tab={t("productDetail.tabs.header.tab3")} key="3">
                      <div className="px-3 py-3 bg-white ">
                        <div className="row">
                          <JobList recruitments={recruitmentsLinhVuc} />
                        </div>
                      </div>
                    </TabPane>
                  </Tabs>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="bg-white rounded px-4 py-3">
                    <div>
                      <h4 className="fw-bold">Đánh giá tin tuyển dụng</h4>
                    </div>

                    <Tabs
                      defaultActiveKey="7"
                      onChange={(key) => {
                        if (key == 7) {
                          setFilterReview({
                            ...filterReview,
                            xepLoai: null,
                          });
                        } else {
                          setFilterReview({
                            ...filterReview,
                            xepLoai: key,
                          });
                        }
                      }}
                    >
                      <TabPane
                        tab={`Tất cả (${totalAll ? totalAll : 0})`}
                        key="7"
                      >
                        {reviews?.data &&
                          reviews?.data.map((item, index) => {
                            return (
                              <Comment
                                key={index}
                                // actions={actions}
                                author={<a>{`${item?.danhGiaBoi.ten}`}</a>}
                                avatar={
                                  <Avatar
                                    src={`https://webtuyendung.s3.ap-southeast-1.amazonaws.com/${item?.danhGiaBoi.avatar}`}
                                    alt={`${item?.danhGiaBoi.ten}`}
                                  />
                                }
                                content={
                                  <>
                                    {
                                      item?.xepLoai == 1 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                            <AiFillStar />
                                            <AiFillStar />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 2 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                            <AiFillStar />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 3 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 4 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 5 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                          </span>
                                        </>
                                      ) : null
                                      // onHandleStarReview(1)
                                    }
                                    <p>{`${item?.noiDung}`}</p>
                                  </>
                                }
                                datetime={
                                  <Tooltip
                                    title={TimeUtils.formatDateTime(
                                      `${item?.ngay}`,
                                      "DD-MMM-YYYY HH:mm:ss"
                                    )}
                                  >
                                    <span>
                                      {TimeUtils.formatDateTime(
                                        `${item?.ngay}`,
                                        "DD-MMM-YYYY HH:mm:ss"
                                      )}
                                    </span>
                                  </Tooltip>
                                }
                              />
                            );
                          })}
                        {reviews?.total == 0 && <p>Không có đánh giá nào</p>}
                      </TabPane>
                      <TabPane
                        tab={`5 sao (${totalFiveStar ? totalFiveStar : 0})`}
                        key="5"
                      >
                        {reviews?.data &&
                          reviews?.data.map((item, index) => {
                            return (
                              <Comment
                                key={index}
                                // actions={actions}
                                author={<a>{`${item?.danhGiaBoi.ten}`}</a>}
                                avatar={
                                  <Avatar
                                    src={`https://webtuyendung.s3.ap-southeast-1.amazonaws.com/${item?.danhGiaBoi.avatar}`}
                                    alt={`${item?.danhGiaBoi.ten}`}
                                  />
                                }
                                content={
                                  <>
                                    {
                                      item?.xepLoai == 1 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                            <AiFillStar />
                                            <AiFillStar />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 2 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                            <AiFillStar />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 3 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 4 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 5 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                          </span>
                                        </>
                                      ) : null
                                      // onHandleStarReview(1)
                                    }
                                    <p>{`${item?.noiDung}`}</p>
                                  </>
                                }
                                datetime={
                                  <Tooltip
                                    title={TimeUtils.formatDateTime(
                                      `${item?.ngay}`,
                                      "DD-MMM-YYYY HH:mm:ss"
                                    )}
                                  >
                                    <span>
                                      {TimeUtils.formatDateTime(
                                        `${item?.ngay}`,
                                        "DD-MMM-YYYY HH:mm:ss"
                                      )}
                                    </span>
                                  </Tooltip>
                                }
                              />
                            );
                          })}
                        {reviews?.total == 0 && <p>Không có đánh giá nào</p>}
                      </TabPane>
                      <TabPane
                        tab={`4 sao (${totalFourStar ? totalFourStar : 0})`}
                        key="4"
                      >
                        {reviews?.data &&
                          reviews?.data.map((item, index) => {
                            return (
                              <Comment
                                key={index}
                                // actions={actions}
                                author={<a>{`${item?.danhGiaBoi.ten}`}</a>}
                                avatar={
                                  <Avatar
                                    src={`https://webtuyendung.s3.ap-southeast-1.amazonaws.com/${item?.danhGiaBoi.avatar}`}
                                    alt={`${item?.danhGiaBoi.ten}`}
                                  />
                                }
                                content={
                                  <>
                                    {
                                      item?.xepLoai == 1 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                            <AiFillStar />
                                            <AiFillStar />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 2 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                            <AiFillStar />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 3 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 4 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 5 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                          </span>
                                        </>
                                      ) : null
                                      // onHandleStarReview(1)
                                    }
                                    <p>{`${item?.noiDung}`}</p>
                                  </>
                                }
                                datetime={
                                  <Tooltip
                                    title={TimeUtils.formatDateTime(
                                      `${item?.ngay}`,
                                      "DD-MMM-YYYY HH:mm:ss"
                                    )}
                                  >
                                    <span>
                                      {TimeUtils.formatDateTime(
                                        `${item?.ngay}`,
                                        "DD-MMM-YYYY HH:mm:ss"
                                      )}
                                    </span>
                                  </Tooltip>
                                }
                              />
                            );
                          })}
                        {reviews?.total == 0 && <p>Không có đánh giá nào</p>}
                      </TabPane>
                      <TabPane
                        tab={`3 sao (${totalThreeStar ? totalThreeStar : 0})`}
                        key="3"
                      >
                        {reviews?.data &&
                          reviews?.data.map((item, index) => {
                            return (
                              <Comment
                                key={index}
                                // actions={actions}
                                author={<a>{`${item?.danhGiaBoi.ten}`}</a>}
                                avatar={
                                  <Avatar
                                    src={`https://webtuyendung.s3.ap-southeast-1.amazonaws.com/${item?.danhGiaBoi.avatar}`}
                                    alt={`${item?.danhGiaBoi.ten}`}
                                  />
                                }
                                content={
                                  <>
                                    {
                                      item?.xepLoai == 1 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                            <AiFillStar />
                                            <AiFillStar />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 2 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                            <AiFillStar />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 3 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 4 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 5 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                          </span>
                                        </>
                                      ) : null
                                      // onHandleStarReview(1)
                                    }
                                    <p>{`${item?.noiDung}`}</p>
                                  </>
                                }
                                datetime={
                                  <Tooltip
                                    title={TimeUtils.formatDateTime(
                                      `${item?.ngay}`,
                                      "DD-MMM-YYYY HH:mm:ss"
                                    )}
                                  >
                                    <span>
                                      {TimeUtils.formatDateTime(
                                        `${item?.ngay}`,
                                        "DD-MMM-YYYY HH:mm:ss"
                                      )}
                                    </span>
                                  </Tooltip>
                                }
                              />
                            );
                          })}
                        {reviews?.total == 0 && <p>Không có đánh giá nào</p>}
                      </TabPane>
                      <TabPane
                        tab={`2 sao (${totalSecondStar ? totalSecondStar : 0})`}
                        key="2"
                      >
                        {reviews?.data &&
                          reviews?.data.map((item, index) => {
                            return (
                              <Comment
                                key={index}
                                // actions={actions}
                                author={<a>{`${item?.danhGiaBoi.ten}`}</a>}
                                avatar={
                                  <Avatar
                                    src={`https://webtuyendung.s3.ap-southeast-1.amazonaws.com/${item?.danhGiaBoi.avatar}`}
                                    alt={`${item?.danhGiaBoi.ten}`}
                                  />
                                }
                                content={
                                  <>
                                    {
                                      item?.xepLoai == 1 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                            <AiFillStar />
                                            <AiFillStar />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 2 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                            <AiFillStar />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 3 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 4 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 5 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                          </span>
                                        </>
                                      ) : null
                                      // onHandleStarReview(1)
                                    }
                                    <p>{`${item?.noiDung}`}</p>
                                  </>
                                }
                                datetime={
                                  <Tooltip
                                    title={TimeUtils.formatDateTime(
                                      `${item?.ngay}`,
                                      "DD-MMM-YYYY HH:mm:ss"
                                    )}
                                  >
                                    <span>
                                      {TimeUtils.formatDateTime(
                                        `${item?.ngay}`,
                                        "DD-MMM-YYYY HH:mm:ss"
                                      )}
                                    </span>
                                  </Tooltip>
                                }
                              />
                            );
                          })}
                        {reviews?.total == 0 && <p>Không có đánh giá nào</p>}
                      </TabPane>
                      <TabPane
                        tab={`1 sao (${totalFirstStar ? totalFirstStar : 0})`}
                        key="1"
                      >
                        {reviews?.data &&
                          reviews?.data.map((item, index) => {
                            return (
                              <Comment
                                key={index}
                                // actions={actions}
                                author={<a>{`${item?.danhGiaBoi.ten}`}</a>}
                                avatar={
                                  <Avatar
                                    src={`https://webtuyendung.s3.ap-southeast-1.amazonaws.com/${item?.danhGiaBoi.avatar}`}
                                    alt={`${item?.danhGiaBoi.ten}`}
                                  />
                                }
                                content={
                                  <>
                                    {
                                      item?.xepLoai == 1 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                            <AiFillStar />
                                            <AiFillStar />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 2 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                            <AiFillStar />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 3 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 4 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar />
                                          </span>
                                        </>
                                      ) : item?.xepLoai == 5 ? (
                                        <>
                                          <span className="fs-18">
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                            <AiFillStar
                                              style={{ color: "#ee4d2d" }}
                                            />
                                          </span>
                                        </>
                                      ) : null
                                      // onHandleStarReview(1)
                                    }
                                    <p>{`${item?.noiDung}`}</p>
                                  </>
                                }
                                datetime={
                                  <Tooltip
                                    title={TimeUtils.formatDateTime(
                                      `${item?.ngay}`,
                                      "DD-MMM-YYYY HH:mm:ss"
                                    )}
                                  >
                                    <span>
                                      {TimeUtils.formatDateTime(
                                        `${item?.ngay}`,
                                        "DD-MMM-YYYY HH:mm:ss"
                                      )}
                                    </span>
                                  </Tooltip>
                                }
                              />
                            );
                          })}
                        {reviews?.total == 0 && <p>Không có đánh giá nào</p>}
                      </TabPane>
                    </Tabs>
                  </div>
                </div>
              </div>
            </Content>
          </div>
          {renderModalApplyJob}
        </JobProvider>
      </Layout>
      <FooterHome />
    </Fragment>
  );
};

ProductDetail.propTypes = {};

export default ProductDetail;
