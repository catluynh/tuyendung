import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "antd";

const PreviewJobInfomation = (props) => {
  console.log("... logger detail", props?.detail);
  const [detailData, setDetailData] = useState(props?.detail);
  const onHandleSubmitJob = () => {
    props.onSubmit(detailData);
  };
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <strong
              className="pointer"
              onClick={() => {
                props.closePreview();
              }}
            >
              Quay lại
            </strong>{" "}
          </div>
          <div className="col-12">
            <h5 className="fw-bold fs-18 text-center pb-4  border-bottom">
              <strong>Xem lại tin đăng</strong>
            </h5>
          </div>
          <div className="col-12 mt-1 text-center">
            <span>
              <span className="fw-bold fs-18">{props?.detail?.tieuDe}</span>
            </span>
          </div>

          <div className="col-12 mt-2">
            <h5 className="fw-bold fs-18 pb-2  border-bottom">
              <span className="fs-14 text-uppercase">Thông tin công việc</span>
            </h5>
          </div>

          <div className="col-12 mt-2">
            <table class="table table-responsive table-info rounded">
              <tbody>
                <tr>
                  <td>
                    <strong className="pe-2">Việc làm tại:</strong>
                    <span>
                      {props?.detail?.diaDiem?.tinhThanhPho},{" "}
                      {props?.detail?.diaDiem?.quanHuyen}
                    </span>
                  </td>
                  <td>
                    {" "}
                    <strong className="pe-2">Mức lương tại:</strong>
                    <span className="text-center fw-bold">
                      {" "}
                      {props?.detail?.mucLuong}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong className="pe-2">Hạn nộp hồ sơ:</strong>
                    <span> {props?.detail?.ngayHetHan}</span>
                  </td>
                  <td>
                    {" "}
                    <strong className="pe-2">Chức vụ:</strong>
                    <span> {props?.detail?.viTri}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong className="pe-2">Hình thức:</strong>
                    <span> {props?.detail?.loaiCongViec}</span>
                  </td>
                  <td>
                    {" "}
                    <strong className="pe-2">Kinh nghiệm:</strong>
                    <span> {props?.detail?.soNamKinhNghiem}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong className="pe-2">Số lượng:</strong>
                    <span> {props?.detail?.soLuongTuyen}</span>
                  </td>
                  <td>
                    {" "}
                    <strong className="pe-2">Trình độ:</strong>
                    <span> {props?.detail?.bangCap}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Mô tả công việc */}
          <>
            <div className="col-12 mt-2">
              <h5 className="fw-bold fs-18 pb-2  border-bottom">
                <span className="fs-14 text-uppercase">Mô tả công việc</span>
              </h5>
            </div>
            <div className="col-12 mt-2">
              <p>
                Viết tiếng việt có dấu: Mô tả công việc, nơi làm việc, giờ làm
                Yêu cầu bằng cấp, kỹ năng Phúc lợi khác ngoài lương Không nên:
                Không điền số điện thoại/email trong nội dung Không điền form
                ứng tuyển hoặc đường dẫn tới website khác
              </p>
            </div>
          </>
          <>
            <div className="col-12 mt-2">
              <h5 className="fw-bold fs-18 pb-2  border-bottom">
                <span className="fs-14 text-uppercase">Yêu cầu công việc</span>
              </h5>
            </div>
            <div className="col-12 mt-2">
              <p>{props?.detail?.yeuCau}</p>
            </div>
          </>
          <>
            <div className="col-12 mt-2">
              <h5 className="fw-bold fs-18 pb-2  border-bottom">
                <span className="fs-14 text-uppercase">Quyền lợi ứng viên</span>
              </h5>
            </div>
            <div className="col-12 mt-2">
              <p>{props?.detail?.phucLoi}</p>
            </div>
          </>
          <>
            <div className="col-12 mt-2">
              <h5 className="fw-bold fs-18 pb-2  border-bottom">
                <span className="fs-14 text-uppercase">Thông tin liên hệ</span>
              </h5>
            </div>
            <div className="col-12 mt-2">
              <p>
                <span className="fw-bold">Người liên hệ:</span>{" "}
                <span>{props?.detail?.lienHe?.ten}</span>
              </p>
              <p>
                <span className="fw-bold">Số điện thoại:</span>{" "}
                <span>{props?.detail?.lienHe?.sdt}</span>
              </p>
              <p>
                <span className="fw-bold">Email:</span>{" "}
                <span>{props?.detail?.lienHe?.email}</span>
              </p>
            </div>
          </>
          <>
            <div className="col-3 mt-2"></div>
            <div className="col-6 mt-2">
              <Button
                className="rounded"
                type="primary"
                size="large"
                style={{ width: "100%" }}
                onClick={() => {
                  onHandleSubmitJob();
                }}
              >
                Xác nhận đăng tin
              </Button>
            </div>
            <div className="col-3 mt-2"></div>
          </>
        </div>
      </div>
    </>
  );
};

PreviewJobInfomation.propTypes = {};

export default PreviewJobInfomation;
