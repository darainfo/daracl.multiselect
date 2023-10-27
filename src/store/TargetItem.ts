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
  private targetElement;
  private targetOpt;
  constructor(multiSelect: DaraMultiSelect) {
    this.multiSelect = multiSelect;
    this.targetElement = multiSelect.mainElement.querySelector('[data-type="target"]') as Element;
    this.targetOpt = multiSelect.options.target;
    this.init();
    this.setTargetItem(this.targetOpt.items);
    this.initEvt();
  }

  init() {
    let labelEle = this.targetElement.querySelector<HTMLElement>(".pub-multiselect-label");
    if (labelEle) {
      let labelH = labelEle.offsetHeight;
      labelH = labelH < 36 ? 36 : 0;

      let selectAreaElementStyle = this.targetElement.querySelector<HTMLElement>(".pub-multiselect-area")?.style;
      if (selectAreaElementStyle) {
        selectAreaElementStyle.height = `calc(100% - "${labelH}px)`;
      }
    }
  }

  private initEvt() {
    domUtils.eventOn(this.targetElement, "mousedown", (e: Event) => {
      this.multiSelect.setFocus("source");
    });
  }

  private initRowItemEvent() {
    // item click
    this.targetElement.querySelectorAll("[data-new-item]").forEach((element) => {
      domUtils.eventOn(element, "click", (e: Event, ele: Element) => {
        console.log("111");
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
        console.log("122");

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
    const _this = this,
      opts = _this.multiSelect.options;

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

  public setItemFocus(key: string) {
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
      this.targetElement.querySelector(".empty-message")?.replaceChildren();
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

  /**
   * target 에서 item제거
   * 
   * @param opt {Object} 
   ```
    {
	  items : [] 
	  returnFlag : true or false; default false
	  appendIdx : append index
	  type : item or element; default element
	  }
   * @returns 
   */
  public move(opt?: any) {
    opt = opt || {};

    const selectVal = opt.items || this.targetElement.querySelectorAll(".pub-select-item.selected:not(.hide)");

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

  public setTargetItem(items: any[], pagingInfo?: any, pOpts?: any): void {
    const _opts = this.multiSelect.options;
    pOpts = pOpts ?? {};

    console.log(items);

    const mode = pOpts.mode;

    const targetOpt = _opts.target;

    const currPageNo = pagingInfo?.currPage ?? this.multiSelect.config.currPage;
    const len = items.length;

    if (mode === "init") {
      this.multiSelect.config.allPageItem = {};
    }

    this.multiSelect._changePageInfo(currPageNo, true);
    this.multiSelect.sourceItem.allRemoveAddItemClass();

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

        if (utils.isUndefined(this.multiSelect.config.itemKeyInfo[itemValue])) {
          this.multiSelect.sourceItem.setAddItemClass(itemValue);
        }
      }

      if (strHtm.length > 0) {
        domUtils.empty(this.targetElement, strHtm.join(""));
        this.initRowItemEvent();
      } else {
        this.emptyMessage(true);
      }
    } else {
      this.emptyMessage(true);
    }

    if (this.targetOpt.paging.enable) {
      pagingUtil.setPaging(this.multiSelect, this.multiSelect.getPrefix() + "TargetPaging", pagingInfo ?? this.targetOpt.paging);
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
      ${this.targetOpt.enableRemoveBtn ? `<button type="button" class="pub-multiselect-btn" data-mode="item-del">${Lanauage.getMessage("remove")}</button>` : ""}
      <span>${labelTemplate}</span>
    </li>`;
  }

  public search(e: Event) {
    let schText = (this.targetElement.querySelector(".input-text") as HTMLInputElement).value;

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
}
