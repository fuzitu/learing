(function(global){
	var init;
	var arr=[],
		push=arr.push,
		slice=arr.slice,
		document=global.document;

	var Timo=function(selector,context){
		return new Timo.fn.init(selector,context)
	};
	Timo.fn=Timo.prototype={
		constructor:Timo,
		length:0,
		toArray:function(){
			return slice.call(this);
		},
		get:function(index){
			if(index==null){
				return slice.call(this);
			}else{
				return this[index>=0? index: this.length+index];
			}
		},
		eq:function(index){
			return Timo(this.get(index));
		},
		first:function(){
			return Timo(this.get(0));
		},
		last:function(){
			return Timo(this.get(-1));
		}
	};

	init=Timo.fn.init=function(selector,context){
		// selector为null、undefined
		if(!selector){
			return this;
		}
		// 字符串
		if(Timo.isString(selector)){
			if(Timo.isHTML(selector)){
				push.apply(this,Timo.parseHTMl(selector));
			}else{
				push.apply(this, select(selector,context))
			}
		}// 单个dom元素
		else if(Timo.isDom(selector)){
			this[0]=selector;
			this.length=1;
		}	// dom元素伪数组 、数组
		else if(Timo.isLikeArr(selector)){
			push.apply(this,selector);
		}else if(typeof selector ==='function'){
			if(Timo.isready){
				selector();
			}else{
				document.addEventListener("DOMContentLoaded",function(){
					Timo.isready=true;
					selector();
				})
			}
		}	
	}
	init.prototype=Timo.fn;

	Timo.extend=Timo.fn.extend=function(source){
		for(var k in source){
			this[k]=source[k]
		}
	};
	//工具类  进行数据类型的判断
	Timo.extend({
		isString:function(obj){
			return typeof obj==='string';
		},
		isHTML:function(obj){//charAt为字符串的方法 所以需要给obj+‘’转化为字符串
			return (obj+'').charAt(0)==='<'&&
			 (obj+'').charAt((obj+'').length-1)==='>'&&
			 (obj+'').length >=3
		},
		isDom:function(obj){
			return 'nodeType' in obj && obj.nodeType===1;
		},
		isLikeArr:function(obj){
			var length=!!obj&&'length' in obj&&obj.length;
			var type=Timo.type(obj);//存储obj的类型
			// if(type==='function'||type==='window'){
				if(type==='function'||Timo.isWindow(obj)){
				return false;
			} 
			return type ==='array'||length===0||
			typeof length ==='number' && length>0&&(length-1) in obj
		},
		isWindow:function(obj){//双非不改变原来的boolean值
			return !!obj&&obj.window===obj;
		}
	});
	Timo.extend({
		isready:false,
		type:function(obj){
			if(obj==null){
				return obj+'';
			}
				return typeof obj==="object"?
				Object.prototype.toString.call(obj).slice(8,-1).toLowerCase():
				typeof obj;
			},
		//将html字符串转换为html标签
		parseHTMl:function(html){
			var ret=[];
			var div=document.createElement('div');
			div.innerHTML=html;
			for(var i=0;i<div.childNodes.length;i++){
				if(div.childNodes[i].nodeType===1){
					ret.push(div.childNodes[i]);
				}
			}
			return ret;
		}
		
	})
	//选择器引擎
	var select=function(selector,context){
		var ret=[];
		if(context){
			if(context.nodeType===1){
				return Array.prototype.slice.call(context.querySelectorAll(selector));
			}
			else if(context instanceof Array||
				(typeof context==='object'&&'length' in context)){
				for(var i=0;i<context.length;i++){
					var doms=context[i].querySelectorAll(selector);
					for(var j=0;j<doms.length;j++){
						ret.push(doms[j]);
					}
				}
			
			}else{
				return Array.prototype.slice.call(document.querySelectorAll(context+ '  ' +selector))
			}
			return ret;
		}else{
			return Array.prototype.slice.call(document.querySelectorAll(selector));
		}
	};

	init.prototype.addClass=function(){
		console.log('addClass');

	}
	global.$=global.Timo=Timo;
	document.addEventListener('DOMContentLoaded',function(){
		Timo.isready=true;
	})
}(window));