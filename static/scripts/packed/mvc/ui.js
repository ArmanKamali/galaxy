var IconButton=Backbone.Model.extend({defaults:{title:"",icon_class:"",on_click:null,menu_options:null,is_menu_button:true,id:null,href:null,target:null,enabled:true,visible:true,tooltip_config:{}}});var IconButtonView=Backbone.View.extend({initialize:function(){this.model.attributes.tooltip_config={placement:"bottom"};this.model.bind("change",this.render,this)},render:function(){this.$el.tooltip("hide");var a=this.template(this.model.toJSON());a.tooltip(this.model.get("tooltip_config"));this.$el.replaceWith(a);this.setElement(a);return this},events:{click:"click"},click:function(a){if(_.isFunction(this.model.get("on_click"))){this.model.get("on_click")(a);return false}return true},template:function(b){var a='title="'+b.title+'" class="icon-button';if(b.is_menu_button){a+=" menu-button"}a+=" "+b.icon_class;if(!b.enabled){a+="_disabled"}a+='"';if(b.id){a+=' id="'+b.id+'"'}a+=' href="'+b.href+'"';if(b.target){a+=' target="'+b.target+'"'}if(!b.visible){a+=' style="display: none;"'}if(b.enabled){a="<a "+a+"/>"}else{a="<span "+a+"/>"}return $(a)}});var IconButtonCollection=Backbone.Collection.extend({model:IconButton});var IconButtonMenuView=Backbone.View.extend({tagName:"div",initialize:function(){this.render()},render:function(){var a=this;this.collection.each(function(d){var b=$("<a/>").attr("href","javascript:void(0)").attr("title",d.attributes.title).addClass("icon-button menu-button").addClass(d.attributes.icon_class).appendTo(a.$el).click(d.attributes.on_click);if(d.attributes.tooltip_config){b.tooltip(d.attributes.tooltip_config)}var c=d.get("options");if(c){make_popupmenu(b,c)}});return this}});var create_icon_buttons_menu=function(b,a){if(!a){a={}}var c=new IconButtonCollection(_.map(b,function(d){return new IconButton(_.extend(d,a))}));return new IconButtonMenuView({collection:c})};var Grid=Backbone.Collection.extend({});var GridView=Backbone.View.extend({});var PopupMenu=Backbone.View.extend({initialize:function(b,a){this.$button=b||$("<div/>");this.options=a||[];var c=this;this.$button.click(function(d){c._renderAndShow(d);return false})},_renderAndShow:function(a){this.render();this.$el.appendTo("body");this.$el.css(this._getShownPosition(a));this._setUpCloseBehavior();this.$el.show()},render:function(){this.$el.addClass("popmenu-wrapper").hide().css({position:"absolute"}).html(this.template(this.$button.attr("id"),this.options));if(this.options.length){var a=this;this.$el.find("li").each(function(c,b){var d=a.options[c];if(d.func){$(this).children("a.popupmenu-option").click(function(e){d.func.call(a,e,d)})}})}return this},template:function(b,a){return['<ul id="',b,'-menu" class="dropdown-menu">',this._templateOptions(a),"</ul>"].join("")},_templateOptions:function(a){if(!a.length){return"<li>(no options)</li>"}return _.map(a,function(d){if(d.divider){return'<li class="divider"></li>'}else{if(d.header){return['<li class="head"><a href="javascript:void(0);">',d.html,"</a></li>"].join("")}}var c=d.href||"javascript:void(0);",e=(d.target)?(' target="'+d.target+'"'):(""),b=(d.checked)?('<span class="fa fa-check"></span>'):("");return['<li><a class="popupmenu-option" href="',c,'"',e,">",b,d.html,"</a></li>"].join("")}).join("")},_getShownPosition:function(b){var c=this.$el.width();var a=b.pageX-c/2;a=Math.min(a,$(document).scrollLeft()+$(window).width()-c-5);a=Math.max(a,$(document).scrollLeft()+5);return{top:b.pageY,left:a}},_setUpCloseBehavior:function(){var b=this;var a=function(c){c.one("click.close_popup",function(){b.remove()})};a($(window.document));a($(window.top.document));_.each(window.top.frames,function(c){a($(c.document))})},addItem:function(b,a){a=(a>=0)?a:this.options.length;this.options.splice(a,0,b);return this},removeItem:function(a){if(a>=0){this.options.splice(a,1)}return this},findIndexByHtml:function(b){for(var a=0;a<this.options.length;a++){if(_.has(this.options[a],"html")&&(this.options[a].html===b)){return a}}return null},findItemByHtml:function(a){return this.options[(this.findIndexByHtml(a))]},toString:function(){return"PopupMenu"}});PopupMenu.make_popupmenu=function(b,c){var a=[];_.each(c,function(f,d){var e={html:d};if(f===null){e.header=true}else{if(jQuery.type(f)==="function"){e.func=f}}a.push(e)});return new PopupMenu($(b),a)};PopupMenu.convertLinksToOptions=function(c,a){c=$(c);a=a||"a";var b=[];c.find(a).each(function(g,e){var f={},d=$(g);f.html=d.text();if(d.attr("href")){var j=d.attr("href"),k=d.attr("target"),h=d.attr("confirm");f.func=function(){if((h)&&(!confirm(h))){return}switch(k){case"_parent":window.parent.location=j;break;case"_top":window.top.location=j;break;default:window.location=j}}}b.push(f)});return b};PopupMenu.fromExistingDom=function(d,c,a){d=$(d);c=$(c);var b=PopupMenu.convertLinksToOptions(c,a);c.remove();return new PopupMenu(d,b)};PopupMenu.make_popup_menus=function(c,b,d){c=c||document;b=b||"div[popupmenu]";d=d||function(e,f){return"#"+e.attr("popupmenu")};var a=[];$(c).find(b).each(function(){var e=$(this),f=$(c).find(d(e,c));a.push(PopupMenu.fromDom(f,e));f.addClass("popup")});return a};var faIconButton=function(a){a=a||{};a.tooltipConfig=a.tooltipConfig||{placement:"bottom"};a.classes=["icon-btn"].concat(a.classes||[]);if(a.disabled){a.classes.push("disabled")}var b=['<a class="',a.classes.join(" "),'"',((a.title)?(' title="'+a.title+'"'):("")),((a.target)?(' target="'+a.target+'"'):("")),' href="',((a.href)?(a.href):("javascript:void(0);")),'">','<span class="fa ',a.faIcon,'"></span>',"</a>"].join("");var c=$(b).tooltip(a.tooltipConfig);if(_.isFunction(a.onclick)){c.click(a.onclick)}return c};var searchInput=function(k){var a=27,h=13,i=$("<div/>"),b={initialVal:"",name:"search",placeholder:"search",classes:"",onclear:function(){},onsearch:function(l){},minSearchLen:0,escWillClear:true,oninit:function(){}};if(jQuery.type(k)==="object"){k=jQuery.extend(true,b,k)}function d(l){var m=$(this).parent().children("input");m.val("");m.trigger("clear:searchInput");k.onclear()}function j(m,l){$(this).trigger("search:searchInput",l);k.onsearch(l)}function c(){return['<input type="text" name="',k.name,'" placeholder="',k.placeholder,'" ','class="search-query ',k.classes,'" ',"/>"].join("")}function g(){return $(c()).css({width:"100%","padding-right":"24px"}).focus(function(l){$(this).select()}).keyup(function(m){if(m.which===a&&k.escWillClear){d.call(this,m)}else{var l=$(this).val();if((m.which===h)||(k.minSearchLen&&l.length>=k.minSearchLen)){j.call(this,m,l)}else{if(!l.length){d.call(this,m)}}}}).val(k.initialVal)}function f(){return'<span class="search-clear fa fa-times-circle"></span>'}function e(){return $(f()).css({position:"absolute",right:"15px","font-size":"1.4em","line-height":"23px",color:"grey"}).click(function(l){d.call(this,l)})}return i.append([g(),e()])};function LoadingIndicator(a,c){var b=this;c=jQuery.extend({cover:false},c||{});function d(){var e=['<div class="loading-indicator">','<div class="loading-indicator-text">','<span class="fa fa-spinner fa-spin fa-lg"></span>','<span class="loading-indicator-message">loading...</span>',"</div>","</div>"].join("\n");var g=$(e).hide().css(c.css||{position:"fixed"}),f=g.children(".loading-indicator-text");if(c.cover){g.css({"z-index":2,top:a.css("top"),bottom:a.css("bottom"),left:a.css("left"),right:a.css("right"),opacity:0.5,"background-color":"white","text-align":"center"});f=g.children(".loading-indicator-text").css({"margin-top":"20px"})}else{f=g.children(".loading-indicator-text").css({margin:"12px 0px 0px 10px",opacity:"0.85",color:"grey"});f.children(".loading-indicator-message").css({margin:"0px 8px 0px 0px","font-style":"italic"})}return g}b.show=function(f,e,g){f=f||"loading...";e=e||"fast";b.$indicator=d().insertBefore(a);b.message(f);b.$indicator.fadeIn(e,g);return b};b.message=function(e){b.$indicator.find("i").text(e)};b.hide=function(e,f){e=e||"fast";if(b.$indicator&&b.$indicator.size()){b.$indicator.fadeOut(e,function(){b.$indicator.remove();if(f){f()}})}else{if(f){f()}}return b};return b};