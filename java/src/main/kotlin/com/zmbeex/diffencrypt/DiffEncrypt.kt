package com.zmbeex.diffencrypt


class DiffEncrypt() {
    val config: DiffConfig = DiffConfig();

    // 查找notword, 找出都不包含的字符串
    private fun getNotword(oldText: String, newText: String): String {
        val str: String = oldText + newText
        for(s in config.notwords) {
           if (str.indexOf(s) < 0) {
               return s
           }
        }
        return ""
    }

    // 检查相同字符串的长度
    private fun getEqualPrefix(oldList: Array<String>, newList: Array<String>): Prefix {
        val prefix = Prefix()
        for (j in 0..(newList.size - 1)) {
                // 判断匹配到值
                if (oldList[0] == newList[j]) {
                    val min = oldList.size.coerceAtMost(newList.size - j)
                    for (i in 0 until min) {
                        // 判断匹配中断, 已匹配完成
                        if ((oldList[i] != newList[i + j]) || (i == min - 1)) {
                            // 最小有效块，块太小，分割代价太大
                            if (i >= config.minBlockLength) {
                                prefix.dexIndex = i
                                prefix.j = j
                                return prefix;
                            }
                            break;
                        }
                    }
                }
            }
        return prefix;
    };

    // 忽视换行符
    private fun ignoreFeedLine(text: String): String {
        if (!config.ignoreLineBreak) {
            return text;
        }
        var text0: String = text.replace("\r\n", "\n")
        text0 = text0.replace("\r", "\n")
        return text0
    }

    // 加密
    fun endiff(oldText: String, newText: String): EnResult {
        val result = EnResult();
        try {
            val oldList = ignoreFeedLine(oldText).split("").toTypedArray()
            val newList = ignoreFeedLine(newText).split("").toTypedArray()

            println(oldList.size)
            println(newList.size)

            var notword = getNotword(oldText, newText);
            if (notword.isBlank()) {
                result.errMsg = "没有匹配到notword";
                return result;
            }
            var i: Int = 0;
            do {
                val dex = getEqualPrefix(oldList.sliceArray(IntRange(i, oldList.size - 1)), newList);
                if (dex.dexIndex > 0) {
                    result.indexList.add(i - 1)
                    result.lengthList.add(dex.dexIndex)
                    result.wordList.add(oldText.substring(i -1, i + dex.dexIndex - 1))
                    i--
                    for(j in 0 until dex.dexIndex) {
                        newList[j + dex.j] = notword
                    }
                } else {
                    i++
                }
            } while (i < oldList.size)
            result.result = notword
            for (i in 0 until result.indexList.size) {
                result.result += result.indexList.get(i).toString() + notword + result.lengthList.get(i) + notword
            }
            result.result += notword + newList.joinToString("").replace(Regex("$notword+"), notword)
            result.compressibility =  ((result.result.length / newText.length) * 100).toString();
        } catch (d: Exception) {
            result.errMsg = d.toString()
            d.printStackTrace()
        }
        return result;
    }

    // 解密
    fun dediff(oldText: String, diffText: String): DeResult {
        val result = DeResult();
        try {
            var old = ignoreFeedLine(oldText)
            var diff = ignoreFeedLine(diffText)
            var notword = diff.substring(0, 1)
            var arr1 = diffText.split(notword + notword)
            if (arr1.size != 2) {
                throw Exception("diff数据异常")
            }
            var arr2 = arr1[0].substring(1).split(notword)
            if (arr2.size % 2 != 0) {
                throw Exception("diff数据异常")
            }
            for(i in 0 until arr2.size / 2) {
                result.indexList.add(arr2[i * 2].toInt())
                result.lengthList.add(arr2[i * 2 + 1].toInt())
            }
            var arr3 = arr1[1].split(notword)
            for(i in 0..(arr3.size - 1)) {
                result.result += arr3[i]
                if (result.indexList.size > i) {
                    result.result += old.substring(result.indexList[i], result.indexList[i] + result.lengthList[i])
                }
            }
        } catch (e: Exception) {
            result.errMsg = e.toString()
            e.printStackTrace()
        }
        return result;
    }

    // 判断是否有效
    fun isValid(oldText: String, newText: String): Boolean {
        return ignoreFeedLine(oldText) == ignoreFeedLine(newText)
    }

}
