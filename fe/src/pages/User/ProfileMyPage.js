import { Avatar, Button, Card, Tabs, Tag, Timeline } from "antd";
import React, {
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AiFillCamera,
  AiFillDelete,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { FaUserEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { ProfileContext } from "../../context/ProfileContextProvider.js";
import profileApi from "../../services/profileApi.js";
import RecruitmentApplicantApi from "../../services/recruitmentApplicant.js";
import TimeUtils from "../../utils/timeUtils.js";
import CertificatedModal from "./components/profile/CertificatedModal.js";
import EducationModal from "./components/profile/EducationModal.js";
import ExperienceModal from "./components/profile/ExprerienceModal.js";
import InformationPersonal from "./components/profile/InformationPersonal.js";
import IntroduceModal from "./components/profile/IntroduceModal.js";
import SkillModal from "./components/profile/SkillModal.js";

const ProfileMyPage = ({ ...props }) => {
  const { TabPane } = Tabs;
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowModalEducation, setIsShowModalEducation] = useState(false);
  const [isShowModalExperience, setIsShowModalExperience] = useState(false);
  const [isShowModalCertificated, setIsShowModalCertificated] = useState(false);
  const [isShowModalSkill, setIsShowModalSkill] = useState(false);
  const { detail, setDetail, isEdit, setIsEdit, isEditStudy, setIsEditStudy } =
    useContext(ProfileContext);
  const [isSuccessSubmit, setIsSuccessSubmit] = useState(false);
  const [isHideButtonIntroduce, setIsHideButtonIntroduce] = useState(false);
  const [isMounted, setIsMounted] = useState(0);
  const [isShowModalUpdateEducation, setIsShowModalUpdateEducation] =
    useState(false);
  const [educationDetail, setEducationDetail] = useState({});
  const [isShowModalConfirmDelete, setIsShowModalConfirmDelete] =
    useState(false);

  useEffect(() => {
    console.log("detail", detail);
  }, [detail]);

  const user = JSON.parse(localStorage.getItem("user"));

  const getProfileDetail = async () => {
    try {
      const response =
        await RecruitmentApplicantApi.getRecruitmentApplicantById(
          user.taiKhoan._id
        );
      console.log("response", response);
      setDetail(response);
      setIsSuccessSubmit(false);
      setIsEdit(true);
    } catch (error) {
      setIsEdit(false);
    }
  };

  useEffect(() => {
    let timeout = null;
    if (isSuccessSubmit) {
      timeout = setTimeout(() => getProfileDetail(), 1000);
    }
    return () => clearTimeout(timeout);
  }, [isSuccessSubmit]);

  useEffect(() => {
    getProfileDetail();
    console.log("Data get profile by detail", detail);
  }, []);
  // Giới thiệu
  const handleSubmitModal = async (data) => {
    if (isEdit) {
      console.log("Call api update");
      console.log("update", data);
      try {
        const response =
          await RecruitmentApplicantApi.updateRecruitmentApplicant({
            loiGioiThieu: data.loiGioiThieu,
            taiKhoan: data.taiKhoan,
          });
        setDetail(response);
        setIsSuccessSubmit(true);
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
    } else {
      console.log("Call api create");
      try {
        const response =
          await RecruitmentApplicantApi.createRecruitmentApplicant(data);
        setDetail(response);
        setIsSuccessSubmit(true);
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
    }
  };

  const handleAddButtonClick = (e) => {
    e.preventDefault();
    setIsShowModal(true);
  };

  const renderModalIntroduce = useMemo(() => {
    if (!isShowModal) return null;

    return (
      <IntroduceModal
        showModal={isShowModal}
        onCloseModal={() => {
          setIsShowModal(false);
          // clearErrors();
        }}
        onSubmit={handleSubmitModal}
        detail={detail}
        isEdit={isEdit}
      />
    );
  }, [isShowModal, isEdit]);

  // Học tập
  const handleSubmitModalEducation = async (data) => {
    console.log("create study", data);
    try {
      const response = await profileApi.createStudy(data);
      console.log("response", response);
      if (response.status === "success") {
        toast.success("Thêm học vấn và bằng cấp thành công", {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        getProfileDetail();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response);
      // setLoading(false);
      console.log(error.response);
    }
  };

  const handleAddButtonClickEducation = (e) => {
    e.preventDefault();
    console.log("SHOW MODAL Education");
    setIsShowModalEducation(true);
    setIsEditStudy(false);
  };

  const renderModalEducation = useMemo(() => {
    if (!isShowModalEducation) return null;

    return (
      <EducationModal
        showModal={isShowModalEducation}
        onCloseModal={() => {
          setIsShowModalEducation(false);
          // clearErrors();
        }}
        onSubmit={handleSubmitModalEducation}
        isEdit={isEditStudy}
      />
    );
  }, [isShowModalEducation, isEditStudy]);

  // Handle Experience

  const handleSubmitModalExperience = async (data) => {
    console.log("Submit modal handleSubmitModalExperience");
    console.log("create study", data);
    try {
      const response = await profileApi.createExperience(data);
      console.log("response", response);
      if (response.status === "success") {
        toast.success("Thêm kinh nghiệm làm việc thành công", {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        getProfileDetail();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response);
      // setLoading(false);
      console.log(error.response);
    }
  };
  const handleAddButtonClickExperience = (e) => {
    e.preventDefault();
    console.log("SHOW MODAL handleAddButtonClickExperience");
    setIsShowModalExperience(true);
  };

  const renderModalExperience = useMemo(() => {
    if (!isShowModalExperience) return null;

    return (
      <ExperienceModal
        showModal={isShowModalExperience}
        onCloseModal={() => {
          setIsShowModalExperience(false);
          // clearErrors();
        }}
        onSubmit={handleSubmitModalExperience}
      />
    );
  }, [isShowModalExperience]);

  // Handle Certificated

  const handleSubmitModalCertificated = async (data) => {
    console.log("Submit modal handleSubmitModalExperience");
    console.log("create study", data);
    try {
      const response = await profileApi.createCertificated(data);
      console.log("response", response);
      if (response.status === "success") {
        toast.success("Thêm mới chứng chỉ thành công", {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        getProfileDetail();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response);
      // setLoading(false);
      console.log(error.response);
    }
  };
  const handleAddButtonClickCertificated = (e) => {
    e.preventDefault();
    console.log("SHOW MODAL Certificated");
    setIsShowModalCertificated(true);
  };

  const renderModalCertificated = useMemo(() => {
    if (!isShowModalCertificated) return null;

    return (
      <CertificatedModal
        showModal={isShowModalCertificated}
        onCloseModal={() => {
          setIsShowModalCertificated(false);
          // clearErrors();
        }}
        onSubmit={handleSubmitModalCertificated}
      />
    );
  }, [isShowModalCertificated]);

  // Handle Skill

  const handleSubmitModalSkill = async (data) => {
    console.log("create skill", data);
    try {
      const response = await profileApi.createSkill(data);
      console.log("response", response);
      if (response.status === "success") {
        toast.success("Thêm kỹ năng thành công", {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        getProfileDetail();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response);
      // setLoading(false);
      console.log(error.response);
    }
  };
  const handleAddButtonClickSkill = (e) => {
    e.preventDefault();
    console.log("SHOW MODAL Skill");
    setIsShowModalSkill(true);
  };

  const renderModalSkill = useMemo(() => {
    if (!isShowModalSkill) return null;

    return (
      <SkillModal
        showModal={isShowModalSkill}
        onCloseModal={() => {
          setIsShowModalSkill(false);
          // clearErrors();
        }}
        onSubmit={handleSubmitModalSkill}
      />
    );
  }, [isShowModalSkill]);

  const handleAddButtonClickUpdateEducation = (id) => {
    console.log("ID", id);
    setIsShowModalEducation(true);
  };
  const handleSubmitModalInformationPersonal = async (data) => {
    try {
      console.log("data vinh", data);
      const response = await profileApi.updateUngTuyenVien(data);
      console.log("response", response);
      toast.success("Cập nhật thông tin thành công", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      getProfileDetail();
    } catch (error) {
      console.log(error);
      toast.error(error.response);
      // setLoading(false);
      console.log(error.response);
    }
  };

  const [isShowModalInformationPersonal, setIsShowModalInformationPersonal] =
    useState(false);
  const handleAddButtonClickInformation = (e) => {
    console.log("E", e);
    e.preventDefault();
    setIsShowModalInformationPersonal(true);
  };

  const renderModalInformationPersonal = useMemo(() => {
    if (!isShowModalInformationPersonal) return null;

    return (
      <InformationPersonal
        showModal={isShowModalInformationPersonal}
        onCloseModal={() => {
          setIsShowModalInformationPersonal(false);
          // clearErrors();
        }}
        onSubmit={handleSubmitModalInformationPersonal}
      />
    );
  }, [isShowModalInformationPersonal]);

  // const handleAddButtonClickUpdateEducation = (id) => {
  //   console.log("ID", id);
  //   setIsShowModalEducation(true);
  // };
  // const renderModalDelete = useMemo(() => {
  //   if (!isShowModalConfirmDelete) return null;

  //   return (
  //     <ConfirmDelete
  //       showModal={isShowModalConfirmDelete}
  //       onCloseModal={() => {
  //         setIsShowModalConfirmDelete(false);
  //         // clearErrors();
  //       }}
  //       onSubmit={handleSubmitDelete}
  //     />
  //   );
  // }, [isShowModalConfirmDelete]);
  const handleDeleteStudy = async (id) => {
    console.log("Delete by 1", id);
    try {
      console.log("Delete by 2", id);
      const response = await profileApi.deleteStudy({ idHocVan: id });
      console.log("response", response);

      toast.success("Xóa học vấn và bằng cấp thành công", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      getProfileDetail();
    } catch (error) {
      console.log(error);
      toast.error(error.response);
      // setLoading(false);
      console.log(error.response);
    }
  };
  const handleDeleteExperience = async (id) => {
    try {
      const response = await profileApi.deleteExperience({
        idKinhNghiemLamViec: id,
      });
      console.log("response", response);
      toast.success("Xóa kinh nghiệm làm việc thành công thành công", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      getProfileDetail();
    } catch (error) {
      console.log(error);
      toast.error(error.response);
      // setLoading(false);
      console.log(error.response);
    }
  };
  const handleAddButtonClickDeleteSkill = async (id) => {
    try {
      const response = await profileApi.deleteSkill({ idKyNang: id });
      console.log("response", response);

      toast.success("Xóa kỹ năng thành công", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      getProfileDetail();
    } catch (error) {
      console.log(error);
      toast.error(error.response);
      // setLoading(false);
      console.log(error.response);
    }
  };
  const handleAddButtonClickDeleteCertificated = async (id) => {
    try {
      const response = await profileApi.deleteCertificated({
        idChungChi: id,
      });
      console.log("response", response);

      toast.success("Xóa chứng chỉ/giấy xác nhận thành công", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      getProfileDetail();
    } catch (error) {
      console.log(error);
      toast.error(error.response);
      // setLoading(false);
      console.log(error.response);
    }
  };
  return (
    <Fragment>
      {" "}
      <div className="bg-white" style={{ height: "306px" }}>
        <div className="profile-wrapper position-relative">
          <div className="profile-banner">
            <img src="https://123job.vn/images/profile/background_profile.png" />
          </div>
          <div className="profile-avatar d-flex align-items-center justify-content-center">
            <div className="position-relative  cursor-pointer">
              <Avatar
                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                src={`https://webtuyendung.s3.ap-southeast-1.amazonaws.com/${detail?.data?.avatar}`}
              />
              <label htmlFor="icon-button-file" className="cursor-pointer">
                <span className="position-absolute profile-avatar-icon">
                  <AiFillCamera />
                </span>
              </label>
            </div>
          </div>
          <input
            accept="image/*"
            id="icon-button-file"
            type="file"
            name="file"
            style={{ display: "none" }}
          />
        </div>
      </div>
      <div className="bg-white mt-3">
        <div className="px-1 border py-3">
          <Tabs tabPosition="left">
            <TabPane tab="Hồ sơ" key="1">
              <div className="row">
                <div className="col-12">
                  {/* <Card> */}
                  <Card type="inner" title="Giới thiệu">
                    <div className="row">
                      <div className="col-10">
                        <span>
                          {isEdit ? (
                            detail?.data?.loiGioiThieu
                          ) : (
                            <p className="text-center">
                              Giới thiệu bản thân của bạn
                            </p>
                          )}
                        </span>
                      </div>
                      <div className="col-2">
                        {isEdit && (
                          <Button
                            onClick={(e) => {
                              handleAddButtonClick(e);
                            }}
                            className="form-control d-flex align-items-center justify-content-center"
                            icon={<FaUserEdit />}
                            size="default"
                          >
                            <span className="ps-2">Chỉnh sửa</span>
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-3"></div>
                      <div className="col-6">
                        {!isEdit && (
                          <Button
                            onClick={(e) => handleAddButtonClick(e)}
                            className="form-control d-flex align-items-center justify-content-center py-2 my-4"
                            type="primary"
                            icon={<AiOutlinePlusCircle />}
                            size="default"
                          >
                            <span className="ps-2">Thêm giới thiệu</span>
                          </Button>
                        )}
                      </div>
                      <div className="col-3"></div>
                    </div>
                  </Card>
                  <Card
                    style={{ marginTop: 16 }}
                    type="inner"
                    title="Học vấn và bằng cấp"
                  >
                    {detail?.data?.dsHocVan.length > 0 ? (
                      <>
                        {detail?.data?.dsHocVan.map((item, index) => {
                          return (
                            <div className="row" key={index}>
                              <div className="col-10">
                                <Timeline mode="left">
                                  <div className="row">
                                    <div className="col-12">
                                      <Timeline.Item>
                                        <p>
                                          <strong>
                                            {item?.bangCap} -{" "}
                                            {item?.chuyenNganh}
                                          </strong>
                                        </p>
                                        <p>{item?.donViDaoTao}</p>
                                        <p>
                                          {TimeUtils.formatDateTime(
                                            item?.tuNgay,
                                            "DD-MM-YYYY"
                                          )}{" "}
                                          -{" "}
                                          {TimeUtils.formatDateTime(
                                            item?.denNgay,
                                            "DD-MM-YYYY"
                                          )}
                                        </p>
                                        <p>{item?.moTa}</p>
                                      </Timeline.Item>
                                    </div>
                                  </div>
                                </Timeline>
                              </div>
                              <div className="col-2">
                                {detail?.data?.dsHocVan?.length > 0 && (
                                  <>
                                    <span>
                                      <Button
                                        onClick={(e) => {
                                          handleAddButtonClickUpdateEducation(
                                            item?._id
                                          );
                                        }}
                                        className="form-control d-flex align-items-center justify-content-center mb-3"
                                        icon={<FaUserEdit />}
                                        size="default"
                                      >
                                        <span className="ps-2">Chỉnh sửa</span>
                                      </Button>
                                    </span>

                                    <span>
                                      <Button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleDeleteStudy(item?._id);
                                        }}
                                        className="form-control d-flex align-items-center justify-content-center bg-danger text-white"
                                        icon={<AiFillDelete />}
                                        size="default"
                                      >
                                        <span className="ps-2">Xóa</span>
                                      </Button>
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <p className="text-center">
                        Hãy giúp nhà tuyển dụng hiểu rõ hơn về bạn. Thông tin về
                        quá trình học vấn sẽ giúp tăng cơ hội phỏng vấn của bạn
                        đến 23%.
                      </p>
                    )}
                    <div className="row">
                      <div className="col-4"></div>
                      <div className="col-4">
                        {!isEditStudy && (
                          <Button
                            onClick={(e) => handleAddButtonClickEducation(e)}
                            className="form-control d-flex align-items-center justify-content-center py-2 my-4"
                            type="primary"
                            icon={<AiOutlinePlusCircle />}
                            size="default"
                          >
                            <span className="ps-2">
                              Thêm học vấn và bằng cấp
                            </span>
                          </Button>
                        )}
                      </div>
                      <div className="col-4"></div>
                    </div>
                  </Card>
                  <Card
                    style={{ marginTop: 16 }}
                    type="inner"
                    title="Kinh nghiệm làm việc"
                  >
                    {/* <div className="row">
                      <div className="col-10">
                        <Timeline mode="left">
                          <div className="row">
                            <div className="col-12">
                              <Timeline.Item>
                                <p>
                                  <strong>Cử nhân - CNTT</strong>
                                </p>
                                <p>Cao học - Đại học lâm nghiệp Việt Nam</p>
                                <p>1/2021 - 2/2021</p>
                                <p>Mô tả thêm</p>
                              </Timeline.Item>
                            </div>
                          </div>
                        </Timeline>
                      </div>
                      <div className="col-2">
                        {detail?.data?.dsKyNang?.length > 0 && (
                          <>
                            <span>
                              <Button
                                onClick={(e) => {
                                  // handleAddButtonClickUpdateEducation(
                                  //   item?._id
                                  // );
                                }}
                                className="form-control d-flex align-items-center justify-content-center mb-3"
                                icon={<FaUserEdit />}
                                size="default"
                              >
                                <span className="ps-2">Chỉnh sửa</span>
                              </Button>
                            </span>

                            <span>
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  // handleDeleteStudy(item?._id);
                                }}
                                className="form-control d-flex align-items-center justify-content-center bg-danger text-white"
                                icon={<AiFillDelete />}
                                size="default"
                              >
                                <span className="ps-2">Xóa</span>
                              </Button>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                   */}
                    {detail?.data?.dsKinhNghiemLamViec.length > 0 && (
                      <>
                        {detail?.data?.dsKinhNghiemLamViec.map(
                          (item, index) => {
                            return (
                              <div className="row" key={index}>
                                <div className="col-10">
                                  <Timeline mode="left">
                                    <div className="row">
                                      <div className="col-12">
                                        <Timeline.Item>
                                          <p>
                                            <strong>{item?.viTri}</strong>
                                          </p>
                                          <p>{item?.congTy}</p>
                                          <p>
                                            {TimeUtils.formatDateTime(
                                              item?.tuNgay,
                                              "DD-MM-YYYY"
                                            )}{" "}
                                            -{" "}
                                            {TimeUtils.formatDateTime(
                                              item?.denNgay,
                                              "DD-MM-YYYY"
                                            )}
                                          </p>
                                          <p>{item?.moTa}</p>
                                        </Timeline.Item>
                                      </div>
                                    </div>
                                  </Timeline>
                                </div>
                                <div className="col-2">
                                  {detail?.data?.dsKinhNghiemLamViec?.length >
                                    0 && (
                                    <>
                                      <span>
                                        <Button
                                          onClick={(e) => {
                                            // handleAddButtonClickUpdateEducation(
                                            //   item?._id
                                            // );
                                          }}
                                          className="form-control d-flex align-items-center justify-content-center mb-3"
                                          icon={<FaUserEdit />}
                                          size="default"
                                        >
                                          <span className="ps-2">
                                            Chỉnh sửa
                                          </span>
                                        </Button>
                                      </span>

                                      <span>
                                        <Button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleDeleteExperience(item?._id);
                                          }}
                                          className="form-control d-flex align-items-center justify-content-center bg-danger text-white"
                                          icon={<AiFillDelete />}
                                          size="default"
                                        >
                                          <span className="ps-2">Xóa</span>
                                        </Button>
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </>
                    )}{" "}
                    {detail?.data?.dsKinhNghiemLamViec.length < 1 && (
                      <p className="text-start">
                        77,9% nhà tuyển dụng được khảo sát coi kinh nghiệm làm
                        việc là dữ liệu quan trọng trong các trong các hồ sơ ứng
                        tuyển. Vì vậy, hãy chắc chắn điền vào phần này để đảm
                        bảo tăng cơ hội được phỏng vấn
                      </p>
                    )}
                    {detail?.data?.dsKinhNghiemLamViec.length < 1 && (
                      <div className="row">
                        <div className="col-4"></div>
                        <div className="col-4">
                          <Button
                            onClick={(e) => handleAddButtonClickExperience(e)}
                            className="form-control d-flex align-items-center justify-content-center py-2 my-4"
                            type="primary"
                            icon={<AiOutlinePlusCircle />}
                            size="default"
                          >
                            <span className="ps-2">
                              Thêm kinh nghiệm làm việc
                            </span>
                          </Button>
                        </div>
                        <div className="col-4"></div>
                      </div>
                    )}
                  </Card>
                  <Card
                    style={{ marginTop: 16 }}
                    type="inner"
                    title="Kỹ năng chuyên môn"
                  >
                    <div className="row">
                      {detail?.data?.dsKyNang.length > 0 && (
                        <>
                          {detail?.data?.dsKyNang.map((item, index) => {
                            return (
                              <div key={index}>
                                <div className="col-10">
                                  <Tag
                                    closable
                                    onClose={(e) => {
                                      e.preventDefault();
                                      handleAddButtonClickDeleteSkill(
                                        item?._id
                                      );
                                    }}
                                    className="d-flex align-items-center justify-content-between"
                                    style={{
                                      fontSize: "14px",
                                      width: "100%",
                                      padding: "6px",
                                    }}
                                  >
                                    {item?.tenKyNang}
                                  </Tag>
                                </div>
                                <div className="col-2">
                                  <span>
                                    <Button
                                      onClick={(e) => {
                                        // handleAddButtonClickDeleteSkill(
                                        //   item?._id
                                        // );
                                      }}
                                      className="form-control d-flex align-items-center justify-content-center mb-3"
                                      icon={<FaUserEdit />}
                                      size="default"
                                    >
                                      <span className="ps-2">Chỉnh sửa</span>
                                    </Button>
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                      {detail?.data?.dsKyNang.length < 1 && (
                        <span className="text-center">
                          {" "}
                          Giờ không phải là lúc tỏ ra khiêm nhường. Hãy chia sẻ
                          những điểm mạnh nhất của bạn để thu hút những nhà
                          tuyển dụng hàng đầu.
                        </span>
                      )}
                    </div>
                    <div className="row">
                      <div className="col-4"></div>
                      <div className="col-4">
                        <Button
                          onClick={(e) => handleAddButtonClickSkill(e)}
                          className="form-control d-flex align-items-center justify-content-center py-2 my-4"
                          type="primary"
                          icon={<AiOutlinePlusCircle />}
                          size="default"
                        >
                          <span className="ps-2">Thêm kỹ năng</span>
                        </Button>
                      </div>
                      <div className="col-4"></div>
                    </div>
                  </Card>
                  <Card
                    style={{ marginTop: 16 }}
                    type="inner"
                    title="Chứng chỉ / Giấy chứng nhận"
                  >
                    {detail?.data?.dsHocVan.length > 0 && (
                      <>
                        {detail?.data?.dsChungChi.map((item, index) => {
                          return (
                            <div className="row" key={index}>
                              <div className="col-10">
                                <Timeline mode="left">
                                  <div className="row">
                                    <div className="col-12">
                                      <Timeline.Item>
                                        <p>
                                          <strong>
                                            {item?.tenChungChi} -{" "}
                                            {item?.donViCungCap}
                                          </strong>
                                        </p>
                                        <p>
                                          {TimeUtils.formatDateTime(
                                            item?.ngayCap,
                                            "DD-MM-YYYY"
                                          )}{" "}
                                          -{" "}
                                          {TimeUtils.formatDateTime(
                                            item?.ngayHetHan,
                                            "DD-MM-YYYY"
                                          )}
                                        </p>
                                      </Timeline.Item>
                                    </div>
                                  </div>
                                </Timeline>
                              </div>
                              <div className="col-2">
                                {detail?.data?.dsChungChi?.length > 0 && (
                                  <>
                                    <span>
                                      <Button
                                        onClick={(e) => {
                                          // handleAddButtonClickUpdateEducation(
                                          //   item?._id
                                          // );
                                        }}
                                        className="form-control d-flex align-items-center justify-content-center mb-3"
                                        icon={<FaUserEdit />}
                                        size="default"
                                      >
                                        <span className="ps-2">Chỉnh sửa</span>
                                      </Button>
                                    </span>

                                    <span>
                                      <Button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleAddButtonClickDeleteCertificated(
                                            item?._id
                                          );
                                        }}
                                        className="form-control d-flex align-items-center justify-content-center bg-danger text-white"
                                        icon={<AiFillDelete />}
                                        size="default"
                                      >
                                        <span className="ps-2">Xóa</span>
                                      </Button>
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}

                    {detail?.data?.dsChungChi.length < 1 && (
                      <p className="text-center">
                        Chứng chỉ về ngoại ngữ, kỹ năng quản lý, ...
                      </p>
                    )}

                    <div className="row">
                      <div className="col-4"></div>
                      <div className="col-4">
                        <Button
                          onClick={(e) => handleAddButtonClickCertificated(e)}
                          className="form-control d-flex align-items-center justify-content-center py-2 my-4"
                          type="primary"
                          icon={<AiOutlinePlusCircle />}
                          size="default"
                        >
                          <span className="ps-2">Thêm mới chứng chỉ</span>
                        </Button>
                      </div>
                      <div className="col-4"></div>
                    </div>
                    {/* <div className="row">
                      {detail?.data?.dsChungChi.length > 0 ?
                      
                    }
                      <div className="col-10">
                        <span>
                          {" "}
                          
                        </span>
                      </div>
                      <div className="col-2">
                        <Button
                          onClick={(e) => {
                            handleAddButtonClickCertificated(e);
                          }}
                          className="form-control d-flex align-items-center justify-content-center"
                          icon={<FaUserEdit />}
                          size="default"
                        >
                          <span className="ps-2">Chỉnh sửa</span>
                        </Button>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-4"></div>
                      <div className="col-4">
                        <Button
                          onClick={(e) => handleAddButtonClickCertificated(e)}
                          className="form-control d-flex align-items-center justify-content-center py-2 my-4"
                          type="primary"
                          icon={<AiOutlinePlusCircle />}
                          size="default"
                        >
                          <span className="ps-2">Thêm mới chứng chỉ</span>
                        </Button>
                      </div>
                      <div className="col-4"></div>
                    </div> */}
                  </Card>
                  {/* </Card> */}
                </div>
              </div>
            </TabPane>
            <TabPane tab="Thông tin" key="2">
              <div className="row">
                <div className="col-12">
                  {/* <Card> */}
                  <Card type="inner" title="Thông tin">
                    <div className="row">
                      <div className="col-12">
                        <h4>
                          <Button
                            type="primary"
                            className="rounded me-2"
                            onClick={handleAddButtonClickInformation}
                          >
                            Thông tin cá nhân
                          </Button>
                          <Button
                            type="danger"
                            className="ms-2 rounded"
                            style={{ width: "150px" }}
                          >
                            Xem thêm
                          </Button>
                        </h4>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
      {renderModalIntroduce}
      {renderModalEducation}
      {renderModalExperience}
      {renderModalCertificated}
      {renderModalSkill}
      {renderModalInformationPersonal}
      {/* {renderModalDelete} */}
    </Fragment>
  );
};

ProfileMyPage.defaultProps = {
  detail: {},
};

export default ProfileMyPage;
