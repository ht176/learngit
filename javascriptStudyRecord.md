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

* 校验X,Y是否相等

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

* 闭包

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

* Array

  slice
  : `slice()`就是对应`String`的`substring()`版本，截取`Array`的部分元素，返回新的Array

    ``` javascript
      var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      arr.slice(0, 3); // 从索引0开始，到索引3结束，但不包括索引3: ['A', 'B', 'C']
      arr.slice(3); // 从索引3开始到结束: ['D', 'E', 'F', 'G']
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

  push和pop
  : `push()`向`Array`末尾添加若干元素，`pop()`删除`Array`最后一个元素

    ``` javascript
      var arr = [1, 2];
      arr.push('A', 'B'); // 返回Array新的长度: 4
      arr; // [1, 2, 'A', 'B']
      arr.pop(); // pop()返回'B'
      arr; // [1, 2, 'A']
      arr.pop(); arr.pop(); arr.pop(); // 连续pop 3次
      arr; // []
      arr.pop(); // 空数组继续pop不会报错，而是返回undefined
      arr; // []  
    ```

  unshift和shift
  : `unshift()`向`Array`头部添加若干元素,`shift()`删除`Array`第一个元素

    ``` javascript
      var arr = [1, 2];
      arr.unshift('A', 'B'); // 返回Array新的长度: 4
      arr; // ['A', 'B', 1, 2]
      arr.shift(); // 'A'
      arr; // ['B', 1, 2]
      arr.shift(); arr.shift(); arr.shift(); // 连续shift 3次
      arr; // []
      arr.shift(); // 空数组继续shift不会报错，而是返回undefined
      arr; // []
    ```

  sort
  : `sort()`可以对当前`Array`进行排序，它会直接修改当前`Array`的元素位置，直接调用时，按照默认顺序排序：

  1. 升序

      ``` javascript
        var arr = [1,2,4,3,9,6,5,7,8]
        arr.sort((a, b)=>{return a-b})
      ```

  1. 降序

      ``` javascript
        var arr = [1,2,4,3,9,6,5,7,8]
        arr.sort((a, b)=>{return b-a})
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

  reverse
  : `reverse()`反转`Array`元素顺序

    ``` javascript
      var arr = [1,3,5,7,9]
      arr.reverse()
      arr
    ```

  splice
  : `splice()`是修改`Array`的万能方法，它可以从指定位置删除若干元素，然后再从该位置添加若干元素

    ``` javascript
      var arr = ['Microsoft', 'Apple', 'Yahoo', 'AOL', 'Excite', 'Oracle'];
      // 从索引2开始删除3个元素,然后再添加两个元素:
      arr.splice(2, 3, 'Google', 'Facebook'); // 返回删除的元素 ['Yahoo', 'AOL', 'Excite']
      arr; // ['Microsoft', 'Apple', 'Google', 'Facebook', 'Oracle']
      // 只删除,不添加:
      arr.splice(2, 2); // ['Google', 'Facebook']
      arr; // ['Microsoft', 'Apple', 'Oracle']
      // 只添加,不删除:
      arr.splice(2, 0, 'Google', 'Facebook'); // 返回[],因为没有删除任何元素
      arr; // ['Microsoft', 'Apple', 'Google', 'Facebook', 'Oracle']
    ```

  concat
  : `concat()`方法把当前`Array`与另一个`Array`连接起来，返回一个新`Array`

    ``` javascript
      var arr = ['A', 'B', 'C'];
      var added = arr.concat([1, 2, 3]);
      added; // ['A', 'B', 'C', 1, 2, 3]
      arr; // ['A', 'B', 'C']
    ```

    `concat()`方法并没有修改原来的`Array`，而是返回了一个新的`Array`
    `concat()`方法可以接收任意个元素和`Array`，并将`Array`自动拆开添加到新的`Array`里

    ``` javascript
      var arr = ['A', 'B', 'C'];
      arr.concat(1, 2, [3, 4]); // ['A', 'B', 'C', 1, 2, 3, 4]
    ```

  join
  : join()方法是一个非常实用的方法，它把当前Array的每个元素都用指定的字符串连接起来，然后返回连接后的字符串：

    ``` javascript
      var arr = ['A', 'B', 'C', 1, 2, 3];
      arr.join('-'); // 'A-B-C-1-2-3'
    ```

    如果`Array`的元素不是字符串，将自动转换为字符串后再连接。
