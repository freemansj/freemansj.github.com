---
title: 'JS必知必会:类型与语法'
tags:
  - JavaScript
categories:
  - JavaScript基础
  - YouDon'tKnowJS
date: 2017-09-24 23:08:44
---

>{% blockquote [Georg·Wilhelm·Friedrich·Hegel] %}
	我们可以断言,
	缺乏激情,
	任何伟大的事业都不可能完成

{% endblockquote %}


------

# 一.Boolean真值假值：
假值和所有可强转为假值的只有：

	* false
	* null，undefined，NaN
	* +0，-0
	* ""(空字符串)

其他的都为真值！！

<!--more-->

------

# 二.字位层面的强转："~"
	"~"操作相当于取操作数的补码：~x=-(x+1)
	它首先将值转换为32位数字,再执行“非”操作( 按位取反码 )
	可知，仅在对-1进行~操作时返回0，这使得我们可以隐藏一些方法底层判断实现的细节：
	如indexOf( )  当 匹配不到相应的子串时 我们经常使用 a.indexOf("str")!=-1来判断是否成功匹配
	然而，这暴露了底层的实现，即，返回值为-1时 匹配失败
	现在，我们可使用 ~a.indexOf("str")  来实现，返回-1，结果为0,即为false, 以此隐藏底层的实现细节。

------

# 三.宽松相等与严格相等："=="  and  "===":
## 1.误区:'=='只需比较值，而'==='比较值和类型

	* 正确的理解应该是，"=="允许进行强制类型转化后比较
	* 两者都需要检测值的类型
	* 当类型相同时处理方式相同
	* 不同的是，在值的类型不同时，两者的处理方式，一个进行强转，一个则不允许

## 2.'=='的强转规则：

	1.当 字符串与数字进行 比较时, 先将字符串转为数字:
	x==y  =>  ToNumber(x) == y

	2.当 布尔值与数字进行 比较时, 先将布尔值转化为数字:
	x=false, y=0   x==y  =>  ToNumber(x)==y   =>   0==y  =>true
	x=false, y="0"  x==y   =>   0==ToNumber(y)   =>  0==0  => true

	3.当 对象( 对象,数组,函数 ) 与 非对象 比较时, 先调用 unwraped（拆封） 方法 toPrimitive ( 如 toString() valueOf() )
	x=["1"], y=true  x==y  =>  ToPrimitive(x)==y =>  "1" == true  => "1"==1 =>  1==1  =>true

	4.null and undefined: null与undefined可相互隐式强转
	null == undefined // true
	null == false // false
	null == 0 //false
	null == "" //false
	if (a==null) 相当于 if (a===null || a===undefined) 

## 3.极端情况:
```
[]==![]  //true  ![] -> false  =>  [] ==false  => "" ==false  => Number("")==false => 0==0
```
　假值与与真值比较由于隐式强转的存在，可能返回true
```
Boolean([])->true  but  []==false  =>true
"0" is true value but "0"==false  =>true

0=="\n"  //true
""=[null]  /true  [null].toString() => ""
2==[2]  //true
```
　同类型对象间的比较，不涉及类型转化,直接比较的是对象的引用:
```
[]==[]  {}=={}  [[]]==[[]]  [0]==[0]  [1]==[1]   //false!!!
```

## 4.经验之谈：

	* 若两边的值中有true or  false ，千万别使用 "=="
	* 若两边的值中有[ ] 、"" 或 0 ，尽量不要使用 "=="

------

# 四.抽象关系比较 "<"、"<=  "、">"

>需注意的是隐式的强制类型转化

1.先对两边分别调用ToPrimitive方法，若拆封的结果出现非字符串值，则通过ToNumber方法，显式转化为数值进行比较
```
var a=[42],b=["43"]   a<b; //true
```
2.若双方都为字符串，则按照字母顺序来进行比较:
```
var a=["42"],  b=["043"]  a<b ;//false  "4">"0"
var a=[4,2] ,  b=[0,4,3]  a<b  =>  "4,2" < "0,4,3"  => "4" < "0"  =>false

特：var a={c:42} , b={c:43}  a<b  =>false  //两者都转化为 "[obeject Object]"
```
3."<=" 的含义为"不大于"：
```
a<=b  将被转化为 !(a>b) => !(b<a) 实现
因此出现了 ：a={c:42}  b={c:43}
a<b =>false   a==b => false   but: a<=b =>true
因为 b<a ->false  !(b<a) ->true
```

------

# 五.上下文规则：代码块与标签
## 1.标签
```
{
    //declare or function or expression
}
```
　代码块可被正确解析,同c++,这很好理解
　然而
```
{
    foo:funcName()
}
```
　也可以正确解析,是因为JavaScript中的标签语法,foo如同一个标记一般，对应funcName()
```
{
    foo:for(..;..;..){
            for(..;..;..){
                if(flag)
                    continue foo;//跳到下一轮foo的循环
                if(flag2)
                    break foo;//跳出foo的循环
            }
        }
    //....
}
```
　标签不允许为字符串,{"a":"value"} //error

	注:JSON数据的属性名则必须使用双引号,JSON是JS语法的一个子集,但本身并非合法的JS语法,
	故不能直接当作代码执行(会被当成带"非法标签"的语句块),需要通过JSON-P转化为合法的JS语法
	* JSON-P将JSON数据封装为函数调用,如foo({"a":"value"};


## 2.代码块
```
[]+{} //"[object Obejct]"
{}+[] //0
两者的结果不同主要原因在于语句解析的不同:
{} + [] 被解析为 {}代码块 和 +[]  =>   do {} then do +[] 结果为 0
```
## 3.对象解构
```
function getD(){return {a:1,b:"str"}}
var {b,a}=getD();  //a->1  b->"str"
//{b,a}是 {b:b,a:a}的简写版本

function foo({a,b}){
    console.log(a,b); // 可直接访问参数对象的属性
}
foo({b:"hello",a:"world"}) //hello world
```

------

# 六.活用switch....case
```
switch(a){
    case 1: ...;break;
    case 2: ...;break;
    default: ...
}
```
　a与case n 之间是严格相等关系,即 a===n时才会执行相应代码,这似乎不够灵活,然而可以换个角度思考：
```
var b="2";
swtich(true){
    case b==1: ...;break;
    case b==2: ...;break;
    //...
}
```
　此时,true 与 "b==2"之间仍是严格相等比较 , 然而却灵活地使用了宽松相等"==",允许了强转

------

END
------
　　沉迷 JavaScript 不能自拔,日渐消瘦...