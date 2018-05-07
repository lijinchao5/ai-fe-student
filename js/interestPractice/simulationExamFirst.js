var voice = 100;
//修改音量大小
function getrange() {
    voice = $("#voice").val();
}
//读取声音
function palyaudio() {
    $("#palymid img").eq(0).attr("src", "../../images/speakAndListen/stop.jpg");
    $("#palymid").attr("onclick", "stopaudio()");
    readrecord("unit3lookatme!_mainscene_f42a259b62604342adab0f4fb09588f2.mp3", function(audiotime) {
        $("#palymid").attr("onclick", "palyaudio()");
        $("#palymid img").eq(0).attr("src", "../../images/speakAndListen/play.png");
    });
}
//停止声音
function stopaudio() {
    $("#palymid img").eq(0).attr("src", "../../images/speakAndListen/play.png");
    $("#palymid").attr("onclick", "palyaudio()");
    document.getElementById("player_audio").pause();
}


var lid;
//读取自己录制的声音
function palyaudiolid() {
    $("#lyhf").attr("class", "readonly");
    $("#lyhf").attr("onclick", "");
    readrecord(lid, function(audiotime) {
        $("#lyhf").attr("class", "buttons");
        $("#lyhf").attr("onclick", "palyaudiolid();");
    });
}
//开始录音
function statrRecord() {
    console.log(111);
    $(".btns").hide();
    $(".clear-btn").hide();
    $("#testly").show();
    roundProgressTimer("roll-progress-test",5000);
    funStartMp3();
    console.log(222);
    var element = layui.element;

    setTimeout(function() {
        $(".btns").hide();
        $(".clear-btn").show();
        $("#testly").hide();
        funStopMp3(function(json) {
            lid = json.result;
            palyaudiolid();
            element.progress('testly', '0%');
            roundProgress("roll-progress-test",0);
        });
    }, 5300);
    $("#roll-progress-test").click(function () {
        $(".btns").hide();
        $(".clear-btn").show();
        $("#testly").hide();
        funStopMp3(function(json) {
            lid = json.result;
            palyaudiolid();
            element.progress('testly', '0%');
            roundProgress("roll-progress-test",0);
        });
    });
}
/*function statrRecords() {
    console.log(111);
    $(".btns").hide();
    $(".clear-btn").hide();
    $("#testly").show();
    funStartMp3();
    console.log(222);
    var element = layui.element,
        n = 0;
    var timer = setInterval(function() {
        n = n + 2;
        element.progress('testly', n + '%');
        if (n >= 100) {
            n = 100;
            clearInterval(timer);
            $("#lyhf").attr("class", "readonly");
            $(".btns").hide();
            $(".clear-btn").show();
            $("#testly").hide();
            setTimeout(function() {
                funStopMp3(function(json) {
                    lid = json.result;
                    palyaudiolid();
                    element.progress('testly', '0%');
                });
            }, 300);
        }
    }, 5000 / 50);
}*/

function resetplay() {
    $(".btns").show();
    $(".clear-btn").hide();
    $("#testly").hide();
}

function ok() {
    $("#buttontip").click();
}

function audiostop(){
    $("#lyhf").attr("onclick", "stopaudio()");
    readrecord("lib", function(audiotime) {
        $("#lyhf").attr("onclick", "palyaudio()");
    });
}
