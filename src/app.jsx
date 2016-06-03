var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/App.jsx');
var Sendqueue = require('./components/Sendqueue.js');

ReactDOM.render(
  <App />, 
  document.getElementById('container')
);

setInterval(function(){
    Sendqueue.sendAll();
}, 60000); 

var hidden, visibilityChange; 
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.mozHidden !== "undefined") {
  hidden = "mozHidden";
  visibilityChange = "mozvisibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

function handleVisibilityChange() {
  if (document[hidden]) {
    // do nothing
  } else {
    Sendqueue.sendAll();
  }
}

document.addEventListener(visibilityChange, handleVisibilityChange, false);