function reCaptchaBeforeLogin(form, login_btn){
    grecaptcha.ready(function() {
        grecaptcha.execute('6LerUfMbAAAAAJpMcwL0iz65ugG_P4T-aPUNXqxG', {action: 'submit'}).then(function(token) {
            let forms=new FormData(form);
            forms.append('reCAPTCHA_v3',token);
            Login(forms, login_btn);
        });
    });
}


function Login(form,ladda_btn) {
   
            ladda_btn.ladda( 'start' );
            return $.ajax({
                type: "POST",
                url: "api/login",
                data: form,
                dataType: "json",
                processData: false,
                contentType: false,

                success: function (data) {
                    ladda_btn.ladda( 'stop' );
           
                    createMemberCookies(data);
                    window.location.href = "/home";
                },

                error: function (res, status, error) {
                    ladda_btn.ladda( 'stop' );
                    
                    if (res.status == 401) {
                        /** 401 : Failed Attempt      */
                        

                        if (res.responseJSON.attempts === 2) {
                            $(".alert-second-attempt").addClass(
                                "animated fadeInDown"
                            );
                            $(".alert-second-attempt").show();
                        } else if (res.responseJSON.attempts === 3) {
                            $(".alert-block").addClass("animated fadeInDown");
                            $(".alert-block").show();
                        }else if (res.responseJSON.attempts === 4) {
                            $(".alert-error-robots").addClass(
                                "animated fadeInDown"
                            );
                            $(".alert-error-robots").show();
                        }else{
                            $(".alert-error-auth").show();
                            $(".alert-error-auth").addClass("animated fadeInDown");
                        }
                    } else if (res.status == 403) {
                        switch (res.responseJSON.label) {
                            case 'suspicious':
                                data = res.responseJSON;
                            /** Connexion Méfiante */

                                createCookie('_token',data.id_token,data.exp);

                                window.location = "/suspicious_device";
                                break;

                            default:
                                $(".alert-info").show();
                                $(".alert-info").addClass("animated fadeInDown");
                                break;
                        }
                    } else {
                        $(".alert-error-general").show();
                        $(".alert-error-general").addClass("animated fadeInDown");
                    }
                },
            });


}

function translatePlaceholders(lang) {
    switch (lang) {
        case "en":
            $("input[name=email]").attr("placeholder", "Email");
            $("input[name=password]").attr("placeholder", "Password");
            break;

        case "fr":
            $("input[name=email]").attr("placeholder", "Email");
            $("input[name=password]").attr("placeholder", "Mot de passe");
            break;
    }
}

/**
 * Hide Loading Spinner Once DOM is Completely Ready
 */
$(document).ready(function () {

    let login_btn = $(".btn-login");
    login_btn.ladda();

    translatePlaceholders($("#mylang").val());

    function hideAlerts() {
        $(".alert").hide();
    }

    function isLoading(bool) {
        if (bool == true) {
            $(".content-page").find(".sk-spinner").show();
        } else {
            $(".content-page").find(".sk-spinner").hide(); 
        }
    }

    isLoading(false);
    hideAlerts();

    $("#form").submit(function (e) {
        hideAlerts();
        e.preventDefault(); // avoid to execute the actual submit of the form.

        var form = $(this).get(0);

      //  return Login(form, login_btn);
      return reCaptchaBeforeLogin(form,login_btn);
    });
});

