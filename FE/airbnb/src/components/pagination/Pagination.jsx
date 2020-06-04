import React, { useState, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import querystring from "query-string";

import {
  updateCurrentPage,
  updateStartEndPage,
} from "../../modules/pagination.js";

const Pagination = ({ location }) => {
  const POST_PER_PAGE = 20;
  const LASE_PAGE = 10;

  const url = process.env.REACT_APP_ROOMS_DB_HOST;
  const [pagination, setPagination] = useState(true);

  const dispatch = useDispatch();
  const history = useHistory();

  const {
    roomsListReducer: {
      content: { total },
    },
    paginationReducer: { startPage, endPage, currentPage },
  } = useSelector((state) => state);

  const totalPage = Math.ceil(total / POST_PER_PAGE);

  const totalPagination = Array(totalPage)
    .fill()
    .map((_, index) => index + 1);

  let pageNumbers = totalPagination.slice(startPage, endPage);

  const onClickPage = (pageNumber) => () => {
    const search = location.search;
    let offset = POST_PER_PAGE * pageNumber - POST_PER_PAGE;

    dispatch(updateCurrentPage(pageNumber));
    //params 변경
    const params = querystring.parse(search);
    console.log(params);
    if (params.offset) {
      params.offset = offset;
      console.log(params);
      history.push(querystring.stringify(params));

      //offset 변경 방법은?
    } else history.push(`${search}&offset=${offset}`);

    //fetch작업
  };

  const onClickPrev = () => {
    const FIRST_PAGE = 1;

    if (currentPage === FIRST_PAGE) return;
    if (currentPage % LASE_PAGE === FIRST_PAGE) {
      const start = startPage - LASE_PAGE;
      const end = endPage - LASE_PAGE;

      changePagination(start, end);
    }
    dispatch(updateCurrentPage(currentPage - 1));
  };

  const onClickNext = () => {
    const LAST_PAGE = totalPagination.length;
    const CURRENT_LAST_PAGE = 0;

    if (currentPage === LAST_PAGE) return;

    if (currentPage % LASE_PAGE === CURRENT_LAST_PAGE) {
      const start = startPage + LASE_PAGE;
      const end = endPage + LASE_PAGE;
      changePagination(start, end);
    }
    dispatch(updateCurrentPage(currentPage + 1));
  };

  const changePagination = (start, end) => {
    pageNumbers = totalPagination.slice(start, end);
    setPagination(true);
    dispatch(updateStartEndPage(start, end));
  };

  console.log(currentPage);

  return (
    <div>
      <ul>
        <li>
          <button onClick={onClickPrev}>이전</button>
        </li>
        {pagination &&
          pageNumbers.map((pageNumber) => (
            <li>
              <button onClick={onClickPage(pageNumber)}>{pageNumber}</button>
            </li>
          ))}
        <li>
          <button onClick={onClickNext}>다음</button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
