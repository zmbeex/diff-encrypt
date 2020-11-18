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
