---
title: "You Don't Know JS 上卷(Ⅱ) 归纳"
date: 2018-03-11 23:51:49
tags:
  - JavaScript
categories:
  - 深入理解JavaScript
  - YouDon'tKnowJS
---

>{% blockquote [No name] %}
	试着改变, 致力于完善 ... 

{% endblockquote %}

<!--more-->

---

## 一.误解
---

### 1.1.this指向函数本身

  ```js
  1.函数体内的this并不一定指向函数本身，或者说，绝大部分情况下不指向函数本身
  2.要指向函数本身，一般需要通过它的词法标识符，比如function foo(){}，指向它本身，应使用foo.element;
  3.对于匿名函数，要引用它自身，则需要使用atgument.callee,然而，这个方法已经被废弃，故应尽量避免使用匿名函数.
   --或者说，在需要自引用的时候使用具名函数.
  4.使用call可确保this指向函数本身，如foo.call(foo,arg..);
  ```

### 1.2.this指向函的数作用域

  ```js
  1.有时确实如此，有时却不一定，但可以知道的是，this不会指向函数的词法作用域
  2.在JavaScript内部，作用域如同对象一般，所有的可见标识符都可以算作是它的属性
  3.然而，作用域(词法)“对象”却无法通过JavaScript代码访问，它存在于JavaScript引擎内部
  4.是故this不可能指向函数的词法作用域,无法将this与词法作用域的查找混合使用
  5.this是在函数被调用时发生的[绑定],它指向哪里取决于她在哪里被调用！
  ```

---

## 二.解析
---

### 2.1.调用位置（正在执行的函数被调用的位置）
  ```js
  1.分析调用栈(链)，即为到达当前执行位置所调用的所有函数。
  2.调用位置即为当前正在执行的函数的'前一个调用'中
  ```

### 2.2.绑定位置

	  1.默认绑定，严格模式下不可用,不带任何修饰的独立函数调用
	    绑定到undefined或者全局对象取决于 [函数体]是否处于严格模式
	  2.隐式绑定：与调用位置的上下文对象有关，或者说释放被某个对象包含,例：```js
			function foo(){console.log(a);}  var obj={a:2,foo:foo};  obj.foo(); //2 
			//this被绑定到了obj上下文 ```
	   2.1.对于对象属性引用链，只有最靠近当前foo的一层(最后一层)会影响调用位置,如```js
	    var obj2={a:1,obj:obj}; obj2.obj.foo();//2   
	    即obj2不会影响foo的调用位置。 ```
	   2.2.隐式丢失：将obj.foo作为回调函数，或者使用一个别名【var bar=obj.foo; bar();】,会造成隐式丢失
	       此时，被引用的会是foo函数本身，即this绑定到了全局对象或者undefined
	   2.3.有时甚至，回调函数会修改this,比如将它绑定到触发事件的DOM元素上
	   2.4.回调函数中，this的改变常常意想不到，需要通过 固定this来解决这些问题

	  3.显示绑定：call和apply方法
	   3.1.绝大多数函数都可以使用这两个方法，无论JS提供的或者自己定义的
	   3.2.call()第一个参数接受一个对象，this就绑定到这个对象
	       若传入的是一个原始值，则这个原始值会先被“装箱”，即new String(...) or new Boolean(..) 等
	   3.3.若只是这样，那还是无法解决绑定的丢失问题，可使用“硬绑定”，即强制绑定
	     ```js
	     //(1).创建一个包裹函数，传入所有的参数并返回接收到的所有值
	     
	      var bar=function(){ return foo.apply(obj,arguments); }; bar(3);
	     //(2).创建一个可以重复使用的辅助函数
	      function bind(func,obj){ 
	      	return function(){ 
	      		return func.apply(obj,arguments); 
	      	};
	      }
	      var bar=bind(foo,obj);  
	      bar(3);
	     //(3).ES5的内置方法bind()，bind(..)会返回一个硬编码的新函数，它将传入的参数设置为this的上下文
	      var bar=foo.bind(obj);  bar(3);
	      ```
	   3.4.许多第三方库函数和内置函数，都提供一个可选参数--context【上下文】,作用同bind(),如 
	    ```js
	    [1,2,3].forEach(foo,obj); 
	    //调用foo时将this绑定到obj 本质上还是显示绑定，只是内部实现了
	    ```
	  4.new绑定
	   4.1.JavaScript的new与其他语言有很大不同
	   4.2.构造函数是使用new操作符是被调用的普通函数，它们不会属于某个类，也不会实例化一个类
	   4.3.起始并不存在真正意义上的“构造函数”，只能说是“函数的构造调用”
	   4.4.new调用函数时，会自动执行以下操作：
	    ```js
	    //(1).创建一个全新的对象并对其执行“原型链接”
	    //(2).将新对象绑定到函数调用的this.
	    //(3).如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象,例：
	    var bar=new foo(2); console.log(bar.a); //2; 
	    //会构造一个新对象并将它绑定到foo(..)调用中的this上
	    ```
	  5.优先级：默认绑定 < 隐式 < 显式 < new
	   5.1.若硬绑定函数被new调用，则会使用新创建的this替换硬绑定的this
	   5.2.new中使用硬绑定函数，其主要目的是预先设置函数的一些参数，这样在使用new初始化是就以只传入其余的参数
	   5.3.应用到了bind()函数的“部分应用(柯里化【预先设置一些参数】的一种)”技术，即将除第一个以外的参数传给下层的函数。

### 2.3.判断this的一般步骤：

  1.函数是否在new中调用(new绑定)？是则this绑定的是新创建的对象。
   ```js
    var bar = new foo();
   ```
  2.函数是否通过call,apply(显式绑定)或者硬绑定调用?是则this绑定的是指定的对象
   ```js
    var bar = foo.call(obj,arg..);  or var bar = foo.bind(obj,arg..)
   ```
  3.函数是否在某个上下文对象中调用(隐式绑定)？是则this绑定的就是該上下文对象
   ```js
   var bar = obj.foo();
   ```
  4.1、2、3全不适用，则严格模式下绑定到undefined,非严格模式绑定到全局对象(默认绑定)
   ```js
   var bar = foo();
   ```

### 2.4.绑定例外

  1.对于apply,call,bind,传入null（为了展开参数或者柯里化）,作为绑定的上下文对象，则会使用默认绑定
  ```js
  function foo(a,b){cosole.log("a:"+a+",b:"+b);}
  foo.apply(null,[2,3]);//a:2,b:3 【将数组“展开”成参数，同ES6中的foo(...[2,3]);】
  var bar=foo.bind(null，2)；bar(3);//a:2,b:3【柯里化】
  ```
  2.默认绑定是不安全的，因为可能绑定到全局对象，此时，有可能无意间修改了全局对象，造成难以预计的后果
  3.更安全的this:使foo绑定到一个真正的空对象 即创建一个"DMZ"(demilitarized)对象
  ```js
    var DMZ=Object.create(null); var bar = foo.bind(DMZ,2);
  ```

### 2.5.软绑定

  1.硬绑定大大降低了函数的灵活性，使用硬绑定后就无法使用隐式绑定或者显式绑定修改this的能力
  ```js
  if(!Function.prototype.sofeBind){
    Function.prototype.softBind=function(obj){
      var fn=this;
      //捕获所有的curried参数
      var curried=[].slice.call(arguments,1);
      var bound=function(){
         return fn.apply(
           (!this||(this==global))?obj:this,
               curried.concat.apply(curried,arguments)
          );
       };
        bound.prototype=Object.create(fn.prototype);
       return bound;
     }
  }
  ```
  2.软绑定sofebind()可为默认绑定自设定一个值，那么实现硬绑定的效果同时，还可以保留隐式绑定和显式绑定修改 this 的能力
  3.sofebind()首先会检查调用时的 this ,如果 this 绑定到 `global` 或者 `undefined`, 则将指定的 obj 绑定到 this, 否则不修改 this
  

---

## 三.this词法
---

	3.1.ES6中的箭头函数不适用（2.3）中this的四条标准规则，而是根据外层作用域(函数或者全局)来决定this.
	3.2.function foo(){ return (a)=>{console.log(this.a);}; } 则此时箭头函数的this继承自foo(),且該this绑定[无法修改]
	3.3.箭头函数用更常见的词法作用域取代了传统的this机制
	3.4.箭头函数的this绑定同传统的self=this差不多
   
---

TO BE CONTINUE ...
---
　　沉迷 JavaScript 不能自拔,日渐消瘦... 
