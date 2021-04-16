# JavaScript学习记录

## 记录

### 说明

* 页面重构怎么操作？

  ``` html
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
    HTTP服务器的文件缓存
  ```

* 99%的网站都需要被重构是那本书上写的？

  ``` html
    网站重构：应用web标准进行设计（第2版）
  ```

### 方法记录

 校验X,Y是否相等

  ``` javascript
    /** 
      * 封装方法比对两个对象是否相等,使用了instanceof(检测对象的类型)、Object.keys(返回对象属性数组)、递归方法
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
  ```

#### 闭包

  ``` javascript
    /** 
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
  ```

  ``` javascript
    function count() {
      var arr = []
      for (var i=1 i<=3 i++) {
        arr.push(function () {
          return i * i
        })
      }
      return arr
    }

    var results = count()
    var f1 = results[0]
    var f2 = results[1]
    var f3 = results[2]

    f1() // 16
    f2() // 16
    f3() // 16
    // 改进方法，循环时声明变量方式改为let i或者将i传入
    /**
      for (var i=1 i<=3 i++) {
        arr.push((function (n) {
          return function () {
            return n * n
          }
        })(i))
      }
    */
  ```

  注意这里用了一个“创建一个匿名函数并立刻执行”的语法：

  ``` javascript
    (function (x) {
      return x * x
    })(3) // 9
  ```

  理论上讲，创建一个匿名函数并立刻执行可以这么写：

  `function (x) { return x * x } (3)`
  但是由于JavaScript语法解析的问题，会报SyntaxError错误，因此需要用括号把整个函数定义括起来：

  `(function (x) { return x * x }) (3)`
  通常，一个立即执行的匿名函数可以把函数体拆开，一般这么写：

  ``` javascript
    (function (x) {
      return x * x
    })(3)
  ```

  说了这么多，难道闭包就是为了返回一个函数然后延迟执行吗？

  当然不是！闭包有非常强大的功能。举个栗子：

  在面向对象的程序设计语言里，比如Java和C++，要在对象内部封装一个私有变量，可以用private修饰一个成员变量。

  在没有class机制，只有函数的语言里，借助闭包，同样可以封装一个私有变量。我们用JavaScript创建一个计数器：
  计数器

  ``` javascript
    function creat_counter(initial) {
      var x = initial || 0
      return {
        inc: function () {
          x += 1
          return x
        }
      }
    }
    
    var c1 = create_counter()
    c1.inc() // 1
    c1.inc() // 2
    c1.inc() // 3

    var c2 = create_counter(10)
    c2.inc() // 11
    c2.inc() // 12
    c2.inc() // 13
  ```

#### Array

#### slice

  `slice()`就是对应`String`的`substring()`版本，截取`Array`的部分元素，返回新的Array

  ``` javascript
    var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    arr.slice(0, 3) // 从索引0开始，到索引3结束，但不包括索引3: ['A', 'B', 'C']
    arr.slice(3) // 从索引3开始到结束: ['D', 'E', 'F', 'G']
  ```

  注意到`slice()`的起止参数包括开始索引，不包括结束索引。
  <代码写在这>
  如果不给`slice()`传递任何参数，它就会从头到尾截取所有元素。利用这一点，我们可以很容易地复制一个`Array`：

  ``` javascript
    var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    let aCopy = arr.slice()
    aCopy // ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    aCopy === arr // false
  ```

#### push和pop

  `push()`向`Array`末尾添加若干元素，`pop()`删除`Array`最后一个元素

  ``` javascript
    var arr = [1, 2]
    arr.push('A', 'B') // 返回Array新的长度: 4
    arr // [1, 2, 'A', 'B']
    arr.pop() // pop()返回'B'
    arr // [1, 2, 'A']
    arr.pop() arr.pop() arr.pop() // 连续pop 3次
    arr // []
    arr.pop() // 空数组继续pop不会报错，而是返回undefined
    arr // []  
  ```

#### unshift和shift

  `unshift()`向`Array`头部添加若干元素,`shift()`删除`Array`第一个元素

  ``` javascript
    var arr = [1, 2]
    arr.unshift('A', 'B') // 返回Array新的长度: 4
    arr // ['A', 'B', 1, 2]
    arr.shift() // 'A'
    arr // ['B', 1, 2]
    arr.shift() arr.shift() arr.shift() // 连续shift 3次
    arr // []
    arr.shift() // 空数组继续shift不会报错，而是返回undefined
    arr // []
  ```

#### sort

  `sort()`可以对当前`Array`进行排序，它会直接修改当前`Array`的元素位置，直接调用时，按照默认顺序排序：

  1. 升序

      ``` javascript
        var arr = [1,2,4,3,9,6,5,7,8]
        arr.sort((a, b)=> a-b)
      ```

  1. 降序

      ``` javascript
        var arr = [1,2,4,3,9,6,5,7,8]
        arr.sort((a, b)=> b-a)
      ```

  1. 字符串排序

      ``` javascript
        var arr = ['Google', 'apple', 'Microsoft']
        arr.sort(function (s1, s2) {
            x1 = s1.toUpperCase()
            x2 = s2.toUpperCase()
            if (x1 < x2) {
                return -1
            }
            if (x1 > x2) {
                return 1
            }
            return 0
        }) // ['apple', 'Google', 'Microsoft']
      ```

  1. 按照元素属性排序

      ``` javascript
        function compare(prop) {
          return (a, b) => {
            return a[prop] - b[prop]
          }
        }
        var arr = [
          {
            name: '张三',
            age: 17
          }, {
            name: '李四',
            age: 19
          }, {
            name: '王二',
            age: 16
          }
        ]
        arr.sort(compare('age'))
      ```  

  1. 根据参数确定升序or降序

      ``` javascript
        function compare(prop, rev = true) {
          rev = rev ? 1 : -1
          return (a, b) => {
            return a[prop] > b[prop] ? rev * 1 : rev * -1
          }
        }
        var arr = [
          {
            name: '张三',
            age: 17
          }, {
            name: '李四',
            age: 19
          }, {
            name: '王二',
            age: 16
          }
        ]
        arr.sort(compare('age', false))
      ```

#### reverse

  `reverse()`反转`Array`元素顺序

  ``` javascript
    var arr = [1,3,5,7,9]
    arr.reverse()
    arr
  ```

#### splice

  `splice()`是修改`Array`的万能方法，它可以从指定位置删除若干元素，然后再从该位置添加若干元素

  ``` javascript
    var arr = ['Microsoft', 'Apple', 'Yahoo', 'AOL', 'Excite', 'Oracle']
    // 从索引2开始删除3个元素,然后再添加两个元素:
    arr.splice(2, 3, 'Google', 'Facebook') // 返回删除的元素 ['Yahoo', 'AOL', 'Excite']
    arr // ['Microsoft', 'Apple', 'Google', 'Facebook', 'Oracle']
    // 只删除,不添加:
    arr.splice(2, 2) // ['Google', 'Facebook']
    arr // ['Microsoft', 'Apple', 'Oracle']
    // 只添加,不删除:
    arr.splice(2, 0, 'Google', 'Facebook') // 返回[],因为没有删除任何元素
    arr // ['Microsoft', 'Apple', 'Google', 'Facebook', 'Oracle']
  ```

#### concat

  `concat()`方法把当前`Array`与另一个`Array`连接起来，返回一个新`Array`

  ``` javascript
    var arr = ['A', 'B', 'C']
    var added = arr.concat([1, 2, 3])
    added // ['A', 'B', 'C', 1, 2, 3]
    arr // ['A', 'B', 'C']
  ```

  `concat()`方法并没有修改原来的`Array`，而是返回了一个新的`Array`
  `concat()`方法可以接收任意个元素和`Array`，并将`Array`自动拆开添加到新的`Array`里

  ``` javascript
    var arr = ['A', 'B', 'C']
    arr.concat(1, 2, [3, 4]) // ['A', 'B', 'C', 1, 2, 3, 4]
  ```

#### join

  `join()`方法是一个非常实用的方法，它把当前Array的每个元素都用指定的字符串连接起来，然后返回连接后的字符串：

  ``` javascript
    var arr = ['A', 'B', 'C', 1, 2, 3]
    arr.join('-') // 'A-B-C-1-2-3'
  ```

  如果`Array`的元素不是字符串，将自动转换为字符串后再连接。

#### 函数

* 方法
  对象中绑定函数，称之为方法

##### apply

  控制`this`的指向

  ``` javascript
    function getAge() {
      var y = new Date().getFullYear()
      return y - this.birth
    }

    var xiaoming = {
      name: '小明',
      birth: 1990,
      age: getAge
    }

    xiaoming.age() // 25
    getAge.apply(xiaoming, []) // 25, this指向xiaoming, 参数为空
  ```

##### 装饰器

  利用`apply()`，动态改变函数的行为

  JavaScript的所有对象都是动态的，即使内置的函数，我们也可以重新指向新的函数。

  现在假定我们想统计一下代码一共调用了多少次`parseInt()`，可以把所有的调用都找出来，然后手动加上`count += 1`，不过这样做太傻了。最佳方案是用我们自己的函数替换掉默认的`parseInt()`：

  ``` javascript
    var count = 0
    var oldParseInt = parseInt // 保存原函数

    window.parseInt = function () {
        count += 1
        return oldParseInt.apply(null, arguments) // 调用原函数
    }
    // 测试:
    parseInt('10')
    parseInt('20')
    parseInt('30')
    console.log('count = ' + count) // 3
  ```

#### 高阶函数

  让函数的参数能够接收别的函数。

  ``` javascript
    function add(x, y, f) {
      return f(x) + f(y)
    }
    var x = add(-5, 6, Math.abs) // 11
    console.log(x)
  ```

##### map

  数据加工

  ```javascript
    function pow(x) {
        return x * x
    }
    var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    var results = arr.map(pow) // [1, 4, 9, 16, 25, 36, 49, 64, 81]
    console.log(results)
  ```

  将姓名首字母转大写，其余小写

  ``` javascript
    function normalize(arr) {
      return arr.map(e=>e[0].toUpperCase()+e.substring(1).toLowerCase())
    }
    // 测试:
    if (normalize(['adam', 'LISA', 'barT']).toString() === ['Adam', 'Lisa', 'Bart'].toString()) {
      console.log('测试通过!')
    }
    else {
      console.log('测试失败!')
    }
  ```

##### reduce

  1. 汇总
    Array的reduce()把一个函数作用在这个Array的[x1, x2, x3...]上，这个函数必须接收两个参数，reduce()把结果继续和序列的下一个元素做累积计算，其效果就是：
    求和

      ``` javascript
        var arr = [1, 3, 5, 7, 9]
        arr.reduce(function (x, y) {
          return x + y
        })
      ```

  1. 求积

      ``` javascript
        function product(arr) {
          return arr.reduce((pre, cure) => pre * cure)
        }
        // 测试:
        if (product([1, 2, 3, 4]) === 24 && product([0, 1, 2]) === 0 && product([99, 88, 77, 66]) === 44274384) {
          console.log('测试通过!')
        }
        else {
          console.log('测试失败!')
        }
      ```

      把`[1, 3, 5, 7, 9]`变换成整数`13579`

      ``` javascript
        [1, 3, 5, 7, 9].reduce((pre, cure) => pre*10+cure)
      ```

      不要使用`JavaScript`内置的`parseInt()`函数，利用`map`和`reduce`操作实现一个`string2int()`函数：

      ``` javascript
        function string2int(val) {
          let arr = val.split('')
          return arr.map(e => e *1).reduce((pre, cure) => pre*10+cure)
        }
        string2int('46489515')
      ```

##### filter

  用于把`Array`的某些元素过滤掉，然后返回剩下的元素。和`map()`类似，`Array`的`filter()`也接收一个函数。和`map()`不同的是，`filter()`把传入的函数依次作用于每个元素，然后根据返回值是`true`还是`false`决定保留还是丢弃该元素。

  1. 在一个`Array`中，删掉偶数，只保留奇数

      ``` javascript
        var arr = [1, 2, 4, 5, 6, 9, 10, 15]
        var r = arr.filter(function (x) {
            return x % 2 !== 0
        })
        r // [1, 5, 9, 15]
      ```

  1. 利用filter，可以巧妙地去除`Array`的重复元素：

      ``` javascript
        var r,
          arr = ['apple', 'strawberry', 'banana', 'pear', 'apple', 'orange', 'orange', 'strawberry']
          r = arr.filter(function (element, index, self) {
              return self.indexOf(element) === index
          })

          console.log(r.toString())
      ```

##### every

  `every()`方法可以判断数组的所有元素是否满足测试条件。

  给定一个包含若干字符串的数组，判断所有字符串是否满足指定的测试条件：

  ``` javascript
    'use strict'
    var arr = ['Apple', 'pear', 'orange']
    console.log(arr.every(function (s) {
        return s.length > 0
    })) // true, 因为每个元素都满足s.length>0

    console.log(arr.every(function (s) {
        return s.toLowerCase() === s
    })) // false, 因为不是每个元素都全部是小写
  ```

##### find

  `find()`方法用于查找符合条件的第一个元素，如果找到了，返回这个元素，否则，返回`undefined`：

  ``` javascript
    'use strict'
    var arr = ['Apple', 'pear', 'orange']
    console.log(arr.find(function (s) {
        return s.toLowerCase() === s
    })) // 'pear', 因为pear全部是小写

    console.log(arr.find(function (s) {
        return s.toUpperCase() === s
    })) // undefined, 因为没有全部是大写的元素
  ```

##### findIndex

  `findIndex()`和`find()`类似，也是查找符合条件的第一个元素，不同之处在于`findIndex()`会返回这个元素的索引，如果没有找到，返回-1：

  ``` javascript
    'use strict'
    var arr = ['Apple', 'pear', 'orange']
    console.log(arr.findIndex(function (s) {
        return s.toLowerCase() === s
    })) // 1, 因为'pear'的索引是1

    console.log(arr.findIndex(function (s) {
        return s.toUpperCase() === s
    })) // -1
  ```

##### forEach

  `forEach()`和`map()`类似，它也把每个元素依次作用于传入的函数，但不会返回新的数组。`forEach()`常用于遍历数组，因此，传入的函数不需要返回值：

  ``` javascript
    'use strict'
    var arr = ['Apple', 'pear', 'orange']
    arr.forEach(console.log) // 依次打印每个元素
  ```

##### generator

  `generator(生成器)`是ES6标准引入的新的数据类型，一个`generator`看上去像一个函数，但是可以返回多次
  斐波那契数列

  ``` javascript
    function* fib (max) {
      var a = 0,
        b = 1,
        n = 0
      while(n < max) {
        yield a
        [a, b] = [b, a + b]
        n++
      }
      return
    }

    var f = fib(5)
    f.next()
  ```

  不使用闭包的计数器

  ``` javascript
    function* next_id() {
      var current_id = 0
      yield current_id ++
      return current_id
    }

    // 测试:
    var
      x,
      pass = true,
      g = next_id()
    for (x = 1 x < 100 x ++) {
      if (g.next().value !== x) {
        pass = false
        console.log('测试失败!')
        break
      }
    }
    if (pass) {
      console.log('测试通过!')
    }
  ```

#### class

  ``` javascript
    class Student {
      constructor(name) {
        this.name = name
      }

      hello() {
        alert('Hello, ' + this.name + '!')
      }
    }

    var xiaoming = new Student('小明')
    xiaoming.hello()
  ```

##### extends

  继承
  注意`PrimaryStudent`的定义也是`class`关键字实现的，而`extends`则表示原型链对象来自`Student`。子类的构造函数可能会与父类不太相同，例如，`PrimaryStudent`需要`name`和`grade`两个参数，并且需要通过`super(name)`来调用父类的构造函数，否则父类的name属性无法正常初始化。

  ``` javascript
    class PrimaryStudent extends Student {
      constructor(name, grade) {
        super(name) // 记得用super调用父类的构造方法!
        this.grade = grade
      }

      myGrade() {
        alert('I am at grade ' + this.grade)
      }
    }
  ```

### 脑洞大开

  很久很久以前，有个叫阿隆佐·邱奇的帅哥，发现只需要用函数，就可以用计算机实现运算，而不需要`0、1、2、3`这些数字和`+、-、*、/`这些符号。

  JavaScript支持函数，所以可以用JavaScript用函数来写这些计算。来试试：

  ```javascript
    'use strict'

    // 定义数字0:
    var zero = function (f) {
      return function (x) {
        return x
      }
    }

    // 定义数字1:
    var one = function (f) {
      return function (x) {
        return f(x)
      }
    }

    // 定义加法:
    function add(n, m) {
      return function (f) {
        return function (x) {
          return m(f)(n(f)(x))
        }
      }
    }
    // 计算数字2 = 1 + 1:
    var two = add(one, one)
    // 计算数字3 = 1 + 2:
    var three = add(one, two)
    // 计算数字5 = 2 + 3:
    var five = add(two, three)
    // 你说它是3就是3，你说它是5就是5，你怎么证明？
    // 呵呵，看这里:
    // 给3传一个函数,会打印3次:
    (three(function () {
      console.log('print 3 times')
    }))()

    // 给5传一个函数,会打印5次:
    (five(function () {
      console.log('print 5 times')
    }))()

    // 继续接着玩一会...
  ```
