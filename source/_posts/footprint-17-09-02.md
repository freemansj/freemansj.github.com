---
title: Footprint
date: 2017-09-02 23:13:12
tags: [Diary,Footprint]
categories:
- 随笔
- Diary
---

> ## Beginning

{% blockquote [Mamen Tristan] %}
	人总喜欢活在昨天 ...
{% endblockquote %}

------
------

> 2017 年 9 月 2 日

　　周末的我, 没有如同以往赖床到正午, 这也许是今天最大的闪光点！然而, 这也许就意味着，今天一事无成...
<!--more-->

　　好吧, 终归还是有学一点的(内心自我安慰道),荀子曾经曰过：虽为硅步，积也成机。废话不多说,转入正题：

　　总结一下这两天：
>* 解决lg-thumbnail和lg-fullscreen插件不可用的问题
>* 解决youyan用户评论内容不可见问题
>* 关于hexo的博客的各种插件，各主题中配置会有所不同，此时查看在相应插件的源代码
>* Angular 模板 数据绑定 与 内置指令

------
## Angular 模板
------
### 关于模板
　　其上下文环境为该组件实例本身[一个标签，一个实例]，即模板中一般只能访问該组件的属性（模板局部变量#，事件绑定参数$event则可以来自组件之外）

------

### 数据绑定
　　分单向数据流（事件绑定，属性绑定），双向数据绑定 两类

#### 模板表达式：

　　类似js表达式，但需避免以下用法：

	带有new 
	赋值表达式  ( [target]="some=exp" ) 或 自增自减
	带有“;”或“,”的链式表达式 （多条表达式 exp1;exp2;exp3）
	不支持位运算|和&

	简言之：应使用简洁高效的语句，应只改变目标属性的值（不在其中改变其他逻辑），适时使用缓存，幂等性优先
	　　部分操作符被赋予了新的意义，如"|"为管道操作符，"？."则为安全导航操作 如 a?.prop 则允许a不具prop属性

------

### 属性绑定
	DOM元素：直接使用 [target]="exp" or  target="expstr"
	HTML标签的特性（如colspan等非DOM属性）：使用[attr.target]="exp"  
	CSS类： 既属于DOM属性又属于HTML标签特性，故两种方式均可，但：
		[class]="exp" 将覆盖 > class="className"  exp将重写改模版元素的全部class
		[class.classname]="boolfunc()"  通过返回值来决定添加或者移除該 classname
	style样式绑定：[style.style-property]="exp" 
		可同时带上样式单位：[style.width.%]="isHalf?:100:50" ; => (isHalf==true)then width=100%
		属性样式可使用 background-color形式 或驼峰式： backgroundColor;

#### 属性绑定与插值： 
　　插值终将转换为属性绑定，两者都会对绑定内容进行安全检测 看是否有脚本之类的，有则会进行过滤

------

### 事件绑定
	表达式：
		支持带";" or ","的链式表达式
		仅支持 “=”赋值 其他“+= -=”等操作不支持 自增自减也不支持
		其他与属性绑定同
	优先级：自定义指令>元素事件（click等）
	$event事件对象：包含触发的事件的相关信息，根据目标事件的类型，事件对象的形态也会不同：
		原生DOM元素事件触发：$event为 包含target和target.value属性的DOM事件对象;(click) or on-click
		自定义事件触发：
		    需借助子组件EventEmitter实例对象 设为@output()routeEM = new EventEmitter<paramType>();
		    父组件通过绑定該输出属性(routeEM)以自定义事件，(routeEM)="fixMethod($event)"
		    子组件中可通过routeEM.emit(payload)触发該事件，payload可为任何值. 
		    父组件的处理方法fixMethod通过$event访问payload数据

------

### 双向数据绑定：(多用于表单控件如< input>)
```bash
	①[value]="cur.num"  (input)="cur.num=$event.target.value"
		↓↓
	②[ngModel]="cur.num"  (ngModelChange)="cur.num=$event"   【此处$event形式不同于①】
		↓↓
	③[(ngModel)]="cur.num"  或前缀写法 bindon-ngModel="cur.num"
```
其中方法②较③灵活，他可以完成不同的任务：
```html
	[ngModel]="cur.num" (ngModelChange)="methodAddNum($event)"
```

------

### 内置指令
>　　Angular中有一系列内置指令，熟练运用可减少很多额外的工作

NgClass: 
```html
	[ngClass]="setClassFunc()" 
	setClassFunc(){
		let classes={red:this.red,font14:this.font14} 
	}
	//根据this.red this.font14的值确定是否添加該class
```


NgStyle:   
```
	[ngStyle]="setStyleFunc()" //=>形如 let styles={'color':this.red?'red':'blue'}
```

NgIf: 
```
	*ngIf="exp"  // if exp==false  該元素会被移除
```

NgSwitch:
```html
		<span [ngSwitch]="exp">
			<span *ngSwitchCase=" 'val1' "> fasdfa </span>
			<span *ngSwitchDefault>fasdfds </span>
		</span>
```
NgFor: 
```bash
	<div *ngFor="let con of cons; let i=index; trackBy:trackByFunc"> {{con.id}} </div>

	trackByFunc(index:number,con:Contact){
		return con.id
	};
	/*trackBy为追踪函数，該函数检测对应的属性 [此处con.id] 是否改变，改变则更新該元素，否则不变
	index 为当前con的索引*/
```

------

------
------

　　尽管增长甚少，却也在积累当中，也算是重回正轨了，接下来的工作是完成Ｒｅ－Ｍｕｓｉｃ项目...never look back...

## —— END ———


