$(function () {
	initAllData();
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
function initAllData(){
	ajaxAsync("get", "exercise/getStudentExerciseResult.do", null, function (data) {
		for(var i=0;i<data.length;i++){
			var obj=data[i];
			 var word_num=obj.word_num+"";
 			if(word_num!="null"){
 				if(word_num.indexOf(".")>0){
 					obj.word_num=word_num.substring(0,word_num.indexOf("."));
 	 			}
 			}else{
 				obj.word_num="0";
 			}
			if(obj.type=="1"){
				$(".growth-title span").eq(i).html(obj.word_num);
			}else if(obj.type=="2"){
				$(".growth-title span").eq(i).html(obj.word_num);
			}else if(obj.type=="3"){
				$(".growth-title span").eq(i).html(obj.word_num);
			}else if(obj.type=="4"){
				$(".growth-title span").eq(i).html(obj.word_num);
			}
			
		}
	});
}


function initData() {
    var param = {};
    param.rows = 6;
    param.page = cliindex + 1;
    var url = "/exercise/getArtcileRead.do";
    var _reportAll = $(".growth-content");
    ajaxAsync("get", url, param, function (data) {
        currentPage = parseInt(data.page) - 1;
        totalPage = data.countPage;
        if (null != data && data.rows.length > 0) {
            var _jobList = $(".growth-content");
            _jobList.html("");
            for (var i = 0; i < data.rows.length; i++) {
                var d = data.rows[i];
                var score=d.score+"";
    			if(score!="null"){
    				if(score.indexOf(".")>0){
    					d.score=score.substring(0,score.indexOf("."));
    	 			}
    			}else{
    				d.score="";
    			}
    			
    			var enddate=format(new Date(d.update_date),"yy/mm/dd HH:mm");
    			d.update_date="20"+enddate;
                var html = formatTemplate(d, $("#sjscript").html());
                _jobList.append(html);
            }
            var _toggleLi = $("#toggleLi");
            var _toggles = "";
            _toggleLi.html("");
            $("#toggleLi").css('visibility', 'visible');
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
        
        	
        } else {
            var _reportEmpty = "";
            _reportEmpty = $("<div class='empty-all'>" + "<img src='../../images/common/empty.png' alt='你还没有练习哦，快去吧'/>" + "<p class='empty-text'>" + "你还没有练习哦，快去吧" + "</p>" + "</div>");
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


function format(date,str){
    var mat={};
    mat.M=date.getMonth()+1;//月份记得加1
    mat.H=date.getHours();
    mat.s=date.getSeconds();
    mat.m=date.getMinutes();
    mat.Y=date.getFullYear();
    mat.D=date.getDate();
    mat.d=date.getDay();//星期几
    mat.d=check(mat.d);
    mat.H=check(mat.H);
    mat.M=check(mat.M);
    mat.D=check(mat.D);
    mat.s=check(mat.s);
    mat.m=check(mat.m);
	if(str.indexOf(":")>-1){
		mat.Y=mat.Y.toString().substr(2,2);
		return mat.Y+"/"+mat.M+"/"+mat.D+" "+mat.H+":"+mat.m;
    }
    if(str.indexOf("/")>-1){
        return mat.Y+"/"+mat.M+"/"+mat.D+" "+mat.H+"/"+mat.m+"/"+mat.s;
    }
    if(str.indexOf("-")>-1){
        return mat.Y+"-"+mat.M+"-"+mat.D+" "+mat.H+"-"+mat.m+"-"+mat.s;
    }
}
function check(str){
    str=str.toString();
    if(str.length<2){
        str='0'+ str;
    }
    return str;
}

function ly(obj){
	$(obj).html("停止");
	$(obj).attr("onclick","stoplymp3(this);")
	playflag=true;
	var param = {};
	param.articleId=$(obj).attr("data");
	var url = "exercise/getExerciseDetail.do";
	ajaxAsync("get", url, param, function (data) {
		readlyAll(data,obj);
	});
}

var playflag=false;
var lynow=0;
var lylength=0;
function readlyAll(data,obj){
	if(!playflag){
		return;
	}
	lylength=data.length-1;
	for(var i=0;i<data.length;i++){
		var library=data[i];
		if(i==lynow){
			readrecord(library.student_audio_path,function(audiotime){
				if(lylength!=lynow){
					lynow++;
					readlyAll(data,obj);
				}else{
					stoplymp3(obj);
				}
			});
			break;
		}
	}
}

function stoplymp3(obj){
	var player_audio=document.getElementById("player_audio");
	if(player_audio)player_audio.pause();
	playflag=false;
	$(obj).html("我的录音");
	$(obj).attr("onclick","ly(this);")
}
