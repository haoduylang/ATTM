import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = (props) => {
  const { pagination, onPageChange } = props;
  const { _page, _limit, _totalRows } = pagination;

  const totalPages = Math.ceil(_totalRows / _limit);

  const handlePageChange = (newPage) => {
    const selectedPage = +newPage.selected + 1; // react-paginate uses 0-based indexing

    if (onPageChange) {
      onPageChange(selectedPage);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav aria-label="Page navigation example">
      <ReactPaginate
        forcePage={_page - 1}
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageChange}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
        disabledClassName={"disabled"}
      />
    </nav>
  );
};

export default Pagination;
