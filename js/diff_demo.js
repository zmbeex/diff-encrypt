const { endiff, dediff, ignoreFeedLine } = require('./diff');

(() => {
  const oldText = `// 旧的数据有中文;
const getNotword = (src: string, dist: string): string => {
  // 查找notword, 找出都不包含的字符串
  const srcDist = src + dist;
  const notword = config.notwords.find((v: string) => {
    return srcDist.indexOf(v) === -1;
  });
  return notword;
};`;

  const newText = `// delete all chinese;
const getNotword = (src: string, dist: string): string => {
  // notword, 
  const srcDist = src + dist;
  const notword = config.notwords.find((v: string) => {
    return srcDist.indexOf(v) === -1;
  });
  return notword;
};`;

  const diffResult = endiff(oldText, newText);
  const originStr = dediff(oldText, diffResult.result);
  // α10α67α98α151αα// delete all chineseαnotword, α
  console.log(diffResult.result);
  // true 18.95
  console.log(originStr.result === ignoreFeedLine(newText), diffResult.compressibility);
})();