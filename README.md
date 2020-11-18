# diff-encrypt

[diff-encrypt](https://github.com/zmbeex/diff-encrypt.git) 使用diff算法，对文本等加密和还原，用于文档提交等，目标已存在旧副本的情况。
The diff algorithm is used to encrypt and restore the text, which is used for document submission, etc. the old copy of the target already exists.

#### NPM

``` bash
npm install diff-encrypt --save

yarn add diff-encrypt
```

#### DMEO-js

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
// true
console.log(originStr.result === ignoreFeedLine(newText), diffResult.compressibility);

```

#### DMEO-java

上传到maven出现问题，请执行复制java/*目录下的文件

```java
package com.zmbeex.diffencrypt

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class DiffEncryptApplicationTests {

	@Test
	fun contextLoads() {

		val oldText = """// 旧的数据有中文;
const getNotword = (src: string, dist: string): string => {
  // 查找notword, 找出都不包含的字符串
  const srcDist = src + dist;
  const notword = config.notwords.find((v: string) => {
    return srcDist.indexOf(v) === -1;
  });
  return notword;
};""";

		val newText = """// delete all chinese;
const getNotword = (src: string, dist: string): string => {
  // notword, 
  const srcDist = src + dist;
  const notword = config.notwords.find((v: string) => {
    return srcDist.indexOf(v) === -1;
  });
  return notword;
};""";

		var diff = DiffEncrypt();
		var result: EnResult = diff.endiff(oldText, newText);
		println("===========================")
		println(result.errMsg + ">>>>>>>>>>>>>")
		println(result.result + ">>>>>>>>>>>>>")
		println(result.compressibility + "<<<<<<<<<<<<<<<<<<")

		var deResult = diff.dediff(oldText, result.result)
		println("==============================")
		println(diff.isValid(newText, deResult.result))
		println(deResult.errMsg + ">>>>>>>>>>>>>")
		println(deResult.result + ">>>>>>>>>>>>>")
	}
}
```


#### CONFIG

```ts
// declare const config: {
//     notwords: string[];
//     minBlockLength: number;
//     ignoreLineBreak: boolean;
// };
import { config } from 'diff-encrypt';
// 查找未目标字符，可以设置
config.notwords = 'αβγδεζηθικλμνξοπρστυφχψω∫∮∝∞∧∨∑∏∪∩∈姖姗姘姙姛姝姞姟姠姡'.split('');
// 设置最小块长度
config.minBlockLength = 10;
// 是否忽略换行符,true时，将所有\r\n和\r转换成为\n
config.ignoreLineBreak = true

```

#### TEST

```js
node ./diff_demo.js
```