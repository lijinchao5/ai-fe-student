$(function () {
    //getWork();
    getClass();
    $(".task-title li").eq(0).click();
    $('#header').load('../common/header.html');
    $('#nav').load('../common/nav.html');
    $('#footer').load('../common/footer.html');
});

function changeClass() {
    $(".class-list").toggle()
}

function jumpMate() {
    var id = getParam("id");
    window.location.href = './myClassmate.html?id=' + id;
}

//作业模考切换
$(".task-title li").click(function () {
    $(this).addClass("current").siblings().removeClass("current");
    var Liindex = $(this).index();
    $(".task-content .reports").eq(Liindex).show().siblings().hide();
});

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
                    $("#currentClass").text(data[i].grade + '年级' + data[i].name + '(' + data[i].classId + ')');
                    var className = data[i].grade + '年级' + data[i].name;
                    store.set("className", className);
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
        }
    })
}

//切换班级选中状态
function choiceClass(id) {
    window.location.href = './myClass.html?id=' + id;
}

//获取作业信息
function getWork() {
    initData();
    addListeners();
}
var currentPage = 0;
var totalPage = 0;
var cliindex = 0;
function addListeners() {
    var _pageup = $(".paging .up");
    var _pagedown = $(".paging .down");
    _pagedown.click(function () {
        $(this).css('visibility', 'visible');
        currentPage++;
        if (currentPage >= totalPage - 1) {
            currentPage = totalPage - 1;
            $(this).css("visibility", "hidden");
        }
        cliindex = currentPage;
        initData();
    });
    _pageup.click(function () {
        $(this).css('visibility', 'visible');
        currentPage--;
        if (currentPage <= 0) {
            currentPage = 0;
            $(this).css('visibility', 'hidden');
        }
        cliindex = currentPage;
        initData();
    });
}
function goHomeworkReport(id, com) {
    if (com == 'F') {
        alert("作业未完成,作业报告为空!")
    } else {
        window.location.href = "homeworkReport.html?id=" + id;
    }
}
function isflash() {
    var flag = 0;
    $(".btn-md").each(function (i, v) {
        var classname = $(this).attr("class");
        if ("btn btn-md btn-primary" == classname) {
            flag = i;
            return false;
        }
    });
    return flag;
}
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
    param.page = cliindex + 1;
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
                        cliindex = $(this).index();
                        initData();
                    });
                }
                if ((cliindex + 1) == totalPage) {
                    $("#work-report .paging .down").css('visibility', 'hidden');
                    $("#work-report .paging .up").css('visibility', 'visible');
                } else if ((cliindex + 1) == 1) {
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
var currentPages = 0;
var totalPages = 0;
var cliindexs = 0;
function addListenersE() {
    var _pageup = $("#exam-report .paging .up");
    var _pagedown = $("#exam-report .paging .down");
    _pagedown.click(function () {
        $(this).css('visibility', 'visible');
        currentPages++;
        if (currentPages >= totalPages - 1) {
            currentPages = totalPages - 1;
            $(this).css("visibility", "hidden");
        }
        cliindexs = currentPages;
        addListE();
    });
    _pageup.click(function () {
        $(this).css('visibility', 'visible');
        currentPages--;
        if (currentPages <= 0) {
            currentPages = 0;
            $(this).css('visibility', 'hidden');
        }
        cliindexs = currentPages;
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

function goTo(url, id) {
    window.location.href = url + "?id=" + id;
}

// 获取学生考试列表
function addListE() {
    var param = {};
    param.rows = 4;
    var isflashflagE = isflashE();
    var getId = getParam("id");
    //var getId = $("#currentClass").text();
    if (isflashflagE == 1) {
        param.state = '0';
    } else if (isflashflagE == 2) {
        param.state = '1';
    } else if (isflashflagE == 3) {
        param.state = '2';
    }
    param.page = cliindexs + 1;
    param.classId = getId;
    var url = "exam/findStudentExamByPage.do";
    var _examReport = $("#exam-report .report-banner");
    doAjax("get", url, param, function (data) {
        currentPages = parseInt(data.page) - 1;
        totalPages = data.countPage;
        var datas = data.rows;
        var _examList = $("#examList");
        _examList.html("");
        if (null == datas || datas.length <= 0) {
            $("#exam-report .empty-all").show();
            $("#exam-report .paging .up").css('visibility', 'hidden');
            $("#exam-report .paging .down").css('visibility', 'hidden');
            $("#exam-report #toggleL").css('visibility', 'hidden');
        } else {
            $("#exam-report #toggleL").css('visibility', 'visible');
            $("#exam-report .empty-all").hide();
            for (var i = 0; i < datas.length; i++) {
                var d = datas[i];
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
            var _toggleLi = $("#exam-report #toggleL");
            var _toggles = "";
            _toggleLi.html("");
            if (totalPages == 1) {
                _toggles = $("<li class='col'>" + "1" + "</li>");
                _toggleLi.append(_toggles);
                $("#exam-report .paging .up").css('visibility', 'hidden');
                $("#exam-report .paging .down").css('visibility', 'hidden')
            } else {
                for (var numE = 1; numE <= totalPages; numE++) {
                    _toggles = $("<li>" + numE + "</li>");
                    _toggleLi.append(_toggles);
                    _toggles.click(function () {
                        cliindexs = $(this).index();
                        addListE();
                    });
                }
                if ((cliindexs + 1) == totalPages) {
                    $("#exam-report .paging .down").css('visibility', 'hidden');
                    $("#exam-report .paging .up").css('visibility', 'visible');
                } else if ((cliindexs + 1) == 1) {
                    $("#exam-report .paging .down").css('visibility', 'visible');
                    $("#exam-report .paging .up").css('visibility', 'hidden')
                } else {
                    $("#exam-report .paging .down").css('visibility', 'visible');
                    $("#exam-report .paging .up").css('visibility', 'visible')
                }
                _toggleLi.find("li").eq(currentPages).addClass('col').siblings().removeClass('col');
            }
        }
    });
}