import { Tooltip } from "antd";
import clsx from "clsx";
import moment from "moment";
import "moment/locale/vi";
import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
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
  moment.locale("vi");
  const handleHightLightFavorite = () => {
    setIsHightLightFavorite(!isHightLightFavorite);
  };

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
                  to={`/job-detail/${props?.jobs?._id}`}
                >
                  <img
                    className={clsx([jobItemImage, "rounded"])}
                    src={`https://webtuyendung.s3.ap-southeast-1.amazonaws.com/${props?.jobs?.nhaTuyenDung?.avatar}`}
                    alt="Logo"
                  />
                </Link>
              </Tooltip>
            </div>
            <div className={clsx([jobItemParagraph, "mt-3 px-3"])}>
              <Tooltip placement="top" title={props?.jobs?.tieuDe}>
                <Link
                  className="titleParagraphOne text-dark fw-bold"
                  to={`/job-detail/${props?.jobs?._id}`}
                >
                  <h6>{props?.jobs?.tieuDe}</h6>
                </Link>
              </Tooltip>
              <Tooltip
                placement="top"
                title={props?.jobs?.nhaTuyenDung?.tenCongty}
              >
                <p>
                  <Link
                    className="titleParagraphOne text-decoration-none text-muted"
                    to={`/job-detail/${props?.jobs?._id}`}
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
                  {moment(props?.jobs?.ngayCapNhat)
                    .lang("vi")
                    .startOf("day")
                    .fromNow()}
                </span>
              </div>
            </div>
          </div>
          <div className="d-flex mt-2">
            <div className="jobItemSalary cursorDefault">
              <span className="badge bg-secondary me-3">
                {props?.jobs?.mucLuong}
              </span>
            </div>
            <div className="jobItemAddress cursorDefault">
              <span>
                <Tooltip
                  placement="top"
                  title={`${props?.jobs?.diaDiem.tinhThanhPho} - ${props?.jobs?.diaDiem?.quanHuyen}`}
                >
                  <span className="titleParagraphOne">
                    {props?.jobs?.diaDiem?.tinhThanhPho} -{" "}
                    {props?.jobs?.diaDiem?.quanHuyen}
                  </span>
                </Tooltip>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default JobItem;
