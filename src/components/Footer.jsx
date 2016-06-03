var React = require('react');
var Config = require('./Config.js');
var SyncStatus = require('./SyncStatus.jsx');

var Footer = React.createClass({

  render: function() {
    return <footer>
        <a href="#" onClick={this.syncStatusHandler}>View Sync Status</a>
        &nbsp;&bull;&nbsp;
        <a href={Config.fullUrl} target="_blank"><strong>Visit Full Site</strong></a>
    </footer>;
  },

  syncStatusHandler: function(){
    var syncStatus = <SyncStatus app={this.props.app} />;
    this.props.app.setState({
        component: syncStatus
    });
  }

});

module.exports = Footer;