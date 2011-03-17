/* Author:  Zak Caley - Rubber Pigeon Desing (http://www.rubberpigeon.com)
	for qnp 2011

*/
function hashjumpto() {
		$.scrollTo('#zep', 1200);
/*

	var hash;
	hash = document.location.hash;
	if (hash) {
		switch(hash) {
			default:
				$.scrollTo(hash, 1200);
				break;
		}
	} else { 
		$.scrollTo('#zep', 1200);
	}
*/
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
    else
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


    var canvas, context;

		var cg = {
			top: new Image(),
			bottom: new Image()
		};
		
		var nav = {
			img : new Image(),
			minx : -400,
			maxx : 0,
			curx : -400,
			y: -350,
			present: false,
			speed: 5,
			direction:0
		};

    var zeplin = {
    	img: new Image(),
			snake: new Image(),
			bandaid: new Image(),
			elephant: new Image(),
			drops: new Image(),
    	coord: [],
      speed: 0.0005
    };
    
    var clouds = {
    	img0 : new Image(),
    	img1 : new Image(),
    	img2 : new Image(),
      counter: Math.floor(Math.random() * 10)
    };
		
		var bottom = {x:'',y:''};

		var where = {x:'',y:''};
		var die = false;
		var link = false;
		var running = false;	
		var idle;

		var navy;	

    init();
    animate();

    function init() {
    	clouds.img0.src = 'img/cloud0.png';
      clouds.img1.src = 'img/cloud1.png';
      clouds.img2.src = 'img/cloud2.png';
				
			zeplin.img.src = 'img/zep.png';

			zeplin.snake.src = 'img/snake.png';
			zeplin.bandaid.src = 'img/bandaid.png';
			zeplin.elephant.src = 'img/elephant.png';
			zeplin.drops.src = 'img/drops.png';

			nav.img.src = 'img/left.png';
				
			cg.bottom.src = 'img/cg_background.gif';
			cg.top.src = 'img/cg_forground.gif';

      canvas = document.createElement('canvas');
      canvas.width = windowSize('width');
      canvas.height = windowSize('height') < 800 ? 800 : windowSize('height');
        
  		nav.y = canvas.height - 350;

			context = canvas.getContext('2d');

      $('#zepcanvas').append(canvas);
      
      $('#zepcanvas').mousemove(function(e){
				var offset = $('#zepcanvas canvas').offset();
				where.x = e.pageX - offset.left; 
  			where.y = e.pageY - offset.top;
  			nav.present = true;
  			clearTimeout(idle);
				if (!link) idle = setTimeout(function(){nav.present = false;clearTimeout(idle);}, 5000);
			}).click(function(){
/* 					link = link ? scrollTo(link) : false;		 */

			});
      
      for (var i = 0; i < clouds.counter; i++) {
	    	cloudGen(i);
	    }
	    running = true;
    }

    function cloudGen(i) {
 			var size = {};
    	var type = Math.floor(Math.random() * 3);
      var cloudsize = Math.floor(Math.random() * 200) + 100;
										
			switch (type) {
      	case 0:
        	size.x = Math.floor(cloudsize / (382 / 648));
          size.y = cloudsize;
          break;
        case 1:
        	size.x = Math.floor(cloudsize / (367 / 698));
          size.y = cloudsize;
          break;
        case 2:
        	size.x = Math.floor(cloudsize / (300 / 548));
          size.y = cloudsize;
          break;
        }
        clouds[i] = {
        	from: {
						x: running ? canvas.width  : Math.floor(Math.random() * canvas.width-20),
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
/*         debug(clouds[i]); */
    }
		

    function animate() {
        if(!die){logic();}
        draw();
        requestAnimFrame(animate);
    }

    function logic() {
				var relatedToNavY = -nav.y + where.y;
				var relatedToNavX = nav.curx + where.x;
    		if (relatedToNavX >= 160 && relatedToNavX <= 250 && relatedToNavY  > 69  && relatedToNavY < 125) {
					link = 'blog';	
				} else if (relatedToNavX >= 267 && relatedToNavX <= 380 && relatedToNavY  > 148  && relatedToNavY < 200) {
					link = "draw";
				} else if (relatedToNavX >= 161 && relatedToNavX <= 240 && relatedToNavY  > 148  && relatedToNavY < 250) {
					link = "lab";
				} else if (relatedToNavX >= 281 && relatedToNavX <= 380 && relatedToNavY  > 59  && relatedToNavY < 240) {
					link = "photo";
				} else if (relatedToNavX >= 13 && relatedToNavX <= 113 && relatedToNavY  > 127  && relatedToNavY < 327) {
					link = "contact";
				} else {
					link = false;
				}
				if(link){clearTimeout(idle)};
        var zeptime = new Date().getTime() * zeplin.speed;
        zeplin.coord.x = Math.sin(zeptime) * 32 + 64;
        zeplin.coord.y = Math.cos(zeptime * 0.9) * 32 + 64;

        for (var i = 0; i < clouds.counter; i++) {
            if (clouds[i].from.x <= -clouds[i].size.x ) {
            	cloudGen(i);
						} else {
         	   clouds[i].from.x -=  1 / clouds[i].speed;
            }
        };
        
        var navtime = new Date().getTime() * nav.speed;

        if (nav.present) {
         	if (nav.curx <= -30) {
         	 		nav.curx = -Math.abs(Math.cos(90-nav.direction) * 400);
 							nav.direction += 0.1;
 						} else {
							nav.curx = nav.maxx;
 							nav.direction = 0;
 						}
 				 	} else {
 						if (nav.curx <= nav.minx) {
 							nav.curx = nav.minx;
 							nav.direction = 0;
 						} else {
 							nav.curx = -Math.abs(Math.sin(nav.direction) * 430);
 							nav.direction -= 0.1;
 						};
 					};
 				
    }


    function draw() {
        clearCanvas(context, canvas);
        
        try{
        	context.drawImage(cg.bottom, canvas.width-500, 0);
        }catch(err){}

        for (var i = 0; i < clouds.counter; i++) {
            if (clouds[i].z < 10) cloudRender(clouds[i]);
        }
				
        try{
     			context.drawImage(zeplin.img, zeplin.coord.x, zeplin.coord.y);
      		switch (link) {
        		case "blog":
		        	context.drawImage(zeplin.snake, zeplin.coord.x+263, zeplin.coord.y+354);
        			break;
        		case "photo":
     		  		context.drawImage(zeplin.drops, zeplin.coord.x+47, zeplin.coord.y+322);
        			break;
        		case "draw":
        			context.drawImage(zeplin.elephant, zeplin.coord.x-32, zeplin.coord.y+178);
        			break;
        		case "lab":
        			context.drawImage(zeplin.bandaid, zeplin.coord.x+404, zeplin.coord.y+192);
        			break;
        	}
        }catch(err){}


        for (var i = 0; i < clouds.counter; i++) {
            if (clouds[i].z >= 10) cloudRender(clouds[i]);
        }
        
        try{
        	context.drawImage(cg.top, canvas.width-500, 0);
 					context.drawImage(nav.img, nav.curx, nav.y);

 				}catch(err){}
        
        function cloudRender(cloud) {
        	try{
            switch (cloud.type) {
            case 0:
                context.drawImage(clouds.img0, cloud.from.x, cloud.from.y, cloud.size.x, cloud.size.y);
                break;
            case 1:
                context.drawImage(cloud.img1, cloud.from.x, cloud.from.y, cloud.size.x, cloud.size.y);
                break;
            case 2:
                context.drawImage(cloud.img2, cloud.from.x, cloud.from.y, cloud.size.x, cloud.size.y);
                break;
            }
        	}catch(err){}
        }
								
								//hover states for zep =|
/*
				context.fillStyle = "rgba(200,0,0,0.5)"
				context.fillRect (where.x, where.y, 100, 50); 
*/
/* 				$('debug').html('zeplin ['+ Math.floor(zeplin.coord.x ) +','+ Math.floor(zeplin.coord.y) +'] mouse['+where.x+','+where.y+']'); */
/*
				fromright = canvas.width - where.x;
				frombottom = canvas.height - where.y;
				fromnav = -nav.y + where.y;
				$('debug').html(' ::DEBUG:: Cloud Count['+clouds.counter+'] mouse[' + where.x + ',' + where.y + '] bottom['+frombottom+'] from nav['+ fromnav +']');
*/
/* 				$('debug').html(' ::DEBUG: Nav Out['+nav.present+'] curx['+nav.curx+']'); */
    }

    function clearCanvas(context, canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
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
    animation();
/*     hashjumpto(); */
/* 		$.scrollTo('#zep', 1200); */

});