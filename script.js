// Javascript Prototype example - to display and describe a simple rectangle using D3js and javascript Protypes

// To do:
// create a variable to start at 12 oclock 0 degress etc.. Done
// indent start of weeks Done
// set year as variable
// start year at right point of week
// add months arcs different colours
// add months text
// add average temperature colour behind days
// add clock hand
// date text
// implement settings (start pos, Locale)
// add ability to add events


// Define a Position object for the rectangle
function Position(x, y) {
 this.x = x;
 this.y = y;
}



// Define a Rectangle object using using position plus others as attributes
function Rectangle(position, width, height, color, rotation, desc) {
 this.position = position;
 this.width = width;
 this.height = height;
 this.color = color;
 this.rotation = rotation;
 this.desc = desc;
}

// Define a Triangle object using corners 1,2,3 positions
function Triangle(corner1_position, corner2_position, corner3_position, color) {
 this.corner1_position = corner1_position;
 this.corner2_position = corner2_position;
 this.corner3_position = corner3_position;
 this.color = color;
}

// Create a custom toString method for the Position object using prototype
Position.prototype.toString = function () {
 return "(" + this.x + "px," + this.y + "px)";
};

// Create our own area method for our Rectangle object using a prototype
Rectangle.prototype.area = function () {
 return this.width * this.height;
};

/* 
 * Create a Draw SVG Rectangle method to draw the Rectangle 
 * object using a javascript object prototype with a parameter which is the
 * number of the rectangle
 */
Rectangle.prototype.drawSvg = function() {
 rectangle = svgContainer.append("rect")
 .attr("x", this.position.x)
 .attr("y", this.position.y)
 .attr("width", this.width)
 .attr("height", this.height)
 .attr("fill", this.color)
 .attr("transform", "rotate("+this.rotation+","+this.position.x+","+this.position.y+")")
 .append("svg:title").text(this.desc);
}; 

Triangle.prototype.drawSvg = function() {
 console.log(this);
 var pathSt = this.corner1_position.x + ", " + this.corner1_position.y + ", " + this.corner2_position.x + ", " + this.corner2_position.y + ", " + this.corner3_position.x + ", " + this.corner3_position.y;
 triangle = svgContainer.append("polygon")
    .style("fill", this.color) 
    .attr("points", pathSt);
}; 


var radius=400;
var noOfDays = 365;
var centre_x=400;
var centre_y=400;
var widthOfDayTick = 2;
var lengthOfDayTick = 10;
var lengthOfStartOfWeekDayTick = 15;
var lengthOfDayTickToDisplay;
var rotation=0;
var x;
var y;
var r;
var offsetDeg = -120;
var clockwiseDirectionOfDays = false;
var directionMultiplier = 0;
var delayDrawEachDayMs = 3;
var rotateTick=0;
var year = 2018;
var noOfExtraDayTicks=2
var noOfDayTicks=noOfDays+noOfExtraDayTicks;
var dayTickNo;
var radiusReductionInc=0.015;


var d = new Date(new Date().getFullYear(), 0, 1);
//console.log(d);

var dateOfFirstDay = new Date('January 01, 2018 00:00:00');
var dayOfFirstDay = dateOfFirstDay.getDay();

// Lets use these rectangle properties to draw the Rectangle using d3 
// Create a container to hold the Rectangle
var svgContainer = d3.select("body").append("svg")
 .attr("width", radius + centre_x)
 .attr("height", radius + centre_y)
 .attr("class", "calclock_background");
 

 
if (clockwiseDirectionOfDays) { 
	directionMultiplier = 1 
} else { 
	directionMultiplier = -1;
	offsetDeg = offsetDeg - 180;
	rotateTick = 180;
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}


function calcXY(dayTickNo, dayNo, XorY) {
	
	  var centre;
	  if (XorY == "X") {
	   centre = centre_x;
	  } else {
		centre = centre_y;
	  }
	  var radiusVal = radius-(dayNo*radiusReductionInc);
	  console.log(dayTickNo);
	  console.log(radiusVal);
	  var angVal = 2 * Math.PI * ((dayTickNo + (offsetDeg/360)*noOfDayTicks) / noOfDayTicks);
	  var retVal = 0;
	  if (XorY=="X") {
		retVal = centre + round((radiusVal * Math.cos(angVal) * directionMultiplier), 2);
	  } else {
		retVal = centre + round((radiusVal * Math.sin(angVal) * directionMultiplier), 2);
	  }
	  return retVal;
}

 
function drawTick(dayNo) {
		if ((dayNo+dayOfFirstDay)%7==0) { lengthOfDayTickToDisplay = lengthOfStartOfWeekDayTick;} else { lengthOfDayTickToDisplay = lengthOfDayTick };
	    if (!clockwiseDirectionOfDays) { dayTickNo = noOfDayTicks - dayNo } else { dayTickNo = dayNo};
		x = calcXY(dayTickNo, dayNo, "X");
		y = calcXY(dayTickNo, dayNo, "Y");
		r = round((((dayTickNo / noOfDayTicks) * 360) + offsetDeg + 90 ) - rotateTick,1);
		//console.log("x="+x);
		//console.log("y="+y);  
		//console.log("rotate="+r);	
		//console.log("cos / sin part ="+round(Math.sin(2 * Math.PI * ((dayTickNo + (offsetDeg/360)*noOfDayTicks) / noOfDayTicks)), 3));
		if (dayNo <= noOfDayTicks - noOfExtraDayTicks) { 
			rect = new Rectangle(new Position(x, y), widthOfDayTick, lengthOfDayTickToDisplay, "blue", r, dayNo);	
		} else {
			rect = new Rectangle(new Position(x, y), widthOfDayTick, lengthOfDayTickToDisplay, "#aaa", r, dayNo);	
		}
		// Draw the Rectangle using our drawSvgRectangle prototype
		rect.drawSvg();
}
 
var dayNo=1;
var drawDaysTimer = setInterval(drawDays, delayDrawEachDayMs);

function drawDays() {
	if (dayNo > noOfDayTicks) {
		//console.log("stopped");
		clearInterval(drawDaysTimer);
	} else {
		//console.log(dayNo);
		drawTick(dayNo);
		dayNo++;
		 // If the count down is finished, write some text 	
	}
}


function drawShadow(startDay, endDay, color, transparency) {
	var shadow_corner_start_x = calcXY(startDay, "X");
	var shadow_corner_start_y = calcXY(startDay, "Y");
	var shadow_corner_end_x = calcXY(endDay, "X");
	var shadow_corner_end_y = calcXY(endDay, "Y");
	tri = new Triangle(new Position(centre_x, centre_y), new Position(shadow_corner_end_x, shadow_corner_end_y), new Position(shadow_corner_start_x, shadow_corner_start_y), color);
	tri.drawSvg();
}

drawShadow(368, 366, "#ddd", 100);

drawShadow(368, 366.5, "#ccc", 100);

drawShadow(368, 367, "#bbb", 100);

drawShadow(368, 367.5, "#aaa", 100);
	
svgContainer.append("line")
    .attr("x1", centre_x)
    .attr("y1", centre_y)
    .attr("x2", shadow_corner_start_x)
    .attr("y2", shadow_corner_start_y)
	.style("stroke", "#999")  // colour the line;
