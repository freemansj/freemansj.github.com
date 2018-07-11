---
title: Gallery
date: 2017-08-30 00:15:45
tags: [Photos,Footprint]
catagories:
- Photos
---

>##  Hope you enjoy my gallery



--------
--------

<link rel="stylesheet" type="text/css" href="/css/gallery.css">

{% qnimg 42714955_p0.jpg 'class:gallery-pic' extend:?imageView2/0/q/100|imageslim %}

{% qnimg 42754259_p0.jpg 'class:gallery-pic' extend:?imageView2/0/q/100|imageslim %}




{% qnimg 60732916_p0.jpg  'class:gallery-pic'   %}

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/61184765_p0.jpg">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/49167437_p0.jpg?imageView2/0/q/100|imageslim">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/44745753_p0.jpg?imageView2/0/q/100|imageslim">



<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/35050025884_62356b6fee_k.jpg?imageView2/0/q/100|imageslim">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/35501728050_e619646ebc_k.jpg?imageView2/0/q/100|imageslim">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/35501729410_caa331abe7_k.jpg?imageView2/0/q/100|imageslim">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/1459162984220.jpg?imageMogr2/auto-orient/thumbnail/1024x768/gravity/NorthWest/crop/1024x768/blur/1x0/quality/100|imageslim">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/Endor_1366x768.jpg?imageMogr2/auto-orient/thumbnail/1024x768/gravity/NorthWest/crop/1024x768/blur/1x0/quality/100|imageslim">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/new3.png?imageView2/0/q/100|imageslim">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/qinshiMY_03.jpg?imageView2/0/q/100|imageslim">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/qinshiMY_04.jpg?imageView2/0/q/100|imageslim">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/UW-01.jpg?imageView2/0/q/100|imageslim">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/UW-03.jpg?imageView2/0/q/100|imageslim">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/UW-04.jpg?imageView2/0/q/100|imageslim">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/tokyoE03.jpg?imageView2/0/q/100|imageslim">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/hupucavas03.jpeg?imageView2/0/q/100|imageslim">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/2016champion.jpg?imageView2/0/q/100|imageslim">


<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/hupucavas04.jpeg?imageView2/0/q/100|imageslim">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/hupucavas06.jpeg?imageView2/0/q/100|imageslim">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/hupucavas01.png?imageView2/0/q/100|imageslim">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/hupucavas05.png?imageView2/0/q/100|imageslim">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/wallpaper001.jpg?imageView2/0/q/100|imageslim">

<img class="lazy" data-original="http://ovge5llkw.bkt.clouddn.com/images/wallpaper002.png?imageView2/0/q/100|imageslim">


------
------
## —— END ——

<script type="text/javascript" src="https://cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
<script src="https://cdn.bootcss.com/jquery_lazyload/1.9.1/jquery.lazyload.min.js"></script>

<script type="text/javascript">

jQuery(function($) {
    $(".lazy").lazyload({
    	effect: "fadeIn",
    	failure_limit : 10,
      	load: function(elem,l,o){
      		$(this).addClass('gallery-pic');
      		$this=$(this);
      		$this.parent('a').attr("href",$this.attr("data-original"));
      	}
    });

    $("img.lazy").parent().unwrap('p');
 });

</script>