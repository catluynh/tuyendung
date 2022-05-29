import React, { Fragment, useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import classes from "./JobItem.module.css";
import clsx from "clsx";
import { Tooltip } from "antd";
import { Link, useHistory } from "react-router-dom";
import { getUserProfile } from "../../../utils/localStorage";
import InterestedJobApi from "../../../services/interestedJobApi";
import { toast } from "react-toastify";
import useSelection from "antd/lib/table/hooks/useSelection";

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
  const handleHightLightFavorite = () => {
    setIsHightLightFavorite(!isHightLightFavorite);
  };


  const checkIsFavorite = () => {
    favorite?.map((item, index) => {
      if (item?.ungTuyenVien === userId) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    });
  };

  useEffect(() => {
    checkIsFavorite();
  }, [props?.jobs?.dsViecLamDaLuu]);

  useEffect(() => {
    checkIsFavorite();
  }, []);
  const history = useHistory();

  const handleSubmitFavorite = async () => {
    if (!userId) {
      history.push("/login");
    } else {
      handleHightLightFavorite();
      setIsFavorite(true);
      const payload = {
        tinTuyenDung: props?.jobs?._id,
        ungTuyenVien: user.taiKhoan._id,
      };
      try {
        const response = await InterestedJobApi.creatInterestedJob(payload);
        if (response.status === "success") {
          toast.success("Lưu tin tuyển dụng thành công", {
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
    }
  };

  const handleUnSubmitFavorite = async () => {
    if (!userId) {
      history.push("/login");
    } else {
      handleHightLightFavorite();
      setIsFavorite(false);
      const payload = {
        tinTuyenDung: props?.jobs?._id,
        ungTuyenVien: user.taiKhoan._id,
      };
      try {
        const response = await InterestedJobApi.dropInterestedJob(payload);
        if (response.status === "success") {
          toast.success("Hủy lưu tin tuyển dụng thành công", {
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
    }
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
                  <strong>{props?.jobs?.tieuDe}</strong>
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
                handleSubmitFavorite();
              }}
            >
              <div
                className={`jobItemFavorite border border-secondary rounded position-absolute top-0 end-0 px-2 badge bg-light text-dark ${isHightLightFavorite ? "text-danger" : ""
                  }`}
              >
                <AiFillHeart
                  className={`fs-18 ${isFavorite ? " text-danger" : ""} `}
                />
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
