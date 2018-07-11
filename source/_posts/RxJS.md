---
title: Rx (Reactive Extensions)
tags:
  - RxJS
categories:
  - Rx
  - Angular
date: 2017-09-10 15:41:56
---

>{% blockquote [Chris Smart] %}
	拖着疲惫的身心熬夜苦干无异于饮鸠止渴...
{% endblockquote %}


------
## 何为响应式编程
------

　　它是一种面向 变化传播(the Propagation of Change) 和 数据流(Data-Flow) 的编程范式


### 变化传播
	不同于命令式编程,当数据/状态发生改变时,它会根据最新的数据源计算新的结果, 如：
		原本view1经过渲染后展现为result1, 现今将view1更新为view2,则引擎将会重新渲染view2,从而得到result2.
<!--more-->
### 面向数据流编程
	将被封装成数据流对象的数据或事件，再对該流对象 进行 诸如map,filter,fork等一些列处理后，而后响应整个数据流的回调的过程。
	例：
```
	ObservableObj.map(...).subscribe(callback);
```

------
## Microsoft  Rx 系列
------
　　根据Reactive Programming范式，结合观察者模式，函数式编程，迭代器模式开发的工具库集合；它们提供了一系列接口规范以供开发者处理异步数据流.

### Observable:
	1.数据流之源，将异步的数据或事件封装成Observable对象后才能进行后续操作
	通过Operator可方便地对Obs对象进行一系列处理，如映射，过滤等，生成新的Observable对象，并沿着新的Obs数据流通道 继续流向下游
	2.当上游的Observable数据流发生改变时，它将切断原先的的下游通道，使用新的通道
	3.一个Observable对象可封装多个异步数据流，并可以保证异步请求返回的顺序，防止响应的错乱
	4.创建Observable对象：
```
	Rx.Observable.fromEvent(DOMElem,'eventName')
			.debounceTime(1000)//延迟响应
			.switchMap(event=>{})//保证请求返回顺序
			.subscribe(callback);
```
　or:
```
	new Observable(observer=>{});
```
	Observable作为 被观察者，需要通过subscribe()方法订阅，从而捕获Obs发送的事件，而 subscribe()中的callback方法 将接收observer调用next()方法后发来的数据，对捕获的事件进行处理操作；
	将所有对状态量的操作封装在各Operator函数中，体现了函数式编程的思想。
	Observable将响应的数据response传递给observer之前，可以先调用Operator对response进行处理。

------
### RxJS: 
#### 与Promise的对比
	1. RxJS在功能上是Promise的超集，能够完美替代Promise
	2. RxJS允许以数据流的形式，响应多个异步事件，这是Promise所不具备的
#### "冷模式"下的Observable
	在被订阅(subscribe)前，不会发送数据流
	"热模式"的Observable则在Obs对象创建时被开始发送
#### "Connectable模式"
```
let obs=new Observable(observer=>{...; observer.next(); ...}).publish();
//publish可将Obs转换为connectable模式
//当调用 obs.connect() 时才开始发送
```

#### Operators of RxJS
	创建操作符：
	- Rx.Observable.create(observer=>{factory()})
	变换操作符:
	- obs.map(res=>{}).subscribe(data=>{});
	  先对响应的数据res进行映射操作，再传给observer
	过滤操作符：
	- obs.filter(res=>{return booleanExp;})..... 返回值为false的数据将不会继续向下流
	组合操作符：
	- obs=Rx.Observable.forkJoin(obs1,obs2);
	  将两个独立的Obs对象合并为一个新的Obs对象，并且在两个Obs对象的数据都抵达后才会开始进行合并处理;
	- obs=firstObs.concatMap(firstData=>{
		return Rx.Observable.create(observer=>{
			  factory(firstData,secondData=>{})
			});
	  })...
	  后一次请求需要依赖前一次请求的结果，借用concatMap操作符，将first数据流紧接在second数据流之后
	工具操作符：
	- timeout(),delay(),debounceTime(),distinctUntilChanged()...

#### Angular with RxJS
>例：改造HTTP服务(《揭秘Angular2》 p265~266)
```
 	@Injectable()
 	export class MyHttpService{
 		constructor(private http:Http){}

 		get(url:string,reqOpts?: RequestOptions){
 			return this.request(url,Object.assign({
 				method:'get'
 			},reqOpts));
 		}
 		//... post delete update
 		request(url:string,reqOpts:RequestOptions){
 			this.showLoading(); //开启加载动画
 			return this.http.request(url,new RequestOptions(reqOpts))
 				.map(res=>res.json())
 				.do(this.hideLoading.bind(this)) //关闭加载动画
 				.map(this.preprocessRes.bind(this)) //对返回数据进行统一的预处理
 				.catch(this.handleErr.bind(this)); //对请求错误进行统一处理
 		}
 		private preprocessRes(res){
 			//return ....
 		}
 	}
```
------
## END