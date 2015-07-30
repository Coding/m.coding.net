/**
 * Created by simonykq on 01/02/2015.
 */
var PROJECT_BLOB_ROUTE = (function(){

    var commitData,
        ownerName,
        projectName,
        commitId,
        projectPath;

    function loadCommit(){

        var path = '/api/user/' + ownerName + '/project/' + projectName + '/git/blob/' + commitId + '/' + projectPath;

        $.ajax({
            url: API_DOMAIN + path,
            dataType: 'json',
            success: function(data){
                if(data.data){
                    commitData = data.data;
                    assembleCommitDOM(commitData);
                }else{
                    alert('Failed to load commits');
                }
            },
            error: function(xhr, type){
                alert('Failed to load commits');
            },
            complete: function(){
                $('div.loading').remove();
            }
        });
    }

    function assembleCommitDOM(commit){
        var file = commit['file'];
        if(file.mode === 'file'){
            var source   = escape2Html(file.data),
                language = file.lang,
                result = hljs.getLanguage(language) ? hljs.highlight(language, source) : hljs.highlightAuto(source),
                code   = result.value,
                line = 1;

            code = code.replace(/^/gm, function() {
                return '<span class="line-number-position">&#x200b;<span class="line-number">' + line++ + '</span></span>';
            });

            $('code.hljs').html(code);
        }else{
            var path = file.path,
                asset_path = API_DOMAIN + '/u/' + ownerName + '/p/' + projectName + '/git/raw/' + commitId + '/' + path;

            $('pre').replaceWith('<div class="text-center"><img width="300" src=' + asset_path + '></div>');
        }

    }

    function escape2Html(str) {
        var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
    }

    function loadProject(){
        var path = '/api/user/' + ownerName + '/project/' + projectName;
        var successed = function(data){
            if(data.data){
                coding.showProjectBreadcrumb(data.data);
            }
        }
       coding.get(path,successed);
    }
    return {
        template_url: '/views/project_blob.html',
        //events: ['longTap', 'swipe'],
        context: '.container',
        before_enter: function(user, project){

            var path =  '/u/' + user + '/p/' +  project;
            //active the project navbar item
            $('#navigator').find('li:first').addClass('active');

            //add the project header and navigation bar
            var project_nav =  '<div class="row project_header nested">' +
                    '<div class="col-xs-3">' +
                    '<a href="#">项目主页</a>' +
                    '</div>' +
                    '<div class="col-xs-3">' +
                    '<a href="#">阅读代码</a>' +
                    '</div>' +
                    '<div class="col-xs-3">' +
                    '<a href="#">合并请求</a>' +
                    '</div>' +
                    '<div class="col-xs-3">' +
                    '<a href="#">项目讨论</a>' +
                    '</div>' +
                    '</div>',
                
                nav_ele     = $(project_nav);

            

            nav_ele.find('div').eq(0).children('a').attr('href', path + '/git');
            nav_ele.find('div').eq(1).children('a').attr('href', path + '/tree');
            nav_ele.find('div').eq(2).children('a').attr('href', path + '/pull');
            nav_ele.find('div').eq(3).children('a').attr('href', path + '/topics');

            //active the current tab
            nav_ele.find('div').eq(1).addClass('active');

            $("nav.main-navbar").after(nav_ele);
            

        },
        on_enter: function(user, project, commit, path){
            
            ownerName = user;
            projectName = project;
            commitId = commit || 'master';
            projectPath = (path || '').replace(/%2F/g,'/');
            loadProject();
            loadCommit();

        },
        on_exit: function(user, project){
            coding.showBanner();
            $('#navigator').find('li').removeClass('active');

            $('.project_navbar').remove();
            $('.project_header').remove();
        }
    }
})();
