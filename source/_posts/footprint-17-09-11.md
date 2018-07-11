---
title: Footprint
tags: [Diary,Footprint]
categories:
- 随笔
- Diary
- Angular
date: 2017-09-11 22:41:46
---

> ## Beginning

{% blockquote [Mark Tovin] %}
	独立的思想使你避免成为行尸走肉,别轻易地让他人影响你的想法 ...
{% endblockquote %}

------
------

> 2017 年 9 月 11 日

　　新的一周，杭城已然褪去了夏天的炎热，你很难忍受多变的气温与空气的湿度。时而酷热难耐，时而又冷风淅淅...
<!--more-->
	
　　近日填坑一览:
>* 使用cloudflare使个人博客支持https
>* Angular RxJS的理解(见"Rx (Reactive Extensions)")
>* 将网易云音乐的播放栏的效果集成到了Re-Music中[当然后期需继续解耦]

------
## Use Cloudflare
------

### 注册Cloudflare账号
	//first...second......... then 注册成功

### 添加两条A记录
	本人使用的域名是通过腾讯云的租的，故前往腾讯云控制台添加
	points-to:192.30.252.153
	ponits-to:192.30.252.154

### Cloudflare Nameservers
	可在个人实例>DNS分栏>Cloudflare Nameservers
	查看cloudflare提供给我们的Nameservers:
	我的是：
	jade.ns.cloudflare.com
	skip.ns.cloudflare.com
	
	而后
	前往个人的域名服务商控制台，域名管理，DNS修改 => 
	将域名服务器改为cloudflare提供的Nameserver
	保存，可在whois.net上查看你的域名信息 可见是否正确修改

### create page rules
	cloudflare >Page Rules > create page rule
	http://*example.com/*
	匹配该规则的将会使用cloudflare服务，而 ↑ 的规则可以满足几乎所有要求

### Last step

	wait a few minutes...
	你可以在控制台上 overview>个人网站的status显示为Active (background green)

	你还可以设置强制使用https, 详细配置都在 cloudflare > Crypto中

------
## Music-Bar
------

### 功能分类
　　jQuery功能的原生实现代码置于MusicBarService中：[参考 You Might Not Need jQuery( http://youmightnotneedjquery.com/ )]
```
@Injectable()
export class MusicBarService {
	constructor() {}
	public addEvent(obj,type,handle){ //添加 on 监听
		try{// Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
			obj.addEventListener(type,handle,false);
		}catch(e){
			try{  // IE8.0及其以下版本
				obj.attachEvent('on' + type,handle);
			}catch(e){  // 早期浏览器
				obj['on' + type] = handle;
			}
		}
	}
	public removeClass(el,className){
		if (el.classList)
  			el.classList.remove(className);
		else
  			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}
	public addClass(el,className){
		if (el.classList)
  			el.classList.add(className);
		else
			el.className += ' ' + className;
	}
}
```
　　HTMLDOM的操作置于app.component.ts[这显然需要改进，当前先凑合]
```
@Component({...})
export class AppComponent {
	//...
	public t:any;//定时器
	public lock:boolean=false;
	ngOnInit(){
		this.slideToggle();
		this.lockToggle();
	}
	public slideToggle(){
		let that=this;
		this.musicBarSv.addEvent(document.getElementById("musicbar"),"mouseenter",mouseEnter);
		function mouseEnter(){
			if(that.t){
				clearTimeout(that.t);
			}
			let el=document.querySelectorAll(".slide-toggle");
			Array.prototype.forEach.call(el,function(v,i){
				(<HTMLElement>el[i]).style.bottom="0px";
			});
		}
		//... mouseLeave类似
	}
/*需要注意的有两点：
1.typescript中querySeletor返回的的为Element类型而非HTMLElement,故通过<HTMLElement>el转化；
2.querySeletorAll()选取多个，返回NodeList<Element>,调用Array的原型方法forEach,分别处理
3.注意this的指向，当执行mouseEnter等回调函数时，上下文已经改变，this不在指向组件本身。故先将this保存-> let that=this;
*/
	public lockToggle(){
		//... 需注意点 类似
	}
}
```

### 静态资源
　　先在angular-cli.json中声明所有静态文件(夹)

	"assets": [
		"assets",
		"favicon.ico",
		"jsondata-store"
	],
　　而后就可以通过相对路径使用静态资源

	//app.component.css #d1{}
	background: url('../assets/12.svg');

### Animation and Transition
　Animate关键帧
```
//declare:
@keyframes RotateAnimate {
	0% {
		transform: rotate(0deg);
	}
	50% {
		transform: rotate(180deg);
	}
	100% {
		transform: rotate(360deg);
	}
	//or from{....} to{....}
}
//using:
div{
	animation: RotateAnimate 5s linear infinite; //linear平缓过渡
	-webkit-animation:RotateAnimate 5s linear infinite;//chrome safari兼容
}
```
　Transition:

	//改变值时的过渡动画
	.slide-toggle{
		bottom: -60px;
		transition:bottom 0.5s;//or transition:all 0.5s;
	}

------

　　愉快的开始,希望这周都能保存再接再厉... 
　　月光之下无限连：咚咚１３咚３２３+ [1 and 3] or loop ．．．
　　稍显遗憾的是 近一个月"清心"的坚持 没能持续下去... Just do it , Never look back!!!

------
------
	
## —— END ———

