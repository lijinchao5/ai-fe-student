// button 按钮
$(".screen button").click(function () {
    $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
    cliindex = 0;
    initData();
});


$(function () {
    initData();
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

function isflash(){
	var flag=0;
	$(".btn-md").each(function(i,v){
		var classname=$(this).attr("class");
		if("btn btn-md btn-primary"==classname){
			flag=i;
			return false;
		}
	})
	return flag;
}

function initData() {
	console.log("isflash:"+isflash());
    var param = {};
    param.rows = 6;
    var isflashflag=isflash();
    if(isflashflag==1){
    	param.over='T';
    }else if(isflashflag==2){
    	param.over='F';
    }
    param.page = cliindex + 1;
    var url = "homework/getStudentHomeWorkList.do";
    var _reportAll = $(".report-banner");
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
                        "<p><span class='final-time'>" + formateDate(d.endTime) + "</span></p></li>")
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
            var _toggleLi = $("#toggleLi");
            var _toggles = "";
            _toggleLi.html("");
            if (totalPage == 1) {
                _toggles = $("<li class='col'>" + "1" + "</li>");
                _toggleLi.append(_toggles);
                $(".paging .up").css('visibility', 'hidden');
                $(".paging .down").css('visibility', 'hidden');
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
                $("#toggleLi").css('visibility', 'visible');
            }
        } else {
            var _reportEmpty = "";
            _reportEmpty = $("<div class='empty-all'>" + "<img src='../../images/common/empty.png' alt='没有作业'/>" + "<p class='empty-text'>" + "老师还没有布置作业哦！" + "</p>" + "</div>");
            _reportAll.append(_reportEmpty);
            $(".paging .up").css('visibility', 'hidden');
            $(".paging .down").css('visibility', 'hidden');
            $("#toggleLi").css('visibility', 'hidden');

        }
    });
}


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