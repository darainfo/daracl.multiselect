import { StringKeyMap } from "@t/defaultType";
import utils from "./utils";

const instanceMap = new Map();

export const $dom = (el: Element | string): DaraElement => {
  if (instanceMap.get(el)) {
    return instanceMap.get(el);
  }

  return new DaraElement(el);
};

export class DaraElement {
  private readonly elements: Element[];

  private eventMap: StringKeyMap = {};

  constructor(el: Element | string | NodeList) {
    this.elements = $querySelector(el);
    instanceMap.set(el, this);
  }

  /**
   * before 추가.
   *
   * @public
   * @param {(Element | string)} renderElements
   * @returns {this}
   */
  public before(renderElements: Element | string) {
    insertAdjacentHTML(this.elements, "beforebegin", renderElements);
    return this;
  }

  /**
   * after 추가.
   *
   * @public
   * @param {(Element | string)} renderElements
   * @returns {this}
   */
  public after(renderElements: Element | string) {
    insertAdjacentHTML(this.elements, "afterend", renderElements);
    return this;
  }

  /**
   * element 안에 가장 첫번째 추가.
   *
   * @public
   * @param {(Element | string)} renderElements
   * @returns {this}
   */
  public prepend(renderElements: Element | string) {
    insertAdjacentHTML(this.elements, "afterbegin", renderElements);
    return this;
  }

  /**
   * element 안에 가장 마지막 추가.
   *
   * @public
   * @param {(Element | string)} renderElements
   * @returns {this}
   */
  public append(renderElements: Element | string) {
    insertAdjacentHTML(this.elements, "beforeend", renderElements);
    return this;
  }

  public empty() {
    this.elements.forEach((el) => {
      el.replaceChildren();
    });
    return this;
  }

  // 이벤트 처리 할것.
  public eventOff = (type: string, listener?: any, options?: any) => {
    let fn = listener;
    if (!utils.isFunction(listener)) {
      fn = returnFalse;
    }

    if (this.eventMap[type]) {
      this.elements.forEach((el) => {
        el.removeEventListener(type, this.eventMap[type]);
      });

      return this;
    }
    if (options) {
      this.elements.forEach((el) => {
        el.removeEventListener(type, fn, options);
      });

      return this;
    }

    this.elements.forEach((el) => {
      el.removeEventListener(type, fn);
    });

    return this;
  };

  public eventOn = (type: string, selector?: any, listener?: any) => {
    this.eventMap[type] = listener;
    if (!utils.isString(selector)) {
      this.elements.forEach((el) => {
        el.addEventListener(type, (e) => {
          listener(e, el);
        });
      });

      return this;
    }

    const fn = (e: Event) => {
      const evtTarget = e.target as Element;

      const selectorEle = evtTarget.closest(selector);

      if (selectorEle) {
        listener(e, selectorEle);
      }
    };

    this.eventMap[type] = fn;

    this.elements.forEach((el) => {
      el.addEventListener(type, fn);
    });

    return this;
  };

  /**
   * 상위 element
   *
   * @public
   * @param {string} selector
   * @returns {*}
   */
  public closest(selector: string) {
    return this.elements[0].closest(selector);
  }

  /**
   * class 추가
   *
   * @public
   * @param {...string[]} classes
   * @returns {this}
   */
  public addClass(...classes: string[]) {
    const allClass = classes.join(" ");

    for (let el of this.elements) {
      el.setAttribute("class", el.getAttribute("class") + " " + allClass);
    }

    return this;
  }

  /**
   * class 체크
   *
   * @public
   * @param {string} cls
   * @returns {boolean}
   */
  public hasClass(cls: string): boolean {
    for (let el of this.elements) {
      if (el.classList.contains(cls)) return true;
    }

    return false;
  }
}

function returnFalse() {
  return false;
}

function $querySelector(el: Element | string | NodeList): Element[] {
  if (el instanceof Element) {
    return [el];
  }
  let nodeList;
  if (el instanceof NodeList) {
    nodeList = el;
  } else {
    nodeList = document.querySelectorAll(el);
  }

  const reval: Element[] = [];

  for (let node of nodeList) {
    reval.push(node as Element);
  }

  return reval;
}

function insertAdjacentHTML(elements: Element[], insertPosition: InsertPosition, renderElements: Element | string) {
  if (utils.isString(renderElements)) {
    elements.forEach((el) => {
      el.insertAdjacentHTML(insertPosition, renderElements);
    });
  } else {
    elements.forEach((el) => {
      el.insertAdjacentElement(insertPosition, renderElements);
    });
  }
}
