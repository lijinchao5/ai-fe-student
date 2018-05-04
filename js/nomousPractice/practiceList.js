//$(function () {
//    initData();
//    addListeners();
//    classify();
//    levelAdd()
//});
var map;
$(document).ready(function () {
    map = new Map();
    $('#header').load('../common/header.html');
    $('#nav').load('../common/nav.html');
    $('#footer').load('../common/footer.html');
    addListeners();
    classify();
    levelAdd();

//分类 上下按钮切换
    var downindex = 0;
    $(".down-next").click(function () {
        var practiceLen = $(".classification").length;
        $(this).attr("src", "../../images/common/down-0.png");
        $(".up-prev").attr("src", "../../images/common/top-0.png");
        downindex++;
        if (downindex >= practiceLen - 1) {
            downindex = practiceLen - 1;
            $(this).attr("src", "../../images/common/down-1.png");
        }
        $(".classification").hide().eq(downindex).show();
    });
    $(".up-prev").click(function () {
        $(this).attr("src", "../../images/common/top-0.png");
        $(".down-next").attr("src", "../../images/common/down-0.png");
        downindex--;
        if (downindex <= 0) {
            downindex = 0;
            $(this).attr("src", "../../images/common/top-1.png");
        }
        $(".classification").hide().eq(downindex).show();
    });
});

var currentPage = 0;
var totalPage = 0;
var cliindex = 0;
var claindex = 0;
//等级切换
function levelAdd() {
    var url = "dic/findDicByType.do?type=15";
    var param = {};
    var _levelScale = $(".level-scale");
    doAjax("get", url, param, function (data) {
        var datatmp = {};
        datatmp.id = "";
        datatmp.name = "全部";
        data.unshift(datatmp);
        for (var i = 0; i < data.length; i++) {
            map.put("data" + data[i].id, data[i]);
            var _levelLi = "";
            _levelLi = $("<li data='" + data[i].id + "'>" + data[i].name + "</li>");
            _levelScale.append(_levelLi);
            _levelLi.click(function () {
                claindex = $(this).index();
                _levelScale.find("li").eq(claindex).addClass('current').siblings().removeClass('current');
                initData();
            });
        }
        _levelScale.find("li").eq(claindex).addClass('current').siblings().removeClass('current');
        initData();
    })
}


function classify() {
    var url = "dic/findDicByType.do?type=16";
    var param = {};
    var _curentUl = $(".level-classify");
    doAjax("get", url, param, function (data) {
        var _classifyUl = "";
        for (var a = 0; a < data.length; a++) {
            if (a % 6 == 0) {
                _classifyUl += "<ul class='classification'>";
            }
            if (a == 0) {
                _classifyUl += "<li data='' class='current'>全部</li>";
            }
            map.put("data" + data[a].id, data[a]);
            _classifyUl += "<li data='" + data[a].id + "'>" + data[a].name + "</li>";
            if (a % 6 == 5 || a == data.length - 1) {
                _classifyUl += "</ul>";
            }
        }
        _curentUl.append(_classifyUl);
        onclickclassifyli();
        if (data.length <= 6) {
            $(".down-top").css("visibility", "hidden")
        } else {
            $(".down-top").css('visibility', 'visible')
        }
    })
}


function onclickclassifyli() {
    $(".level-classify li").click(function (i, v) {
        var classname = $(this).attr("class");
        if (classname == "current") {
            $(this).removeClass('current');
        } else {
            $(".level-classify li").eq(0).removeClass('current');
            $(this).addClass('current');
        }
        //判断选中几个
        var length = $(".level-classify .current").length;
        if (length == 0) {
            $(".level-classify li").eq(0).addClass('current');
        }
        //判断全部是否点中
        var classnameAll = $(".level-classify li").eq(0).attr("class");
        if (classnameAll == "current") {
            $(".level-classify li").removeClass('current');
            $(".level-classify li").eq(0).addClass('current');
        }
        initData();
    });
}

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

function initData() {
    var type = "";
    var level = "";
    var _artReport = $(".level-classify");
    var param = {};
    param.rows = 9;
    param.page = cliindex + 1;
    param.type = "";
    var levelid = $(".level-scale .current").attr("data");
    var levelmap = map.get("data" + levelid);
    if (levelmap != null) {
        param.level = map.get("data" + levelid).nameVal;
    }
    $(".level-classify .current").each(function () {
        var typeid = $(this).attr("data");
        var typemap = map.get("data" + typeid);
        console.log("-------------")
        console.log(typemap)
        if (typemap != null && typemap.nameVal != undefined) {
            param.type += typemap.nameVal + ",";
        }
    })
    var url = "exercise/findExercisePage.do";
    doAjax("post", url, param, function (data) {
        currentPage = parseInt(data.page) - 1;
        totalPage = data.countPage;
        var datas = data.rows;
        if (null == datas || datas.length <= 0) {
            var _reportEmpty = "";
            var _practice = $(".practice-wrap");
            _reportEmpty = $("<div class='empty-all'>" + "<img src='../../images/common/empty.png' alt='没有作业'/>" + "<p class='empty-text'>" + "再点点其他的吧！" + "</p>" + "</div>");
            _practice.html(_reportEmpty);
            $(".paging .up").css('visibility', 'hidden');
            $(".paging .down").css('visibility', 'hidden');
            $("#toggleLi").css('visibility', 'hidden');
        } else {
            $("#toggleLi").css('visibility', 'visible');
            var _practice = $(".practice-wrap").html('<ul class="text-practice" id="artList"></ul>');
            var _artList = $("#artList");
            _artList.html("");
            for (var i = 0; i < datas.length; i++) {
                var d = datas[i];
                var _li = $("<li>" +
                    "<p class='practice-title'>" + d.name + "</p>" +
                    "<p class='practice-info'><span>字数：</span><span>" + d.wordNum + "</span>" +
                    "<span class='pr-classify'>类别：</span><span>" + d.typeName + "</span>" +
                    "</p>" +
                    "<p onclick=goTo('" + d.id + "') class='start-read'>我要练</p>" +
                    "</li>");
                _artList.append(_li);
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
            }

        }
    });
}

function goTo(id) {
    window.location.href = "./library.html?id=" + id;
}

