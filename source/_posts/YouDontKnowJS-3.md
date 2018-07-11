---
title: "You Don't Know JS 上卷(Ⅲ) 归纳"
date: 2018-03-18 21:31:17
tags:
  - JavaScript
categories:
  - 深入理解JavaScript
  - YouDon'tKnowJS
---

>{% blockquote [No name] %}
	待你准备万全时, 机会往往已经悄然离去 ...

{% endblockquote %}

<!--more-->

---

## 一.对象
---

### 1.1.类型：

 六种主要原始类型 string,number,boolean,null,undefined,object

	typeof(null);//object 
	这是JavaScript的一个bug,并不是说null是一种对象类型，null本身是基本类型
	原因是 不同的对象在底层都被表示为二进制，前三位均为0的化会被判定为object类型，null二进制表示为全0，故执行typeof返回‘object’

### 1.2.内置对象（JS的对象子类型）
  内置对象 : String,Number,Boolean,Object,Function,Array，Date,RegExp,Error 

	  1.在JS中，它们只是一些内置函数，可当成构造函数，构造一个对应子类型的新对象【可通过typeof(**);返回'function'】
	  2.不可能直接对字面量进行访问属性、方法的操作，var s="China"; s.length;//可行，只是因为引擎将字面量"China"自动转换成了String对象
	  3.null和undefined只有字面量形式，无构造形式，Date则只有构造形式，无文字形式
	  4.Oject,Array,Function,RegExp无论使用文字形式还是构造形式，都是对象，不是字面量
	  5.Error一般在抛出异常是自动创建，可以显式创建但基本不用

### 1.3.内容：(属性)

	  1.对象容器中一般只存有属性的名，它指向对象的真正存储位置（如同指针或者说引用）
	  2.属性访问：‘.’只能接受满足标准命名规范的属性，而‘[..]’可使用字符串访问，只需属于UTF-8/Unicode字符集
	  3.对象中的属性名永远都是字符串，包括数字，也会先被转换为字符串
	  4.ES6中新增了可计算属性名： var prefix="foo"; var obj={[prefix+"bar"]:"hello"}; obj["foobar"];//hello
	  5.数组的属性名为数字 0,1,2... 如：(3 in [1,2,3])；//false 因为[1,2,3]只有属性0,1,2

### 1.4.属性与方法

	  1.无论访问的返回值是什么类型，都是属性访问
	  2.属性访问返回一个函数，那么这个函数等同于普通函数（除了可能的this隐式绑定），不是特属于該对象的所谓“方法”.
	  3.foo和obj.foo的区别可能仅仅是obj.foo中的this可能被隐式绑定到对象obj,JS中没有“属性的方法”之说。
	  4.ES6开始支持直接在对象中声明一个函数表达式，然而尽管如此該函数也不会“属于”这个对象

### 1.5.对象的复制

	1.浅复制:ES6定义了Object.assign(tagobj,srcobj1,...);
	     它会遍历一个或多个源对象的所有可枚举(enumerable)的自有键(owned key)，将他们复制(使用“=”)到目标对象，而后返回目标对象
	     由于使用的是=操作符赋值，故源对象的一些特性如writable不会被复制到tagobj
	     复制的只有值，引用还是原来的引用
	2.深复制:仍然有很多问题待解决，因为对于深复制来说，除了复制值，还会复制引用，引用的值，这可能造成死循环
	     对于JSON安全的对象来说，var newObj=JSON.parse(JSON.stringify(someObj));
	     【JSON安全：可被序列化为一个JSON字符串，并且可根据这个字符串解析出一个结构和值完全一样的对象】

### 1.6.属性描述符

  ES5以后JS开始支持直接检查属性特性的方法，具备了属性描述符

	  1.查看：Object.getOwnPropertyDescriptor(obj,"attr");
	  2.添加或者修改属性：Object.defineProperty(obj,"attr",{value:..,writable:..,configurable:..,enumerable:..});
	    - writable:可写性
	    - configurable:可配置性，一旦设置为false，不可更改（设置是单向的），其他属性也不可更改，甚至不能删除
	                  [例外：writable可从true改为false,反之不成立]
	    - enumerable:可枚举性：可出现在对象属性的遍历中（for..in）
	  3.delete不同于在C++中可以释放内存，它在JS中只是一个删除对象属性的操作
	     删除可删除的属性，若该属性是对某个对象/函数的最后一个引用，则删除之后，該对象/函数可被垃圾回收

### 1.7.不变性

	  1.对象常量：结合writable:false和configurable:false即可
	  2.禁止扩展：Object.preventExtensions(obj);//禁止对象添加新属性，并保留已有属性
	  3.密封：Object.seal(obj);它会在现有对象上调用(2.)的方法并将configurable设为false
	    -密封后，不能添加新属性，也不能重新配置或者删除现有属性，可以修改属性的值(若writable:true)
	  4.冻结：Object.freeze(obj);在线有对象上调用Object.seal()并将writable设为false;


### 1.8.getter与setter
	  1.例：
	  ```js
	  var obj6={
		   get a(){
		      return this._a_;
		   },
		   set a(val){
		      this._a_=val;
		   }
	    };
	  ```
	  2.当[[get]]一个属性时，会先访问现对象obj的属性，找不到会到obj的原型链中去找，再找不到返回undefined
	  3.[[put]]需要结合当前obj的属性描述符考虑

### 1.9.存在性

	  1.in : 会再对象的原型链中找，("a" in obj6)返回true
	  2.Object.prototype.hasOwnProperty(..) 仅在当前对象中寻找
	    对象需要连接到Object.prototype,大多数对象都满足，除了空对象即Object.create(null);创建的
	    空对象obj可通过显式绑定Object.prototype.hasOwnProperty.call(obj,"a");将hasOwnProperty方法到obj上
	  3.枚举：
	   -1.obj.propertyIsEnumerable("attr");检查给定的属性名是否直接存在于对象中(即不包含原型链),且满足enumberbal
	   -2.Object.keys(..);返回一个包含所有可枚举属性的数组（对象中）
	   -3.Object.getOwnPropertyNames(..);返回一个包含所有属性的数组，无论是否可枚举（对象中）

### 1.10.遍历

	  1.for..in.. 遍历对象的属性，还需根据属性取得对应的值;
	  2.ArrayObj.forEach(function(){...});对每一个数组元素调用一次回调函数,并忽略所有返回值;
	  3.ArrayObj.every(带返回值的回调函数);运行直到回调函数返回false【无返回值默认返回false】
	  4.ArrayObj.some(带返回值的回调函数);运行直到回调函数返回true;【无返回值，则返回fasle,即相当于遍历一遍数组】
	  5.for..of.. 可直接遍历数组的值 for(var i of arr){..}
	   -1.工作流程：(使用@@iterator手动遍历数组)
	   ```js
		var arr=["A","B"];
		var it=arr[Symbol.iterator]();
		//arr[Symbol.iterator]取得数组对象的"Symbol.iterator"(即@@iterator)属性的值：一个返回迭代器的函数
		console.log(it.next());//{value:A,done:false}
		console.log(it.next());//{value:B,done:false}
		console.log(it.next());//{value:undefined,done:true} 
	   ```
	   -2.数组有内置的@@iterator,因此for..of可直接应用在数组上
	   -3.ES6中可用Symbol.iterator获取对象的@@iterator内部属性，@@iterator本身并非一个迭代器对象而是一个“返回迭代器对象的函数”！
	   -4.普通的非内置得对象，没有内置@@iterator,故无法自动完成for..of 需要自定义：
	   ```js
		var obj={
		 a:1,
		 b:2,
		 [Symbol.iterator]:function(){
		    var self=this; //对象本身
		    var attrs=Object.keys(self);//对象所有属性
		    var i=0;//遍历下标
		    return {
		      next:function(){
		        return{
		          value:self[attrs[i++]],
			      done:(i>attrs.length)
			    }
	  	      }
		    };
		 }
		};
	   ```


>关于 混合对象 "类"
> [在JavaScript中模拟类是得不偿失的，虽然能解决当前的问题，然而可能埋下更多隐患]

---
## 二.原型
---

### 2.0.链

	函数对象才有prototype属性，实例对象.prototype为undefined
	对象的__proto__如同一个指针，指向它的构造函数的prototype对象，它串起了原型链
	Object.getPrototypeOf(myobj)===myobj.__proto__;

### 2.1.[[Prototype]]

几乎所有对象在创建之时会被赋予一个[[Prototype]]的非空对象，它会关联到另一个对象

	1.var obj=Object.create(anotherobj);//创建一个新的对象，并将其[[Prototype]]关联到anotherobj
	2.对象通过[[Prototype]]的关联形成一条原型链，其顶端为Object.prototype,即所有普通对象的[[Prototype]]链最终都会指向Object.prototype
	3.属性访问设置和屏蔽：
	   -1.若在当前对象找不到某属性，则沿着它的原型链向上找，直到顶端，没有则返回undefined
	   -2.属性设置：obj.foo="bar";
	     -2.1.若foo同时存在于当前obj中和原型链中，则obj的foo属性会屏蔽原型链上层所有的foo,将当前obj.foo设置为"bar";
	     -2.2.若foo仅存在于原型链上层，则：
	         1.若該属性可写(writable:true),则直接在obj中添加一个foo的新属性并赋值"bar"
	         2.若该属性只读(writable:false),则无法修改该属性且无法在obj上创建屏蔽属性，在严格模式下会抛出错误，非严格则忽略该语句
	         3.若foo是一个setter，那么一定会调用这个setter,即不会为obj创建新属性
	     -2.3.若无论何种情况都想要为obj的foo属性(即使不存在)设置值，那么Object.defineProperty(..)是个很好的办法
	   -3.使用屏蔽方法得不偿失，应尽量避免使用

### 2.2.委托

对象中没有某个属性，却可能能通过原型链获取该属性，这其实是一种委托，委托给原型链上别的对象帮忙实现

	  1.JavaScript没有与其他语言类似的继承，即通过类复制行为，不管是创建对象或者定义子类
	  2.JavaScript的“继承”，可以理解为一种“差异继承”或者“原型继承”，或者本不该有继承的说法，就只是委托
	  3.即，不关心通用的共有的属性，定义的是差异的属性，因为共有的属性可通过原型链委托实现
	  4.JavaScript中并没有复制机制，不可能创建一个“类”的多个实例，只能是创建多个对象并将它们的[[Prototype]]关联到同一个对象
	     没有从"类"中复制任何的行为到对象，只是让两个对象相互关联，而这样也能达成同样的效果(通过委托)

### 2.3.".constructor"和".prototype"
	  0.JavaScript没有某个函数就是“构造函数”，var a=new Foo("a"); Foo()本身是普通函数，然而被new调用后就成了一个“构造函数”
	   -1.确切的说，是new的调用使得某个函数调用变成了“构造函数调用”
	   -2.new会创建一个新的对象a（Foo内不返回对象时）,并将a.prototype关联到Foo.prototype对象
	   
	  1.a.constructor属性并非一定指向这个对象的构造函数，它是不可信的指向，因为可以将它修改以指向任意对象
	   -1.a.constructor===Foo;//true,实际上，a可能并没有.constructor属性，只是委托给了Foo.prototype,而Foo.prototype.constructor默认指向了Foo
	      当然Foo.prototype也不一定有constructor属性，此时会继续向上层委托
	      当然，没有可以自己通过Object.defineProperty(.,.,{})添加一个,注意此属性正常是不可枚举的enumberable:false
	   -2.总之constructor的指向并无法令人信服地证明什么.
	  2.var a=new Foo(..); Object.getPrototypeOf(a)===Foo.prototype;//true 
	   -1.prototype是公有且不可枚举的属性
	   -2.通过new Foo(..)，新对象内部的[[Prototype]]关联到了Foo.prototype

### 2.4.将对象关联的方法
 对于function Bar(..){..}  与 function Foo(..){..}

	  1.为Bar创建一个新的prototype对象，关联到Foo.prototype,抛弃原始的关联对象(声明时Bar会关联到一个默认的对象)
	     Bar.prototype=Object.create(Foo.prototype); 
	     有问题的方式:
	     -1.Bar.prototype=Foo.prototype;
	        它会直接让Bar.prototype引用Foo.prototype对象，当对Bar.prototype的属性进行修改时会直接修改Foo.prototype本身
	     -2.Bar.prorotype= new Foo(..); 
	        基本可以满足需求，然而若是Foo有副作用(写日志、修改状态、给this添加数据属性..)，则会影响到Bar()的“后代”
	  2.ES6开始，可使用Object.setPrototypeOf(Bar.prototype,Foo.prototype);//可直接修改Bar.prototype

### 2.5.关联判断

  1.判断在a的整条原型链中是否有指向Foo.prototype的对象(a的原型链中是否出现过Foo.prototype)
  ```js
   -1.a instanceof Foo;//true  instanceof操作符左操作数是一个普通对象，右操作数是一个函数
   -2.Foo.prototype.isPrototypeOf(a);
   -3.a.__proto__===Foo.prototype;//绝大多数浏览器支持
       .__proto__和常用的内置函数(toString(),isPrototypeOf()等)一样，存在于Object.prototype中(而不在a中)，不可枚举
   -4.Object.getPrototypeOf(a)===Foo.prototype;
   -5.b.isPrototypeOf(c); b是否出现在c的原型链中
  ```

[部分实现Object.create() :]
  ```js
  if(!Object.create){
     Object.create=function(o){
       function F(){}
       F.prototype=o;
       return new F();
     }
  }
  ```

---

## 三.委托("对象关联"的编写风格)
---
** "对象关联" 的编写风格** => `仅关注对象之间的关联联系 `

### 3.1.委托理论

	  1.数据成员应保存在委托者中而不是委托目标上
	  2.委托行为中，应尽量避免原型链的不同层级上使用相同的命名(不同于类模式的尽量同名以至于可重写，多态)
	  3.充分利用this的隐式和显式绑定规则
	  4.委托行为意味着，当某些对象找不到属性或者方法引用时会把这个请求委托给另一个对象 
	  5.在API接口的设计中，委托应尽量在内部实现而不是暴露出去。
	  6.互相委托是禁止的，即A关联到B时，试图将B再关联到A就会出错，不然可能会引发死循环

### 3.2.“类”与“委托”思维模型的比较

	  1.类设计模式：(“原型”)面向对象风格
	   -1.主干是各原型对象组成的原型链，顶端为Object
	   -2.枝叶是各“构造函数”，它们的prototype属性都指向一个原型对象 
		例 对于Foo(){}  对应 Foo.prototype对象
	   -3.行为应被添加到prototype对象中 
		例： Foo.prototype.identify=function(){}
	   -4.每创建一个新对象，都应该将其prototype属性关联到一个上层[[prototype]]对象，以建立原型链
		使用类似 Bar.prototype=Object.create(Foo.prototype)或者Object.setPrototypeOf(Bar.prototype,Foo.prototype)的方法创建新对象
	   -5.通过new进行构造函数调用，创建实例
	  2.委托设计模式：对象关联风格
	   -1.仅关注并致力于对象之间的联系的创建，行为委托认为对象间是兄弟关系，互相委托
	   -2.主干是各原型对象组成的原型链，顶端是Object.prototype对象
	       行为集成在对象中，成为对象的属性。
	   -3.建立关联：Bar=Object.create(Foo);【让Bar委托Foo】
	   -4.向委托链上添加对象：var b1=Object.create(Bar);//亦是建立委托关联，本身是对象，无须实例化
	   -5.遵从委托理论进行设计

---

TO BE CONTINUE ...
---
　　沉迷 JavaScript 不能自拔,日渐消瘦... 
