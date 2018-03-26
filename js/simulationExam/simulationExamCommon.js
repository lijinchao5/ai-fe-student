var bigdataTextArr = new Array('','一.','二.','三.','四.','五.','六.','七.','八.','九.','十.','十一.','十二.','十三.','十四.','十五.','十六.','十七.','十八.','十九.','二十.');

//当前第几屏幕
var index=0;
//总时间
var totalTime;
//剩余时间
var timeSurplus;
//设置时间
function setmmssTime(objId,times){
	var f=parseInt(times/60)+"";
	var m=times%60+"";
	if(f.length==1){
		f="0"+f;
	}
	if(m.length==1){
		m="0"+m;
	}
	$("."+objId).html(f+":"+m);
}

//左侧倒计时
function setIntervalmmssTime(){
	var timer=setInterval(function(){
		if(timeSurplus>0){
			timeSurplus--;
			setmmssTime("remaining-time",timeSurplus);
		}else{
			clearInterval(timer);
		}
	},1000);
}

//跳到下一屏
function nextwrap(classname){
	$(".wrap").hide();
	$("."+classname).show();
	if("start-exam"==classname){
		setIntervalmmssTime();
		readbigdata();
	}
}

//选择题拼装
function switchABCD(paperSubjectDetailId,text){
	if(text==null){
		return "";
	}
	var html="";
	var arr=text.split("||");
	for(var i=0;i<arr.length;i++){
		if(i==0){
			html+='<input type="radio" name="radio'+paperSubjectDetailId+'" value="A" />&nbsp;A. '+arr[i]+'<br/>';
		}else if(i==1){
			html+='<input type="radio" name="radio'+paperSubjectDetailId+'" value="B"/>&nbsp;B. '+arr[i]+'<br/>';
		}else if(i==2){
			html+='<input type="radio" name="radio'+paperSubjectDetailId+'" value="C"/>&nbsp;C. '+arr[i]+'<br/>';
		}else if(i==3){
			html+='<input type="radio" name="radio'+paperSubjectDetailId+'" value="D"/>&nbsp;D. '+arr[i]+'<br/>';
		}else if(i==4){
			html+='<input type="radio" name="radio'+paperSubjectDetailId+'" value="E"/>&nbsp;E. '+arr[i]+'<br/>';
		}else if(i==5){
			html+='<input type="radio" name="radio'+paperSubjectDetailId+'" value="F"/>&nbsp;F. '+arr[i]+'<br/>';
		}else if(i==6){
			html+='<input type="radio" name="radio'+paperSubjectDetailId+'" value="G"/>&nbsp;G. '+arr[i]+'<br/>';
		}
	}
	return html;
}

//下一屏的初始读取
function readcommon(paperDetail,fun){
	//读大题
	readrecord(paperDetail.bigdataaudio,function(audiotime){
		//读题干
	 readrecord(paperDetail.audio,function(audiotime){
		 //读引导语
		 readrecord(paperDetail.guideAudio,function(audiotime){
			 isreaddata(paperDetail,fun);
		 });
	 });
	});
}

//判断读题时间。如果为空或者0，直接调用回调方法
function isreaddata(paperDetail,fun){
	 if(paperDetail.readTime==null||paperDetail.readTime==0){
		 fun();
	 }else{
		 readrecord(ConfigLY.ytstart,function(audiotime){
			 countdown(true,paperDetail.readTime,function(){
				 readrecord(ConfigLY.ytend,function(audiotime){
					 fun();
				 })
			 });
		 });
	 }
}
//判断读题时间，如果为空或者0，直接调用回调方法
function iswritedata(paperDetail,fun){
	if(paperDetail.writeTime==null||paperDetail.writeTime==0){
		fun();
	}else{
		readrecord(ConfigLY.dtstart,function(audiotime){
			countdown(false,paperDetail.writeTime,function(){
				readrecord(ConfigLY.dtend,function(audiotime){
					fun();
				})
			});
		});
	}
}

//读取大题
function readbigdata(){
	$("#question-answer .flagActive").each(function(v,obj){
		 var paperDetail=map.get($(this).attr("bigdata"));
		 if(paperDetail.type=="2"){
			 readcommon(paperDetail,readall);
		 }else if(paperDetail.type=="4"){
			 readcommon(paperDetail,shortReading);
		 }else if(paperDetail.type=="6"){
			 readcommon(paperDetail,shortReading);
		 }else if(paperDetail.type=="5"){
			 readcommon(paperDetail,sceneAnswers);
		 }else if(paperDetail.type=="1"){
			 readcommon(paperDetail,listenAnswers);
		 }else if(paperDetail.type=="3"){
			 if(paperDetail.detailType =="3"){
				 readcommon(paperDetail,function(){
					 readdataQuestionAudio(paperDetail,function(){
						 iswritedata(paperDetail,function(){
							 nextdownpage();
						 })
					 })
				 });
			 }else if(paperDetail.detailType =="4"){
				//读大题
					readrecord(paperDetail.bigdataaudio,function(audiotime){
						//读题干
					 readrecord(paperDetail.audio,function(audiotime){
						 //读引导语
						 readrecord(paperDetail.guideAudio,function(audiotime){
							 readdataQuestionAudio(paperDetail,function(){
								 isreaddata(paperDetail,sketch);
							 });
						 });
					 });
					});
			 }
		 }
	});
}

//进度条
function countdown(flag,second,fun){
	if(flag){
		$("#ytdt").html("开始阅题：");
	}else{
		$("#ytdt").html("开始答题：");
	}
	$("#countdown").html(second+"s");
	$(".djs").show();
	var element=layui.element,n=100,num=100/second,secondtmp=second;
	if(secondtmp<20){
		var  timer = setInterval(function(){
			n =n-5;  
			if(n==0){
				n = 0;
				clearInterval(timer);
			}
			element.progress('ly', n+'%');
		}, second*1000/20);
	}
	var timerdown=setInterval(function(){
		if(second>0){
			second--;
			$("#countdown").html(second+"s");
			if(secondtmp>=20){
				n=n-num;
				element.progress('ly', n+'%');
			}
		}else{
			clearInterval(timerdown);
			$(".djs").hide();
			element.progress('ly', '100%');
			if(fun!=undefined)fun();
		}
	},1000);
}

//读取正文音频，可能读取多遍
function readdataQuestionAudio(paperDetail,fun){
	readrecord(paperDetail.questionAudio,function(audiotime){
		//小题读取几遍
		paperDetail.repeatCount=paperDetail.repeatCount-1;
		if(paperDetail.repeatCount>0){
			map.put("data"+paperDetail.paperSubjectDetailId,paperDetail);
			readdataQuestionAudio(paperDetail,fun);
			return;
		}
		fun();
	});
}

function log(text){
	console.log(text);
}

function testDemo(){
	$("#readdiv").remove();
	nextdownpage();
}
//下一屏
function nextdownpage(){
	submits();
	index++;
	var classobj=$("#question-answer .start-answer");
	var classobjlength=classobj.length;
	if(index<classobjlength){
		classobj.each(function(){
			$(this).attr("class","start-answer");
		})
		classobj.eq(index).addClass("flagActive");
		classobj.stop().animate({top: -602 * index}, 500);
		readbigdata();
	}else{
		//最后一个提交答卷
		commitExam();
	}
}
//提交作业
function submits(){
	var arr=new Array();
	$("#question-answer .flagActive").each(function(v,obj){
		 var paperDetail=map.get($(this).attr("bigdata"));
		 if(paperDetail.type=="2"){
			 $("#question-answer .flagActive .choice-answer").each(function(v,obj){
				 var paperDetail=map.get($(this).attr("data"));
				 var value=$("input[name=radio"+paperDetail.paperSubjectDetailId+"]:checked").val();
				 var obj=new Object();
				 obj.key=paperDetail.paperSubjectDetailId;
				 if(value==undefined){
					 value="";
				 }
				 obj.value=value;
				 arr[v]=obj;
			});
		 }else if(paperDetail.type=="4"||paperDetail.type=="6"){
			 var obj=new Object();
			 obj.key=paperDetail.paperSubjectDetailId;
			 obj.value=paperDetail.lid;
			 arr[v]=obj;
		 }else if(paperDetail.type=="5"){
			 var obj=new Object();
			 obj.key=paperDetail.paperSubjectDetailId;
			 obj.value=paperDetail.lid;
			 arr[v]=obj;
		 }else if(paperDetail.type=="1"){
			 $(obj).find(".exam-problems").each(function(v,obj){
				var dataid=$(this).attr("data"); 
				var paperDetail=map.get(dataid);
				var obj=new Object();
				obj.key=paperDetail.paperSubjectDetailId;
				obj.value=paperDetail.lid;
				arr[v]=obj;
			 });
		 }else if(paperDetail.type=="3"){
			 if(paperDetail.detailType =="3"){
				 $(obj).find(".have-underline").each(function(v,obj){
					 var dataid=$(this).attr("data"); 
					 var paperDetail=map.get(dataid);
					 var obj=new Object();
					 obj.key=paperDetail.paperSubjectDetailId;
					 obj.value=$(this).val();
					 arr[v]=obj;
				 });
			 }else if(paperDetail.detailType =="4"){
				 var obj=new Object();
				 obj.key=paperDetail.paperSubjectDetailId;
				 obj.value=paperDetail.lid;
				 arr[v]=obj;
			 }
		 }
	});
	var url = "exam/submitExam.do";
	var par={};
	par.examId=getParam("id");
	par.timeOut=totalTime-timeSurplus;
	par.answers=JSON.stringify(arr);
	log("发送保存");
	log(par);
	ajaxAsync("post", url, par, function (data) {
		log("保存成功");
	});
}

function commitExam(){
	var par={};
	par.examId=getParam("id");
	ajaxAsync("post", "exam/commitExam.do", par, function (data) {
		$("#buttontsubtj").click();
	});
}

//选择题
function readall(){
	var bigdataid=$("#question-answer .flagActive").eq(0).attr("bigdata");
	var paperDetail=map.get(bigdataid);
	readdata(paperDetail);
}

//读取单个题
function readdata(paperDetail){
	readdataQuestionAudio(paperDetail,function(){
		//开始答题
		iswritedata(paperDetail,function(){
			nextdownpage();
		});
	})
}
//选择题

//短文朗读
function shortReading(){
	readrecord(ConfigLY.dtstart,function(audiotime){
		$("#question-answer .flagActive").each(function(v,obj){
			var bigdata=$(obj).attr("bigdata");
			var paperDetail=map.get(bigdata);
			$(obj).find(".exam-recording").eq(0).addClass("on");
			funStartMp3();
			setTimeout(function(){
				$(obj).find(".exam-recording").eq(0).removeClass("on");
				funStopMp3(function(json){
					readrecord(ConfigLY.dtend,function(audiotime){
						log("mp3保存成功:"+json.result);
						paperDetail.lid=json.result;
						nextdownpage();
					});
				});
			},paperDetail.writeTime*1000);
			countdown(false,paperDetail.writeTime);
		});
	});
}
//短文朗读


//情景问答
function sceneAnswers(){
	$("#question-answer .flagActive").each(function(v,obj){
		 var paperDetail=map.get($(obj).attr("bigdata"));
		 readdataQuestionAudio(paperDetail,function(){
			 readrecord(ConfigLY.dtstart,function(audiotime){
				 $(obj).find(".exam-recording").eq(0).addClass("on");
				 funStartMp3();
				 setTimeout(function(){
					 $(obj).find(".exam-recording").eq(0).removeClass("on");
					 funStopMp3(function(json){
						 readrecord(ConfigLY.dtend,function(audiotime){
							 log("mp3保存成功:"+json.result);
							 paperDetail.lid=json.result;
							 nextdownpage();
						});
					});
				},paperDetail.writeTime*1000);
				countdown(false,paperDetail.writeTime);
			 })
		})
	});
}
//情景问答


//听后回答
function listenAnswers(){
	$("#question-answer .flagActive").each(function(v,obj){
		 var bigdataid=$(obj).attr("bigdata")
		 var paperDetail=map.get(bigdataid);
		 readdataQuestionAudio(paperDetail,function(){
			 listenAnswersAll(bigdataid);
		})
	});
}

//听后回答递归答题
var listenAnswersnow=0;
var listenAnswerslength=0;
function listenAnswersAll(bigdataid){
	listenAnswerslength=$("#"+bigdataid+" .exam-problems").length;
	$("#"+bigdataid+" .exam-problems").removeClass("writelistenAnswers");
	$("#"+bigdataid+" .exam-problems").each(function(v,obj){
		 if(listenAnswersnow==v){
			 listenAnswersnow++;
			 $(obj).addClass("writelistenAnswers");
			 var dataid=$(obj).attr("data");
			 var paperDetail=map.get(dataid);
			 readrecord(ConfigLY.dtstart,function(audiotime){
				 $("#question-answer .flagActive").find(".exam-recording").addClass("on");
				 funStartMp3();
				 setTimeout(function(){
					 $("#question-answer .flagActive").find(".exam-recording").removeClass("on");
					 funStopMp3(function(json){
						 readrecord(ConfigLY.dtend,function(audiotime){
							 log("mp3保存成功:"+json.result);
							 paperDetail.lid=json.result;
							 map.put(dataid,paperDetail);
							 if(listenAnswerslength>listenAnswersnow){
								 listenAnswersAll(bigdataid);
							 }else{
								 listenAnswersnow=0;
								 nextdownpage();
							 }
							 
						});
					});
				},paperDetail.writeTime*1000);
				countdown(false,paperDetail.writeTime);
			 })
			 return false;
		 }
	 })
}
//听后回答

//听后简述
function sketch(){
	$("#question-answer .flagActive").each(function(v,obj){
		 var bigdataid=$(obj).attr("bigdata")
		 var paperDetail=map.get(bigdataid);
		 readrecord(ConfigLY.dtstart,function(audiotime){
			$(obj).find(".exam-recording").eq(0).addClass("on");
			funStartMp3();
			setTimeout(function(){
				$(obj).find(".exam-recording").eq(0).removeClass("on");
				funStopMp3(function(json){
					readrecord(ConfigLY.dtend,function(audiotime){
						log("mp3保存成功:"+json.result);
						paperDetail.lid=json.result;
						nextdownpage();
					});
				});
			},paperDetail.writeTime*1000);
			countdown(false,paperDetail.writeTime);
		});
	});
}

function initload(){
	//标记是否已经开始做过
	var flagiswrite=false;
	var isover=false;
	//标记是否做完了，没有提交
	$("#question-answer .start-answer").each(function(){
		if(map.get($(this).attr("bigdata")).essId!=null){
			$(this).attr("class","start-answer");
			flagiswrite=true;
			isover=true;
		}else{
			isover=false;
		}
	});
	//显示考试须知
	if(!flagiswrite){
		$(".student-notice").css("display","block");
	}
	//做完了，没有提交
	if(isover){
		$("#question-answer .start-answer").each(function(i,obj){
				$(".wrap").css("display","none");
				$(".start-exam").css("display","block");
				$("#question-answer .start-answer").stop().animate({top: -595 * i}, 0);
				$(obj).addClass("flagActive");
				//最后一个提交答卷
				commitExam();
		});
	}
	//开始做了，还没有做完
	if(flagiswrite){
		$("#question-answer .start-answer").each(function(i,obj){
			if(map.get($(obj).attr("bigdata")).essId==null){
				$(".wrap").css("display","none");
				$(".start-exam").css("display","block");
				$("#question-answer .start-answer").stop().animate({top: -595 * i}, 0);
				index=i;
				$(obj).addClass("flagActive");
				nextwrap("start-exam");
				return false;
			}
		});
	}
}

function replaceAll(text){
	if(text!=null){
		var arr=text.split("||");
		for(var i=0;i<arr.length;i++){
			text=text.replace("||","<br/>");
		}
	}
	return text;
}

function subtj(){
	var n=3;
	var  timer = setInterval(function(){
		n-- ; 
		$("#subtj").html(n);
		if(n==0){
			clearInterval(timer);
			window.location.href="../simulationExam/examReport.html";
		}
	}, 1000);	
}

//听后简述
/*
function kaishi()  
{  


    var docElm = document.documentElement;  
    //W3C   
    if (docElm.requestFullscreen) {  
        docElm.requestFullscreen();  
    }  
        //FireFox   
    else if (docElm.mozRequestFullScreen) {  
        docElm.mozRequestFullScreen();  
    }  
        //Chrome等   
    else if (docElm.webkitRequestFullScreen) {  
        docElm.webkitRequestFullScreen();  
    }  
        //IE11   
    else if (elem.msRequestFullscreen) {  
        elem.msRequestFullscreen();  
    }  
}  



function guanbi() {  


    if (document.exitFullscreen) {  
        document.exitFullscreen();  
    }  
    else if (document.mozCancelFullScreen) {  
        document.mozCancelFullScreen();  
    }  
    else if (document.webkitCancelFullScreen) {  
        document.webkitCancelFullScreen();  
    }  
    else if (document.msExitFullscreen) {  
        document.msExitFullscreen();  
    }  
}  


document.oncontextmenu = function(){
    event.returnValue = false;
}
// 或者直接返回整个事件
document.oncontextmenu = function(){
    return false;
}

document.onselectstart = function(){
    event.returnValue = false;
}
// 或者直接返回整个事件
document.onselectstart = function(){
    return false;
}

document.oncopy = function(){
    event.returnValue = false;
}
// 或者直接返回整个事件
document.oncopy = function(){
    return false;
}
document.onkeydown = function(event){
	var e = event || window.event || arguments.callee.caller.arguments[0];
    if( event.ctrlKey ){
        return false;
    }
    if ( event.altKey ){
        return false;
    }
    if ( event.shiftKey ){
        return false;
    }
    if (e && event.keyCode==122 ){
    	return false;
    }
    if (e && event.keyCode==123 ){
    	return false;
    }
    if (e && event.keyCode==27 ){
    	return false;
    }
}

*/

