$(function(){
	$('#background').load('../common/simulationExambg.html');
    $('#simulation-exam-modal').load('../common/simulationExamModal.html');
    $('#nav').load('../../html/common/simulationExamNav.html',function(){
        $('#nav1').load('../../html/common/simulationExamNav.html',function(){
        	initajax();
        });
    });
});

var map=new Map();
function initajax(){
	$("#question-answer").html("")
	 var url = "exam/findStudentExamDetail.do";
	 var par={};
	 par.examId=getParam("id");
	 ajaxAsync("get", url, par, function (data) {
		 var examDetail=data.examDetail;
		 var examStudentInfo=data.examStudentInfo;
		 var paperInfo=data.paperInfo;
		 $("#ksname").html(examDetail.name);
		 $("#ksxzcontent").html(examDetail.notice);
		 totalTime=paperInfo.totalTime;
		 setmmssTime("total-time",totalTime);
		 timeSurplus=totalTime-examStudentInfo.timeOut;
		 setmmssTime("remaining-time",timeSurplus);
		 var paperDetails=data.paperDetail;
		 //记录选择题第一次出现的id
		 var bigdataId;
		 //小题题号
		 var subjectnum=0;
		 //大题题号
		 var subjectBignum=0;
		 //记录大题的id
		 var paperSubjectId;
		 //填空题填空题号
		 var completionnum=0;
		 for(var i=0;i<paperDetails.length;i++){
			 var paperDetail=paperDetails[i];
			 //判断小题号，如果上一个大题的id和这个大题的id不一样，小题编号从0开始，大题题号加1
			 if(paperSubjectId!=paperDetail.paperSubjectId){
				 subjectnum=0;
				 subjectBignum++;
				 //第一次的大题题型的语音，需要读，
				 paperDetail.bigdataaudio=ConfigLY.bigdatareadArr[paperDetail.type];
			 }else{
				 //题干清空，题干音频清空
				 paperDetail.subject=null;
				 paperDetail.audio=null;
			 }
			 if(paperDetail.type !="3"){
				 //小题号增加
				 subjectnum++;
				 paperDetail.question=subjectnum+"."+ paperDetail.question;
			 }
			 //替换换行
			 paperDetail.guide=replaceAll(paperDetail.guide);
			 //记录大题编号
			 paperDetail.subjectNum=bigdataTextArr[subjectBignum]+paperDetail.subjectNum;
			 //记录大题id，判断下次是否还是这个大题
			 paperSubjectId=paperDetail.paperSubjectId;
			 //默认第一页给标记
			 if(i==0){
				 paperDetail.flagActive="flagActive";
			 }
			 if(paperDetail.type=="2"){
				 //听后选择
				 if(paperDetail.questionAudio!=null){
					 paperDetail.bigdata="data"+paperDetail.paperSubjectDetailId;
					 bigdataId=paperDetail.bigdata;
					 var html = formatTemplate(paperDetail, $("#switchdivscript").html());
					 $("#question-answer").append(html);
				 }
				 var text=switchABCD(paperDetail.paperSubjectDetailId,paperDetail.result);
				 paperDetail.text=text;
				 var html = formatTemplate(paperDetail, $("#switchscript").html());
				 $("#"+bigdataId).append(html);
				 var paperDetailtmp=map.get(bigdataId);
				 if(paperDetailtmp!=null){
					 paperDetailtmp.writeTime=paperDetailtmp.writeTime+paperDetail.writeTime;
				 }
				 map.put(bigdataId,paperDetailtmp);
			 }else if(paperDetail.type=="4"){
				 //短文朗读
				 paperDetail.bigdata="data"+paperDetail.paperSubjectDetailId;
				 var html = formatTemplate(paperDetail, $("#shortReadingscript").html());
				 $("#question-answer").append(html);
			 }else if(paperDetail.type=="6"){
				 //话题简述
				 paperDetail.bigdata="data"+paperDetail.paperSubjectDetailId;
				 var html = formatTemplate(paperDetail, $("#shortReadingscript").html());
				 $("#question-answer").append(html);
			 }else if(paperDetail.type=="5"){
				 //情景问答
				 paperDetail.bigdata="data"+paperDetail.paperSubjectDetailId;
				 var html = formatTemplate(paperDetail, $("#sceneAnswersScript").html());
				 $("#question-answer").append(html);
			 }else if(paperDetail.type=="1"){
				//听后回答
				 if(paperDetail.questionAudio!=null){
					 paperDetail.bigdata="data"+paperDetail.paperSubjectDetailId;
					 bigdataId=paperDetail.bigdata;
					 var html = formatTemplate(paperDetail, $("#listenAnswersdivScript").html());
					 $("#question-answer").append(html);
				 }
				 var html = formatTemplate(paperDetail, $("#listenAnswersScript").html());
				 $("#"+bigdataId).append(html);
			 }else if(paperDetail.type=="3"){
				 if(paperDetail.detailType =="3"){
					 completionnum++;
					 if(paperDetail.questionAudio!=null){
						 completionnum=1
						 paperDetail.bigdata="data"+paperDetail.paperSubjectDetailId;
						 bigdataId=paperDetail.bigdata;
						 paperDetail.question=getRootPath()+"file/download.do?type=jpg&id="+paperDetail.question;
						 var html = formatTemplate(paperDetail, $("#completiondivScript").html());
						 $("#question-answer").append(html);
					 }
					 paperDetail.completionnum=completionnum;
					 var html = formatTemplate(paperDetail, $("#completionScript").html());
					 $("#"+bigdataId).append(html);
				 }else if(paperDetail.detailType =="4"){
					 paperDetail.bigdata="data"+paperDetail.paperSubjectDetailId;
					 var html = formatTemplate(paperDetail, $("#listenReportingscript").html());
					 $("#question-answer").append(html);
				 }
			 }
			 //存入map
			 map.put("data"+paperDetail.paperSubjectDetailId ,paperDetail);
		 }
		 $(".exam-topic").each(function(){
			 var tmphtml=$(this).html();
			 if(tmphtml.length==0){
				 $(this).hide();
			 }
		 });
		 initload();
	 });
}

