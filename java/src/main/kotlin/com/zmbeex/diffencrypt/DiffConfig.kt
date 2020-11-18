package com.zmbeex.diffencrypt


class DiffConfig {
    var notwords: List<String> = "αβγδεζηθικλμνξοπρστυφχψω∫∮∝∞∧∨∑∏∪∩∈姖姗姘姙姛姝姞姟姠姡".split("");
    var minBlockLength: Int = 10;
    var ignoreLineBreak: Boolean = true;
}
