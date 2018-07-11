---
title: Footprint
tags: [Footprint,Diary]
categories:
  - 随笔
  - Diary
date: 2017-09-07 23:59:16
---

> ## Beginning

{% blockquote [Blues Lee] %}
	在竭尽全力之前,无需太过在意结果,一切应当顺其自然 ...
{% endblockquote %}

------
------

> 2017 年 9 月 7 日

　　拖了快接近一周，终于再次静下心来书写新一篇博客...
<!--more-->
　　这周的关键词为‘移动’、‘单’、‘志愿者’、‘劳累的身体与舒畅的心’... 总结起来,受益匪浅。
　　接下来，主要的工作，Re-Music的进展：
>* 不错的开头，搜索功能基本实现
>* 搜索和播放列表的样式美化
>* 获取特定用户的“我的最爱”列表
>* 歌词的获取与同步-（测试）

------

## 搜索功能的实现

　　1.重新划分了模块，将点击歌曲链接后的处理逻辑放到了service中
　　2.对用户"最爱列表"的每首歌曲的创建时间进行处理
```bash
//inside playlist.component.ts
public loadData(searchText:string=""){
	return this.playlistService.getFavorite().subscribe(
		res=>{
			this.playList = res.slice();
			this.playList.forEach(function(value,index,arr){//<--Here
				arr[index].createtime=(new Date(arr[index].createtime*1000)).toLocaleString();//<--
			});
		...
```
　　

## 列表的美化

　　1.自定义了管道 longTextFilterPipe, 放置于共享模块 share.module.ts
```bash
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'longTextFilter'
})
export class LongTextFilterPipe implements PipeTransform {
	transform(value: string, limit: number): any {
		if(value.length>limit) {
			return value.slice(0,limit)+"...";
		} else {
			return value;
		}
	}
}
```
　　2.自定义Pipe需要在某个module的declarations中声明，且只能包含与一个module，故最好的方案就是将其集成到共享模块中，而后需要用到該管道的module中import即可使用{express|longTextFilter}
```bash
//inside share.module.ts
@NgModule({
	imports:[
		CommonModule
	],
	declarations:[
		LongTextFilterPipe
	],
	exports:[
		LongTextFilterPipe
	]
})
```
　　3.列表元素-歌曲链接-改为button,使用btn-link样式

## 歌词的获取并同步功能
### * * * * *---待集成---* * * * *

## FOCUS ON
　　Chrome中的audio标签src属性使用音乐外链无法获取源，而Edge中是可行的。这也许需要重新考虑是否使用html5原生的audio标签。现今先使用Edge测试，后期将改用通用的方案。
　　TODO:
- [ ] 集成歌词同步功能
- [ ] 歌词滚动效果
- [ ] Angular指令

------
------

　　唯有时刻不停的努力，才能获取机遇的青睐...Keep fighting!!!

## —— END ———
