function addInvitBox(invit) {
    var newBox = $(".invit-box").first().clone();
    newBox.appendTo(".invit-container");
    newBox.find(".owner").html(invit.owner.name);
    newBox.find("img").attr("src", "faceMember/" + invit.owner.facePicture);
    newBox.find(".btn").attr("data-factory", invit.factory.id);
    //console.log(newBox.find("button"))
    newBox.show();
    //newBox.addClass("animated fadeInLeft");
}

function smoothSlideDown(container) {
    container.addClass("smoothSlideDown");
}

function smoothSlideUpNextContainer(container, height) {
    value = parseInt(height, 10);
    nextContainer = container.next();
    container.hide();
    nextContainer.css("margin-top", height);
    nextContainer.animate(
        {
            marginTop: "0",
        },
        500,
        function () {
            // Animation complete.
        }
    );
}

function accept(factory, container) {
    $.ajax({
        type: "POST",
        url: "",
        data: { factory: factory },
        success: function (response) {
            smoothSlideDown(container);
            setTimeout(() => {
                $(".alert-success").addClass("animated fadeInDown");
                $(".alert-success").show();

                container
                    .removeClass("smoothSlideDown")
                    .addClass("animated bounceOutRight");
            }, 500);

            setTimeout(() => {
                smoothSlideUpNextContainer(container, container.css("height"));
            }, 1500);

            setTimeout(() => {
                $(".alert-success").addClass("animated fadeOutUp");
            }, 3000);
        },
        error: function (req, status, err) {
            $(".alert-danger").show();
        },
    });
}

function refuse(factory, container) {
    $.ajax({
        type: "DELETE",
        url: "",
        data: { factory: factory },
        success: function (response) {
            container
                .removeClass("smoothSlideDown")
                .addClass("animated bounceOutRight");

            setTimeout(() => {
                smoothSlideUpNextContainer(container, container.css("height"));
            }, 500);
        },
        error: function (req, status, err) {},
    });
}

$(document).ready(function () {
    // hideAlerts();
    $("button").on("click", function (e) {
        e.preventDefault();
    });
});
