import ReactPaginate from "react-paginate";
const Pagination = ({ pagination, onPageChange }) => {
  const { limit, total } = pagination;
  console.log("pagination", pagination);
  const totalPages = Math.ceil(total / limit);
  const handlePageClick = (newPage) => {
    onPageChange(newPage);
    window.scrollTo(0, 0);
  };
  return (
    <ReactPaginate
      previousLabel={"Trước"}
      nextLabel={"Sau"}
      breakLabel={"..."}
      // pageCount={pageCount}
      pageCount={totalPages}
      pageRangeDisplayed={6}
      marginPagesDisplayed={6}
      containerClassName={"justify-content-center pagination"}
      // disabledClassName={"text-gray-300"}
      pageClassName={"page-item"}
      activeClassName={"active"}
      pageLinkClassName={"page-link"}
      previousClassName={"page-item"}
      // onPageChange={handlePageClick}
      onPageChange={handlePageClick}
      previousLinkClassName={"page-link"}
      nextClassName={"page-item"}
      nextLinkClassName={"page-link"}
      breakClassName={"page-item"}
      breakLinkClassName={"page-link"}
    />
  );
};

export default Pagination;
