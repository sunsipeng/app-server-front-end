define(function(require, exports, module) {
	var moment = require('./moment.js');
	if(!String.format) {
		String.format = function(format) {
			var args = Array.prototype.slice.call(arguments, 1);
			return format.replace(/{(\d+)}/g, function(match, number) {
				return typeof args[number] != 'undefined' ?
					args[number] :
					match;
			});
		};
	}
	module.exports = {
		//日期和时间的格式化
		timeFormatYYYYMMDD : function() {
			return moment().format('LL');
		},
		timeFormatHHmmss: function() {
			return moment().format('HH:mm:ss');
		},
		weekTime: function(){
			return moment().format('dddd');
		},
		/**
	     * 从当前url取参数
	     *
	     * @param {string} 参数名
	     * @return {string} 参数值
	     */
	    getQueryString: function (name) {
	        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	        var r = window.location.search.substr(1).match(reg);
	        if (r != null) {
	            return unescape(r[2]);
	        }
	        return null;
	    },
	    /**
	     * 加载图片资源 
	     * @param {Object} imgUrl 图片地址
	     * @param {Object} cb 成功回调
	     * @param {Object} fcb 失败回调
	     */
	    loadImg: function(imgUrl,cb,fcb){
	    	var $img = new Image();  
		    $img.src = imgUrl;  
		    $img.onload = cb;  
		    $img.onerror = fcb;
	    },
	    mo: moment
	}
})