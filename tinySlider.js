;(function(w){
	//兼容处理
	var	transName=(function(){
		var transEndEventNames = {
			WebkitTransition : 'webkitTransitionEnd',
			transition       : 'transitionend'
			}

		var transitionNames = {
			WebkitTransition : ['webkitTransition','-webkit-transition'],
			transition       : ['transition','transition']
			}

		var transformNames = {
			WebkitTransition : ['webkitTransform','-webkit-transform'],
			transition       : ['transform','transform']
			}


		var style = document.body.style;
		for(var name in transEndEventNames){
			if(typeof style[name] === "string"){
				return {
					transEndEven:transEndEventNames[name],
					transition:transitionNames[name],
					transform:transformNames[name],
				}
			}
		}
	})();

	//公共变量
	function autoFire(clientWidth){
		var _this = this;
		this.timer = setTimeout(function(){
			_this.index  = _this.options.total - 1 == _this.index ? 0 : ++_this.index;
			addDotFn.call(_this);
			fire(_this.options.dom, clientWidth * _this.index);
		},this.options.stay);
	}

	//处理点点点
	function addDotFn(){
		if(this.options.addDot){
			this.options.dots = Array.prototype.slice.call(this.options.dots);
			for(x in this.options.dots){
				this.options.dots[x].style.backgroundColor = '#ddd';
			}
			this.options.dots[this.index].style.backgroundColor = '#0ae';
		}
	}

	function fire(ele,x){
		ele.style[transName.transform[0]] = 'translate3d('+ (0-x) +'px, 0px, 0px)';
	}

	var TinySlider = function(param){
		var _this = this,
		options = this.options = {
			list:param.list,
			ele:document.querySelector(param.selector),
			stay:param.stay || 2000,
			duration:param.duration || 300,
			total:param.list.length,
			addDot:param.addDot || true,
			isCustom:param.isCustom || false,
			dom:null,	//els下的ui
			dots:null   //是否加入点
		}

		//私有变量
		var	moveX = 0,
			moveY = 0,
			startX = 0,
			startY = 0,
			clientX = 0,
			clientWidth = options.ele.clientWidth,
			html = '<ul style="height:100%;width:'+clientWidth*options.total+'px">';

		//组装html
		if(options.isCustom){
			for(var i = 0; i < options.total; i++){
				html += '<li style="display:inline-block;width:'+clientWidth+'px;height:100%">'+options.list[i]+'</li>';
			}
		}else{
			for(var i = 0; i < options.total; i++){
				html += '<li style="display:inline-block;width:'+clientWidth+'px;height:100%"><img style="width:100%;height:100%" src="'+options.list[i]+'"></li>';
			}
		}
		html += '</ul>';
		//组装dot
		if(options.addDot){
			html += '<div style="text-align:center;'+transName.transform[1]+':translateY(-100%);padding:0.1rem 0">';
			for(var i = 0; i < options.total; i++){
				html += '<span style="display:inline-block;padding:.07rem 0 0 .07rem;border-radius:50%;background-color:#ddd;margin:0 .025rem" index="0"></span>';
			}
			html += '</div>';
		}

		options.ele.innerHTML = html;
		var dom = options.dom = options.ele.children[0],s;
		options.dots = options.ele.children[1].children;

		
		this.index = 0;
		dom.style[transName.transition[0]] = "all "+options.duration/1000+"s ease";
		addDotFn.call(this);

		//未来让distroy保持关联，将方法写在this中
		this.Events = {};
		this.Events['touchstart'] = function(e){
			s = (new Date()).getTime();

			startX = e.targetTouches[0].clientX;
			startY = e.targetTouches[0].clientY;
			clearTimeout(_this.timer);
		};
		this.Events['touchmove'] = function(e){
			dom.style[transName.transition[0]] = null;
			clearTimeout(_this.timer);

			//移动x的距离
			moveX = startX - e.targetTouches[0].clientX;
			
			//移动每次移动y的距离
			moveY = e.targetTouches[0].clientY - startY;
			startY = e.targetTouches[0].clientY;

			window.scroll(0,document.body.scrollTop - moveY);

			//滑动总距离
			clientX =  _this.index * clientWidth + moveX;
			if(clientX<0){
				clientX = clientX/2;
			}else if(clientX > (options.total-1) * clientWidth){
				clientX = clientX - (clientX - clientWidth * (options.total-1))/2;
			}

			fire(dom, clientX);
			e.preventDefault();
		}
		this.Events[transName.transEndEven] = function(){
			autoFire.call(_this,clientWidth);
		}

		this.Events['touchend'] = function(e){
			dom.style[transName.transition[0]] = "all "+options.duration/1000+"s ease";
			var b = clientX - _this.index * clientWidth;
			if(b<0){
				if((new Date()).getTime()-s>200){
					_this.index = b < clientWidth/2?_this.index-1:_this.index;
				}else{
					_this.index--;
				}
				_this.index = _this.index < 0 ? 0 : _this.index;
			}else{
				if((new Date()).getTime()-s>200){
					_this.index = b > clientWidth/2?_this.index+1:_this.index;
				}else{
					_this.index++;
				}

				_this.index = options.total - 1 < _this.index ? options.total-1 : _this.index;
			}

			clientX = _this.index*clientWidth;
			if(options.addDot)options.dots[_this.index].style.backgroundColor = '#0ae';

			addDotFn.call(_this);
			fire(dom, clientX);
		}

		//触摸事件
		dom.addEventListener('touchstart',this.Events['touchstart']);
		dom.addEventListener('touchmove',this.Events['touchmove']);
		dom.addEventListener('touchend',this.Events['touchend']);

		//动画结束事件
		dom.addEventListener(transName.transEndEven,this.Events[transName.transEndEven]);
		autoFire.call(this,clientWidth);
	}

	//销毁插件
	TinySlider.prototype.destroy = function(){
		this.options.dom.removeEventListener('touchstart',this.Events['touchstart']);
		this.options.dom.removeEventListener('touchmove',this.Events['touchmove']);
		this.options.dom.removeEventListener('touchend',this.Events['touchend']);
		this.options.dom.removeEventListener(transName.transEndEven,this.Events[transName.transEndEven]);
	}

	//暴露接口
	w.TinySlider = TinySlider;
})(window);
