var canvasWidth = Math.min(800, $(window).width() - 20); //如果屏幕小于800px，则取值为屏幕大小宽度，便于移动端的展示，-20是为了使得米字格不紧贴于边缘  
var canvasHeight = canvasWidth;

var strokeColor = "black";
var isMouseDown = false; //鼠标按下时候的状态  
var lastLoc = {
	x: 0,
	y: 0
}; //鼠标上一次结束时的位置  
var lastTimestamp = 0; //上一次时间，与笔刷粗细有关  
var lastLineWidth = -1; //笔刷粗细  

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var backcanvas = document.getElementById("backcanvas"); //获取canvas   
var backcontext = backcanvas.getContext('2d'); //canvas追加2d画图

var realcanvas = document.getElementById("realcanvas"); //获取canvas   
var realcontext = realcanvas.getContext('2d'); //canvas追加2d画图

var hanzi = "福";

canvas.width = canvasWidth;
canvas.height = canvasHeight;


backcanvas.width = canvasWidth;
backcanvas.height = canvasHeight;

realcanvas.width = canvasWidth;
realcanvas.height = canvasHeight;

$("#controller").css("width", canvasWidth + "px");
$("#controller").css("padding-top", canvasWidth + "px");


drawGrid(hanzi); //画米字格  和 需要的文字


var imageurl; //存放canvas 图片base64 路径
var linex = new Array(); //横坐标
var liney = new Array(); //纵坐标
var linen = new Array(); //移动坐标
var linetime = new Array(); //记录时间
	var lastX = -1;  //路径坐标，从起始到下一个的坐标 
	var lastY = -1;  //路径坐标
	var flag = 0;  //标志，判断是按下后移动还是未按下移动 重要
	var penwidth=10; //画笔宽度
	var pencolor="#000";//画笔颜色
	var timecha=80;//笔画间隔时间差




var settimea=[];
$("#replay_btn").click(
	function(e){
		
		console.log("linen:")
		console.log(linen);
		
		console.log("linex:")
		console.log(linex);
		
		console.log("liney:")
		console.log(liney);
		
		console.log("linetime:")
		console.log(linetime);
		
		for(var i=0;i<settimea.length;i++){
			clearTimeout(settimea[i]);
		};
		
		backcontext.clearRect(0,0,canvas.width,canvas.height);
		
		context.clearRect(0,0,canvas.width,canvas.height);		
		context.save(); 
		context.translate(context.canvas.width/2, context.canvas.height/2);  
		context.translate(-context.canvas.width/2, -context.canvas.height/2); 
		context.beginPath();  		
		var datestart=0;
		var funa=[];
		for (var i=0;i<linen.length;i++) {				
			if(i==0){		
				context.lineWidth = penwidth;  //线宽度	
				context.strokeStyle = pencolor;  
				context.moveTo(linex[0],liney[0]);				
				context.stroke();  //绘制	
				
			}else{
				if(linen[i]==0 && linen[i-1]==0){				
					datestart=parseInt(datestart)+parseInt(linetime[i]-linetime[i-1])<timecha ? parseInt(datestart)+parseInt(linetime[i]-linetime[i-1]):parseInt(datestart)+parseInt(timecha);			
					if (linen[i] == 0) { 			
						(funa[i]=function(datestart,xx,yy){
							settimea[i]=setTimeout(function(){
							context.clearRect(0,0,canvas.width,canvas.height);	
							context.lineWidth = penwidth;  //线宽度	
							context.strokeStyle = pencolor;  
							context.moveTo(xx,yy);							
							context.stroke();  //绘制
							},datestart)
						})(datestart,linex[i],liney[i]);		
					} else { 
						(funa[i]=function(datestart,xx,yy){
							settimea[i]=setTimeout(function(){
							context.clearRect(0,0,canvas.width,canvas.height);	
							context.lineWidth = penwidth;  //线宽度
							context.strokeStyle = pencolor;  	
							context.lineTo(xx,yy);							
							context.stroke();  //绘制
							},datestart)
						})(datestart,linex[i],liney[i]);					
					}; 			
					
				}else{
					datestart=parseInt(datestart)+parseInt(linetime[i]-linetime[i-1]);			
					if (linen[i] == 0) { 			
						(funa[i]=function(datestart,xx,yy){
							settimea[i]=setTimeout(function(){
							context.clearRect(0,0,canvas.width,canvas.height);	
							context.lineWidth = penwidth;  //线宽度	
							context.strokeStyle = pencolor;  
							context.moveTo(xx,yy);							
							context.stroke();  //绘制
							},datestart)							
						})(datestart,linex[i],liney[i]);		
					} else { 
						(funa[i]=function(datestart,xx,yy){
							settimea[i]=setTimeout(function(){
							context.clearRect(0,0,canvas.width,canvas.height);	
							context.lineWidth = penwidth;  //线宽度	
							context.strokeStyle = pencolor;  
							context.lineTo(xx,yy);							
							context.stroke();  //绘制
							},datestart)
						})(datestart,linex[i],liney[i]);					
					}; 			
	
				};
				context.stroke();  //绘制
			}
									
		}	
		context.restore();  //释放画布以前状态，不能写字就破坏了		       
	}
)

$("#clear_btn").click(
	function(e) {
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		drawGrid(hanzi);
		isMouseDown = false;
		linex = [];  //横坐标
		liney = [];  //纵坐标
		linen =[];  //移动坐标 
		linetime =[];  //时间戳 
	}
)
$(".color_btn").click(
	function(e) {
		$(".color_btn").removeClass("color_btn_selected");
		$(this).addClass("color_btn_selected");
		strokeColor = $(this).css("background-color");
		pencolor = $(this).css("background-color");
	}
)
//适用于移动端触控  
function beginStroke(point) {

	isMouseDown = true
	//console.log("mouse down!");  
	lastLoc = windowToCanvas(point.x, point.y); //上一次坐标位置  
	lastTimestamp = new Date().getTime();

}

function endStroke() {
	isMouseDown = false;
}

function moveStroke(point) {

	var curLoc = windowToCanvas(point.x, point.y);
	var curTimestamp = new Date().getTime();
	var s = calcDistance(curLoc, lastLoc);
	var t = curTimestamp - lastTimestamp;

	var lineWidth = calcLineWidth(t, s)*0.8;

	penwidth =lineWidth;
	//draw  
	context.beginPath();
	context.moveTo(lastLoc.x, lastLoc.y);
	context.lineTo(curLoc.x, curLoc.y);

	context.strokeStyle = strokeColor;
	context.lineWidth = lineWidth;
	context.lineCap = "round";
	context.lineJoin = "round";
	context.stroke();

	lastLoc = curLoc;
	lastTimestamp = curTimestamp;
	lastLineWidth = lineWidth;
}

canvas.onmousedown = function(e) {
	e.preventDefault();
	linex.push(e.clientX);
	liney.push(e.clientY);   	  
	linen.push(0);  //按下0位
	linetime.push(new Date().getTime());
	beginStroke({
		x: e.clientX,
		y: e.clientY
	});
};
canvas.onmouseup = function(e) {
	e.preventDefault();
	endStroke();
};
canvas.onmouseout = function(e) {
	e.preventDefault();
	endStroke();
};
canvas.onmousemove = function(e) {
	e.preventDefault();
	if (isMouseDown) {

		// linex.push(evt.layerX);  //坐标存入数组   layer获取相对于当前元素的坐标，不同于pagex获取相对页面
		// liney.push(evt.layerY);  
		linex.push(e.clientX);
		liney.push(e.clientY);   	  
		linen.push(1);  //按下0位
		linetime.push(new Date().getTime());
		
		moveStroke({
			x: e.clientX,
			y: e.clientY
		})
	}
};

canvas.addEventListener('touchstart', function(e) {
	e.preventDefault();
	var touch = e.touches[0];
	
	// linex.push(evt.layerX);  //坐标存入数组   layer获取相对于当前元素的坐标，不同于pagex获取相对页面
	// liney.push(evt.layerY);  
	linex.push(touch.pageX);
	liney.push(touch.pageY);   	  
	linen.push(0);  //按下0位
	linetime.push(new Date().getTime());
	
	
	beginStroke({
		x: touch.pageX,
		y: touch.pageY
	})
});
canvas.addEventListener('touchmove', function(e) {
	e.preventDefault();
	if (isMouseDown) {
		var touch = e.touches[0];
		
		linex.push(touch.pageX);
		liney.push(touch.pageY);   
		
		linen.push(1);  //移动1位
		linetime.push(new Date().getTime());//步骤和记录的时间戳
		
		moveStroke({
			x: touch.pageX,
			y: touch.pageY
		});
	}
});
canvas.addEventListener('touchend', function(e) {
	e.preventDefault();
	var touch = e.touches[0];
	if(touch!=undefined){
		linex.push(touch.pageX);
		liney.push(touch.pageY);   
		
		linen.push(0);  
		linetime.push(new Date().getTime());	    
	}
	endStroke();
});

var maxLineWidth = 30;
var minLineWidth = 1;
var maxStrokeV = 10;
var minStrokeV = 0.1;

function calcLineWidth(t, s) {

	var v = s / t;

	var resultLineWidth;
	if (v <= minStrokeV)
		resultLineWidth = maxLineWidth;
	else if (v >= maxStrokeV)
		resultLineWidth = minLineWidth;
	else {
		resultLineWidth = maxLineWidth - (v - minStrokeV) / (maxStrokeV - minStrokeV) * (maxLineWidth - minLineWidth);
	}

	if (lastLineWidth == -1)
		return resultLineWidth;

	return resultLineWidth * 1 / 3 + lastLineWidth * 2 / 3;
}

function calcDistance(loc1, loc2) {

	return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y));
}

function windowToCanvas(x, y) {
	var bbox = canvas.getBoundingClientRect();
	return {
		x: Math.round(x - bbox.left),
		y: Math.round(y - bbox.top)
	}
}

function drawGrid(text) {

	context.save();

	context.strokeStyle = "rgb(230,11,9)";

	context.beginPath();
	context.moveTo(3, 3);
	context.lineTo(canvasWidth - 3, 3);
	context.lineTo(canvasWidth - 3, canvasHeight - 3);
	context.lineTo(3, canvasHeight - 3);
	context.closePath();
	context.lineWidth = 6;
	context.stroke();

	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(canvasWidth, canvasHeight);

	context.moveTo(canvasWidth, 0);
	context.lineTo(0, canvasHeight);

	context.moveTo(canvasWidth / 2, 0);
	context.lineTo(canvasWidth / 2, canvasHeight);

	context.moveTo(0, canvasHeight / 2);
	context.lineTo(canvasWidth, canvasHeight / 2);

	context.lineWidth = 1;
	context.stroke();

	context.restore();

	backcontext.fillStyle = "#999999";
	backcontext.font = 3 * canvasWidth / 4 + "px 宋体";
	backcontext.fillText(text, canvasWidth / 8, 3 * canvasHeight / 4);
	backcontext.strokeStyle = "#add59e";
	backcontext.strokeText(text, canvasWidth / 8, 3 * canvasHeight / 4);




}
