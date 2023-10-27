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
  private sourceElement;
  private sourceOpt;

  constructor(multiSelect: DaraMultiSelect) {
    this.multiSelect = multiSelect;
    this.sourceElement = multiSelect.mainElement.querySelector('[data-type="source"]') as Element;
    this.sourceOpt = multiSelect.options.source;
    this.init();
    this.setSourceItem(this.sourceOpt.items);
    this.initEvt();
  }

  init() {
    let labelEle = this.sourceElement.querySelector<HTMLElement>(".pub-multiselect-label");
    if (labelEle) {
      let labelH = labelEle.offsetHeight;
      labelH = labelH < 36 ? 36 : 0;

      let selectAreaElementStyle = this.sourceElement.querySelector<HTMLElement>(".pub-multiselect-area")?.style;
      if (selectAreaElementStyle) {
        selectAreaElementStyle.height = `calc(100% - "${labelH}px)`;
      }
    }
  }

  public itemClick(evt: Event, sEle: Element) {
    const _this = this,
      opts = _this.multiSelect.options;

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
    // source click
    this.sourceElement.addEventListener("mousedown", (e) => {
      this.multiSelect.setFocus("source");
    });

    // source item click
    this.sourceElement.querySelectorAll(".pub-select-item").forEach((itemEle) => {
      itemEle.addEventListener("click", (e) => {
        this.itemClick(e, itemEle);
      });
    });

    this.sourceElement.querySelectorAll(".pub-select-item").forEach((itemEle) => {
      itemEle.addEventListener("dblclick", (e) => {
        this.move();
      });
    });

    this.sourceElement.querySelectorAll(".pub-select-item").forEach((itemEle) => {
      itemEle.addEventListener("selectstart", (e) => {
        return false;
      });
    });

    if (this.multiSelect.options.useDragMove !== false) {
      //TODO drag 이동 처리할것.
    }
  }

  public setSourceItem(items: any[], pagingInfo?: any) {
    const len = items.length;

    if (len > 0) {
      const strHtm = [];
      const valKey = this.multiSelect.options.valueKey;
      const pageMaxVal = this.multiSelect.options.target.paging.unitPage;
      for (let i = 0; i < len; i++) {
        const tmpItem = items[i];
        const itemValue = tmpItem[valKey];
        let itemCheckFlag = false;
        for (let j = 1; j <= pageMaxVal; j++) {
          if (this.multiSelect.config.allPageItem[j] && utils.isUndefined(this.multiSelect.config.allPageItem[j][itemValue])) {
            itemCheckFlag = true;
            break;
          }
        }

        strHtm.push(this.addItemTemplate(itemValue, tmpItem, itemCheckFlag));
        this.multiSelect.config.itemKeyInfo[itemValue] = tmpItem;
      }

      this.sourceElement.innerHTML = strHtm.join("");
    } else {
      this.emptyMessage(true);
    }

    if (this.sourceOpt.paging.enable) {
      pagingUtil.setPaging(this.multiSelect, this.multiSelect.getPrefix() + "SourcePaging", pagingInfo ?? this.sourceOpt.paging);
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
    this.getItemElement(key)?.classList.remove(STYLE_CLASS.addItem);
  }

  public allRemoveAddItemClass() {
    domUtils.removeClass(this.sourceElement.querySelectorAll(".pub-select-item"), STYLE_CLASS.addItem);
  }

  public setAddItemClass(key: string) {
    domUtils.addClass(this.getItemElement(key), STYLE_CLASS.addItem);
  }

  public itemSelection(e: Event, opt: any): void {
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
	  returnFlag : true or false; default false
	  appendIdx : append index
	  type : item or element; default element
	  }
   * @returns 
   */
  public move(opt?: any) {
    const _this = this;
    opt = opt ?? {};
    const mainOpts = this.multiSelect.options;
    const limitSize = this.multiSelect.targetItem.getLimitSize();

    const selectVal = opt.items ?? this.sourceElement.querySelectorAll(".pub-select-item.selected:not(.hide)");
    const selectLen = selectVal.length;

    if (selectLen > 0) {
      const returnFlag = opt.returnFlag;
      const appendIdx = utils.isUndefined(opt.appendIdx) ? -1 : opt.appendIdx;

      let tmpVal: any;
      const strHtm = [];

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

          if (returnFlag === true) {
            return false;
          }

          return false;
        }
        addItemCount += 1;

        const _addItem = Object.assign({}, selectItem);
        _addItem["_CU"] = "C";

        firstKey = tmpVal;

        addItems.push(_addItem);

        strHtm.push(this.addItemTemplate(tmpVal, selectItem));
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

      this.multiSelect.targetItem.emptyMessage(false);

      for (let j = 0; j < addItems.length; j++) {
        let item = addItems[j];
        this.getItemElement(addItems[j][mainOpts.valueKey])?.classList.add(STYLE_CLASS.addItem);

        if (appendIdx != -1) {
          this.multiSelect.config.currentPageItem.add(item, appendIdx + j);
        } else {
          this.multiSelect.config.currentPageItem.add(item);
        }
      }

      if (returnFlag === true) {
        return strHtm.join("");
      } else {
        if (this.multiSelect.options.addPosition == "top") {
          domUtils.prepend(this.sourceElement, strHtm.join(""));
        } else {
          domUtils.append(this.sourceElement, strHtm.join(""));
        }

        this.multiSelect.targetItem.setItemFocus(firstKey);
      }
    } else {
      if (this.multiSelect.options.enableAddEmptyMessage !== false) {
        alert(Lanauage.getMessage("addEmptyMessage"));
        return;
      }
    }
  }

  private addItemTemplate(seletVal: string, tmpItem: any, selectFlag?: boolean) {
    const labelKey = this.multiSelect.options.labelKey;
    let titleText = "";
    let renderTemplate = "";
    if (utils.isFunction(this.multiSelect.options.render)) {
      renderTemplate = this.multiSelect.options.render.call(this.sourceOpt, { text: tmpItem[labelKey], item: tmpItem }, "source");
      titleText = domUtils.htmlToText(renderTemplate);
    } else {
      renderTemplate = titleText = tmpItem[labelKey];
    }
    renderTemplate = "<span>" + renderTemplate + "</span>";

    let styleClass = "";

    if (selectFlag === true || this.multiSelect.config.currentPageItem.contains(seletVal)) {
      styleClass += STYLE_CLASS.selected;
    }

    if (this.sourceOpt.enableAddBtn) {
      renderTemplate += '<button type="button" class="pub-multiselect-btn" data-mode="item-add">' + Lanauage.getMessage("add") + "</button>";
    }

    return `<li data-val="${seletVal}" class="pub-select-item ${styleClass}" title="${titleText.replace(/["']/g, "")}">${renderTemplate}</li>`;
  }

  public emptyMessage(enableFlag: boolean) {
    if (enableFlag) {
      this.sourceElement.innerHTML = `<li class="empty-message">${this.sourceOpt.emptyMessage}</li>`;
    } else {
      this.sourceElement.querySelector(".empty-message")?.replaceChildren();
    }
  }

  public search(e: Event) {
    let schText = (this.sourceElement.querySelector(".input-text") as HTMLInputElement).value;

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
