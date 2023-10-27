import { Options } from "@t/Options";
import utils from "src/util/utils";

export class PageItem {
  private list: any = [];
  private valueKey;
  constructor(options: Options) {
    this.list = [];
    this.valueKey = options.valueKey;
  }

  public add(item: any, position: number) {
    if (!utils.isUndefined(position)) {
      this.list.splice(position, 0, item);
      return;
    }
    this.list.push(item);
  }

  public move(targetIdx: number, modeItemIdx: number) {
    if (targetIdx > -1) {
      const currentItem = this.list.splice(modeItemIdx, 1)[0];
      this.list.splice(targetIdx, 0, currentItem);
    }
  }

  public contains(key: any) {
    const idx = this.findIndex(key);
    if (idx > -1) return true;
    else return false;
  }

  public remove(key: any) {
    const idx = this.findIndex(key);
    if (idx > -1) {
      return this.list.splice(idx, 1);
    } else {
      return;
    }
  }

  public findKey(key: any) {
    console.log("findKey", key);
    return this.list[this.findIndex(key)];
  }

  public get(idx: number) {
    return this.list[idx];
  }

  public allItem() {
    return this.list;
  }

  public size() {
    return this.list.length;
  }

  public findIndex(chkValue: any) {
    const valueKey = this.valueKey;

    return this.list.findIndex((item: any) => {
      return item[valueKey] === chkValue;
    });
  }
}
