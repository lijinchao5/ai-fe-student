 // tab 切换 左侧
 var tabsindex = 0;
 //全局map
 var map;
 //录音时间倍数
 var times=1.5;
 //是否可以切换
 var isswitch=true;
 
 //是否有进度
 var issave=false;
 
 $('#tabhd span').click(function() {
         $(this).addClass('current').siblings().removeClass('current');
         tabsindex = $(this).index();
         $('#tabbd .lists').hide().eq(tabsindex).show();
     })
 // tab 切换 听说阅读
 var speakAndListenTabIndex = 0;
 $('#speak-listen-tab li').click(function() {
	 if(!isswitch)return;
     $(this).addClass('active').siblings().removeClass('active');
     speakAndListenTabIndex = $(this).index();
     $('#speak-listen-tab-content li').hide().eq(speakAndListenTabIndex).show();
     if(speakAndListenTabIndex==3){
    	 $(".role").show();
     }else{
    	 $(".role").hide();
     }
     readword();
 })
var onkeydownflag=true;
 // 听说作业 智能听写 提交模态框
 $(document).ready(function () {
	 document.onkeydown = function(e){
	        var ev = document.all ? window.event : e;  
	        if(ev.keyCode==13&&onkeydownflag) {
	        	onkeydownflag=false;
	        	$("#startworkhome").click();
	         }
	  };
	 $('#header').load('../common/header.html');
     $('#nav').load('../common/nav.html');
     $('#footer').load('../common/footer.html');
	 $("#kszzy").click();
	map=new Map();
    $("#close").click(function () {
        $("html").css({
            "overflow": "auto"
        });
        $("#overlay").css({
            "display": "none"
        });
        $("#tooltip").css({
            "display": "none"
        });
    });
    //获取用户信息
    var data = JSON.parse(store.get("userInfo"));
	$("#username").text(data.name);
	$("#username1").text(data.name);
	$("#photo").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo)
	$("#photo1").attr("src", getRootPath() + "file/download.do?type=jpg&id=" + data.photo)
	initdata();
})
//初始化数据
function initdata(){
	 var url = "homework/getHomeworkDetail.do";
	 var par={};
	 par.homeworkId=getParam("id");
	 var dccount=0;
	 var jzcount=0;
	 var kwcount=0;
	 var zncount=0;
	 var jsbycount=0;
	 $("#jsby").html("");
	 $("#dc").html("");
	 $("#jz").html("");
	 $("#kw").html("");
	 $("#zn").html("");
	 ajaxAsync("get", url, par, function (data) {
 		var homeworkDetails=data.homeworkDetails;
 		for(var i=0;i<homeworkDetails.length;i++){
 			var homeworkDetail=homeworkDetails[i];
 			var studentScore=homeworkDetail.studentScore+"";
 			if(studentScore=="null"){
 				homeworkDetail.display="visibility: hidden;";
 				studentScore="";
 			}
 			if(studentScore.indexOf(".")>0){
 				studentScore=studentScore.substring(0,studentScore.indexOf("."));
 			}
 			homeworkDetail.studentScore=studentScore;
 			//console.log(homeworkDetail.homeworkStudentScoreWordEntities);
 			if(homeworkDetail.homeworkType=='1'){
 				//记录当前数
 				dccount++;
 				homeworkDetail.count=dccount;
 				//设置mp3
 				var mid=homeworkDetail.standerWAudioPath;
 				if(mid==null){
 					mid=homeworkDetail.standerMAudioPath;
 				}
 				homeworkDetail.mid=mid;
 				homeworkDetail.lid=homeworkDetail.audioPath;
 				//第一个为活动状态
 				if(dccount==1){
 					homeworkDetail.active='active';
 				}
 				if(homeworkDetail.studentScore!=""){
 					homeworkDetail.standerText=CalculationScoreword(homeworkDetail.standerText,homeworkDetail.studentScore);
 				}
 				//设置颜色
 				//homeworkDetail.color=getcolor(dccount);
 				//存入json
 				homeworkDetail.jsonobj="data"+homeworkDetail.sectionDetailId;
 				map.put("data"+homeworkDetail.sectionDetailId,homeworkDetail);
 				//生成模板
 				var html = formatTemplate(homeworkDetail, $("#dcscript").html());
 				$("#dc").append(html)
 				if(homeworkDetail.lid!=null){
 					$("#dcnowcs").html(dccount);
 					$("#dc .item").each(function(v,i){
 						$(this).attr("class","item");
 						if((dccount-1)==v){
 							issave=true;
 							$(this).addClass("active");
 						}
 					})
 				}
 			}else if(homeworkDetail.homeworkType=='2'){
 				jzcount++;
 				homeworkDetail.count=jzcount;
 				homeworkDetail.mid=homeworkDetail.standerAudioPath;
 				homeworkDetail.lid=homeworkDetail.audioPath;
 				if(jzcount==1){
 					homeworkDetail.active='active';
 				}
 				//homeworkDetail.color=getcolor(jzcount);
 				homeworkDetail.jsonobj="data"+homeworkDetail.sectionDetailId;
 				if(homeworkDetail.homeworkStudentScoreWordEntities.length!=0){
 					homeworkDetail.standerText=CalculationScore(homeworkDetail.homeworkStudentScoreWordEntities);
 				}
 				map.put("data"+homeworkDetail.sectionDetailId,homeworkDetail);
 				var html = formatTemplate(homeworkDetail, $("#dcscript").html());
 				$("#jz").append(html);
 				if(homeworkDetail.lid!=null){
 					$("#jznowcs").html(jzcount);
 					$("#jz .item").each(function(v,i){
 						$(this).attr("class","item");
 						if((jzcount-1)==v){
 							issave=true;
 							$(this).addClass("active");
 						}
 					})
 				}
 			}else if(homeworkDetail.homeworkType=='3'){
 				kwcount++;
 				homeworkDetail.count=kwcount;
 				homeworkDetail.mid=homeworkDetail.standerAudioPath;
 				homeworkDetail.lid=homeworkDetail.audioPath;
 				if(kwcount==1){
 					homeworkDetail.active='active';
 				}
 				//homeworkDetail.color=getcolor(kwcount);
 				homeworkDetail.jsonobj="data"+homeworkDetail.sectionDetailId;
 				if(homeworkDetail.homeworkStudentScoreWordEntities.length!=0){
 					homeworkDetail.standerText=CalculationScore(homeworkDetail.homeworkStudentScoreWordEntities);
 				}
 				map.put("data"+homeworkDetail.sectionDetailId,homeworkDetail);
 				var html = formatTemplate(homeworkDetail, $("#dcscript").html());
 				$("#kw").append(html)
 				if(homeworkDetail.lid!=null){
 					$("#kwnowcs").html(kwcount);
 					$("#kw .item").each(function(v,i){
 						$(this).attr("class","item");
 						if((kwcount-1)==v){
 							issave=true;
 							$(this).addClass("active");
 						}
 					})
 				}
 			}else if(homeworkDetail.homeworkType=='4'){
 				//console.log(homeworkDetail);
 				//如果没有添加最大的div
 				if($("div[dialogNum='"+homeworkDetail.dialogNum+"']").length==0){
 					jsbycount++;
 					if(jsbycount==1){
 						homeworkDetail.active='active';
 					}
 					var html = formatTemplate(homeworkDetail, $("#jsbyscript").html());
 					$("#jsby").append(html);
 				}
 				homeworkDetail.count=jsbycount;
 				homeworkDetail.lid=homeworkDetail.audioPath;
 				//F代表电脑读
 				if(homeworkDetail.dialogName=="F"){
					homeworkDetail.mid=homeworkDetail.standerAudioPath;
					homeworkDetail.t1=homeworkDetail.standerText;
					homeworkDetail._class="role2 clearfix";
				}else{
					if(homeworkDetail.homeworkStudentScoreWordEntities.length!=0){
	 					homeworkDetail.standerText=CalculationScore(homeworkDetail.homeworkStudentScoreWordEntities);
	 				}
					homeworkDetail.t2=homeworkDetail.standerText;
					homeworkDetail._class="role1 role-in";
					var gd=$("div[dialogNum='"+homeworkDetail.dialogNum+"'] .gd");
					if(gd.html().indexOf(homeworkDetail.name+"&nbsp;")<0){
						$("div[dialogNum='"+homeworkDetail.dialogNum+"'] .gd").append(homeworkDetail.name+"&nbsp;");
					}
				}
 				homeworkDetail.jsonobj="data"+homeworkDetail.sectionDetailId;
 				var html = formatTemplate(homeworkDetail, $("#contentscript").html());
 				//追加到大的div内
 				$("div[dialogNum='"+homeworkDetail.dialogNum+"'] .dialog-cont").append(html);
 				map.put("data"+homeworkDetail.sectionDetailId,homeworkDetail);
 				if(homeworkDetail.lid!=null&&homeworkDetail.dialogName!="F"){
 					$("#jsbynowcs").html(jsbycount);
 					$("#jsby .item").each(function(v,i){
 						$(this).attr("class","item");
 						if((jsbycount-1)==v){
 							issave=true;
 							$(this).addClass("active");
 						}
 					})
 				}
 			}else if(homeworkDetail.homeworkType=='5'){
 				zncount++;
 				homeworkDetail.count=zncount;
 				var mid=homeworkDetail.standerWAudioPath;
				if(mid == null || mid==""){
 					mid=homeworkDetail.standerMAudioPath;
 				}
 				homeworkDetail.mid=mid;
 				homeworkDetail.lid=homeworkDetail.audioPath;
 				if(zncount==1){
 					homeworkDetail.active='active';
 				}
 				//homeworkDetail.color=getcolor(zncount);
 				homeworkDetail.jsonobj="data"+homeworkDetail.sectionDetailId;
 				map.put("data"+homeworkDetail.sectionDetailId,homeworkDetail);
 				homeworkDetail.flagid="zninput"+zncount;
 				var html = formatTemplate(homeworkDetail, $("#znscript").html());
 				$("#zn").append(html)
 				if(homeworkDetail.studentText!=null){
 					$("#znnowcs").html(zncount);
 					$("#zn .item").each(function(v,i){
 						$(this).attr("class","item");
 						if((zncount-1)==v){
 							issave=true;
 							$(this).addClass("active");
 						}
 					})
 				}
 			}
 		}
 		$("#dccount").html(dccount);
 		$("#jzcount").html(jzcount);
 		$("#kwcount").html(kwcount);
 		$("#zncount").html(zncount);
 		$("#jsbycount").html(jsbycount);
 		initisshow();
 		initon();
 	 });
 }
 

//左右切换自动读取单词和修改当前使用的第几个 
//读单词，录音 核心方法
function readword(isreset){
    var speeds = $(".speak-speed .list .current").attr("speed");
    // console.log(speeds)
	if(speakAndListenTabIndex==0){
        roundProgress("roll-progress-dc",0);
		$("#dc .active").each(function(){
			var jsonobj=map.get($(this).attr("data"));
			$("#dcnowcs").html(jsonobj.count);
			isleftorrigth("dcnowcs","dccount");
			if(jsonobj.lid!=null&&isreset!=true){
				isswitchfunction(true);
				q_restart();
				return;
			}
			isswitchfunction(false);
			q_play();
			readrecord(jsonobj.mid,function(audiotime){
                q_sounding(gettimes(audiotime*times));
				readrecord(ConfigLY.startrecordid,function(){
					roundProgressTimer("roll-progress-dc",audiotime*times-800);
					dataobj=jsonobj;
					funStartMp3();
					setTimeout(function(){
						stopMp3All();
						isswitchfunction(true);
						q_restart();
					},gettimes(audiotime*times));
					$(".round-progress").click(function () {
						stopMp3All();
						isswitchfunction(true);
						q_restart();
					});
				});
			},speeds);
		});
	}else if(speakAndListenTabIndex==1){
        roundProgress("roll-progress-jz",0);
		$("#jz .active").each(function(){
			var jsonobj=map.get($(this).attr("data"));
			$("#jznowcs").html(jsonobj.count);
			isleftorrigth("jznowcs","jzcount");
			if(jsonobj.lid!=null&&isreset!=true){
				isswitchfunction(true);
				q_restart();
				return;
			}
			isswitchfunction(false);
			q_play();
			readrecord(jsonobj.mid,function(audiotime){
                q_sounding(gettimes(audiotime*times));
                readrecord(ConfigLY.startrecordid,function(){
                    roundProgressTimer("roll-progress-jz",audiotime*times);
                    dataobj=jsonobj;
                    funStartMp3();
                    setTimeout(function(){
                        stopMp3All();
                        isswitchfunction(true);
                        q_restart();
                    },gettimes(audiotime*times));
                    $(".round-progress").click(function () {
                        stopMp3All();
                        isswitchfunction(true);
                        q_restart();
                    })
                })
			},speeds)
		})
	}else if(speakAndListenTabIndex==2){
        roundProgress("roll-progress-kw",0);
		$("#kw .active").each(function(){
			var jsonobj=map.get($(this).attr("data"));
			$("#kwnowcs").html(jsonobj.count);
			isleftorrigth("kwnowcs","kwcount");
			if(jsonobj.lid!=null&&isreset!=true){
				isswitchfunction(true);
				q_restart();
				return;
			}
			isswitchfunction(false);
			q_play();
			readrecord(jsonobj.mid,function(audiotime){
                q_sounding(gettimes(audiotime*times));
                    readrecord(ConfigLY.startrecordid,function(){
                        roundProgressTimer("roll-progress-kw",audiotime*times);
                        dataobj=jsonobj;
                        funStartMp3();
                        setTimeout(function(){
                            stopMp3All();
                            isswitchfunction(true);
                            q_restart();
                        },gettimes(audiotime*times));
                        $(".round-progress").click(function () {
                            stopMp3All();
                            isswitchfunction(true);
                            q_restart();
                        })
                    })
			},speeds)
		})
	}else if(speakAndListenTabIndex==3){
		//角色对话
		isleftorrigth("jsbynowcs","jsbycount");
		var _obj;
		$("#jsby .active .item-in").each(function(v,i){
			dataid=$(this).attr("data");
			var _objtmp=map.get(dataid);
			if(_objtmp.dialogName!="F"){
				_obj=_objtmp;
			}
		});
		$("#jsbynowcs").html(_obj.count);
		isleftorrigth("jsbynowcs","jsbycount");
		if(_obj.lid!=null&&isreset!=true){
			isswitchfunction(true);
			q_restart();
			return;
		}
		isswitchfunction(false);
		isreadIflag="1";
		nows=0;
		animateulnow();
		readrecord(ConfigLY.PleaseListenid,function(audiotime){
			jsbyfun();
		});
	}else if(speakAndListenTabIndex==4){
		isswitchfunction(true);
		$("#zn .active").each(function(){
			var jsonobj=map.get($(this).attr("data"));
			$("#znnowcs").html(jsonobj.count);
			isleftorrigth("znnowcs","zncount");
			readrecord(jsonobj.mid,function(audiotime){
			},speeds)
		})
	}
}
//读取自己录制的单词
function readwordl(){
	if(!isswitch)return;
	if(speakAndListenTabIndex==0){
		$("#dc .active").each(function(){
			var jsonobjtmp=map.get($(this).attr("data"));
			q_play();
			readrecord(jsonobjtmp.lid,function(){
				q_restart();
			});
		})
	}else if(speakAndListenTabIndex==1){
		$("#jz .active").each(function(){
			var jsonobjtmp=map.get($(this).attr("data"));
			q_play();
			readrecord(jsonobjtmp.lid,function(){
				q_restart();
			});
		})
	}else if(speakAndListenTabIndex==2){
		$("#kw .active").each(function(){
			var jsonobjtmp=map.get($(this).attr("data"));
			q_play();
			readrecord(jsonobjtmp.lid,function(){
				q_restart();
			});
		})
	}else if(speakAndListenTabIndex==3){
		//角色对话
		isreadIflag="3";
		animateulnow();
		jsbyfun();
	}else if(speakAndListenTabIndex==4){
		$("#zn .active").each(function(){
			var jsonobjtmp=map.get($(this).attr("data"));
			readrecord(jsonobjtmp.lid);
		})
	}
}



var dataobj=null;
var zndataobj=null;

//初始化绑定事件
function initon(){
	//智能听写 绑定input事件，并设置id
	$('.dictation').each(function(v,i){
		$(this).focus(function() {
			var id=$(this).attr("id");
			$("#zn .active").each(function(){
				zndataobj=map.get($(this).attr("data"));
				zndataobj.flagid=id;
			})
		});
	})
	
	//智能听写点击完成事件
	$('.buttonover').each(function(v,i){
		$(this).click(function() {
			stopznAll();
		});
	})
	
	 //左右滚动
	 $('.carousel').on('slid.bs.carousel', function (data) {
		 readword();
		 if(speakAndListenTabIndex==4){
			 stopznAll();
		 }
	 });
    isswitchfunction(isswitch);
}

//代表读取第几行
var nows=0;
//是否重读
var isreadIflag="1";

//角色扮演读取还是录音
function jsbyreadorlu(dataid){
	var _length=$("#jsby .active .item-in").length;
	var jsonobj=map.get(dataid);
    roundProgress("roll-progress-js",0);
	if(jsonobj.dialogName=="F"){
		q_play();
		readrecord(jsonobj.mid,function(audiotime){
			if(nows<_length){
				jsbyfun();
			}else{
				removeClassSpan();
				nows=0;
				sumtop=0;
				isswitchfunction(true);
				jsbypalybutton();
			}
		});
	}else{
		q_play();
		readrecord(ConfigLY.startrecordid,function(){
			dataobj=jsonobj;
			funStartMp3();
			q_sounding(gettimes(replacehtml(jsonobj.standerText).length*150*times));

            roundProgressTimer("roll-progress-js",gettimes(replacehtml(jsonobj.standerText).length*150*times));
			setTimeout(function(){
				stopMp3All();
				if(nows<_length){
					jsbyfun();
				}else{
					removeClassSpan();
					nows=0;
					sumtop=0;
					isswitchfunction(true);
					jsbypalybutton();
				}
			},gettimes(replacehtml(jsonobj.standerText).length*150*times));
            $(".round-progress").click(function () {
                stopMp3All();
                isswitchfunction(true);
                q_restart();
            })
		})
	}
}

//读取自己和电脑
function readjsbyStanderAudioPathAndlid(dataid){
	var _length=$("#jsby .active .item-in").length;
	var jsonobj=map.get(dataid);
	q_play();
	if(jsonobj.dialogName=="F"){
		readrecord(jsonobj.mid,function(audiotime){
			if(nows<_length){
				jsbyfun();
			}else{
				removeClassSpan();
				nows=0;
				sumtop=0;
				isswitchfunction(true);
				jsbypalybutton();
			}
		});
	}else{
		readrecord(jsonobj.lid,function(audiotime){
			if(nows<_length){
				jsbyfun();
			}else{
				removeClassSpan();
				nows=0;
				sumtop=0;
				isswitchfunction(true);
				jsbypalybutton();
			}
		});
	}
}

//全部读电脑
function readjsbyStanderAudioPath(dataid){
	var _length=$("#jsby .active .item-in").length;
	var jsonobj=map.get(dataid);
	q_play();
	readrecord(jsonobj.standerAudioPath,function(audiotime){
		if(nows<_length){
			jsbyfun();
		}else{
			removeClassSpan();
			nows=0;
			sumtop=0;
			isreadIflag="2";
			animateulnow();
			readrecord(ConfigLY.PrepareAnswerid,function(audiotime){
				jsbyfun();
			});
		}
	});
}

//角色扮演的每一行
var sumtop=0;
function jsbyfun(){
	removeClassSpan();
	var dataid;
	//获取左右的那一个
	animateul();
	$("#jsby .item").each(function(v,i){
		var _class=$(this).attr("class");
		if(_class=="item active"){
			//获取对象
			$(this).find(".item-in").each(function(v,i){
				if(nows==v){
					$(this).find("span").each(function(){
						$(this).addClass("weight");
					})
					dataid=$(this).attr("data");
				}
			});
		}
	});
	
	nows++;
	if(isreadIflag=="1"){
		readjsbyStanderAudioPath(dataid);
	}else if(isreadIflag=="2"){
		jsbyreadorlu(dataid);
	}else if(isreadIflag=="3"){
		readjsbyStanderAudioPathAndlid(dataid);
	}
}

//滚动角色扮演
function animateul(){
	$("#jsby .item").each(function(v,i){
		var _class=$(this).attr("class");
		if(_class=="item active"){
			//获取对象
			var plength = $(this).find(".animateul .li").length;
			var pHeight=$(this).find(".li").eq(nows-1).outerHeight(true);
			if(nows<plength&&nows!=0){
				sumtop+=pHeight;
				$(this).find(".animateul").animate({top: -sumtop}, 500);
			}else{
				return;
			}
		}
	});
}
function animateulnow(){
	$("#jsby .item").each(function(v,i){
		var _class=$(this).attr("class");
		if(_class=="item active"){
			$(this).find(".animateul").animate({top: 0}, 500);
		}
	});
}

function removeClassSpan(){
	$("#jsby .item  .item-in").each(function(){
		$(this).find("span").each(function(){
			$(this).removeClass("weight");
		})
	})
}

 // 语速的处理
 $(".speak-speed .list").click(function () {
     speakSpeed();
 })
 // 放入 common.js 中
 function speakSpeed() {
     $(".speak-speed ul").show();
     $(".speak-speed ul li").each(function () {
         // console.log(111)
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
 // roundProgressTimer("roll-progress",20000);
 function roundProgressTimer(id,timer,aa){
     timer = timer/20;
     console.log(timer);
     var width=-5;
     var timer = setInterval(function () {
         width += 5;
         if(aa){
             clearInterval(timer);
         }
         if(width>100||width==100){
             clearInterval(timer)
         }
         roundProgress(id,width);
         console.log(width)
     },timer);
 }
 //    timer(width);
 function roundProgress(id,value) {
     var myCharts = echarts.init(document.getElementById(id));
     //颜色
//    var colorData = ['#ff6d80', '#ffb846', '#36dbbb'];
     var colorData = ['#ff6d80'];
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
                                 color: '#aaa'
                             },
                             emphasis: {
                                 color: '#aaa'
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