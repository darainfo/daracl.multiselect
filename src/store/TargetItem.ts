import { Options } from "@t/Options";
import DaraMultiSelect from "src/DaraMultiSelect";
import { STYLE_CLASS } from "src/constants";
import Lanauage from "src/util/Lanauage";
import domUtils from "src/util/domUtils";
import utils from "src/util/utils";
import { Paging } from "@t/Paging";
import { PageItem } from "./PageItem";
import pagingUtil from "src/util/pagingUtil";
import itemUtils from "src/util/itemUtils";
import searchUtil from "src/util/searchUtil";
import { DaraElement } from "src/util/domCtrl";

export class TargetItem {
  private multiSelect;
  private targetContainerElement;
  private targetElement;

  private targetOpt;
  constructor(multiSelect: DaraMultiSelect) {
    this.multiSelect = multiSelect;
    this.targetContainerElement = multiSelect.mainElement.querySelector('[data-item-type="target"]') as Element;
    this.targetElement = multiSelect.mainElement.querySelector('[data-type="target"]') as Element;
    this.targetOpt = multiSelect.options.target;
    this.init();
    this.setItems(this.targetOpt.items, undefined, { mode: "init" });
    this.initEvt();
  }

  init() {
    let labelEle = this.targetContainerElement.querySelector<HTMLElement>(".pub-multiselect-label");

    if (labelEle) {
      let labelH = labelEle.offsetHeight;
      labelH = labelH > 30 ? labelH + 5 : 0;

      let selectAreaElementStyle = this.targetContainerElement.querySelector<HTMLElement>(".pub-multiselect-area")?.style;
      if (selectAreaElementStyle) {
        selectAreaElementStyle.height = `calc(100% - ${labelH}px)`;
      }
    }
  }

  private initEvt() {
    domUtils.eventOn(this.targetElement, "mousedown", (e: Event) => {
      this.multiSelect.setFocus("target");
    });
  }

  private initRowItemEvent() {
    // item click
    this.targetElement.querySelectorAll("[data-new-item]").forEach((element) => {
      element.removeAttribute("data-new-item");
      domUtils.eventOn(element, "click", (e: Event, ele: Element) => {
        this.itemClick(e, ele);
      });

      domUtils.eventOn(element, "dblclick", (e: Event, ele: Element) => {
        if (utils.isFunction(this.targetOpt.dblclick)) {
          if (this.targetOpt.dblclick.call(ele, e, this.multiSelect.config.currentPageItem.getItem(itemUtils.itemValue(ele))) === false) {
            return false;
          }
        }
        this.move();
      });

      // remove button click
      domUtils.eventOn(element.querySelector(".pub-multiselect-btn"), "click", (e: Event, ele: Element) => {
        this.move({
          items: [ele.closest(".pub-select-item")],
        });

        return false;
      });
    });

    /*
    // item double click
    domUtils.eventOn(this.targetElement, "dblclick", ".pub-select-item", (e: Event, ele: Element) => {
      if (utils.isFunction(this.targetOpt.dblclick)) {
        if (this.targetOpt.dblclick.call(ele, e, this.multiSelect.config.currentPageItem.getItem(itemUtils.itemValue(ele))) === false) {
          return false;
        }
      }
      this.move();
    });
    */
  }

  public itemClick(evt: Event, sEle: Element) {
    const opts = this.multiSelect.options;

    let evtElement = this.targetElement;

    const sEleClassList = sEle.classList;
    const lastClickEle = evtElement?.querySelector('.pub-select-item[data-last-click="Y"]');
    let onlyClickFlag = false;
    if (opts.useMultiSelect === true) {
      if ((evt as KeyboardEvent).shiftKey) {
        const allItem = evtElement?.querySelectorAll(".pub-select-item");

        if (allItem) {
          const beforeIdx = lastClickEle ? Array.from(allItem).indexOf(lastClickEle) : -1;
          const currIdx = Array.from(allItem).indexOf(sEle);

          const source = Math.min(beforeIdx, currIdx),
            last = Math.max(beforeIdx, currIdx);

          this.itemSelection(evt, { mode: "selection", start: source, end: last });
        }
      } else {
        sEle.setAttribute("data-last-click", "Y");
        lastClickEle?.removeAttribute("data-last-click");
        if ((evt as KeyboardEvent).ctrlKey) {
          if (sEleClassList.contains(STYLE_CLASS.selected)) {
            sEleClassList.remove(STYLE_CLASS.selected);
          } else {
            sEleClassList.add(STYLE_CLASS.selected);
          }
        } else {
          onlyClickFlag = true;
        }
      }
    } else {
      sEle.setAttribute("data-last-click", "Y");
      onlyClickFlag = true;
    }

    if (onlyClickFlag) {
      if (utils.isFunction(this.targetOpt.click)) {
        this.targetOpt.click.call(sEle, evt, this.multiSelect.config.currentPageItem.findKey(itemUtils.itemValue(sEle)));
      }
      evtElement?.querySelectorAll(".pub-select-item." + STYLE_CLASS.selected).forEach((element) => {
        element.classList.remove(STYLE_CLASS.selected);
      });

      sEle.classList.add(STYLE_CLASS.selected);
    }
  }

  public setItemFocus(key: string | null) {
    if (key == null) return;
    const itemEle = this.getItemElement(key);

    itemEle?.setAttribute("tabindex", "-1");
    (itemEle as HTMLElement)?.focus();
    itemEle?.removeAttribute("tabindex");
  }

  /**
   * item 사이즈
   * @returns
   */
  public getLength(): number {
    return 1;
  }

  public getLimitSize(): number {
    return this.targetOpt.limitSize;
  }

  public emptyMessage(enableFlag: boolean) {
    if (enableFlag) {
      this.targetElement.innerHTML = `<li class="empty-message">${this.targetOpt.emptyMessage}</li>`;
    } else {
      const emptyMessageElement = this.targetElement.querySelector(".empty-message");
      if (emptyMessageElement) {
        emptyMessageElement.remove();
      }
    }
  }

  public itemSelection(e: Event, opt: any): void {
    const evtElement = this.targetElement;

    const mode = opt.mode;
    const start = opt.start,
      end = opt.end;

    if (mode == "all") {
      domUtils.addClass(evtElement.querySelectorAll(".pub-select-item"), STYLE_CLASS.selected);
    } else if (mode == "selection") {
      domUtils.removeClass(evtElement.querySelectorAll(".pub-select-item." + STYLE_CLASS.selected), STYLE_CLASS.selected);

      const allItem = evtElement.querySelectorAll(".pub-select-item");
      for (let i = end; i >= start; i--) {
        domUtils.addClass(allItem[i], STYLE_CLASS.selected);
      }
    }
  }

  /**
   * get item element
   * @param key {String} item key
   * @returns
   */
  public getItemElement(key: string): Element | null {
    return this.targetElement.querySelector(`[data-val="${key}"]`);
  }

  public getSelectionElements() {
    return this.targetElement.querySelectorAll(".pub-select-item.selected:not(.hide)");
  }

  /**
   * target 에서 item제거
   * 
   * @param opt {Object} 
   ```
    {
	  items : [] 
	  appendIdx : append index
	  type : item or element; default element
	  }
   * @returns 
   */
  public move(opt?: any) {
    opt = opt || {};

    const selectVal = opt.items || this.getSelectionElements();

    if (selectVal.length > 0) {
      let removeItem;
      const removeItems = [];

      for (let item of selectVal) {
        const tmpKey = item.getAttribute("data-val");

        removeItem = this.multiSelect.config.currentPageItem.findKey(tmpKey);

        if (utils.isFunction(this.targetOpt.beforeMove)) {
          if (this.targetOpt.beforeMove(removeItem) === false) {
            continue;
          }
        }
        removeItems.push(removeItem);
      }

      let valueKey = this.multiSelect.options.valueKey;
      let returnRemoveFlag = true;
      if (utils.isFunction(this.targetOpt.completeMove)) {
        const itemKeys = removeItems.map((item) => {
          return item[valueKey];
        });

        returnRemoveFlag = this.targetOpt.completeMove(itemKeys, removeItems);
      }

      if (returnRemoveFlag !== false) {
        for (let removeItem of removeItems) {
          const key = removeItem[valueKey];

          this.getItemElement(key)?.remove();
          this.multiSelect.sourceItem.removeAddItemClass(key);

          this.multiSelect.config.currentPageItem.remove(key);
        }

        if (this.multiSelect.config.currentPageItem.size() < 1) {
          this.emptyMessage(false);
        }
      }
    } else {
      if (this.multiSelect.options.enableRemoveEmptyMessage) {
        alert(Lanauage.getMessage("removeEmptyMessage"));
      }
      return;
    }
  }

  public setItems(items: any[], pagingInfo?: any, pOpts?: any): void {
    const _opts = this.multiSelect.options;
    pOpts = pOpts ?? {};
    const mode = pOpts.mode;

    const targetOpt = _opts.target;

    const currPageNo = pagingInfo?.currPage ?? this.multiSelect.config.currPage;
    const len = items.length;

    if (mode === "init") {
      this.multiSelect.config.allPageItem = {};
      this.multiSelect.sourceItem.allRemoveAddItemClass();
      this.multiSelect._changePageInfo(currPageNo, true);
    }

    if (len > 0) {
      let tmpItem;

      const valKey = _opts.valueKey;
      const pageNumKey = _opts.pageNumKey;
      const maxPageNo = targetOpt.paging.unitPage;

      const duplicateCheck = {} as any;
      const strHtm = [];
      for (let i = 0; i < len; i++) {
        tmpItem = items[i];

        const itemValue = tmpItem[valKey];
        const pageNo = tmpItem[pageNumKey] || currPageNo;

        if (pageNo > maxPageNo) {
          continue;
        }

        let pageItem = this.multiSelect.config.allPageItem[pageNo];

        if (utils.isUndefined(pageItem)) {
          this.multiSelect.config.allPageItem[pageNo] = new PageItem(_opts);
          pageItem = this.multiSelect.config.allPageItem[pageNo];
        }

        if (duplicateCheck[itemValue] === true) {
          continue;
        }

        duplicateCheck[itemValue] = true;

        tmpItem["_CU"] = "U";

        pageItem.add(tmpItem);

        if (currPageNo == pageNo) {
          strHtm.push(this.addItemTemplate(itemValue, tmpItem));
        }

        if (!utils.isUndefined(this.multiSelect.config.itemKeyInfo[itemValue])) {
          this.multiSelect.sourceItem.setAddItemCheckStyle(itemValue);
        }
      }

      if (strHtm.length > 0) {
        if (mode == "add") {
          if (this.multiSelect.options.addPosition == "top") {
            domUtils.prepend(this.targetElement, strHtm.join(""));
          } else {
            domUtils.append(this.targetElement, strHtm.join(""));
          }
        } else {
          domUtils.empty(this.targetElement, strHtm.join(""));
        }

        this.initRowItemEvent();
      } else {
        this.emptyMessage(true);
      }
    } else {
      this.emptyMessage(true);
    }

    this.setPaging(pagingInfo);
  }

  public setPaging(pagingInfo: any) {
    if (this.targetOpt.paging.enable) {
      pagingUtil.setPaging(this.multiSelect, this.multiSelect.getPrefix() + "TargetPaging", pagingInfo ?? this.targetOpt.paging);

      this.targetContainerElement.querySelectorAll(".pub-multiselect-paging .page-num").forEach((element) => {
        domUtils.eventOn(element, "click", (e: Event, ele: Element) => {
          const pageno = ele.getAttribute("pageno");

          if (this.targetOpt.paging.callback) {
            this.targetOpt.paging.callback.call(null, { no: pageno, searchword: this.getSearchFieldValue() || "", evt: e });
          }
        });
      });
    }
  }

  public addItemTemplate(seletVal: string, tmpItem: any) {
    const labelKey = this.multiSelect.options.labelKey;

    let titleText = "";
    let labelTemplate = "";
    if (utils.isFunction(this.multiSelect.options.render)) {
      labelTemplate = this.multiSelect.options.render.call(this.targetOpt, { text: tmpItem[labelKey], item: tmpItem }, "source");
      titleText = domUtils.htmlToText(labelTemplate);
    } else {
      titleText = tmpItem[labelKey];
      labelTemplate = titleText;
    }

    return `
    <li data-new-item data-pageno="${tmpItem[this.multiSelect.options.pageNumKey] || this.multiSelect.config.currPage}" data-val="${seletVal}" class="pub-select-item" title="${titleText.replace(/["']/g, "")}">
      ${this.targetOpt.enableRemoveBtn ? `<button type="button" class="pub-multiselect-btn" data-mode="item-remove">${Lanauage.getMessage("remove")}</button>` : ""}
      <span>${labelTemplate}</span>
    </li>`;
  }

  public getSearchFieldValue() {
    return (this.targetContainerElement.querySelector(".input-text") as HTMLInputElement)?.value;
  }

  public search(e: Event) {
    let schText = this.getSearchFieldValue();

    if (this.targetOpt.search.callback) {
      this.targetOpt.search.callback.call(null, schText, e);
    } else {
      schText = schText.replace(/^\s+|\s+$/g, "");

      if (schText == "") {
        domUtils.removeClass(this.targetElement.querySelectorAll("li"), "hide");
        return;
      }

      const schRegExp = searchUtil.getRegExp(schText);

      this.targetElement.querySelectorAll("li").forEach((itemEle) => {
        const itemTitle = itemEle.getAttribute("title") || "";
        if (schRegExp.test(itemTitle)) {
          domUtils.removeClass(itemEle, "hide");
        } else {
          domUtils.addClass(itemEle, "hide");
        }
      });
    }
  }

  /**
   * 위로 이동
   *
   */
  public up() {
    const selectElements = this.getSelectionElements();
    const selectLen = selectElements.length;

    if (selectLen < 1) return;

    const currPageItem = this.multiSelect.config.currentPageItem;

    for (let i = 0; i < selectLen; i++) {
      const currElement = selectElements[i];

      const prevElement = currElement.previousElementSibling;

      if (prevElement && !domUtils.hasClass(prevElement, STYLE_CLASS.selected)) {
        domUtils.before(prevElement, currElement);

        const dataVal = itemUtils.itemValue(currElement);

        const currPosition = currPageItem.findIndex(dataVal);

        if (currPosition > -1) {
          currPageItem.move(currPosition - 1, currPosition);
        }
      }
    }

    this.setItemFocus(itemUtils.itemValue(selectElements[0]));
  }

  /**
   * 아래로 이동
   */
  public down() {
    const selectElements = this.getSelectionElements();
    const selectLen = selectElements.length;

    if (selectLen < 1) return;

    const currPageItem = this.multiSelect.config.currentPageItem;

    for (let i = selectLen - 1; i >= 0; i--) {
      const currElement = selectElements[i];
      const nexElement = currElement.nextElementSibling;

      if (nexElement && !domUtils.hasClass(nexElement, STYLE_CLASS.selected)) {
        domUtils.after(nexElement, currElement);

        const dataVal = itemUtils.itemValue(currElement);

        const currPosition = currPageItem.findIndex(dataVal);

        if (currPosition > -1) {
          currPageItem.move(currPosition + 1, currPosition);
        }
      }
    }
  }
}
