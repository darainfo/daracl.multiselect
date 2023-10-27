export default {
  getRegExp(schText: string): RegExp {
    return new RegExp("(" + schText.replace(/([.?*+^$[\]\\(){}-])/g, "\\$1") + ")", "i");
  },
};
