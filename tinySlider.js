;(function(w){
	//兼容处理
	var	transName=(function(){
		var transEndEventNames = {
			WebkitTransition : 'webkitTransitionEnd',
			MozTransition    : 'transitionend',
			OTransition      : 'oTransitionEnd otransitionend',
			transition       : 'transitionend'
			}

		var transitionNames = {
			WebkitTransition : ['webkitTransition','-webkit-transition'],
			MozTransition    : ['mozTransition','-moz-transition'],
			OTransition      : ['oTransition','-o-transition'],
			transition       : ['transition','transition']
			}

		var transformNames = {
			WebkitTransition : ['webkitTransform','-webkit-transform'],
			MozTransition    : ['mozTransform','-moz-transform'],
			OTransition      : ['oTransformn','-o-transform'],
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

	var _winWidth = window.innerWidth;
	function fire(){
		var _this = this;
		setTimeout(function(){
			_this.options.ele.style[transName.transform[0]] = 'translate3d(-'+ _winWidth * _this.index +'px, 0px, 0px)';
		},this.options.stay);
	}

	var TinySlider = function(param){
		this.options = {
			list:param.list,
			ele:document.querySelector(param.selector),
			stay:param.stay || 2000,
			duration:param.duration || 300,
			total:param.list.length
		}
		this.index = 1;

		var dom = this.options.ele;
		
		dom.style[transName.transition[0]] = "all "+this.options.duration/1000+"s ease"
		dom.addEventListener(transName.transEndEven,function(){
			this.index  = this.options.total - 1 == this.index ? 0 : ++_flag;
			fire.call(this);
		});

		fire.call(this);
	}

	TinySlider.prototype.destroy = function(){
		this.options.ele.removeEventListener(transName.transEndEven,fire);
	}

	w.TinySlider = TinySlider;
})(window);
