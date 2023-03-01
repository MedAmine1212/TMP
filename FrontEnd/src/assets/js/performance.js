var begintime = Date.now();
var flag = true;
$(document).ready(function () {
    
    const test = setInterval(()=>{
        console.log("Progress : " + $(".pace-progress").attr("data-progress-text"));
        if ($(".pace-progress").attr("data-progress")>=99) {
            const loadingtime = (Date.now()) - begintime;
            console.log("Loading Time : " + (loadingtime/1000) + "s");
            clearInterval(test);
        } 
    },1000);
});

