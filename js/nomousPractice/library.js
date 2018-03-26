var map;
$(function() {
	$('#header').load('../common/header.html');
    $('#nav').load('../common/nav.html');
    $('#back').load('../common/back.html');

    $(".start-practice").click(function(){
        $(".library-title").css("display","none");
        $(".library-content").css("display","block");
    });
	var id = getParam("id");
	initData(id);
	initDataAll(id);
	map=new Map();
});

function initnvl(){
	var data = JSON.parse(localStorage.getItem("userInfo"));
    $(".user-name").text(data.name);
    if (null == data.photo || "" == data.photo) {

    } else {
        $(".user-photo").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo)
    }
}


function initData(id){
	var param = {};
	param.id=id;
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
    	$("#typeName1").text(typeName);
    	$("#wordNum1").text(wordNum);
    	$("#levelName1").text(levelName);
    	
    	$("#titleName2").text(name);
    	$("#typeName2").text(typeName);
    	$("#wordNum2").text(wordNum);
    	$("#levelName2").text(levelName);
    	
    	var data = JSON.parse(localStorage.getItem("userInfo"));
        $(".user-name").text(data.name);
        if (null == data.photo || "" == data.photo) {

        } else {
            $(".user-photo").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo)
        }
    });
}
function initDataAll(id){
	var param = {};
	param.articleId=id;
	var url = "exercise/getExerciseDetail.do";
	ajaxAsync("get", url, param, function (data) {
		$("#carousel-inner").html("");
		$("#pscore").html("");
		console.log("------------start--------------------");
		var phtml="";
		$("#numcount").html(data.length);
		for(var i=0;i<data.length;i++){
			var library= data[i];
			if(i==0){
				library.active="active";
			}
			library.dataid="data"+library.id;
			var readSentenceScore=library.readSentenceScore;
			if(readSentenceScore.length>0){
				library.sentence_cont=calculationScore(readSentenceScore);
			}
			var html = formatTemplate(library, $("#libraryscript").html());
			$("#carousel-inner").append(html);
			//处理分数
			var score=library.score+"";
			if(score!="null"){
				if(score.indexOf(".")>0){
					library.score=score.substring(0,score.indexOf("."));
	 			}
			}else{
				library.score="";
			}
			phtml+='<span class="part-score" data="'+library.score+'">'+library.score+'</span>';
			//处理分数
			map.put(library.dataid,library);
		}
		$("#pscore").html(phtml);
		initon();
	});
}

function initon(){
	//左右滚动
	 $('.carousel').on('slid.bs.carousel', function (data) {
		 readlibrary();
	 });
	 $("#startworkhome").click();
	 jd();
}


function jd(){
	$("#carousel-inner .item").each(function(){
		var dataid=$(this).attr("data");
		var library=map.get(dataid);
		if(library.readSentenceScore.length!=0){
			$("#carousel-inner .item").attr("class","item");
			$(this).addClass("active");
		}
	});
}

function readlibrary(isreadflag){
	showp();
	$("#carousel-inner .active").each(function(){
		var dataid=$(this).attr("data");
		var library=map.get(dataid);
		//console.log(library.readSentenceScore)
		if(library.readSentenceScore.length>0&&isreadflag!=true){
			ishideorshow("q_restart");
			return;
		}
		isswitchfunction(false);
		ishideorshow("play-icon");
		readrecord(library.audio_path,function(audiotime){
			readrecord(ConfigLY.startrecordid,function(){
				$(".q_restart").hide();
				$(".play-icon").hide();
				$(".q_sounding").show();
				ishideorshow("q_sounding");
				funStartMp3();
				progressBar(audiotime);
				setTimeout(function(){
					funStopMp3(function(json){
						ishideorshow("q_restart");
						console.log("mp3保存成功:"+json.result);
						library.lid=json.result;
						library.student_audio_path=json.result;
						map.put(library.dataid,library);
						submitlibrary(library);
						isswitchfunction(true);
					});
				},audiotime);
			});
		});
	});
}

//判断左右滚动和切换标签
function isswitchfunction(flag){
	if(flag){
		$(".right").each(function(){
	    	$(this).attr("data-slide","next");
	    	$(this).attr("href",$(this).attr("hreftmp"));
			$(this).removeAttr("hreftmp");
			$(this).attr("class","right carousel-control");
	    })
	    $(".left").each(function(){
	    	$(this).attr("data-slide","prev");
	    	$(this).attr("href",$(this).attr("hreftmp"));
	    	$(this).removeAttr("hreftmp");
	    	$(this).attr("class","left carousel-control");
	    })
	}else{
		$(".right").each(function(){
			$(this).attr("hreftmp",$(this).attr("href"));
			$(this).removeAttr("href");
	    	$(this).attr("data-slide","");
	    	$(this).attr("class","right carousel-control out");
	    })
	    $(".left").each(function(){
	    	$(this).attr("hreftmp",$(this).attr("href"));
	    	$(this).removeAttr("href");
	    	$(this).attr("data-slide","");
	    	$(this).attr("class","left carousel-control out");
	    })
	}
}

function calculationScore(homeworkStudentScoreWordEntities){
	var html="";
	for(var i=0;i<homeworkStudentScoreWordEntities.length;i++){
		var wordEntitie=homeworkStudentScoreWordEntities[i];
			if(wordEntitie.score<60){
				html+="<b class='red'>"+wordEntitie.word+"</b>";
			}else if(wordEntitie.score>=60&&wordEntitie.score<=85){
				html+="<b class='orange'>"+wordEntitie.word+"</b>";
			}else if(wordEntitie.score>85){
				html+="<b class='green'>"+wordEntitie.word+"</b>";
			}
	}
	return html;
}

function ishideorshow(classname){
	layui.element.progress('ly', '0%');
	$(".q_sounding").hide();
	$(".q_restart").hide();
	$(".play-icon").hide();
	$("."+classname).show();
}

function readlid(){
	$("#carousel-inner .active").each(function(){
		var dataid=$(this).attr("data");
		var library=map.get(dataid);
		ishideorshow("play-icon");
		readrecord(library.student_audio_path,function(audiotime){
			ishideorshow("q_restart");
		});
	});
	
	
}

function showp(){
	$("#pscore span").each(function(){
		$(this).attr("class","part-score");
		$(this).html($(this).attr("data"));
	})
	$("#carousel-inner .item").each(function(i,v){
		var classname=$(this).attr("class");
		if(classname=="item active"){
			var objspan=$("#pscore span").eq(i);
			objspan.addClass("current");
			objspan.html("");
			$("#numnow").html(i+1);
			var numnow=$("#numnow").html();
			var numcount=$("#numcount").html();
			if(numnow==1){
				$(".left").hide();
			}else{
				$(".left").show();
			}
			if(numcount==numnow){
				$(".right").hide();
				$(".end").show();
			}else{
				$(".end").hide();
				$(".right").show();
			}
			
		}
	})
}

function submitend(){
	
	var param = {};
	param.articleId=getParam("id");
	var url = "exercise/submitExercise.do";
	ajaxAsync("post", url, param, function (data) {
		//console.log(data);
		var enddate=format(new Date(data.updateDate),"yy/mm/dd HH:mm");
		$("#endtime").html("20"+enddate);
		$("#endaccuracy").val(data.pronunciation);
		$("#endfluency").val(data.fluency);
		$("#endintegrity").val(data.integrity);
		if(data.score<80){
			$(".score70").show();
		}else if(data.score>79&&data.score<90){
			$(".score80").show();
		}else if(data.score<100){
			$(".score100").show();
		}
		
		$("#submitend").click();
	});
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

//录音进度条
function progressBar(second){
	var element=layui.element;
	var n = 0, timer = setInterval(function(){
        n =n+5;  
        if(n==100){
          n = 100;
          clearInterval(timer);
        }
        element.progress('ly', n+'%');
      }, second/21);
}

function submitlibrary(library){
	var param = {};
	param.file=library.lid;
	param.sentenceId=library.id;
	param.articleId=library.article_id;
	var url = "exercise/doExercise.do";
	ajaxAsync("post", url, param, function (data) {
		console.log("---保存成功----");
		var score=data.exerciseDetailEntity.score+"";
		if(score.indexOf(".")>0){
			score=score.substring(0,score.indexOf("."));
		}
		var exerciseDetailWords=data.exerciseDetailWords;
		var html=calculationScore(exerciseDetailWords);
		library.sentence_cont=html;
		$("#carousel-inner .active .part").html(html);
		map.put(library.dataid,library);
		$("#carousel-inner .item").each(function(i,v){
			var classname=$(this).attr("class");
			if(classname=="item active"){
				$("#pscore span").eq(i).attr("data",score);
				$("#pscore span").eq(i).html(score);
				$("#pscore span").eq(i).attr("class","part-score");
			}
		})
		$("#carousel-inner .active progress").eq(0).attr("value",data.exerciseDetailEntity.pronunciation);
		$("#carousel-inner .active progress").eq(1).attr("value",data.exerciseDetailEntity.fluency);
		$("#carousel-inner .active progress").eq(2).attr("value",data.exerciseDetailEntity.integrity);
	});
}


