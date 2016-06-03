var React = require('react');
var jQuery = require('jquery');
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
        user: StateManager.get(this, 'user', 'http://localhost/sites/instance-honolulu/public/api/user')
    };
  },

  render: function() {
    Sendqueue.sendAll();
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
        <Header />
        <main>
            { this.state.component }
        </main>
        <Footer />
      </div>;
  },

  renderLoading: function() {
    return <main>
        Loading...
      </main>;
  },

  renderNoData: function() {
    return <main>
        Not connected and no data cached.
      </main>;
  }

});

module.exports = App;