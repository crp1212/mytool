var chnNumChar = {
    '零': 0,
    '一': 1,
    '二': 2,
    '三': 3,
    '四': 4,
    '五': 5,
    '六': 6,
    '七': 7,
    '八': 8,
    '九': 9
}
var chnNameValue = {
    十: {value: 10},
    百: {value: 100},
    千: {value: 1000},
    万: {value: 10000},
    亿: {value: 100000000}
}
function ChineseToNumber(chnStr) {
    var arr = chnStr.split('')
    var num = 0
    var len = arr.length
    var isSecUnit = false
    while (len--) {
        var val = arr[len]
        if (chnNumChar[val]) {
            if (isSecUnit) {
                num += chnNumChar[val] * isSecUnit
                isSecUnit = false
            } else {
                num += chnNumChar[val]
            }
        } else if (chnNameValue[val]) {
            isSecUnit = chnNameValue[val].value
            if (!len) {
                num = parseInt('1' + num)
            }
        }
    }
    console.log(num)
}
ChineseToNumber('一千六百')