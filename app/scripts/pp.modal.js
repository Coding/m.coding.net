// 总的管控模块
Zepto(function(){

    //取消发/评论冒泡

    $('html').off('click','.modal-backdrop').on('click','.modal-backdrop',function(){
        if( $('#pp_submit').is('[disabled]') ){
            closeModal();
        }
    });

    $('#pp_cancel').off('click').on('click',function(){
        closeModal();
    });

    //历史记录回滚监听，这里需要判断是 back 使然，还是浏览器操作使然
    // fucking html5 history api
    $(window).on('popstate', function(event){
        if( window.location.hash=='#pp_input' ){
            $('html').removeClass('chose-friend').removeClass('chose-location');
            $('#pp_input').removeClass('chose-friend').removeClass('chose-location');
        }

        if( !window.location.hash ){
            closeModal();
        }
    });

    //清空数据，重置modal数据
    $(window).on('message', function(event){
        if( event.data == 'ppModelOpenning' ){
            resetModal();
        }
    });

    function resetModal(){
        //打开的时候模态框重置，主要是数据的处理
        //表情归位
        $('#pp_input').removeClass('chose-emoji');
        $('#input_tool').find('.emojiboard').addClass('chose-emojis').removeClass('chose-monkeys');

        //清空地理位置
        $('#pp_location').removeClass('success').removeAttr('location').find('#location_name').text('显示地理位置');
        $('#pp_location')[0].locationInfo = null;
        $('#pp_location').removeClass('show-location');

        //清空图片数据
        window.postMessage('ppUploaderReset','*');
    }

    function closeModal(){
        //关闭的时候模态框重置，主要是类名的处理
        window.postMessage('scrollToOpenning', '*');

        $("#pp_input").modal('hide');
        $('#pp_input').removeClass('sending').removeClass('success').removeClass('failed');
        
        $('html').removeClass('chose-friend').removeClass('chose-location');
        $('#pp_input').removeClass('chose-friend').removeClass('chose-location');
        $('html').removeClass('pp-modaling-small').removeClass('pp-modaling-large');

        $('.modal-backdrop').remove();

        window.history.replaceState(null,null, window.location.pathname );
    }
});

// 小弹窗各种滚动翻页修复
Zepto(function(){

    //整个容器的处理，防止 touchmove 事件冒泡，导致页面滑动
    $('#pp_input').off('touchmove').on('touchmove',function(event){
        if( $('#pp_input').is('.small') && !$(event.target).is('.slide i') ){
            return false;
        }
    });
    //遮罩层的处理，防止 touchmove 冒泡，导致页面滑动
    $('html').on('touchmove','.modal-backdrop',function(event){
        return false;
    });

    var openSclY = 0;
    //打开的时候，位置修复
    $(window).on('message', function(){
        if( event.data == 'ppModelOpenning' ){
            openSclY = window.scrollY;
            setTimeout(function(){
                window.postMessage('scrollToOpenning', '*');
            },10);
        }
    });

    $(window).on('message', function(){
        if( event.data = 'scrollToOpenning' ){
            window.scrollTo(0,openSclY);
        }
    });
});

// 表情功能模块
Zepto(function(){

    var slide_emojis,
        slide_monkeys;

    var emojiMap = {
        emoji: [
            "smiley",
            "heart_eyes",
            "pensive",
            "flushed",
            "grin",
            "kissing_heart",
            "wink",
            "angry",
            "disappointed",
            "disappointed_relieved",
            "sob",
            "stuck_out_tongue_closed_eyes",
            "rage",
            "persevere",
            "unamused",
            "smile",
            "mask",
            "kissing_face",
            "sweat",
            "joy",
            "blush",
            "cry",
            "stuck_out_tongue_winking_eye",
            "fearful",
            "cold_sweat",
            "astonished",
            "smirk",
            "scream",
            "sleepy",
            "confounded",
            "relieved",
            "smiling_imp",
            "ghost",
            "santa",
            "dog",
            "pig",
            "cat",
            "+1",
            "-1",
            "facepunch",
            "fist",
            "v",
            "muscle",
            "clap",
            "point_left",
            "point_up_2",
            "point_right",
            "point_down",
            "ok_hand",
            "heart",
            "broken_heart",
            "sunny",
            "moon",
            "star2",
            "zap",
            "cloud",
            "lips",
            "rose",
            "coffee",
            "birthday",
            "clock10",
            "beer",
            "mag",
            "iphone",
            "house",
            "car",
            "gift",
            "soccer",
            "bomb",
            "gem",
            "alien",
            "100",
            "money_with_wings",
            "video_game",
            "hankey",
            "sos",
            "zzz",
            "microphone",
            "umbrella",
            "book",
            "pray",
            "rocket",
            "tea",
            "watermelon"
        ],
        coding: [
            {code: "哈哈", image: "coding-emoji-01"},
            {code: "吐", image: "coding-emoji-02"},
            {code: "压力山大", image: "coding-emoji-03"},
            {code: "忧伤", image: "coding-emoji-04"},
            {code: "坏人", image: "coding-emoji-05"},
            {code: "酷", image: "coding-emoji-06"},
            {code: "哼", image: "coding-emoji-07"},
            {code: "你咬我啊", image: "coding-emoji-08"},
            {code: "内急", image: "coding-emoji-09"},
            {code: "32个赞", image: "coding-emoji-10"},
            {code: "加油", image: "coding-emoji-11"},
            {code: "闭嘴", image: "coding-emoji-12"},
            {code: "wow", image: "coding-emoji-13"},
            {code: "泪流成河", image: "coding-emoji-14"},
            {code: "NO!", image: "coding-emoji-15"},
            {code: "疑问", image: "coding-emoji-16"},
            {code: "耶", image: "coding-emoji-17"},
            {code: "生日快乐", image: "coding-emoji-18"},
            {code: "求包养", image: "coding-emoji-19"},
            {code: "吹泡泡", image: "coding-emoji-20"},
            {code: "睡觉", image: "coding-emoji-21"},
            {code: "惊讶", image: "coding-emoji-22"},
            {code: "Hi", image: "coding-emoji-23"},
            {code: "打发点咯", image: "coding-emoji-24"},
            {code: "呵呵", image: "coding-emoji-25"},
            {code: "喷血", image: "coding-emoji-26"},
            {code: "Bug", image: "coding-emoji-27"},
            {code: "听音乐", image: "coding-emoji-28"},
            {code: "垒码", image: "coding-emoji-29"},
            {code: "我打你哦", image: "coding-emoji-30"},
            {code: "顶足球", image: "coding-emoji-31"},
            {code: "放毒气", image: "coding-emoji-32"},
            {code: "表白", image: "coding-emoji-33"},
            {code: "抓瓢虫", image: "coding-emoji-34"},
            {code: "下班", image: "coding-emoji-35"},
            {code: "冒泡", image: "coding-emoji-36"},
            {code: "2015", image: "coding-emoji-38"},
            {code: "拜年", image: "coding-emoji-39"},
            {code: "发红包", image: "coding-emoji-40"},
            {code: "放鞭炮", image: "coding-emoji-41"},
            {code: "求红包", image: "coding-emoji-42"},
            {code: "新年快乐", image: "coding-emoji-43"}
        ]
    }

    initialize();

    function initialize(){
        setEmoji();
        setSlide();

        eventAndHandlers();
    }

    function eventAndHandlers(){
        $('#input_tool').off();
        $('#emoji_board').off();

        //表情卡片展示 状态切换
        $('#input_tool').on('click','.icon-emoji,.icon-keyboard',function(){
            window.postMessage('slideReset','*');
            $('#pp_input').toggleClass('chose-emoji');
        });

        //洋葱猴、经典表情 切换
        $('#input_tool').on('click','.emojis,.monkeys',function(){
            window.postMessage('slideReset','*');

            $('.emojiboard').removeClass('chose-emojis').removeClass('chose-monkeys');
            $('.emojiboard').addClass('chose-' + $(this).attr('class') );
        });

        //表情的添加和删除
        $('#emoji_board').on('click','i',function(){

            var emoji_code;
            var contentVal = $('#pp_content').val();

            if( $(this).hasClass('icon-delete') ){
                contentVal = contentVal.replace(/\:(\w)*?\:\s*$/,'');
            }else if( $(this).attr('code') ){
                emoji_code = $(this).attr('code');
                contentVal = contentVal + ':' + emoji_code + ':';
            }

            $('#pp_content').val( contentVal );

            window.postMessage('checkModalCouldSend','*');
        });
        
        //滑动组件归位
        $(window).on('message', function(event){
            if( event.data == 'slideReset' ){
                justifyEmojis();
                slide_emojis.goTo(0);
                slide_monkeys.goTo(0);
            }
        });

        $(window).on('onorientationchange' in window ? 'orientationchange' : 'resize',function(){
            justifyEmojis();
        });
    }

    function setEmoji(){

        $('#slide_emojis').find('.dot').html('');
        $('#slide_monkeys').find('.dot').html('');

        setEmojis();

        setMonkeys();

        function setEmojis(){
            var emojis = emojiMap.emoji;

            emojis.length = 80; //限制，只需要 80 个表情，刚好四屏

            var str = '';
            var x,y,cols;

            for( i in emojis ){
                if( i%20 == 0 ){

                    if( i!=0 ){
                        str += '<i class="icon-delete"></i>';
                    }

                    str += '</li><li>'
                    cols = 0;

                    $('#slide_emojis').find('.dot').append('<span></span>');

                }else{
                    cols ++;
                }

                if( cols>0 && cols%7==0 ){
                    str += '<br/>';
                }

                //根据表情id 调整表情的位置
                x = -24*i;
                y = 0;

                str += '<i code="' + emojis[i] + '" index="' + i + '" style="background-position: ' + x + 'px ' + y + 'px;"></i>';

            }

            str += '<i class="icon-delete"></i>';

            str = str.replace(/^(\<(\/)?li\>)*|(\<(\/)?li\>)*$/g,'');
            str = '<li>' + str + '</li>';

            $('.emoji-emojis').html('').append( $(str) );

            $('#slide_emojis').find('.dot').find('span').first().addClass('cur');

        }

        function setMonkeys(){
            var monkeys = emojiMap.coding;

            monkeys.length = 40; //限制数量，刚好五屏

            var str = '';
            var x,y,cols;

            for( i in monkeys ){
                if( i%8 == 0 ){
                    str += '</li><li>'
                    cols = 0;

                    $('#slide_monkeys').find('.dot').append('<span></span>');

                }else{
                    cols ++;
                }

                if( cols>0 && cols%4==0 ){
                    str += '<br/>';
                }

                //根据表情id 调整表情的位置
                x = -50*i;
                y = 0;

                str += '<i code="' + monkeys[i]['code'] + '" index="' + i + '" style="background-position: ' + x + 'px ' + y + 'px;"></i>';

            }

            str = str.replace(/^(\<(\/)?li\>)*|(\<(\/)?li\>)*$/g,'');
            str = '<li>' + str + '</li>';

            $('.emoji-monkeys').html('').append( $(str) );

            $('#slide_monkeys').find('.dot').find('span').first().addClass('cur');
        }
    }

    function setSlide(){
        
        slide_emojis = $('#slide_emojis').swipeSlide({
            transitionType : 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
            callback : function(i){
                $('#slide_emojis').find('.dot').children().eq(i).addClass('cur').siblings().removeClass('cur');
            }
        });
        
        slide_monkeys = $('#slide_monkeys').swipeSlide({
            transitionType : 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
            callback : function(i){
                $('#slide_monkeys').find('.dot').children().eq(i).addClass('cur').siblings().removeClass('cur');
            }
        });
    }

    function justifyEmojis(){
        var board_padding = 10;
        var board_width = $('#pp_form').width();

        var emoji_width = 24;
        var monkey_width = 50;

        var emojis_margin_horizontal = ( ( board_width - board_padding*2 )/7 - emoji_width)/2;
        var monkeys_margin_horizontal = ( ( board_width - board_padding*2 )/4 - monkey_width)/2;

        $('#slide_emojis').find('i').css({
            marginLeft: emojis_margin_horizontal + 'px',
            marginRight: emojis_margin_horizontal + 'px'
        })

        $('#slide_monkeys').find('i').css({
            marginLeft: monkeys_margin_horizontal + 'px',
            marginRight: monkeys_margin_horizontal + 'px'
        })
    }
});

// @好友功能模块
Zepto(function(){
    var friends = [],
        at_friends = [];

    initialize();

    function initialize(){
        eventAndHandlers();
        setAt();
    }

    function addHistory(state){
        // fucking html5 history api
        window.location.hash = '#' + state;
    }

    function eventAndHandlers(){
        //展开关闭好友列表 切换 
        $('#input_tool').on('click','.icon-at', openFriendList);
        $('#cancel_at').off('click').on('click', closeFriendsList);

        //@好友
        $('#friends_list').off('click').on('click', 'li[name]' ,function(){
            var name = $(this).attr('name');
            var content = $('#pp_content').val();
            content = content + '@' + name + ' ';

            $('#pp_content').val( content );
            at_friends.push( name );

            closeFriendsList();

            window.postMessage('checkModalCouldSend','*');
        });

        //删除@好友，通过正则和 at_friends 列表协同判断
        $('#pp_content').on('keyup', function(event){
            if( !at_friends.length ) return;
            if( event.keyCode !== 8 ) return;

            var content = $('#pp_content').val();

            var last_at = at_friends[ at_friends.length -1 ];
            var match = content.match(/\@([^\@]*)$/);
            if( match && match[1] === last_at.slice(0,-1) ){
                content = content.replace(/\@[^\@]*$/,'');
                $('#pp_content').val( content );
                at_friends.pop();
                
                window.postMessage('checkModalCouldSend','*');
            }
        });
    }

    function setAt(){
        var uri,
            page,
            pageSize,
            totalRow,
            totalPage;

        init();
        getFriends();

        var loadtimes = 0;

        function init(){
            uri = '/api/user/friends';
            page = 1;
            pageSize = 1000; //这里需要一次把好友数据加载完

            //事件绑定
            $('#friend_search').on('keyup change', searchFriends);
        }

        function getFriends(){
            loadtimes ++;
            $.ajax({
                url: API_DOMAIN + uri,
                dataType: 'json',
                data: {
                    page: page ++, //page 是从 1 开始的，每用一次递增
                    pageSize: pageSize
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function(data){
                    if(data.data){
                        success(data.data);
                    }else{
                        failed(data);
                    }
                },
                error: function(xhr, type){
                    failed();
                }
            });
        }

        function success(data){
            totalPage = data.totalPage;
            totalRow = data.totalRow;
            Array.prototype.push.apply(friends, data.list);
            showFriends( friends );
        }

        function failed(){
            //加载失败自动重复加载
            if(loadtimes<2){
                setTimeout(function(){
                    getFriends();
                },30);
            }else{
                alert('Failed to load friends');
            }
        }

        function searchFriends(){
            var keyword = $('#friend_search').val().trim();
            var searched_friends = [];

            if( !keyword ) return showFriends( friends );

            friends.forEach(function(friend){
                // name 权值 8分*匹配字符数
                // name_pinyin 权值 4分*匹配字符数
                // tags_str 权值 2分*匹配字符数
                // slogan 权值 1分*匹配字符数
                friend.zIndex = 0;

                if( friend.name.indexOf( keyword ) > -1 ){
                    friend.zIndex += 8;
                }
                if( friend.name_pinyin.indexOf( keyword ) > -1 ){
                    friend.zIndex += 4;
                }
                if( friend.tags_str.indexOf( keyword ) > -1 ){
                    friend.zIndex += 2;
                }
                if( friend.slogan.indexOf( keyword ) > -1 ){
                    friend.zIndex += 1;
                }

                friend.zIndex && searched_friends.push( friend );
            });

            searched_friends.sort(function(x,y){
                return x.zIndex > x.zIndex ? 1 : -1;
            });

            showFriends( searched_friends );
        }
    }

    function showFriends(friends){
        var liStr = '';
        
        friends.forEach(function(friend){

            //对于没有设置头像的用户，手动补全相对随机头像地址
            friend.avatar = friend.avatar.replace(/(?=^\/)/,'https://coding.net');

            liStr += '<li name=' + friend.name + '><img src="' + friend.avatar + '"><span>' + friend.name + '</span></li>';
        });

        $('#friends_list').html( liStr || '<p class="nothing">没有找到相关用户</p>' );
    }

    function closeFriendsList(){
        $('html').removeClass('chose-friend');
        $('#pp_input').removeClass('chose-friend');
        window.history.back();
    }

    function openFriendList(){
        $('#friend_search').val('');
        showFriends(friends);
        $('html').removeClass('chose-location').addClass('chose-friend'); //小弹窗的时候朋友列表对 modal背景的影响，所以需要通知到全局 html
        $('#pp_input').removeClass('chose-location').addClass('chose-friend');

        //历史记录管控，在 DOM 操作完成后再操作历史记录，防止意外刷新
        addHistory('chose_friends');

        //回到顶部，保证主界面不受影响
        setTimeout(function(){
            window.scrollTo(0,0);
        },10)
    }
});

// 上传图片功能模块
Zepto(function(){
    var images = {};
    var uploader;

    initialize();

    function initialize(){
        eventAndHandlers();
        setUploader();
    }

    function eventAndHandlers(){
        //删除图片
        $('#image_board').off('click').on('click','i.icon-delete',function(){
            removeImage( $(this).closest('.image[key]').attr('key') );
        });

        //清空图片
        $(window).on('message', function(event){
            if( event.data == 'ppUploaderReset' ){
                for(key in images){
                    removeImage(key);
                }
            }
        });
    }

    function setUploader(){
        uploaderPrepare( uploaderReady );

        function uploaderReady( Uploader ){
            uploader = new Uploader({
                target: $('#pp_image'),
                path: API_DOMAIN + '/api/tweet/insert_image',
                filefiled: 'tweetImg',
                multiple: true,
                multipleSize: 6,
                start: start,
                uploading: uploading,
                success: success,
                failed: failed,
                appenddata: {},
                ajaxconfig: {
                    xhrFields: {
                        withCredentials: true
                    }
                }
            });
        }

        function start( url, key ){
            uploader.multipleSize --;
            var imageurl = '';
            var image = $('<div class="image"><i class="icon icon-delete"></i></div>');

            if(url){
                imageurl = url;
                image.css('background-image', 'url(' + imageurl + ')');
            }
            image.addClass('upload-start').attr('key', key);

            $('#pp_image').before( image );

            images[key] = {
                imageurl: imageurl,
                image: image
            }
        }

        function uploading( persent, key ){
            images[key]['image'].removeClass('upload-start').addClass('upload-ing');
            window.postMessage('checkModalCouldSend','*');
        }

        function success( data, key ){
            typeof data == 'string' && ( data=JSON.parse(data) );

            if( !data.code ){
                if(!images[key]['imageurl']){
                    images[key]['imageurl'] = data.data;
                    images[key]['image'].css('background-image', 'url(' + imageurl + ')');
                }
                images[key]['image'].attr('url', data.data);

                images[key]['image'].removeClass('upload-start').removeClass('upload-ing').addClass('upload-success');
                window.postMessage('checkModalCouldSend','*');
            }else{
                failed( '上传失败', key );
            }
        }

        function failed( err, key ){
            alert( err || '上传失败' );
            removeImage(key);
        }
    }

    function removeImage(key){
        if(!images[key]) return;
        uploader.multipleSize ++;
        images[key]['image'].remove();
        window.postMessage('checkModalCouldSend','*');
        delete images[key];
    }

    function uploaderPrepare( success ){
        if(window.rangoUploader){
            callSuccessOnce();
            return;
        }

        var script = $('<script>');
        //这里可能会有代码冗余
        script.on('load', function(){
            setTimeout(function(){
                if( window.rangoUploader ){
                    callSuccessOnce();
                }
            },0);
        });

        script.attr('src', '/scripts/rangoUploader.js').appendTo( $('body') );

        //这里可能会有代码冗余
        function callSuccessOnce(){
            success && success( window.rangoUploader );
            callSuccessOnce = function(){};
        }
    }
});

// 地理位置功能模块
Zepto(function(){

    initialize();

    function initialize(){
        eventAndHandlers();
        setLocation();
    }

    function addHistory(state){
        // fucking html5 history api
        window.location.hash = '#' + state;
    }

    function eventAndHandlers(){
        //定位，展开关闭位置列表 切换，
        $('#pp_location').off('touchend').on('touchend','.icon-right',function(){
            setTimeout(function(){
                $('#pp_input').removeClass('chose-friend').addClass('chose-location');
                $('html').removeClass('chose-friend').addClass('chose-location');
                addHistory('chose_location');
            },30);
        });

        $('#cancel_location').off('click').on('click',function(){
            $('#pp_input').removeClass('chose-location');
            $('html').removeClass('chose-location');
            window.history.back();
        });
    }

    function setLocation(){
        var BAIDU_MAP_AK = 'mlGflW2HdV47hAFTsmxGvGrH'; //上线烦请换成 coding 的百度地图 ak
        var lo,la,
            firstLocation = false,
            chosedLocation = {
                name: ''
            },
            locationLists = [],
            userRejected = false;

        var listCount = 10;

        init();

        function init(){

            //用户触发主动定位需求
            $('#pp_location').off('click').on('click',function(){
                if( !$(this).hasClass('show-location') ){
                    $(this).addClass('show-location');
                    getLocationByGPS();
                }
            });

            $('#location_list').off('click').on('click', 'li' ,function(){
                var name = $(this).attr('name');
                $('#location_name').html(name);
                $('#pp_input').removeClass('chose-location');
                $('html').removeClass('chose-location');
                choseLocationName( name );
            });

            $('#load_more_location').off('click').on('click',function(){
                listCount += 10;
                listLocations();
            });
        }

        //通过 GPS 定位
        function getLocationByGPS(){
            if(navigator.geolocation){
                gettingLocation();
                navigator.geolocation.getCurrentPosition(function(position){
                    lo = position.coords.longitude;
                    la = position.coords.latitude;
                    showPosition();
                },function(error){
                    switch(error.code){
                        case error.PERMISSION_DENIED:
                          deniedGetLocation();
                          break;
                        case error.POSITION_UNAVAILABLE:
                          break;
                        case error.TIMEOUT:
                          break;
                        case error.UNKNOWN_ERROR:
                          break;
                    }
                    getLocationFailed();
                });
                
                //setTimeout(getLocationByIP,2000);
            }else{
                getLocationFailed();
            }
        }

        //只要不是用户主动拒绝，此段代码都会强制执行一次
        function showPosition(){
            if(userRejected) return;

            //只此执行一次
            showPosition = function(){};

            getGeoInfo();
            getLocationImage();
            getLocationList();

            function getLocationImage(){
                var src = API_DOMAIN + '/api/map/staticimage' + 
                          '?width=' + 620 +
                          '&heigth=' + 320 +
                          '&center=' + lo + ',' + la +
                          '&copyright=' + 1 +
                          '&zoom=15';
                $('#location_image').attr('src', src);
            }

            function getGeoInfo(){
                return;//接口还是不好使
                $.ajaxJSONP({
                    url: API_DOMAIN + '/api/map/geocoder/v2?callback=?',
                    data: {
                        ak: BAIDU_MAP_AK,
                        location: la + ',' + lo,
                        pois: 0,
                        output: 'json'
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data){

                        if(data.status) return;

                        var name = data.addressComponent.city + data.addressComponent.district;
                        var address = data.addressComponent.province + name;

                        firstLocation = {
                            name: name,
                            address: address
                        }
                    },
                    error: function(err){
                    }
                });
            }

            function getLocationList(){
                var localArr = ['大厦','餐厅','购物','娱乐','旅游','旅店','酒店','街','楼','小区'];
                var count = localArr.length;
                localArr.forEach(getPOI);

                function getPOI( keyword ){
                    $.ajaxJSONP({
                        url: API_DOMAIN + '/api/map/place/v2/search?callback=?',
                        data: {
                            ak: BAIDU_MAP_AK,
                            query: keyword,
                            page_size: 10,
                            page_num: 0,
                            scope: 1,
                            location: la + ',' + lo,
                            radius: 1000,
                            output: 'json'
                        },
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function(data){
                            if(data.status) return;
                            collectLocations( data.results );
                        },
                        error: function(err){
                        },
                        complete: function(){
                            count --;
                        }
                    });
                }

                function collectLocations( lists ){
                    locationLists = locationLists.concat( lists );
                    locationLists.sort(function(x,y){
                        var Xdistance = Math.sqrt( Math.pow(x.location.lng - lo,2) + Math.pow(x.location.lat - la,2) );
                        var Ydistance = Math.sqrt( Math.pow(y.location.lng - lo,2) + Math.pow(y.location.lat - la,2) );
                        return Xdistance < Ydistance ? -1 : 1;
                    });

                    //数据去重
                    for(i=locationLists.length-1; i>1 ; i--){
                        if(locationLists[i].name == locationLists[i-1].name){
                            locationLists.splice(i,1);
                        }
                    }

                    setTimeout(function(){
                        if(count <= 0){
                            listLocations();
                        }
                    },0)
                }
            }
        }

        function choseLocationName( name ){

            if(firstLocation && firstLocation.name == name){
                chosedLocation = firstLocation;
                getLocationSuccess();
                return;
            }

            var index = 0;
            locationLists.forEach(function(loc,i){
                if(loc.name === name){
                    index = i;
                }
            });
            chosedLocation = locationLists[index];
            getLocationSuccess();
        }

        function findFirstLocation(){
            //ip 和 Geo接口不好使的情况下先使用这个
            //策略，遍历locationLists，至少找到两个相同的的 市区 匹配模式
            var match = false;
            var bestlocation = '';
            locationLists.forEach(function(location){
                if(match) return;
                var maybeBestlocation = location.address.replace(/^([^市]*市[^区]*区)?.*/,'$1');
                if(maybeBestlocation){
                    if( bestlocation == maybeBestlocation ){
                        match = true;
                    }else{
                        bestlocation = maybeBestlocation;
                    }
                }
            });
            if(match){
                firstLocation = {
                    name: bestlocation.replace(/.*?省/,''),
                    address: bestlocation
                }
            }
        }

        function listLocations(){
            var count = listCount;
            var domStr = '';
            findFirstLocation();

            if(firstLocation){
                domStr += '<li name="' + firstLocation.name + '"><p>' + firstLocation.name + '</p><p>' + firstLocation.address + '</p></li>'
                count --;
            }

            locationLists.forEach(function(location){
                (count-- > 0) && (domStr += '<li name="' + location.name + '"><p>' + location.name + '</p><p>' + location.address + '</p></li>');
            });
            $('#location_list').html( domStr );

            checkHaveMore();

            chosedLocation = firstLocation || locationLists[0];
            chosedLocation && getLocationSuccess();
        }

        function checkHaveMore(){
            if( locationLists.length > listCount ){
                $('#location_list').addClass('hasmore');
            }else{
                $('#location_list').removeClass('hasmore');
            }
        }

        function deniedGetLocation(){
            userRejected = true;
            $('#location_name').html('地理位置获取失败');
            $('#pp_location').removeClass('success').removeClass('getting').addClass('failed');
        }

        function getLocationFailed(){
            if( $('#pp_location').hasClass('success') ){
                //可能会获取到，但是夹带 getCurrentPosition 错误，没关系
                return;
            }

            $('#location_name').html('地理位置获取失败');
            $('#pp_location').removeClass('success').removeClass('getting').addClass('failed');
        }

        function gettingLocation(){
            $('#location_name').html('正在获取地理位置...');
            $('#pp_location').removeClass('success').removeClass('failed').addClass('getting');
        }

        function getLocationSuccess(){
            var locationName = chosedLocation.name;
            var locationAddress = chosedLocation.address;
            var coord = (la+'').substr(0,9) + ',' + (lo+'').substr(0,9) + ',' + 0;
            $('#location_name').html( locationName );
            $('#pp_location').removeClass('getting').removeClass('failed').addClass('success')[0].locationInfo = {
                location: locationName,
                address: locationAddress,
                coord: coord
            };
        }
    }
});