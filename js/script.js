/* Author:  Zak Caley - Rubber Pigeon Desing (http://www.rubberpigeon.com)
	for qnp 2011
*/
var current, launch, launched, landed, 	running = false;

function hashjumpto(link) {
	var hash = link ? link : '#zep';
	switch(hash) {
		case '#balloons':
		case '#contact':
			$(window).scrollTo('#zep', 1200);
			// this needs an overlay for the contact not a slide too
			break;
		case '#blog':
		case '#draw':
			$.scrollTo('#building', 1200);
			// change blog to draw content
			break;
		case '#lab':
			// need to fire a comand to launch rocket and flow it, it has 1200ms to fly.
			$.scrollTo('#lab', 2700, {queue:true, axis:'y'});
			launch = true;
			launched = false;
			landed = false;
			setTimeout(function(){launched = true;}, 1000);
			setTimeout(function(){launch = false;}, 2500);
			setTimeout(function(){landed = true;}, 4000)
			
		default:
			 $(window).scrollTo(hash, 1200);
			break;
	}
	link = hash.replace('#', '');
	setTimeout(function(){current = link}, 1000);
};
	
function windowSize(check) {
    var winWidth = 0,
        winHeight = 0;
    if (typeof(window.innerWidth) == 'number') {
        //Non-IE
        winWidth = window.innerWidth;
        winHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        winWidth = document.documentElement.clientWidth;
        winHeight = document.documentElement.clientHeight;
    };
    if (check == 'width') return winWidth;
    if (check == 'height') return winHeight;
    return [winWidth, winHeight];
};

function animation() {
    // requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function () {
    	return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
	var fps = 0, now, lastUpdate = (new Date)*1 - 1,
	// The higher this value, the less the FPS will be affected by quick changes
	// Setting this to 1 will show you the FPS of the last sampled frame only
	fpsFilter = 5,

    canvas, context, 
    cg = {
		top: new Image(),
		bottom: new Image()
	},
	
	nav = {
		img : new Image(),
		minx : -400,
		maxx : 0,
		curx : -400,
		y: -350,
		present: false,
		speed: 5,
		direction:0,
	},
        	
    zeplin = {
    	img: new Image(),
		snake: new Image(),
		bandaid: new Image(),
		elephant: new Image(),
		drops: new Image(),
    	coord: [],
      	speed: 0.0005
    },
    
	balloons = {
		color : {
	    	img: new Image(),
	    	coord: [],
	      	speed: 0.0003
    	},
    	black : {
	    	img: new Image(),
	    	coord: [],
	      	speed: -0.0004
    	},
	},
    
    links = [    
		{
			x : 160, xx : 250,
			y: 69, yy : 125,
			name :'blog',
		},{
			x: 267, xx: 380,
			y: 148, yy: 200,
			name : 'draw',
		},{
			x : 161, xx : 240, 
			y : 148, yy :250,
			name : 'lab',
		},{
			x: 281,	xx: 380,
			y: 59, yy: 148,
			name : 'photo',
		},{
			x: 20, xx:100,
			y: 166, yy: 281,
			name: 'contact',
		}
	],
    
    clouds = {
    	img0 : new Image(),
    	img1 : new Image(),
    	img2 : new Image(),
    	counter: Math.floor(Math.random() * 10+10)
    },
    starfield = {
    	img : new Image(),
    	counter : Math.floor(Math.random() * 200)
    },      
    lab = {
    	station : {
    		img : new Image(),
    		coord : [],
    		speed : 0.0005,
    	},
    	rocket : {
    		img: new Image(),
    		speed : 0.001,
    		coord : [],
    		vapor : { // not implamented
    			img: new Image(),
    			speed: 0.001,
    			cord: [],
    		},
    	},

    },
	scrollOffset = {
		canvasOffset : $('#zephome').offset()
  	},
    
	bottom = {x:'',y:''},
	where = {x:'',y:''},
	die = false,
	link = false,
	idle, navy;
	
    init();
    animate();

    function init() {
    	clouds.img0.src = 'img/cloud0.png';
      	clouds.img1.src = 'img/cloud1.png';
      	clouds.img2.src = 'img/cloud2.png';

		starfield.img.src =  'img/star.png';

		zeplin.img.src = 'img/zep.png';
		zeplin.snake.src = 'img/snake.png';
		zeplin.bandaid.src = 'img/bandaid.png';
		zeplin.elephant.src = 'img/elephant.png';
		zeplin.drops.src = 'img/drops.png';

		nav.img.src = 'img/left.png';

		cg.bottom.src = 'img/cg_background.gif';
		cg.top.src = 'img/cg_forground.gif';

		lab.station.img.src = 'img/spaceship3.png';
		lab.station.img.src = 'img/qlab.png';

		lab.rocket.img.src =  'img/rocket_rocket.png';
		balloons.black.img.src = "img/elephant.black.png";
		balloons.color.img.src = "img/elephant.color.png";

		//home canvas
      	canvas = document.createElement('canvas');
      	canvas.width = windowSize('width');
      	canvas.height = windowSize('height') < 800 ? 800 : windowSize('height');
     	context = canvas.getContext('2d');
   
   		//canvas nav
        nav.canvas = document.createElement('canvas');
		nav.canvas.width = 470;
  		nav.canvas.height = windowSize('height');
  		nav.context = nav.canvas.getContext('2d');
  		
  		//lab coords
 		lab.rocket.coord = [ , 0, canvas.height]; //offset not set, x & y
 		lab.station.coord = [canvas.width - 600, 10, 10]; //offsetx, x & y

		var fpsOut = document.getElementById('fps');
		setInterval(function(){
		  fpsOut.innerHTML = fps.toFixed(1) + "fps";
		}, 1000);
		
      	$('#zepcanvas').append(canvas).append(lab.canvas);
      	
      	$('#container').append(nav.canvas)
      		.mousemove(function(e){
			where.x = e.clientX // e.pageX - offset.left; 
  			where.y = e.clientY // e.pageY - offset.top;
//  			$('debug4').html(where.x + ' '+where.y);
  			if (current == 'zep')
  				nav.present = true;
  			clearTimeout(idle);
			if (!link) 
				idle = setTimeout(function(){
							nav.present = false;
							clearTimeout(idle);
					   }, 1000);
		})
			.click(function(){
			if (link && link != 'nav') {
		 		nav.present = false;
		  		$('body').css('cursor', 'default');
				hashjumpto('#'+link);
			} else if (link == 'nav'){
				nav.present = true;
			}
		});
      
      	for (var i = 0; i < clouds.counter; i++) {
	    	cloudGen(i);
	    }
	    starGen();		
		function starGen() {
			for (var z = 0; z <= starfield.counter; z++) {
				starfield[z] =  [Math.floor(Math.random() * 17), Math.floor(Math.random() * canvas.width * 2), Math.floor(Math.random() * canvas.height)];
			}
		}
	};
	
    function animate() {
		changeAnimation();
        if(!die) {     	    			
        	logic();
        	draw();
        };
       	running = true;
        requestAnimFrame(animate);
     
    };
	function changeAnimation() {
		scrollOffset.y = - $(window).scrollTop() + scrollOffset.canvasOffset.top;
		scrollOffset.x = - $(window).scrollLeft() + scrollOffset.canvasOffset.left;
		$('debug').html(Math.floor(scrollOffset.x) + ',' + scrollOffset.y);
		// checks links[] to determine if the user is currently within the required section to activate section
	    var section = [    
			{
				x : canvas.width, xx : canvas.width * 2,
				y: canvas.height, yy : canvas.height * 2,
				name :'loading',
			},{
				x: -canvas.width, xx: canvas.width,
				y: canvas.height, yy: canvas.height*3,
				name : 'lab',
			},{
				x : -canvas.width, xx : 100, 
				y : -canvas.height*2, yy : canvas.width/2,
				name : 'zep',
			},{
				x : canvas.width/5, xx : canvas.width, 
				y : -canvas.height, yy : canvas.width/2,
				name : 'balloons',
			}
		];
		
		if (launch) { return false; }
		for (var i = 0;i <section.length; i++) {
			current = checkNav(section[i]['x'], section[i]['xx'], section[i]['y'], section[i]['yy'], section[i]['name'], scrollOffset.x, scrollOffset.y)
			if(current) {
				return false;
		}}
		return true;
		
		function checkNav(x,xx,y,yy, section, fx, fy) {
			if ( fx >= x && fx <= xx && fy  > y  && fy < yy) {
				return section;
			}
		}
	};
	function cloudGen(i) {
		var size = {},
    	type = Math.floor(Math.random() * 3),
      	cloudsize = Math.floor(Math.random() * 200) + 100;

		switch (type) {
      		case 0:
        		size.x = Math.floor(cloudsize / (382 / 648));
          	break;
        	case 1:
        		size.x = Math.floor(cloudsize / (367 / 698));
          	break;
       	 	case 2:
        		size.x = Math.floor(cloudsize / (300 / 548));
          	break;
        }
        size.y = cloudsize;

        clouds[i] = {
        	from: {
				x: running ? canvas.width  : Math.floor(Math.random() * canvas.width - 20),
				y: canvas.height < 550 ? Math.floor(Math.random() * canvas.height) : Math.floor(Math.random() * 550)
          },
          size: {
          	x: size.x,
            y: size.y
          },
          speed: Math.random() * 1,
          type: type,
          z: Math.floor(Math.random() * 20) + 1
        };
        
   };

    function logic() {
    	//scroll.offset.yold = scrollOffset.y; scrollOffset.xold = scrollOffset.xold;
    	scrollOffset.y = - $(window).scrollTop() + scrollOffset.canvasOffset.top + 50;
		scrollOffset.x = - $(window).scrollLeft() + scrollOffset.canvasOffset.left;
	    $('debug').html('[]:'+ canvas.width + 'x' + canvas.height + '  o: ' + Math.floor(scrollOffset.x) + ',' + scrollOffset.y);	
    	
		switch (current) {
    		case "lab" :
    			stars(starfield);
	        	flySine(lab.station);
    			if (landed) { 
			  		lab.rocket.coord = [ , 0, canvas.height];
	        	} else if (launch) {
	        		flyLiner(lab.rocket);	
	        	} 
    		break;
    		case "blog" :
    		break;
    		case "balloons" :
    			fly(balloons.black)
    			fly(balloons.color)
    			weather(clouds);
			break;
    		case "contact":
    		case "zep":
    		    if(launch) 
    		   		flyLiner(lab.rocket);
    			fly(zeplin);
    			weather(clouds);
    		break;
    		default :
    		break;

    	}
    	if (canvas.height > 800) navigation();
    	return;
    	
    	function navigation() {
			var relatedToNavY = -(nav.canvas.height+nav.y) + where.y,
				relatedToNavX = nav.curx + where.x;
			
			link = checkNav(-400, -330, 49, 184, 'nav', relatedToNavX, relatedToNavY)
			$('body').css('cursor', link == 'nav' ? 'pointer' : 'default');
			
	    	if (nav.present) {
	        	// checks links[] to determine if the mouse is currently within the required section to activate a button
	      		for (var i = 0;i <links.length; i++) {
	        		link = checkNav(links[i]['x'], links[i]['xx'], links[i]['y'], links[i]['yy'], links[i]['name'], relatedToNavX, relatedToNavY)
	        		if(link) {
	        			//clearTimeout(idle);
	        			$('body').css('cursor', 'pointer');
	        			return;
	        		} else { 
	         			$('body').css('cursor', 'default');
	        		}
	        	}
	        	
	        	//draws nav
	         	if (nav.curx <= -30) {
	         		nav.curx = -Math.abs(Math.cos(90-nav.direction) * 400);
	 				nav.direction += 0.1;
	 				nav.closing = false;
	 			} else {
					nav.curx = nav.maxx;
	 				nav.direction = 0;
	 			}
	 		} else {
	 			if (nav.curx <= nav.minx) {
	 				nav.curx = nav.minx;
	 				nav.direction = 0;
	 				nav.closing = true;
	 			} else {
	 				nav.curx = -Math.abs(Math.sin(nav.direction) * 430);
	 				nav.direction -= 0.1;
	 				nav.closing = false;
	 			};
	 		};
    	
	    	function checkNav(x,xx,y,yy, link, fx, fy) {
				if ( fx >= x && fx <= xx && fy  > y  && fy < yy) {
					return link;
				}
			}	
    	}
        function stars(object) {
        	for (var i = 0; i < object.counter; i++)	{
        		object[i][1] > canvas.width*2 ? Math.floor(Math.random() * canvas.width) : object[i][1]; 
        		object[i][2] > canvas.height ? Math.floor(Math.random() * canvas.height): object[i][2];
        		return object;
        	}
        }
        function flySine(object) {
	        var time = new Date().getTime() * object.speed;
	        object.coord[1] = Math.sin(time) * 5 + 100;
	        object.coord[2] = Math.cos(time * 0.9) * 32 + 5;
	        return object;
        };       
        function flyLiner(object){
        	 var heightoffset = scrollOffset.y < -canvas.height ? (canvas.height > 1000 ? 7 : 10) : (canvas.height > 600 ? 15 : 30);
        	 object.coord[1] +=  1; 
        	 object.coord[2] -=  canvas.height / heightoffset ;
        	 return object;
        }
        function flySqroot(object) {
			 object.coord[1] += 20;
			 object.coord[2] -= 20;
        	return object;
        };       
        function fly(object) {
        	var distance = 32;
        	if (canvas.width > 1000) 
        		distance += (canvas.width - 1000)/100
	        var time = new Date().getTime() * object.speed;
	        object.coord.x = Math.sin(time) * 32 + distance;
	        object.coord.y = Math.cos(time * 0.9) * 32 + distance;
	      	return object;
	    };
	    function vapor(object){
	        //clouds moving along screen
	        for (var i = 0; i < object.length; i++) {
	        	object[i].from.x -=  1 / object[i].speed;
	        };
	        return object;
	    }    
		function weather(clouds) {
	        //clouds moving along screen
	       	$('debug1').html('clouds: '+clouds.counter);
	        for (var i = 0; i < clouds.counter; i++) {
	        	clouds[i].from.x <= -clouds[i].size.x-scrollOffset.x ? cloudGen(i) : clouds[i].from.x -=  1 / clouds[i].speed;
	        };
		};
   };

    function draw() {    
    	clearCanvas(context, canvas, 'auto', canvas.height);
    	switch (current) {
    		case "lab" :
    			space();
    			break;
    		case "blog" :
    		break;
    		case 'balloons':
    			elephants();
    		break;
     		case "contact":
     		case "zep" :
				if(launch)
    				rocketDraw();
     		default :
    			home(link);
    	}

    	if (!nav.closing && canvas.height > 800) {
    		try{ //always draw navigation canvas
  		    	clearCanvas(nav.context, nav.canvas, nav.canvas.width, 'auto');
				nav.context.drawImage(nav.img, nav.curx, nav.canvas.height+nav.y);
			}catch(err){}
       	}
       	
   	  var thisFrameFPS = 1000 / ((now=new Date) - lastUpdate);
	  fps += (thisFrameFPS - fps) / fpsFilter;
	  lastUpdate = now;
       	
       	return;
       	
       	function space() {
       		scrollOffset.y += -canvas.height - 611; 
       		stars();
       		//draw spaceship fly across screen in a sine pattern
       		 if(!launch) {
				stationDraw();
	        } else {
		        rocketDraw();
		        stationDraw()		       	
	        }
	        if (landed && launch) { 
				stationDraw();
		        rocketDraw();		       	
	        }
       		
       	};
       	function stationDraw() {
       		scrollOffset.x += canvas.width;
       		var station = lab.station;
    	   	try{
	    	   	context.drawImage(station.img, station.coord[1]+station.coord[0]+scrollOffset.x, station.coord[2]+scrollOffset.y);
	        }catch(err){}
       	}
       	function rocketDraw() {
       		var rocket = lab.rocket;
    	   	try{
	    	   	context.drawImage(rocket.img, rocket.coord[1], rocket.coord[2]);
	       	}catch(err){}
       	}
       	function stars() {
       		for (var i = 0; i < starfield.counter; i++) {
	            star = starfield[i];
	            try{
					context.drawImage(starfield.img, star[1]+scrollOffset.x, star[2]+scrollOffset.y, star[0], star[0]);
          		}catch(err){}
	        }
       	}
       	function elephants() {
       		cloudRender(0);
       		drawBalloons(balloons.black, -300 - canvas.width/2, 5);
       		cloudRender(3);
	        drawBalloons(balloons.color, +50 - canvas.width/2, 5);
	        cloudRender(9);

	        drawAction(zeplin.img, 0, 0);
	      	cloudRender(10);
	      	
	      	function drawBalloons(action, x, y) {
				try{
					context.drawImage(action.img, action.coord.x+x+scrollOffset.x, action.coord.y+y+scrollOffset.y);	
				}catch(err){};
	        };
       	}
       	
        function home(link) {
	        try{
	        	if (canvas.width > 1400)
	        	context.drawImage(cg.bottom, canvas.width - canvas.width/4 + scrollOffset.x , scrollOffset.y-300);
	        }catch(err){}
	
			cloudRender(0);
		   	drawAction(zeplin.img, 0, 0);
		    switch (link) {
		     	case "blog":
	      			drawAction(zeplin.snake, 263, 354);
		       		break;
		        case "photo":
		       		drawAction(zeplin.photo, 47, 322);
	        		break;
	        	case "draw":
	        		drawAction(zeplin.elephat, 32, 178);
	       			break;
	       		case "lab":
	       			drawAction(zeplin.bandaid, 404, 192);
	      			break;
	       	}

			cloudRender(10);
	        
	        try{	        	
	        	if (canvas.width > 1400) 
	        		context.drawImage(cg.top, canvas.width - canvas.width/4 +scrollOffset.x, scrollOffset.y-300);
			}catch(err){};
	    }     
	    function drawAction(action, x, y) {	        
	    	try{
				context.drawImage(action, zeplin.coord.x+x+scrollOffset.x, zeplin.coord.y+y+scrollOffset.y);
	    	}catch(err){};
        };  
        function cloudRender(x) {
       	  	for (var i = 0; i < clouds.counter; i++) {
	            if (clouds[i].z >= x) {
	            	cloud = clouds[i];
	            	cloudImg = 'img'+cloud.type;
	            	try{
						context.drawImage(clouds[cloudImg], cloud.from.x+scrollOffset.x, cloud.from.y+scrollOffset.y, cloud.size.x, cloud.size.y);
          			}catch(err){}
	   	       	 }
	        }
        }
    }

    function clearCanvas(context, canvas, width, height ) {
        // context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = width == 'auto' ? windowSize('width') : canvas.width;
        canvas.height =  height == 'auto' ? windowSize('height') : canvas.height;
        var w = canvas.width;
        canvas.width = 1;
        canvas.width = w;
    }
};

function debug($obj) {
	if (window.console && window.console.log) 
  	window.console.log($obj); 
};

$(document).ready(function () {
	$('#zephome').css('height','1428');//windowSize('height'));
    animation();
    hashjumpto(document.location.hash);
    
    $('ul.primary-links li a').click(function(){
    	hashjumpto('#'+$(this).attr('rel'));
    	return false;
    });
    
});