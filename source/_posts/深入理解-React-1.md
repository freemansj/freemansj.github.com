---
title: "深入理解 React - 1"
tags:
  - React
  - JavaScript
  - DOM
categories:
  - 深入理解React系列
date: 2018-02-26 17:41:56
---

>{% blockquote [Yangming Wang] %}
	知行合一
{% endblockquote %}

<!--more -->

---
## 先谈 DOM的更新
---

前端的优化中，效果明显的便是减少DOM的操作，而DOM的操作为何开销很大？

> 浏览器首先根据 CSS 规则查找匹配的节点，这个过程会缓存很多元信息，例如它维护着一个对应 DOM 节点的 `id` 映射表。
> 然后，根据样式计算节点布局，这里又会缓存位置和屏幕定位信息，以及其他很多的元信息，浏览器会尽量避免重新计算布局，所以这些数据都会被缓存。
>
> 计算展现样式的过程会吃掉很多CPU周期。我们可以先减轻浏览器渲染引擎的负担，然后提升UI的响应速度，在组件视图里，使用对渲染引擎依赖更小的技术。

`核心问题`:

```
DOM 修改导致的页面 repaint(重绘)、reflow(重排)！ reflow是用户阻塞的操作，同时，如果频繁重排，CPU 使用率也会猛涨！
为了确保执行结果的准确性，所有的修改操作是按顺序同步执行的。大部分浏览器都不会在JavaScript的执行过程中更新DOM。相应的，这些浏览器将对对 DOM的操作放进一个队列，并在JavaScript脚本执行完毕以后按顺序一次执行完毕。也就是说，在JavaScript执行的过程，直到发生重新排版，用户一直被阻塞。
一般的浏览器中（不含IE），repaint的速度远快于reflow，所以避免reflow更重要。

导致repaint、reflow的操作：

    * DOM元素的添加、修改（内容）、删除( Reflow + Repaint)

    * 仅修改DOM元素的字体颜色（只有Repaint，因为不需要调整布局）

    * 应用新的样式或者修改任何影响元素外观的属性

    * Resize浏览器窗口、滚动页面

    * 读取元素的某些属性（offset[Left| Top| Height| Width]、scroll[Top| Left| Width| Height]、client[Top| Left| Width| Height]、getComputedStyle()...) 
```

解决问题的关键是：减少因DOM操作，引起的reflow: (`批量` 与 `缓存` + `隐藏节点特性`)

```javascript
//1 . 在DOM外，执行尽量多的变更操作
var fragment = document.createDocumentFragment();
for (var i=0; i < items.length; i++){
    var item = document.createElement("li");
    item.appendChild(document.createTextNode("Option " + i);
    fragment.appendChild(item);
}
list.appendChild(fragment);

//2 . 操作DOM前，先把DOM节点删除或隐藏，因为隐藏的节点不会触发重排
list.style.display = "none";  
for (var i=0; i < items.length; i++){  
    var item = document.createElement("li");  
    item.appendChild(document.createTextNode("Option " + i);  
    list.appendChild(item);  
}  
list.style.display = "";  

//3 . 一次性，修改样式属性
.newStyle {  
    background-color: blue;  
    color: red;  
    font-size: 12em;  
}  
element.className = "newStyle";

//4 . 使用缓存，缓存临时节点
var myDiv = document.getElementById("myDiv");  
myDiv.style.left = myDiv.offsetLeft + myDiv.offsetWidth + "px";  

```



**无论如何优化，通过 “发起DOM更新” 的方法更新视图的方法总会产生一次次的reflow与repaint，因此是否可以换个思路，即不再修改原本的DOM，而是直接将它替换！也可以说是 “仅一次的DOM更新“。**

这个思路来源于PHP:

```
在 PHP 中，每当有数据改变时，只需要跳到一个由 PHP 全新渲染的新页面即可。
从开发者的角度来看的话，这种方式开发应用是非常简单的，因为它不需要担心变更，且界面上用户数据改变时所有内容都是同步的。
只要有数据变更，就重新渲染整个页面,简单粗暴。
但是 它 非常慢!
```

JS 若直接采用此种方法，当任何内容改变时，都**重新构建**整个 DOM，然后用新 DOM 取代旧 DOM ，那么在某些情况下可能会发生一些问题: 比如它会失去当前聚焦的元素和光标，以及文本选择和页面滚动位置，即`页面的当前状态`。**DOM 节点是包含状态的, 且还包含隐藏、无法触及的状态**。

若想在新DOM中还原旧DOM中的所有状态，难以实现或几乎无法实现。因此还得换个思路来保留原有状态。

有效可行的方案便是：`复用未改变的节点，替换改变过的节点 `

而此时，问题的关键点就转换到如何识别出DOM的变动节点

---
## Diff算法
---

在React中，构建UI界面的思路是由当前状态决定界面。前后两个状态就对应两套界面，然后由React来比较两个界面的区别，这就需要对DOM树进行Diff算法分析。即:

* 给定任意两棵树，找到最少的转换步骤。

但是 `标准的的Diff算法` 复杂度需要O(n^3)，这显然无法满足性能要求。要达到每次界面都可以整体刷新界面的目的，势必需要对算法进行优化。

这看上去非常有难度，然而Facebook工程师却做到了，他们结合Web界面的特点做出了几个简单的假设，使得Diff算法复杂度直接降低到O(n) 【diff算法详见:[不可思议的 React Diff]( https://zhuanlan.zhihu.com/p/20346379) 】

* 两个相同组件产生类似的DOM结构，不同的组件产生不同的DOM结构；
* 对于同一层次的一组子节点，它们可以通过唯一的id进行区分。
* Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计

Diff算法总的来说就是完成下述操作:

```
* 对比新旧DOM树，当节点不同，则直接删去该节点及其子节点，用新的节点代替。这应用了第1、3个假设，不同的组件一般会产生不一样的DOM结构，与其浪费时间去比较它们基本上不会等价的DOM结构，还不如完全创建一个新的组件加上去。
* React 逐层进行节点比较，即两棵树只会对同一层次的节点进行比较（同一父节点的所有子节点为一层）

```

这样，一次DOM树遍历便可完成比较，即O(n)。

然而，又如何比较两个节点是否相同或不同呢 ? 这又是一个问题.

通过元素名称？名称最可能相同

节点属性？似乎可行，但是需要是id属性这样独一无二的才有通用的可能。考虑表单的情况，输入一般与id挂钩，但是当使用ajax提交表单时...显然此时我们一般不给input等属性设置id.因此，这个还是不通用。

引入一个专门的属性是最好的方法之一（可能还有其他方案），React引入了key属性，用于辅助Diff算法（**这也是为什么在 React 中使用列表时会要求给子元素设置 key 属性的原因**）

简单来说当子节点们 key属性相同时，无需进行删除创建操作，可进行节点移动操作或不操作。


---
## VirtualDOM
---

DOM节点拥有大量的属性，对他的操作（特别是查询和创建）将耗费大量资源。 React 只在 diff 算法中用到了 DOM 节点，而且只用到了标签名称和部分属性。
如果用更**轻量级**的 JS 对象来代替复杂的 DOM 节点，然后把对 DOM 的 diff 操作转移到 JS 对象，就可以避免大量对 DOM 的查询操作。这种方式称为 Virtual DOM 。

其过程如下: [详见 - React是怎样炼成的](https://segmentfault.com/a/1190000013365426?utm_source=channel-hottest#articleHeader8)

1. 维护一个使用 JS 对象表示的 Virtual DOM，与真实 DOM 一一对应
2. 对前后两个 Virtual DOM 做 diff ，生成**变更**（Mutation）
3. 把变更应用于真实 DOM，生成最新的真实 DOM

![img](https://sfault-image.b0.upaiyun.com/304/368/3043688841-5a9175107a171_articlex)





---

参考:

深入浅出React  (四) http://www.infoq.com/cn/articles/react-dom-diff/

React是怎样练成的 https://segmentfault.com/a/1190000013365426?utm_source=channel-hottest

---



