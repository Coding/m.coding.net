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
                            $('#div-code').remove();
                        }
                    }
                });
            }

            var changeStyle = function (){
                var controls = new Array('email','password');
                if ($('#code').length === 1){
                    controls.push('code');
                }
                var flag = true;
                for (var i = controls.length - 1; i >= 0; i--) {
                    var value = $.trim($('.input-' + controls[i]).val());
                    var elem = $('.label-' + controls[i]);
                    if (value == ''){
                        elem.css('color','#999999');
                        flag = false;
                    }else{
                        elem.css('color','#222222');
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
                var icode = $('#code');
                if (icode.length === 1){
                    return false;
                }

                var template = '<div class="form-group login-input" id="#div-code">' +
                                            '<label class="label-code" for="code">验证码</label>' +
                                            '<input type="text" class="form-control input-right input-code" name="j_captcha" id="code" placeholder="">' +
                                            '<img class="captcha" height="30" src="https://coding.net/api/getCaptcha">' +
                                        '</div>',
                captcha  = $(template);
                $('button.btn-login').before(captcha);
                $('img.captcha').on('click',refreshCaptcha);
                $('input.input-code').on('input',changeStyle);
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
                var $password =  $('input[name="password"]'),
                    hash = CryptoJS.SHA1($password.val());
                $password.val(hash);
                $.ajax({
                    url: API_DOMAIN + '/api/login',
                    type: 'POST',
                    dataType: 'json',
                    data: $(this).serialize(),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data,status,xhr){
                        //if login success
                        if(data.code === 0){
                            router.run.call(router, '/')
                        } else if (data.code === 903) {
                            if (addCaptcha()){ 
                                return;
                            }else{
                                refreshCaptcha();
                            }
                        }
                        if(data.msg){
                            for(var key in data.msg){
                                alert(data.msg[key]);
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
        }
    }

})();
