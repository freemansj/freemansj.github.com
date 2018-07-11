---
title: Footprint
date: 2017-08-31 22:13:35
tags: [Diary,Footprint]
categories:
- 随笔
- Diary
---

> ## Beginning

{% blockquote [Kali Antsen] %}
	水净自清, 活水源头 ...
{% endblockquote %}

------
------

> 2017 年 8 月 31 日

　　有逢周四，本想早点出行，却是睡到近11点才醒来，更是到快13点才不甘愿地起床。所有的这些都是为了完成一个任务，那就是“活得如同人应当活的样子 - 进食”。
<!--more-->

　　当然，赖床并非本愿，是有原因的。我在凌晨３：３０后才入睡，至于为什么，我猜是喝了那杯传说中的‘英国红茶’，还有不小心看了令人停不下来的 银魂真人版，这是真的搞笑。好了，言归正传：

　　总结一下这两天：
>* rss源订阅
>* 总算实现了个人博客的相册，中间踩了很多坑，但是还是值得高兴的
>* 使用swiftype 为博客添加了站内搜索功能

------

## ＲＳＳ源订阅:
	在theme._config.yml 简单地打开了开关，配置

```bash
	npm install hexo-generator-feed --save //安装插件
```
	plugins: 
		hexo-generator-feed
		hexo-light-gallery

	subnav:
		rss:/atom.xml //图标，链接

	# Customize feed link 自定义订阅地址
	rss: /atom.xml

	feed:
		type: atom
		path: atom.xml
		limit: 20


------

## 个人相册
使用instagram未果，转而使用 七牛云存储。
### 插件
```bash
	npm install hexo-qiniu-sync --save //切勿添加到plugins:依赖，否则可能报错
```
配置说明如下(hexo._config.yml)：
```bash
	qiniu:
	  offline: false //是否处于离线状态
	  sync: true //同步
	  bucket: freemansj //bucket name
	  secret_file: qiniu_sec/secretkey.json
	  dirPrefix: images //资源存储目录 根据image:folder选项和urlPrefix选项综合考虑
	  urlPrefix: http://ovge5llkw.bkt.clouddn.com/images //外链前缀
	  up_host: http://upload.qiniu.com/images //上传地址
	  local_dir: qiniu //本地目录（Blog主目录而非子目录）
	  update_exist: false //静态文件是否可能修改，并且重上传
	  //以下的folder配置均为静态资源种类的目录名称，一般不用修改
	  image: 
	    folder: '' //必须有string值不然报错
	    extend: 
	  js:
	    folder: js
	  css:
	    folder: css
```
### 引用图片
```bash
	{% qnimg imagename.(jpg|png|...) title:imgtitle alt:altinfo 'class:gallery-pic' extend:?imageView2/0/q/100|imageslim %}
```
	图片路径会根据配置中的外链和dirPrefix信息自动补全
	extend为图片样式接口
	渲染结果：
	<img title="图片标题" class="class1 class2" src="http://ovge5llkw.bkt.clouddn.com/images/demo.png?imageView2/0/q/100|imageslim">

### 相片浏览插件：lightgallery
```bash
	npm install --save hexo-light-gallery
```
在theme.config或hexo.config中配置：
```bash
	lightgallery:
	    # if you don't specify the css or js source, the default cdn will be used.
	    # css: # css source url
	    # js: #js source url
	    # sorry that I can not find any cdn hosting following plugins,
	    # please self-host the plugin js and add url here
	    plugins:
	      lg-thumbnail: /js/lg-thumbnail.min.js
	      lg-zoom: /js/lg-zoom.min.js
	        # lg-autoplay:
	      lg-fullscreen: /js/lg-fullscreen.min.js
	        # lg-pager:
	/*它将自动在每个页面中添加該引入lightgallery插件和它的样式*/
	/*添加zoom插件出错，测试了2个多小时仍没有结果*/
	/*一般，依赖的js文件*/
```

### Lazyload:
如何愉快实现图片的懒加载呢?  try jquery.lazyload.js
插件：
```bash
	npm install jquery_lazyload --save
	/*然而一直不知道文件路径到底如何设置才能正确在页面中引用node_modules中的内容
	故可以考虑，下载之后 拷贝一份放置在 source/js 中
	或者 直接使用cdn :

	<script src="https://cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
	<script src="https://cdn.bootcss.com/jquery_lazyload/1.9.1/jquery.lazyload.min.js"></script>
	*/
```
在文章中使用头部使用html的页面元素如div标签总会各种出错，link和script则不会
代码实现：
```bash
	<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/2016champion.jpg?imageView2/0/q/100|imageslim">
	/*data-original为图片真实地址 此属性名是可自设置的，具体百度*/
	<script src="https://cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
	<script src="https://cdn.bootcss.com/jquery_lazyload/1.9.1/jquery.lazyload.min.js"></script>

	<script type="text/javascript">
	jQuery(function($) {
	    $(".lazy").lazyload({
	    	effect: "fadeIn", //加载效果
	    	failure_limit : 10, //加载容错
	      	load: function(elem,l,o){ //加载成功回调 三个参数似乎并用不上
	      		$this=$(this); //this指向为当前dom元素 <img>
	      		$this.addClass('gallery-pic');
	      		$this.parent('a').attr("href",$this.attr("data-original"));
	      	}
	    });
	    $("img.lazy").parent().unwrap('p');
	 });
	</script>
```
	懒加载的图片被包装在 <p><a><a/></p>中:
		由于lightgallery可用需要 a的href属性，故设置为img的data-original属性值
		用unwrap方法去掉<a><img></a>的包装层p,否则会导致样式问题
	为了使用$().lazyload() 需使用免冲突的写法 即jQuery(function($){});
	.gallery-pic 类的 样式使用了 固定宽高度自适应 图片的排列较为可控

## 站内搜索

### 注册 swiftype 
试用14天，到期后是否不可用此时仍未知，据说会退为免费用户，但仍可使用
install to website: 代码在 `layout/_partial/after-footer.ejs`
```bash
	<% if (theme.search_box){ %>
    <script type="text/javascript">
      window.onload = function(){
        document.getElementById("search").onclick = function(){
            console.log("search")
            search();
        }
      }
      function search(){
      	/*--------逻辑添加此处----------*/
          (function(w,d,t,u,n,s,e){w['SwiftypeObject']=n;w[n]=w[n]||function(){
              (w[n].q=w[n].q||[]).push(arguments);};s=d.createElement(t);
              e=d.getElementsByTagName(t)[0];s.async=1;s.src=u;e.parentNode.insertBefore(s,e);
          })(window,document,'script','//s.swiftypecdn.com/install/v2/st.js','_st');
          _st('install','XrQ3mzPiXyhmigRqyayY','2.0.0');
        /*---------------------------*/
      }
    </script>
	<%}%>
```
### 配置:
	# 是否显示边栏中的搜索框（仅样式，未添加搜索功能）
	# Search Box in left column
	search_box: true //结合上面的代码 if(theme.search_box){} 便知一二
------

------
------

　　最后的最后，今天圆满结束，明天需更加努力工作...生活仍在继续...听keep on放松一下

## —— END ———


