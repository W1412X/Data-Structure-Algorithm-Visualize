export function isNumericString(str) {
    if (typeof str !== 'string') return false; // 确保输入是字符串
    return /^[0-9]+$/.test(str); // 使用正则表达式检查
  }