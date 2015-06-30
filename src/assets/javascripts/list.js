var selectList= [];
var isRadio=false;
window.onload=function(){
	//if(isRadio) $(".chekedlist").hide();
	var n =$(".clickbar >div").length;
	var s_h=$(".container").get(0).clientHeight;
	var diff=n*14-s_h;
	if(diff>0){
		if(diff<75){
			$(".clickbar").css("top",""+(80-diff)+"px");
		}
		else{
			$(".clickbar").css("top",""+0+"px");
		}
	}
	else{
		var line_h=parseInt((s_h-130)/n);
		if(line_h>28)
		{
			$(".clickbar").css("line-height","28px");
		}
		else{
			$(".clickbar").css("line-height",""+line_h+"px");
		}
	}

}
function getSelectIds(){//selectList[] 转换成IDs格式1,2,3.id的字符串集合
	var ids="";
	for(var i=0;i<selectList.length;i++){
		ids+=selectList[i].id+",";
	}
	if(ids.length>0){
		ids=ids.substr(0,ids.length-1);
	}
	return ids;
	
}

function selectList_checked(){//首次加载设置已经选中的信息
	for(var i=0;i<selectList.length;i++){
		$(".w_"+selectList[i].id+"").attr("checked",true);
		var li=document.createElement("li");
		li.id=selectList[i].id;
		var image=document.createElement("img");
		image.src=selectList[i].headImg;
		$(li).append(image);
		setScroll(li,1)
		
	}
	$("#selectcount").html(selectList.length);
}

function reloadAllList(arr,t_select){//加载全部信息 ，需要加载的数组arr，是否用在选择页面t_select
	
	$(".clickbar").html("");
	var alllist = $(".alllist");
	for(key in arr){
		var clickbar_span= document.createElement("div"); 
		$(clickbar_span).html(key);
		clickbar_span.className=key;
		if(key=="#"){
			clickbar_span.className='other';
		}
		$(".clickbar").append(clickbar_span);

		var a_elm = document.createElement("div"); 
		a_elm.id=key;
		a_elm.className='titlediv';
		
		var div = document.createElement("div"); 
		div.className="title";
		div.innerHTML=key;
		$(a_elm).append(div);
		var ul = document.createElement("ul"); 
		ul.className="normal";
		$(a_elm).append(ul);
		
		var list = arr[key];
		for(var i=0;i<list.length;i++){			
			$(ul).append(createli(list[i],t_select));		
		}
		
		alllist.append(a_elm);
	}
	$(".clickbar div").click(function(){
		var top= document.getElementById(""+this.className+"").offsetTop;
		document.body.scrollTop = top-45;
	});
}

function createli(obj,t_select,isdept)//创建li标签  创建的对象obj，是否用在选择页面t_select，是否是部门isdept
{	
	var li = document.createElement("li"); 
	var hr='onclick=details('+obj.id+','+obj.disable+')';
	var check="";
	var check1="";
	var showdept='<div class="dept"><lable>'+obj.department+'</label></div>';
	if(isdept) showdept="";
	var checkedID=obj.id;
	if(t_select) //选择页面
	{
		var ischecked="";
		if(isExistence_in_SelectList(obj))  
			ischecked="checked='checked'";
			
		if(isdept){
			if(obj.type=="dept")
			{
				checkedID="p_"+checkedID;
			}
			else 
				checkedID="w_"+checkedID;
			if(isRadio==true&obj.type=="dept")	{
				check1="";
			}
			else{
				check1='<div class="check '+obj.type+'"><input class="'+checkedID+'"  id="'+checkedID+'" type="checkbox" /></div>';}
			showdept="";
		}
		else{
			checkedID="w_"+checkedID;
			check='<div class="check"><input class="'+checkedID+' "  '+ischecked+' id="'+checkedID+'" type="checkbox"  /></div>';		
		}		
		hr="";
	}
	
	var str="";
	if(obj.type=="dept"){
		var children_count =obj.children.length;
		str="<span class='adron'></span>"+check1+"<div class='count'>"+obj.personCount+"</div><span class='name'>"+obj.name+"</span>";
		$(li).append(str);
		if(children_count>0){
			var elm=loaddept(obj.children,t_select);
			$(li).append(elm);
		}	
		$(li).click(function(event){ 
			event.preventDefault();
			event.stopPropagation();
			$(this).toggleClass("open");
			$(">ul",$(this)).toggle();
		});
		li.className="level";
			
	}
	else{
		str='<a  class="table">'+check+''+
			'<div class="head"><div style="background:url('+obj.headImg+'); background-size:100%"></div></div>'+												
			'<div class="name">'+obj.name+'</div>'+
			''+showdept+check1+'</a>';
		$(li).append(str);
		if(t_select) {
			$("a",$(li)).click(function(event){ 
				var checked_elm=$("#w_"+obj.id+"",$(this));				
				selectPreson(obj,checked_elm,!checked_elm.get(0).checked);		
				event.preventDefault();				 
				event.stopPropagation();				
			})
		}
		else{
			$(li).click(function(event){ 
				details(obj.id,obj.disable);
			});
		}
	}	
	
	var checked_elm =null;
	if(isdept==1&obj.type=="dept"){
		checked_elm=$("#p_"+obj.id+"",$(li))
	}
	else{
		checked_elm=$("#w_"+obj.id+"",$(li))
	}
	checked_elm.click(function(event){		
		event.stopPropagation();
		selectPreson(obj,this);			   
	});
	return li;
	
}

function selectPreson(obj,elm,checked1){//点击选择人员  选择的对象obj，，点击的标签elm， 未点击标签时候模拟点击传入的选中值checked1
	var checked=elm.checked
	if (typeof(elm.checked) == "undefined") { 
		checked=checked1;
	}
	if(obj.type=="dept"){//如果类型是部门
		if(checked){//如果是选择
			addDeptInSelectList(obj);
		}
		else{//取消选择
			removeDeptInSelectList(obj);
		}
	}
	else{//点击直接是用户
		if(checked){//如果是选择				
			radio();
			select_checked(obj);//编辑下边选中栏把选中的对象放入searchlit
		}
		else{//取消选择
			select_unchecked(obj);	
		}		
		//同ID的checkbox选中或取消 对应在全部列表中的人员和常用联系人中人员，以及同一个人在不同部门
		$(".w_"+obj.id+"").attr("checked",checked);		
	}	
	if(isRadio==false){
		checkallSelect(obj.id,obj.type);	
	}
	else{
		sure();
	}	
	$("#selectcount").html(selectList.length);
}

function checkallSelect(id,type){//检查是否选中全部，点击是部门还是人员时，检查同级目录是否全选，全选的话，上级部门勾选
	if(type=="dept"){
		var ul=$("#p_"+id+"",$(".levellist")).parent().parent().parent();
	}
	else{
		var ul=$("#w_"+id+"",$(".levellist")).parent().parent().parent().parent();
	}
	var list =ul.children();
	var isAllChecked=true;
	for(var i=0;i<list.length;i++){
		if(list[i].children.length>1){
			var input =  list[i].children[1].children[0]
		}
		else
		{
			var input =  list[i].children[0].children[2].children[0]			
		}
		if(input.checked){
			isAllChecked=true;
		}
		else{
			isAllChecked=false;
			break;
		}
	}	
	var p_input=$('>.check input',ul.parent());
	if(p_input.length>0){
		p_input.attr("checked",isAllChecked);		
		var p_id=p_input.get(0).id;
		p_id=p_input.get(0).id.substr(2,p_id.length);
		checkallSelect(p_id,"dept");
		
	}
}

function addDeptInSelectList(obj){	//递归调用把部门下所有人员信息加载到selectlist中
	
	var children1 =obj.children;
	if(children1.length>0){
		$(">input",$("#p_"+obj.id+"").parent().parent().parent()).attr("checked",true);	
		for(var i=0;i<children1.length;i++){
			if(children1[i].type=="dept"){				
				addDeptInSelectList(children1[i]);			
			}else{
				var checked_elm=$("#w_"+children1[i].id+"",$("#p_"+obj.id+"").parent().parent());	
				selectPreson(children1[i],checked_elm,true);
			}
			
		}
	}
	
}

function removeDeptInSelectList(obj){//递归调用把部门下所有人员信息从selectlist中移除
	var children1 =obj.children;
	if(children1.length>0){
		for(var i=0;i<children1.length;i++){
			if(children1[i].type=="dept"){
				removeDeptInSelectList(children1[i]);
				var checked_elm=$("#p_"+children1[i].id+"");
			}else{
				select_unchecked(children1[i]);
				var checked_elm=$("#w_"+children1[i].id+"");				
			}
			checked_elm.attr("checked",false);	
			selectPreson(children1[i],checked_elm,false);
		}
	}
}
function radio(){
	if(isRadio==true){
		$('.scroll_content ul').html("");
		selectList=[];
		$("input",$(".levellist")).attr("checked",false);
		$("input",$(".alllist")).attr("checked",false);
		$("input",$(".searchlist")).attr("checked",false);
		$("input",$(".commonlist")).attr("checked",false);
		
	}
}
function select_checked(obj){ //把选中信息加入到selectlist中。并且创建img在选中的列表中
	if(isExistence_in_SelectList(obj))  return;	
	var li=document.createElement("li");
	li.id=obj.id;
	var image=document.createElement("img");
	image.src=obj.headImg;
	$(li).append(image);
	//li.innerHTML=obj.id;	
	selectList.push(obj);	
	setScroll(li,1)
}
function isExistence_in_SelectList(obj){//判断是否存在选中的列表中
	for(var i=0;i<selectList.length;i++){
		if(selectList[i].id==obj.id){			
			return true;
		}
	}
	return false;
}
function select_unchecked(obj){//取消选中信息在selectlist中
	var li=$("#"+obj.id+"",$('.scroll_content ul'))
	setScroll(li,0);
	selectList_remove(obj);	
}

function selectList_remove(obj){//移除选中
	for(var i=0;i<selectList.length;i++){
		if(selectList[i].id==obj.id){
			selectList.splice(i,1);
			return ;
		}
	}
}

function setScroll(li,type)
{
	var ul =$('.scroll_content ul');
	if(type==1){			
		ul.append(li);		
	}
	else{
		li.remove();		
	}
	ul.width(selectList.length*43);	
	var scroll_content = $(".scroll_content");							
	var myscroll=new iScroll(scroll_content[0], {
		onBeforeScrollStart: function(e) {								
		},hScrollbar:false,vScrollbar:false
	});
}



function reloadDeptList(list,t_select){
	var levellist = $(".levellist");
	$(".levellist").html("");
	levellist.append(loaddept(list,t_select))
}

function loaddept(list,t_select){
	var ul = document.createElement("ul");
	
	for(var i=0;i<list.length;i++){
		$(ul).append(createli(list[i],t_select,1));		
	}
	return ul;
}
function showList(show,t_select){
	$("#showlist li").removeClass("on");
	$(".searchlist").hide();
	if(show==1){
		
		$("#showlist #li_dept").addClass("on");
		$(".levellist").show();
		$(".alllist").hide();
		$('.search').show();
		if(t_select) {
			$(".commonlist").hide(); 
			$('.search').hide();
		}
		
	}
	else if(show==2){	
		
		$("#showlist #li_all").addClass("on");
		$(".levellist").hide();
		$(".alllist").show();
		$('.search').show();
		if(t_select) {
			$(".commonlist").hide(); 
			$('.search').show();
		}
		$(".clickbar").show();
	}
	else{
		$("#showlist #li_common").addClass("on");
		$(".levellist").hide();
		$(".alllist").hide();
		if(t_select) {
			$(".commonlist").show(); 
			$('.search').hide();
		}
	}
}
function loadSearchList(list,t_select){

	var ul = document.createElement("ul"); 
	ul.className="normal";
	$(".searchlist").html("");
	$(".searchlist").append(ul);

	for(var i=0;i<list.length;i++){
		$(ul).append(createli(list[i],t_select));
	}
	

	$(".levellist").hide();
	$(".alllist").hide();
	$(".searchtips").hide();
	$(".searchlist").show();
}
function details(id,disable){
	if(disable==true)
	{		
		alert("该员工信息不可被查看");
	}
	else{
		gotoDetials(id);
	}	
}
function showMessage(msg){
	var div = document.createElement("div");
		var div1 = document.createElement("div");
		div1.innerHTML=msg;
		$(div).addClass("showlog");
		$(div).append(div1);
		$(".container").append(div);
		div.onclick=function(){
			$(this).hide();
		}
}
function reloadCommonList(list,t_select){

	var ul = document.createElement("ul"); 
	ul.className="normal";
	$(".commonlist").html("");
	$(".commonlist").append(ul);
	
	for(var i=0;i<list.length;i++){
		$(ul).append(createli(list[i],t_select));
	}
	
}

function loadPage(isauth,t_select){
	if(isauth){
		$("#showlist").css("display","block");		
		$(".levellist").css("display","block");	
		$(".alllist").hide();
		$(".searchtips").hide();
		$(".searchlist").hide();
		if(t_select) $(".search").hide();
		$("#showlist").show();
	}
	else{
		$("#showlist").css("display","none");		
		$(".levellist").css("display","none");	
		$(".alllist").hide();
		$(".searchtips").show();
		$(".searchlist").hide();
		if(t_select){ 
			$(".search").show();			
		}
		$(".search").addClass("top");
		$("body").addClass("top");
	}
}