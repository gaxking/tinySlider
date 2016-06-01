# tinySlider
一个极轻量的轮播插件
自制了一个轮播插件，紧紧含有一些日常需要的功能。比iSlider少了5kb

## 用法
new TinySlider({
		selector:"#isldier",
		list:[]
});

### 可选参数
isCustom:是否自定义  
selector:插件选择字符串
list: 图片URL或者DOM
stay:param.stay || 2000 停留事件，默认2秒
duration:param.duration || 300 动画时间，默认0.3秒
addDot:param.addDot || true 是否加导航点
isCustom:param.isCustom || false 是否自定义DOM
