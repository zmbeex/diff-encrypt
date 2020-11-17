# diff-encrypt

[diff-encrypt](https://github.com/zmbeex/diff-encrypt.git) 使用diff算法，对文本等加密和还原，用于文档提交等，目标已存在旧副本的情况。
The diff algorithm is used to encrypt and restore the text, which is used for document submission, etc. the old copy of the target already exists.

#### NPM

``` bash
npm install diff-encrypt --save

yarn add diff-encrypt
```

#### DMEO

``` ts
import {
  // 加密
  endiff,
  // 解密 
  dediff,
  // 所有换行符修改为\n 
  ignoreFeedLine
} from 'diff-encrypt';

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

```

#### TEST

```js
node ./diff_demo.js
```