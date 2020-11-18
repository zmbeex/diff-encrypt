"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dediff = exports.endiff = exports.config = exports.ignoreFeedLine = void 0;
var config = {
    notwords: 'αβγδεζηθικλμνξοπρστυφχψω∫∮∝∞∧∨∑∏∪∩∈姖姗姘姙姛姝姞姟姠姡'.split(''),
    minBlockLength: 10,
    ignoreLineBreak: true
};
exports.config = config;
var getNotword = function (src, dist) {
    // 查找notword, 找出都不包含的字符串
    var srcDist = src + dist;
    var notword = config.notwords.find(function (v) {
        return srcDist.indexOf(v) === -1;
    });
    return notword;
};
// 检查相同字符串的长度
var getEqualPrefix = function (oldList, newList, notword) {
    var min = Math.min(oldList.length, newList.length);
    for (var j = 0; j < newList.length; j++) {
        // 判断匹配到值
        if (oldList[0] == newList[j]) {
            for (var i = 1; i < min + 1; i++) {
                // 判断匹配中断
                if ((oldList[i] !== newList[j + i]) || (i === min)) {
                    // 最小有效块，块太小，分割代价太大
                    if (i >= config.minBlockLength) {
                        // console.log('>>>>', i, j, 8888, oldList[i], 8888, newList[j + i]);
                        for (var z = 0; z < i; z++) {
                            newList.splice(z + j, 1, notword);
                        }
                        return {
                            i: i,
                            j: j
                        };
                    }
                    break;
                }
            }
        }
    }
    return { i: 0, j: 0 };
};
var ignoreFeedLine = function (text) {
    if (!config.ignoreLineBreak) {
        return text;
    }
    text = text.replace(/\r\n/ig, '\n');
    text = text.replace(/\r/ig, '\n');
    return text;
};
exports.ignoreFeedLine = ignoreFeedLine;
var endiff = function (oldText, newText) {
    oldText = ignoreFeedLine(oldText);
    newText = ignoreFeedLine(newText);
    var notword = getNotword(oldText, newText);
    var oldList = oldText.split('');
    var newList = newText.split('');
    var wordList = [];
    var indexList = [];
    var lengthList = [];
    for (var i = 0; i < oldList.length; i++) {
        var dex = getEqualPrefix(oldList.slice(i), newList, notword);
        if (dex.i > 0) {
            indexList.push(i);
            lengthList.push(dex.i);
            wordList.push(oldText.substr(i, dex.i));
            i += dex.i - 1;
        }
    }
    var result = newList.join('').replace(new RegExp(notword + '+', 'g'), notword);
    result = notword + indexList.map(function (key, idx) {
        return indexList[idx] + notword + lengthList[idx];
    }).join(notword) + notword + notword + result;
    return {
        errMsg: '',
        result: result,
        indexList: indexList,
        lengthList: lengthList,
        wordList: wordList,
        compressibility: ((result.length / newText.length) * 100).toFixed(2)
    };
};
exports.endiff = endiff;
var dediff = function (oldText, diffText) {
    oldText = ignoreFeedLine(oldText);
    diffText = ignoreFeedLine(diffText);
    var notword = diffText.substr(0, 1);
    var indexList = [];
    var lengthList = [];
    var arr1 = diffText.split(notword + notword);
    if (arr1.length != 2) {
        return {
            errMsg: 'diff数据异常',
            result: '',
            indexList: [],
            lengthList: []
        };
    }
    var arr2 = arr1[0].substring(1).split(notword);
    if (arr2.length % 2 !== 0) {
        return {
            errMsg: 'diff数据异常',
            result: '',
            indexList: [],
            lengthList: []
        };
    }
    for (var i = 0; i < arr2.length; i += 2) {
        indexList.push(Number(arr2[i]));
        lengthList.push(Number(arr2[i + 1]));
    }
    var result = '';
    var arr3 = arr1[1].split(notword);
    for (var i = 0; i < arr3.length; i++) {
        result += arr3[i];
        // console.log('<<<<', arr3[i]);
        if (indexList[i]) {
            // console.log('>>>>', oldText.substr(indexList[i], lengthList[i]));
            result += oldText.substr(indexList[i], lengthList[i]);
        }
    }
    return {
        errMsg: '',
        result: result,
        indexList: indexList,
        lengthList: lengthList
    };
};
exports.dediff = dediff;
