import utils from "./utils";

export default {
  /**
   * @method getItemVal
   * @param itemEle {Element} value를 구할 element
   * @description value 구하기.
   */
  before(el: Element | string | NodeList, renderElements: Element | string) {
    insertAdjacentHTML($querySelector(el), "beforebegin", renderElements);
  },
  after(el: Element | string | NodeList, renderElements: Element | string) {
    insertAdjacentHTML($querySelector(el), "afterend", renderElements);
  },
  prepend(el: Element | string | NodeList, renderElements: Element | string) {
    insertAdjacentHTML($querySelector(el), "afterbegin", renderElements);
  },
  append(el: Element | string | NodeList, renderElements: Element | string) {
    insertAdjacentHTML($querySelector(el), "beforeend", renderElements);
  },
  empty(el: Element | string | NodeList | null, html?: string) {
    if (el == null) return el;

    $querySelector(el).forEach((el1) => {
      el1.replaceChildren();

      if (html) {
        el1.innerHTML = html;
      }
    });
  },
  hasClass(el: Element | string | NodeList, styleClassName: string) {
    for (let el1 of $querySelector(el)) {
      if (el1.classList.contains(styleClassName)) {
        return true;
      }
    }

    return false;
  },

  addClass(el: Element | string | NodeList | null, styleClassName: string) {
    if (el == null) return el;

    $querySelector(el).forEach((el1) => {
      let classList = el1.classList;

      if (!classList.contains(styleClassName)) {
        classList.add(styleClassName);
      }
    });
  },
  removeClass(el: Element | string | NodeList, styleClassName: string) {
    $querySelector(el).forEach((el1) => {
      el1.classList.remove(styleClassName);
    });
  },
  htmlToText(htmlText: string): string {
    let divEle = document.createElement("div");
    divEle.innerHTML = htmlText;
    return divEle.innerText;
  },

  eventOn(el: Element | string | NodeList | null, type: string, selector?: any, listener?: any) {
    if (el == null) return el;

    const elements = $querySelector(el);

    if (!utils.isString(selector)) {
      listener = selector;
      elements.forEach((el) => {
        el.addEventListener(type, (e) => {
          if (listener(e, el) === false) {
            e.stopImmediatePropagation();
            e.preventDefault();
          }
        });
      });

      return this;
    }

    const fn = (e: Event) => {
      const evtTarget = e.target as Element;

      const selectorEle = evtTarget.closest(selector);

      if (selectorEle) {
        if (listener(e, selectorEle) === false) {
          e.stopImmediatePropagation();
          e.preventDefault();
        }
      }
    };

    elements.forEach((el) => {
      el.addEventListener(type, fn);
    });
  },
};

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
