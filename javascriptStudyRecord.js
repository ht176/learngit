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
/*
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
 */
/** 闭包
 * 在一个函数A中定义一个函数B,B中引用了A中的变量,A返回B的引用,在别的地方调用A.
 */
/*
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
*/
/** 工厂模式
 *
 */
/*
class MobilePhoneFactory {
  // 提供操作系统的接口
  CreateOS () {
    throw new Error('抽象工厂方法不允许直接调用，你需要将我重写！')
  }
  // 提供硬件的接口
  CreateHardWare () {
    throw new Error('抽象工厂方法不允许直接调用，你需要将我重写！')
  }
}

// 定义操作系统的抽象产品类
class OS {
  controlHardWare () {
    throw new Error('抽象产品方法不允许直接调用，你需要将我重写！')
  }
}

// 定义具体操作系统的具体产品类
class AndroidOS extends OS {
  controlHardWare () {
    console.log('我会用安卓的方式去操作硬件')
  }
}
class AppleOS extends OS {
  controlHardWare () {
    console.log('我会用apple的方式去操作硬件')
  }
}

// 定义手机硬件的抽象产品类
class HardWare {
  // 手机硬件的共性方法，这里提取了“根据命令运转”这个共性
  operateByOrder () {
    throw new Errow('抽象产品方法不允许直接调用，你需要将我重写！')
  }
}

// 定义具体硬件的具体产品类
class QualcommHardWare extends HardWare {
  operateByOrder () {
    console.log('我会用高通的方式去运转')
  }
}
class MiWare extends HardWare {
  operateByOrder () {
    console.log('我会用小米的方式去运转')
  }
}

// 具体工厂继承自抽象工厂
class FakeStarFactory extends MobilePhoneFactory {
  CreateOS () {
    // 提供安卓系统实例
    return new AndroidOS()
  }
  CreateHardWare () {
    // 提供高通硬件实例
    return new QualcommHardWare()
  }
}

// 实例化我的手机
const myPhone = new FakeStarFactory()
// 让他拥有操作系统
const myOS = myPhone.CreateOS()
// 让他拥有硬件
const myHardWare = myPhone.CreateHardWare()
// 启动操作系统
myOS.controlHardWare()
// 唤醒硬件
myHardWare.operateByOrder()

// 关键的时刻来了——假如有一天，FakeStar过气了，我们需要产出一款新机投入市场，这时候怎么办？我们是不是不需要对抽象工厂MobilePhoneFactory做任何修改，只需要拓展它的种类：
class newStarFactory extends MobilePhoneFactory {
  createOS () {
    // 操作系统实现代码
  }
  createHardWare () {
    // 硬件实现代码
  }
}
*/
// 定义Storage
class Storage {
  static getInstance () {
    // 判断是否已经new过1个实例
    if (!Storage.instance) {
      // 若这个唯一的实例不存在，那么先创建它
      Storage.instance = new Storage()
    }
    // 如果这个唯一的实例已经存在，则直接返回
    return Storage.instance
  }
  getItem (key) {
    return localStorage.getItem(key)
  }
  setItem (key, value) {
    return localStorage.setItem(key, value)
  }
}

const storage1 = Storage.getInstance()
const storage2 = Storage.getInstance()

storage1.setItem('name', '李雷')
// 李雷
storage1.getItem('name')
// 也是李雷
storage2.getItem('name')

// 返回true
storage1 === storage2