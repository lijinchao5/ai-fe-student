//获取字体颜色
function getcolor(num){
	if(num%2==0){
		return "red";
	}else if(num%3==0){
		return "green";
	}else {
		return "";
	}
}


//停止所有录音
function stopMp3All(){
	if(dataobj!=null){
		$(".q_sounding").each(function(){
  		  $(this).hide();
  		layui.element.progress('ly', '0%');
  	    });
		funStopMp3(function(json){
			if(dataobj!=null){
				var par={};
				par.sectionId=dataobj.sectionDetailId;
				par.homeworkId=getParam("id");
				par.file=json.result;
				par.text="";
				sendform(par);
			}
		});
	}
}

//停止所有输入
function stopznAll(){
	if(zndataobj!=null){
		var par={};
		par.sectionId=zndataobj.sectionDetailId;
		par.homeworkId=getParam("id");
		par.file="";
		par.text=$("#"+zndataobj.flagid).val();
		sendform(par);
	}
}


//发送请求
function sendform(par){
	var url = "homework/doHomeWork.do";
	var jsonobjtmp=map.get("data"+par.sectionId);
	if(par.file.length>0){
		//post请求比较慢，所以先设置声音
		jsonobjtmp.lid=par.file;
		console.log("file:"+jsonobjtmp.lid);
		map.put("data"+par.sectionId,jsonobjtmp);
	}else if(par.text.length>0){
		jsonobjtmp.studentText=par.text;
		map.put("data"+par.sectionId,jsonobjtmp);
	}else{
		return;
	}
	console.log("发送保存");
	ajaxAsync("post", url, par, function (data,code) {
		if(code=="3001"){
			$("#timeout").click();
		}
		console.log(data);
		//分数
		var score=data.homeworkStudentScoreEntity.score+"";
		if(score.indexOf(".")>0){
			score=score.substring(0,score.indexOf("."));
		}
		//智能听写
		if(par.text.length>0){
			$("#score"+par.sectionId).attr("style","");
			if(score==100){
				$("#score"+par.sectionId).attr("src","../../images/speakAndListen/true.png");
			}else{
				$("#score"+par.sectionId).attr("src","../../images/speakAndListen/error.png");
			}
		}else if(par.file.length>0){
			//其它
			$("#score"+par.sectionId).attr("style","");
			$("#score"+par.sectionId).html(score);
		}
		//彩色文字
		if(jsonobjtmp.homeworkType=="2"||jsonobjtmp.homeworkType=="3"){
			getAudioCheck(data.audioCheck);
			var newhtml=CalculationScore(data.homeworkStudentScoreWordEntities);
			$("div[data='data"+par.sectionId+"'] .text").html(newhtml);
			jsonobjtmp.studentText=newhtml;
			map.put("data"+par.sectionId,jsonobjtmp);
		}else if(jsonobjtmp.homeworkType=="1"){
			getAudioCheck(data.audioCheck);
            var newhtml= "";
			if((jsonobjtmp.standerText).indexOf("b class")>0){
                var standerText=$(jsonobjtmp.standerText).text();
                newhtml=CalculationScoreword(standerText,score);
			}else{
                newhtml=CalculationScoreword(jsonobjtmp.standerText,score);
			}
			$("div[data='data"+par.sectionId+"'] .text").html(newhtml);
			jsonobjtmp.studentText=newhtml;
			map.put("data"+par.sectionId,jsonobjtmp);
		}else if(jsonobjtmp.homeworkType=="4"){
			getAudioCheck(data.audioCheck);
			var newhtml=CalculationScore(data.homeworkStudentScoreWordEntities);
			var classname=$("p[data='data"+par.sectionId+"']").attr("class");
			if(classname=="role1 role-in item-in"){
				$("p[data='data"+par.sectionId+"']").find(".abcdin").each(function(){
					$(this).html(newhtml);
				})
			}else{
				$("p[data='data"+par.sectionId+"']").find(".abcd").each(function(){
					$(this).html(newhtml);
				})
			}
		}
		dataobj=null;
		zndataobj=null;
		console.log("保存成功");
	});
}
function getAudioCheck(checkList){
    if(null == checkList || checkList.length<=0){
    	$(".normal").css("display","block");
    	$(".abnormal").css("display","none");
    }else{
    	$(".normal").css("display","none");
    	$(".abnormal").css("display","block");
    	var text = "";
    	for(var h=0;h<checkList.length;h++){
    		if(h==0){
    			text = checkList[h];
    		}else{
    			text = text+","+checkList[h];
    		}
    	}
    	$(".abnormal").html("["+text+"]");
    }
}
//获取评分
function CalculationScore(homeworkStudentScoreWordEntities){
    // <div class="text-in">
    var html='';
	for(var i=0;i<homeworkStudentScoreWordEntities.length;i++){
		var wordEntitie=homeworkStudentScoreWordEntities[i];
		if(wordEntitie.type=="7"){
			if(wordEntitie.text==" "){
				// html+="&nbsp;";
			}else{
				html+="<b>"+wordEntitie.text+"</b>";
			}
		}else{
			if(wordEntitie.score<60){
				html+="<b class='red'>"+wordEntitie.text+"</b>";
			}else if(wordEntitie.score>=60&&wordEntitie.score<=85){
				html+="<b class='orange'>"+wordEntitie.text+"</b>";
			}else if(wordEntitie.score>85){
				html+="<b class='green'>"+wordEntitie.text+"</b>";
			}
		}
	}
	// </div>
    html+='';
	return html;
}

function CalculationScoreword(word,score){
	var html='<div class="text-in">';
	if(score<60||!score||score==null){
		html="<b class='red'>"+word+"</b>";
	}else if(score>=60&&score<=85){
		html="<b class='orange'>"+word+"</b>";
	}else if(score>85){
		html="<b class='green'>"+word+"</b>";
	}
    html+='</div>';
	return html;
}

//角色扮演 有的单词需要替换
function replacehtml(html){
	var re = new RegExp("</b>","g");
	html=html.replace(re,'');
	re = new RegExp("<b class='red'>","g");
	html=html.replace(re,'');
	re = new RegExp("<b class='orange'>","g");
	html=html.replace(re,'');
	re = new RegExp("<b class='green'>","g");
	html=html.replace(re,'');
	re = new RegExp("&nbsp;","g");
	html=html.replace(re,' ');
	return html;
}

//判断左右滚动和切换标签
function isswitchfunction(flag){
	isswitch=flag;
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

//角色扮演判断是否录音过
function jsbypalybutton(){
	$("#jsby .active .item-in").each(function(v,i){
		dataid=$(this).attr("data");
		var _obj=map.get(dataid);
		if(_obj.dialogName!="F"){
			if(_obj.lid!=null){
				isswitchfunction(true);
				q_restart();
				return false;
			}
		}
	});
}

//显示正在播放音频的图标
function q_play(){
	$(".q_play").each(function(){
		$(this).show();
	});
	$(".q_sounding").each(function(){
		$(this).hide();
	});
	$(".q_restart").each(function(){
		$(this).hide();
	});
}
//显示正在录音的图标
function q_sounding(soundingtime){
	$(".q_play").each(function(){
		$(this).hide();
	});
	$(".q_sounding").each(function(){
		$(this).show();
		progressBar(soundingtime);
	});
	$(".q_restart").each(function(){
		$(this).hide();
	});
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
      }, second/26);
}
//显示 可以重新开始播放和听自己声音的图标
function q_restart(){
	$(".q_play").each(function(){
		$(this).hide();
	});
	$(".q_sounding").each(function(){
		$(this).hide();
	});
	$(".q_restart").each(function(){
		$(this).show();
	});
}

//初始化显示第一个显示的作业，和显示的导航
function initisshow(){
	if($("#dccount").html()!=0){
			$(".dcclass").each(function(){
				$(this).show();
			});
	}
	if($("#jzcount").html()!=0){
		$(".jzclass").each(function(){
			$(this).show();
		});
	}
	if($("#kwcount").html()!=0){
		$(".kwclass").each(function(){
			$(this).show();
		});
	}
	if($("#zncount").html()!=0){
		$(".znclass").each(function(){
			$(this).show();
		});
	}
	if($("#jsbycount").html()!=0){
		$(".jsbyclass").each(function(){
			$(this).show();
		});
	}
	
	//显示那个作业
	 $("#speak-listen-tab li").each(function(v,i){
		 if(!$(this).is(":hidden")){
			 $("#speak-listen-tab-content li").each(function(){
				 $(this).hide(); 
			 })
			 var classname=$(this).attr("class");
			 //console.log("classname:"+classname)
			 $(this).addClass("active");
			 $("."+classname).each(function(){
				 $(this).show();
			 });
			 speakAndListenTabIndex=v;
			 return false;
		 }
	 });
	 
	 //读取进度
	 if(issave){
		 $("#speak-listen-tab li").each(function(v,i){
			 var spanflag=true;
			 var spanhtml0=$($(this).find("span")[0]).html();
			 var spanhtml1=$($(this).find("span")[1]).html();
			 //console.log("spanhtml0:"+$($(this).find("span")[1]).attr("id"))
			 if(spanhtml0!=spanhtml1&&spanhtml1!="0"){
				 $("#speak-listen-tab li").each(function(v,i){
					 $(this).removeClass("active"); 
				 })
				 speakAndListenTabIndex=v;
				 var classname=$(this).attr("class");
				 $("#speak-listen-tab-content li").each(function(){
					 $(this).hide(); 
					 $(this).addClass("active");
				 })
				 $(this).addClass("active");
				 $("."+classname).each(function(){
					 $(this).show();
				 });
				 return false;
			 }
		 });
	 }
	 
	 
}

//左右切换是否显示
function isleftorrigth(nowcs,count){
	$(".right").each(function(){
		$(this).show();
	});
	$(".left").each(function(){
		$(this).show();
	});
	var dcnowcs=$("#"+nowcs).html();
	if(dcnowcs==1){
		$(".left").each(function(){
	    	$(this).hide();
	    })
	}
	var dccount=$("#"+count).html();
	if(dccount==dcnowcs&&dccount!=0){
		$(".right").each(function(){
			$(this).hide();
		})
	}
}

//提交作业
function submithomework(){
	for(var i=0;i<map.arr.length;i++){
		var homeworkDetail=map.arr[i].value;
		if(homeworkDetail.homeworkType=='1'){
			//console.log(homeworkDetail.lid);
			if(homeworkDetail.lid==null){
				submit_tip("单词跟读");
				return;
			}
		}else if(homeworkDetail.homeworkType=='2'){
			//console.log(homeworkDetail.lid);
			if(homeworkDetail.lid==null){
				submit_tip("句子跟读");
				return;
			}
		}else if(homeworkDetail.homeworkType=='3'){
			//console.log(homeworkDetail.lid);
			if(homeworkDetail.lid==null){
				submit_tip("课文跟读");
				return;
			}
		}else if(homeworkDetail.homeworkType=='4'){
			if(homeworkDetail.dialogName!="F"){
				if(homeworkDetail.lid==null){
					submit_tip("角色扮演");
					return;
				}
			}
		}else if(homeworkDetail.homeworkType=='5'){
			//console.log(homeworkDetail.studentText)
			if(homeworkDetail.studentText==null){
				submit_tip("智能听写");
				return;
			}
		}
	}
	$("#tjcg").click();
}

function submithomeworkok(){
	var url = "/homework/submitHomework.do";
	 var par={};
	 par.homeworkId=getParam("id");
	 ajaxAsync("post", url, par, function (data,code) {
		 if(code==0){
			 gotoWorkHome();
		 }else{
			 alert("提交失败");
			 return false;
		 }
	 });
}

function submit_tip(msg){
	$("#submit_tip").html("您的<span>"+msg+"</span>还未完成，<br/>请继续做作业吧");
	 var y = 0; 
     var x = 0; 
     var px = document.body.clientWidth;
     var py = document.body.clientHeight;
     $("html").css({
         "height": "100%",
         "overflow": "hidden"   
     });
     $("#overlay").css({
         "display": "block",
         "position": "fixed",
         "top": y,
         "left": x,
         "opacity":0.6
     });
     $("#tooltip").css({
         "display": "block",
         "top": '50%'
     });
}

//判断时间，如果小于2000毫秒，就按照2000毫秒来计算
function gettimes(stime){
	if(stime<2000){
		return 2000;
	}
	return stime;
}

function gotoWorkHome(){
	window.location.href="javascript:history.back(-1)";
}

