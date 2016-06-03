var React = require('react');
var jQuery = require('jquery');
var Config = require('./Config.js');
var $ = jQuery;
var StateManager = require('./Statemanager.js');
var ConstructionSite = require('./ConstructionSite.jsx');

var ConstructionSitesList = React.createClass({

  getInitialState: function(){
    return {
        constructionLocations: StateManager.get(this, 'constructionLocations',
                    Config.apiUrl+'/construction/locations'),
        constructionLocationOversightInspection: StateManager.get(this, 'constructionLocationOversightInspection',
                    Config.apiUrl+'/construction/locations/oversight-inspection')
    };
  },

  render: function() {
    if(this.state.constructionLocations){
      if(this.state.constructionLocations.type !== null){
        return this.renderConstructionSiteList();
      }else{
        return this.renderNoData();
      }
    }else{
      return this.renderLoading();
    }
  },

  renderConstructionSiteList: function() {
    var self = this,
        makeCallbackFor = function(location){
            return function(){
                return self.constructionSiteHandler(location);
            }
        }

    var list = $.map(this.state.constructionLocations.data, function(location){
        return <li><a href="#" onClick={makeCallbackFor(location)}>{ location.name }</a></li>;
    });

    return <nav>
        <h2>Construction Sites</h2>
        <ul>{ list }</ul>
    </nav>;
  },

  renderLoading: function() {
    return <div>
        <div className={("loader")}>Loading...</div>
      </div>;
  },

  renderNoData: function() {
    return <div>
        Not connected and no data cached.
      </div>;
  },

  constructionSiteHandler: function(location) {
    var constructionSite = <ConstructionSite app={this.props.app} location={location} previous={ConstructionSitesList} />;
    this.props.app.setState({
        component: constructionSite
    });
  }

});

module.exports = ConstructionSitesList;