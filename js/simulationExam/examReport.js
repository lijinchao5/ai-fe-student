$(".screen button").click(function () {
    $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
    cliindex = 0;
    addList();
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
function goTo(url, id) {
    window.location.href = url + "?id=" + id;
}
$(function () {
    addList();
    addListeners();
});
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
        addList();
    });
    _pageup.click(function () {
        $(this).css('visibility', 'visible');
        currentPage--;
        if (currentPage <= 0) {
            currentPage = 0;
            $(this).css('visibility', 'hidden');
        }
        cliindex = currentPage;
        addList();
    });
}

function isflash() {
    var flag = 0;
    $(".btn-md").each(function (i, v) {
        var classname = $(this).attr("class");
        if ("btn btn-md btn-primary" == classname) {
            flag = i;
            return false;
        }
    })
    return flag;
}

function addList() {
    $('#header').load('../../html/common/header.html');
    $('#nav').load('../../html/common/nav.html');
    $('#footer').load('../../html/common/footer.html');
    // 获取学生考试列表
    var param = {};
    param.rows = 4;
    var isflashflag = isflash();
    if (isflashflag == 1) {
        param.state = '0';
    } else if (isflashflag == 2) {
        param.state = '1';
    } else if (isflashflag == 3) {
        param.state = '2';
    }
    param.page = cliindex + 1;
    var url = "exam/findStudentExamByPage.do";
    var _examReport = $(".report-banner");
    doAjax("get", url, param, function (data) {
        currentPage = parseInt(data.page) - 1;
        totalPage = data.countPage;
        var datas = data.rows;
        var _examList = $("#examList");
        _examList.html("");
        if (null == datas || datas.length <= 0) {
            $(".empty-all").show();
            $(".paging .up").css('visibility', 'hidden');
            $(".paging .down").css('visibility', 'hidden');
            $("#toggleLi").css('visibility', 'hidden');
        } else {
            $("#toggleLi").css('visibility', 'visible');
            $(".empty-all").hide();
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
                    var startExam = null
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
            var _toggleLi = $("#toggleLi");
            var _toggles = "";
            _toggleLi.html("");
            if (totalPage == 1) {
                _toggles = $("<li class='col'>" + "1" + "</li>");
                _toggleLi.append(_toggles);
                $(".paging .up").css('visibility', 'hidden');
                $(".paging .down").css('visibility', 'hidden')
            } else {
                for (var num = 1; num <= totalPage; num++) {
                    _toggles = $("<li>" + num + "</li>");
                    _toggleLi.append(_toggles);
                    _toggles.click(function () {
                        cliindex = $(this).index();
                        addList();
                    });
                }
                if ((cliindex + 1) == totalPage) {
                    $(".paging .down").css('visibility', 'hidden');
                    $(".paging .up").css('visibility', 'visible');
                } else if ((cliindex + 1) == 1) {
                    $(".paging .down").css('visibility', 'visible');
                    $(".paging .up").css('visibility', 'hidden')
                } else {
                    $(".paging .down").css('visibility', 'visible');
                    $(".paging .up").css('visibility', 'visible')
                }
                _toggleLi.find("li").eq(currentPage).addClass('col').siblings().removeClass('col');
            }


        }

    });

};
