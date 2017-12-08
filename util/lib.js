var toString = Object.prototype.toString
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1
class Lib {
    constructor () {
        this.toString = toString
    }
    isFunction (val) {
        return toString.call(val) === '[object Function]'
    }
    isArray (val) {
        return toString.call(val) === '[object Array]'
    }
    isObject (val) {
        return toString.call(val) === '[object Object]'
    }
    hasOwnproperty (obj, key) {
        return Object.prototype.hasOwnproperty.call(obj, key)
    }
    isArraylike (collection) {
        var length = collection != null && collection.length
        return typeof length === 'number' && length >= 0 && length <= MAX_ARRAY_INDEX
    }
    keys (obj) {
        if (Object.keys) {
            return Object.keys(obj)
        } else {
            var arr = []
            for (var key in obj) {
                if (this.hasOwnproperty(obj, key)) {
                    arr.push(key)
                }
            }
            return arr
        }
    }
    merge (obj, otherObj) {
        if (!otherObj) { return obj }
        var keys = this.keys(otherObj)
        var key
        var objVal
        var otherObjVal
        var isObject = this.isObject
        for (var i = 0, l = keys.length; i < l; i++) {
            key = keys[i]
            objVal = obj[key]
            otherObjVal = otherObj[key]
            if (isObject(objVal) && isObject(otherObjVal)) {
                this.merge(objVal, otherObjVal)
            } else {
                obj[key] = otherObj[key]
            }
        }
    }
    keyJoinVal (obj, option) {
        return this.keys(obj).map(key => {
            return key + ':' + obj[key]
        }).join(';')
    }
    getInd (arr, index) { // 通过索引获取数组的元素,支持负数是从后面获取
        var l = arr.length
        return index < 0 ? arr[l + index] : arr[index]
    }
}
module.exports = Lib
