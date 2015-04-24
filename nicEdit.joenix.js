/* NicEdit - Micro Inline WYSIWYG
 * Copyright 2007-2008 Brian Kirchoff
 *
 * NicEdit is distributed under the terms of the MIT license
 * For more information visit http://nicedit.com/
 * Do not remove this copyright message
 *
 * Code be Optimized by Joenix (joenix.com)
 */

// Core Extend
function bkExtend(){

	return function( it, args ){

		if( args.length == 1 ){

			args = [ it, args[0] ];

		}

		for( var prop in args[1] ){

			args[0][prop] = args[1][prop];

		}

		return args[0];

	}( this, arguments );

}

// Core Class
function bkClass(){}

// Core Class Construct
bkClass.prototype.construct = function(){}

// Core Class Extend
bkClass.extend = function( def ){

	return function( it, classDef, proto ){

		bkExtend( proto, def );

		classDef.prototype = proto;

		classDef.extend = it.extend;

		return classDef;

	}

	(
		this,

		function(){

			if( arguments[0] !== bkClass ){

				return this.construct.apply( this, arguments );

			}

		},

		new this( bkClass )
	);

}

// Core Element Operat
var bkElement = bkClass.extend({

	// Construct
	construct: function( element, d ){

		if( typeof element == 'string' ){

			element = ( d || document ).createElement( element );

		}
		return $BK( element );

	},

	// Append To
	appendTo: function( element ){

		return element.appendChild(this), this;

	},

	// Append Before
	appendBefore: function( element ){

		return element.parentNode.insertBefore( this, element ), this;

	},

	// Add Event
	addEvent: function( type, fn ){
		return bkLib.addEvent( this, type, fn), this;
	},

	// Remove All Events
	removeAllEvents: function(){
		return bkLib.removeAllEvents( this ), this;
	},

	// Set Content
	setContent: function( content ) {
		return this.innerHTML = content, this;
	},

	// Position
	pos: function() {

		return function( curLeft, curTop, obj, it ){

			if( obj.offsetParent ){

				do{
					curLeft += obj.offsetLeft;
					curTop += obj.offsetTop;
				}
				while( obj = obj.offsetParent );

			}

			return function( border ){

				return [ curLeft + border, curTop + border + it.offsetHeight ];

			}( !!window.opera ? 0 : parseInt( it.getStyle('border-width') || it.style.border) || 0 );

		}
		(
			0, 0, this, this
		);
	},

	// no Select
	noSelect: function(){

		return bkLib.noSelect( this ), this;

	},

	// Parent Tag
	parentTag: function( top ){

		return function( element ){

			do{
				if( element && element.nodeName && element.nodeName.toUpperCase() == top) {
					return element;
				}
				element = element.parentNode;
			}
			while( element );

			return false;

		}( this );
	},

	// Has Class
	hasClass: function( classname ){

		return this.className.match( new RegExp('(\\s|^)nicEdit-' + classname + '(\\s|$)') );

	},

	// Add Class
	addClass: function( classname ){

		return this.hasClass( classname ) ? '' : ( this.className += ' nicEdit-' + classname ), this;

	},

	// Remove Class
	removeClass: function( classname ){

		return this.hasClass( classname ) ? this.className = this.className.replace( new RegExp('(\\s|^)nicEdit-' + classname + '(\\s|$)'), ' ') : '', this;

	},

	// Set Style
	setStyle: function( stylesheet ){

		return function( it, style, name ){

			for( name in stylesheet ){

				switch( name ){

					case 'float':

						style['cssFloat'] = style['styleFloat'] = stylesheet[ name ];

						break;

					case 'opacity':

						style.opacity = stylesheet[ name ], style.filter = 'alpha(opacity=' + Math.round( stylesheet[ name ] * 100 ) + ')';

						break;

					case 'className':

						it.className = stylesheet[ name ];

						break;

					default:

						style[ name ] = stylesheet[ name ];

				}

			}

			return it;

		}( this, this.style );
	},

	// Get Style
	getStyle: function( cssRule, dom ){

		return function( dom ){

			return this.nodeType == 1 ? ( (dom && dom.getComputedStyle) ? dom.getComputedStyle( this, null ).getPropertyValue( cssRule ) : this.currentStyle[ bkLib.camelize( cssRule ) ] ) : undefined;

		}( !!dom ? dom : document.defaultView );
	},

	// Remove Element
	remove: function(){

		return this.parentNode.removeChild( this ), this;

	},

	// Set Attributes
	setAttributes: function( attr ){

		return function( it, name ){

			for( name in attr ){

				it[ name ] = attr[ name ];

			}

			return it;

		}( this );
	}

});

// Core Function Library
var bkLib = {

	// Detect Internet Explorer
	isMSIE: !!~navigator.appVersion.indexOf('MSIE'),

	// Add Event
	addEvent: function( obj, type, fn ){

		( obj._bkE = obj._bkE || [] ), obj._bkE.push( [type, fn] ), ( obj.addEventListener ? obj.addEventListener( type, fn, false ) : obj.attachEvent('on' + type, fn) );

	},

	// Remove Event
	removeEvent: function( obj, type, fn ) {

		obj.removeEventListener ? obj.removeEventListener( type, fn, false ) : obj.detachEvent('on' + type, fn);

	},

	// Remove All Events
	removeAllEvents: function( obj ) {

		return function( index ){

			if( !obj._bkE ){
				return;
			}

			for( index = obj._bkE.length; index--; ){

				bkLib.removeEvent( obj, obj._bkE[ index ][ 0 ], obj._bkE[ index ][ 1 ] );

			}

			obj._bkE = [];

		}();
	},

	// To Array
	toArray: function( iterable ){

		return function( length, results ){

			while( length-- ){

				results[ length ] = iterable[ length ];

			}

			return results;

		}( iterable.length, new Array( iterable.length ) );
	},

	// No Select
	noSelect: function( element ){

		return function( index ){

			if( element.setAttribute && element.nodeName.toLowerCase() != 'input' && element.nodeName.toLowerCase() != 'textarea' ){
				element.setAttribute('unselectable', 'on');
			}

			for( index = element.childNodes.length; index--; ){

				bkLib.noSelect( element.childNodes[ index ] );

			}

		}();
	},

	// Camelize
	camelize: function( str ){

		return str.replace(/\-(.)/g, function( all, one ){ return one.toUpperCase() });

	},

	// In Array
	inArray: function( arr, item ){

		return bkLib.search( arr, item ) !== null;

	},

	// Search
	search: function( arr, item ){

		return function( index ){

			for( index = 0; index < arr.length; index++ ){

				if( arr[ index ] == item ){

					return index;

				}

			}

			return null;

		}();
	},

	// Cancel Event
	cancelEvent: function( event ){

		return function( event ){

			if( event.preventDefault ){

				event.preventDefault();

			}

			if( event.stopPropagation ){

				event.stopPropagation();

			}

			return false;

		}( event || window.event );

	},

	// Dom Load Cache
	domLoad: [],

	// Dom Loaded
	domLoaded: function(){

		return function( index, args ){

			if( args.callee.done ){

				return;

			}

			args.callee.done = true;

			for( ; index < bkLib.domLoad.length; index++ ){

				bkLib.domLoad[ index ]();

			}

		}(0, arguments);
	},

	// On Dom Loaded
	onDomLoaded: function( fireThis ){

		this.domLoad.push( fireThis );

		if( document.addEventListener ){

			document.addEventListener('DOMContentLoaded', bkLib.domLoaded, null);

		}
		else if( bkLib.isMSIE ){

			document.write(

				'<style>.nicEdit-main p { margin: 0; }</style>' + '<script id="__ie_onload" defer src="' + ( location.protocol == 'https:' ? 'javascript:void(0);' : '//0' ) + '"></script>'

			);

			$BK('__ie_onload').onreadystatechange = function(){
				
				if( this.readyState == 'complete' ){

					bkLib.domLoaded();
				}
			
			};

		}

		window.onload = bkLib.domLoaded;
	}
};

// Extend Element
function $BK( element ){
	
	return function( element ){

		return ( element && !element.appendTo ) ? bkExtend( element,bkElement.prototype ) : element;

	}( typeof(element) == 'string' ? document.getElementById( element ) : element );
}

// Cache Event
var bkEvent = {

	// Add Event To List
	addEvent: function( type, fn ){

		return function( it ){

			if( fn ){

				it.eventList = it.eventList || {}, it.eventList[ type ] = it.eventList[ type ] || [], it.eventList[ type ].push( fn );

			}

			return it;

		}( this );
	},

	// Fire Event From List
	fireEvent: function(){

		return function( it, args, callback ){

			callback( it, args, args.shift() );

		}( this, bkLib.toArray( arguments ), function( it, args, type, index ){

			if( it.eventList && it.eventList[ type ] ){

				for( index = 0; index < it.eventList[ type ].length; index++ ){

					it.eventList[ type ][ index ].apply( it, args );

				}

			}

		});
	}
};

// Language Package
function __( name ){

	return function( zh_cn ){

		return zh_cn[ name ] || name;

	}
	({
		'Bold': '加粗',
		'Italic': '斜体',
		'Underline': '下划线',
		'Left Align': '左对齐',
		'Center Align': '居中对齐',
		'Right Align': '右对齐',
		'Justify Align': '两端对齐',
		'Ordered List': '序号列',
		'Unordered List': '非序号列',
		'Subscript': '下标',
		'Superscript': '上标',
		'Strike Through': '删除线',
		'Remove Formatting': '清空样式',
		'Horizontal Rule': '分割线',
		'Select Font Size': '字体大小',
		'Select Font Family': '字体样式',
		'Select Font Format': '段落样式',
		'Paragraph': '段落',
		'Heading6': '标题6',
		'Heading5': '标题5',
		'Heading4': '标题4',
		'Heading3': '标题3',
		'Heading2': '标题2',
		'Heading1': '标题1',
		'Add Link': '添加超链接',
		'Remove Link': '移除超链接',
		'Change Text Color': '文字颜色',
		'Change Background Color': '文字背景色',
		'Add Image': '添加图片',
		'Add Smiley': '添加表情',
		'Font Size...': '字体大小',
		'Font Family...': '字体样式',
		'Font Format...': '段落样式',
		'Next': '下一个',
		'Prev': '上一个',
		'Add/Edit Link': '添加/修改链接',
		'Title': '标题',
		'Open In': '打开在',
		'Current Window': '原窗口',
		'New Window': '新窗口',
		'Submit': '保存',
		'Add/Edit Image': '添加/修改图片',
		'Alt Text': '描述',
		'Align': '对齐',
		'Default': '默认',
		'Left': '左对齐',
		'Right': '右对齐',
		'You must enter a Image URL to insert': '请输入一个图像地址',
		'You must enter a URL to Create a Link': '请输入链接地址'
	});

}
/*
// Function Prototype Closure
Function.prototype.closure = function(){

	return function( __method, args ){

		return function(){

			if( typeof( bkLib ) != 'undefined' ){

				return __method.apply( args.shift(), args.concat( bkLib.toArray( arguments ) ) );

			}

		}

	}( this, bkLib.toArray( arguments ) );
}

// Function Prototype Closure Listener
Function.prototype.closureListener = function(){

	return function( __method, args ){

		return function( event ){

			return function( event, object ){

				return function( target ){

					return __method.apply( object, [ event, target ].concat( args ) );

				}( event.target || event.srcElement );

			}( event || window.event, args.shift() );

		}

	}( this, bkLib.toArray(arguments) );
}
*/

Function.prototype.closure = function() {
  var __method = this, args = bkLib.toArray(arguments), obj = args.shift();
  return function() { if(typeof(bkLib) != 'undefined') { return __method.apply(obj,args.concat(bkLib.toArray(arguments))); } };
}

Function.prototype.closureListener = function() {
  	var __method = this, args = bkLib.toArray(arguments), object = args.shift();
  	return function(e) {
  	e = e || window.event;
  	if(e.target) { var target = e.target; } else { var target =  e.srcElement };
	  	return __method.apply(object, [e,target].concat(args) );
	};
}


/* START CONFIG */

var nicEditorConfig = bkClass.extend({
	buttons : {
		'bold' : {name : __('Bold'), command : 'Bold', tags : ['B','STRONG'], css : {'font-weight' : 'bold'}, key : 'b'},
		'italic' : {name : __('Italic'), command : 'Italic', tags : ['EM','I'], css : {'font-style' : 'italic'}, key : 'i'},
		'underline' : {name : __('Underline'), command : 'Underline', tags : ['U'], css : {'text-decoration' : 'underline'}, key : 'u'},
		'left' : {name : __('Left Align'), command : 'justifyleft', noActive : true, css : {'text-align' : 'left'}},
		'center' : {name : __('Center Align'), command : 'justifycenter', noActive : true, css : {'text-align' : 'center'}},
		'right' : {name : __('Right Align'), command : 'justifyright', noActive : true, css : {'text-align' : 'right'}},
		'justify' : {name : __('Justify Align'), command : 'justifyfull', noActive : true, css : {'text-align' : 'justify'}},
		'ol' : {name : __('Ordered List'), command : 'insertorderedlist', tags : ['OL']},
		'ul' : 	{name : __('Unordered List'), command : 'insertunorderedlist', tags : ['UL']},
		'subscript' : {name : __('Subscript'), command : 'subscript', tags : ['SUB']},
		'superscript' : {name : __('Superscript'), command : 'superscript', tags : ['SUP']},
		'strikethrough' : {name : __('Strike Through'), command : 'strikeThrough', css : {'text-decoration' : 'line-through'}},
		'removeformat' : {name : __('Remove Formatting'), command : 'removeformat', noActive : true},
		'hr' : {name : __('Horizontal Rule'), command : 'insertHorizontalRule', noActive : true}
	},
	basePath : '',
	iconsPath : './nicEditorIcons.gif',
	buttonList : ['save','bold','italic','underline','left','center','right','justify','ol','ul','fontSize','fontFamily','fontFormat','indent','outdent','image','upload','smiley','link','unlink','forecolor','bgcolor','xhtml'],
	iconList : {"xhtml":1,"bgcolor":2,"forecolor":3,"bold":4,"center":5,"hr":6,"indent":7,"italic":8,"justify":9,"left":10,"ol":11,"outdent":12,"removeformat":13,"right":14,"table":15,"strikethrough":16,"subscript":17,"superscript":18,"ul":19,"underline":20,"image":21,"link":22,"unlink":23,"close":24,"save":25,"arrow":26,"upload":27,"smiley":28,"music":29,"video":30,"document":31}

});
/* END CONFIG */


var nicEditors = {
	nicPlugins : [],
	editors : [],

	registerPlugin : function(plugin,options) {
		this.nicPlugins.push({p : plugin, o : options});
	},

	allTextAreas : function(nicOptions) {
		var textareas = document.getElementsByTagName("textarea");
		for(var i=0;i<textareas.length;i++) {
			nicEditors.editors.push(new nicEditor(nicOptions).panelInstance(textareas[i]));
		}
		return nicEditors.editors;
	},

	findEditor : function(e) {
		var editors = nicEditors.editors;
		for(var i=0;i<editors.length;i++) {
			if(editors[i].instanceById(e)) {
				return editors[i].instanceById(e);
			}
		}
	}
};


var nicEditor = bkClass.extend({
	construct : function(o) {
		this.options = new nicEditorConfig();
		bkExtend(this.options,o);
		this.nicInstances = new Array();
		this.loadedPlugins = new Array();

		var plugins = nicEditors.nicPlugins;
		for(var i=0;i<plugins.length;i++) {
			this.loadedPlugins.push(new plugins[i].p(this,plugins[i].o));
		}
		nicEditors.editors.push(this);
		bkLib.addEvent(document.body,'mousedown', this.selectCheck.closureListener(this) );
	},

	panelInstance : function(e,o) {
		e = this.checkReplace($BK(e));
		var panelElm = new bkElement('DIV').setStyle({width : (parseInt(e.getStyle('width')) || e.clientWidth)+'px'}).appendBefore(e);
		this.setPanel(panelElm);
		return this.addInstance(e,o);
	},

	checkReplace : function(e) {
		var r = nicEditors.findEditor(e);
		if(r) {
			r.removeInstance(e);
			r.removePanel();
		}
		return e;
	},

	addInstance : function(e,o) {
		e = this.checkReplace($BK(e));
		if( e.contentEditable || !!window.opera ) {
			var newInstance = new nicEditorInstance(e,o,this);
		} else {
			var newInstance = new nicEditorIFrameInstance(e,o,this);
		}
		this.nicInstances.push(newInstance);
		return this;
	},

	removeInstance : function(e) {
		e = $BK(e);
		var instances = this.nicInstances;
		for(var i=0;i<instances.length;i++) {
			if(instances[i].e == e) {
				instances[i].remove();
				this.nicInstances.splice(i,1);
			}
		}
	},

	removePanel : function(e) {
		if(this.nicPanel) {
			this.nicPanel.remove();
			this.nicPanel = null;
		}
	},

	instanceById : function(e) {
		e = $BK(e);
		var instances = this.nicInstances;
		for(var i=0;i<instances.length;i++) {
			if(instances[i].e == e) {
				return instances[i];
			}
		}
	},

	setPanel : function(e) {
		this.nicPanel = new nicEditorPanel($BK(e),this.options,this);
		this.fireEvent('panel',this.nicPanel);
		return this;
	},

	nicCommand : function(cmd,args) {
		if(this.selectedInstance) {
			this.selectedInstance.nicCommand(cmd,args);
		}
	},

	getIcon : function(iconName,options) {
		var icon = this.options.iconList[iconName];
		var file = (options.iconFiles) ? options.iconFiles[iconName] : '';
		return {backgroundImage : "url('"+((icon) ? (this.options.basePath + this.options.iconsPath) : file)+"')", backgroundPosition : ((icon) ? ((icon-1)*-18) : 0)+'px 0px'};
	},

	selectCheck : function(e,t) {
		var found = false;
		do{
			if(t.className && t.className.indexOf('nicEdit') != -1) {
				return false;
			}
		} while(t = t.parentNode);
		this.fireEvent('blur',this.selectedInstance,t);
		this.lastSelectedInstance = this.selectedInstance;
		this.selectedInstance = null;
		return false;
	}

});
nicEditor = nicEditor.extend(bkEvent);


var nicEditorInstance = bkClass.extend({
	isSelected : false,

	construct : function(e,options,nicEditor) {
		this.ne = nicEditor;
		this.elm = this.e = e;
		this.options = options || {};

		newX = parseInt(e.getStyle('width')) || e.clientWidth;
		newY = parseInt(e.getStyle('height')) || e.clientHeight;
		this.initialHeight = newY-8;

		var isTextarea = (e.nodeName.toLowerCase() == "textarea");
		if(isTextarea || this.options.hasPanel) {
			var ie7s = (bkLib.isMSIE && !((typeof document.body.style.maxHeight != "undefined") && document.compatMode == "CSS1Compat"))
			var s = {width: newX+'px', border : '1px solid #ccc', borderTop : 0, overflowY : 'auto', overflowX: 'hidden' };
			s[(ie7s) ? 'height' : 'maxHeight'] = (this.ne.options.maxHeight) ? this.ne.options.maxHeight+'px' : null;
			this.editorContain = new bkElement('DIV').setStyle(s).appendBefore(e);
			var editorElm = new bkElement('DIV').setStyle({width : (newX-8)+'px', margin: '4px', minHeight : newY+'px'}).addClass('main').appendTo(this.editorContain);

			e.setStyle({display : 'none'});

			editorElm.innerHTML = e.innerHTML;
			if(isTextarea) {
				editorElm.setContent(e.value);
				this.copyElm = e;
				var f = e.parentTag('FORM');
				if(f) { bkLib.addEvent( f, 'submit', this.saveContent.closure(this)); }
			}
			editorElm.setStyle((ie7s) ? {height : newY+'px'} : {overflow: 'hidden'});
			this.elm = editorElm;
		}
		this.ne.addEvent('blur',this.blur.closure(this));

		this.init();
		this.blur();
	},

	init : function() {
		this.elm.setAttribute('contentEditable','true');
		if(this.getContent() == "") {
			this.setContent('<br />');
		}
		this.instanceDoc = document.defaultView;
		this.elm.addEvent('mousedown',this.selected.closureListener(this)).addEvent('keypress',this.keyDown.closureListener(this)).addEvent('focus',this.selected.closure(this)).addEvent('blur',this.blur.closure(this)).addEvent('keyup',this.selected.closure(this));
		this.ne.fireEvent('add',this);
	},

	remove : function() {
		this.saveContent();
		if(this.copyElm || this.options.hasPanel) {
			this.editorContain.remove();
			this.e.setStyle({'display' : 'block'});
			this.ne.removePanel();
		}
		this.elm.removeAllEvents();
		this.disable();
		this.ne.fireEvent('remove',this);
	},

	disable : function() {
		this.elm.setAttribute('contentEditable','false');
	},

	getSel : function() {
		return (window.getSelection) ? window.getSelection() : document.selection;
	},

	getRng : function() {
		var s = this.getSel();
		if(!s) { return; } // bug : if(!s || s.rangeCount === 0) { return; }
		return (s.rangeCount > 0) ? s.getRangeAt(0) : ( typeof s.createRange == 'undefined' ? document.createRange() : s.createRange() );
	},

	selRng : function(rng,s) {
		if(window.getSelection) {
			s.removeAllRanges();
			s.addRange(rng);
		} else {
			rng.select();
		}
	},

	selElm : function() {
		var r = this.getRng();
		if(!r) { return; }
		if(r.startContainer) {
			var contain = r.startContainer;
			if(r.cloneContents().childNodes.length == 1) {
				for(var i=0;i<contain.childNodes.length;i++) {
					var rng = contain.childNodes[i].ownerDocument.createRange();
					rng.selectNode(contain.childNodes[i]);
					if(r.compareBoundaryPoints(Range.START_TO_START,rng) != 1 &&
						r.compareBoundaryPoints(Range.END_TO_END,rng) != -1) {
						return $BK(contain.childNodes[i]);
					}
				}
			}
			return $BK(contain);
		} else {
			return $BK((this.getSel().type == "Control") ? r.item(0) : r.parentElement());
		}
	},

	saveRng : function() {
		this.savedRange = this.getRng();
		this.savedSel = this.getSel();
	},

	restoreRng : function() {
		if(this.savedRange) {
			this.selRng(this.savedRange,this.savedSel);
		}
	},

	selBlockType : function() {
		var e = this.selElm();
		var t = {'P':1,'PRE':1,'H1':1,'H2':1,'H3':1,'H4':1,'H5':1,'H6':1};
		while (e != this.elm) {
			if (t[e.nodeName]) {
				return e.nodeName;
			}
			e = e.parentNode;
		}
		return false;
	},

	keyDown : function(e,t) {
		// add Event for Enter = p, Shift + Enter = br
		if(e.keyCode == 13 || e.keyCode == 10) {
			if (!e.shiftKey && !this.selBlockType()) {
				this.ne.nicCommand('formatBlock', 'p');
			}
		}
		if(e.ctrlKey) {
			this.ne.fireEvent('key',this,e);
		}
	},

	selected : function(e,t) {
		if(!t && !(t = this.selElm)) { t = this.selElm(); }
		if(!e.ctrlKey) {
			var selInstance = this.ne.selectedInstance;
			if(selInstance != this) {
				if(selInstance) {
					this.ne.fireEvent('blur',selInstance,t);
				}
				this.ne.selectedInstance = this;
				this.ne.fireEvent('focus',selInstance,t);
			}
			this.ne.fireEvent('selected',selInstance,t);
			this.isFocused = true;
			this.elm.addClass('selected');
		}
		return false;
	},

	blur : function() {
		this.isFocused = false;
		this.elm.removeClass('selected');
	},

	saveContent : function() {
		if(this.copyElm || this.options.hasPanel) {
			this.ne.fireEvent('save',this);
			(this.copyElm) ? this.copyElm.value = this.getContent() : this.e.innerHTML = this.getContent();
		}
	},

	getElm : function() {
		return this.elm;
	},

	getContent : function() {
		this.content = this.getElm().innerHTML;
		this.ne.fireEvent('get',this);
		return this.content;
	},

	setContent : function(e) {
		this.content = e;
		this.ne.fireEvent('set',this);
		this.elm.innerHTML = this.content;
	},

	nicCommand : function(cmd,args) {
		document.execCommand(cmd,false,args);
	}
});

var nicEditorIFrameInstance = nicEditorInstance.extend({
	savedStyles : [],

	init : function() {
		var c = this.elm.innerHTML.replace(/^\s+|\s+$/g, '');
		this.elm.innerHTML = '';
		(!c) ? c = "<br />" : c;
		this.initialContent = c;

		this.elmFrame = new bkElement('iframe').setAttributes({'src' : 'javascript:;', 'frameBorder' : 0, 'allowTransparency' : 'true', 'scrolling' : 'no'}).setStyle({height: '100px', width: '100%'}).addClass('frame').appendTo(this.elm);

		if(this.copyElm) { this.elmFrame.setStyle({width : (this.elm.offsetWidth-4)+'px'}); }

		var styleList = ['font-size','font-family','font-weight','color'];
		for(itm in styleList) {
			this.savedStyles[bkLib.camelize(itm)] = this.elm.getStyle(itm);
		}

		setTimeout(this.initFrame.closure(this),50);
	},

	disable : function() {
		this.elm.innerHTML = this.getContent();
	},

	initFrame : function() {
		var fd = $BK(this.elmFrame.contentWindow.document);
		fd.designMode = "on";
		fd.open();
		var css = this.ne.options.externalCSS;
		fd.write('<html><head>'+((css) ? '<link href="'+css+'" rel="stylesheet" type="text/css" />' : '')+'</head><body id="nicEditContent" style="margin: 0 !important; background-color: transparent !important;">'+this.initialContent+'</body></html>');
		fd.close();
		this.frameDoc = fd;

		this.frameWin = $BK(this.elmFrame.contentWindow);
		this.frameContent = $BK(this.frameWin.document.body).setStyle(this.savedStyles);
		this.instanceDoc = this.frameWin.document.defaultView;

		this.heightUpdate();
		this.frameDoc.addEvent('mousedown', this.selected.closureListener(this)).addEvent('keyup',this.heightUpdate.closureListener(this)).addEvent('keydown',this.keyDown.closureListener(this)).addEvent('keyup',this.selected.closure(this));
		this.ne.fireEvent('add',this);
	},

	getElm : function() {
		return this.frameContent;
	},

	setContent : function(c) {
		this.content = c;
		this.ne.fireEvent('set',this);
		this.frameContent.innerHTML = this.content;
		this.heightUpdate();
	},

	getSel : function() {
		return (this.frameWin) ? this.frameWin.getSelection() : this.frameDoc.selection;
	},

	heightUpdate : function() {
		this.elmFrame.style.height = Math.max(this.frameContent.offsetHeight,this.initialHeight)+'px';
	},

	nicCommand : function(cmd,args) {
		this.frameDoc.execCommand(cmd,false,args);
		setTimeout(this.heightUpdate.closure(this),100);
	}


});
var nicEditorPanel = bkClass.extend({
	construct : function(e,options,nicEditor) {
		this.elm = e;
		this.options = options;
		this.ne = nicEditor;
		this.panelButtons = new Array();
		this.buttonList = bkExtend([],this.ne.options.buttonList);

		this.panelContain = new bkElement('DIV').setStyle({overflow : 'hidden', width : '100%', border : '1px solid #cccccc', backgroundColor : '#efefef'}).addClass('panelContain');
		this.panelElm = new bkElement('DIV').setStyle({margin : '2px', marginTop : '0px', zoom : 1, overflow : 'hidden'}).addClass('panel').appendTo(this.panelContain);
		this.panelContain.appendTo(e);

		var opt = this.ne.options;
		var buttons = opt.buttons;
		for(button in buttons) {
				this.addButton(button,opt,true);
		}
		this.reorder();
		e.noSelect();
	},

	addButton : function(buttonName,options,noOrder) {
		var button = options.buttons[buttonName];
		var type = (button['type']) ? eval('(typeof('+button['type']+') == "undefined") ? null : '+button['type']+';') : nicEditorButton;
		var hasButton = bkLib.inArray(this.buttonList,buttonName);
		if(type && (hasButton || this.ne.options.fullPanel)) {
			this.panelButtons.push(new type(this.panelElm,buttonName,options,this.ne));
			if(!hasButton) {
				this.buttonList.push(buttonName);
			}
		}
	},

	findButton : function(itm) {
		for(var i=0;i<this.panelButtons.length;i++) {
			if(this.panelButtons[i].name == itm)
				return this.panelButtons[i];
		}
	},

	reorder : function() {
		var bl = this.buttonList;
		for(var i=0;i<bl.length;i++) {
			var button = this.findButton(bl[i]);
			if(button) {
				this.panelElm.appendChild(button.margin);
			}
		}
	},

	remove : function() {
		this.elm.remove();
	}
});
var nicEditorButton = bkClass.extend({

	construct : function(e,buttonName,options,nicEditor) {
		this.options = options.buttons[buttonName];
		this.name = buttonName;
		this.ne = nicEditor;
		this.elm = e;

		this.margin = new bkElement('DIV').setStyle({'float' : 'left', marginTop : '2px'}).appendTo(e);
		this.contain = new bkElement('DIV').setStyle({width : '20px', height : '20px'}).addClass('buttonContain').appendTo(this.margin);
		this.border = new bkElement('DIV').setStyle({backgroundColor : '#efefef', border : '1px solid #efefef'}).appendTo(this.contain);
		this.button = new bkElement('DIV').setStyle({width : '18px', height : '18px', overflow : 'hidden', zoom : 1, cursor : 'pointer'}).addClass('button').setStyle(this.ne.getIcon(buttonName,options)).appendTo(this.border);
		this.button.addEvent('mouseover', this.hoverOn.closure(this)).addEvent('mouseout',this.hoverOff.closure(this)).addEvent('mousedown',this.mouseClick.closure(this)).noSelect();

		if(!window.opera) {
			this.button.onmousedown = this.button.onclick = bkLib.cancelEvent;
		}

		nicEditor.addEvent('selected', this.enable.closure(this)).addEvent('blur', this.disable.closure(this)).addEvent('key',this.key.closure(this));

		this.disable();
		this.init();
	},

	init : function() {  },

	hide : function() {
		this.contain.setStyle({display : 'none'});
	},

	updateState : function() {
		if(this.isDisabled) { this.setBg(); }
		else if(this.isHover) { this.setBg('hover'); }
		else if(this.isActive) { this.setBg('active'); }
		else { this.setBg(); }
	},

	setBg : function(state) {
		switch(state) {
			case 'hover':
				var stateStyle = {border : '1px solid #666', backgroundColor : '#ddd'};
				break;
			case 'active':
				var stateStyle = {border : '1px solid #666', backgroundColor : '#ccc'};
				break;
			default:
				var stateStyle = {border : '1px solid #efefef', backgroundColor : '#efefef'};
		}
		this.border.setStyle(stateStyle).addClass('button-'+state);
	},

	checkNodes : function(e) {
		var elm = e;
		do {
			if(this.options.tags && bkLib.inArray(this.options.tags,elm.nodeName)) {
				this.activate();
				return true;
			}
		} while(elm = elm.parentNode && elm.className != "nicEdit");
		elm = $BK(e);
		while(elm.nodeType == 3) {
			elm = $BK(elm.parentNode);
		}
		if(this.options.css) {
			for(itm in this.options.css) {
				if(elm.getStyle(itm,this.ne.selectedInstance.instanceDoc) == this.options.css[itm]) {
					this.activate();
					return true;
				}
			}
		}
		this.deactivate();
		return false;
	},

	activate : function() {
		if(!this.isDisabled) {
			this.isActive = true;
			this.updateState();
			this.ne.fireEvent('buttonActivate',this);
		}
	},

	deactivate : function() {
		this.isActive = false;
		this.updateState();
		if(!this.isDisabled) {
			this.ne.fireEvent('buttonDeactivate',this);
		}
	},

	enable : function(ins,t) {
		this.isDisabled = false;
		this.contain.setStyle({'opacity' : 1}).addClass('buttonEnabled');
		this.updateState();
		this.checkNodes(t);
	},

	disable : function(ins,t) {
		this.isDisabled = true;
		this.contain.setStyle({'opacity' : 0.6}).removeClass('buttonEnabled');
		this.updateState();
	},

	toggleActive : function() {
		(this.isActive) ? this.deactivate() : this.activate();
	},

	hoverOn : function() {
		if(!this.isDisabled) {
			this.isHover = true;
			this.updateState();
			this.ne.fireEvent("buttonOver",this);
		}
	},

	hoverOff : function() {
		this.isHover = false;
		this.updateState();
		this.ne.fireEvent("buttonOut",this);
	},

	mouseClick : function() {
		if(this.options.command) {
			this.ne.nicCommand(this.options.command,this.options.commandArgs);
			if(!this.options.noActive) {
				this.toggleActive();
			}
		}
		this.ne.fireEvent("buttonClick",this);
	},

	key : function(nicInstance,e) {
		if(this.options.key && e.ctrlKey && String.fromCharCode(e.keyCode || e.charCode).toLowerCase() == this.options.key) {
			this.mouseClick();
			if(e.preventDefault) e.preventDefault();
		}
	}

});


var nicPlugin = bkClass.extend({

	construct : function(nicEditor,options) {
		this.options = options;
		this.ne = nicEditor;
		this.ne.addEvent('panel',this.loadPanel.closure(this));

		this.init();
	},

	loadPanel : function(np) {
		var buttons = this.options.buttons;
		for(var button in buttons) {
			np.addButton(button,this.options);
		}
		np.reorder();
	},

	init : function() {  }
});




 /* START CONFIG */
var nicPaneOptions = { };
/* END CONFIG */

var nicEditorPane = bkClass.extend({
	construct : function(elm,nicEditor,options,openButton) {
		this.ne = nicEditor;
		this.elm = elm;
		this.pos = elm.pos();

		this.contain = new bkElement('div').setStyle({zIndex : '99999', overflow : 'hidden', position : 'absolute', left : this.pos[0]+'px', top : this.pos[1]+'px'})
		this.pane = new bkElement('div').setStyle({fontSize : '12px', border : '1px solid #ccc', 'overflow': 'hidden', padding : '4px', textAlign: 'left', backgroundColor : '#ffffc9'}).addClass('pane').setStyle(options).appendTo(this.contain);

		if(openButton && !openButton.options.noClose) {
			this.close = new bkElement('div').setStyle({'float' : 'right', height: '16px', width : '16px', cursor : 'pointer'}).setStyle(this.ne.getIcon('close',nicPaneOptions)).addEvent('mousedown',openButton.removePane.closure(this)).appendTo(this.pane);
		}

		this.contain.noSelect().appendTo(document.body);

		this.position();
		this.init();
	},

	init : function() { },

	position : function() {
		if(this.ne.nicPanel) {
			var panelElm = this.ne.nicPanel.elm;
			var panelPos = panelElm.pos();
			var newLeft = panelPos[0]+parseInt(panelElm.getStyle('width'))-(parseInt(this.pane.getStyle('width'))+8);
			if(newLeft < this.pos[0]) {
				this.contain.setStyle({left : newLeft+'px'});
			}
		}
	},

	toggle : function() {
		this.isVisible = !this.isVisible;
		this.contain.setStyle({display : ((this.isVisible) ? 'block' : 'none')});
	},

	remove : function() {
		if(this.contain) {
			this.contain.remove();
			this.contain = null;
		}
	},

	append : function(c) {
		c.appendTo(this.pane);
	},

	setContent : function(c) {
		this.pane.setContent(c);
	}

});


/* nicAdvancedButton */

var nicEditorAdvancedButton = nicEditorButton.extend({

	init : function() {
		this.ne.addEvent('selected',this.removePane.closure(this)).addEvent('blur',this.removePane.closure(this));
	},

	mouseClick : function() {
		if(!this.isDisabled) {
			if(this.pane && this.pane.pane) {
				this.removePane();
			} else {
				this.pane = new nicEditorPane(this.contain,this.ne,{width : (this.width || '270px'), backgroundColor : '#fff'},this);
				this.addPane();
				this.ne.selectedInstance.saveRng();
			}
		}
	},

	addForm : function(f,elm) {
		this.form = new bkElement('form').addEvent('submit',this.submit.closureListener(this));
		this.pane.append(this.form);
		this.inputs = {};

		for(itm in f) {
			var field = f[itm];
			var val = '';
			if(elm) {
				val = elm.getAttribute(itm);
			}
			if(!val) {
				val = field['value'] || '';
			}
			var type = f[itm].type;

			if(type == 'title') {
					new bkElement('div').setContent(field.txt).setStyle({fontSize : '14px', fontWeight: 'bold', padding : '0px', margin : '2px 0'}).appendTo(this.form);
			} else {
				var contain = new bkElement('div').setStyle({overflow : 'hidden', clear : 'both'}).appendTo(this.form);
				if(field.txt) {
					new bkElement('label').setAttributes({'for' : itm}).setContent(field.txt).setStyle({margin : '2px 4px', fontSize : '13px', width: '50px', lineHeight : '20px', textAlign : 'right', 'float' : 'left'}).appendTo(contain);
				}

				switch(type) {
					case 'text':
						this.inputs[itm] = new bkElement('input').setAttributes({id : itm, 'value' : val, 'type' : 'text'}).setStyle({margin : '2px 0', fontSize : '13px', 'float' : 'left', height : '20px', border : '1px solid #ccc', overflow : 'hidden'}).setStyle(field.style).appendTo(contain);
						break;
					case 'select':
						this.inputs[itm] = new bkElement('select').setAttributes({id : itm}).setStyle({border : '1px solid #ccc', 'float' : 'left', margin : '2px 0'}).appendTo(contain);
						for(opt in field.options) {
							var o = new bkElement('option').setAttributes({value : opt, selected : (opt == val) ? 'selected' : ''}).setContent(field.options[opt]).appendTo(this.inputs[itm]);
						}
						break;
					case 'content':
						this.inputs[itm] = new bkElement('textarea').setAttributes({id : itm}).setStyle({border : '1px solid #ccc', 'float' : 'left'}).setStyle(field.style).appendTo(contain);
						this.inputs[itm].value = val;
				}
			}
		}
		new bkElement('input').setAttributes({'type' : 'submit', 'value': __('Submit')}).setStyle({backgroundColor : '#efefef',border : '1px solid #ccc', margin : '3px 0', 'float' : 'left', 'clear' : 'both'}).appendTo(this.form);
		this.form.onsubmit = bkLib.cancelEvent;
	},

	submit : function() { },

	findElm : function(tag,attr,val) {
		var list = this.ne.selectedInstance.getElm().getElementsByTagName(tag);
		for(var i=0;i<list.length;i++) {
			if(list[i].getAttribute(attr) == val) {
				return $BK(list[i]);
			}
		}
	},

	removePane : function() {
		if(this.pane) {
			this.pane.remove();
			this.pane = null;
			this.ne.selectedInstance.restoreRng();
		}
	}
});


/* nicButtonTips */

var nicButtonTips = bkClass.extend({
	construct : function(nicEditor) {
		this.ne = nicEditor;
		nicEditor.addEvent('buttonOver',this.show.closure(this)).addEvent('buttonOut',this.hide.closure(this));

	},

	show : function(button) {
		this.timer = setTimeout(this.create.closure(this,button),400);
	},

	create : function(button) {
		this.timer = null;
		if(!this.pane) {
			this.pane = new nicEditorPane(button.button,this.ne,{fontSize : '12px', marginTop : '5px'});
			this.pane.setContent(button.options.name);
		}
	},

	hide : function(button) {
		if(this.timer) {
			clearTimeout(this.timer);
		}
		if(this.pane) {
			this.pane = this.pane.remove();
		}
	}
});
nicEditors.registerPlugin(nicButtonTips);



 /* START CONFIG */
var nicSelectOptions = {
	buttons : {
		'fontSize' : {name : __('Select Font Size'), type : 'nicEditorFontSizeSelect', command : 'fontSize'},
		'fontFamily' : {name : __('Select Font Family'), type : 'nicEditorFontFamilySelect', command : 'fontFamily'},
		'fontFormat' : {name : __('Select Font Format'), type : 'nicEditorFontFormatSelect', command : 'formatBlock'}
	}
};
/* END CONFIG */
var nicEditorSelect = bkClass.extend({

	construct : function(e,buttonName,options,nicEditor) {
		this.options = options.buttons[buttonName];
		this.elm = e;
		this.ne = nicEditor;
		this.name = buttonName;
		this.selOptions = new Array();

		this.margin = new bkElement('div').setStyle({'float' : 'left', margin : '2px 1px 0 1px'}).appendTo(this.elm);
		this.contain = new bkElement('div').setStyle({width: '90px', height : '20px', cursor : 'pointer', overflow: 'hidden'}).addClass('selectContain').addEvent('click',this.toggle.closure(this)).appendTo(this.margin);
		this.items = new bkElement('div').setStyle({overflow : 'hidden', zoom : 1, border: '1px solid #ccc', paddingLeft : '3px', backgroundColor : '#fff'}).appendTo(this.contain);
		this.control = new bkElement('div').setStyle({overflow : 'hidden', 'float' : 'right', height: '18px', width : '16px'}).addClass('selectControl').setStyle(this.ne.getIcon('arrow',options)).appendTo(this.items);
		this.txt = new bkElement('div').setStyle({overflow : 'hidden', 'float' : 'left', width : '66px', height : '14px', marginTop : '1px', fontFamily : 'sans-serif', textAlign : 'left', fontSize : '12px', wordBreak : 'break-all'}).addClass('selectTxt').appendTo(this.items);

		if(!window.opera) {
			this.contain.onmousedown = this.control.onmousedown = this.txt.onmousedown = bkLib.cancelEvent;
		}

		this.margin.noSelect();

		this.ne.addEvent('selected', this.enable.closure(this)).addEvent('blur', this.disable.closure(this));

		this.disable();
		this.init();
	},

	disable : function() {
		this.isDisabled = true;
		this.close();
		this.contain.setStyle({opacity : 0.6});
	},

	enable : function(t) {
		this.isDisabled = false;
		this.close();
		this.contain.setStyle({opacity : 1});
	},

	setDisplay : function(txt) {
		this.txt.setContent(txt);
	},

	toggle : function() {
		if(!this.isDisabled) {
			(this.pane) ? this.close() : this.open();
		}
	},

	open : function() {
		this.pane = new nicEditorPane(this.items,this.ne,{width : '88px', padding: '0px', borderTop : 0, borderLeft : '1px solid #ccc', borderRight : '1px solid #ccc', borderBottom : '0px', backgroundColor : '#fff'});

		for(var i=0;i<this.selOptions.length;i++) {
			var opt = this.selOptions[i];
			var itmContain = new bkElement('div').setStyle({overflow : 'hidden', borderBottom : '1px solid #ccc', width: '88px', textAlign : 'left', overflow : 'hidden', cursor : 'pointer'});
			var itm = new bkElement('div').setStyle({padding : '0px 4px'}).setContent(opt[1]).appendTo(itmContain).noSelect();
			itm.addEvent('click',this.update.closure(this,opt[0])).addEvent('mouseover',this.over.closure(this,itm)).addEvent('mouseout',this.out.closure(this,itm)).setAttributes('id',opt[0]);
			this.pane.append(itmContain);
			if(!window.opera) {
				itm.onmousedown = bkLib.cancelEvent;
			}
		}
	},

	close : function() {
		if(this.pane) {
			this.pane = this.pane.remove();
		}
	},

	over : function(opt) {
		opt.setStyle({backgroundColor : '#ccc'});
	},

	out : function(opt) {
		opt.setStyle({backgroundColor : '#fff'});
	},


	add : function(k,v) {
		this.selOptions.push(new Array(k,v));
	},

	update : function(elm) {
		this.ne.nicCommand(this.options.command,elm);
		this.close();
	}
});

var nicEditorFontSizeSelect = nicEditorSelect.extend({
	sel : {'1' : '1 x-small', '2' : 'small', '3' : 'medium', '4' : 'large', '5' : 'x-large'},
	init : function() {
		this.setDisplay(__('Font Size...'));
		if(this.ne.options.fontSize !== undefined)
			this.sel = this.ne.options.fontSize;
		for(itm in this.sel) {
			this.add(itm,'<font size="'+itm+'">'+this.sel[itm]+'</font>');
		}
	}
});

var nicEditorFontFamilySelect = nicEditorSelect.extend({
	sel : {'arial' : 'Arial','comic sans ms' : 'Comic Sans','courier new' : 'Courier New','georgia' : 'Georgia', 'helvetica' : 'Helvetica', 'impact' : 'Impact', 'times new roman' : 'Times', 'trebuchet ms' : 'Trebuchet', 'verdana' : 'Verdana'},
	init : function() {
		this.setDisplay(__('Font Family...'));
		if(this.ne.options.fontFamily !== undefined)
			this.sel = this.ne.options.fontFamily;
		for(itm in this.sel) {
			this.add(itm,'<font face="'+itm+'">'+this.sel[itm]+'</font>');
		}
	}
});

var nicEditorFontFormatSelect = nicEditorSelect.extend({
	sel : {'p' : __('Paragraph'), 'pre' : 'Pre', 'h6' : __('Heading6'), 'h5' : __('Heading5'), 'h4' : __('Heading4'), 'h3' : __('Heading3'), 'h2' : __('Heading2'), 'h1' : __('Heading1')},
	init : function() {
		this.setDisplay(__('Font Format...'));
		for(itm in this.sel) {
			var tag = itm.toUpperCase();
			this.add('<'+tag+'>','<'+itm+' style="padding: 0px; margin: 0px;">'+this.sel[itm]+'</'+tag+'>');
		}
	}
});

nicEditors.registerPlugin(nicPlugin,nicSelectOptions);



/* START CONFIG */
var nicLinkOptions = {
	buttons : {
		'link' : {name : __('Add Link'), type : 'nicLinkButton', tags : ['A']},
		'unlink' : {name : __('Remove Link'),  command : 'unlink', noActive : true}
	}
};
/* END CONFIG */

var nicLinkButton = nicEditorAdvancedButton.extend({
	addPane : function() {
		this.ln = this.ne.selectedInstance.selElm().parentTag('A');
		this.addForm({
			'' : {type : 'title', txt : __('Add/Edit Link')},
			'href' : {type : 'text', txt : 'URL', value : 'http://', style : {width: '150px'}},
			'title' : {type : 'text', txt : __('Title')},
			'target' : {type : 'select', txt : __('Open In'), options : {'' : __('Current Window'), '_blank' : __('New Window')},style : {width : '100px'}}
		},this.ln);
	},

	submit : function(e) {
		var url = this.inputs['href'].value;
		if(url == "http://" || url == "") {
			alert(__("You must enter a URL to Create a Link"));
			return false;
		}
		this.removePane();

		if(!this.ln) {
			var tmp = 'javascript:nicTemp();';
			this.ne.nicCommand("createlink",tmp);
			this.ln = this.findElm('A','href',tmp);
		}
		if(this.ln) {
			this.ln.setAttributes({
				href : this.inputs['href'].value,
				title : this.inputs['title'].value,
				target : this.inputs['target'].options[this.inputs['target'].selectedIndex].value
			});
		}
	}
});

nicEditors.registerPlugin(nicPlugin,nicLinkOptions);



/* START CONFIG */
var nicColorOptions = {
	buttons : {
		'forecolor' : {name : __('Change Text Color'), type : 'nicEditorColorButton', noClose : true},
		'bgcolor' : {name : __('Change Background Color'), type : 'nicEditorBgColorButton', noClose : true}
	}
};
/* END CONFIG */

var nicEditorColorButton = nicEditorAdvancedButton.extend({
	width : '136px',
	addPane : function() {
			var colorList = ['000000','993300','333300','003300','003366','000080','333399','333333','800000','FF6600','808000','008000','008080','0000FF','666699','808080','FF0000','FF9900','99CC00','339966','33CCCC','3366FF','800080','999999','FF00FF','FFCC00','FFFF00','00FF00','00FFFF','00CCFF','993366','C0C0C0','FF99CC','FFCC99','FFFF99','CCFFCC','CCFFFF','99CCFF','CC99FF','FFFFFF'];
			var colorItems = new bkElement('DIV').setStyle({width: this.width});

			for(var r in colorList) {
				var colorCode = '#'+colorList[r];
				var colorSquare = new bkElement('DIV').setStyle({'cursor' : 'pointer', 'height' : '18px', 'float' : 'left'}).appendTo(colorItems);
				var colorBorder = new bkElement('DIV').setStyle({'padding': '2px'}).appendTo(colorSquare);
				var colorInner = new bkElement('DIV').setStyle({backgroundColor : colorCode, overflow : 'hidden', width : '11px', height : '11px', 'border' : '1px solid #999'}).addEvent('click',this.colorSelect.closure(this,colorCode)).addEvent('mouseover',this.on.closure(this,colorBorder)).addEvent('mouseout',this.off.closure(this,colorBorder)).appendTo(colorBorder);
				if(!window.opera) {
					colorSquare.onmousedown = colorInner.onmousedown = bkLib.cancelEvent;
				}
			}
			this.pane.append(colorItems.noSelect());
	},

	colorSelect : function(c) {
		this.ne.nicCommand('foreColor',c);
		this.removePane();
	},

	on : function(colorBorder) {
		colorBorder.setStyle({'backgroundColor':'#a6caf0'});
	},

	off : function(colorBorder) {
		colorBorder.setStyle({'backgroundColor':'#FFF'});
	}
});

var nicEditorBgColorButton = nicEditorColorButton.extend({
	colorSelect : function(c) {
		this.ne.nicCommand('hiliteColor',c);
		this.removePane();
	}
});

nicEditors.registerPlugin(nicPlugin,nicColorOptions);



/* START CONFIG */
var nicImageOptions = {
	buttons : {
		'image' : {name : __('Add Image'), type : 'nicImageButton', tags : ['IMG']}
	}
};
/* END CONFIG */

var nicImageButton = nicEditorAdvancedButton.extend({
	addPane : function() {
		this.im = this.ne.selectedInstance.selElm().parentTag('IMG');
		this.addForm({
			'' : {type : 'title', txt : __('Add/Edit Image')},
			'src' : {type : 'text', txt : 'URL', 'value' : 'http://', style : {width: '150px'}},
			'alt' : {type : 'text', txt : __('Alt Text'), style : {width: '100px'}},
			'align' : {type : 'select', txt : __('Align'), options : {none : __('Default'), 'left' : __('Left'), 'right' : __('Right')}}
		},this.im);
	},

	submit : function(e) {
		var src = this.inputs['src'].value;
		if(src == "" || src == "http://") {
			alert(__("You must enter a Image URL to insert"));
			return false;
		}
		this.removePane();

		if(!this.im) {
			var tmp = 'javascript:nicImTemp();';
			this.ne.nicCommand("insertImage",tmp);
			this.im = this.findElm('IMG','src',tmp);
		}
		if(this.im) {
			this.im.setAttributes({
				src : this.inputs['src'].value,
				alt : this.inputs['alt'].value,
				align : this.inputs['align'].value
			});
		}
	}
});

nicEditors.registerPlugin(nicPlugin,nicImageOptions);


/* START CONFIG */
var nicSmileyOptions = {
	buttons : {
		'smiley' : {name : __('Add Smiley'), type : 'nicEditorSmiley', noClose : true}
	}
};
/* END CONFIG */

var nicEditorSmiley = nicEditorAdvancedButton.extend({
	width : '200px',
	smiley : {
	'default' : {
		path : './smiley/default/',
		images : ['smile.gif','coolsmile.gif','angry.gif','astonish.gif','cry.gif','mute.gif','sweat.gif','zzz.gif','puzzled.gif','good.gif','bad.gif','flower.gif','money.gif','love.gif','heartache.gif'],
		size : {width:"21px", height:"21px"}},
	},

	addPane : function() {
		this.smileyItems = new bkElement('DIV').setStyle({width: this.width});
		this.pane.append(this.smileyItems.noSelect());
		this.pageSelect(0);
	},

	pageSelect : function(page) {
		this.smileyItems.innerHTML = '';
		if(this.ne.options.smiley !== undefined)
			var smiley = this.ne.options.smiley;
		else
			var smiley = this.smiley;

		var _page = 0;
		for(var x in smiley) {
			var nowPage = _page == page;
			if(nowPage) {
				var _now = _page;
				for(var i in smiley[x].images) {
					var src = this.ne.options.basePath + smiley[x].path + smiley[x]['images'][i];
					var border = new bkElement('DIV').setStyle({'border': '1px solid #FFF', 'float': 'left', cursor:'pointer', padding: '1px'}).appendTo(this.smileyItems);
					var img = new bkElement('IMG').setAttributes({src:src}).addEvent('click',this.insert.closure(this,src)).addEvent('mouseover',this.on.closure(this,border)).addEvent('mouseout',this.off.closure(this,border)).appendTo(border);
					if(smiley[x].size) img.setStyle(smiley[x].size);
					if(!window.opera) {
						border.onmousedown = img.onmousedown = bkLib.cancelEvent;
					}
				}
			}
			_page++;
		}
		if(_page > 1) {
			var smileyPage = new bkElement('DIV').setStyle({paddingTop: '5px', height:'20px', textAlign:'right', clear:'both'}).appendTo(this.smileyItems);
			if(_now > 0) new bkElement('A').setContent(__('Prev')).setAttributes({href:"javascript:;"}).addEvent('click', this.pageSelect.closure(this, _now-1)).appendTo(smileyPage);
			if(_now < _page-1) new bkElement('A').setContent(__('Next')).setAttributes({href:"javascript:;"}).addEvent('click', this.pageSelect.closure(this, _now+1)).appendTo(smileyPage);
		}
	},

	insert : function(s) {
		this.removePane();
		var tmp = 'javascript:nicImTemp();';
		this.ne.nicCommand("insertImage",tmp);
		this.im = this.findElm('IMG','src',tmp);
		this.im.setAttributes({src : s});
	},

	on : function(smileyBorder) {
		smileyBorder.setStyle({'border':'1px solid #a6caf0'});
	},

	off : function(smileyBorder) {
		smileyBorder.setStyle({'border':'1px solid #FFF'});
	}

});

nicEditors.registerPlugin(nicPlugin,nicSmileyOptions);
