import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, Layout, Select } from "antd";
import axios from "axios";
import moment from "moment";
import queryString from "query-string";
import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { SearchContext } from "../../context/SearchContextProvider";
import { useCommonContext } from "./context/commonContext";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Header, Footer, Sider, Content } = Layout;

const SearchCommon = ({ careers, fields, locations }) => {
  const { detail, setDetail } = useContext(SearchContext);
  const { t } = useTranslation();
  const [cities, setCites] = useState(() => {});
  const history = useHistory();
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [hide, setHide] = useState(true);
  const typingTimeOutRef = useRef(null);
  const [career, selectCareer] = useState();
  const [filters, setFilters] = useState({
    // tieuDe: "",
    // nganhNghe: "",
    // linhVuc: "",
    // diaDiem: "",
    // soNamKinhNghiem: "",
    // viTri: "",
    // tuNgay: "",
    // denNgay: "",
    // page: 1,
    // loaiCongViec: "",
  });
  const paramsString = queryString.stringify(filters);
  const [recruitmentList, setRecruitmentList] = useState([]);
  const [isSubmitButton, setIsSubmitButton] = useState();
  const [showItem, setShowItem] = useState(false);

  let cityObjectUnikey = [];
  const dateFormat = "YYYY-MM-DD";
  const { levels, typeWorks, experiences, wages } = useCommonContext();

  const getAllCity = () => {
    let result = [];
    let cities = [];

    locations.map((location, index) =>
      result.push({ diaDiem: location.diaDiem.tinhThanhPho })
    );

    result.forEach((item) => {
      cities.push(item.diaDiem);
    });

    let cityUnikey = [...new Set(cities)];

    cityUnikey.forEach((item) => {
      cityObjectUnikey.push({
        diaDiem: item,
      });
    });
    return cityObjectUnikey;
  };

  getAllCity();

  const [title, setTitle] = useState();

  const handleKeywordChange = (event) => {
    if (typingTimeOutRef.current) {
      clearTimeout(typingTimeOutRef.current);
    }

    const kw = event.target.value.trim().toLowerCase();

    typingTimeOutRef.current = setTimeout(() => {
      setKeyword(kw);
    }, 500);
    // delete filters.nganhNghe;
    //     delete filters.linhVuc;
    // delete filters.diaDiem;
    // delete filters.soNamKinhNghiem;
    // delete filters.tuNgay;
    // delete filters.denNgay;
    // delete filters.viTri;
    // delete filters.loaiCongViec;
    setFilters({
      ...filters,
      trangThai: 2,
      page: 1,
      tieuDe: kw,
    });
  };
  //   tieuDe: "",
  // nganhNghe: "",
  // linhVuc: "",
  // diaDiem: "",
  // soNamKinhNghiem: "",
  // viTri: "",
  // tuNgay: "",
  // denNgay: "",
  // page: 1,
  // loaiCongViec: "",

  const handleSearchClick = () => {
    setIsSubmitButton(true);
    console.log("RESULT", paramsString);
    console.log("... ttv data", recruitmentList);
    if (recruitmentList.length === 0) {
      setShowItem(true);
    }

    history.replace(`/search?${paramsString}`);
  };

  useEffect(() => {
    const searchProducts = async () => {
      const requestUrl = `http://ec2-13-213-53-29.ap-southeast-1.compute.amazonaws.com:4000/tinTuyenDungs/timKiemTheoNhieuTieuChi?${paramsString}`;
      try {
        // const response = await productApi.searchProducts(keyword);
        const response = await axios.get(requestUrl);

        console.log("... tttv response", response);
        setRecruitmentList(response);
        setDetail(response);
        // setResults(response.products);
      } catch (error) {
        console.log(error.response);
      }
    };
    searchProducts();
  }, [isSubmitButton]);

  return (
    <Fragment>
      <div className="container pb-3 pt-4">
        <div className="bg-white">
          <div className="row">
            <div className="col-4">
              <Input
                placeholder={t("common.placeholder.searchInput")}
                className="fs-14"
                // onChange={(e) => {
                //   setTitle(e.target.value);
                // }}
                onChange={handleKeywordChange}
              />
              <br />
            </div>
            <div className="col-2">
              <Select
                showSearch
                style={{ width: "100%" }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
                defaultValue="Chọn ngành nghề"
                onChange={(e) => {
                  console.log("1. ", e);
                  if (e) {
                    selectCareer(e);
                    delete filters.tieuDe;
                    delete filters.linhVuc;
                    delete filters.diaDiem;
                    delete filters.soNamKinhNghiem;
                    delete filters.tuNgay;
                    delete filters.denNgay;
                    delete filters.viTri;
                    delete filters.loaiCongViec;
                    setFilters({
                      ...filters,
                      trangThai: 2,
                      page: 1,
                      nganhNghe: e,
                    });
                  }
                }}
              >
                {careers.map((career, index) => {
                  return (
                    <Option key={index} value={career.tenNganhNghe}>
                      {career.tenNganhNghe}
                    </Option>
                  );
                })}
              </Select>
              <br />
            </div>
            <div className="col-2">
              <Select
                showSearch
                style={{ width: "100%" }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
                defaultValue={t("Chọn lĩnh vực công ty")}
                onChange={(e) => {
                  console.log("1. ", e);
                  if (e) {
                    // delete filters.tieuDe;
                    // delete filters.nganhNghe;
                    // delete filters.diaDiem;
                    // delete filters.soNamKinhNghiem;
                    // delete filters.tuNgay;
                    // delete filters.denNgay;
                    // delete filters.viTri;
                    // delete filters.loaiCongViec;
                    setFilters({
                      ...filters,
                      trangThai: 2,
                      page: 1,
                      linhVuc: e,
                    });
                  }
                }}
              >
                {fields.map((field, index) => {
                  return (
                    <Option key={index} value={field.tenLinhVuc}>
                      {field.tenLinhVuc}
                    </Option>
                  );
                })}
              </Select>
              <br />
            </div>
            <div className="col-2">
              <Select
                showSearch
                style={{ width: "100%" }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
                defaultValue="Chọn địa điểm"
                onChange={(e) => {
                  console.log("3. ", e);
                  // delete filters.tieuDe;
                  // delete filters.nganhNghe;
                  // delete filters.linhVuc;
                  // delete filters.soNamKinhNghiem;
                  // delete filters.tuNgay;
                  // delete filters.denNgay;
                  // delete filters.viTri;
                  // delete filters.loaiCongViec;
                  setFilters({
                    ...filters,
                    trangThai: 2,
                    page: 1,
                    diaDiem: e,
                  });
                }}
              >
                {cityObjectUnikey.map((city, index) => {
                  return (
                    <Option key={index} value={city.diaDiem}>
                      {city.diaDiem}
                    </Option>
                  );
                })}
              </Select>
              <br />
            </div>
            <div className="col-2">
              <Select
                showSearch
                style={{ width: "100%" }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
                defaultValue="Chọn cấp bậc"
                onChange={(e) => {
                  // delete filters.tieuDe;
                  // delete filters.nganhNghe;
                  // delete filters.linhVuc;
                  // delete filters.soNamKinhNghiem;
                  // delete filters.tuNgay;
                  // delete filters.denNgay;
                  // delete filters.diaDiem;
                  // delete filters.loaiCongViec;
                  setFilters({
                    ...filters,
                    trangThai: 2,
                    page: 1,
                    viTri: e,
                  });
                }}
              >
                {levels.map((level, index) => {
                  return (
                    <Option key={index} value={level.capBac}>
                      {level.capBac}
                    </Option>
                  );
                })}
              </Select>
              <br />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-4">
              <RangePicker
                style={{ width: "100%" }}
                defaultValue={[
                  moment(new Date(), dateFormat),
                  moment(new Date(), dateFormat).add(3, "days"),
                ]}
                format={dateFormat}
              />
              <br />
            </div>
            <div className="col-2">
              <Select
                showSearch
                style={{ width: "100%" }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
                defaultValue={t("common.typeWork")}
                onChange={(e) => {
                  console.log("1. ", e);
                  // delete filters.tieuDe;
                  // delete filters.nganhNghe;
                  // delete filters.linhVuc;
                  // delete filters.soNamKinhNghiem;
                  // delete filters.tuNgay;
                  // delete filters.denNgay;
                  // delete filters.viTri;
                  // delete filters.diaDiem;
                  setFilters({
                    ...filters,
                    trangThai: 2,
                    page: 1,
                    loaiCongViec: e,
                  });
                }}
              >
                {typeWorks.map((typeWork, index) => {
                  return (
                    <Option key={index} value={typeWork.loaiCongViec}>
                      {typeWork.loaiCongViec}
                    </Option>
                  );
                })}
              </Select>
              <br />
            </div>

            <div className="col-2">
              <Select
                showSearch
                style={{ width: "100%" }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
                defaultValue={t("common.experience")}
                onChange={(e) => {
                  console.log("1. ", e);
                  // delete filters.tieuDe;
                  // delete filters.nganhNghe;
                  // delete filters.linhVuc;
                  // delete filters.loaiCongViec;
                  // delete filters.tuNgay;
                  // delete filters.denNgay;
                  // delete filters.viTri;
                  // delete filters.diaDiem;
                  setFilters({
                    ...filters,
                    page: 1,
                    trangThai: 2,
                    soNamKinhNghiem: e,
                  });
                }}
              >
                {experiences.map((experience, index) => {
                  return (
                    <Option key={index} value={experience.kinhNghiem}>
                      {experience.kinhNghiem}
                    </Option>
                  );
                })}
              </Select>
              <br />
            </div>
            {/* <div className="col-2">
              <Select
                showSearch
                style={{ width: "100%" }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
                defaultValue={t("common.wage")}
                onChange={(e) => {
                  console.log("1. ", e);
                  setFilters({
                    ...filters,
                    linhVuc: e,
                  });
                }}
              >
                {wages.map((wage, index) => {
                  return (
                    <Option key={index} value={wage.mucLuong}>
                      {wage.mucLuong}
                    </Option>
                  );
                })}
              </Select>
              <br />
            </div> */}

            <div className="col-4 text-center">
              <Button
                className="form-control d-flex align-items-center justify-content-center"
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearchClick}
              >
                Tìm kiếm
              </Button>
              <br />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SearchCommon;
