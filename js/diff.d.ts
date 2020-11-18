declare const config: {
    notwords: string[];
    minBlockLength: number;
    ignoreLineBreak: boolean;
};
declare const ignoreFeedLine: (text: string) => string;
declare const endiff: (oldText: string, newText: string) => {
    errMsg: string;
    result: string;
    indexList: number[];
    lengthList: number[];
    compressibility: string;
    wordList: string[];
};
declare const dediff: (oldText: string, diffText: string) => {
    errMsg: string;
    result: string;
    indexList: number[];
    lengthList: number[];
};
export { ignoreFeedLine, config, endiff, dediff };
