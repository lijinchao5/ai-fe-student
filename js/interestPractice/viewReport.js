$(function () {
    $('#header').load('../common/header.html');
    $('#nav').load('../common/nav.html');
    $('#footer').load('../common/footer.html');
});
var bigdataTextArr = new Array('一、', '二、', '三、', '四、', '五、', '六、', '七、', '八、', '九、', '十、', '十一、', '十二、', '十三、', '十四、', '十五、', '十六、', '十七、', '十八、', '十九、', '二十、');
$(function () {
    var param = {};
    param.examId = getParam("id");
    var url = "exam/getStudentExamReport.do";
    doAjax("get", url, param, function (data) {
        var studentInfo = data.examStudentInfo;
        var examTypeScoreList = data.examTypeScoreList;
        $("#rank").text(studentInfo.studentRank);
        $("#score").text(Math.round(studentInfo.score * 10) / 10);
        if (null != studentInfo.remark && "" != studentInfo.remark) {
            $("#remark").text(studentInfo.remark);
        } else {
            $("#remark").text("别心急，老师还没来得及写评语哦！");
        }

        var _typeList = $("#scoreTypeList");
        var totalScore = 0;
        for (var i = 0; i < examTypeScoreList.length; i++) {
            var eysl = examTypeScoreList[i];
            var _scoreS = eysl.studentScore;

            var _li = $("<li class='word-list'><div>" + eysl.typeName + "</div><div>" + eysl.totalScore + "</div><div>" + _scoreS.toFixed(1) + "</div> </li>")
            _typeList.append(_li);
            totalScore = totalScore + eysl.totalScore;
        }
        $("#allScore").text(totalScore);
        //获取列表信息
        var examDetailList = data.examStudentScore;
        var map = new Map();
        var array = new Array();
        for (var i = 0; i < examDetailList.length; i++) {
            var edl = examDetailList[i];
            array.push(edl.paperSubjectId);
        }
        var array1 = unique2(array);
        for (var i = 0; i < array1.length; i++) {
            var id = array1[i];
            var idResult = new Array();
            for (var j = 0; j < examDetailList.length; j++) {
                var edl = examDetailList[j];
                if (id == edl.paperSubjectId) {
                    idResult.push(edl);
                }
            }
            map.put(id, idResult);
        }
        var _reportContent = $("#report-content");
        for (var i = 0; i < map.arr.length; i++) {
            var _allDiv = $("<div class='request-first'><div>");
            var thisQn = bigdataTextArr[i];
            var allList = map.arr[i].value;
            var key = map.arr[i].key;
            var firstQ = map.arr[i].value[0];
            var title = thisQn + firstQ.subjectNum;
            var _qtitle = $("<div class='question-title'>" + "<a class='top-topic'>" + title +
                "<span>（共<span class='score'>" + (map.arr[i].value.length * firstQ.score) + "</span>分，每小题 <span class='each-score'>" + firstQ.score + "</span>分）" + "</span>" +
                "</a></div>" +
                "<div class='topic'>" + firstQ.subject + "</div>");

            var _qcontent = $("<ul class='question-content'><ul>");
            _allDiv.append(_qtitle);
            _allDiv.append(_qcontent);
            if (firstQ.type == 1) {
                for (var j = 0; j < map.arr[i].value.length; j++) {
                    var obj = map.arr[i].value[j];
                    var _li = $("<li>" +
                        "<p class='question'>" + formateGuid(obj.guide) + "</p>" +
                        "<p class='subject'>" + (j + 1) + "." + obj.question + "</p>" +
                        "<p class='select'>" + switchABCD(obj.result) + "</p>" +
                        "<div class='exam-result right-wrong'>" +
                        "<span>答案：</span> <img src='../../images/speakAndListen/play.png'  onclick=playAudio('" + obj.studentAudio + "')>      " +
                        "<span class='recording-score'>" + formateScore(obj.studentScore) + "分,满分:" + obj.score + "分</span>" +
                        "</div>" +
                        "<div class='exam-key'>" +
                        "<span class='key-check'>答案解析</span>" +
                        "<div class='exam-key-content'>" +
                        "<div class='key-item refer-result'>" +
                        "<p>参考答案</p>" +
                        "<ul class='key'>" +
                        "<li>" + switchOrigText(obj.correntResult) + "</li>" +
                        "</ul>" +
                        "</div>" +
                        "<div class='key-item listen-article'>" +
                        "<p>听力原文</p>" +
                        "<ul class='key'>" + switchOrigText(obj.originalText) + "</ul>" +
                        "</div>" +
                        "</div>" +
                        "</div>" +
                        "</li>");
                    _qcontent.append(_li);
                }
            } else if (firstQ.type == 2) {
                for (var j = 0; j < map.arr[i].value.length; j++) {
                    var obj = map.arr[i].value[j];
                    var _eachscore = obj.studentScore;
                    var _li = $("<li>" +
                        "<p class='question'>" + formateGuid(obj.guide) + "</p>" +
                        "<p class='subject'>" + (j + 1) + "." + obj.question + "</p>" +
                        "<p class='select'>" + switchABCD(obj.result) + "</p>" +
                        "<div class='exam-result right-wrong'>" +
                        "<span>答案：</span><span class='recording-score'>" + formateEmptyResult(obj.studentResult) + "</span><img src='../../images/common/" + (obj.studentScore > 0 ? "true" : "error") + ".png'>" +
                        "</div>" +
                        "<div class='exam-key'>" +
                        "<span class='key-check'>答案解析</span>" +
                        " <div class='exam-key-content'>" +
                        "<div class='key-item refer-result'>" +
                        "<p>参考答案</p>" +
                        "<ul class='key'>" +
                        "<li>" + obj.correntResult + "</li>" +
                        "</ul>" +
                        "</div>" +
                        "<div class='key-item listen-article'>" +
                        "<p>听力原文</p>" +
                        "<ul class='key'>" + switchOrigText(obj.originalText) + "</ul> " +
                        "</div>" +
                        "</div>" +
                        "</div>" +
                        "</li>");
                    _qcontent.append(_li);
                }
            } else if (firstQ.type == 3) {
                if (null != map.arr[i].value && map.arr[i].value.length > 0) {
                    var t3tas = new Array();
                    for (var j = 0; j < map.arr[i].value.length; j++) {
                        t3tas.push(map.arr[i].value[j].detailType);
                    }
                    t3tas = unique2(t3tas);
                    var t3taMap = new Map();
                    for (var j = 0; j < t3tas.length; j++) {
                        var t2taArray = new Array();
                        for (var k = 0; k < map.arr[i].value.length; k++) {
                            if (map.arr[i].value[k].detailType == t3tas[j]) {
                                t2taArray.push(map.arr[i].value[k]);
                            }
                        }
                        t3taMap.put(t3tas[j], t2taArray);
                    }
                    var t33as = t3taMap.get(3);
                    if (null != t33as && t33as.length > 0) {
                        var obj = t33as[0];
                        var _li = $("<li>" +
                            "<p class='question'>" + formateGuid(obj.guide) + "</p>" +
                            "<p class='subject'><img src='" + getRootPath() + "file/download.do?type=jpg&id=" + obj.question + "'></p>" +
                            "<p class='select'>" + switchABCD(obj.result) + "</p>" +
                            "<div class='exam-result right-wrong'>" +
                            "<span>答案：</span> " + getStudentType3Answer(t33as) +
                            "</div>" +
                            "<div class='exam-key'>" +
                            "<span class='key-check'>答案解析</span>" +
                            "<div class='exam-key-content'>" +
                            "<div class='key-item refer-result'>" +
                            "<p>参考答案</p>" +
                            "<ul class='key'>" + getType3Answer(t33as) + "</ul>" +
                            "</div>" +
                            "<div class='key-item listen-article'>" +
                            "<p>听力原文</p>" +
                            "<ul class='key'>" + switchOrigText(obj.originalText) + "</ul>" +
                            "</div>" +
                            "</div>" +
                            "</div>" +
                            "</li>");
                        _qcontent.append(_li);
                    }
                    var t34as = t3taMap.get(4);
                    if (null != t34as && t34as.length > 0) {
                        for (var l = 0; l < t34as.length; l++) {
                            var obj = t34as[l];
                            var _li = $("<li>" +
                                "<p class='question'>" + formateGuid(obj.guide) + "</p>" +
                                "<p class='subject'></p><br/>" +
                                "<p class='select'>" + switchABCD(obj.result) + "</p>" +
                                "<div class='exam-result right-wrong'>" +
                                "<span>答案：</span>" +
                                "<img src='../../images/speakAndListen/play.png' onclick=playAudio('" + obj.studentAudio + "')> <span class='recording-score'>" + formateScore(obj.studentScore) + "分,满分:" + obj.score + "分</span> " +
                                "</div>" +
                                "<div class='exam-key'>" +
                                "<span class='key-check'>答案解析</span>" +
                                "<div class='exam-key-content'>" +
                                "<div class='key-item refer-result'>" +
                                "<p>参考答案</p>" +
                                "<ul class='key'>" + obj.correntResult + "</ul></div></div></div></li>");
                            _qcontent.append(_li);
                        }
                    }


                }
            } else if (firstQ.type == 4) {
                for (var j = 0; j < map.arr[i].value.length; j++) {
                    var obj = map.arr[i].value[j];
                    var _li = $("<li>" +
                        "<p class='question'>" + obj.question + "</p>" +
                        "<div class='report-top'>" +
                        "<div class='sentences-degree'>" +
                        "<p>" +
                        "<span>准确度</span>" +
                        "<progress class='accuracy' value='" + obj.pronunciation + "' max='100'></progress>" +
                        "</p>" +
                        "<p>" +
                        "<span>流利度</span>" +
                        "<progress class='fluency' value='" + obj.fluency + "' max='100'></progress>" +
                        "</p>" +
                        "<p>" +
                        "<span>完整度</span>" +
                        "<progress class='integrity' value='" + obj.integrity + "' max='100'></progress>" +
                        "</p>" +
                        "</div>" +
                        "<div class='word-degree'>" +
                        "<p class='degree-fail'>" +
                        "<img src='../../images/common/red.png'>60分以下" +
                        "</p>" +
                        "<p class='degree-good'>" +
                        "<img src='../../images/common/yellow.png'>60-85分" +
                        "</p>" +
                        "<p class='degree-well'>" +
                        "<img src='../../images/common/blue.png'>85分以上" +
                        "</p>" +
                        "</div>" +
                        "</div>" +
                        "<div class='result'>" +
                        "<p class='subject'>" + formateTextColor(obj.words) + "</p>" +
                        "<div class='exam-result'>" +
                        "<span>答案：</span><img src='../../images/speakAndListen/play.png'  onclick=playAudio('" + obj.studentAudio + "')>" +
                        "<span class='recording-score'>" + formateScore(obj.studentScore) + "分,满分:" + obj.score + "分</span>" +
                        "</div>" +
                        "</div>");
                    _qcontent.append(_li);
                }
            } else if (firstQ.type == 5) {
                if (map.arr[i].value.length <= 0) {
                    continue;
                }
                var firstType5 = map.arr[i].value[1];
                var _li = $("<li><p>" + firstType5.guide + "</p></li>");
                for (var j = 0; j < map.arr[i].value.length; j++) {
                    var obj = map.arr[i].value[j];
                    var _p = $("<p class='subject'>" + (j + 1) + "." + obj.question + "</p>" +
                        "<div class='exam-result'>" +
                        "<span>答案：</span> <img src='../../images/speakAndListen/play.png'  onclick=playAudio('" + obj.studentAudio + "')>" +
                        "<span class='recording-score'>" + formateScore(obj.studentScore) + "分,满分:" + obj.score + "分</span>                                         " +
                        "</div>");
                    _li.append(_p)
                }
                _qcontent.append(_li);
                var _answer = $("<div class='exam-key'>" +
                    "<span class='key-check'>答案解析</span>" +
                    "<div class='exam-key-content'>" +
                    "<div class='key-item refer-result'>" +
                    "<p>参考答案</p>" +
                    "<ul class='key'>" + getType5Answer(obj.correntResult) + "</ul>" +
                    "</div>" +
                    "<div class='key-item crue-info'>" +
                    "<p>关键信息点</p>" +
                    "<ul class='key'>" + getType5Point(obj.pointResult) + "</ul>" +
                    "</div>" +
                    "        <div class='key-item listen-article'>" +
                    "            <p>听力原文</p>" +
                    "            <ul class='key'>" + switchOrigText(obj.originalText) + "</ul>" +
                    "        </div>" +
                    "    </div>" +
                    "</div>");
                _qcontent.append(_answer);
            } else if (firstQ.type == 6) {
                for (var j = 0; j < map.arr[i].value.length; j++) {
                    var obj = map.arr[i].value[j];
                    var _li = $("<li>" +
                        "    <p class='question'>要点：</p>" +
                        "    <p class='subject'>" + obj.question + "</p>" +
                        "    <div class='exam-result'>" +
                        " <span>答案：</span> <img src='../../images/speakAndListen/play.png'  onclick=playAudio('" + obj.studentAudio + "')>" +
                        "	<span class='recording-score'>" + formateScore(obj.studentScore) + "分,满分:" + obj.score + "分</span>                  " +
                        "    </div>" +
                        "    <div class='exam-key'>" +
                        " <span class='key-check'>答案解析</span>" +
                        " <div class='exam-key-content'>" +
                        " <div class='key-item listen-article'>" +
                        "<p>听力原文</p>" +
                        "<ul class='key'>" + obj.correntResult + "</ul>" +
                        "</div>" +
                        "</div>" +
                        "</div>" +
                        "</li>");
                    _qcontent.append(_li);
                }
            }
            _reportContent.append(_allDiv);
        }
    });
})
function getType5Answer(text) {
    if (text == null) {
        return "";
    }
    var html = "";
    var arr = text.split("||");
    for (var i = 0; i < arr.length; i++) {
        html += '<li>' + arr[i] + '</li>';
    }
    return html;
}
function getType5Point(text) {
    //text = text.replace("||","或者")
    text = text.replace(/\|\|/g, "或者");
    if (text == null) {
        return "";
    }
    var html = "";
    var arr = text.split("@@");
    for (var i = 0; i < arr.length; i++) {
        html += '<li>' + arr[i] + '</li>';
    }
    return html;
}
function formateTextColor(words) {
    var text = "";
    for (var i = 0; i < words.length; i++) {
        if (words[i].type != '7') {
            text = text + CalculationScoreword(words[i].text, words[i].score);
        } else {
            if (words[i].text == "") {
                text = text + " ";
            } else {
                text = text + words[i].text;
            }
        }
    }
    console.log(text);
    return text;
}
function CalculationScoreword(word, score) {
    var html = "";
    if (score < 60) {
        html += "<span class='red'>" + word + "</span>";
    } else if (score >= 60 && score <= 85) {
        html += "<span class='orange'>" + word + "</span>";
    } else if (score > 85) {
        html += "<span class='green'>" + word + "</span>";
    }
    return html;
}
function formateScore(score) {
    return score.toFixed(1);
}
function getStudentType3Answer(arr) {
    var html = "";
    for (var i = 0; i < arr.length; i++) {
        var obj = arr[i];
        html += "<span class='recording-score'>" + (i + 1) + "." + formateEmptyResult(obj.studentResult) + "</span><img src='../../images/common/" + (obj.studentScore > 0 ? "true" : "error") + ".png'>";
    }
    return html;
}
function formateEmptyResult(text) {
    if (text && null != text && "" != text) {
        return text;
    } else {
        return "未作答";
    }
}
function getType3Answer(arr) {
    var html = "";
    for (var i = 0; i < arr.length; i++) {
        var obj = arr[i];
        html += "<li>" + (i + 1) + "." + obj.correntResult + '</li>';
    }
    return html;
}
function switchOrigText(text) {
    if (text == null) {
        return "";
    }
    var html = "";
    var arr = text.split("||");
    for (var i = 0; i < arr.length; i++) {
        html += '<li>' + arr[i] + '</li>';
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
function formateGuid(text) {
    if (text == null || text == "") {
        return "";
    } else {
        return text
    }
}
function switchABCD(text) {
    if (text == null) {
        return "";
    }
    var html = "";
    var arr = text.split("||");
    for (var i = 0; i < arr.length; i++) {
        if (i == 0) {
            html += '<span>A. </span><span>' + arr[i] + '</span>';
        } else if (i == 1) {
            html += '<span>B. </span><span>' + arr[i] + '</span>';
        } else if (i == 2) {
            html += '<span>C. </span><span>' + arr[i] + '</span>';
        } else if (i == 3) {
            html += '<span>D. </span><span>' + arr[i] + '</span>';
        } else if (i == 4) {
            html += '<span>E. </span><span>' + arr[i] + '</span>';
        } else if (i == 5) {
            html += '<span>F. </span><span>' + arr[i] + '</span>';
        } else if (i == 6) {
            html += '<span>G. </span><span>' + arr[i] + '</span>';
        }
    }
    return html;
}
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

$(".go-top").click(function () {
    $("#view-report").animate({scrollTop: 0}, 2000)
});