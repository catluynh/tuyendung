import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Input,
  Modal,
  DatePicker,
  Select,
  Checkbox,
  Avatar,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { AiFillStar, AiOutlineCalendar } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { BsTelephoneFill } from "react-icons/bs";
import { FaLocationArrow } from "react-icons/fa";
import moment from "moment";
import TimeUtils from "../../../../utils/timeUtils";
import axiosClient from "../../../../services/axiosClient";
import { toast } from "react-toastify";

const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

const ModalProfileDetail = ({
  showModal,
  onCloseModal,
  isEdit,
  user,
  ...props
}) => {
  const [isSubmit, setIsSubmit] = useState([]);
  const [typeDegree, setTypeDegree] = useState("");
  const [school, setSchool] = useState("");
  const [specialized, setSpecialized] = useState("");
  const [description, setDescription] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const { tinTuyenDung, ungTuyenVien, tiemNang, ngayUngTuyen, trangThai, _id, thongTinLienHe } =
    user?.donTuyenDung;
  console.log("Trung Vinh user", user);

  const resetValue = () => {
    console.log("3. Reset value");
    // setValue(`${prefixName}.name`, null);
    // setValue(`${prefixName}.note`, null);
    // setValue(`${prefixName}.attachments`, null);
  };
  const save = () => {
    // let data = watch(prefixName);
    // console.log("running save()");
    // onSubmitCreate(payload);
    const payload = {
      bangCap: typeDegree,
      donViDaoTao: school,
      chuyenNganh: specialized,
      moTa: description,
      tuNgay: fromDate,
      denNgay: toDate,
    };
    console.log("payload", payload);
    if (isEdit) {
      console.log("Call update");
    } else {
      console.log("Call create");
      onSubmitCreate(payload);
    }
    // onSubmitCreate();
    // console.log("Add success");
  };
  const onSubmitCreate = (payload) => {
    props.onSubmit(payload);
    resetValue();
    onCloseModal();
  };
  function handleChange(value) {
    setTypeDegree(value);
  }
  const handleCreatedDate = () => {
    const today = new Date();
  };

  // Chấp nhận đơn ứng tuyển
  const handleAddButtonClickAccept = async (id) => {
    try {
      const requestUrl = `ec2-54-179-0-126.ap-southeast-1.compute.amazonaws.com:4000/donUngTuyens/chapNhanDonUngTuyen/${id}`;
      await axiosClient.patch(requestUrl).then((res) => {
        if (res?.status == "success") {
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
          onCloseModal(false);
        }
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  // Từ chối đơn ứng tuyển
  const handleAddButtonClickDeny = async (id) => {
    try {
      const requestUrl = `ec2-54-179-0-126.ap-southeast-1.compute.amazonaws.com:4000/donUngTuyens/tuChoiDonUngTuyen/${id}`;
      await axiosClient.patch(requestUrl).then((res) => {
        if (res?.status == "success") {
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
          onCloseModal(false);
        }
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {}, [isSubmit]);

  return (
    <div>
      <Modal
        centered
        visible={showModal}
        // onOk={() => {
        //   console.log("Submit ok");
        // }}
        onCancel={() => {
          onCloseModal(false);
        }}
        width={1400}
        footer={
          [
            // <Button
            //   key="back"
            //   onClick={() => {
            //     console.log("Cancel");
            //     onCloseModal(false);
            //   }}
            // >
            //   Hủy bỏ
            // </Button>,
            // <Button
            //   key="submit"
            //   type="primary"
            //   onClick={() => {
            //     save();
            //   }}
            // >
            //   Lưu
            // </Button>,
          ]
        }
      >
        <div className="row mt-4">
          <div className="col-3">
            <div className="row">
              <div className="col-3">
                <Avatar
                  shape="square"
                  size={64}
                  src={
                    ungTuyenVien?.avatar
                      ? `https://webtuyendung.s3.ap-southeast-1.amazonaws.com/${ungTuyenVien?.avatar}`
                      : `https://webtuyendung.s3.ap-southeast-1.amazonaws.com/utv-avatar-default.png`
                  }
                />
              </div>
              <div className="col-9">
                <span>
                  <strong>{thongTinLienHe?.ten}</strong>
                </span>
                <div>
                  {/* {moment(ngayUngTuyen).locale("vi").startOf("day").fromNow()} */}
                  {TimeUtils.formatDateTime(ngayUngTuyen, "DD-MM-YYYY")}
                </div>
                <p className="d-flex align-items-center pt-1">
                  {" "}
                  {tiemNang == true || tiemNang == "true" ? (
                    <>
                      <AiFillStar
                        style={{ color: "#ffe600", fontSize: "21px" }}
                      />{" "}
                    </>
                  ) : (
                    <AiFillStar style={{ fontSize: "21px" }} />
                  )}
                  Ứng viên tiềm năng
                </p>
              </div>
              <div className="col-12 mt-2">
                <h5>VỊ TRÍ ỨNG TUYỂN</h5>
              </div>
              <div className="col-12 mt-2">
                <div className="rounded px-4-8">
                  <div className="text-center">
                    <strong className="text-core">
                      {tinTuyenDung?.tieuDe}
                    </strong>
                  </div>
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="rounded border px-4-8">
                  <div>
                    <strong className="text-core">Thông tin cơ bản</strong>
                  </div>
                  <div className="row">
                    <div className="col-4 mt-3">
                      <div>
                        {" "}
                        <strong className="d-flex align-items-center ">
                          {" "}
                          <FaUserAlt /> <span className="ps-1"> Họ tên:</span>
                        </strong>
                      </div>
                    </div>
                    <div className="col-8 mt-3">
                      <i>{thongTinLienHe?.ten}</i>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-4 mt-3">
                      <div>
                        {" "}
                        <strong className="d-flex align-items-center ">
                          {" "}
                          <HiOutlineMail />{" "}
                          <span className="ps-1"> Email:</span>
                        </strong>
                      </div>
                    </div>
                    <div className="col-8 mt-3">
                      <i>{thongTinLienHe?.email}</i>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-4 mt-3">
                      <div>
                        {" "}
                        <strong className="d-flex align-items-center ">
                          {" "}
                          <BsTelephoneFill />{" "}
                          <span className="ps-1"> Điện thoại:</span>
                        </strong>
                      </div>
                    </div>
                    <div className="col-8 mt-3">
                      <i>{thongTinLienHe?.sdt}</i>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 mt-3">
                      <strong>Lời giới thiệu</strong>
                    </div>
                    <div className="col-12 mt-3">
                      <p>{thongTinLienHe?.loiGioiThieu}</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 mt-3">
                  {user?.yeuCauDoTuoi == false && (
                    <p className="text-danger fe-bold"> Chưa đủ tuổi</p>
                  )}
                </div>
                <div className="row">
                  <div className="col-12 mt-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <Button
                        size="large"
                        className="text-center text-white rounded"
                        style={{ background: "#4e83a6" }}
                        onClick={() => {
                          handleAddButtonClickAccept(_id);
                        }}
                        disabled={user?.yeuCauDoTuoi ? false : true}
                      >
                        Chấp nhận
                      </Button>
                      <Button
                        size="large"
                        className="rounded"
                        onClick={() => {
                          handleAddButtonClickDeny(_id);
                        }}
                      >
                        Từ chối
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="row">
              <div className="col-4 bg-core text-white pt-20 pb-30">
                <div className="p-1">
                  <h3 className="text-center mb-0 text-white">
                    <strong>{thongTinLienHe?.ten}</strong>
                  </h3>
                  <p className="text-center">
                    {ungTuyenVien?.viTriMuonUngTuyen}{" "}
                  </p>
                  <div className="text-center">
                    <Avatar shape="square" size={120} icon={<UserOutlined />} />
                  </div>
                  <div className="mt-2">
                    <p className="d-flex align-items-center pt-1">
                      {" "}
                      <AiOutlineCalendar style={{ fontSize: "21px" }} />{" "}
                      <span className="ps-2 pt-1">
                        {TimeUtils.formatDateTime(
                          ungTuyenVien?.ngaySinh,
                          "DD-MM-YYYY"
                        )}
                      </span>
                    </p>
                    <p className="d-flex align-items-center">
                      {" "}
                      <UserOutlined style={{ fontSize: "20px" }} />{" "}
                      <span className="ps-2">{ungTuyenVien?.gioiTinh}</span>
                    </p>

                    <p className="d-flex align-items-center">
                      {" "}
                      <BsTelephoneFill style={{ fontSize: "16px" }} />{" "}
                      <span className="ps-2">{thongTinLienHe?.sdt}</span>
                    </p>
                    <p className="d-flex align-items-center">
                      {" "}
                      <HiOutlineMail style={{ fontSize: "20px" }} />{" "}
                      <span className="ps-2">
                        {thongTinLienHe?.email}
                      </span>
                    </p>
                    <p className="d-flex align-items-center">
                      {" "}
                      <FaLocationArrow style={{ fontSize: "16px" }} />{" "}
                      <span className="ps-2">{ungTuyenVien?.diaChi}</span>
                    </p>
                  </div>
                </div>
                {/* Mục tiêu nghề nghiệp */}
                <div>
                  <div className="bg-white rounded my-2 py-2 text-core fw-bold text-center">
                    <span>MỤC TIÊU NGHỀ NGHIỆP</span>
                  </div>
                  <div className="mt-2">
                    <span className="ps-1">
                      {ungTuyenVien?.mucTieuCongViec}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="bg-white rounded my-2 py-2 text-core fw-bold text-center">
                    <span>Kỹ năng</span>
                  </div>
                  <div className="mt-2">
                    {ungTuyenVien?.dsKyNang.map((item, index) => {
                      return (
                        <>
                          <p key={index} className="ps-1">
                            - {item?.tenKyNang}
                          </p>
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="col-8 bg-cv pb-30">
                <div>
                  <div className="bg-core rounded my-2 py-2 text-white fw-bold text-center">
                    <span>Học vấn</span>
                  </div>
                  {ungTuyenVien?.dsHocVan.map((item, index) => {
                    return (
                      <>
                        <div className="mt-3">
                          <div className="d-flex align-items-center justify-content-between px-2">
                            <div>
                              <h5 className="text-cv-8 fw-bold">
                                {item?.donViDaoTao}
                              </h5>
                            </div>
                            <div>
                              <h5 className="text-cv-8 fw-bold">
                                {TimeUtils.formatDateTime(
                                  item?.tuNgay,
                                  "MM/YYYY"
                                )}{" "}
                                -{" "}
                                {TimeUtils.formatDateTime(
                                  item?.denNgay,
                                  "MM/YYYY"
                                )}
                              </h5>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="d-flex align-items-center justify-content-between px-2">
                            <div>
                              <h6 className="text-cv-8 fw-bold">
                                Chuyên ngành: {item?.chuyenNganh}
                              </h6>
                              <span>- {item?.moTa}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
                {/* Kinh nghiệm làm việc */}
                <div className="mt-4">
                  <div className="bg-core rounded my-2 py-2 text-white fw-bold text-center">
                    <span>Kinh nghiệm làm việc </span>
                  </div>
                  {ungTuyenVien?.dsKinhNghiemLamViec.map((item, index) => {
                    return (
                      <>
                        <div className="mt-3">
                          <div className="d-flex align-items-center justify-content-between px-2">
                            <div>
                              <h5 className="text-cv-8 fw-bold mt-1">
                                {item?.congTy}
                              </h5>
                            </div>
                            <div>
                              <h5 className="text-cv-8 fw-bold">
                                {TimeUtils.formatDateTime(
                                  item?.tuNgay,
                                  "MM/YYYY"
                                )}{" "}
                                -{" "}
                                {TimeUtils.formatDateTime(
                                  item?.denNgay,
                                  "MM/YYYY"
                                )}
                              </h5>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="d-flex align-items-center justify-content-between px-2">
                            <div>
                              <h6 className="text-cv-8 fw-bold">
                                Vi trí: <span>{item?.viTri}</span>
                              </h6>
                              <span>- {item?.moTa}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
                {/* Chứng chỉ */}
                <div className="mt-4">
                  <div className="bg-core rounded my-2 py-2 text-white fw-bold text-center">
                    <span>Chứng chỉ </span>
                  </div>
                  {ungTuyenVien?.dsChungChi.map((item, index) => {
                    return (
                      <>
                        <div className="mt-1">
                          <div className="d-flex align-items-center justify-content-between px-2 mt-3">
                            <div>
                              <h5 className="text-cv-8 fw-bold">
                                {item?.tenChungChi}
                              </h5>
                            </div>
                            <div>
                              <h5 className="text-cv-8 fw-bold">
                                {TimeUtils.formatDateTime(
                                  item?.ngayCap,
                                  "MM/YYYY"
                                )}{" "}
                                -{" "}
                                {TimeUtils.formatDateTime(
                                  item?.ngayHetHan,
                                  "MM/YYYY"
                                )}
                              </h5>
                            </div>
                          </div>
                        </div>
                        <div className="mt-1">
                          <div className="d-flex align-items-center justify-content-between px-2">
                            <div>
                              <h6 className="">
                                Đơn vị cung cấp:{" "}
                                <span>{item?.donViCungCap}</span>
                              </h6>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

ModalProfileDetail.propTypes = {};

export default ModalProfileDetail;
