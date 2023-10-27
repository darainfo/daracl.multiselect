const xssFilter = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
} as any;

export default {
  replace(inputText: string): string {
    let returnText = inputText;
    if (returnText) {
      Object.keys(xssFilter).forEach((key) => {
        returnText = returnText.replaceAll(key, xssFilter[key]);
      });
    }
    return returnText;
  },

  hasOwnProp<T extends object, K extends keyof T>(obj: T, key: string | K): key is K {
    return obj.hasOwnProperty(key);
  },

  unReplace(inputText: string): string {
    let returnText = inputText;

    if (returnText) {
      Object.keys(xssFilter).forEach((key) => {
        returnText = returnText.replaceAll(xssFilter[key], key);
      });
    }
    return returnText;
  },

  unFieldName(fieldName: string): string {
    if (fieldName) {
      return this.unReplace(fieldName).replaceAll('"', '\\"');
    }
    return "";
  },

  isBlank(value: any): boolean {
    if (value === null) return true;
    if (value === "") return true;
    if (typeof value === "undefined") return true;
    if (typeof value === "string" && (value === "" || value.replace(/\s/g, "") === "")) return true;

    return false;
  },

  isUndefined(value: any): value is undefined {
    return typeof value === "undefined";
  },

  isFunction(value: any): value is Function {
    return typeof value === "function";
  },

  isString(value: any): value is string {
    return typeof value === "string";
  },
  isNumber(value: any): value is number {
    if (this.isBlank(value)) {
      return false;
    }
    value = +value;
    return !isNaN(value);
  },

  isArray(value: any): value is Array<any> {
    return Array.isArray(value);
  },

  replaceXss(text: string): string {
    return this.replace(text);
  },

  getHashCode(str: string) {
    let hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
      let tmpChar = str.charCodeAt(i);
      hash = (hash << 5) - hash + tmpChar;
      hash = hash & hash;
    }
    return String(hash).replaceAll(/-/g, "_");
  },
  objectMerge(...value: any[]): any {
    let dst: any = {},
      src,
      p;

    let args = value;

    while (args.length > 0) {
      src = args.splice(0, 1)[0];
      if (Object.prototype.toString.call(src) == "[object Object]") {
        for (p in src) {
          if (src.hasOwnProperty(p)) {
            if (Object.prototype.toString.call(src[p]) == "[object Object]") {
              dst[p] = this.objectMerge(dst[p] || {}, src[p]);
            } else {
              dst[p] = src[p];
            }
          }
        }
      }
    }

    return dst;
  },
};
