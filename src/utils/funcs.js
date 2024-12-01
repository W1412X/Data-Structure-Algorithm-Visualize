export function isNumericString(str) {
    if (typeof str !== 'string') return false; // 确保输入是字符串
    return /^-?[0-9]+$/.test(str); // 支持负号的正则表达式;
  }
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function convertNode(node) {
  return {
      size: 16,
      style: {
          stroke:node.vis?"#eff4ff":"#00000000",
          fill:node.vis?"#5f95ff":"#00000000"
      },
      state: {
          focus: {
              lineWidth: "2",
              stroke: "orange"
          }
      },
      label: node.vis?node.val:" ",
      labelCfg: {
          position: "left",
          fontSize: 1
      },
  }
}