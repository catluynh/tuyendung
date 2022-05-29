import { Tooltip } from "antd";
import clsx from "clsx";
import moment from "moment";
import "moment/locale/vi";
import React, { Fragment, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ReviewModal from "../../../pages/User/components/review/ReviewModal";
import ReviewApi from "../../../services/reviewApi";
import { getUserProfile } from "../../../utils/localStorage";
import classes from "./JobItem.module.css";
const JobItem = (props) => {
  const {
    jobItemImageWrapper,
    jobItemParagraph,
    jobItemImage,
    jobItemFavoriteWrapper,
  } = classes;
  const heartStyle = { color: "red" };
  const heartNoneStyle = { color: "" };
  const styleImage = clsx(jobItemImageWrapper, "rounded");
  const user = getUserProfile();
  const userId = user?.taiKhoan?._id;
  const [favorite, setFavorite] = useState(props?.jobs?.dsViecLamDaLuu);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHightLightFavorite, setIsHightLightFavorite] = useState(false);
  const [idTuyenDung, setIdTuyenDung] = useState("");
  moment.locale("vi");
  const handleHightLightFavorite = () => {
    setIsHightLightFavorite(!isHightLightFavorite);
  };
  const handleSubmitModalReview = async (payload) => {
    try {
      const response = await ReviewApi.creareReview(payload);
      console.log(response);
      toast.success("Thêm đánh giá thành công", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const [modal2Visible, setModal2Visible] = useState(false);
  const handleShowModalReview = (e) => {
    console.log("E", e);
    e.preventDefault();
    setModal2Visible(true);
    setIdTuyenDung(props?.jobs?.tinTuyenDung?._id);
  };

  const renderModalReview = useMemo(() => {
    if (!modal2Visible) return null;

    return (
      <ReviewModal
        showModal={modal2Visible}
        onCloseModal={() => {
          setModal2Visible(false);
          // clearErrors();
        }}
        onSubmit={handleSubmitModalReview}
        id={idTuyenDung}
      />
    );
  }, [modal2Visible]);
  console.log("props id", props);

  return (
    <Fragment>
      <div className={classes + "border"}>
        <div className="job-item-wrapper">
          <div className="d-flex align-items-center position-relative flex-wrap">
            <div className={styleImage}>
              <Tooltip
                placement="top"
                title={props?.jobs?.nhaTuyenDung?.tenCongty}
              >
                <Link
                  className="text-decoration-none"
                  to={`/job-detail/${props?.jobs?.tinTuyenDung?._id}`}
                >
                  <img
                    className={clsx([jobItemImage, "rounded"])}
                    src={`https://webtuyendung.s3.ap-southeast-1.amazonaws.com/${props?.jobs?.tinTuyenDung?.nhaTuyenDung?.avatar}`}
                    alt={props?.jobs?.tinTuyenDung?.tieuDe}
                  />
                </Link>
              </Tooltip>
            </div>
            <div className={clsx([jobItemParagraph, "mt-3 px-3"])}>
              <Tooltip
                placement="top"
                title={props?.jobs?.tinTuyenDung?.tieuDe}
              >
                <Link
                  className="titleParagraphOne text-dark fw-bold"
                  to={`/job-detail/${props?.jobs?.tinTuyenDung?._id}`}
                >
                  <h6>{props?.jobs?.tinTuyenDung?.tieuDe}</h6>
                </Link>
              </Tooltip>
              <Tooltip
                placement="top"
                title={props?.jobs?.nhaTuyenDung?.tenCongty}
              >
                <p>
                  <Link
                    className="titleParagraphOne text-decoration-none text-muted"
                    to={`/job-detail/${props?.jobs?.tinTuyenDung?._id}`}
                  >
                    {props?.jobs?.nhaTuyenDung?.tenCongty}
                  </Link>
                </p>
              </Tooltip>
            </div>
            <div
              className={jobItemFavoriteWrapper}
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <div
                className={`jobItemFavorite border border-secondary rounded position-absolute top-0 end-0 px-2 badge bg-light text-dark ${
                  isHightLightFavorite ? "text-danger" : ""
                }`}
              >
                <span>
                  {moment(props?.jobs?.ngayUngTuyen)
                    .lang("vi")
                    .startOf("day")
                    .fromNow()}
                </span>
              </div>
              <div
                className={`jobItemFavorite border border-secondary rounded position-absolute top-0 end-0 px-2 badge bg-light text-dark ${
                  isHightLightFavorite ? "text-danger" : ""
                }`}
              ></div>
            </div>
          </div>
          <div className="d-flex mt-2">
            <div className="jobItemSalary cursorDefault">
              <span className="badge bg-secondary me-3">
                {props?.jobs?.tinTuyenDung?.mucLuong}
              </span>
            </div>
            <div className="jobItemAddress cursorDefault">
              <span>
                <Tooltip
                  placement="top"
                  title={`${props?.jobs?.tinTuyenDung?.diaDiem.tinhThanhPho} - ${props?.jobs?.tinTuyenDung?.diaDiem?.quanHuyen}`}
                >
                  <span className="titleParagraphOne">
                    {props?.jobs?.tinTuyenDung?.diaDiem?.tinhThanhPho} -{" "}
                    {props?.jobs?.tinTuyenDung?.diaDiem?.quanHuyen}
                  </span>
                </Tooltip>
              </span>
            </div>
            <div className="ps-3">
              <span
                className="text-danger text-underline fw-bold pointer"
                onClick={handleShowModalReview}
              >
                Đánh giá
              </span>
            </div>
          </div>
        </div>
      </div>
      {renderModalReview}
    </Fragment>
  );
};

export default JobItem;
