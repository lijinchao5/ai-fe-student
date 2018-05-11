var map;
// var radar = document.getElementById("radarMap");
// radarMap(0,0,0,30);

$(function () {
    // $("#startworkhome").click();
    $('#header').load('../common/header.html');
    $('#nav').load('../common/nav.html');
    $('#footer').load('../common/footer.html');

    $(".start-practice").click(function () {
        $(".library-title").css("display", "none");
        $(".library-content").css("display", "block");
    });
    var id = getParam("id");
    initData(id);
    initDataAll(id);
    map = new Map();
});
function closeList() {
    $(".speak-speed ul").hide()
}

function openList() {
    $(".speak-speed ul").show()
}
function initnvl() {
    var data = JSON.parse(store.get("userInfo"));

    $(".user-name").text(data.name);
    if (data.name == "" || data.name == null) {
        $(".user-name").text("尚未设置昵称");
    }
    if (null == data.photo || "" == data.photo) {
        $(".user-photo").attr("src", "../../images/common/l-meb-icon.png")
    } else {
        $(".user-photo").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo)
    }
}


function initData(id) {
    var param = {};
    param.id = id;
    var url = "exercise/findArtcileEntityById.do";
    ajaxAsync("get", url, param, function (data) {
        var name = data.name;
        var typeName = data.typeName;
        var wordNum = data.wordNum;
        var levelName = data.levelName;
        $("#titleName").text(name);
        $("#typeName").text(typeName);
        $("#wordNum").text(wordNum);
        $("#levelName").text(levelName);

        $("#titleName1").text(name);
        $("#titleNameCon").text(name);
        $("#typeName1").text(typeName);
        $("#wordNum1").text(wordNum);
        $("#levelName1").text(levelName);

        $("#titleName2").text(name);
        $("#typeName2").text(typeName);
        $("#wordNum2").text(wordNum);
        $("#levelName2").text(levelName);

        var data = JSON.parse(store.get("userInfo"));
        $(".user-name").text(data.name);
        if (null == data.photo || "" == data.photo) {

        } else {
            $(".user-photo").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo)
        }
    });
}
function initDataAll(id) {
    var param = {};
    param.articleId = id;
    var url = "exercise/getExerciseDetail.do";
    ajaxAsync("get", url, param, function (data) {
        $("#carousel-inner").html("");
        $("#pscore").html("");
        console.log("------------start--------------------");
        var phtml = "";
        $("#numcount").html(data.length);
        for (var i = 0; i < data.length; i++) {
            var library = data[i];
            if (i == 0) {
                library.active = "active";
            }
            library.dataid = "data" + library.id;
            var readSentenceScore = library.readSentenceScore;
            if (readSentenceScore.length > 0) {
                library.sentence_cont = calculationScore(readSentenceScore);
            }
            var html = formatTemplate(library, $("#libraryscript").html());
            $("#carousel-inner").append(html);
            var radarhtml = '<div class="' + library.dataid + '" style="height: 120px;width: 150px;"></div>';
            $("#rscore").append(radarhtml);
            // 处理 雷达图
            radarMap(library.pronunciation, library.fluency, library.integrity, 30, library.dataid);
            //处理分数
            var score = library.score + "";
            console.log(score)
            if (score != "null") {
                if (score.indexOf(".") > 0) {
                    library.score = score.substring(0, score.indexOf("."));
                }
            } else {
                library.score = "";
            }
            phtml += '<span class="part-score" data="' + library.score + '">' + library.score + '</span>';
            //处理分数
            map.put(library.dataid, library);
        }
        $("#pscore").html(phtml);
        initon();
    });
}

function initon() {
    $("#startworkhome").click();
    //左右滚动
    $('.carousel').on('slid.bs.carousel', function (data) {
        readlibrary();
    });
    jd();
}


function jd() {
    $("#carousel-inner .item").each(function () {
        var dataid = $(this).attr("data");
        var library = map.get(dataid);
        if (library.readSentenceScore.length != 0) {
            $("#carousel-inner .item").attr("class", "item");
            $(this).addClass("active");
        }
    });
}

function readlibrary(isreadflag) {
    showp();
    roundProgress("roll-progress", 0);
    $("#carousel-inner .active").each(function () {
        var dataid = $(this).attr("data");
        var library = map.get(dataid);
        //console.log(library.readSentenceScore)
        if (library.readSentenceScore.length > 0 && isreadflag != true) {
            ishideorshow("q_restart");
            return;
        }
        isswitchfunction(false);
        ishideorshow("play-icon");
        // var speeds = $(".speak-speed .list .current").attr("speed");
        var speeds = $(".speak-speed .list .current").attr("speed");
        readrecord(library.audio_path, function (audiotime) {
            $(".q_restart").hide();
            $(".play-icon").hide();
            $(".q_sounding").show();
            ishideorshow("q_sounding");
            readrecord(ConfigLY.startrecordid, function () {
                funStartMp3();
                // progressBar(audiotime);
                roundProgressTimer("roll-progress", audiotime - 800);
                setTimeout(function () {
                    funStopMp3(function (json) {
                        ishideorshow("q_restart");
                        console.log("mp3保存成功:" + json.result);
                        library.lid = json.result;
                        library.student_audio_path = json.result;
                        map.put(library.dataid, library);
                        submitlibrary(library);
                        isswitchfunction(true);
                    });
                    showp()
                }, audiotime);
                $(".round-progress").click(function () {
                    funStopMp3(function (json) {
                        ishideorshow("q_restart");
                        console.log("mp3保存成功:" + json.result);
                        library.lid = json.result;
                        library.student_audio_path = json.result;
                        map.put(library.dataid, library);
                        submitlibrary(library);
                        isswitchfunction(true);
                    });
                    showp()
                });
            });
        }, speeds);
    });
}

//判断左右滚动和切换标签
function isswitchfunction(flag) {
    if (flag) {
        $(".right").each(function () {
            $(this).attr("data-slide", "next");
            $(this).attr("href", $(this).attr("hreftmp"));
            $(this).removeAttr("hreftmp");
            $(this).attr("class", "right carousel-control");
        })
        $(".left").each(function () {
            $(this).attr("data-slide", "prev");
            $(this).attr("href", $(this).attr("hreftmp"));
            $(this).removeAttr("hreftmp");
            $(this).attr("class", "left carousel-control");
        })
    } else {
        $(".right").each(function () {
            $(this).attr("hreftmp", $(this).attr("href"));
            $(this).removeAttr("href");
            $(this).attr("data-slide", "");
            $(this).attr("class", "right carousel-control out");
        })
        $(".left").each(function () {
            $(this).attr("hreftmp", $(this).attr("href"));
            $(this).removeAttr("href");
            $(this).attr("data-slide", "");
            $(this).attr("class", "left carousel-control out");
        })
    }
}

function calculationScore(homeworkStudentScoreWordEntities) {
    var html = "";
    for (var i = 0; i < homeworkStudentScoreWordEntities.length; i++) {
        var wordEntitie = homeworkStudentScoreWordEntities[i];
        if(wordEntitie.type=="7"){
            if(wordEntitie.text==" "){
                html+="&nbsp;";
            }else{
                html+="<b>"+wordEntitie.word+"</b>";
            }
        }else{
            if (wordEntitie.score < 60) {
                html += "<b class='red'>" + wordEntitie.word + "</b>";
            } else if (wordEntitie.score >= 60 && wordEntitie.score <= 85) {
                html += "<b class='orange'>" + wordEntitie.word + "</b>";
            } else if (wordEntitie.score > 85) {
                html += "<b class='green'>" + wordEntitie.word + "</b>";
            }
        }
    }
    return html;
}

function ishideorshow(classname) {
    layui.element.progress('ly', '0%');
    $(".q_sounding").hide();
    $(".q_restart").hide();
    $(".play-icon").hide();
    $("." + classname).show();
}

function readlid() {
    $("#carousel-inner .active").each(function () {
        var dataid = $(this).attr("data");
        var library = map.get(dataid);
        ishideorshow("play-icon");
        readrecord(library.student_audio_path, function (audiotime) {
            ishideorshow("q_restart");
        });
    });


}

function showp() {
    $("#pscore span").each(function () {
        $(this).attr("class", "part-score");
        $(this).html($(this).attr("data"));
    })
    $("#rscore > div").each(function () {
        $(this).css("display", "none")
    })
    $("#carousel-inner .item").each(function (i, v) {
        var classname = $(this).attr("class");
        if (classname == "item active") {
            var objspan = $("#pscore span").eq(i);
            objspan.addClass("current");
            $("#pscore").css("left",28-i*28+"px");
            console.log($("#pscore").css("left")+i);
            // objspan.html("");
            objspan.html(objspan.attr("data"));
            // 添加当前成绩
            $("#nowScore").html(objspan.attr("data"));
            var radardiv = $("#rscore > div").eq(i);
            radardiv.css("display", "block");
            $("#numnow").html(i + 1);
            var numnow = $("#numnow").html();
            var numcount = $("#numcount").html();
            if (numnow == 1) {
                $(".left").hide();
            } else {
                $(".left").show();
            }
            if (numcount == numnow) {
                $(".right").hide();
                $(".end").show();
            } else {
                $(".end").hide();
                $(".right").show();
            }

        }
    })
}

function submitend() {

    var param = {};
    param.articleId = getParam("id");
    console.log(param.articleId);
    var url = "exercise/submitExercise.do";
    ajaxAsync("post", url, param, function (data) {
        var enddate = format(new Date(data.updateDate), "yy/mm/dd HH:mm");
        $("#endtime").html("20" + enddate);
        var pronunciation = data.pronunciation;
        var fluency = data.fluency;
        var integrity = data.integrity;
        radarMap(pronunciation, fluency, integrity, 49, "radar-score");
        $(".free-practice-result .num").html(Math.round(data.score));
        // $("#endaccuracy").val(data.pronunciation);
        // $("#endfluency").val(data.fluency);
        // $("#endintegrity").val(data.integrity);
        if (data.score < 80) {
            $(".score70").show();
        } else if (data.score > 79 && data.score < 90) {
            $(".score80").show();
        } else if (data.score < 100) {
            $(".score100").show();
        }

        $("#submitend").click();
    });
}

function format(date, str) {
    var mat = {};
    mat.M = date.getMonth() + 1;//月份记得加1
    mat.H = date.getHours();
    mat.s = date.getSeconds();
    mat.m = date.getMinutes();
    mat.Y = date.getFullYear();
    mat.D = date.getDate();
    mat.d = date.getDay();//星期几
    mat.d = check(mat.d);
    mat.H = check(mat.H);
    mat.M = check(mat.M);
    mat.D = check(mat.D);
    mat.s = check(mat.s);
    mat.m = check(mat.m);
    if (str.indexOf(":") > -1) {
        mat.Y = mat.Y.toString().substr(2, 2);
        return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H + ":" + mat.m;
    }
    if (str.indexOf("/") > -1) {
        return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H + "/" + mat.m + "/" + mat.s;
    }
    if (str.indexOf("-") > -1) {
        return mat.Y + "-" + mat.M + "-" + mat.D + " " + mat.H + "-" + mat.m + "-" + mat.s;
    }
}
function check(str) {
    str = str.toString();
    if (str.length < 2) {
        str = '0' + str;
    }
    return str;
}

//录音进度条
function progressBar(second) {
    var element = layui.element;
    var n = 0, timer = setInterval(function () {
        n = n + 5;
        if (n == 100) {
            n = 100;
            clearInterval(timer);
        }
        element.progress('ly', n + '%');
    }, second / 21);
}
// 雷达图变量
// var radarMapy;
function submitlibrary(library) {
    var param = {};
    param.file = library.lid;
    param.sentenceId = library.id
    param.articleId = library.article_id;
    var url = "exercise/doExercise.do";
    ajaxAsync("post", url, param, function (data) {
        console.log("---保存成功----");
        var score = data.exerciseDetailEntity.score + "";
        if (score.indexOf(".") > 0) {
            score = score.substring(0, score.indexOf("."));
        }
        $("#nowScore").css("display", "block");
        $("#nowScore").html(score);
        $("#nowScore").css("animation", "uper 1.5s linear");
        setTimeout(function () {
            $("#nowScore").css("display", "none");
            $("#nowScore").css("animation", "");
        }, 1500);
        var exerciseDetailWords = data.exerciseDetailWords;
        var html = calculationScore(exerciseDetailWords);
        library.sentence_cont = html;
        $("#carousel-inner .active .part .part-con").html(html);
        map.put(library.dataid, library);
        $("#carousel-inner .item").each(function (i, v) {
            var classname = $(this).attr("class");
            if (classname == "item active") {
                setTimeout(function () {
                    $("#pscore span").eq(i).attr("data", score);
                    $("#pscore span").eq(i).html(score);
                    // $("#pscore span").eq(i).attr("class","part-score");
                }, 2000);
            }
        })
        classNam = map.get(library.dataid).dataid;
        if (classNam == null) {
            classNam = new data();
        }
        console.log(classNam);
        var pronunciation = data.exerciseDetailEntity.pronunciation;
        var fluency = data.exerciseDetailEntity.fluency;
        var integrity = data.exerciseDetailEntity.integrity;
        var arr = [pronunciation, fluency, integrity];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == null || arr[i] == undefined) {
                arr[i] = 0;
            }
        }
        radarMap(pronunciation, fluency, integrity, 30, classNam);
        $("#carousel-inner .active progress").eq(0).attr("value", data.exerciseDetailEntity.pronunciation);
        $("#carousel-inner .active progress").eq(1).attr("value", data.exerciseDetailEntity.fluency);
        $("#carousel-inner .active progress").eq(2).attr("value", data.exerciseDetailEntity.integrity);
    });
}

// 语速
$(".speak-speed .list").click(function () {
    speakSpeed();
});
function speakSpeed() {
    $(".speak-speed ul").show();
    $(".speak-speed ul li").each(function () {
        $(this).click(function () {
            var ht = $(this).html();
            var hs = $(this).attr("speed");
            $(".speak-speed .list .current").html(ht);
            $(".speak-speed .list .current").attr("speed", hs);
            // 处理语速数据
            $(".speak-speed ul").hide();
            if ($("#player_audio").length != 0) {
                var audio = document.getElementById("player_audio");
                var speed = $(this).attr("speed");
                audio.playbackRate = parseFloat(speed);
                audio.volume = 1;
            }
        })
    })
}

function roundProgressTimer(id, timer, aa) {
    timer = timer / 20;
    console.log(timer);
    var width = -5;
    var timer = setInterval(function () {
        width += 5;
        if (aa) {
            clearInterval(timer);
        }
        if (width > 100 || width == 100) {
            clearInterval(timer)
        }
        roundProgress(id, width);
        // console.log(width)
    }, timer);
}
//    timer(width);
function roundProgress(id, value) {
    var myCharts = echarts.init(document.getElementById(id));
    //颜色
//    var colorData = ['#ff6d80', '#ffb846', '#36dbbb'];
    var colorData = ['#fff'];
    //    数据
    var data = [
        {
            "name": '准确度',
            "value": value
        }
    ];
    //将数据放入圆环中
    var create = function (data) {
        var result = [];
        for (var i = 0; i < data.length; i++) {
            result.push({
                name: '',
                // center: [(i * 26 + 22.5 + '%'), '50%'], // 去掉本行，圆环居中
                radius: ['80%', '100%'],
                type: 'pie',
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                markPoint: {
                    data: [{}]
                },
                data: [
                    {
                        value: data[i].value,
                        name: data[i].name,
                        itemStyle: {
                            normal: {
                                color: colorData[i]
                            },
                            emphasis: {
                                color: colorData[i]
                            }
                        },
                        label: {
                            normal: {
                                formatter: '{d} %',
                                position: 'center', // 显示文字的位置
                                show: false,  // 是否显示中间文字
                                textStyle: {  // 显示文字 样式
                                    fontSize: '16',
                                    fontWeight: 'bold',
                                    color: colorData[i]
                                }
                            }
                        }
                    },
                    {
                        value: (100 - data[i].value),
                        name: '',
                        tooltip: {
                            show: false
                        },
                        itemStyle: {
                            normal: {
                                color: 'transparent'
                            },
                            emphasis: {
                                color: 'transparent'
                            }
                        },
                        hoverAnimation: false
                    }
                ]
            });
        }
        return result;
    };
    // 指定图表的配置项和数据 饼图
    var options = {
        /*tooltip: {
         trigger: 'item',
         formatter: function (params, ticket, callback) {
         var res = params.name + ' : ' + params.percent + '%';
         return res;
         }
         },  // 鼠标移入，显示区块百分比
         grid: {
         bottom: 100,
         top: 150
         },*/
        /*xAxis: [{show: false}],
         yAxis: [{show: false}],*/
        series: create(data)
    };
    myCharts.setOption(options);
}