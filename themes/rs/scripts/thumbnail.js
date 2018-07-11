/**
* Thumbnail Helper
* @description Get the thumbnail url from a post
* @example
*     <%- thumbnail(post) %>
*/
hexo.extend.helper.register('thumbnail', function (post) {
    var url = post.thumbnail || '';
    var randomUrl=[
    	"wallpaper001.jpg?imageView2/0/q/100|imageslim",
    	"wallpaper002.png?imageView2/0/q/100|imageslim",
    	"Endor_1366x768.jpg?imageMogr2/auto-orient/thumbnail/1024x768/gravity/NorthWest/crop/1024x768/blur/1x0/quality/100|imageslim",
    	"44745753_p0.jpg?imageView2/0/q/100|imageslim",
    	"42754259_p0.jpg?imageView2/0/q/100|imageslim",
    	"42754259_p0.jpg?imageView2/0/q/100|imageslim"
    	]
    if (!url) {
        var imgPattern = /\<img\s.*?\s?src\s*=\s*['|"]?([^\s'"]+).*?\>/ig;
        var result = imgPattern.exec(post.content);
        if (result && result.length > 1) {
            url = result[1];
        }else{
        	url = "http://ovge5llkw.bkt.clouddn.com/images/"+randomUrl[Math.floor(Math.random()*randomUrl.length)]
        }
    }
    return url;
});
