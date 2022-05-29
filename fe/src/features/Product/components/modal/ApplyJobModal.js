import React, { Fragment, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Checkbox, Input, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { ProfileContext } from "../../../../context/ProfileContextProvider";
import { AiFillEdit } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../../../../utils/localStorage";

const ApplyJobModal = ({ showModal, onCloseModal, isEdit, ...props }) => {
  const [isEntered, setIsEntered] = useState(false);
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const [introduce, setIntroduce] = useState();
  const [isSendEmail, setIsSendEmail] = useState(false);
  const [applyUser, setApplyUser] = useState({});
  const params = useParams();
  const { slug } = params;
  console.log(" modal isEdit", isEdit);
  const accountUser = getUserProfile();
  const uniqueId = accountUser.taiKhoan._id;

  const nextPage = () => {
    // const user = JSON.parse(localStorage.getItem("user"));
    // const payload = {
    //   loiGioiThieu: introduce,
    //   taiKhoan: user.taiKhoan._id,
    // };

    setIsEntered(true);
  };
  console.log("userrr", props.user);
  const save = () => {
    const payload = {
      ungTuyenVien: uniqueId,
      tinTuyenDung: slug,
      guiEmail: isSendEmail,
      thongTinLienHe: {
        ten: name.trim() || "",
        sdt: phone.trim() || "",
        email: email.trim(),
        loiGioiThieu: introduce.trim() || "",
      },
    };
    console.log("Fighting payload", payload);
    onSubmitApplyJob(payload);
  };
  const onSubmitApplyJob = (payload) => {
    props.onSubmit(payload);
    onCloseModal();
  };

  return (
    <div>
      <Modal
        title="Liên hệ với tôi"
        centered
        visible={showModal}
        // onOk={() => {
        //   console.log("Submit ok");
        // }}
        onCancel={() => {
          onCloseModal(false);
        }}
        className="mt-78"
        // width={800}
        footer={[
          <Button
            key="back"
            onClick={() => {
              console.log("Cancel");
              setIsEntered(false);
              //   onCloseModal(false);
            }}
          >
            {isEntered ? <span>Quay lại</span> : <span>Hủy bỏ</span>}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              {
                isEntered ? save() : nextPage();
              }
              //   onCloseModal(false);
            }}
          >
            {isEntered ? (
              <span>Nộp hồ sơ xin việc</span>
            ) : (
              <span>Tiếp tục</span>
            )}
          </Button>,
        ]}
      >
        {/* Modal 1 */}

        {!isEntered ? (
          <Fragment>
            <div className="pb-2">
              <p>
                <strong>
                  Thông tin giúp nhà tuyển dụng có thể kết nối tới bạn nhanh
                  nhất ngay sau khi ứng tuyển
                </strong>
              </p>
            </div>
            <div className="pb-2">
              <p>
                <strong>Họ tên</strong> <span className="text-danger">(*)</span>
              </p>
              <Input
                // showCount
                // maxLength={20}
                size="large"
                placeholder="Trung Vinh"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
               // defaultValue={props?.user?.ten}
              />
            </div>
            <div className="pb-2">
              <p>
                <strong>Số điện thoại</strong>{" "}
                <span className="text-danger">(*)</span>
              </p>
              <Input
                // showCount
                // maxLength={20}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                size="large"
                placeholder="0987079079"
              //  defaultValue={props?.user?.sdt}
              />
            </div>
            <div className="pb-2">
              <p>
                <strong>Địa chỉ email</strong>{" "}
                <span className="text-danger">(*)</span>
              </p>
              <Input
                // showCount
                // maxLength={20}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                size="large"
                placeholder="zunggzing@gmail.com"
               // defaultValue={props?.user?.taiKhoan?.email}
              />
            </div>
            <div className="pb-2">
              <p>
                <strong>Giới thiệu về bản thân</strong>{" "}
              </p>
              <TextArea
                showCount
                maxLength={500}
                style={{ height: 120 }}
                value={introduce}
                onChange={(e) => {
                  setIntroduce(e.target.value);
                }}
              //  defaultValue={props?.user?.loiGioiThieu}
              />
            </div>
            <div className="pb-2">
              <p>
                <strong>
                  Gặp vấn đề với ứng tuyển này? Vui lòng cho chúng tôi biết thêm
                  0987099099
                </strong>{" "}
              </p>
            </div>{" "}
          </Fragment>
        ) : (
          <Fragment>
            <div className="pb-1">
              <p>
                <strong>
                  Hãy xem lại hồ sơ xin việc của bạn để chắc chắc các thông tin
                  dưới là chính xác của bạn.
                </strong>
              </p>
            </div>
            <div className="pb-2">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <strong>Thông tin liên lạc</strong>
                </div>
                {isEntered && (
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setIsEntered(false);
                    }}
                  >
                    <span>
                      <AiFillEdit /> Sửa
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="pb-2">
              <div className="row">
                <div className="col-12">
                  <ul className="list-group">
                    <li className="list-group-item">
                      <div>
                        <strong>Họ tên</strong>
                      </div>
                      <div>
                        <span>{name}</span>
                      </div>
                    </li>
                    <li className="list-group-item">
                      <div>
                        <strong>Địa chỉ email</strong>
                      </div>
                      <div>
                        <span>{email}</span>
                      </div>
                    </li>
                    <li className="list-group-item">
                      <div>
                        <strong>Số điện thoại</strong>
                      </div>
                      <div>
                        <span>{phone}</span>
                      </div>
                    </li>
                    <li className="list-group-item">
                      <div>
                        <strong>Giới thiệu về bản thân</strong>
                      </div>
                      <div>
                        <span>{introduce}</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="col-12 mt-1">
                  <Checkbox
                    onChange={(e) => {
                      console.log(`checked = ${e.target.checked}`);
                      setIsSendEmail(e.target.checked);
                    }}
                  >
                    Thông báo cho tôi qua email khi có việc làm tương tự
                  </Checkbox>
                </div>
                <div className="col-12 mt-2">
                  <p>
                    Bằng cách nộp hồ sơ, bạn đồng ý với Điều khoản sử dụng và
                    Chính Sách Bảo Mật của 123job.vn cũng như đơn đăng ký của
                    bạn được gửi đến Nhà tuyển dụng và được xử lý theo chính
                    sách bảo mật của Nhà tuyển dụng.
                  </p>
                </div>
                <div className="col-12">
                  <p>
                    Gặp vấn đề với ứng tuyển này? Vui lòng cho chúng tôi biết
                    thêm 0987999000
                  </p>
                </div>
              </div>
            </div>
          </Fragment>
        )}
        {/* Modal 1 */}
      </Modal>
    </div>
  );
};

ApplyJobModal.propTypes = {};

export default ApplyJobModal;
