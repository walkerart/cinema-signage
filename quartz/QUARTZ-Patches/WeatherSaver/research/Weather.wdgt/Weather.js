/*
Copyright ＿ 2005, Apple Computer, Inc.  All rights reserved.
NOTE:  Use of this source code is subject to the terms of the Software
License Agreement for Mac OS X, which accompanies the code.  Your use
of this source code signifies your agreement to such license terms and
conditions.  Except as expressly granted in the Software License Agreement
for Mac OS X, no other copyright, patent, or other intellectual property
license or right is granted, either expressly or by implication, by Apple.
*/

var zip = 'Cupertino, CA';
var postal = 95014;
var location = null;
var timer = null;
var isItNight = false;
var showLows = false;
var isCelcius = false;
var lastResults = null;
var labelWindow = null;
var totalWidgetHeight = 0;
var totalWidgetWidth = 0;
var isCollapsed = false;
var topOffset = 0;
var leftOffset = 0;
var maxImageWidth = 0;
var maxImageHeight = 0;
var windAnimation = {timer:null, img:null, current:-1, animating:false};
var isShowingFront = true;
var timerInterval = 120000; // updates every two minutes
var lastWeatherXMLRequest = null;
var dataSetWhenObjectWasFlipped = null;


var iconTable = new Array;
iconTable['sun'] = {url:'Images/Icons/sun.png', width:135, height:135, voffset:41, hoffset:76};
iconTable['partlycloudy'] = {url:'Images/Icons/partlycloudy.png', width:201, height:135, voffset:41, hoffset:46};
iconTable['haze'] = {url:'Images/Icons/haze.png', width:341, height:123, voffset:50, hoffset:-29};
iconTable['clouds'] = {url:'Images/Icons/cloudy.png', width:138, height:82, voffset:14,hoffset:75};
iconTable['rain'] = {url:'Images/Icons/rain.png', width:115, height:151, voffset:6,hoffset:86};
iconTable['lightening'] = {url:'Images/Icons/lightening.png', width:151, height:110, voffset:28, hoffset:69};
iconTable['snow'] = {url:'Images/Icons/snow.png', width:264, height:139, voffset:84, hoffset:11};
iconTable['hail'] = {url:'Images/Icons/hail.png', width:264, height:166, voffset:146, hoffset:15};
iconTable['moon'] = {url:'Images/Icons/moon.png', moon:true, width:65, height:68, voffset:0,hoffset:110};
iconTable['flurries'] = {url:'Images/Icons/flurries.png', width:227, height:155, voffset:78, hoffset:30};
iconTable['fog'] = {url:'Images/Icons/fog.png', width:352, height:87, voffset:1, hoffset:-31};
iconTable['ice'] = {url:'Images/Icons/ice.png', width:126, height:72, voffset:5, hoffset:77};
iconTable['partlycomboclouds'] = {url:'Images/Icons/partlycomboclouds.png', width:201, height:57, voffset:4, hoffset:50};
iconTable['rain&clouds'] = {url:'Images/Icons/rain&clouds.png', width:201, height:131, voffset:27, hoffset:45};
iconTable['rain&sun'] = {url:'Images/Icons/rain&sun.png', width:134, height:168, voffset:37, hoffset:76};
iconTable['rain&snow'] = {url:'Images/Icons/rain&snow.png', width:227, height:214, voffset:61, hoffset:30};
iconTable['wind'] = {url:'Images/Icons/wind000.png', width:365, height:161, voffset:49, hoffset:-58, animate:true};


var miniIconTable = new Array;
miniIconTable["sun"]			= 'Images/Minis/sun.png';
miniIconTable["suncloud"]		= 'Images/Minis/sun-cloud.png';
miniIconTable["sunhaze"] 		= 'Images/Minis/sun-haze.png';
miniIconTable["clouds"] 		= 'Images/Minis/clouds.png';	
miniIconTable["fog"] 			= 'Images/Minis/fog.png';
miniIconTable["rain"] 		= 'Images/Minis/rain.png';
miniIconTable["cloudrain"]	= 'Images/Minis/cloud-rain.png';
miniIconTable["sunrain"] 		= 'Images/Minis/sun-rain.png';
miniIconTable["lightening"] 	= 'Images/Minis/lightning.png';
miniIconTable["flurries"] 	= 'Images/Minis/flurries.png';
miniIconTable["snow"] 		= 'Images/Minis/snow.png';	
miniIconTable["ice"] 		= 'Images/Minis/ice.png';		
miniIconTable["hail"] 		= 'Images/Minis/hail.png';
miniIconTable["snowrain"] 	= 'Images/Minis/snow-rain.png';
miniIconTable["wind"] 		= 'Images/Minis/wind.png';

function getLocalizedString (key)
{
	try {
		var ret = localizedStrings[key];
		if (ret === undefined)
			ret = key;
		return ret;
	} catch (ex) {}

	return key;
}

var lastDayCode = null;
function fillInDays (object)
{
	try {
		// only fill out the day codes when necessary
		if (object.forecast[0].daycode != lastDayCode)
		{
			lastDayCode = object.forecast[0].daycode;
			var c = object.forecast.length;
			
			if (c > 6) c = 6; // just to be safe
		
			for (var i=0; i < c; ++i)
			{
				var day = document.getElementById('day' + i);
				day.innerText = getLocalizedString (object.forecast[i].daycode);
			}
		}
	} catch (ex)
	{
	}
}

function getURLForSmallIcon (code)
{
	var src = '';
	if (code)
	{
		src = miniIconTable[code];
		
		if (src === undefined)
			src = '';
	}
		
	return src;
}

function fillInForecast (object)
{
	try {
		var c = object.forecast.length;
		if (c > 6) c = 6; // just to be safe
		
		for (var i=0; i<c; ++i)
		{
			var forecast = object.forecast[i];
			document.getElementById('hi'+i).innerText = convertToCelcius(forecast.hi)+ 'º';
			document.getElementById('low'+i).innerText = convertToCelcius(forecast.lo) + 'º';
			var icon = document.getElementById('icon'+i);
			icon.src = getURLForSmallIcon(forecast.ouricon);
			icon.alt = forecast.description;
			
			lastResults[i+1] = {hi:forecast.hi, lo:forecast.lo};
		}
	
	} catch (ex) {}
}

function updateValuesUnitsChanged()
{
	if (lastResults != null)
	{
		var c = lastResults.length;
		
		if (c > 0)
		{
			var object = lastResults[0];
			document.getElementById('high').innerText = getLocalizedString('H: ') + convertToCelcius(object.hi) + 'º';
			document.getElementById('lo').innerText = getLocalizedString('L: ') + convertToCelcius(object.lo) +  'º';
			document.getElementById('temperature').innerText = convertToCelcius(object.now);	
			
			
			for (var i=1; i < c; ++i)
			{
				object = lastResults[i];
				document.getElementById('hi'+(i-1)).innerText = convertToCelcius(object.hi)+ 'º';
				document.getElementById('low'+(i-1)).innerText = convertToCelcius(object.lo) + 'º';
			}
		
		}
	}
}


function convertToCelcius(num)
{
	if (isCelcius)
		return Math.round ((num - 32) * 5 / 9);
	else
		return num;
}

function changeLowsColor (isNight)
{
	var replace;
	var to;
	
	if (isNight)
	{
		replace = 'low-day-color';
		to = 'low-night-color';
	}
	else
	{
		to = 'low-day-color';
		replace = 'low-night-color';
	}
	
	for (var i=0; i<6; ++i)
	{
		var element = document.getElementById('low'+i);
		element.setAttribute ('class', element.getAttribute('class').replace(replace, to));
	}
}

function calculateBackgroundHeight ()
{
	var height;
	if (isCollapsed)
		height = 71;
	else
		height = showLows ? 182 : 162;
		
	height +=  topOffset;
	if (height < maxImageHeight) 
		height = maxImageHeight; // make sure there is enough room for icon;

	return height;
}

function calculateBackgroundWidth ()
{
	var w = 284 + leftOffset;
	
	return w > maxImageWidth ? w : maxImageWidth;
}

// temp for demo
function getPathForPhases ()
{
	return "Images/Icons/moonphases/";
}

function getMoonPhaseIcon (object)
{
	try {
		var phase = object.phases[0];
		if (phase > 0 && phase < 25)
		{
			return getPathForPhases() + "moon-"+phase+".png";
		}
	
	} catch (ex) {}
	
	// always fall back to our full moon pic
	return "Images/Icons/moon.png";
}

var lastIcon = null;
function handleDataFetched (object)
{
	lastResults = new Array;
	
	lastResults[0] = {hi:object.hi, lo:object.lo, now:object.temp};
	document.getElementById('high').innerText = getLocalizedString('H: ') + convertToCelcius(object.hi) + 'º';
	document.getElementById('lo').innerText = getLocalizedString('L: ') + convertToCelcius(object.lo) +  'º';
	document.getElementById('location').innerText = object.city;
	
	document.getElementById('temperature').innerText = convertToCelcius(object.temp);
	
	if (object.city)
	{
		if (object.city != location && window.widget)
			widget.setPreferenceForKey(object.city, createkey("savedcity"));
		location = object.city;
	}
	
	if (object.sunset != null && object.sunrise != null && object.time != null)
	{
		var now = (object.time.hour * 1000) + object.time.minute;
		var sunset = (object.sunset.hour * 1000) + object.sunset.minute;
		var sunrise = (object.sunrise.hour * 1000) + object.sunrise.minute;
		
		if (now > sunset || now < sunrise)
		{
			if (!isItNight)
			{
				document.getElementById('top').style.backgroundImage = 'url(Images/weather_night_top.png)';
				document.getElementById('middle-img').src = 'Images/weather_night_middle.png';
				document.getElementById('bottom').style.backgroundImage = 'url(Images/weather_night_bottom.png)';
				document.getElementById('dayband').src = 'Images/forecast_dayband_night.png';
				changeLowsColor (true);
				
				isItNight = true;
			}
		}
		else
		{
			if (isItNight)
			{
				document.getElementById('top').style.backgroundImage = 'url(Images/weather_day_top.png)';
				document.getElementById('middle-img').src  = 'Images/weather_day_middle.png';
				document.getElementById('bottom').style.backgroundImage = 'url(Images/weather_day_bottom.png)';
				document.getElementById('dayband').src = 'Images/forecast_dayband.png';
				changeLowsColor (false);

				isItNight = false;
			}
		}
	}
	
	fillInDays (object);
	fillInForecast (object);
	
	if (lastIcon != object.icon)
	{
		var iconContainer = document.getElementById('icon-holder');
		
		// remove all children
		while (iconContainer.hasChildNodes())
			iconContainer.removeChild(iconContainer.firstChild);

		var maxOffset = 0;
		var maxLeftOffset = 0;
		var lastTopOffset = topOffset;
		var lastLeftOffset = leftOffset;
		topOffset = 0;
		maxImageWidth = 0;
		maxImageHeight = 0;
		var frontPanel = document.getElementById('front-panel');	
		var backPanel = document.getElementById('back');
		
		frontPanel.style.top = "0";
		frontPanel.style.left = "0";
		backPanel.style.top = "0";
		backPanel.style.left = "0";
		
		if (windAnimation.timer != null)
		{
			clearInterval (windAnimation.timer);
			windAnimation.timer = null;
		}
		windAnimation.animating = false;
			
		if (object.icons != null)
		{
			var a = object.icons;
			var c = a.length;
			var array = new Array;
			
			for (var i = 0; i < c; ++i)
			{
				var entry = iconTable[a[i]]; // map to our objects
				if (entry != null)
				{
					array[array.length] = entry;
					maxOffset = entry.voffset > maxOffset ? entry.voffset : maxOffset;
					
					if (entry.hoffset < 0)
					{
						var offset = -entry.hoffset;
						maxLeftOffset = offset > maxLeftOffset ? offset : maxLeftOffset;
					}
					
				}
			}
			
			if (array.length > 0)
			{
				// there are no images with negative vertical offsets
				frontPanel.style.top = maxOffset + "px";
				frontPanel.style.left = maxLeftOffset + "px";
				backPanel.style.top = maxOffset + "px";
				backPanel.style.left = maxLeftOffset + "px";
				
				topOffset = maxOffset;
				leftOffset = maxLeftOffset;
				
				if (object.description == null)
					object.description = "";
					
				for (var i = 0; i < array.length; ++i)
				{
					var item = array[i];
					var img = document.createElement('img');
					img.setAttribute ("class", "icon");
					img.setAttribute ("onclick", "toggleView(event);");
					img.setAttribute ("alt", object.description);
					if (item.moon)
						img.src = getMoonPhaseIcon(object);
					else
						img.src = item.url;
					var t = maxOffset - item.voffset;
					var l = maxLeftOffset + item.hoffset;
					img.style.top = t + "px";
					img.style.left = l + "px";
					maxImageHeight = (t + item.height) > maxImageHeight ? (t + item.height) : maxImageHeight;
					maxImageWidth = (l + item.width) > maxImageWidth ? (l + item.width) : maxImageWidth;
					iconContainer.appendChild(img);
					
					if (item.animate) // its the wind
					{
						windAnimation.timer = setInterval ("windAnimate();", 30);
						windAnimation.current = -1;
						windAnimation.img = img;
						windAnimation.animating = true;
					}
				}
			}
		}
		
		// now resize the window.
		var height = calculateBackgroundHeight();
		var width = calculateBackgroundWidth();
		
		if (totalWidgetHeight != height || width != totalWidgetWidth || lastTopOffset != topOffset || lastLeftOffset != leftOffset)
		{
			totalWidgetHeight = height;
			totalWidgetWidth = width;
			
			if (window.widget)
			{
				widget.resizeAndMoveTo ((window.screenX + lastLeftOffset) - leftOffset, (window.screenY + lastTopOffset)- topOffset, width, height);
				
				// reset the close box offset as necessary
				if (lastTopOffset != topOffset || lastLeftOffset != leftOffset)
				{
					// 13 and 10 are the hardcoded start offsets
					widget.setCloseBoxOffset (leftOffset + 13, topOffset+10);
					widget.setPositionOffset (leftOffset, topOffset);
				}

			}
			
		}
	}
}

function dataFetched (object)
{
	lastWeatherXMLRequest = null;
	endFetchingAnimation ();
	if (!object.error)
	{
		// only set the data if we are showing front as it could cause the backside to be resized.
		// which would break the widget
		if (!isShowingFront)
		{
			dataSetWhenObjectWasFlipped = object;
		}
		else
		{
			handleDataFetched (object);
			dataSetWhenObjectWasFlipped = null; // just to be safe
		}
	}
	else
	{
		alert ('Fetching data failed, ' + object.errorString);
	}
}

var fetchingAnimation = {timer: null, alphaNow:1.0, up:false, duration:1000, start:null};

function fetchAnimationTimer ()
{
	var time = (new Date).getTime();
	var fraction;
	
	if (fetchingAnimation.up)
		fraction = (time - fetchingAnimation.start) / fetchingAnimation.duration;
	else
		fraction = 1.0 - (time - fetchingAnimation.start) / fetchingAnimation.duration;
	
	fetchingAnimation.alphaNow = fraction;
	
	if (fetchingAnimation.alphaNow > 1.0)
	{
		fetchingAnimation.start = time;
		fetchingAnimation.alphaNow = 1.0;
		fetchingAnimation.up = false;
	}
	else if (fetchingAnimation.alphaNow < 0.0)
	{
		fetchingAnimation.start = time;
		fetchingAnimation.alphaNow = 0.0;
		fetchingAnimation.up = true;
	}
	
    var sine = Math.sin((Math.PI/2.0) * fetchingAnimation.alphaNow);

    fetchingAnimation.alphaNow = sine * sine;
    
    document.getElementById('dot').style.opacity = fetchingAnimation.alphaNow;
}

function startFetchingAnimation ()
{
	if (fetchingAnimation.timer != null)
	{
		clearInterval (fetchingAnimation.timer);
		fetchingAnimation.timer = null;
	}
	
	fetchingAnimation.up = false;
	fetchingAnimation.alphaNow = 1.0;
	fetchingAnimation.start = (new Date).getTime() - 60;
	fetchingAnimation.timer = setInterval ('fetchAnimationTimer();', 60);
	var dot = document.getElementById('dot');
	dot.style.opacity = '1.0';
	dot.style.display = 'inline';
}

function endFetchingAnimation ()
{
	if (fetchingAnimation.timer != null)
	{
		clearInterval (fetchingAnimation.timer);
		fetchingAnimation.timer = null;
	}
	
	document.getElementById('dot').style.display = 'none';
}

function fetchData()
{
	if (lastWeatherXMLRequest != null)
		lastWeatherXMLRequest.abort();

	lastWeatherXMLRequest = fetchWeatherData (dataFetched, postal);
	startFetchingAnimation();
}


function doLoad ()
{
	// set timeout to 1 minute for testing
	fetchData();
	timer = setInterval ('fetchData();', timerInterval);

}

function load ()
{
	doLoad();
	
}

var resizedWhenShowedBack = false;
function showbackside (event)
{
	var front = document.getElementById("front");
	var back = document.getElementById("back");
	
	isShowingFront = false;
	
	if (window.widget)
	{
		// reisze the widget to the large size
		var backSize = 182 + topOffset;
		if (totalWidgetHeight < backSize)
		{
			window.resizeTo (calculateBackgroundWidth(), backSize);
			resizedWhenShowedBack = true;
		}
		else
			resizedWhenShowedBack = false;
		widget.prepareForTransition("ToBack");
	}
	
	front.style.display="none";
	back.style.display="block";
	
	if (window.widget)
		setTimeout ('widget.performTransition();', 0);
	
	// do not receive updates when showing the backside
	if (timer != null)
	{
		clearInterval(timer);
		timer = null;
	}
	
	document.getElementById('fliprollie').style.display = 'none';
		
	event.stopPropagation();
	event.preventDefault();
}

function showfront ()
{
	var front = document.getElementById("front");
	var back = document.getElementById("back");

	isShowingFront = true;
	
	if (window.widget)
		widget.prepareForTransition("ToFront");
	
	front.style.display="block";
	back.style.display="none";
	
	if (window.widget)
		setTimeout ('widget.performTransition();', 0);
	
	// we may need to delay this to after the flip is complete
	var newZip = document.getElementById('zip').value;
	if (zip != newZip)
	{
		zip = newZip;
		postal = document.getElementById('zip').postal;
		if (!postal) // postal not set 
			postal = zip;
		doLoad();
		if (window.widget)
		{
			widget.setPreferenceForKey(zip, createkey("zip"));
			widget.setPreferenceForKey(postal, createkey("postal"));
		}
	}
	else
	{
		if (timer == null)
			timer = setInterval ('fetchData();', timerInterval);
	}
	
	if (resizedWhenShowedBack)
	{
		window.resizeTo (calculateBackgroundWidth(), calculateBackgroundHeight());
		resizedWhenShowedBack = false;
	}
	
	if (dataSetWhenObjectWasFlipped != null)
	{
		handleDataFetched (dataSetWhenObjectWasFlipped);
		dataSetWhenObjectWasFlipped = null;
	}
}

var resizeAnimation = {startTime:0, duration:250, positionFrom:0, positionTo:0, positionNow:0, frameFrom:0, frameTo:0, frameNow:0, timer:null, element:null, image:null, background:null, onfinished:null};


function limit_3 (a, b, c) {
    return a < b ? b : (a > c ? c : a);
}

function computeNextFloat (from, to, ease) {
    return from + (to - from) * ease;
}

function animate () {
	var T;
	var ease;
	var time  = (new Date).getTime();
	var yLoc;
	var frame;
		
	T = limit_3(time-resizeAnimation.startTime, 0, resizeAnimation.duration);
	ease = 0.5 - (0.5 * Math.cos(Math.PI * T / resizeAnimation.duration));

	if (T >= resizeAnimation.duration)
	{
		yLoc = resizeAnimation.positionTo;
		clearInterval (resizeAnimation.timer);
		resizeAnimation.timer = null;
		
		if (resizeAnimation.onfinished)
			setTimeout ("resizeAnimation.onfinished();", 0); // call after the last frame is drawn
	}
	else
		yLoc = computeNextFloat(resizeAnimation.positionFrom, resizeAnimation.positionTo, ease);
		
	// convert to a integer, not sure if this is the best way
	resizeAnimation.positionNow = parseInt(yLoc);
	resizeAnimation.element.style.height = resizeAnimation.positionNow + "px";
}

function animFinished() {
	
	if (window.widget)
	{
		if (isCollapsed)
		{
			totalWidgetHeight = calculateBackgroundHeight();
			
			window.resizeTo (calculateBackgroundWidth(), totalWidgetHeight);
		}
		
		widget.setPreferenceForKey (isCollapsed ? "true" : "false", createkey("collapsed"));
	}
}

var demoOverride = null;
var demoIndex=-1;
var demoIcons = 
[
	["sun"], 					// 1 Sunny
	["partlycloudy"],			// 3 Partly Sunny
	["sun", "haze"],				// 5 Hazy Sunshione
	["partlycloudy"],			// 6 Mostly Cloudy
	["clouds"],					// 7 Cloudy (am/pm)
	["fog"],						// 11 fog (am/pm)
	["rain"],					// 12 showers (am/pnm)
	["rain&clouds"],				// 13 Mostly Cloudy with Showers
	["rain&sun"],				// 14 Partly Sunny with Showers
	["lightening"],				// 15 Thunderstorms (am/pm)
	["flurries"],				// 19 Flurries (am/pm)
	["snow"],					// 22 Snow (am/pm)
	["ice"],						// 24 Ice (am/pm)
	["hail"],					// 25 Sleet (am/pm)
	["rain&snow"],				// 29 Rain and Snow Mixed (am/pm)
	["wind"],					// 32 Windy (am/pm)
	// Night only Icons
	["moon"],					// 33 Clear
	["moon", "partlycomboclouds"],// 35 Partly Cloudy
	["moon", "haze"],			// 37 Hazy
];
var demoNightIndex = 16;

var demoObject = {
	hi: 80,
	lo:	30,
	city: "Nowhere",
	temp: 50,
	sunset: {hour:18, minute:30},
	sunrise: {hour:6, minute:30},
	forecast: [	{daycode:"WED", hi:70, lo:40},
			 	{daycode:"THU", hi:60, lo:40},
			 	{daycode:"FRI", hi:50, lo:40},
			 	{daycode:"SAT", hi:60, lo:40},
			 	{daycode:"SUN", hi:70, lo:40},
			 	{daycode:"MON", hi:80, lo:40},
			 	
			 ],
	icon: 1,
	icons:["sun"],
	phases:[5]
};


function toggleView(event) {

	if (event.altKey && event.metaKey)
	{				
		demoIndex++;
		if (demoIndex >= demoIcons.length)
			demoIndex = 0;
			
		demoObject.icons = demoIcons[demoIndex];
		
		if (demoIndex < demoNightIndex)
		{
			// day
			demoObject.sunset = {hour:23, minute:0};
		}
		else
		{
			//night
			demoObject.sunset = {hour:6, minute:0};
		}
		
		handleDataFetched(demoObject);
	}
	else
	{
		var midDiv = document.getElementById("middle");
		var timeNow = (new Date).getTime();
		var multiplier = (event.shiftKey ? 10 : 1); // enable slo-mo
		var startingSize = parseInt(midDiv.clientHeight,10);
	
		resizeAnimation.element = midDiv;
		if (resizeAnimation.timer != null) // it is moving... change to new size
		{
			clearInterval(resizeAnimation.timer);
			resizeAnimation.timer = null;
			resizeAnimation.duration -= (timeNow - resizeAnimation.startTime);
			resizeAnimation.positionFrom = resizeAnimation.positionNow;
		}
		else
		{
			resizeAnimation.duration = 250 * multiplier;
			resizeAnimation.positionFrom = startingSize;
		}
		
		isCollapsed = !isCollapsed;
		var resizeTo = isCollapsed ? 15 : (showLows ? 126 : 106);
		totalWidgetHeight = calculateBackgroundHeight();
		if (!isCollapsed && window.widget)
			window.resizeTo (calculateBackgroundWidth(), totalWidgetHeight);
	
		resizeAnimation.positionTo = parseInt(resizeTo); // lots of hard coding, yum...
		resizeAnimation.startTime = timeNow - 13; // set it back one frame.
		resizeAnimation.onfinished = animFinished;
		
		resizeAnimation.element.style.height = startingSize + "px";
		resizeAnimation.timer = setInterval ("animate();", 13);
		animate();
	}
}

var flipAnimation = {duration:0, starttime:0, to:1.0, now:0.0, from:0.0, element:null, timer:null};
var flipShown = false;

function flipAnimate()
{
	var T;
	var ease;
	var time = (new Date).getTime();
		
	
	T = limit_3(time-flipAnimation.starttime, 0, flipAnimation.duration);
	
	if (T >= flipAnimation.duration)
	{
		clearInterval (flipAnimation.timer);
		flipAnimation.timer = null;
		flipAnimation.now = flipAnimation.to;
	}
	else
	{
		ease = 0.5 - (0.5 * Math.cos(Math.PI * T / flipAnimation.duration));
		flipAnimation.now = computeNextFloat (flipAnimation.from, flipAnimation.to, ease);
	}
	
	flipAnimation.element.style.opacity = flipAnimation.now;
}

function mousemove (event)
{
	if (!flipShown)
	{
		// fade in the flip widget
		if (flipAnimation.timer != null)
		{
			clearInterval (flipAnimation.timer);
			flipAnimation.timer  = null;
		}
		
		var starttime = (new Date).getTime() - 13; // set it back one frame
		
		flipAnimation.duration = 500;
		flipAnimation.starttime = starttime;
		flipAnimation.element = document.getElementById ('flip');
		flipAnimation.timer = setInterval ("flipAnimate();", 13);
		flipAnimation.from = flipAnimation.now;
		flipAnimation.to = 1.0;
		flipAnimate();
		flipShown = true;
	}
}

function mouseexit (event)
{
	if (flipShown)
	{
		// fade in the flip widget
		if (flipAnimation.timer != null)
		{
			clearInterval (flipAnimation.timer);
			flipAnimation.timer  = null;
		}
		
		var starttime = (new Date).getTime() - 13; // set it back one frame
		
		flipAnimation.duration = 500;
		flipAnimation.starttime = starttime;
		flipAnimation.element = document.getElementById ('flip');
		flipAnimation.timer = setInterval ("flipAnimate();", 13);
		flipAnimation.from = flipAnimation.now;
		flipAnimation.to = 0.0;
		flipAnimate();
		flipShown = false;
	}
}

var validateTimerData = null;
var zipValidated = false;
function zipChanged()
{
	var newZip = document.getElementById('zip').value
	//if (zip != newZip)
	{
		// validate this entry
		validateWeatherLocation (newZip, validationCallback);
		// start the the validate timer
		var validate = document.getElementById('validate');
		validate.innerText = getLocalizedString('Validating');
		
		validateTimerData = {timer:setInterval('validateTimer();', 500), pos:3, forward:true};		
	}
}


function zipTyping (event)
{
	zipValidated = false;
}

function zipKeyPress (event)
{
	switch (event.keyCode)
	{
		case 13: // return
		case 3:  // enter
		case 9:  // tab
			if (!zipValidated)
			{
				zipChanged();
			}
			break;
	}
}


function validateTimer ()
{
	var validate = document.getElementById('validate');
	
	validate.style.display = "block";

	// position goes 0 <-> 3
	validateTimerData.pos += validateTimerData.forward ? 1 : -1;
	
	if (validateTimerData.pos > 3)
	{
		validateTimerData.forward = false;
		validateTimerData.pos = 2;
	}
	else if (validateTimerData.pos < 0)
	{
		validateTimerData.forward = true;
		validateTimerData.pos = 1;
	}
	
	var text = getLocalizedString('Validating');
	for (var i = 0; i < validateTimerData.pos; ++i)
		text+= '.';
	
	validate.innerText = text;
}

var validationObject = null;
function validationCallbackDelayed ()
{
	var menu = null;
	
	if (window.widget)
		menu = widget.createMenu();
	
	if (validationObject.error || validationObject.cities.length <= 0)
	{
		if (menu != null)
		{
			menu.addMenuItem (getLocalizedString("No cities found"));
			menu.setMenuItemEnabledAtIndex (0, false);	
		}
	}
	else
	{
		var c =  validationObject.cities.length;
		
		if (c == 1 || window.widget === undefined)
		{
			// just set the contents if their is only one city.
			var city = validationObject.cities[0];
			var zipinput = document.getElementById('zip');
			zipinput.value = city.name + ", " + city.state;
			zipinput.postal = city.zip;				

			menu = null;
		}
		else
		{
			for (var i = 0; i < c; ++i)
			{
				var city = validationObject.cities[i];
				menu.addMenuItem (city.name + ", " + city.state);
			}
			
			if (validationObject.refine)
			{
				menu.addMenuItem (getLocalizedString('Try a more specific search'));
				menu.setMenuItemEnabledAtIndex (c, false);
			}
		}
		
	}
	
	if (menu != null)
	{
		var selectedItem = menu.popup (leftOffset + 25, topOffset + 52);
		
		if (selectedItem >= 0)
		{
			var city = validationObject.cities[selectedItem];
			var zipinput = document.getElementById('zip');
			zipinput.value = city.name + ", " + city.state;
			zipinput.postal = city.zip;
			
			zipValidated = true;
		}
	}
	
	validationObject = null;
}

function validationCallback (object)
{
	if (validateTimerData != null)
	{
		clearInterval(validateTimerData.timer);
		validateTimerData = null;
		document.getElementById('validate').style.display="none";
	}
	
	if (!isShowingFront)
	{	
		// force a redraw before we present a menu, otherwise the 
		// validating text will not disappear.
		validationObject = object;
		setTimeout("validationCallbackDelayed();", 0);
	}
	else
	{
		// do nothing if we are not in the Dashboard.
	}
}

function validationCallbackFromURL (object)
{
	if (!object.error)
	{
		if (object.cities.length > 0)
		{
			// pick the first one
			var city = object.cities[0];
			var zipinput = document.getElementById('zip');
			zip = city.name + ", " + city.state;
			zipinput.value = zip;
			zipinput.postal = city.zip;	
			postal = city.zip;
			doLoad();
			
			widget.setPreferenceForKey (postal, createkey("postal"));
			widget.setPreferenceForKey (zip, createkey("zip"));
			
		}
	}
}


function lowChanged ()
{
	showLows = document.getElementById('6daylow').checked;

	if (window.widget)
	{
		if (showLows)
			widget.setPreferenceForKey(true, createkey("show-lows"));
		else
			widget.setPreferenceForKey (null, createkey("show-lows"));
	}

	if (!isCollapsed)
	{
		document.getElementById('middle').style.height = (showLows ? 126 : 106) + "px";
	}
}

function lowlabelclick (event)
{
	var element = document.getElementById('6daylow');
	
	element.checked = !element.checked;
	lowChanged();
}

function createkey(key)
{
	return widget.identifier + "-" + key;
}

// called before the page is loaded, get prefs, do localization, etc
function doPreloadSetup()
{
	var needsToResize = false;
	var hasCelciusPref = false;
		
	document.getElementById('lowtext').innerText = getLocalizedString('Include lows in 6-day forecast');
	document.getElementById('unitlabel').innerText = getLocalizedString('Degrees:');
	document.getElementById('ziplabel').innerText = getLocalizedString('City, State or ZIP Code:');
	populateTempUnits ();

	if (window.widget)
	{
		var pref = widget.preferenceForKey (createkey("show-lows"));
		
		// existence of preference means to show lows
		if (pref != null)
		{
			showLows = true;
			document.getElementById('6daylow').checked = true;
		}
		
		pref = widget.preferenceForKey(createkey("collapsed"));
		if (pref == "false")
		{
			needsToResize = true;
			isCollapsed = false;
		}
		else if (pref == "true")
		{
			needsToResize = true;
			isCollapsed = true;
		}
		
		if (!isCollapsed)
		{
			document.getElementById('middle').style.height = (showLows ? 126 : 106) + "px";
		}
		
		pref = widget.preferenceForKey(createkey("celcius"));
		if (pref == true)
		{
			isCelcius = true;
			document.getElementById('tempunits').options[1].selected = true;
		}
		else if (pref == null)
		{
			if (getLocalizedString ('UseCelcius') == '1')
			{
				isCelcius = true;
				document.getElementById('tempunits').options[1].selected = true;
			}
		}
	
		var newZip = undefined;
		if (widget.startupRequest)
		{
			newZip = widget.startupRequest['location'];
		}
		
		if (newZip === undefined)
		{
			pref = widget.preferenceForKey(createkey("zip"));
			if (pref != null)
			{
				document.getElementById('zip').value = pref;
				zip = pref;
			}
			else
			{
				var closestCity = widget.closestCity();
				
				if (closestCity)
				{
					// try to use it, it could easilty fail as the city
					// might not be in the vendors database.
					newZip = closestCity;
					document.getElementById('location').innerHTML = closestCity;
					location = closestCity;
					postal = closestCity;
					zip = closestCity;
				}
			}
			pref = widget.preferenceForKey(createkey("postal"));
			if (pref != null)
				postal = pref;
		}
		else
		{
			zip = newZip;
			postal = newZip;
			document.getElementById('zip').value = newZip;
			
			// now do a validation.
			if (widget.startupRequest && widget.startupRequest['validate'])
			{
				validateWeatherLocation (zip, validationCallbackFromURL);
			}
			else
			{
				// save the pref
				widget.setPreferenceForKey (postal, createkey("postal"));
				widget.setPreferenceForKey (zip, createkey("zip"));
			}
		}
		
		pref = widget.preferenceForKey(createkey("savedcity"));
		if (pref != null)
		{
			document.getElementById('location').innerHTML = pref;
			location = pref;
		}
	}
	
	totalWidgetHeight = calculateBackgroundHeight();
	
	document.getElementById('zip').value = zip;
	//document.getElementById('location').innerHTML = zip;
	
	createGenericButton(document.getElementById('done'), getLocalizedString('Done'), showfront);
	
	// last thing we do is resize
	if (needsToResize)
		window.resizeTo (calculateBackgroundWidth(), showLows ? 182 : 162);
}

function populateTempUnits()
{
	var select = document.getElementById ('tempunits');
	var element;
	
	element = document.createElement ("option");
	element.innerText = getLocalizedString("ºF");
	select.appendChild(element);
	element = document.createElement ("option");
	element.innerText = getLocalizedString("ºC");
	select.appendChild(element);
}

function unitsChanged (select)
{
	var isC = select.selectedIndex == 1;
	
	if (isC != isCelcius)
	{
		isCelcius = isC; 

		if (window.widget)
			widget.setPreferenceForKey(isCelcius ? true : null, createkey("celcius"));

		updateValuesUnitsChanged();
	}
}

if (window.widget)
{
	widget.onremove = onremove;
	widget.onhide = onhide;
	widget.onshow = onshow;
	widget.onreceiverequest = receiverequest;
}


function receiverequest (request)
{
	var location = request['location'];
	if (location)
	{
		if (isShowingFront)
		{
			if (request['validate'])
			{
				validateWeatherLocation (location, validationCallbackFromURL);
			}
			else
			{
				zip = location;
				postal = location;
				document.getElementById('zip').value = location;
				fetchData ();
				
				widget.setPreferenceForKey (postal, createkey("postal"));
				widget.setPreferenceForKey (zip, createkey("zip"));
			}
		}
		else
		{
			document.getElementById('zip').value = location;
			zipChanged();
		}
	}
}

function onremove ()
{
	if (window.widget)
	{
		widget.setPreferenceForKey (null, createkey("show-lows"));
		widget.setPreferenceForKey (null, createkey("collapsed"));
		widget.setPreferenceForKey (null, createkey("celcius"));
		widget.setPreferenceForKey (null, createkey("zip"));
		widget.setPreferenceForKey (null, createkey("postal"));
		widget.setPreferenceForKey (null, createkey("savedcity"));
	}
}

var everBeenCalled = false;
function specialFirstLoad ()
{
	doPreloadSetup();

	if (!everBeenCalled)
	{
		onshow();
		everBeenCalled = true;
	}
	
}

function onshow () {

	everBeenCalled = true;

	if (timer != null)
		clearInterval(timer);
	
	if (windAnimation.animating)
	{
		windAnimation.timer = setInterval ('windAnimate();', 30);
	}
	doLoad ();

}

function onhide () {
	if (timer != null) {
		// we were hidden clear the timer
		clearInterval(timer);
		timer = null;
	}
	
	if (windAnimation.animating)
	{
		clearInterval(windAnimation.timer);
		windAnimation.timer = null;
	}
}

function windAnimate ()
{
	windAnimation.current +=1;
	
	if (windAnimation.current > 59) windAnimation.current = 0;
	
	var src = "Images/Icons/wind0";
	
	if (windAnimation.current < 10)
		src += '0' + windAnimation.current;
	else
		src += windAnimation.current;
		
	src += '.png';
	
	windAnimation.img.src = src;
}

function goToAccuWeather(event)
{
	if (window.widget)
	{
		widget.openURL(createGoToURL(postal));
	}
}


function enterflip(event)
{
	document.getElementById('fliprollie').style.display = 'block';
}

function exitflip(event)
{
	document.getElementById('fliprollie').style.display = 'none';
}