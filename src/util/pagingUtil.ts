import domUtils from "./domUtils";
import DaraMultiSelect from "src/DaraMultiSelect";
import { Paging } from "@t/Paging";

export default {
  setPaging(ctx: DaraMultiSelect, pageSelector: string, _paging: Paging) {
    _paging = _paging || {};

    const pagingInfo = this.getPagingInfo(_paging.totalCount || 0, _paging.currPage, _paging.countPerPage, _paging.unitPage);

    const pageNaviEle = document.querySelector(`#${pageSelector}`);

    if (pagingInfo.totalCount < 1) {
      domUtils.empty(pageNaviEle);
      return;
    }

    ctx.config.pageNo = pagingInfo.currPage;
    ctx.config.pagingInfo = pagingInfo;

    let currP = pagingInfo.currPage;
    if (currP == 0) currP = 1;

    const preP_is = pagingInfo.prePage_is;
    const currS = pagingInfo.currStartPage ?? 1;

    let currE = pagingInfo.currEndPage ?? 0;
    if (currE == 0) currE = 1;

    const nextO = 1 * currP + 1;
    const preO = currP - 1;
    const strHTML = [];
    strHTML.push("<ul>");

    if (currP <= 1) {
      strHTML.push(' <li class="disabled page-icon"><a href="javascript:">&laquo;</a></li>');
    } else {
      strHTML.push(' <li><a href="javascript:" class="page-num page-icon" pageno="' + preO + '">&laquo;</a></li>');
    }

    if (preP_is && currE - pagingInfo.unitPage >= 0) {
      strHTML.push(' <li class="page-num" pageno="1"><a href="javascript:" >1...</a></li>');
    }

    let no = 0;
    for (no = currS * 1; no <= currE * 1; no++) {
      if (no == currP) {
        strHTML.push(' <li class="active"><a href="javascript:">' + no + "</a></li>");
      } else {
        strHTML.push(' <li class="page-num" pageno="' + no + '"><a href="javascript:" >' + no + "</a></li>");
      }
    }

    if (currS + pagingInfo.unitPage < pagingInfo.totalPage) {
      strHTML.push(' <li class="page-num" pageno="' + pagingInfo.totalPage + '"><a href="javascript:" >...' + pagingInfo.totalPage + "</a></li>");
    }

    if (currP == currE) {
      strHTML.push(' <li class="disabled"><a href="javascript:">&raquo;</a></li>');
    } else {
      strHTML.push(' <li><a href="javascript:" class="page-num page-icon" pageno="' + nextO + '">&raquo;</a></li>');
    }

    strHTML.push("</ul>");

    domUtils.empty(pageNaviEle, strHTML.join(""));

    return this;
  },

  /**
   * 페이징 하기
   * @param  totalCount {int} 총카운트
   * @param  currPage {int} 현재 페이지
   * @param  countPerPage {int} 한페이지에 나올 row수
   * @param  unitPage {int} 한페이지에 나올 페이번호 갯수
   * @returns
   */
  getPagingInfo(totalCount: number, currPage: number, countPerPage: number, unitPage: number) {
    countPerPage = countPerPage || 10;
    unitPage = unitPage || 10;

    if (totalCount < 1) {
      return {
        currPage: 0,
        unitPage: 0,
        totalCount: 0,
        totalPage: 0,
      };
    }

    if (totalCount < countPerPage) {
      countPerPage = totalCount;
    }

    const totalPage = totalCount % countPerPage == 0 ? totalCount / countPerPage : Math.floor(totalCount / countPerPage) + 1;

    if (totalPage < currPage) {
      currPage = totalPage;
    }

    let currStartPage;
    let currEndPage;

    if (totalPage <= unitPage) {
      currEndPage = totalPage;
      currStartPage = 1;
    } else {
      let halfUnitPage = unitPage;

      if (currPage == unitPage || (currPage > unitPage && totalPage - (currPage - 1) >= unitPage)) {
        halfUnitPage = Math.floor(unitPage / 2);
      }

      if (currPage <= halfUnitPage) {
        currEndPage = unitPage;
        currStartPage = 1;
      } else if (currPage + halfUnitPage < totalPage) {
        currEndPage = currPage + halfUnitPage;
        currStartPage = currEndPage - unitPage + 1;
      } else {
        currEndPage = currPage + halfUnitPage;

        if (currEndPage > totalPage) {
          currEndPage = totalPage;
        }
        currStartPage = currEndPage - unitPage + 1;
      }
    }

    if (currEndPage > totalPage) currEndPage = totalPage;

    let prePage = 0;
    let prePage_is = false;
    if (currStartPage != 1) {
      prePage_is = true;
      prePage = currStartPage - 1;
    }

    let nextPage = 0;
    let nextPage_is = false;
    if (currEndPage != totalPage) {
      nextPage_is = true;
      nextPage = currEndPage + 1;
    }

    return {
      currPage: currPage,
      unitPage: unitPage,
      prePage: prePage,
      prePage_is: prePage_is,
      nextPage: nextPage,
      nextPage_is: nextPage_is,
      currStartPage: currStartPage,
      currEndPage: currEndPage,
      countPerPage: countPerPage,
      totalCount: totalCount,
      totalPage: totalPage,
    };
  },
};
