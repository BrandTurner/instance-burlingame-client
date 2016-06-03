var React = require('react');
var jQuery = require('jquery');
var Config = require('./Config.js');
var $ = jQuery;
var Header = require('./Header.jsx');
var ConstructionSitesList = require('./ConstructionSitesList.jsx');
var Footer = require('./Footer.jsx');
var StateManager = require('./Statemanager.js');
var Sendqueue = require('./Sendqueue.js');

var App = React.createClass({

  getInitialState: function(){
    return {
        component: <ConstructionSitesList app={this} />,
        user: StateManager.get(this, 'user', Config.apiUrl+'/user')
    };
  },

  render: function() {
    $("html, body").animate({ scrollTop: 0 }, 0);
    if(this.state.user){
      if(this.state.user.type !== null){
        return this.renderContainer();
      }else{
        return this.renderNoData();
      }
    }else{
      return this.renderLoading();
    }
  },

  renderContainer: function() {
    return <div>
        <Header app={this} />
        <main>
            { this.state.component }
        </main>
        <Footer app={this} />
      </div>;
  },

  renderLoading: function() {
    return <div>
        <Header app={this} />
        <main>
            <div className={("loader")}>Loading...</div>
        </main>
        <Footer app={this} />
      </div>;
  },

  renderNoData: function() {
    return <div>
        <Header app={this} />
        <main>
            Not connected and no data cached.
        </main>
        <Footer app={this} />
      </div>;
  }

});

module.exports = App;