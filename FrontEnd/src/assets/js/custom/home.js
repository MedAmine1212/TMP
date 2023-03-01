$(document).ready(function () {


    $("#security-question-reminder").toast({
        delay: 60000,
        animation: true
    });

    if (!member.has_questions) {
        $("#security-question-reminder").toast('show');
    }
});

