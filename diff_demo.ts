import { endiff, dediff, ignoreFeedLine } from './diff';

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

  const newText = `// delete all chinese words;
const getNotword = (src: string, dist: string): string => {
  //
  const srcDist = src + dist;
  const notword = config.notwords.find((v: string) => {
    return srcDist.indexOf(v) === -1;
  });
  return notword;
};`;

  const diffResult = endiff(oldText, newText);
  const originStr = dediff(oldText, diffResult.result);
  // α10α65α97α150αα// delete all chinese words;α;
  console.log(diffResult.result);
  // true 17.62
  console.log(originStr.result === ignoreFeedLine(newText), diffResult.compressibility);
})();