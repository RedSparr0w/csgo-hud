var gui = require('nw.gui'); 
var http = require('http');
var dev = false;

// Get the current window

var win = gui.Window.get();
win.width=screen.width;
win.height=screen.height;
win.setAlwaysOnTop(true);

console.log("\thttps://github.com/RedSparr0w/csgo-hud");

server = http.createServer(function(req, res) {

	if (req.method == 'POST') {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});

		var body='';
		req.on('data', function(data) {
			body += data;
		});
		req.on('end', function() {
			if(dev == true){console.log("POST payload: " + body);}
			update(JSON.parse(body));
			res.end('');
		});

	} else {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});
		res.end("Nothing to see here!");
	}

});

var map;
var player;

var round = {
	phase: "",
	timestart: 0,
	time: 0,
	maxTime: 0,
	bomb: {
		planted: false,
		timestart: 0,
		time: 0,
		maxTime: 40
	}
};

function update(json) {
	if (json.player.activity!="playing" || json.round.phase=="warmup"){
		$("#player-container").css("bottom","-100px");
		$("#ammo-container").css("bottom","-100px");
	} else {
		$("#player-container").css("bottom","0px"); 
		$("#ammo-container").css("bottom","0px");
	}
	if (json.round) {
		if (!(round.phase === json.round.phase)) {
			round.timestart = json.provider.timestamp;
			round.phase = json.round.phase;
		}
		
		var maxTime = 0;
		if (json.round.phase === 'live') {
			maxTime = 115;
		} else if (round.phase === 'freezetime') {
			maxTime = 15;
		} else if (round.phase === 'warmup') {
			maxTime = 300;
		} else {
			maxTime = 7;
		}
		round.time = maxTime - (new Date().getTime() / 1000 - round.timestart);
		round.maxTime = maxTime;

		if (!round.bomb.planted && json.round.bomb === 'planted') {
			round.bomb.planted = true;
			round.bomb.timestart = json.provider.timestamp;
		} else if (round.bomb.planted && json.round.bomb !== 'planted') {
			round.bomb.planted = false;
		}

		if (round.bomb.planted) {
			round.bomb.time = 40 - (new Date().getTime() / 1000 - round.bomb.timestart);
		}

		json.extra = {};
		json.extra.round = round;
	}
	updatePage(JSON.stringify(json));
}

function updatePage(data) {
	json = JSON.parse(data);
	if (typeof json.extra == "undefined") return;
	roundtime = json.extra.round.timestart;
	bombtime = json.extra.round.bomb.timestart;
	/* HEALTH */
	var health = json.player.state.health;
	var healthColor;
	if (health <= 15) {healthColor="#e74c3c";}else if (health <= 50) {healthColor="#f39c12";} else{healthColor="#2ecc71";}
	$("#health-text").html(health);
	$("#health").css("color",healthColor);
	$("#health .level").css("left","-"+(100-health)+"%").css("background-color",healthColor);
	/* ARMOR */
	var armor = json.player.state.armor;
	var armorColor;
	!json.player.state.helmet ? $("#armor .fa-stack").html('<i class="fa fa-shield  fa-stack-2x"></i>') : $("#armor .fa-stack").html('<i class="fa fa-shield  fa-stack-2x"></i><i class="fa fa-plus fa-stack-1x"></i>') ;
	if (armor == 0) {armorColor="rgba(0,0,0,0.65)";}else if (armor <= 15) {armorColor="#e74c3c";} else{armorColor="#3498db";}
	$("#armor-text").html(armor);
	$("#armor").css("color",armorColor);
	$("#armor .level").css("left","-"+(100-armor)+"%").css("background-color",armorColor);
	/* AMMO */
	for (var key in json.player.weapons) {
        var weapon = json.player.weapons[key];
		if (weapon.state=="active" || weapon.state=="reloading") {
			if (weapon.type=="Grenade" || weapon.type=="C4" || weapon.type=="Knife" || health == 0) {
				$(".clip").html("");
				$(".reserve").html("");
				return;
			}
            $(".clip").html(weapon.ammo_clip+"/");
            $(".reserve").html(weapon.ammo_reserve);
			return;
        }
    }
	if(!tickinterval) {
		tickinterval = setInterval(tick, 300);
	}

}

server.listen(1337);

var json;

var tickinterval;

var roundtime = 0;
var bombtime = 0;

var flashing = false;

function tick() {

	var btime = json.extra.round.bomb.maxTime - parseInt(new Date().getTime() / 1000 - bombtime);
	var rtime = json.extra.round.maxTime - parseInt(new Date().getTime() / 1000 - roundtime);

	if (json.extra.round.bomb.planted) {
		$(".time").html(btime);
		$(".timelabel").html("Bomb Planted");

		if (btime < 0) {
			flashing = false;
		} else if (btime <= 5) {
			flash();
		} else if (btime <= 10) {
			$("#timer").css('color', "#e74c3c");
		} else {
			$("#timer").css('color', '#f39c12');
		}
	} else {
		$(".timelabel").html("");
		$(".time").html("");
		
		win.setAlwaysOnTop(true);
		var min = 0;
		var sec = 0;

		if (rtime > 59) {
			min = 1;
			sec = rtime - 59;
		} else {
			sec = rtime;
		}
		sec < 10 ? pre_sec = "0" : pre_sec = "";
		$(".time").css("font-size", "7em");

		if (json.round.phase === 'warmup') {
			$(".timelabel").html("Warmup");
		} else if (json.round.phase === 'freezetime') {
			$(".timelabel").html("Freeze Time");
		} else if (json.round.phase === 'live') {
			$(".timelabel").html("Round Time");
		} else if (json.round.phase === 'over') {
			$(".timelabel").html("Round Over");
		}

		$(".time").html(min > 0 ? min + ":" + pre_sec + sec : sec);
		$("#timer").css('color', 'lightblue');
		
	}
}

function flash() {
	$("#timer").css('color', function() {
		this.switch = !this.switch;
		return this.switch ? "#e74c3c" : "#f39c12";
	});
}
