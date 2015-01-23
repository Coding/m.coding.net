(function(){var a,b,c=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1},d=[].slice;window.Routy||(window.Routy={}),a=window.History,b={},Routy.Router=function(){function a(a,b,c,d){this.state_changers_selector=b,this.event=d,a||(a=""),""!==a&&("/"===a[0]&&(a=a.substr(1)),"/"===a.substr(-1)&&(a=a.substr(0,a.length-1))),this.context=a,this.state_changers_selector||(this.state_changers_selector="a"),c||(c=document),this.context_selector=$(c),this.event||(this.event="click"),this.attach()}return a.prototype.actions=[],a.prototype["default"]=null,a.prototype.apply_context=function(a){return a=""!==a?"/"!==a[0]?this.context+a:this.context+a:this.context+"/"},a.prototype.attach=function(){var a;return a=this,$(window).load(function(){return a.run.call(a,"/")}),this.context_selector.on(this.event,this.state_changers_selector,function(b){var c;return b.preventDefault(),c=$(this).attr("href")||$(this).children("a").attr("href"),null!=c?a.run.call(a,c,b.type):void 0}),$(window).bind("popstate",function(b){return a.run.call(a,b.state.state)})},a.prototype.go=function(a,b,c){var d;return d=c||{},d.state=a,window.history.pushState(d,b||document.title,a)},a.prototype.register=function(a,b){var c,d,e,f,g,h,i,j;return j=b.template_url,g=b.events||this.event.split(" "),e=b.context,d=b.before_enter,f=b.on_enter,c=b.after_enter,h=b.on_exit,i=new Routy.Action(a,j,g,$(e),this,d,f,c,h),b["default"]&&(this["default"]=a),this.actions.push(i)},a.prototype.rootRegister=function(a,b){return this.register("",a,b)},a.prototype.run=function(a,b){var d,e,f,g,h,i,j,k,l,m;for(l=this.actions,h=0,j=l.length;j>h;h++)if(d=l[h],!b||b&&c.call(d.events,b)>=0)for(m=d.route,i=0,k=m.length;k>i;i++)if(g=m[i],f=this.pathRegExp(g,{}).regexp,e=a.match(f),null!=e)return this.go(a),e.shift(),d.call.apply(d,e);return this["default"]?this.run(this["default"]):void 0},a.prototype.pathRegExp=function(a,b){var c,d,e;return c=b.caseInsensitiveMatch,e={originalPath:a,regexp:a},d=e.keys=[],a=a.replace(/([().])/g,"\\$1").replace(/(\/)?:(\w+)([\?\*])?/g,function(a,b,c,e){var f,g;return f="?"===e?e:null,g="*"===e?e:null,d.push({name:c,optional:!!f}),b=b||"",""+(f?"":b)+"(?:"+(f?b:"")+(g&&"(.+?)"||"([^/]+)")+(f||"")+")"+(f||"")}).replace(/([\/$\*])/g,"\\$1"),e.regexp=new RegExp("^"+a+"$",c?"i":""),e},a}(),Routy.Action=function(){function a(a,b,c,d,e,f,g,h,i){var j,k,l,m;for(this.template_url=b,this.events=c,this.context=d,this.router=e,this.before_callback=f,this.callback=g,this.after_callback=h,this.on_exit_callback=i,"string"==typeof a&&(a=a.split(", ")),j=[],this.events=this.events||[],l=0,m=a.length;m>l;l++)k=a[l],k=this.router.apply_context(k),j.push(k);this.route=j}return a.prototype.route=[],a.prototype.context=$("body"),a.prototype.template_url=null,a.prototype.template=null,a.prototype.callback=null,a.prototype.before_callback=null,a.prototype.after_callback=null,a.prototype.condition=null,a.prototype.on_exit_callback=null,a.prototype.events=[],a.prototype.call=function(){var a,b,c=this;return a=1<=arguments.length?d.call(arguments,0):[],b=!0,this.condition&&(b=this.condition.apply(this,a)),this.template?this.digest(a):$.get(this.template_url,function(b){return c.template=b,c.digest(a)})},a.prototype.digest=function(a){return null!=b.on_exit_callback&&b.on_exit_callback.apply(this,a),this.before_callback&&this.before_callback.apply(this,a),this.context.html(this.template),this.callback.apply(this,a),this.after_callback&&this.after_callback.apply(this,a),b=this},a}()}).call(this);var PROJECT_ITEM_ROUTE=function(){function a(a,b){var d="/api/user/"+a+"/project/"+b;$.ajax({url:API_DOMAIN+d,dataType:"json",success:function(a){a.data?(g=a.data,c(g)):(alert("Failed to load project"),$("#project_actions a:first").text(""),$("#project_actions a:last").text(""))},error:function(){alert("Failed to load project"),$("#project_actions a:first").text(""),$("#project_actions a:last").text("")}})}function b(a,b,c,e){var c=c||"master",e=e||"",f="/api/user/"+a+"/project/"+b+"/git/tree/"+c+"/"+e;$.ajax({url:API_DOMAIN+f,dataType:"json",success:function(a){a.data?(h=a.data,d(h,b)):(alert("Failed to load commits"),$("#project_code > .panel-heading").html(""),$("#project_readme > .panel-body").html(""))},error:function(){alert("Failed to load commits"),$("#project_code > .panel-heading").html(""),$("#project_readme > .panel-body").html("")}})}function c(a){var b=a||{};$("#project_actions a:first").text(b.stared?" 已收藏("+b.star_count+") ":" 收藏("+b.star_count+") "),$("#project_actions a:last").text(b.watched?" 已关注("+b.watch_count+") ":" 关注("+b.watch_count+") ");var c='<img src="'+f(b.icon)+'" height="40" width="40"> <a href="'+b.owner_path+'">'+b.owner_user_name+'</a>/<a href="'+b.project_path+'">'+b.name+"</a>";$("#project_owner").html(c),$("#project_description").text(b.description)}function d(a,b){var c=a||{},d=c.ref,f=c.lastCommit,g=c.files,h=c.readme.preview,i='<span class="panel-title"><img src="#" height="20" width="20"> '+f.committer.name+' </span><span class="comment-meta"></span><span class="comment-hash pull-right"><a href="#" style="color: #999"></a></span>',j=$(i);console.log(f.committer.name),console.log(f.shortMessage),j.find(".panel-title > img").attr("src",f.committer.avatar),j.eq(1).text(" "+f.shortMessage+" "),j.find(".comment-hash > a").attr("href",b+"/git/commit/"+f.commitId).text(f.commitId.substr(0,10)),$("#project_code > .panel-heading").html(j),$("#project_readme > .panel-body").html(h);for(var k=null,l=null,m=0;m<g.length;m++)k=g[m],l=e(k,b,d),$("#project_code > .list-group").append(l)}function e(a,b,c){var d,e='<li class="list-group-item list-group-item-info glyphicon"> </li>',f='<a href="#"></a>',g=null;return"file"===a.mode?(d=$(f).attr("href",b+"/git/blob/"+c+"/"+a.path).text(a.name),g=$(e).addClass("glyphicon-list-alt").append(d)):"tree"===a.mode&&(d=$(f).attr("href",b+"/git/tree/"+c+"/"+a.path).text(a.name),g=$(e).addClass("glyphicon-folder-close").append(d)),g}function f(a){return"/"===a.substr(0,1)&&(a=API_DOMAIN+a),a}var g,h;return{template_url:"/views/project.html",context:".container",before_enter:function(a,b){var c="/u/"+a+"/p/"+b;$("title").text(a+"/"+b),$("#page_name").html('<a href="#">'+a+'</a>/<a href="'+c+'">'+b+"</a>"),$("#navigator").append('<li class="nav-divider"></li><li><a href="'+c+'/code">代码</a></li><li><a href="#">合并请求</a></li><li><a href="#">讨论</a></li><li><a href="#">演示</a></li><li><a href="#">质量管理</a></li>'),$('<div id="project_actions" class="btn-group btn-group-justified" role="group" aria-label="..."><div class="btn-group" role="group"><a class="btn btn-default glyphicon glyphicon-star"> <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> </a></div><div class="btn-group" role="group"><a class="btn btn-default glyphicon glyphicon-eye-open"> <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> </a></div></div>').insertAfter($("#bs-example-navbar-collapse-1")),$("#navigator").find("li:eq(5)").addClass("active")},on_enter:function(d,e){a(d,e),b(d,e),$("#project_actions a.glyphicon-star").click(function(a){if(a.preventDefault(),g){var b="/api/user/"+d+"/project/"+e;b+=g.stared?"/unstar":"/star",$(this).html(' <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> '),$.post(API_DOMAIN+b,function(){g.stared=!g.stared,g.stared?g.star_count+=1:g.star_count-=1,c(g)})}}),$("#project_actions a.glyphicon-eye-open").click(function(a){if(a.preventDefault(),g){var b="/api/user/"+d+"/project/"+e;b+=g.watched?"/unwatch":"/watch",$(this).html(' <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> '),$.post(API_DOMAIN+b,function(){g.watched=!g.watched,g.watched?g.watch_count+=1:g.watch_count-=1,c(g)})}})},on_exit:function(){$("title").text(""),$("#page_name").text(""),$("#navigator").find("li").removeClass("active"),$("#navigator > li").slice(-6).remove(),$("#project_actions").remove()}}}(),PROJECT_ROUTE=function(){function a(a){var c,d,a=a||{},e=a.list,f=document.createDocumentFragment();h=document.getElementById("projects_list");for(var g=0;g<e.length;g++)c=e[g],d=b(c),f.appendChild(d[0]),i.push(c);h.appendChild(f)}function b(a){var b='<a href="#" class="list-group-item"><h4 class="list-group-item-heading"><img src="#" width="40" height="40"> <span></span><span class="glyphicon glyphicon-eye-open pull-right icon-small" aria-hidden="true"></span><span class="glyphicon glyphicon-random pull-right icon-small" aria-hidden="true"></span></h4><p class="list-group-item-text"><span></span></p></a>',c=$(b);return c.attr("href",a.project_path),c.find("h4 > img").attr("src",e(a.icon)),c.find("h4 > span:first").text(a.name),c.find("h4 > span:eq(1)").text(a.fork_count),c.find("h4 > span:eq(2)").text(a.watch_count),c.find("p > span:first").text(a.description),c.on("swipe click",function(a){a.preventDefault(),$(h).find("a").removeClass("active"),$(this).addClass("active")}),c}function c(b){g++;var c=$("#load_more");c.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...'),b+="?page="+g+"&pageSize="+f,$.ajax({url:API_DOMAIN+b,dataType:"json",success:function(b){b.data?a(b.data):alert("Failed to load projects")},error:function(){alert("Failed to load projects")},complete:function(){c.text("更多项目")}})}function d(){for(var a,c=document.createDocumentFragment(),d=document.getElementById("projects_list"),e=0;e<i.length;e++)a=b(i[e]),c.appendChild(a[0]);d.appendChild(c)}function e(a){return"/"===a.substr(0,1)&&(a=API_DOMAIN+a),a}var f=10,g=0,h=null,i=[];return{template_url:"/views/projects.html",context:".container",before_enter:function(){$("title").text("精彩项目"),$("#page_name").text("精彩项目"),$("#navigator").find("li:first").addClass("active")},on_enter:function(){0===i.length?c("/api/public/all"):d();var a=$("#load_more");a.on("click",function(a){a.preventDefault(),c("/api/public/all")})},on_exit:function(){$("title").text(""),$("#page_name").text(""),$("#navigator").find("li").removeClass("active")},"default":!0}}(),PP_ROUTE=function(){function a(a){var c,d=a||{},e=document.createDocumentFragment();j=document.getElementById("pp_list");for(var f=0;f<d.length;f++)c=b(d[f]),e.appendChild(c[0]),k[d[f].id]=d[f];j.appendChild(e)}function b(a){var e='<div class="detailBox"><div class="titleBox"><div class="commenterImage"><a href="#"><img src="#" height="30" width="30" /></a></div><a class="commenterName" href="#"><label></label></a><a href="#" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></a><a href="#" class="pull-right star"><span class="glyphicon glyphicon-heart"></span></a><a href="#" class="pull-right comment"><span class="glyphicon glyphicon-comment"></span></a><div class="row"><div class="col-sm-12 like_users"></div></div></div><div class="commentBox"><p class="taskDescription"></p></div><div class="actionBox"><ul class="commentList"></ul><form class="form-inline commentSubmit" role="form"><div class="input-group"><input type="text" class="form-control" placeholder="在此输入评论内容"><span class="input-group-btn"><button class="btn btn-default" type="submit"><span class="glyphicon glyphicon-arrow-right"></span></button></span></div></form></div></div>',f=$(e);f.attr("id",a.id);var g=a.owner.name,h=a.owner.global_key;f.find(".titleBox > .commenterImage > a").attr("href","/u/"+h),f.find(".titleBox > .commenterImage > a > img").attr("src",a.owner.avatar),f.find(".titleBox > a.commenterName").attr("href","/u/"+h),f.find(".titleBox > a.commenterName > label").text(g),f.find(".titleBox > a.star > span").text(a.likes),a.liked&&f.find(".titleBox > a.star > span").css("color","#D95C5C");for(var i,j=a.like_users,l=f.find(".titleBox .like_users"),m=0;m<j.length;m++)i=d(j[m]),l.append(i);f.find(".titleBox > a.comment").attr("href","/u/"+h+"/pp/"+a.id),f.find(".titleBox > a.comment > span").text(a.comments),f.find(".commentBox > .taskDescription").html(a.content);for(var n,o=a.comment_list,p=f.find(".actionBox > .commentList"),q=0;q<o.length;q++)n=c(o[q]),p.append(n);return f.on("click",".star",function(c){c.preventDefault();var d=a.id,e=a.liked?"/api/tweet/"+d+"/unlike":"/api/tweet/"+d+"/like";return $.post(API_DOMAIN+e,function(){a.liked=!a.liked,a.liked?a.likes+=1:a.likes-=1;var c=b(a);f.replaceWith(c),k[d]=a}),!1}),f.on("click",".close",function(b){b.preventDefault();var c=confirm("确认删除该泡泡？");if(c){var d=a.id,e="/api/tweet/"+d;$.ajax({url:API_DOMAIN+e,type:"DELETE",success:function(a){if(a.msg)for(var b in a.msg)alert(a.msg[b]);else delete k[d],f.remove()}})}return!1}),f.on("submit",".commentSubmit",function(b){b.preventDefault();var d=a.id,e=$(this).find("input"),f=$(this).find("button"),g="/api/tweet/"+d+"/comment";return $.post(API_DOMAIN+g,{content:e.val()},function(a){if(a.msg)for(var b in a.msg)alert(a.msg[b]);if(a.data){a.data.owner={};var d=c(a.data);p.append(d)}e.removeAttr("disabled"),f.removeAttr("disabled")}),e.attr("disabled","disabled"),f.attr("disabled","disabled"),!1}),f}function c(a){var b='<li><div class="commenterImage"><a href="#"><img src="#" /></a></div><a class="commenterName" href="#"><span class="comment-meta"></span></a><div class="commentText"><p></p><span class="date sub-text"></span><a class="reply" href="#" class="comment-hash"> 回复 </a><a class="delete" href="#" class="comment-hash"> 删除 </a></div></li>',c=$(b),d=a.owner.name,e=a.owner.global_key;return c.find(".commenterImage > a").attr("href","/u/"+e),c.find(".commenterImage img").attr("src",a.owner.avatar),c.find("a.commenterName").attr("href","/u/"+e),c.find("a.commenterName > span").text(d),c.find(".commentText > p").html(a.content),c.find(".commentText > .date").text(new Date(a.created_at)),c.find(".commentText > a").attr("id",a.owner_id),c.on("click",".reply",function(a){a.preventDefault();var b=c.parents(".commentList").next("form").find("input");if(""===b.val())b.val("@"+d);else{var e=b.val();b.val(e+", @"+d)}return!1}),c.on("click",".delete",function(b){b.preventDefault();var d=confirm("确认删除该评论？");if(d){var e=c.parents(".detailBox").attr("id"),f=a.id,g="/api/tweet/"+e+"/comment/"+f;$.ajax({url:API_DOMAIN+g,type:"DELETE",success:function(a){if(a.msg)for(var b in a.msg)alert(a.msg[b]);else{for(var d=k[e].comment_list,g=d.length-1;g>=0;g--)d[g].id===f&&d.splice(g,1);c.remove()}}})}return!1}),c}function d(a){var b='<a class="pull-right" style="padding: 0 3px 0" href="#"><img src="#" height="15" width="15" /></a>',c=$(b);return c.attr("href","/u/"+a.global_key),c.find("img").attr("src",a.avatar),c}function e(){k={},h=99999999}function f(){k={},h=99999999,$("#pp_list > .detailBox").remove(),g("/api/tweet/public_tweets")}function g(b){var c=$("#load_more"),d=$("#refresh");c.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...'),d.children("span").addClass("glyphicon-refresh-animate"),b+="?last_id="+h+"&sort="+i,$.ajax({url:API_DOMAIN+b,dataType:"json",success:function(b){b.data?(a(b.data),h=b.data[b.data.length-1].id):alert("Failed to load pp")},error:function(){alert("Failed to load pp")},complete:function(){c.text("更多泡泡"),d.children("span").removeClass("glyphicon-refresh-animate")}})}var h=99999999,i="time",j=null,k={};return{template_url:"/views/pp.html",context:".container",before_enter:function(a){$("title").text("冒泡"),$("#page_name").text("冒泡"),$("#navigator").append('<li class="nav-divider"></li><li><a href="/pp/hot">热门</a></li>'),$('<div id="pp_actions" class="btn-group btn-group-justified" role="group" aria-label="..."><div class="btn-group" role="group"><a class="btn btn-default glyphicon glyphicon-edit" data-toggle="modal" data-target="#pp_input"> 来，冒个泡吧！ </a></div><div class="btn-group" role="group"><a class="btn btn-default glyphicon glyphicon glyphicon-camera"> 发图片 </a></div></div>').insertAfter($("#bs-example-navbar-collapse-1")),"hot"===a?$("#navigator").find("li:last-child").addClass("active"):$("#navigator").find("li:eq(1)").addClass("active")},on_enter:function(a){i="hot"===a?"hot":"time",f(),$("#load_more").on("click",function(a){a.preventDefault(),g("/api/tweet/public_tweets")}),$("#refresh").on("click",function(a){a.preventDefault(),f()}),$("#pp_input").on("click","#pp_submit",function(a){a.preventDefault();var c=$("#pp_content"),d=$(this);return""!==c.val()&&(d.attr("disabled","disabled"),$.post(API_DOMAIN+"/api/tweet",{content:c.val()},function(a){if(a.msg)for(var e in a.msg)alert(a.msg[e]);if(a.data){a.data.owner={};var f=b(a.data);j.prepend(f),c.val(""),$("#pp_input").modal("hide")}d.removeAttr("disabled")})),!1})},on_exit:function(){$("title").text(""),$("#page_name").text(""),$("#navigator > li").slice(-1).remove(),$("#pp_actions").remove(),$("#navigator").find("li").removeClass("active"),e()}}}(),PP_ITEM_ROUTE=function(){function a(a){var b="/api/user/key/"+a;$.ajax({url:API_DOMAIN+b,dataType:"json",success:function(b){b.data?(h=b.data,c(h)):(alert("Failed to load user"+a),$("#user-heading").html(""))},error:function(){alert("Failed to load user"+a),$("#user-heading").html("")}})}function b(a,b){var c="/api/tweet/"+a+"/"+b;$.ajax({url:API_DOMAIN+c,dateType:"json",success:function(a){a.data?(g=a.data,d(g)):alert("Failed to load pp"+b)},error:function(){alert("Failed to load pp"+b)},complete:function(){$("button.btn-warning").remove()}})}function c(a){var b=a||{},d='<h4 class="panel-title"><img src="#" height="25" width="25" /><a class="panel-title" data-toggle="collapse" href="#accordion" data-target="#user-details" aria-expanded="true" aria-controls="user-details"></a><a href="#" class="pull-right watched"></a><a href="#" class="pull-right followed"></a></h4>',e='<p><span class="description" ></span></p><p><button type="button" class="btn btn-primary follow"></button><button type="button" class="btn btn-default message">给TA私信</button></p><table class="table"><tr class="join"><td>加入时间</td><td></td></tr><tr class="activity"><td>最后活动</td><td></td></tr><tr class="sufix"><td>个性后缀</td><td></td></tr></table>',f=$(d),g=$(e);f.find("img").attr("src",b.avatar),f.find("a.panel-title").text(" "+b.name+" "),f.find("a.watched").attr("href","/u/"+b.global_key+"/followers").text(" "+b.fans_count+"粉丝 "),f.find("a.followed").attr("href","/u/"+b.global_key+"/friends").text(" "+b.follows_count+"关注 "),f.click(function(a){a.preventDefault();var b=$("#user-details");return b.collapse(b.hasClass("in")?"hide":"show"),!1});var h=g.find("button.follow");if(h.text(b.followed?"取消关注":"关注"),g.find(".description").text(b.slogan),g.find("table .join td:eq(1)").text(new Date(b.created_at)),g.find("table .activity td:eq(1)").text(new Date(b.last_activity_at)),g.find("table .sufix td:eq(1)").text(b.global_key),""!==b.sex){var i=0===b.sex?"男":"女";g.find("table tbody").append('<tr class="sex"><td>性别</td><td>'+i+"</td></tr>")}if(""!==b.job_str&&g.find("table tbody").append('<tr class="job"><td>工作</td><td>'+b.job_str+"</td></tr>"),""!==b.location&&g.find("table tbody").append('<tr class="location"><td>地点</td><td>'+b.location+"</td></tr>"),""!==b.tags_str){for(var j=b.tags_str.split(","),k=[],l=0;l<j.length;l++){var m=j[l],n='<a href="/tags/search/'+m+'">'+m+"</a>";k.push(n)}g.find("table tbody").append('<tr class="tags"><td>标签</td><td>'+k.join()+"</td></tr>")}g.on("click","button.follow",function(a){a.preventDefault(),h.attr("disabled","disabled");var d=b.followed?"/api/user/unfollow":"/api/user/follow";$.post(API_DOMAIN+d+"?users="+b.global_key,function(a){if(a.msg)for(var d in a.msg)alert(a.msg[d]);else b.followed=!b.followed,b.follows_count=b.followed?b.follows_count+1:b.follows_count-1,c(b);h.removeAttr("disabled")})}),$("#user-details > .panel-body").html(g),$("#user-heading").html(f)}function d(a){var b=a||{},c='<div class="detailBox"><div class="titleBox"><div class="commenterImage"><a href="#"><img src="#" height="30" width="30" /></a></div><a class="commenterName" href="#"><label></label></a><a href="#" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></a><a href="#" class="pull-right star"><span class="glyphicon glyphicon-heart"></span></a><a href="#" class="pull-right comment"><span class="glyphicon glyphicon-comment"></span></a><div class="row"><div class="col-sm-12 like_users"></div></div></div><div class="commentBox"><p class="taskDescription"></p></div><div class="actionBox"><ul class="commentList"></ul><form class="form-inline commentSubmit" role="form"><div class="input-group"><input type="text" class="form-control" placeholder="在此输入评论内容"><span class="input-group-btn"><button class="btn btn-default" type="submit"><span class="glyphicon glyphicon-arrow-right"></span></button></span></div></form></div></div>',h=$(c);h.attr("id",b.id);var i=b.owner.name,j=b.owner.global_key;h.find(".titleBox > .commenterImage > a").attr("href","/u/"+j),h.find(".titleBox > .commenterImage > a > img").attr("src",b.owner.avatar),h.find(".titleBox > a.commenterName").attr("href","/u/"+j),h.find(".titleBox > a.commenterName > label").text(i),h.find(".titleBox > a.star > span").text(b.likes),b.liked&&h.find(".titleBox > a.star > span").css("color","#D95C5C");for(var k,l=b.like_users,m=h.find(".titleBox .like_users"),n=0;n<l.length;n++)k=f(l[n]),m.append(k);h.find(".titleBox > a.comment").attr("href","/u/"+j+"/pp/"+b.id),h.find(".titleBox > a.comment > span").text(b.comments),h.find(".commentBox > .taskDescription").html(b.content);for(var o,p=b.comment_list,q=h.find(".actionBox > .commentList"),r=0;r<p.length;r++)o=e(p[r]),q.append(o);h.on("click",".star",function(a){a.preventDefault();var c=b.id,e=b.liked?"/api/tweet/"+c+"/unlike":"/api/tweet/"+c+"/like";return $.post(API_DOMAIN+e,function(){b.liked=!b.liked,b.liked?b.likes+=1:b.likes-=1,d(b),g=b}),!1}),h.on("click",".close",function(a){a.preventDefault();var c=confirm("确认删除该泡泡？");if(c){var d=b.id,e="/api/tweet/"+d;$.ajax({url:API_DOMAIN+e,type:"DELETE",success:function(a){if(a.msg)for(var b in a.msg)alert(a.msg[b]);else h.remove()}})}return!1}),h.on("submit",".commentSubmit",function(a){a.preventDefault();var c=b.id,d=$(this).find("input"),f=$(this).find("button"),g="/api/tweet/"+c+"/comment";return $.post(API_DOMAIN+g,{content:d.val()},function(a){if(a.msg)for(var b in a.msg)alert(a.msg[b]);if(a.data){a.data.owner={};var c=e(a.data);q.append(c)}d.removeAttr("disabled"),f.removeAttr("disabled")}),d.attr("disabled","disabled"),f.attr("disabled","disabled"),!1}),$("#accordion").after(h)}function e(a){var b='<li><div class="commenterImage"><a href="#"><img src="#" /></a></div><a class="commenterName" href="#"><span class="comment-meta"></span></a><div class="commentText"><p></p><span class="date sub-text"></span><a class="reply" href="#" class="comment-hash"> 回复 </a><a class="delete" href="#" class="comment-hash"> 删除 </a></div></li>',c=$(b),d=a.owner.name,e=a.owner.global_key;return c.find(".commenterImage > a").attr("href","/u/"+e),c.find(".commenterImage img").attr("src",a.owner.avatar),c.find("a.commenterName").attr("href","/u/"+e),c.find("a.commenterName > span").text(d),c.find(".commentText > p").html(a.content),c.find(".commentText > .date").text(new Date(a.created_at)),c.find(".commentText > a").attr("id",a.owner_id),c.on("click",".reply",function(a){a.preventDefault();var b=c.parents(".commentList").next("form").find("input");if(""===b.val())b.val("@"+d);else{var e=b.val();b.val(e+", @"+d)}return!1}),c.on("click",".delete",function(b){b.preventDefault();var d=confirm("确认删除该评论？");if(d){var e=c.parents(".detailBox").attr("id"),f=a.id,h="/api/tweet/"+e+"/comment/"+f;$.ajax({url:API_DOMAIN+h,type:"DELETE",success:function(a){if(a.msg)for(var b in a.msg)alert(a.msg[b]);else{for(var d=g.comment_list,e=d.length-1;e>=0;e--)d[e].id===f&&d.splice(e,1);c.remove()}}})}return!1}),c}function f(a){var b='<a class="pull-right" style="padding: 0 3px 0" href="#"><img src="#" height="15" width="15" /></a>',c=$(b);return c.attr("href","/u/"+a.global_key),c.find("img").attr("src",a.avatar),c}var g,h;return{template_url:"/views/pp_item.html",context:".container",before_enter:function(a){$("title").text(a+"的冒泡"),$("#page_name").text(a+"的冒泡"),$("#navigator").append('<li class="nav-divider"></li><li><a href="/pp/hot">热门</a></li>')},on_enter:function(c,d){a(c),b(c,d)},on_exit:function(){$("title").text(""),$("#page_name").text(""),$("#navigator > li").slice(-1).remove()}}}();!function(a,b,c,d){$(function(){var e=new Routy.Router(null,"a",".main","click longTap swipe");e.register("/projects",a),e.register("/u/:user/p/:project, /u/:user/p/:project/git, /u/:user/p/:project/code",b),e.register("/pp",c),e.register("/pp/:hot",c),e.register("/u/:user/pp/:pp",d)})}(PROJECT_ROUTE,PROJECT_ITEM_ROUTE,PP_ROUTE,PP_ITEM_ROUTE);