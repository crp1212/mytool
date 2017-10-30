function testFn (cb, title) {
    title = title || '测试'
    console.time(title + ': ')
    cb()
    console.timeEnd(title + ': ')
}

function loopFn (num, cb) {
    for (var i = 0; i < num; i++) {
        cb()
    }
}

testFn(() => {
    var a = []
    for (var i = 0; i < 10000000; i++) {
        a.push(i)
    }
}, 'loop')
testFn(() => {
    var a = []
    var i = 0
    while (i < 10000000) {
        a.push(i)
        i++
    }
}, 'loop')
