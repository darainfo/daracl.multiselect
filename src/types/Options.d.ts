import { MODE, ORIENTATION_TYPE } from "src/constants";
import { ALIGN_TYPE } from "../constants";

export interface OptionCallback {
  (...params: any[]): any;
}

/**
 * options
 */
export interface Options {
  style: {
    width: string;
    height: number;
  };

  mode: MODE; // single, double
  orientation: ORIENTATION_TYPE; // horizontal = 가로보기, vertical = 세로보기
  body: {
    enableMoveBtn: boolean; // 이동 버튼 보이기 여부
    moveBtnSize: number; // item move button 영역 width 값
  };
  enableAddEmptyMessage: boolean; // item 추가시 없을때 메시지 표시 할지 여부.
  enableRemoveEmptyMessage: boolean; // item 삭제시 없을때 메시지 표시 할지 여부.
  useMultiSelect: boolean; // ctrl , shift key 이용해서 다중 선택하기 여부
  containment: string; // 경계 영역
  useDragMove: boolean; // drag해서 이동할지 여부.
  useDragSort: boolean; // target drag 해서 정렬할지 여부.
  addPosition: ITEM_ADD_POSITION; // 추가 되는 item 어디 방향으로 추가할지. ex(top, bottom)
  duplicateCheck: boolean; // 중복 추가 여부.
  enableAddItemCheck: boolean; // 추가된 아이템 표시 여부.
  items: array; // item
  valueKey: string; // value key
  labelKey: string; //  label key
  pageNumKey: string; // page number key
  render: OptionCallback;
  enableUpDown: boolean; // target updown 버튼 활성화여부.

  source: {
    // source item
    label: string; // headerlabel
    labelAlign: ALIGN_TYPE;
    enableLabel: boolean; // header label 보일지 여부
    enableAddBtn: boolean; // 추가 버튼 보이기
    emptyMessage: string; // message
    items: array; // item
    click: OptionCallback | undefined; // 클릭시 이벤트
    search: {
      enable: boolean;
      callback: undefined | OptionCallback;
      enableKeyPress: boolean; // keypress event 활성화 여부
    };
    beforeMove: undefined | OptionCallback; // 이동전  이벤트
    completeMove: undefined | OptionCallback; // 이동 완료  이벤트
    paging: {
      // 다중으로 관리할경우 처리.
      enable: boolean;
      unitPage: number; // max page 값
      currPage: number; // 현재 값
    };
  };

  target: {
    label: string; // header label
    labelAlign: ALIGN_TYPE;
    enableLabel: boolean; // header label 보일지 여부
    enableRemoveBtn: boolean; // 삭제 버튼 보이기
    emptyMessage: string; // message
    items: array; // item
    limitSize: number; // 추가 가능한 size
    click: OptionCallback | undefined; // 클릭시 이벤트
    dblclick: OptionCallback | undefined;
    search: {
      enable: boolean;
      callback: undefined | OptionCallback;
      enableKeyPress: boolean; // keypress event 활성화 여부
    };

    beforeMove: boolean | OptionCallback; // 이동전  이벤트
    completeMove: boolean | OptionCallback; // 이동 완료  이벤트

    paging: {
      // 다중으로 관리할경우 처리.
      enable: boolean;
      unitPage: number; // max page 값
      currPage: number; // 현재 값
      enableMultiple: boolean; // 페이징 처리를 item 내부의 pageNo 값으로 처리.
    };
  };

  message: {
    // 방향키 있을때 메시지
    addEmpty: boolean;
    delEmpty: boolean;
    duplicate: boolean;
  };
  footer: {
    enable: boolean;
  };

  items: array;
}
