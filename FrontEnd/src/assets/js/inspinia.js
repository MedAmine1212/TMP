/*
 *
 *   INSPINIA - Responsive Admin Theme
 *   version 2.9.3
 *
 */

var animation_sliding;

$(document).ready(function () {

    // Start UX Sliding Animation

    animation_sliding = LinearGradientTransition();
    $(".loading-content").addClass("fadeInDown").show();

    // Fast fix bor position issue with Propper.js
    // Will be fixed in Bootstrap 4.1 - https://github.com/twbs/bootstrap/pull/24092
    Popper.Defaults.modifiers.computeStyle.gpuAcceleration = false;

    // Add body-small class if window less than 768px
    if (window.innerWidth < 769) {
        $("body").addClass("body-small");
    } else {
        $("body").removeClass("body-small");
    }

    // MetisMenu
    var sideMenu = $("#side-menu").metisMenu();

    // Collapse ibox function
    $(".collapse-link").on("click", function (e) {
        e.preventDefault();
        var ibox = $(this).closest("div.ibox");
        var button = $(this).find("i");
        var content = ibox.children(".ibox-content");
        content.slideToggle(200);
        button.toggleClass("fa-chevron-up").toggleClass("fa-chevron-down");
        ibox.toggleClass("").toggleClass("border-bottom");
        setTimeout(function () {
            ibox.resize();
            ibox.find("[id^=map-]").resize();
        }, 50);
    });

    // Close ibox function
    $(".close-link").on("click", function (e) {
        e.preventDefault();
        var content = $(this).closest("div.ibox");
        content.remove();
    });

    // Fullscreen ibox function
    $(".fullscreen-link").on("click", function (e) {
        e.preventDefault();
        var ibox = $(this).closest("div.ibox");
        var button = $(this).find("i");
        $("body").toggleClass("fullscreen-ibox-mode");
        button.toggleClass("fa-expand").toggleClass("fa-compress");
        ibox.toggleClass("fullscreen");
        setTimeout(function () {
            $(window).trigger("resize");
        }, 100);
    });

    // Close menu in canvas mode
    $(".close-canvas-menu").on("click", function (e) {
        e.preventDefault();
        $("body").toggleClass("mini-navbar");
        SmoothlyMenu();
    });

    // Run menu of canvas
    $("body.canvas-menu .sidebar-collapse").slimScroll({
        height: "100%",
        railOpacity: 0.9,
    });

    // Open close right sidebar
    $(".right-sidebar-toggle").on("click", function (e) {
        e.preventDefault();
        $("#right-sidebar").toggleClass("sidebar-open");
    });

    // Initialize slimscroll for right sidebar
    $(".sidebar-container").slimScroll({
        height: "100%",
        railOpacity: 0.4,
        wheelStep: 10,
    });

    // Open close small chat
    $(".open-small-chat").on("click", function (e) {
        e.preventDefault();
        $(this).children().toggleClass("fa-comments").toggleClass("fa-times");
        $(".small-chat-box").toggleClass("active");
    });

    // Initialize slimscroll for small chat
    $(".small-chat-box .content").slimScroll({
        height: "234px",
        railOpacity: 0.4,
    });

    // Small todo handler
    $(".check-link").on("click", function () {
        var button = $(this).find("i");
        var label = $(this).next("span");
        button.toggleClass("fa-check-square").toggleClass("fa-square-o");
        label.toggleClass("todo-completed");
        return false;
    });

    // Append config box / Only for demo purpose
    // Uncomment on server mode to enable XHR calls
    //$.get("skin-config.html", function (data) {
    //    if (!$('body').hasClass('no-skin-config'))
    //        $('body').append(data);
    //});

    // Minimalize menu
    $(".navbar-minimalize").on("click", function (event) {
        event.preventDefault();
        $("body").toggleClass("mini-navbar");
        SmoothlyMenu();
    });

    // Tooltips demo
    $(".tooltip-demo").tooltip({
        selector: "[data-toggle=tooltip]",
        container: "body",
    });

    // Move right sidebar top after scroll
    $(window).scroll(function () {
        if ($(window).scrollTop() > 0 && !$("body").hasClass("fixed-nav")) {
            $("#right-sidebar").addClass("sidebar-top");
        } else {
            $("#right-sidebar").removeClass("sidebar-top");
        }
    });

    $("[data-toggle=popover]").popover();

    // Add slimscroll to element
    $(".full-height-scroll").slimscroll({
        height: "100%",
    });
});

// Minimalize menu when screen is less than 768px
$(window).bind("resize", function () {
    if (window.innerWidth < 769) {
        $("body").addClass("body-small");
    } else {
        $("body").removeClass("body-small");
    }
});

// Fixed Sidebar
$(window).bind("load", function () {
    if ($("body").hasClass("fixed-sidebar")) {
        $(".sidebar-collapse").slimScroll({
            height: "100%",
            railOpacity: 0.9,
        });
    }
});

// check if browser support HTML5 local storage
function localStorageSupport() {
    return "localStorage" in window && window["localStorage"] !== null;
}

// Local Storage functions
// Set proper body class and plugins based on user configuration
$(document).ready(function () {
    if (localStorageSupport()) {
        var collapse = localStorage.getItem("collapse_menu");
        var fixedsidebar = localStorage.getItem("fixedsidebar");
        var fixednavbar = localStorage.getItem("fixednavbar");
        var boxedlayout = localStorage.getItem("boxedlayout");
        var fixedfooter = localStorage.getItem("fixedfooter");

        var body = $("body");

        if (fixedsidebar == "on") {
            body.addClass("fixed-sidebar");
            $(".sidebar-collapse").slimScroll({
                height: "100%",
                railOpacity: 0.9,
            });
        }

        if (collapse == "on") {
            if (body.hasClass("fixed-sidebar")) {
                if (!body.hasClass("body-small")) {
                    body.addClass("mini-navbar");
                }
            } else {
                if (!body.hasClass("body-small")) {
                    body.addClass("mini-navbar");
                }
            }
        }

        if (fixednavbar == "on") {
            $(".navbar-static-top")
                .removeClass("navbar-static-top")
                .addClass("navbar-fixed-top");
            body.addClass("fixed-nav");
        }

        if (boxedlayout == "on") {
            body.addClass("boxed-layout");
        }

        if (fixedfooter == "on") {
            $(".footer").addClass("fixed");
        }
    }

    var imageLoaded = function () {
        // On Loading Image
    };
    $("img.loaded-img").each(function () {
        img_id = $(this).attr("id");
        $(".loading-img-" + img_id).hide();
        var tmpImg = new Image();
        tmpImg.onload = imageLoaded;
        tmpImg.src = $(this).attr("src");
    });
});

// For demo purpose - animation css script
function animationHover(element, animation) {
    element = $(element);
    element.hover(
        function () {
            element.addClass("animated " + animation);
        },
        function () {
            //wait for animation to finish before removing classes
            window.setTimeout(function () {
                element.removeClass("animated " + animation);
            }, 2000);
        }
    );
}

function SmoothlyMenu() {
    if (
        !$("body").hasClass("mini-navbar") ||
        $("body").hasClass("body-small")
    ) {
        // Hide menu in order to smoothly turn on when maximize menu
        $("#side-menu").hide();
        // For smoothly turn on menu
        setTimeout(function () {
            $("#side-menu").fadeIn(400);
        }, 200);
    } else if ($("body").hasClass("fixed-sidebar")) {
        $("#side-menu").hide();
        setTimeout(function () {
            $("#side-menu").fadeIn(400);
        }, 100);
    } else {
        // Remove all inline style from jquery fadeIn function to reset menu state
        $("#side-menu").removeAttr("style");
    }
}

// Dragable panels
function WinMove() {
    var element = "[class*=col]";
    var handle = ".ibox-title";
    var connect = "[class*=col]";
    $(element)
        .sortable({
            handle: handle,
            connectWith: connect,
            tolerance: "pointer",
            forcePlaceholderSize: true,
            opacity: 0.8,
        })
        .disableSelection();
}

function LinearGradientTransition() {
    $(".loading-ux").show();
    $(".loading-ux").addClass("animated fadeInDown");

    white = 50;
    direction = "right";
    gradient =
        "linear-gradient(to right, rgb(231, 231, 231), rgb(231, 231, 231) 50%,rgb(253, 253, 253) 100%)";
    var interval;
    interval = setInterval(() => {
        if (direction == "right") {
            if (white == 100) {
                direction = "left";
                white--;
            } else {
                white++;
            }
        } else if (direction == "left") {
            if (white == 0) {
                direction = "right";
                white++;
            } else {
                white--;
            }
        }
        gradient =
            "linear-gradient(to right, rgb(231, 231, 231), rgb(231, 231, 231) " +
            white +
            "%,rgb(253, 253, 253) 100%)";

        $(".loading-gradient-transition").css("background-image", gradient);
    }, 10);

    return interval;
}

function stopLoadingGridient(interval) {

    $(".loading-ux").remove();
    if (typeof(interval)!="undefined") {
        clearInterval(interval);
    }
}

function AvatarNotFound(elt) {
    elt.onerror = null;
    elt.src = "/img/0.jpg";
}

/**
 *
 * @param {*} msg message content
 * @param {*} msgOwner id or email of the sender
 * @param {*} flag if flag == mine then the message is typed from this browser, else it's from someone else
 */
function showMessage(msgContent, msgOwner, time, flag) {
    avatarSrc = "/img/0.jpg";

    $.ajax({
        type: "GET",
        url: "Controller.php",
        data: { index: 204, msgOwner: msgOwner },
        success: function (data) {
            if (flag == "mine") {
                position = "left";
                animation = "slideInLeft";
            } else {
                position = "right";
                avatarSrc = "faceMember/" + data.facePicture;
                animation = "slideInRight";
            }

            $(".chat-messages").append(
                "<div class='chat-message " + position + "'></div>"
            );
            var msgBloc = $(".chat-messages")
                .children(".chat-message")
                .last()
                .addClass(position);
            msgBloc.append(
                "<img class='message-avatar rounded-circle' src='" +
                    avatarSrc +
                    "' onerror='AvatarNotFound(this)' ></img>"
            );
            msgBloc.append("<div class='message'></div>");
            msg = msgBloc.find(".message");
            msg.append("<a class='message-author'></a>");
            msg.append("<span class='message-date'></a>");
            msg.append("<span class='message-content'></a>");

            msg.find(".message-content").html(msgContent);
            msg.find("img").attr(
                "src",
                (onerror = "this.onerror=null; this.src='img/fallback.png'")
            );
            msg.find(".message-date").html(time);

            var chatWindow = $(".chat-messages")[0];
            chatWindow.scrollTop = chatWindow.scrollHeight;
        },
    });
}

function hideLoadingSpinner(form) {
    $(form).find(".sk-spinner").hide().removeClass("fadeInDown").addClass("fadeOutDown");
}

function showLoadingSpinner(form) {
    $(form).find(".sk-spinner").show().removeClass("fadeOutDown").addClass("fadeInDown");
}

function hideAllAlerts() {
    $(".alert").hide();
}

function hideAlerts(form_id) {
    $("#" + form_id)
        .find(".alert")
        .hide();
}

function hideAlertsOfForm(form) {
    $(form)
        .find(".alert")
        .hide();
}

function isLoading(form_id, bool) {
    if (bool == true) {
        $("#" + form_id)
            .find(".sk-spinner")
            .show().removeClass("fadeOutDown").addClass("fadeInDown");;
    } else {
        $("#" + form_id)
            .find(".sk-spinner")
            .hide().removeClass("fadeInDown").addClass("fadeOutDown");;
    }
}

function disableForm(form_id) {
    $("#" + form_id)
        .find("button[type='submit']")
        .addClass("disabled");
}

function enableForm(form_id) {
    $("#" + form_id)
        .find("button[type='submit']")
        .removeClass("disabled");
}


/**  */

$(window).on('load', function() {
    stopLoadingGridient(animation_sliding);
    $(".loading-content").remove();
    $(".content-page").addClass("fadeInDown").show();
});
