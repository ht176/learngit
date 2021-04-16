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

### 设计模式

#### 工厂模式

工厂模式其实就是**将创建对象的过程单独封装**。它很像我们去餐馆点菜：比如说点一份西红柿炒蛋，我们不用关心西红柿怎么切、怎么打鸡蛋这些菜品制作过程中的问题，我们只关心摆上桌那道菜。在工厂模式里，我传参这个过程就是点菜，工厂函数里面运转的逻辑就相当于炒菜的厨师和上桌的服务员做掉的那部分工作——这部分工作我们同样不用关心，我们只要能拿到工厂交付给我们的实例结果就行了。

总结一下：工厂模式的目的，就是为了实现**无脑传参**，就是为了爽！

先来说说构造器
在介绍工厂模式之前，为了辅助大家的理解，我想先在这儿给大家介绍一下构造器模式。

别看这个名字很吓人（其实设计模式里每个名字好像都挺吓人的哈哈哈），这玩意儿你几乎天天用（所以咱们不单独给它开小节），不信你来看看：

有一天你写了个公司员工信息录入系统，这个系统开发阶段用户只有你自己，想怎么玩怎么玩。于是在创建“自己”这个唯一的用户的时候，你可以这么写：

``` javascript
const liLei = {
    name: '李雷',
    age: 25,
    career: 'coder',
}
```

有一天你的同桌韩梅梅突然说：“李雷，让我瞅瞅你的系统做得咋样了，我也想被录进去”。你说好，不就多一个人的事情吗，于是代码里手动多了一个韩梅梅：

``` javascript
const liLei = {
    name: '李雷',
    age: 25,
    career: 'coder',
}

const hanMeiMei = {
    name: '韩梅梅',
    age: 24,
    career: 'product manager'
}
```

又过了两天你老板过来了，说李雷，系统今天提测了，先把部门的 500 人录入看看功能。李雷心想，500 个对象字面量，要死要死，还好我有**构造函数**。于是李雷写出了一个可以自动创建用户的 `User` 函数：

``` javascript
function User(name , age, career) {
    this.name = name
    this.age = age
    this.career = career
}
```

楼上个这 `User`，就是一个**构造器**。此处我们采用了 `ES5` 构造函数的写法，因为 `ES6` 中的 `class` 其实本质上还是函数，`class` 语法只是语法糖，构造函数，才是它的真面目。

接下来要做的事情，就是让程序自动地去读取数据库里面一行行的员工信息，然后把拿到的姓名、年龄等字段塞进`User`函数里，进行一个简单的调用：

`const user = new User(name, age, career)`
从此李雷再也不用手写字面量。

像 `User` 这样当新建对象的内存被分配后，用来初始化该对象的特殊函数，就叫做构造器。在 `JavaScript` 中，我们使用构造函数去初始化对象，就是应用了**构造器模式**。这个模式太简单了，简单到我这一通讲对很多同学来说其实并不必要，大家都是学过 `JavaScript` 基础的人，都知道怎么 `new` 一个对象。但是我们洋洋洒洒这么一段的目的，并不是为了带大家复习构造函数本身的用法，而是希望大家去思考开篇我们提到的问题：

**在创建一个`user`过程中，谁变了，谁不变？**

很明显，变的是每个`user`的姓名、年龄、工种这些值，这是用户的**个性**，不变的是每个员工都具备姓名、年龄、工种这些属性，这是用户的**共性**。

**那么构造器做了什么？**

构造器是不是将 `name、age、career` 赋值给对象的过程封装，确保了每个对象都具备这些属性，确保了共性的不变，同时将 `name、age、career` 各自的取值操作开放，确保了个性的灵活？

如果在使用构造器模式的时候，我们本质上是去抽象了每个对象实例的变与不变。那么使用工厂模式时，我们要做的就是去抽象不同构造函数（类）之间的变与不变。

##### 简单工厂

咱们先不说简单工厂模式定义是啥，咱们先来看李雷的新需求：

老板说这个系统录入的信息也太简单了，程序员和产品经理之间的区别一个简单的`career`字段怎么能说得清？我要求这个系统具备**给不同工种分配职责说明**的功能。也就是说，要给每个工种的用户加上一个个性化的字段，来描述他们的工作内容。

完了，这下员工的共性被拆离了。还好有构造器，李雷心想不就是多写个构造器的事儿吗，我写：

``` javascript
function Coder(name , age) {
    this.name = name
    this.age = age
    this.career = 'coder'
    this.work = ['写代码','写系分', '修Bug']
}
function ProductManager(name, age) {
    this.name = name
    this.age = age
    this.career = 'product manager'
    this.work = ['订会议室', '写PRD', '催更']
}
```

现在我们有两个类（后面可能还会有更多的类），麻烦的事情来了：难道我每从数据库拿到一条数据，都要人工判断一下这个员工的工种，然后手动给它分配构造器吗？不行，这也是一个“变”，我们把这个“变”交给一个函数去处理：

``` javascript
function Factory(name, age, career) {
    switch(career) {
        case 'coder':
            return new Coder(name, age)
            break
        case 'product manager':
            return new ProductManager(name, age)
            break
        ...
}
```

看起来是好一些了，至少我们不用操心构造函数的分配问题了。但是大家注意我在 `switch` 的末尾写了个省略号，这个省略号比较恐怖。看着这个省略号，李雷哭了，他想到：整个公司上下有数十个工种，难道我要手写数十个类、数十行 `switch` 吗？

当然不！回到我们最初的问题：大家仔细想想，在楼上这两段并不那么好的代码里，**变的是什么？不变的又是什么？**

`Coder` 和 `ProductManager` 两个工种的员工，是不是仍然存在都拥有 `name、age、career、work` 这四个属性这样的共性？它们之间的区别，在于每个字段取值的不同，以及 `work` 字段需要随 `career` 字段取值的不同而改变。这样一来，我们是不是对共性封装得不够彻底？那么相应地，共性与个性是不是分离得也不够彻底？
现在我们把相同的逻辑封装回User类里，然后把这个承载了共性的 `User` 类和个性化的逻辑判断写入同一个函数：

``` javascript
function User(name , age, career, work) {
    this.name = name
    this.age = age
    this.career = career
    this.work = work
}

function Factory(name, age, career) {
    let work
    switch(career) {
        case 'coder':
            work =  ['写代码','写系分', '修Bug']
            break
        case 'product manager':
            work = ['订会议室', '写PRD', '催更']
            break
        case 'boss':
            work = ['喝茶', '看报', '见客户']
        case 'xxx':
            // 其它工种的职责分配
            ...

    return new User(name, age, career, work)
}
```

这样一来，我们要做事情是不是简单太多了？不用自己时刻想着我拿到的这组数据是什么工种、我应该怎么给它分配构造函数，更不用手写无数个构造函数——Factory已经帮我们做完了一切，而我们只需要像以前一样**无脑传参**就可以了！

##### 抽象工厂

一个不简单的简单工厂引发的命案
在实际的业务中，我们往往面对的复杂度并非数个类、一个工厂可以解决，而是需要动用多个工厂。

我们继续看上个小节举出的例子，简单工厂函数最后长这样：

``` javascript
function Factory(name, age, career) {
    let work
    switch(career) {
        case 'coder':
            work =  ['写代码','写系分', '修Bug']
            break
        case 'product manager':
            work = ['订会议室', '写PRD', '催更']
            break
        case 'boss':
            work = ['喝茶', '看报', '见客户']
        case 'xxx':
            // 其它工种的职责分配
            ...

    return new User(name, age, career, work)
}
```

乍一看没什么问题，但是经不起推敲呀。首先映入眼帘的 `Bug`，是我们把 Boss 这个角色和普通员工塞进了一个工厂。大家知道，Boss 和基层员工在职能上差别还是挺大的，具体在员工系统里怎么表现呢？首先他的权限就跟咱们不一样。有一些系统，比如员工绩效评估的打分入口，就只有 Boss 点得进去，对不对？除此之外还有许多操作，是只有管理层可以执行的，因此我们需要对这个群体的对象进行单独的逻辑处理。

怎么办？去修改 `Factory` 的函数体、增加管理层相关的判断和处理逻辑吗？单从功能实现上来说，没问题。但这么做其实是在挖坑——因为公司不仅仅只有这两类人，除此之外还有外包同学、还有保安，他们的权限、职能都存在着质的差别。如果延续这个思路，每考虑到一个新的员工群体，就回去修改一次 `Factory` 的函数体，这样做糟糕透了——首先，是 **`Factory`会变得异常庞大**，庞大到你每次添加的时候都不敢下手，生怕自己万一写出一个`Bug`，就会导致整个`Factory`的崩坏，进而摧毁整个系统；其次，你坑死了你的队友：`Factory` 的逻辑过于繁杂和混乱，没人敢维护它；最后，你还连带坑了隔壁的测试同学：你每次新加一个工种，他都不得不对整个`Factory` 的逻辑进行回归——谁让你的改变是在 `Factory`内部原地发生的呢！这一切悲剧的根源只有一个——**没有遵守开放封闭原则**。

我们再复习一下开放封闭原则的内容：对拓展开放，对修改封闭。说得更准确点，**软件实体（类、模块、函数）可以扩展，但是不可修改**。楼上这波操作错就错在我们不是在拓展，而是在疯狂地修改。
***抽象工厂模式***
上面这段可能仍有部分同学觉得抽象，也没关系。这里咱们先不急着理解透彻这个干巴巴的概念，先来看这么一个示例：

大家知道一部智能手机的基本组成是操作系统（`Operating System`，我们下面缩写作 `OS`）和硬件（`HardWare`）组成。所以说如果我要开一个山寨手机工厂，那我这个工厂里必须是既准备好了操作系统，也准备好了硬件，才能实现手机的**量产**。考虑到操作系统和硬件这两样东西背后也存在不同的厂商，而我现在**并不知道我下一个生产线到底具体想生产一台什么样的手机**，我只知道手机必须有这两部分组成，所以我先来一个抽象类来**约定住这台手机的基本组成**：

``` javascript
class MobilePhoneFactory {
    // 提供操作系统的接口
    createOS(){
        throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！");
    }
    // 提供硬件的接口
    createHardWare(){
        throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！");
    }
}
```

楼上这个类，除了约定手机流水线的通用能力之外，啥也不干。如果你尝试让它干点啥，比如 `new` 一个 `MobilePhoneFactory` 实例，并尝试调用它的实例方法。它还会给你报错，提醒你“我不是让你拿去`new`一个实例的，我就是个定规矩的”。在抽象工厂模式里，楼上这个类就是我们食物链顶端最大的 Boss——`AbstractFactory`（抽象工厂）。

抽象工厂不干活，具体工厂（`ConcreteFactory`）来干活！当我们明确了生产方案，明确某一条手机生产流水线具体要生产什么样的手机了之后，就可以化抽象为具体，比如我现在想要一个专门生产 `Android` 系统 + 高通硬件的手机的生产线，我给这类手机型号起名叫 `FakeStar`，那我就可以为 `FakeStar` 定制一个具体工厂：

``` javascript
// 具体工厂继承自抽象工厂
class FakeStarFactory extends MobilePhoneFactory {
    createOS() {
        // 提供安卓系统实例
        return new AndroidOS()
    }
    createHardWare() {
        // 提供高通硬件实例
        return new QualcommHardWare()
    }
}
```

这里我们在提供安卓系统的时候，调用了两个构造函数：AndroidOS 和 QualcommHardWare，它们分别用于生成具体的操作系统和硬件实例。像这种被我们拿来用于 new 出具体对象的类，叫做具体产品类（ConcreteProduct）。具体产品类往往不会孤立存在，不同的具体产品类往往有着共同的功能，比如安卓系统类和苹果系统类，它们都是操作系统，都有着可以**操控手机硬件系统**这样一个最基本的功能。因此我们可以用一个**抽象产品（AbstractProduct）类**来声明这一类产品应该具有的基本功能（众：什么抽象产品？？？要这些玩意儿干啥？老夫写代码就是一把梭，为啥不让我老老实实一个一个写具体类？？？大家稍安勿躁，先把例子看完，下文会有解释）

``` javascript
// 定义操作系统这类产品的抽象产品类
class OS {
    controlHardWare() {
        throw new Error('抽象产品方法不允许直接调用，你需要将我重写！');
    }
}

// 定义具体操作系统的具体产品类
class AndroidOS extends OS {
    controlHardWare() {
        console.log('我会用安卓的方式去操作硬件')
    }
}

class AppleOS extends OS {
    controlHardWare() {
        console.log('我会用🍎的方式去操作硬件')
    }
}
...
```

硬件类产品同理：

``` javascript
// 定义手机硬件这类产品的抽象产品类
class HardWare {
    // 手机硬件的共性方法，这里提取了“根据命令运转”这个共性
    operateByOrder() {
        throw new Error('抽象产品方法不允许直接调用，你需要将我重写！');
    }
}

// 定义具体硬件的具体产品类
class QualcommHardWare extends HardWare {
    operateByOrder() {
        console.log('我会用高通的方式去运转')
    }
}

class MiWare extends HardWare {
    operateByOrder() {
        console.log('我会用小米的方式去运转')
    }
}
...
```

好了，如此一来，当我们需要生产一台`FakeStar`手机时，我们只需要这样做：

``` javascript
// 这是我的手机
const myPhone = new FakeStarFactory()
// 让它拥有操作系统
const myOS = myPhone.createOS()
// 让它拥有硬件
const myHardWare = myPhone.createHardWare()
// 启动操作系统(输出‘我会用安卓的方式去操作硬件’)
myOS.controlHardWare()
// 唤醒硬件(输出‘我会用高通的方式去运转’)
myHardWare.operateByOrder()
```

关键的时刻来了——假如有一天，`FakeStar`过气了，我们需要产出一款新机投入市场，这时候怎么办？我们是不是**不需要对抽象工厂`MobilePhoneFactory`做任何修改**，只需要拓展它的种类：

``` javascript
class newStarFactory extends MobilePhoneFactory {
    createOS() {
        // 操作系统实现代码
    }
    createHardWare() {
        // 硬件实现代码
    }
}
```

这么个操作，**对原有的系统不会造成任何潜在影响** 所谓的“对拓展开放，对修改封闭”就这么圆满实现了。前面我们之所以要实现**抽象产品类**，也是同样的道理。

总结
大家现在回头对比一下抽象工厂和简单工厂的思路，思考一下：它们之间有哪些异同？

它们的共同点，在于都**尝试去分离一个系统中变与不变的部分**。它们的不同在于**场景的复杂度**。在简单工厂的使用场景里，处理的对象是类，并且是一些非常好对付的类——它们的共性容易抽离，同时因为逻辑本身比较简单，故而不苛求代码可扩展性。抽象工厂本质上处理的其实也是类，但是是一帮非常棘手、繁杂的类，这些类中不仅能划分出门派，还能划分出等级，同时存在着千变万化的扩展可能性——这使得我们必须对共性作更特别的处理、使用抽象类去降低扩展的成本，同时需要对类的性质作划分，于是有了这样的四个关键角色：

抽象工厂（抽象类，它不能被用于生成具体实例）
: 用于声明最终目标产品的共性。在一个系统里，抽象工厂可以有多个（大家可以想象我们的手机厂后来被一个更大的厂收购了，这个厂里除了手机抽象类，还有平板、游戏机抽象类等等），每一个抽象工厂对应的这一类的产品，被称为“产品族”。

具体工厂（用于生成产品族里的一个具体的产品）
: 继承自抽象工厂、实现了抽象工厂里声明的那些方法，用于创建具体的产品的类。

抽象产品（抽象类，它不能被用于生成具体实例）
: 上面我们看到，具体工厂里实现的接口，会依赖一些类，这些类对应到各种各样的具体的细粒度产品（比如操作系统、硬件等），这些具体产品类的共性各自抽离，便对应到了各自的抽象产品类。

具体产品（用于生成产品族里的一个具体的产品所依赖的更细粒度的产品）
: 比如我们上文中具体的一种操作系统、或具体的一种硬件等。

抽象工厂模式的定义，是**围绕一个超级工厂创建其他工厂**。本节内容对一些工作年限不多的同学来说可能不太友好，但抽象工厂目前来说在JS世界里也应用得并不广泛，所以大家不必拘泥于细节，只需留意以下三点：

1. 学会用 ES6 模拟 JAVA 中的抽象类；
1. 了解抽象工厂模式中四个角色的定位与作用；
1. 对“开放封闭原则”形成自己的理解，知道它好在哪，知道执行它的必要性。

如果能对这三点有所掌握，那么这一节的目的就达到了，最难搞、最难受的抽象工厂也就告一段落了。

#### 单例模式

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
