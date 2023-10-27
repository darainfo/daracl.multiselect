export default {
  /**
   * @method getItemVal
   * @param itemEle {Element} value를 구할 element
   * @description value 구하기.
   */
  itemValue(itemEle: Element): string | null {
    return itemEle.getAttribute("data-val");
  },
};
