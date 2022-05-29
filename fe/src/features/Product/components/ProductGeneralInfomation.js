import React, { Fragment, useContext, useState } from "react";
import PropTypes from "prop-types";
import { Avatar, Button, Col, Row } from "antd";
import { BiDetail, BiPaperPlane } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import {
  FacebookIcon,
  FacebookMessengerIcon,
  LinkedinIcon,
  PinterestIcon,
  TwitterIcon,
} from "react-share";
import { Timeline } from "antd";
import { useProductContext } from "../context/ProductContext";

const ProductGeneralInfomation = (props) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState(props.diaDiem || {});
  return (
    <Fragment>
      <Row>
        <Col span={24}>
          <div className="box-info-job">
            <h1 className="text-dark d-flex align-items-center">
              <BiDetail />
              <span className="ps-1">
                {t("productDetail.tabs.tabDetail.detailRecruitment")}
              </span>
            </h1>
          </div>
        </Col>
      </Row>
      <Row gutter={[32, 8]}>
        <Col span={16}>
          <div className="px-3 py-2 mx-2 bg-detail">
            <Row>
              <Col span={24}>
                <p className="text-decoration-underline fw-bolder mb-2">
                  Thông tin chung
                </p>
              </Col>
              <Col span={12}>
                <Row>
                  <Col span={3} className="d-flex align-items-center">
                    <Avatar src="https://www.topcv.vn/v4/image/job-detail/icon/1.svg" />
                  </Col>
                  <Col span={21}>
                    {" "}
                    <p>
                      {" "}
                      <strong className="mb-2">Mức lương</strong>
                    </p>
                    <p>{props?.mucLuong}</p>
                  </Col>
                </Row>
              </Col>

              <Col span={12}>
                <Row>
                  <Col span={3} className="d-flex align-items-center">
                    <Avatar src="https://www.topcv.vn/v4/image/job-detail/icon/5.svg" />
                  </Col>
                  <Col span={21}>
                    {" "}
                    <p>
                      {" "}
                      <strong className="mb-2">Số lượng tuyển</strong>
                    </p>
                    <p>{props?.soLuongTuyen}</p>
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="column-detail-2 my-3">
              <Row>
                <Col span={12}>
                  <Row>
                    <Col span={3} className="d-flex align-items-center">
                      <Avatar src="https://www.topcv.vn/v4/image/job-detail/icon/2.svg" />
                    </Col>
                    <Col span={21}>
                      {" "}
                      <p>
                        {" "}
                        <strong className="mb-2">Hình thức làm việc</strong>
                      </p>
                      <p>{props?.hinhThucLamViec}</p>
                    </Col>
                  </Row>
                </Col>

                <Col span={12}>
                  <Row>
                    <Col span={3} className="d-flex align-items-center">
                      <Avatar src="https://www.topcv.vn/v4/image/job-detail/icon/6.svg" />
                    </Col>
                    <Col span={21}>
                      {" "}
                      <p>
                        {" "}
                        <strong className="mb-2">Cấp bậc</strong>
                      </p>
                      <p>{props?.viTri}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <div className="column-detail-3 my-3">
              <Row>
                <Col span={12}>
                  <Row>
                    <Col span={3} className="d-flex align-items-center">
                      <Avatar src="https://www.topcv.vn/v4/image/job-detail/icon/3.svg" />
                    </Col>
                    <Col span={21}>
                      {" "}
                      <p>
                        {" "}
                        <strong className="mb-2">Giới tính</strong>
                      </p>
                      <p>{props?.gioiTinh}</p>
                    </Col>
                  </Row>
                </Col>

                <Col span={12}>
                  <Row>
                    <Col span={3} className="d-flex align-items-center">
                      <Avatar src="https://www.topcv.vn/v4/image/job-detail/icon/7.svg" />
                    </Col>
                    <Col span={21}>
                      {" "}
                      <p>
                        {" "}
                        <strong className="mb-2">Kinh nghiệm</strong>
                      </p>
                      <p>{props?.kinhNghiem}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <div className="column-detail-4 my-3">
              <Row>
                <Col span={12}>
                  <Row>
                    <Col span={3} className="d-flex align-items-center">
                      <Avatar src="https://www.topcv.vn/v4/image/job-detail/icon/3.svg" />
                    </Col>
                    <Col span={21}>
                      {" "}
                      <p>
                        {" "}
                        <strong className="mb-2">Ngành nghề</strong>
                      </p>
                      <p>{props?.nganhNghe?.tenNganhNghe}</p>
                    </Col>
                  </Row>
                </Col>

                <Col span={12}>
                  <Row>
                    <Col span={3} className="d-flex align-items-center">
                      <Avatar src="https://www.topcv.vn/v4/image/job-detail/icon/7.svg" />
                    </Col>
                    <Col span={21}>
                      {" "}
                      <p>
                        {" "}
                        <strong className="mb-2">Độ tuổi</strong>
                      </p>
                      <p>
                        {props?.tuoiTu} - {props?.denTuoi}
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="px-2 py-3 mx-2 border">
            <h6 className="ps-1">
              <strong>
                {t("productDetail.tabs.tabDetail.shareRecruitment")}
              </strong>
            </h6>
            <div className="ps-1">
              <p>Sao chép đường dẫn</p>
              <p className="pb-1">Chia sẻ qua mạng xã hội</p>
              <div>
                <FacebookIcon />
                <FacebookMessengerIcon />
                <LinkedinIcon />
                <PinterestIcon />
                <TwitterIcon />
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row gutter={[32, 8]}>
        <Col span={16}>
          <div className="px-3 py-2 mx-2 mt-3 bg-detail">
            <Row>
              <Col span={24}>
                <p className="text-decoration-underline fw-bolder mb-2 ">
                  Thông tin chung
                </p>
                <div>
                  <div className="mb-2">
                    {props?.diaDiem?.quanHuyen} - {props?.diaDiem?.tinhThanhPho}
                  </div>
                </div>
              </Col>
              <div className="mt-3">
                <Row>
                  <Col span={24}>
                    <p className="fw-bolder mb-3">Mô tả công việc</p>
                    <div>
                      <div className="mb-2">
                        <Timeline>{props?.moTa}</Timeline>
                      </div>
                    </div>
                    <p className="fw-bolder mb-3">Yêu cầu ứng viên</p>
                    <div>
                      <div className="">
                        <Timeline>{props?.yeuCau}</Timeline>
                      </div>
                    </div>
                    <p className="fw-bolder mb-3">Quyền lợi</p>
                    <div>
                      <div className="mb-2">
                        <Timeline>{props?.phucLoi}</Timeline>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Row>
          </div>
        </Col>
        <Col span={8}>
          <div className="px-2 py-3 mx-2 mt-3 border">
            <h6 className="ps-1">
              <strong>
                {t("productDetail.tabs.tabDetail.reportRecruitment")}
              </strong>
            </h6>
            <div className="ps-1">
              <p className="pb-3">
                Nếu bạn thấy rằng tin tuyển dụng này không đúng, hãy phản ánh
                với chúng tôi
              </p>
              <Button>Báo cáo tin tuyển dụng không chính xác</Button>
            </div>
          </div>
          <div className="px-2 py-3 mx-2 mt-3 border">
            <h6 className="ps-1">
              <strong>Ngành nghề</strong>
            </h6>
            <div className="ps-1">
              <Button className="me-2">{props?.nganhNghe?.tenNganhNghe}</Button>
            </div>
          </div>
          <div className="px-2 py-3 mx-2 mt-3 border">
            <h6 className="ps-1">
              <strong>Khu vực</strong>
            </h6>
            <div className="ps-1">
              <Button className="me-2">{props?.diaDiem?.quanHuyen}</Button>
              <Button className="me-2">{props?.diaDiem?.tinhThanhPho}</Button>
            </div>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

ProductGeneralInfomation.propTypes = {};

export default ProductGeneralInfomation;
