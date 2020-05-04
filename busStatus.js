var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var colors = require('colors');
var _ = require('lodash');
var Blink1 = require('node-blink1');
var blink1;
var moment = require('moment');

var config = require('./config');
var pollIntervall = 120000;

try {
  blink1 = new Blink1();
} catch (err) {
  if (err.message === 'No blink(1)\'s could be found') {
    blink1 = require('./fake-blink1');
  } else {
    throw err;
  }
}


function checkInternet(cb) {
    require('dns').lookup('google.com',function(err) {
        if (err && err.code == "ENOTFOUND") {
            cb(false);
        } else {
            cb(true);
        }
    })
}

// example usage:
checkInternet(function(isConnected) {
    if (isConnected) {
		 console.log("Connected!");
         blink1.fadeToRGB(2000, 0, 255, 0);
    } else {
		 console.log("Not Connected!");
         blink1.fadeToRGB(5000, 255, 76, 19);
    }
});

function checkTimeTable() {
	
	checkInternet();
	setInterval(checkTimeTable,1500);
}




function blinkPing() {
	blink1.fadeToRGB(100, 255, 0, 255, function(){
		blink1.fadeToRGB(100, 0, 0, 0, function(){
			blink1.off();
		});
	});
}



function blinkTheBlink(timeToNextBus) {
  console.log(timeToNextBus.toString().yellow);
  if (timeToNextBus < 10.0) {
    pollIntervall = 60 * 1000;
    if (timeToNextBus > 8) {
      blink1.fadeToRGB(2000, 0, 255, 0);
    } else if (timeToNextBus > 5) {
      pollIntervall = 45 * 1000;
      blink1.fadeToRGB(5000, 69, 255, 0);
    } else if (timeToNextBus > 3) {
      pollIntervall = 20 * 1000;
      blink1.fadeToRGB(5000, 240, 230, 140);
    } else if (timeToNextBus > 1) {
      pollIntervall = 15 * 1000;
      blink1.fadeToRGB(5000, 255, 76, 19);
    } else if (timeToNextBus > 0) {
      pollIntervall = 5 * 1000;
      blink1.writePatternLine(200, 255, 0, 0, 0);
      blink1.writePatternLine(200, 0, 0, 0, 1);
      blink1.play(0);
    } else {
      blink1.fadeToRGB(7000, 0, 0, 0);
    }
  } else {
    pollIntervall = 2 * 60 * 1000;
    blink1.fadeToRGB(1000, 0, 255, 0, function() {
      blink1.fadeToRGB(1000, 0, 0, 0, function() {
        blink1.off();
      });
    });
  }
}


checkTimeTable();
