import DaraMultiSelect from "src/DaraMultiSelect";
import Lanauage from "src/util/Lanauage";
import domUtils from "src/util/domUtils";
import itemUtils from "src/util/itemUtils";
import utils from "src/util/utils";
import { STYLE_CLASS } from "src/constants";
import pagingUtil from "src/util/pagingUtil";
import { Paging } from "@t/Paging";

export class SourceItem {
  private multiSelect;
  private sourceContainerElement;
  private sourceElement;
  private sourceOpt;

  private isSingleMode = false;

  constructor(multiSelect: DaraMultiSelect) {
    this.multiSelect = multiSelect;
    this.isSingleMode = multiSelect.options.mode == "single";
    this.sourceContainerElement = this.multiSelect.mainElement.querySelector('[data-item-type="source"]') as Element;
    this.sourceElement = multiSelect.mainElement.querySelector('[data-type="source"]') as Element;
    this.sourceOpt = multiSelect.options.source;
    this.init();
    this.setItems(this.sourceOpt.items);
    this.initEvt();
  }

  init() {
    if (this.isSingleMode) return;
    let labelEle = this.sourceContainerElement.querySelector<HTMLElement>(".pub-multiselect-label");

    if (labelEle) {
      let labelH = labelEle.offsetHeight;
      labelH = labelH > 30 ? labelH + 5 : 0;

      let selectAreaElementStyle = this.sourceContainerElement.querySelector<HTMLElement>(".pub-multiselect-area")?.style;

      if (selectAreaElementStyle) {
        selectAreaElementStyle.height = `calc(100% - ${labelH}px)`;
      }
    }
  }

  public itemClick(evt: Event, sEle: Element) {
    if (this.isSingleMode) return;
    const opts = this.multiSelect.options;

    let evtElement = this.sourceElement;

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
      if (utils.isFunction(this.sourceOpt.click)) {
        this.sourceOpt.click.call(sEle, evt, this.multiSelect.config.currentPageItem.findKey(itemUtils.itemValue(sEle)));
      }
      evtElement?.querySelectorAll(".pub-select-item." + STYLE_CLASS.selected).forEach((element) => {
        element.classList.remove(STYLE_CLASS.selected);
      });

      sEle.classList.add(STYLE_CLASS.selected);
    }
  }

  private initEvt() {
    if (this.isSingleMode) return;
    // source click
    this.sourceElement.addEventListener("mousedown", (e) => {
      this.multiSelect.setFocus("source");
    });

    this.sourceElement.addEventListener("selectstart", (e) => {
      return false;
    });

    if (this.multiSelect.options.useDragMove !== false) {
      //TODO drag 이동 처리할것.
    }
  }

  public initRowItemEvent() {
    if (this.isSingleMode) return;
    this.sourceElement.querySelectorAll(".pub-select-item").forEach((element) => {
      domUtils.eventOn(element, "click", (e: Event, ele: Element) => {
        this.itemClick(e, ele);
      });

      domUtils.eventOn(element, "dblclick", (e: Event, ele: Element) => {
        if (utils.isFunction(this.sourceOpt.dblclick)) {
          if (this.sourceOpt.dblclick.call(null, e, ele) === false) {
            return false;
          }
        }
        this.move();
      });

      // add button click
      domUtils.eventOn(element.querySelector(".pub-multiselect-btn"), "click", (e: Event, ele: Element) => {
        this.move({
          items: [ele.closest(".pub-select-item")],
        });

        return false;
      });
    });
  }

  public setItems(items: any[], pagingInfo?: any) {
    if (this.isSingleMode) return;
    const len = items.length;

    if (len > 0) {
      const strHtm = [];
      const valKey = this.multiSelect.options.valueKey;
      for (let i = 0; i < len; i++) {
        const tmpItem = items[i];
        const itemValue = tmpItem[valKey];

        strHtm.push(this.addItemTemplate(itemValue, tmpItem));
        this.multiSelect.config.itemKeyInfo[itemValue] = tmpItem;
      }

      domUtils.empty(this.sourceElement, strHtm.join(""));

      this.initRowItemEvent();
    } else {
      this.emptyMessage(true);
    }

    this.setPaging(pagingInfo);
  }

  public setPaging(pagingInfo: any) {
    if (this.sourceOpt.paging.enable) {
      pagingUtil.setPaging(this.multiSelect, this.multiSelect.getPrefix() + "SourcePaging", pagingInfo ?? this.sourceOpt.paging);

      this.sourceContainerElement.querySelectorAll(".pub-multiselect-paging .page-num").forEach((element) => {
        domUtils.eventOn(element, "click", (e: Event, ele: Element) => {
          const pageno = ele.getAttribute("pageno");

          if (this.sourceOpt.paging.callback) {
            this.sourceOpt.paging.callback.call(null, { no: pageno, searchword: this.getSearchFieldValue() || "", evt: e });
          }
        });
      });
    }
  }

  /**
   * get item element
   * @param key {String} item key
   * @returns
   */
  public getItemElement(key: string): Element | null {
    return this.sourceElement.querySelector(`[data-val="${key}"]`);
  }

  /**
   * remove add item class
   * @param key item key
   */
  public removeAddItemClass(key: string) {
    if (this.isSingleMode) return;
    this.getItemElement(key)?.classList.remove(STYLE_CLASS.addItemCheck);
  }

  public allRemoveAddItemClass() {
    if (this.isSingleMode) return;
    domUtils.removeClass(this.sourceElement.querySelectorAll(".pub-select-item"), STYLE_CLASS.addItemCheck);
  }

  public setAddItemCheckStyle(key: string) {
    if (this.isSingleMode) return;
    domUtils.addClass(this.getItemElement(key), STYLE_CLASS.addItemCheck);
  }

  public itemSelection(e: Event, opt: any): void {
    if (this.isSingleMode) return;
    const evtElement = this.sourceElement;

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
   * source -> target 이동.
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
    opt = opt ?? {};
    const mainOpts = this.multiSelect.options;
    const limitSize = this.multiSelect.targetItem.getLimitSize();

    const selectVal = opt.items ?? this.sourceElement.querySelectorAll(".pub-select-item.selected:not(.hide)");
    const selectLen = selectVal.length;

    if (selectLen > 0) {
      let tmpVal: any;

      let addItemCount = this.multiSelect.targetItem.getLength();

      const addItems = [];
      let dupChkFlag = true;
      let firstKey = "";

      for (let i = 0; i < selectLen; i++) {
        const item = selectVal[i];

        tmpVal = itemUtils.itemValue(item);

        const selectItem = this.multiSelect.config.itemKeyInfo[tmpVal];

        const addChkFlag = this.multiSelect.config.currentPageItem.contains(tmpVal);

        if (dupChkFlag && !addChkFlag) {
          dupChkFlag = false;
        }

        if (addChkFlag) continue;

        if (utils.isFunction(this.sourceOpt.beforeMove)) {
          if (this.sourceOpt.beforeMove.call(null, selectItem) === false) {
            continue;
          }
        }

        if (limitSize != -1 && addItemCount >= limitSize) {
          alert(Lanauage.getMessage("maxSizeMsg", { maxSize: limitSize }));

          return false;
        }
        addItemCount += 1;

        const _addItem = utils.objectMerge({}, selectItem);
        _addItem["_CU"] = "C";

        firstKey = tmpVal;

        addItems.push(_addItem);
      }

      if (addItems.length < 1) {
        return;
      }

      if (mainOpts.duplicateCheck === true && dupChkFlag) {
        alert(Lanauage.getMessage("duplicate"));

        return false;
      }

      if (utils.isFunction(this.sourceOpt.completeMove)) {
        const itemKeys = addItems.map(function (item) {
          return item[mainOpts.valueKey];
        });
        if (this.sourceOpt.completeMove(itemKeys, addItems) === false) return false;
      }

      this.multiSelect.targetItem.setItems(addItems, undefined, { mode: "add", appendIdx: utils.isUndefined(opt.appendIdx) ? -1 : opt.appendIdx });

      this.multiSelect.targetItem.setItemFocus(firstKey);
    } else if (this.multiSelect.options.enableAddEmptyMessage !== false) {
      alert(Lanauage.getMessage("addEmptyMessage"));
      return;
    }
  }

  private addItemTemplate(seletVal: string, tmpItem: any) {
    const labelKey = this.multiSelect.options.labelKey;
    let titleText = "";
    let labelTemplate = "";
    if (utils.isFunction(this.multiSelect.options.render)) {
      labelTemplate = this.multiSelect.options.render.call(this.sourceOpt, { text: tmpItem[labelKey], item: tmpItem }, "source");
      titleText = domUtils.htmlToText(labelTemplate);
    } else {
      labelTemplate = titleText = tmpItem[labelKey];
    }

    let styleClass = this.multiSelect.config.currentPageItem.contains(seletVal) ? STYLE_CLASS.addItemCheck : "";

    return `
    <li data-val="${seletVal}" class="pub-select-item ${styleClass}" title="${titleText.replace(/["']/g, "")}">
      <span>${labelTemplate}</span>
      ${this.sourceOpt.enableAddBtn ? `<button type="button" class="pub-multiselect-btn" data-mode="item-add">${Lanauage.getMessage("add")}</button>` : ""}
      
    </li>`;
  }

  public emptyMessage(enableFlag: boolean) {
    if (enableFlag) {
      this.sourceElement.innerHTML = `<li class="empty-message">${this.sourceOpt.emptyMessage}</li>`;
    } else {
      this.sourceElement.querySelector(".empty-message")?.replaceChildren();
    }
  }

  public getSearchFieldValue() {
    return (this.sourceContainerElement.querySelector(".input-text") as HTMLInputElement)?.value;
  }

  public search(e: Event) {
    let schText = this.getSearchFieldValue();

    if (this.sourceOpt.search.callback) {
      this.sourceOpt.search.callback.call(null, schText, e);
    } else {
      schText = schText.replace(/^\s+|\s+$/g, "");

      if (schText == "") {
        domUtils.removeClass(this.sourceElement.querySelectorAll("li"), "hide");
        return;
      }

      const schRegExp = new RegExp("(" + schText.replace(/([.?*+^$[\]\\(){}-])/g, "\\$1") + ")", "i");

      this.sourceElement.querySelectorAll("li").forEach((itemEle) => {
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
