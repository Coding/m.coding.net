/**
 * Created by simonykq on 08/03/2015.
 */
var LOGIN_ROUTE = (function(){

    return {
        template_url: '/views/login.html',
        context: '.container',
        before_enter: function() {
            if (router.current_user) {
                location.href = '/';
            }

            $('#navigator').find(".li-login").addClass('active');
        },
        on_enter: function(){
            var refreshCaptcha = function(){
                 $.ajax({
                    url: API_DOMAIN + '/api/captcha/login',
                    dataType: 'json',
                    success: function(data){
                        if(data.data){
                            $('img.captcha').attr('src', API_DOMAIN + '/api/getCaptcha?code=' + Math.random());
                        }else{
                            $('#div-captcha').remove();
                        }
                    }
                });
            }

            var changeStyle = function (){
                var controls = new Array('email','password');
                if ($('#captcha').length === 1){
                    controls.push('captcha');
                }
                var flag = true;
                for (var i = controls.length - 1; i >= 0; i--) {
                    var value = $.trim($('.input-' + controls[i]).val());
                    if (value == ''){
                        flag = false;
                    }
                };

                var elem_btn = $('.btn-login');
                if (flag){
                    elem_btn.removeAttr('disabled');
                    elem_btn.css('color','#ffffff');
                }else{
                    elem_btn.attr('disabled','disabled');
                    elem_btn.css('color','rgba(255,255,255,0.5)');
                }
            }

            var addCaptcha = function(){
                var captcha = $('#captcha');
                if (captcha.length === 1){
                    return false;
                }

                var template = '<div class="form-group login-input" id="#div-captcha">' +
                                            '<input type="text" class="form-control input-right input-captcha" name="j_captcha" id="captcha" placeholder="验证码">' +
                                            '<span class="btn-clear x-j_captcha">&nbsp;</span>' +
                                            '<img class="captcha" height="30" src="https://coding.net/api/getCaptcha">' +
                                        '</div>',
                captchaHtml  = $(template);
                $('button.btn-login').before(captchaHtml);
                $('img.captcha').on('click',refreshCaptcha);
                $('input.input-captcha').on('input',changeStyle);
                bindClearInput('j_captcha');
                changeStyle();
                refreshCaptcha();
                return true;
            }

            $.ajax({
                url: API_DOMAIN + '/api/captcha/login',
                dataType: 'json',
                success: function(data){
                    if(data.data){
                        addCaptcha();
                    }
                }
            });

            $('#login_form').submit(function(e){
                e.preventDefault();
                var $email = $('input[name="email"]'),
                    $password =  $('input[name="password"]'),
                    $remember_me = $('input[name="remember_me"]').prop('checked'),
                    hash = CryptoJS.SHA1($password.val()),
                    post_data = 'email=' + $.trim($email.val()) + '&password=' + hash + '&remember_me=' + $remember_me;

                if ($('input[name="j_captcha"]').length === 1){
                    post_data += '&j_captcha=' + $('input[name="j_captcha"]').val();
                }

                $.ajax({
                    url: API_DOMAIN + '/api/login',
                    type: 'POST',
                    dataType: 'json',
                    data: post_data,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data,status,xhr){
                        //if login success
                        if(data.code === 0){
                            router.run.call(router, '/user/projects')
                        } else if (data.code === 903) {
                            if (addCaptcha()){
                                return;
                            }else{
                                refreshCaptcha();
                            }
                            if(data.msg){
                                for(var key in data.msg){
                                    alert(data.msg[key]);
                                }
                            }
                        }else if(data.code == 3205){
                            var fa2_code = prompt("请输入您的两步验证码");
                            if(fa2_code !=null){
                                $.ajax({
                                    url: API_DOMAIN + '/api/check_two_factor_auth_code',
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {code: fa2_code},
                                    xhrFields: {
                                        withCredentials: true
                                    },
                                    success:function(data){
                                        if(data.code !=0 ){
                                            alert('登录失败，请确认设备时间准确');
                                        }else{
                                            router.run.call(router, '/');
                                        }
                                    },
                                    error: function(){
                                        alert('登录失败');
                                    }
                                });
                            }else {

                            }
                        }
                    },
                    error: function(){
                        alert('Failed to login');
                    }
                });
            });

            $('input.input-email').on('input',changeStyle);
            $('input.input-password').on('input',changeStyle);
            bindClearInput('email');
            bindClearInput('password');

            $('#forget-password').on('click',function(){
                $('.login-cover').show();
                $('.login-controls').show();
            });

            $('button.cancel').on('click',function(){
                $('.login-cover').hide();
                $('.login-controls').hide();
            });
        },
        on_exit: function(){
            $('#navigator').find('li').removeClass('active');
        }
    }


})();
