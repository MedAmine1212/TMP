var language = "en";

/** Translate Next, Previous, Finish Buttons  */
function translate_form_wizard_buttons() {
    $('a[href="#previous"]').html(
        "<span class='i18_links btn-wizard' data-i18n='btn.previous'></span> "
    );
    $('a[href="#next"]').html(
        "<span class='i18_links btn-wizard' data-i18n='btn.next'></span> "
    );
    $('a[href="#finish"]').html(
        "<span class='i18_links btn-wizard' data-i18n='btn.finish'></span> "
    );
    translate_element(".btn-wizard", $("#mylang").val());
}

/** ------------------- Responsive Form ------------------- */

function DesktopForm() {
    $("#form").removeClass("signup-wizard-md");
    $("#form").addClass("signup-wizard-lg");
}

function MobileForm() {
    $("#form").removeClass("signup-wizard-lg");
    $("#form").addClass("signup-wizard-md");
}

function ResizeForm(index) {
    // console.log(index);
    if ($(window).width() < 990) {
        if (index === 1 || index === 2) {
            MobileForm();
        } else {
            DesktopForm();
        }
    } else {
        DesktopForm();
    }
}

/** ------------------- File Input Name Changing ---------------- */

$(document).on("change", ".custom-file-input", function (event) {
    $(this).next(".custom-file-label").html(event.target.files[0].name);
});
/** ------------------------ Password Meter ---------------- */

var options1 = {};
options1.ui = {
    container: "#pwd-container1",
    showVerdictsInsideProgressBar: true,
    viewports: {
        progress: ".pwstrength_viewport_progress",
    },
};
options1.common = {
    debug: false,
};

var global_currentIndex = 0;

/** -------------------- Responsive Form -------------------- */

$(window).resize(function () {
    ResizeForm(global_currentIndex);
});

/** -------------------- Lorsque la page est chargé -------------------- */
$(document).ready(function () {

    /** Traduire en anglais */
    $(".set_en").on("click", function () {
        $("#mylang").val("en");
    });

    /** Traduire en français */
    $(".set_fr").on("click", function () {
        $("#mylang").val("fr");
    });

    ResizeForm(global_currentIndex);
    $(".sk-spinner").hide();
    $(".alert").hide();


    /** ------------------- Ajax Form Handling ----------------- */
    function reCaptchaBeforeSignUp(form){
        grecaptcha.ready(function() {
            grecaptcha.execute('6LerUfMbAAAAAJpMcwL0iz65ugG_P4T-aPUNXqxG', {action: 'submit'}).then(function(token) {
                let forms=new FormData(form);
                forms.append('reCAPTCHA_v3',token);
                signup(forms)
            });
        });
    }

    function signup(form){
        $.ajax({
            type: "POST",
            url: api_gateway_url + "/members-service/api/auth/register",
            data: form,
            processData: false,
            contentType: false,
            success: function (data) {
                $("#form").addClass("animated fadeOutDown");
                $(".alert-success-register").addClass("animated fadeInDown");
                $(".alert-success-register").show();

                $(".alert-error-register").hide();

                $(".sk-spinner").hide();
            },
            error: function (res, status, error) {
                $(".sk-spinner").hide();
                switch (res.status) {
                    case 409:
                        $(".alert-email-used").show();
                        break;
                    case 401:
                        $(".alert-error-robots").show();
                        break;
                    default:
                        console.log(res);
                        $(".alert-error-register").show();
                        break;
                }
            },
        });
    }
    


    $("#form").submit(function (e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.

        var form = $(this).get(0);

        $(".sk-spinner").show();
        $(".alert").hide();

        reCaptchaBeforeSignUp(form);
        
    });

    /** -----------------Wizard Form ------------------------* */

    $("#wizard").steps();
    $("#form")
        .steps({
            bodyTag: "fieldset",
            onStepChanging: function (event, currentIndex, newIndex) {
   
                // Always allow going backward even if the current step contains invalid fields!
                if (currentIndex > newIndex) {
                    return true;
                }

                var form = $(this);

                // Clean up if user went backward before
                if (currentIndex < newIndex) {
                    // To remove error styles
                    $(".body:eq(" + newIndex + ") label.error", form).remove();
                    $(".body:eq(" + newIndex + ") .error", form).removeClass(
                        "error"
                    );
                }

                // Disable validation on fields that are disabled or hidden.
                form.validate().settings.ignore = ":disabled,:hidden";

                // Start validation; Prevent going forward if false
                return form.valid();
            },
            onStepChanged: function (event, currentIndex, priorIndex) {
                global_currentIndex = currentIndex;
                ResizeForm(currentIndex);

                // Suppress (skip) "Warning" step if the user is old enough and wants to the previous step.
                if (currentIndex === 2 && priorIndex === 3) {
                    $(this).steps("previous");
                }
            },
            onFinishing: function (event, currentIndex) {
                var form = $(this);

                // Disable validation on fields that are disabled.
                // At this point it's recommended to do an overall check (mean ignoring only disabled fields)
                form.validate().settings.ignore = ":disabled";

                // Start validation; Prevent form submission if false
                return form.valid();
            },
            onFinished: function (event, currentIndex) {
                var form = $(this);

                // Submit form input
                form.submit();
            },
        })
        .validate({
            errorPlacement: function (error, element) {
                element.before(error);
                translate_element($(element).prev(), $("#mylang").val());
            },
            highlight: function (element, errorClass, validClass) {
                $(element).addClass("error error-input");
                $(element).removeClass("valid-input");
                translate_element($(element).prev(), $("#mylang").val());
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).addClass("valid-input");
                $(element).removeClass("error error-input");
            },
            rules: {
                confirm: {
                    equalTo: "#password",
                },
                password: {
                    strongPassword: true,
                },
                email: {
                    validEmail: true,
                },
                phone: {
                    phoneNumber: true,
                },
            },
        });

    translate_form_wizard_buttons();
    $("#password").pwstrength(options1);

    /*** ------------------ CheckBoxes ----------------------- */
    $(".i-checks").iCheck({
        checkboxClass: "icheckbox_square-green",
        radioClass: "iradio_square-green",
    });

    /** ---------------- Describe Member Types ---------------- */

    $(".i-checks").on("ifChanged", function (event) {
        if ($(this).find(".btn-typeMember").length === 1) {
            if (event.target.checked) {
                switch (event.target.value) {
                    case "1":
                        $("#selectedType").html("Owner");
                        break;
                    case "2":
                        $("#selectedType").html("Associate");
                        break;
                    case "3":
                        $("#selectedType").text("Observer");
                        break;
                }

                $(".descr-" + event.target.value).removeClass("d-none");
            } else {
                $(".descr-" + event.target.value).addClass("d-none");
            }
        }
    });
});
