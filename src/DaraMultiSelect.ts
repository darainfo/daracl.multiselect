import { Options } from "@t/Options";
import utils from "./util/utils";
import { Message } from "@t/Message";
import Lanauage from "./util/Lanauage";
import { PageItem } from "./store/PageItem";
import { SourceItem } from "./store/SourceItem";
import { TargetItem } from "./store/TargetItem";

const defaultOptions = {
  style: {
    width: "auto",
    height: 300,
  },
  mode: "double", // single, double
  orientation: "horizontal", // x = 가로보기 , y = 세로보기
  body: {
    enableMoveBtn: true, // 이동 버튼 보이기 여부
    moveBtnSize: 50, // item move button 영역 width 값
  },
  enableAddEmptyMessage: false, // item 추가시 없을때 메시지 표시 할지 여부.
  enableRemoveEmptyMessage: false, // item 삭제시 없을때 메시지 표시 할지 여부.
  useMultiSelect: true, // ctrl , shift key 이용해서 다중 선택하기 여부
  containment: "", // 경계 영역
  useDragMove: false, // drag해서 이동할지 여부.
  useDragSort: false, // target drag 해서 정렬할지 여부.
  addPosition: "bottom", // 추가 되는 방향키로 추가시 어디를 추가할지. ex(source, last)
  duplicateCheck: true, // 중복 추가 여부.
  enableAddItemCheck: true, // 추가된 아이템 표시 여부.
  items: [], // item
  valueKey: "code", // value key
  labelKey: "name", //  label key
  pageNumKey: "pageNo", // page number key
  source: {
    // source item
    label: "", // headerlabel
    labelAlign: "center",
    enableLabel: false,
    enableAddBtn: true, // 추가 버튼 활성화 여부
    emptyMessage: "", // message
    items: [], // item
    search: {
      enable: false,
      enableKeyPress: false, // keypress event 활성화 여부
      /*
			,callback : function (searchWord, evtType){ // enter ,search button click callback 
				//console.log(searchWord)		
			}
			*/
    },
    paging: {
      // 다중으로 관리할경우 처리.
      enable: false,
      unitPage: 1, // max page 값
      currPage: 1, // 현재 값
    },
  },
  target: {
    label: "", // header label
    labelAlign: "center",
    enableLabel: false,
    enableRemoveBtn: true, // 삭제 버튼 활성화 여부
    items: [], // item
    emptyMessage: "", // message
    limitSize: -1, // 추가 가능한 max size
    search: {
      enable: false,
      enableKeyPress: false, // keypress event 활성화 여부
      /*
			,callback : function (searchWord, evtType){ // enter ,search button click callback 
				//console.log(searchWord)		
			}
			*/
    },
    paging: {
      // 다중으로 관리할경우 처리.
      enable: false,
      unitPage: 1, // max page 값
      currPage: 1, // 현재 값
      enableMultiple: true, // 페이징 처리를 item 내부의 pageNo 값으로 처리.
    },
  },
  message: {
    // 방향키 있을때 메시지
    addEmpty: false,
    delEmpty: false,
    duplicate: false,
  },
  footer: {
    enable: false,
  },
} as Options;

const defaultPaging = {
  unitPage: 10,
  currPage: 1,
};

interface ComponentMap {
  [key: string]: DaraMultiSelect;
}

// all instance
const allInstance: ComponentMap = {};

/**
 * DaraMultiSelect class
 *
 * @class DaraMultiSelect
 * @typedef {DaraMultiSelect}
 */
export default class DaraMultiSelect {
  public options;

  private orginStyleClass;

  private selector: string;

  private prefix: string;

  public mainElement: HTMLElement;

  public config: any;

  public sourceItem: SourceItem;

  public targetItem: TargetItem;

  constructor(selector: string, options: Options, message: Message) {
    Lanauage.set(message);

    const mainElement = document.querySelector<HTMLElement>(selector);
    if (mainElement) {
      options.source.paging = Object.assign(defaultPaging, options.source.paging);
      options.target.paging = Object.assign(defaultPaging, options.target.paging);

      this.options = utils.objectMerge({}, defaultOptions, options);

      this.orginStyleClass = mainElement.className;
      mainElement.classList.add("dara-multiselect");

      if (this.options.style.width) {
        mainElement.setAttribute("style", `width:${this.options.style.width};`);
      }
      this.selector = selector;
      this.mainElement = mainElement;

      this.selector = selector;
      this.prefix = "pubMultiselect" + utils.getHashCode(selector);

      this.config = {
        currPage: this.options.target.paging.currPage,
        itemKeyInfo: {},
        focus: false,
        focusType: "",
        addCheckStyle: this.options.enableAddItemCheck === true ? "text-selected" : "",
        allPageItem: {},
        currentPageItem: {},
        dragItems: [],
      };

      this.init();

      allInstance[selector] = this;
    } else {
      throw new Error(`${selector} form selector not found`);
    }
  }

  public init() {
    this._changePageInfo(1, true);
    this.render();
    this.sourceItem = new SourceItem(this);
    this.targetItem = new TargetItem(this);
  }

  public _changePageInfo(pageNo: number, initFlag: boolean): void {
    this.config.currPage = pageNo;
    this.options.target.paging.currPage = pageNo;

    if (initFlag || utils.isUndefined(this.config.allPageItem[pageNo])) {
      this.config.allPageItem[pageNo] = new PageItem(this.options);
    }

    this.config.currentPageItem = this.config.allPageItem[pageNo];
  }

  public static setMessage(message: Message): void {
    Lanauage.set(message);
  }

  public setFocus(type: string) {
    this.config.focus = true;
    this.config.focusType = type;
  }

  public getPrefix() {
    return this.prefix;
  }

  /**
   * 설정 옵션 얻기
   */
  public getOptions = () => {
    return this.options;
  };

  private render() {
    if (this.options.orientation == "vertical") {
      this.mainElement.innerHTML = this.verticalTemplate();
    } else {
      this.mainElement.innerHTML = this.horizontalTemplate();
    }
  }

  private horizontalTemplate(): string {
    const strHtm = [];

    const opts = this.options;

    const width = opts.style.width ?? "100%",
      height = isNaN(opts.style.height) ? this.mainElement.offsetHeight : opts.style.height;
    const enableMoveBtn = opts.body.enableMoveBtn;

    let bodyHeight = height - (opts.footer.enable ? 30 : 0);

    strHtm.push('<div id="' + this.prefix + '" style="width:' + width + ';" class="pub-multiselect">');
    strHtm.push('	<div class="pub-multiselect-body horizontal">');
    strHtm.push("		<table>");
    strHtm.push("		<colgroup>");
    if (opts.mode == "single") {
      strHtm.push('<col style="width:100%">');
    } else {
      let moveBtnSize = opts.body.moveBtnSize;

      strHtm.push('<col style="width:calc(50% - ' + moveBtnSize / 2 + 'px)">');
      strHtm.push('<col style="width:' + moveBtnSize + 'px">');
      strHtm.push('<col style="width:calc(50% - ' + moveBtnSize / 2 + 'px)">');
    }

    strHtm.push("		</colgroup>");
    strHtm.push("			<tbody>");
    strHtm.push("				<tr>");
    if (opts.mode != "single") {
      strHtm.push("					<td>");
      strHtm.push('					 <div data-item-type="source">');
      strHtm.push('					   <div style="height:' + bodyHeight + 'px;">');

      if (opts.source.enableLabel === true) {
        strHtm.push(this.getLabelHtml("source"));
      }

      strHtm.push('						 <div class="pub-multiselect-area ' + (opts.source.enableAddBtn ? " show-row-item-btn " : "") + (opts.source.enableLabel ? "" : "header-hide") + '"><ul class="pub-multiselect-items" data-type="source"></ul></div>');

      strHtm.push("					   </div>");

      if (opts.source.paging.enable) {
        strHtm.push(' <div id="' + this.prefix + 'SourcePaging" class="pub-multiselect-paging"></div>');
      }

      strHtm.push("					 </div>");
      strHtm.push("					</td>");

      strHtm.push('					<td class="pub-multiselect-move-btn">');

      if (enableMoveBtn) {
        strHtm.push('						<button type="button" style="margin-bottom:5px;" class="pub-multiselect-btn" data-mode="add" title="' + Lanauage.getMessage("add") + '"></button><br/>');
        strHtm.push('						<button type="button" class="pub-multiselect-btn" data-mode="del" title="' + Lanauage.getMessage("remove") + '"></button>');
      }

      strHtm.push("					</td>");
    }

    strHtm.push("					<td>");
    strHtm.push('					 <div data-item-type="target">');
    strHtm.push('					  <div style="height:' + bodyHeight + 'px;">');

    if (opts.target.enableLabel === true) {
      strHtm.push(this.getLabelHtml("target"));
    }

    strHtm.push('						<div class="pub-multiselect-area ' + (opts.target.enableRemoveBtn ? " show-row-item-btn " : "") + (opts.target.enableLabel ? "" : "header-hide") + '"><ul class="pub-multiselect-items" data-type="target"></ul></div>');
    strHtm.push("					  </div>");

    if (opts.target.paging.enable) {
      strHtm.push('	<div id="' + this.prefix + 'TargetPaging" class="pub-multiselect-paging"></div>');
    }

    strHtm.push("					 </div>");
    strHtm.push("					</td>");
    strHtm.push("				</tr>");
    strHtm.push("			</tbody>");
    strHtm.push("		</table>");
    strHtm.push("	</div>");

    // footer
    if (this.options.footer.enable === true) {
      strHtm.push('	<div class="pubMultiselect-footer">');
      strHtm.push('		<button type="button" class="pub-multiselect-btn" data-mode="up" style="margin-right:5px;">' + Lanauage.getMessage("up") + "</button>");
      strHtm.push('		<button type="button" class="pub-multiselect-btn" data-mode="down">' + Lanauage.getMessage("down") + "</button>");
      strHtm.push("	</div>");
    }

    strHtm.push("</div>");

    return strHtm.join("");
  }

  private verticalTemplate() {
    const strHtm = [];

    const opts = this.options;

    const width = opts.style.width ?? "100%",
      height = isNaN(opts.style.height) ? this.mainElement.offsetHeight : opts.style.height,
      moveBtnSize = opts.body.moveBtnSize;

    const enableMoveBtn = opts.body.enableMoveBtn;

    let bodyHeight = height - (opts.footer.enable ? 30 : 0);
    bodyHeight = bodyHeight - (enableMoveBtn ? moveBtnSize : 0);

    const labelHalfHeight = opts.source.enableLabel === false ? 36 / 2 : 0;
    strHtm.push('<div id="' + this.prefix + '" style="width:' + width + ';" class="pub-multiselect">');
    strHtm.push('	<div class="pub-multiselect-body vertical">'); // body start

    if (opts.mode != "single") {
      strHtm.push('<div style="height:' + (bodyHeight / 2 - labelHalfHeight) + 'px;" data-item-type="source">');

      if (opts.source.enableLabel) {
        strHtm.push(this.getLabelHtml("source"));
      }

      strHtm.push('	<div class="pub-multiselect-area ' + (opts.source.enableAddBtn ? " show-row-item-btn " : "") + (opts.source.enableLabel ? "" : "header-hide") + '"><ul class="pub-multiselect-items" data-type="source"></ul></div>');
      strHtm.push("</div>");

      if (opts.source.paging.enable) {
        strHtm.push(' <div id="' + this.prefix + 'SourcePaging" class="pub-multiselect-paging"></div>');
      }

      if (enableMoveBtn) {
        strHtm.push('<div class="pub-multiselect-move-btn" style="height:' + moveBtnSize + "px;line-height:" + moveBtnSize + 'px;">');
        strHtm.push('	<button type="button" style="margin-bottom:5px;" class="pub-multiselect-btn" data-mode="add" title="' + Lanauage.getMessage("add") + '">' + Lanauage.getMessage("add") + "</button>");
        strHtm.push('	<button type="button" class="pub-multiselect-btn" data-mode="del" title="' + Lanauage.getMessage("remove") + '">' + Lanauage.getMessage("remove") + "</button>");
        strHtm.push("</div>");
      }
    }

    strHtm.push('<div style="height:' + (bodyHeight / 2 + labelHalfHeight) + 'px;" data-item-type="target">');

    if (opts.target.enableLabel === true) {
      strHtm.push(this.getLabelHtml("target"));
    }

    strHtm.push('  <div class="pub-multiselect-area ' + (opts.target.enableRemoveBtn ? " show-row-item-btn " : "") + (opts.target.enableLabel ? "" : "header-hide") + '"><ul class="pub-multiselect-items" data-type="target"></ul></div>');
    strHtm.push(" </div>");

    // 페이지 정보

    if (opts.target.paging.enable) {
      strHtm.push('	<div id="' + this.prefix + 'TargetPaging" class="pub-multiselect-paging"></div>');
    }

    strHtm.push("</div>"); // body end

    // footer
    if (this.options.footer.enable === true) {
      strHtm.push('	<div class="pubMultiselect-footer">');
      strHtm.push('		<button type="button" class="pub-multiselect-btn" data-mode="up" style="margin-right:5px;">' + Lanauage.getMessage("up") + "</button>");
      strHtm.push('		<button type="button" class="pub-multiselect-btn" data-mode="down">' + Lanauage.getMessage("down") + "</button>");
      strHtm.push("	</div>");
    }

    strHtm.push("</div>");

    return strHtm.join("");
  }

  private getLabelHtml(mode: string) {
    let labelOpt: any = this.options.source;
    if (mode == "target") {
      labelOpt = this.options.target;
    }

    const strHtm = [];
    strHtm.push('<div class="pub-multiselect-label al-' + labelOpt.labelAlign + '">');

    if (labelOpt.search && labelOpt.search.enable === true) {
      if (labelOpt.label) {
        strHtm.push('<span class="label-text">' + labelOpt.label + "</span>");
      }

      strHtm.push('<input type="text" class="input-text">');
      strHtm.push('<span class="search-button"><button type="button">Search</button></span>');
    } else {
      strHtm.push('<span class="label-text" style="width:100%;display:block;">' + labelOpt.label + "</span>");
    }

    strHtm.push("</div>");

    return strHtm.join("");
  }

  public setSourceItem(items: any[]) {
    this.sourceItem.setSourceItem(items);
  }

  public setTargetItem(items: any[]) {
    this.targetItem.setTargetItem(items);
  }

  public destroy = () => {
    this.mainElement.className = this.orginStyleClass;
    this.mainElement.replaceChildren();

    for (const key in this) {
      if (utils.hasOwnProp(this, key)) {
        delete this[key];
        delete allInstance[this.selector];
      }
    }
  };
}
