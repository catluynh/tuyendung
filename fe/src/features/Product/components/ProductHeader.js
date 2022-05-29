import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Button, Col, Modal, Row } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import "./ProductHeader.css";
import {
  ClockCircleOutlined,
  HeartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { BiPaperPlane } from "react-icons/bi";
import { Link, useHistory } from "react-router-dom";
import TimeUtils from "../../../utils/timeUtils";
import ApplyJobModal from "./modal/ApplyJobModal";
import CandidateApplicationForm from "../../../services/candidateApplicationForm";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import profileApi from "../../../services/profileApi";

const ProductHeader = (props) => {
  const { isAuthenticated } = useSelector((state) => state?.userLogin);
  const users = useSelector((state) => state?.userLogin);
  const userId = users?.user?.taiKhoan._id;
  const history = useHistory();
  const { t } = useTranslation();
  const expirationDateFormat = TimeUtils.formatDateTime(
    props?.ngayHetHan,
    "DD-MM-YYYY"
  );
  const [isShowModal, setIsShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState();
  useEffect(() => {
    const getProfileDetail = async () => {
      try {
        console.log("userIduserId", userId);
        const response = await profileApi.getUngTuyenVien(userId);
        setUser(response?.data);
        console.log("response?.dataresponse?.data", response?.data);
      } catch (error) {
        toast.error(error, {
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
    getProfileDetail();
  }, [userId]);
  const [isShowDaUngTuyen, setIsShowDaUngTuyen] = useState(false);
  const [isShowLinkUpdateProfile, setIsShowLinkUpdateProfile] = useState(false);
  const handleAddButtonClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      console.log("USER", user);
      if (
        user.dsChungChi.length === 0 ||
        user.dsHocVan.length === 0 ||
        user.dsKinhNghiemLamViec.length === 0 ||
        user.dsKyNang.length === 0 ||
        user.taiKhoan.email === ""
      ) {
        setIsShowModal(false);
        setIsShowLinkUpdateProfile(true);
      } else {
        setIsShowModal(true);
        setIsShowLinkUpdateProfile(false);
      }
    } else {
      history.replace("/login");
    }
  };
  {
    isShowLinkUpdateProfile && (
      <>{alert("Vui long cap nhat tai khoan de thuc hien ung tuyen")}</>
    );
  }
  const handleSubmitModal = async (payload) => {
    console.log("Call api payload", payload);
    setIsShowDaUngTuyen(false);
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
      if (error) {
        setIsShowDaUngTuyen(true);
        toast.error("Bạn đã ứng tuyển tin tuyển dụng này!", {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log("Da ung tuyen tin dung nay");
      }
      console.log("error", { error });
      console.log("error", error.response);
      console.log("error", error.response.data);
      // toast.error(error.response?.data.message, {
      //   position: "bottom-right",
      //   autoClose: 1000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
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
        user={user}
        isShowLinkUpdateProfile={isShowLinkUpdateProfile}
      />
    );
  }, [isShowModal]);
  // const [isShowModalApplied, setIsShowModalApplied] = useState(false)
  //   const renderModalApplied = useMemo(() => {
  //     if (!isShowModalApplied) return null;

  //     return (
  //       <ApplyJobModal
  //         showModal={isShowModalApplied}
  //         onCloseModal={() => {
  //           setIsShowModalApplied(false);
  //           // clearErrors();
  //         }}
  //         onSubmit={handleSubmitModal}

  //       />
  //     );
  //   }, [isShowModalApplied]);

  return (
    <>
      <Row gutter={[24, 16]}>
        <Col span={3}>
          <Avatar
            size={{
              xs: 24,
              sm: 32,
              md: 40,
              lg: 64,
              xl: 80,
              xxl: 100,
            }}
            src={
              props?.companyInfo?.avatar
                ? `https://webtuyendung.s3.ap-southeast-1.amazonaws.com/${props?.companyInfo?.avatar}`
                : `https://webtuyendung.s3.ap-southeast-1.amazonaws.com/IMG_5700.JPG`
            }
          />
        </Col>
        <Col span={17}>
          <div className="box-info-job">
            <h1>{props.tieuDe}</h1>
            <div className="company-title mb-2">
              <Link to="#">{props?.companyInfo?.tenCongty}</Link>
            </div>

            <div className="job-deadline d-flex">
              <div>
                <ClockCircleOutlined />
              </div>
              <span className="pt-3px px-1">
                Hạn nộp hồ sơ: {expirationDateFormat}
              </span>
            </div>
          </div>
        </Col>
        <Col span={4}>
          <div>
            <>
              {props?.checkAppliedJob == false ? (
                props?.role == 'nha_tuyen_dung' ? (<Button disabled={true}
                  className="form-control d-flex align-items-center justify-content-center py-4 my-4"
                  type="primary"
                  icon={<BiPaperPlane />}
                  onClick={handleAddButtonClick}>
                  <span className="ps-2">
                    Không thực hiện được
                  </span>
                </Button>) :
                  props?.role == 'ung_tuyen_vien' ? (<Button
                    className="form-control d-flex align-items-center justify-content-center py-4 my-4"
                    type="primary"
                    icon={<BiPaperPlane />}
                    onClick={handleAddButtonClick}>
                    <span className="ps-2">
                      {t("productDetail.applyNow")}
                    </span>
                  </Button>) :
                    props?.role == undefined ?
                      (<Button
                        className="form-control d-flex align-items-center justify-content-center py-4 my-4"
                        type="primary"
                        icon={<BiPaperPlane />}
                        onClick={handleAddButtonClick}>
                        <span className="ps-2">
                          {t("productDetail.applyNow")}
                        </span>
                      </Button>)
                      : null
              ) : props?.checkAppliedJob == true ? (<Button disabled={true}
                className="form-control d-flex align-items-center justify-content-center py-4 my-4"
                type="primary"
                icon={<BiPaperPlane />}
                onClick={handleAddButtonClick}>
                <span className="ps-2">
                  Đã ứng tuyển
                </span>
              </Button>) : null}
            </>
          </div>
          <div>
            <Button
              className="form-control d-flex align-items-center justify-content-center py-2 my-4"
              icon={<HeartOutlined />}
            >
              {t("productDetail.saveRecruitment")}
            </Button>
          </div>
        </Col>
        {/* <Modal
          title="Ứng tuyển việc làm"
          visible={isShowModal}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Quay lại tìm việc
            </Button>,
            <Button
              key="submit"
              type="primary"
              // loading={loading}
              onClick={handleOk}
              disabled
            >
              Tiếp tục
            </Button>,
          ]}
        >
          <p>Hồ sơ của tôi</p>
          <div className="text-end">
            <Button type="primary">Hoàn thành hồ sơ của tôi</Button>
          </div>
        </Modal> */}
        {renderModalApplyJob}
      </Row>
    </>
  );
};

ProductHeader.propTypes = {};

export default ProductHeader;
