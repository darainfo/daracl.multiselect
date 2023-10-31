import { Message } from "@t/Message";
import utils from "./utils";

let localeMessage: Message = {
  up: "Up",
  down: "Down",
  add: "Add",
  allAdd: "All add",
  remove: "Remove",
  allRemove: "All Remove",
  maxSizeMsg: "{maxSize} 개 까지 등록 가능합니다.", // 추가 가능한 max size가 넘었을경우 메시지 String
  duplicate: "이미 등록된 아이템이 존재합니다.",
  addEmptyMessage: "추가할 항목을 선택해주세요.",
  removeEmptyMessage: "제거할 항목을 선택해주세요.",
};

/**
 * 메시지 처리.
 *
 * @class Language
 * @typedef {Language}
 */
class Language {
  private lang: Message = localeMessage;

  /**
   * 다국어 메시지 등록
   *
   * @public
   * @param {?Message} [lang] 둥록할 메시지
   */
  public set(lang?: Message) {
    this.lang = utils.objectMerge(this.lang, lang);
  }

  /**
   * 메시지 얻기
   *
   * @public
   * @param {string} messageKey 메시지 키
   * @returns {*}
   */
  public getMessage(messageKey: string, param?: any): any {
    if (utils.isUndefined(param)) {
      return (this.lang as any)[messageKey];
    }
    return message((this.lang as any)[messageKey], param);
  }
}

function message(msgFormat: string, msgParam: any): string {
  return msgFormat.replace(/\{{1,1}([A-Za-z0-9_.]*)\}{1,1}/g, (match, key) => {
    return typeof msgParam[key] !== "undefined" ? msgParam[key] : match;
  });
}

export default new Language();
