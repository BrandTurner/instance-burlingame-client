var React = require('react');
var ReactDOM = require('react-dom');
var jQuery = require('jquery');
var StateManager = require('./Statemanager.js');
var Sendqueue = require('./Sendqueue.js');
var XFormR = require('./Xformr.js');

// HORRIBLE HACK NEEDED FOR XFORMR:
$ = jQuery;

var ConstructionSiteOversightInspection = React.createClass({

  endpoint: 'http://localhost/instance-honolulu/public/api/construction/locations/oversight-inspection',

  getInitialState: function(){
    return {
        constructionLocationOversightInspection: StateManager.get(this, 'constructionLocationOversightInspection', this.endpoint)
    };
  },

  componentDidMount: function() {
    var el = ReactDOM.findDOMNode(this);
    if(this.state.constructionLocationOversightInspection.type !== null){
        $(el).find('div').append(this.makeForm());
    }
  },

  render: function() {
    if(this.state.constructionLocationOversightInspection){
      if(this.state.constructionLocationOversightInspection.type !== null){
        return this.renderReady();
      }else{
        return this.renderNotReady();
      }
    }else{
      return this.renderNotReady();
    }
  },

  renderReady: function() {
    return <div>
        <h4>Oversight Inspection Form</h4>
        <div></div>
        <button type="button" onClick={this.submitForm}>Submit</button>
        <button type="button" onClick={this.leaveForm}>Cancel</button>
    </div>
  },

  renderNotReady: function() {
    return <div>Loading...</div>;
  },

  submitForm: function(){
    var values = {};
    $(this.state.form).find('[name]').each(function(){
        if($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio'){
            if($(this).is(':checked')){
                values[$(this).attr('name')] = $(this).val();
            }
        }else{
            values[$(this).attr('name')] = $(this).val();
        }
    });
    values.location_id = this.props.location.id;
    Sendqueue.send(this.endpoint, values);
    this.leaveForm();
  },

  leaveForm: function(){

    var props = this.props.previousProps, 
        constructionSite;

    props.app = this.props.app;
    props.location = this.props.location;

    console.log(props);

    constructionSite = React.createElement(this.props.previous, props);

    this.props.app.setState({
        component: constructionSite
    });
  },

  makeForm: function(){
    var xformrOptions = {},
        xformrDef = this.state.constructionLocationOversightInspection.data.definition,
        xformrData = this.props.location.oversight_inspection_prepopulate_data,
        xformr;

    xformr = new XFormR.Factory(xformrOptions);
    xformr.registerRenderer('xf:image', function($def){
        return '<p>Photo upload not available via mobile client.</p>';
    });
    xformr.setDefinition($.parseXML(xformrDef));
    xformr.setData(xformrData);

    return xformr.render().get();
  }

});

module.exports = ConstructionSiteOversightInspection;