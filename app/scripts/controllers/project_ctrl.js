/**
 * Created by simonykq on 21/12/2014.
 */
var PROJECT_ROUTE = (function(){

    var pageSize  = 10,
        pageCount = 0,
        list      = null,
        pros  = [];

    function assembleDOM(data){
        var data = data || {};

        var projects = data.list,
            fragment = document.createDocumentFragment(),
            pro,
            ele;

        list = document.getElementById('projects_list');

        for (var i = 0; i < projects.length; i++) {
            pro = projects[i];
            ele = createTemplate(pro);

            fragment.appendChild(ele[0]);
            pros.push(pro);

        }

        list.appendChild(fragment);
    }

    function createTemplate(pro){
        var template = '<a href="#" class="list-group-item">' +
                            '<h4 class="list-group-item-heading">' +
                                '<img src="#" width="40" height="40"> ' +
                                '<span></span>' +
                                '<span class="glyphicon glyphicon-eye-open pull-right icon-small" aria-hidden="true"></span>' +
                                '<span class="glyphicon glyphicon-random pull-right icon-small" aria-hidden="true"></span>' +
                            '</h4>' +
                            '<p class="list-group-item-text">' +
                                '<span></span>' +
                                //'<span class="pull-right">' +
                                //    '<img src="#" height="20" width="20" src="#">' +
                                //    '<b></b>' +
                                //'</span>' +
                            '</p>' +
                        '</a>',
            ele  = $(template);

        ele.attr('href', pro['project_path']);
        ele.find('h4 > img').attr('src', pro['icon']);
        ele.find('h4 > span:first').text(pro['name']);
        ele.find('h4 > span:eq(1)').text(pro['fork_count']);
        ele.find('h4 > span:eq(2)').text(pro['watch_count']);
        ele.find('p > span:first').text(pro['description']);
        //ele.find('p img').attr('src', pro['owner_user_picture']);
        //ele.find('p b').text(pro['owner_user_name']);


        ele.on('swipe click', function(e){
            e.preventDefault();
            $(list).find('a').removeClass('active');
            $(this).addClass('active');
        });

        return ele;
    }

    function loadMore(path){

        pageCount++;
        var element = $("#load_more");
        element.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...');
        path += '?page=' + pageCount + '&' + 'pageSize=' + pageSize;

       $.ajax({
		  url: path,
		  dataType: 'json',
		  success: function(data){
              if(data.data){
                  assembleDOM(data.data);
              }else{
                  alert('Failed to load projects');
              }
		  },
		  error: function(xhr, type){
		    alert('Failed to load projects');
		  },
		  complete: function(){
		  	element.text('更多项目');
		  }
		});

    }

    function showAll(){
        var fragment = document.createDocumentFragment(),
            list     = document.getElementById('projects_list'),
            ele;
        for (var i = 0; i < pros.length; i++) {
            ele = createTemplate(pros[i]);
            fragment.appendChild(ele[0]);
        }
        list.appendChild(fragment)
    }

    return {
        template_url: '/views/projects.html',
        context: ".container",
        before_enter: function(){
            //set up the page information in the banner
            $('title').text('精彩项目');
            $('#page_name').text('精彩项目');

            $('#navigator').find('li:first').addClass('active');

        },
        on_enter: function(){
            //check if it has previous loaded element
            if(pros.length === 0){
                loadMore("/api/public/all");
            }
            //otherwise just show the cached result
            else{
                showAll();
            }
            var element = $("#load_more");
            element.on('click', function(e){
                e.preventDefault();
                loadMore("/api/public/all");
            });
        },
        on_exit: function(){
            //clean up the banner
            $('title').text('');
            $('#page_name').text('');
            $('#navigator').find('li').removeClass('active');

        },
        default: true
    }

})();
