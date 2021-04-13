/* 
页面重构怎么操作？

网站重构：在不改变外部行为的前提下，简化结构、添加可读性，而在网站前端保持一致的行为。
也就是说是在不改变UI的情况下，对网站进行优化，在扩展的同时保持一致的UI。

对于传统的网站来说重构通常是：

表格(table)布局改为DIV + CSS
使网站前端兼容于现代浏览器(针对于不合规范的CSS、如对IE6有效的)
对于移动平台的优化
针对于SEO进行优化
深层次的网站重构应该考虑的方面

减少代码间的耦合
让代码保持弹性
严格按规范编写代码
设计可扩展的API
代替旧有的框架、语言(如VB)
增强用户体验
通常来说对于速度的优化也包含在重构中

压缩JS、CSS、image等前端资源(通常是由服务器来解决)
程序的性能优化(如数据读写)
采用CDN来加速资源加载
对于JS DOM的优化
HTTP服务器的文件缓存 */

/** 校验X,Y是否相等
 *  封装方法比对两个对象是否相等,使用了instanceof(检测对象的类型)、Object.keys(返回对象属性数组)、递归方法
 */
function equals (x, y) {
  var f1 = x instanceof Object
  var f2 = y instanceof Object
  if (!f1 || !f2) {
    return x === y
  }
  if (Object.keys(x).length !== Object.keys(y).length) {
    return false
  }
  var newX = Object.keys(x)
  for (var p in newX) {
    p = newX[p]
    var a = x[p] instanceof Object
    var b = y[p] instanceof Object
    if (a && b) {
      const equal = equals(x[p], y[p])
      if (!equal) {
        return equal
      }
    } else if (x[p] !== y[p]) {
      return false
    }
  }
  return true
}
console.log(equals([12, 12], [12, 13]))

/** 闭包
 * 在一个函数A中定义一个函数B,B中引用了A中的变量,A返回B的引用,在别的地方调用A.
 */
function say () {
  let num = 666
  return function () {
    num++
    console.log(num)
  }
}
function test () {
  let sayConsole = say()
  sayConsole()
  sayConsole()
  sayConsole()
}