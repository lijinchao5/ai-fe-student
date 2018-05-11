$(function () {
    getWork()
    getClass();
    //$(".task-title li").eq(0).click();
    $('#header').load('../common/header.html');
    $('#nav').load('../common/nav.html');
    $('#footer').load('../common/footer.html');
    $(document).bind("click", function (e) {
        openList();
        if ($(e.target).closest(".class-list").length == 0 && $(e.target).closest("#changeClass").length == 0) {
            //点击空白处，触发
            closeList();
        }
    })
});

//进入我的同学
function jumpMate() {
    var id = getParam("id");
    window.location.href = './myClassmate.html?id=' + id;
}

//换班列表 关闭
function closeList() {
    $(".class-list").hide()
}
//换班列表 显示
function openList() {
    $(".class-list").show()
}


//班级列表
function getClass() {
    var url = "studentClass/getStudentClass.do";
    var param = {};
    doAjax("get", url, param, function (data, code) {
        if (code == 0 || code == "0") {
            var _getClass = $(".class-list");
            _getClass.html("");
            var _current = getParam("id");
            var noCurrent = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == _current) {
                    var ClassName = data[i].grade + '年级' + data[i].name + '(' + data[i].classId + ')';
                    $("#currentClass").text(ClassName);
                    store.set("className", data[i].grade + '年级' + data[i].name);

                } else {
                    noCurrent.push(data[i]);
                }
            }
            for (var i = 0; i < noCurrent.length; i++) {
                if (noCurrent[i].diss != null) {
                    console.log(data[i].diss);
                    var _getList = "";
                    var d = noCurrent[i];
                    _getList = $("<li onclick=\"choiceClass(" + d.id + ")\">" + d.grade + "年级" + d.name + "(" + d.classId + ")" + "</li>");
                    _getClass.prepend(_getList);
                }
            }
            if ($(".class-list li").length <= 0) {
                var _noClass = $("<p class='no-class'>还没有其他班级</p>");
                $(".class-list").prepend(_noClass);
            }
        }
    })
}

//切换选中班级
function choiceClass(id) {
    window.location.href = './myClass.html?id=' + id;
}

//作业模考切换
$(".task-title li").click(function () {
    $(this).addClass("current").siblings().removeClass("current");
    var Liindex = $(this).index();
    $(".task-content .reports").eq(Liindex).show().siblings().hide();
});

$("#workList").click(function(){
    window.location.reload();
    getWork()
});
//获取时间
function formateDate(da) {
    if (null == da || da == '') {
        return "1990-10-01";
    }
    var date = new Date(da);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var mm = date.getMinutes();
    var s = date.getSeconds();
    var d = y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d) + " " + (h < 10 ? ('0' + h) : h) + ":" + (mm < 10 ? ('0' + mm) : mm) + ":" + (s < 10 ? ('0' + s) : s);
    return d;
}

//跳转作业或答题
function goTo(url, id) {
    window.location.href = url + "?id=" + id;
}

//作业筛选信息
$("#work-report .screen button").click(function () {
    $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
    cliindex = 0;
    initData();
});

//模考筛选信息
$("#exam-report .screen button").click(function () {
    $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
    cliindexs = 0;
    addListE();
});

//获取作业报告
function goHomeworkReport(id, com) {
    if (com == 'F') {
        $(".tips-report").show()
    } else {
        window.location.href = "homeworkReport.html?id=" + id;
    }
}

//关闭提示框
$(".tips-report span").click(function () {
    $(".tips-report").hide()
});

//获取作业信息
function getWork() {
    initData();
    addListeners();
}

var currentPage = 0;
var totalPage = 0;
var cliIndex = 0;
function addListeners() {
    var _workPrev = $("#work-report #workPrev");
    var _workNext = $("#work-report #workNext");
    _workNext.click(function () {
        $(this).css('visibility', 'visible');
        currentPage++;
        if (currentPage >= totalPage - 1) {
            currentPage = totalPage - 1;
            $(this).css("visibility", "hidden");
        }
        cliIndex = currentPage;
        initData();
    });
    _workPrev.click(function () {
        $(this).css('visibility', 'visible');
        currentPage--;
        if (currentPage <= 0) {
            currentPage = 0;
            $(this).css('visibility', 'hidden');
        }
        cliIndex = currentPage;
        initData();
    });
}


function isflash() {
    var flag = 0;
    $("#work-report .btn-md").each(function (i, v) {
        var classname = $(this).attr("class");
        if ("btn btn-md btn-primary" == classname) {
            flag = i;
            return false;
        }
    });
    return flag;
}

//获取作业列表
function initData() {
    console.log("isflash:" + isflash());
    var getId = getParam("id");
    var param = {};
    param.rows = 6;
    var isflashflag = isflash();
    if (isflashflag == 1) {
        param.over = 'T';
    } else if (isflashflag == 2) {
        param.over = 'F';
    }
    param.classId = getId;
    param.page = cliIndex + 1;
    var url = "homework/getStudentHomeWorkList.do";
    var _reportAll = $("#work-report .report-banner");
    doAjax("get", url, param, function (data) {
        currentPage = parseInt(data.page) - 1;
        totalPage = data.countPage;
        var _jobList = $("#jobList");
        _jobList.html("");
        if (null != data && data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
                var d = data.rows[i];
                var _job = "";
                if (d.over == "F" || d.workComplate == 'T') {
                    _job = $("<li><p>" + d.name + "</p>" +
                        "<p class='score'><span class='blue-color'>" + parseInt(d.score) + "</span><span class='normal-color'>分</span></p>" +
                        "<a onclick=goHomeworkReport('" + d.id + "','" + d.workComplate + "') href='javascript:void(0);' class='check-report'>查看报告</a>" +
                        "<p class='end-time'>" + formateDate(d.endTime) + "</p></li>")
                } else {
                    _job = $("<li>" +
                        "<p>" + d.name + "</p>" +
                        "<p><a class='color-blue'>" + d.complateStudent + "</a>&nbsp;/&nbsp;<a class='color-normal'>" + d.totalStudent + "人</a></p>" +
                        "<a href='wordSpeaking.html?id=" + d.id + "' class='do-homework''>写作业</a>" +
                        "<p class='start-time'>From：" + formateDate(d.createDate) + "</span></p>" +
                        "<p class='final-time'>To：" + formateDate(d.endTime) + "</span></p>" +
                        "</li>");
                }
                _jobList.append(_job);
            }
            var _toggleLi = $("#work-report #toggleLi");
            var _toggles = "";
            _toggleLi.html("");
            if (totalPage == 1) {
                _toggles = $("<li class='col'>" + "1" + "</li>");
                _toggleLi.append(_toggles);
                $("#work-report .paging .up").css('visibility', 'hidden');
                $("#work-report .paging .down").css('visibility', 'hidden');
            } else {
                for (var num = 1; num <= totalPage; num++) {
                    _toggles = $("<li>" + num + "</li>");
                    _toggleLi.append(_toggles);
                    _toggles.click(function () {
                        cliIndex = $(this).index();
                        initData();
                    });
                }
                if ((cliIndex + 1) == totalPage) {
                    $("#work-report .paging .down").css('visibility', 'hidden');
                    $("#work-report .paging .up").css('visibility', 'visible');
                } else if ((cliIndex + 1) == 1) {
                    $("#work-report .paging .down").css('visibility', 'visible');
                    $("#work-report .paging .up").css('visibility', 'hidden')
                } else {
                    $("#work-report .paging .down").css('visibility', 'visible');
                    $("#work-report .paging .up").css('visibility', 'visible')
                }
                _toggleLi.find("li").eq(currentPage).addClass('col').siblings().removeClass('col');
                $("#work-report #toggleLi").css('visibility', 'visible');
            }
        } else {
            var _reportEmpty = "";
            _reportEmpty = $("<div class='empty-all'>" + "<img src='../../images/common/empty.png' alt='没有作业'/>" + "<p class='empty-text'>" + "老师还没有布置作业哦！" + "</p>" + "</div>");
            _reportAll.append(_reportEmpty);
            $("#work-report .paging .up").css('visibility', 'hidden');
            $("#work-report .paging .down").css('visibility', 'hidden');
            $("#work-report #toggleLi").css('visibility', 'hidden');

        }
    });

}

//获取模考信息
function getExam() {
    addListE();
    addListenersE();

}
var examPage = 0;
var examTotal = 0;
var examIndex = 0;
function addListenersE() {
    var _examPrev = $("#exam-report #examPrev");
    var _examNext = $("#exam-report #examNext");
    _examNext.click(function () {
        $(this).css('visibility', 'visible');
        examPage++;
        if (examPage >= examTotal - 1) {
            examPage = examTotal - 1;
            $(this).css("visibility", "hidden");
        }
        examIndex = examPage;
        addListE();

    });
    _examPrev.click(function () {
        $(this).css('visibility', 'visible');
        examPage--;
        if (examPage <= 0) {
            examPage = 0;
            $(this).css('visibility', 'hidden');
        }
        examIndex = examPage;
        addListE();
    });
}

function isflashE() {
    var flagE = 0;
    $("#exam-report .screen .btn-md").each(function (i, v) {
        var classnameE = $(this).attr("class");
        if ("btn btn-md btn-primary" == classnameE) {
            flagE = i;
            return false;
        }
    });
    return flagE;
}


// 获取学生考试列表
function addListE() {
    var paramS = {};
    paramS.rows = 4;
    var isflashflagE = isflashE();
    var getId = getParam("id");
    if (isflashflagE == 1) {
        paramS.state = '0';
    } else if (isflashflagE == 2) {
        paramS.state = '1';
    } else if (isflashflagE == 3) {
        paramS.state = '2';
    }
    paramS.page = examIndex + 1;
    paramS.classId = getId;
    var url = "exam/findStudentExamByPage.do";
    var _examReport = $("#exam-report .report-banner");
    doAjax("get", url, paramS, function (data) {
        examPage = parseInt(data.page) - 1;
        examTotal = data.countPage;
        var datasS = data.rows;
        var _examList = $("#examList");
        _examList.html("");
        if (null == datasS || datasS.length <= 0) {
            $("#exam-report .empty-all").show();

            $("#exam-report #examPrev").css('visibility', 'hidden');
            $("#exam-report #examNext").css('visibility', 'hidden');
            $("#exam-report #examToggle").css('visibility', 'hidden');
        } else {
            $("#exam-report #examToggle").css('visibility', 'visible');
            $("#exam-report .empty-all").hide();
            for (var i = 0; i < datasS.length; i++) {
                var d = datasS[i];
                if (d.complate == 'F') {
                    var startExam = null;
                    if (d.state == 1) {
                        // 可以做题
                        startExam = $("<li>" +
                            "<p class='topic'>" + d.examName + "</p>" +
                            "<p class='examiner'><span class='complete-number'>" + d.complateStudent + "</span>/" + d.totalStudent + "人</p>" +
                            "<a href='javascript:void(0)' class='enter-exam' onclick=goTo('simulationExam.html','" + d.examId + "')>进入考试</a>" +
                            "<p class='start-time'>From：" + formateDate(d.startTime) + "</p>" +
                            "<p class='final-time'>To：" + formateDate(d.endTime) + "</p>" +
                            "</li>");
                    } else {
                        if (d.state == 0) {
                            startExam = $("<li>" +
                                "<p class='topic'>" + d.examName + "</p>" +
                                "<p class='examiner'><span class='complete-number'>" + d.complateStudent + "</span>/" + d.totalStudent + "人</p>" +
                                "<a href='javascript:void(0)' class='enter-exam'>考试未开始</a>" +
                                "<p class='start-time'>From：" + formateDate(d.startTime) + "</p>" +
                                "<p class='final-time'>To：" + formateDate(d.endTime) + "</p>" +
                                "</li>");
                        }
                        if (d.state == 2) {
                            startExam = $("<li>" +
                                "<p class='topic'>" + d.examName + "</p>" +
                                "<p class='examiner'><span class='complete-number'>" + d.complateStudent + "</span>/" + d.totalStudent + "人</p>" +
                                "<a href='javascript:void(0)' class='enter-exam'>分析中...</a>" +
                                "<p class='start-time'>From：" + formateDate(d.startTime) + "</p>" +
                                "<p class='final-time'>To：" + formateDate(d.endTime) + "</p>" +
                                "</li>");
                        }
                    }
                    _examList.append(startExam);
                    continue;
                } else if (d.complate == 'S') {
                    var startExam = null;
                    if (d.state == 1) {
                        // 可以做题
                        startExam = $("<li>" +
                            "<p class='topic'>" + d.examName + "</p>" +
                            "<p class='examiner'><span class='complete-number'>" + d.complateStudent + "</span>/" + d.totalStudent + "人</p>" +
                            "<a href='javascript:void(0)' class='enter-exam'>分析中...</a>" +
                            "<p class='start-time'>From：" + formateDate(d.startTime) + "</p>" +
                            "<p class='final-time'>To：" + formateDate(d.endTime) + "</p>" +
                            "</li>");
                    } else {
                        if (d.state == 0) {
                            startExam = $("<li>" +
                                "<p class='topic'>" + d.examName + "</p>" +
                                "<p class='examiner'><span class='complete-number'>" + d.complateStudent + "</span>/" + d.totalStudent + "人</p>" +
                                "<a href='javascript:void(0)' class='enter-exam'>考试未开始</a>" +
                                "<p class='all-time'>" +
                                "<p class='start-time'>From：" + formateDate(d.startTime) + "</p>" +
                                "<p class='final-time'>To：" + formateDate(d.endTime) + "</p>" +
                                "</p>" +
                                "</li>");
                        }
                        if (d.state == 2) {
                            startExam = $("<li>" +
                                "<p class='topic'>" + d.examName + "</p>" +
                                "<p class='examiner'><span class='complete-number'>" + d.complateStudent + "</span>/" + d.totalStudent + "人</p>" +
                                "<a href='javascript:void(0)' class='enter-exam'>分析中...</a>" +
                                "<p class='start-time'>From：" + formateDate(d.startTime) + "</p>" +
                                "<p class='final-time'>To：" + formateDate(d.endTime) + "</p>" +
                                "</li>");
                        }
                    }
                    _examList.append(startExam);
                    continue;
                } else if (d.complate == 'T') {
                    // 已经提交 ---->分数计算中
                    var startExam = $("<li>" +
                        "<p class='topic'>" + d.examName + "</p>" +
                        "<p class='examiner'><span class='complete-number'>" + d.complateStudent + "</span>/" + d.totalStudent + "人</p>" +
                        "<a href='javascript:void(0)' class='enter-exam'>分析中...</a>" +
                        "<p class='start-time'>From：" + formateDate(d.startTime) + "</p>" +
                        "<p class='final-time'>To：" + formateDate(d.endTime) + "</p>" +
                        "</li>");
                    _examList.append(startExam);
                    continue;
                } else if (d.complate == 'E') {
                    //分数计算完毕
                    var num = d.score;
                    var endExam = $("<li>" +
                        "<p class='topic'>" + d.examName + "</p>" +
                        "<p class='score-and-rank'>" +
                        "<span class='complete-score'>" + num.toFixed(1) + "</span><span>分</span>" +
                        "<span class='complete-rank'>NO.</span>" +
                        "<span class='score-rank'>" + d.studentRank + "</span></p>" +
                        "<a href='javascript:void(0)' class='enter-report' onclick=goTo('viewReport.html','" + d.examId + "')>查看报告</a>" +
                        "<p class='exam-date'>" + formateDate(d.endTime) + "</p>" +
                        "</li>");
                    _examList.append(endExam);
                    continue;
                } else {
                    var startExam = $("<li>" +
                        "<p class='topic'>" + d.examName + "</p>" +
                        "<p class='examiner'><span class='complete-number'>" + d.complateStudent + "</span>/" + d.totalStudent + "人</p>" +
                        "<a href='javascript:void(0)' class='enter-exam'>状态未知</a>" +
                        "<p class='start-time'>From：" + formateDate(d.startTime) + "</p>" +
                        "<p class='final-time'>To：" + formateDate(d.endTime) + "</p>" +
                        "</li>");
                    _examList.append(endExam);
                    continue;
                }
            }
            var _toggleLiE = $("#exam-report #examToggle");
            var _togglesE = "";
            _toggleLiE.html("");
            if (examTotal == 1) {
                _togglesE = $("<li class='col'>" + "1" + "</li>");
                _toggleLiE.append(_togglesE);
                $("#exam-report #examPrev").css('visibility', 'hidden');
                $("#exam-report #examNext").css('visibility', 'hidden')
            } else {
                for (var numE = 1; numE <= examTotal; numE++) {
                    _togglesE = $("<li>" + numE + "</li>");
                    _toggleLiE.append(_togglesE);
                    _togglesE.click(function () {
                        examIndex = $(this).index();
                        addListE();
                    });
                }
                if ((examIndex + 1) == examTotal) {
                    $("#exam-report #examNext").css('visibility', 'hidden');
                    $("#exam-report #examPrev").css('visibility', 'visible');
                } else if ((examIndex + 1) == 1) {
                    $("#exam-report #examNext").css('visibility', 'visible');
                    $("#exam-report #examPrev").css('visibility', 'hidden')
                } else {
                    $("#exam-report #examNext").css('visibility', 'visible');
                    $("#exam-report #examPrev").css('visibility', 'visible')
                }
                _toggleLiE.find("li").eq(examPage).addClass('col').siblings().removeClass('col');
            }
        }
    });
}