import React from "react";

const Pagination = ({ numberOfPages, page, setPage }) => {
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const paginationButtons = [];
  const firstPage = 1;
  const lastPage = numberOfPages;

  if (page > 1) {
    paginationButtons.push(
      <button
        key="back"
        onClick={() => handlePageChange(page - 1)}
        className="bg-red text-white p-2 m-2 rounded-md"
      >
        &lt;
      </button>
    );
  }

  if (page > 1) {
    paginationButtons.push(
      <button
        key="first"
        onClick={() => handlePageChange(firstPage)}
        className=" text-white p-2 m-2 rounded-md"
      >
        1
      </button>
    );
  }

  if (page > 2) {
    paginationButtons.push(
      <button
        key="second"
        onClick={() => handlePageChange(firstPage + 1)}
        className=" text-white p-2 m-2 "
      >
        2
      </button>
    );
  }

  if (page > 4) {
    paginationButtons.push(
      <p key="...." className=" p-2 m-2">
        ...
      </p>
    );
  }

  if (page > 3) {
    paginationButtons.push(
      <button
        key="page - 1"
        onClick={() => handlePageChange(page - 1)}
        className=" text-white p-2 m-2 "
      >
        {page - 1}
      </button>
    );
  }

  paginationButtons.push(
    <p key={page} className=" text-red p-2 m-2">
      {page}
    </p>
  );

  if (page < lastPage) {
    paginationButtons.push(
      <button
        key="page + 1"
        onClick={() => handlePageChange(page + 1)}
        className=" text-white p-2 m-2 "
      >
        {page + 1}
      </button>
    );
  }

  if (page < lastPage - 3) {
    paginationButtons.push(
      <p key="..." className=" p-2 m-2">
        ...
      </p>
    );
  }

  if (page < lastPage - 2) {
    paginationButtons.push(
      <button
        key="last - 1"
        onClick={() => handlePageChange(lastPage - 1)}
        className=" text-white p-2 m-2 "
      >
        {lastPage - 1}
      </button>
    );
  }

  if (page < lastPage - 1) {
    paginationButtons.push(
      <button
        key="last"
        onClick={() => handlePageChange(lastPage)}
        className=" text-white p-2 m-2"
      >
        {lastPage}
      </button>
    );
  }

  if (page < lastPage) {
    paginationButtons.push(
      <button
        key="next"
        onClick={() => handlePageChange(page + 1)}
        className="bg-red text-white p-2 m-2 rounded-md"
      >
        &gt;
      </button>
    );
  }

  return paginationButtons;
};
export default Pagination;
