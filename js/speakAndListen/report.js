var reindex = 0;
$('.report-tabs li').click(function () {
    $(this).addClass('tabs-col').siblings().removeClass('tabs-col');
    reindex = $(this).index();
    $('.report-wrap li').hide().eq(reindex).show();
});
function unique2(array) {
    var n = {}, r = [], len = array.length, val, type;
    for (var i = 0; i < array.length; i++) {
        val = array[i];
        type = typeof val;
        if (!n[val]) {
            n[val] = [type];
            r.push(val);
        } else if (n[val].indexOf(type) < 0) {
            n[val].push(type);
            r.push(val);
        }
    }
    return r;
}

$(function () {
    // 查询学生作业信息
    var id = getParam("id");
    var url = "report/getStudentHomeworkReport.do?homeworkId=" + id;
    doAjax("get", url, null, function (data) {
        var h = data.studentHomeworkInfo;
        var d = data.studentHomeworkDetail;
        var s = data.studentAvgScore;
        $("#rank").text(h.rank);
        $("#score").text(parseInt(h.score));
        var hour = parseInt(h.workTime / 3600);
        var min = parseInt(h.workTime % 3600 / 60);
        var sec = parseInt(h.workTime % 60);
        $("#hour").text(hour + ":");
        $("#mi").text(min);
        $("#sec").text(sec);
        //暂放
        //if(h.workTime>=3600){
        //    $("#hour").css("font-size","36px");
        //    $("#mi").css("font-size","36px");
        //    $("#sec").css("font-size","36px")
        //}
        if (h.remark === null) {
            $("#remark").text("还没有评语哦");
        } else {
            $("#remark").text(h.remark);
        }
        for (var i = 0; i < s.length; i++) {
            var pronunciation = s[i].pronunciation == null ? 0 : parseInt(s[i].pronunciation);
            var fluency = s[i].fluency == null ? 0 : parseInt(s[i].fluency);
            var integrity = s[i].integrity == null ? 0 : parseInt(s[i].integrity);
            if (s[i].homework_type == 2) {
                $($("#homework_type_2").find(".accuracy")[0]).attr("value", pronunciation);
                $($("#homework_type_2").find(".fluency")[0]).attr("value", fluency);
                $($("#homework_type_2").find(".integrity")[0]).attr("value", integrity);
            }
            if (s[i].homework_type == 3) {
                $($("#homework_type_3").find(".accuracy")[0]).attr("value", pronunciation);
                $($("#homework_type_3").find(".fluency")[0]).attr("value", fluency);
                $($("#homework_type_3").find(".integrity")[0]).attr("value", integrity);
            }
            if (s[i].homework_type == 4) {
                $($("#homework_type_4").find(".accuracy")[0]).attr("value", pronunciation);
                $($("#homework_type_4").find(".fluency")[0]).attr("value", fluency);
                $($("#homework_type_4").find(".integrity")[0]).attr("value", integrity);
            }
        }
        var array = new Array();
        for (var i = 0; i < d.length; i++) {
            array[i] = d[i].homeworkType;
        }
        var array1 = unique2(array);
        array1.sort();
        for (var j = 0; j < array1.length; j++) {
            if (j == 0) {
                $("#homework_type_t_" + (array1[j])).addClass("tabs-col");
                $("#homework_type_" + (array1[j])).show();
            }
            if (array1[j] == 1) {
                $("#homework_type_t_1").show();
            }
            if (array1[j] == 2) {
                $("#homework_type_t_2").show();
            }
            if (array1[j] == 3) {
                $("#homework_type_t_3").show();
            }
            if (array1[j] == 4) {
                $("#homework_type_t_4").show();
            }
            if (array1[j] == 5) {
                $("#homework_type_t_5").show();
            }
        }

        // 作业题目信息
        var _h_t_1 = $("#homework_type_1");
        var _h_t_2 = $("#homework_type_2");
        var _h_t_3 = $("#homework_type_3");
        var _h_t_4 = $("#homework_type_4_1");
        var _h_t_5 = $("#homework_type_5");
        var _h_t_5_1 = $("#homework_type_5_1");
        var roleNames = new Array();
        var g = 0;
        for (var k = 0; k < d.length; k++) {
            var obj = d[k];
            if (obj.homeworkType == 4 && obj.dialogName == "T") {
                roleNames[g++] = obj.name;
            }
        }
        roleNames.sort();
        var roleNames1 = unique2(roleNames);
        for (var n = 0; n < roleNames1.length; n++) {
            var na = roleNames1[n];
            var _roleName = $("<div class='cos-title'><span>扮演:</span><span class='role-name'>" + na + "</span></div>");
            _h_t_4.append(_roleName);
            for (var j = 0; j < d.length; j++) {
                var obj = d[j];
                var score = 0;
                if (null != obj.studentScore) {
                    score = parseInt(obj.studentScore)
                }
                if (na == obj.name) {
                    var png = "";
                    if (null == obj.audioPath) {
                        png = "report-stop.png";
                    } else {
                        png = "report-play.png";
                    }
                    if (obj.homeworkType == 4 && obj.dialogName == "T") {
                        var text = "";
                        if (null == obj.homeworkStudentScoreWordEntities && obj.homeworkStudentScoreWordEntities.length <= 0) {
                            text = obj.standerText;
                        } else {
                            for (var l = 0; l < obj.homeworkStudentScoreWordEntities.length; l++) {
                                var entity = obj.homeworkStudentScoreWordEntities[l];
                                if (entity.type != '7') {
                                    text = text + CalculationScoreword(entity.text, entity.score);
                                } else {
                                    text = text + entity.text;
                                }
                            }
                        }
                        var _h4 = $("<div class='cos-content'>" + "<p class='content'>"
                            + "<img src='../../images/speakAndListen/" + png + "' onclick=playAudio('" + obj.audioPath + "')>" + "<span>" + text + "</span><span class='cos-score'>" + addColor(score)
                            + "</span>" + "</p></div>");
                        _h_t_4.append(_h4);
                    }
                }
            }
        }
        for (var i = 0; i < d.length; i++) {
            var obj = d[i];
            var score = 0;
            if (null != obj.studentScore) {
                score = parseInt(obj.studentScore)
            }
            var png = "";

            if (null == obj.audioPath) {
                png = "report-stop.png";
            } else {
                png = "report-play.png";
            }
            // 单词跟读
            if (obj.homeworkType == 1) {
                var _h1 = $("<p class='content'>" + "<img src='../../images/speakAndListen/" + png + "' onclick=playAudio('" + obj.audioPath + "')>" + "<span>" + CalculationScoreword(obj.standerText, score) + "</span>"
                    + "<span class='word-score'>" + addColor(score) + "</span>" + "</p>");
                //
                _h_t_1.append(_h1);
            }
            if (obj.homeworkType == 2) {
                var text = "";
                if (null == obj.homeworkStudentScoreWordEntities && null == obj.homeworkStudentScoreWordEntities.length <= 0) {
                    text = obj.standerText;
                } else {
                    for (var j = 0; j < obj.homeworkStudentScoreWordEntities.length; j++) {
                        var entity = obj.homeworkStudentScoreWordEntities[j];
                        if (entity.type != '7') {
                            text = text + CalculationScoreword(entity.text, entity.score);
                        } else {
                            text = text + entity.text;
                        }
                    }
                }
                var _h2 = $("<p class='content'>" + "<img src='../../images/speakAndListen/" + png + "' onclick=playAudio('" + obj.audioPath + "')>" + "<span>" + text + "</span>"
                    + "<span class='sentences-score'>" + addColor(score) + "</span>" + "</p>");
                _h_t_2.append(_h2);
            }
            if (obj.homeworkType == 3) {
                var text = "";
                if (null == obj.homeworkStudentScoreWordEntities && null == obj.homeworkStudentScoreWordEntities.length <= 0) {
                    text = obj.standerText;
                } else {
                    for (var j = 0; j < obj.homeworkStudentScoreWordEntities.length; j++) {
                        var entity = obj.homeworkStudentScoreWordEntities[j];
                        if (entity.type != '7') {
                            text = text + CalculationScoreword(entity.text, entity.score);
                        } else {
                            text = text + entity.text;
                        }
                    }
                }
                var _h3 = $("<p class='content'>" + "<img src='../../images/speakAndListen/" + png + "' onclick=playAudio('" + obj.audioPath + "')>" + "<span>" + text + "</span>"
                    + "<span class='text-score'>" + addColor(score) + "</span>" + "</p>");
                //
                _h_t_3.append(_h3);
            }
            if (obj.homeworkType == 5) {
                var ct = obj.standerText;
                var ut = obj.studentText == null ? "未作答" : obj.studentText;
                var text = "";
                if (ct == ut) {
                    text = ct;
                } else {
                    text = "<font style='color:rgb(255,109,128)'>" + ut + "</font><font style='color:rgb(0,0,0)'>" + "(" + ct + ")" + "</font>";
                }
                var _h5 = $("<span class='spell-word'>" + text + "</span>");
                _h_t_5_1.append(_h5);
            }
        }
    });

});

function CalculationScoreword(word, score) {
    var html = "";
    if (score < 60) {
        html += "<b class='red'>" + word + "</b>";
    } else if (score >= 60 && score <= 85) {
        html += "<b class='orange'>" + word + "</b>";
    } else if (score > 85) {
        html += "<b class='green'>" + word + "</b>";
    }
    return html;
}
function addColor(score) {
    var html = "";
    if (score < 60) {
        html += "<span class='border-color-red'>" + score + "</span>";
    } else if (score >= 60 && score <= 85) {
        html += "<span class='border-color-yellow'>" + score + "</span>";
    } else if (score > 85) {
        html += "<span class='border-color-green'>" + score + "</span>";
    }
    return html;
}

function playAudio(id) {
    if ($("#player_audio").length == 0) {
        $("body").prepend($("<div style='display: none;' > <audio id='player_audio' src='' /></div>"))
    }
    $("#player_audio").attr("src", getRootPath() + "file/download.do?type=mp3&id=" + id);
    document.getElementById("player_audio").play();
}
