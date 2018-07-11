---
title: Configuring-Nginx
tags:
  - Configure
  - Nginx
categories:
  - Web Server
  - Configuration
date: 2017-11-11 21:50:46
---

>{% blockquote [Zhou Aimin] %}
	事业的达成
	必要的是正确有意义的目标
    其次得确保其可行性
    最后还得未雨绸缪
{% endblockquote %}

------

## —— BEGIN ——

------

## Nginx 的优化措施

### 三类事件

　　一个基本的 web 服务器需要处理的事件的大概可分为三类：网络事件，信号处理，定时器。

<!--more-->

#### 网络事件

　　异步非阻塞处理模型: 多进程，单线程,全局监控的任务队列(类似epoll)

	1. 分 master 进程和 worker 进程，master监管，每个worker处理一个事件，多个workder间不互相影响
	2. 避免了无谓的上下文切换（一般在多线程的切换过程），避免了cpu资源的竞争(进程数不宜过多，一般为核数)

#### 信号处理

　　特殊的信号会有特别的意义，信号会中断掉当前程序的运行，在改变状态后，继续执行. 如果是系统调用，则可能会导致系统调用的失败，需要重入.

	1. 对于 nginx 来说，如果 nginx 正在等待事件（epoll_wait）时，如果程序收到信号，在信号处理函数处理完后, epoll_wait会返回错误，然后程序可再次进入 epoll_wait 调用。

#### 定时器事件

　　由于 epoll_wait 等函数在调用的时候是可以设置一个超时时间的，所以 nginx 借助这个超时时间来实现定时器.

    1. nginx 里面的定时器事件是放在一颗维护定时器的红黑树里面，每次在进入 epoll_wait 前，先从该红黑树里面拿到所有定时器事件的最小时间，在计算出 epoll_wait 的超时时间后进入epoll_wait。

    2. 当没有事件产生，也没有中断信号时，epoll_wait会超时，也就是说，定时器事件到了。这时，nginx会检查所有的超时事件，将他们的状态设置为超时，然后再去处理网络事件。

    3. 当我们写nginx代码时，在处理网络事件的回调函数时，通常做的第一个事情就是判断超时，然后再去处理网络事件。

------

## 指令上下文

　　nginx.conf 中的配置信息，根据其逻辑上的意义，对它们进行了分类，也就是分成了多个作用域，或者称之为配置指令上下文。不同的作用域含有一个或者多个配置项。

### 当前nginx支持的指令上下文

	1. main:	 
	    nginx在运行时与具体业务功能（比如 http 服务或者 email 服务代理）无关的一些参数比如工作进程数，运行的身份等。
	2. http:	
	    与提供 http 服务相关的一些配置参数。例如：是否使用 keepalive 啊，是否使用 gzip 进行压缩等。
	3. server:	 
	    http 服务上支持若干虚拟主机。每个虚拟主机一个对应的 server 配置项，配置项里面包含该虚拟主机相关的配置。在提供 mail 服务的代理时，也可以建立若干 server.每个 server 通过监听的地址来区分。
	4. location:
	    http服务中，某些特定的URL对应的一系列配置项。
	5. mail:	 
	    实现email相关的 SMTP/IMAP/POP3 代理时，共享的一些配置项（因为可能实现多个代理，工作在多个监听地址上）。

指令上下文, 可能有包含的情况出现，例如: 通常 http 上下文和 mail 上下文一定是出现在 main 上下文里的。
在一个上下文里，可能包含另外一种类型的上下文多次，例如：如果 http 服务，支持了多个虚拟主机，那么在 http 上下文里，就会出现多个 server 上下文。

我们来看一个示例配置：(来源网络-侵删)
```
user  nobody;
worker_processes  1;
error_log  logs/error.log  info;

events {
    worker_connections  1024;
}

http {
    server {
        listen          80;
        server_name     www.linuxidc.com;
        access_log      logs/linuxidc.access.log main;
        location / {
            index index.html;
            root  /var/www/linuxidc.com/htdocs;
        }
    }
    server {
        listen          80;
        server_name     www.renginx.com;
        access_log      logs/renginx.access.log main;
        location / {
            index index.html;
            root  /var/www/renginx.com/htdocs;
        }
    }
}

mail {
    auth_http  127.0.0.1:80/auth.php;
    pop3_capabilities  "TOP"  "USER";
    imap_capabilities  "IMAP4rev1"  "UIDPLUS";

    server {
        listen     110;
        protocol   pop3;
        proxy      on;
    }
    server {
        listen      25;
        protocol    smtp;
        proxy       on;
        smtp_auth   login plain;
        xclient     off;
    }
}
```

在这个配置中，上面提到个五种配置指令上下文都存在。

存在于main上下文中的配置指令如下:

    -user     -worker_processes    -error_log
    -events   -http                -mail

存在于http上下文中的指令如下:

    -server
    
存在于mail上下文中的指令如下：

    -server
    -auth_http
    -imap_capabilities
    
存在于server上下文中的配置指令如下：

    -listen    -server_name	    -access_log	    -location
    -protocol  -proxy           -smtp_auth      -xclient
    
存在于location上下文中的指令如下：

    -index
    -root

------

## 服务器静态动态配置

### Nginx反向代理集群配置

配置 location 为 tomcat 集群
① upstream可以为每个设备设置状态值，这些状态值的含义分别如下 :

    down ：表示单前的 server 暂时不参与负载.
    weight ：默认为1.weight越大，负载的权重就越大。
    max_fails ：允许请求失败的次数默认为1.当超过最大次数时，返回 proxy_next_upstream 模块定义的错误.
    fail_timeout : max_fails 次失败后，暂停的时间。
    backup ： 其它所有的非 backup 机器 down 或者忙的时候，请求 backup 机器。所以这台机器压力会最轻。    
```
upstream tomcats{
      server 127.0.0.1:9001 down;
      server 127.0.0.1:9002 backup;
      server 127.0.0.1:9003 weight=2;
      server 127.0.0.1:9004 max_fails=2 fail_timeout=60s;   
}
```

② 分配策略 :

1. none（轮询）
upstream 按照轮询（默认）方式进行负载，每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器 down 掉，能自动剔除。虽然这种方式简便、成本低廉。但缺点是：可靠性低和负载分配不均衡。

2. weight（权重）
指定轮询几率，weight 和访问比率成正比，用于后端服务器性能不均的情况。例如

    server 192.168.61.22 weight = 6; # 60% 请求
    server 192.168.61.23 weight = 4; # 40% 请求

3. ip_hash（访问ip）
每个请求按访问 ip 的 hash 结果分配，这样每个访客固定访问一个后端服务器，可以解决 session 的问题。
配置只需要在 upstream 中加入 ip_hash;即可。
```
upstream tomcats {
      ip_hash;
      server 127.0.0.1:9001;
      server 127.0.0.1:9002;
}
```
4. fair（第三方）
按后端服务器的响应时间来分配请求，响应时间短的优先分配。与 weight 分配策略类似。
```
upstream tomcats {
      server 127.0.0.1:9001;
      server 127.0.0.1:9002;
      fair;
}
```
5. url_hash（第三方）
和IP哈希类似，只不过针对请求的 url 进行 hash（基于缓存的 server，页面静态化）。


③配置实例：
```js
upstream tomcats {
    server 127.0.0.1:9001;
    server 127.0.0.1:9002;
}

server {
    listen 80;
    server_name  www.****.com;
    location / {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Scheme $scheme;
        proxy_pass http://tomcats;
    }
}
```

------

### Nginx 静态资源分离部署

修改 nginx.conf 文件，用于 nginx 处理静态资源。
 
主要配置如下(在 server 配置中加入 location 配置即可)：
```js
server {
    listen       80;
    server_name  123.45.123.45;
    charset utf-8;
    index index.html index.htm index.jsp index.do;
    root /opt/nginx-master/html/resources;

    #配置 Nginx 动静分离，定义的静态页面直接从Nginx发布目录读取。
    location ~ .*\.(html|htm|gif|jpg|jpeg|bmp|png|ico|txt|js|css)$ 
    {
        root /opt/nginx-master/html/resources;
        #expires定义用户浏览器缓存的时间为7天，如果静态页面不常更新，可以设置更长，这样可以节省带宽和缓解服务器的压力
        expires      7d; 
    } 
}
```
### 本地动静分离反向代理配置

所有jsp的页面均交由 tomcat 或 resin 处理
```js
location ~ .(jsp|jspx|do)?$ {
	proxy_set_header Host $host;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_pass http://127.0.0.1:8080;
}
```

所有静态文件由 nginx 直接读取不经过 tomcat 或 resin
```js
location ~ .*.(htm|html|gif|jpg|jpeg|png|bmp|swf|ioc|rar|zip|txt|flv|mid|doc|ppt|pdf|xls|mp3|wma)${
	expires 15d;
}

location ~ .*.(js|css)?${ 
	expires 1h;
}
```

------

## —— END ——
 
