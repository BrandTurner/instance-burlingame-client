// NOTE: This component is not currently in use!!!!

var React = require('react');
var jQuery = require('jquery');
var $ = jQuery;
var StateManager = require('./Statemanager.js');
var ConstructionSitesList = require('./ConstructionSitesList.jsx');

var MainMenu = React.createClass({

  render: function() {
    return <nav>
        <h2>[Menu]</h2>
        <ul>
            <li onClick={this.constructionSitesListHandler}>Construction Sites</li>
        </ul>
    </nav>;
  },

  constructionSitesListHandler: function(){
    var constructionSitesList = <ConstructionSitesList app={this.props.app} />;
    this.props.app.setState({
        component: constructionSitesList
    });
  }

});

module.exports = MainMenu;