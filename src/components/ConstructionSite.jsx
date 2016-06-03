var React = require('react');
var jQuery = require('jquery');
var $ = jQuery;
var ConstructionSiteOversightInspection = require('./ConstructionSiteOversightInspection.jsx');
var StateManager = require('./Statemanager.js');

var ConstructionSite = React.createClass({

  render: function() {
    var location = this.props.location;
    var topSpace = {
      margin: '15px 0 0 0',
    };
    return <div>
        <h2>{ location.name }</h2>
        <button className={('button-primary bottom-space right-space')} onClick={this.constructionSiteOversightInspectionHandler}>Perform Inspection</button>
        <button className={('button-default bottom-space')} onClick={this.constructionSitesListHandler}>Back to Construction Sites</button>
        <ul>
            <li><strong>Address:</strong> { this._formatAddress() }</li>
            <li><strong>Latitude:</strong> { location.latitude }</li>
            <li><strong>Longitude:</strong> { location.longitude }</li>
            <li><strong>TMK:</strong> { location.tmk }</li>
            <li><strong>Category:</strong> { location.project_category }</li>
            <li><strong>Type:</strong> { location.project_cip }</li>
            <li><strong>Total Acres:</strong> { location.total_acres }</li>
            <li><strong>Acres Disturbed:</strong> { location.acres_disturbed }</li>
            <li><strong>Percent Complete:</strong> { location.percent_complete }%</li>
        </ul>
        <h4>Assignment</h4>
        <ul>
            <li><strong>Department:</strong> { location.city_department_string ? location.city_department_string : '' } { location.city_department_division_string ? location.city_department_division_string : '' }</li>
            <li><strong>Inspector:</strong> { location.city_inspector_name }</li>
            <li><strong>Inspector Email:</strong> { location.city_inspector_email }</li>
            <li><strong>Inspector Phone:</strong> { location.city_inspector_phone }</li>
            <li><strong>Project Manager:</strong> { location.city_project_manager_name }</li>
            <li><strong>Project Manager Email:</strong> { location.city_project_manager_email }</li>
            <li><strong>Project Manager Phone:</strong> { location.city_project_manager_phone }</li>
        </ul>
        <h4>Project</h4>
        <ul>
            <li><strong>Contractor:</strong> { location.contractor }</li>
            <li><strong>Contractor Representative:</strong> { location.contractor_representative_name }</li>
            <li><strong>Contractor Representative Email:</strong> { location.contractor_representative_email }</li>
            <li><strong>Contractor Representative Phone:</strong> { location.contractor_representative_phone }</li>
            <li><strong>Developer:</strong> { location.developer }</li>
            <li><strong>Inspector:</strong> { location.inspector }</li>
        </ul>
        <h4>Administrative</h4>
        <ul>
            <li><strong>NPDES Permit Number:</strong> { location.npdes_permit_number }</li>
            <li><strong>NGPC Number C:</strong> { location.ngpc_number_c }</li>
            <li><strong>NGPC Number G:</strong> { location.ngpc_number_g }</li>
            <li><strong>NPDES Permit Number:</strong> { location.npdes_permit_number }</li>
            <li><strong>Building Permit Number:</strong> { location.building_permit_number }</li>
            <li><strong>Grading Permit Number:</strong> { location.grading_permit_number }</li>
            <li><strong>Grubbing Permit Number:</strong> { location.grubbing_permit_number }</li>
            <li><strong>Stockpiling Permit Number:</strong> { location.stockpiling_permit_number }</li>
        </ul>
        <button className={('button-default full-width')} onClick={this.constructionSitesListHandler}>Back to Construction Sites</button>
    </div>
  },

  constructionSiteOversightInspectionHandler: function(){
    var previousProps = this.props;
    var constructionSiteOversightInspection = <ConstructionSiteOversightInspection app={this.props.app} location={this.props.location} previous={ConstructionSite} previousProps={previousProps} />;
    this.props.app.setState({
        component: constructionSiteOversightInspection
    });
  },

  constructionSitesListHandler: function(){
    var constructionSitesList = React.createElement(this.props.previous, {app: this.props.app});
    this.props.app.setState({
        component: constructionSitesList
    });
  },

  _formatAddress: function(location){
    var address = '';
    if(this.props.location.address_street.length > 0)
        address += this.props.location.address_street;
    if(this.props.location.address_street.length > 0 && this.props.location.address_city.length > 0)
        address += ', ';
    else
        address += ' ';
    if(this.props.location.address_city.length > 0)
        address += this.props.location.address_city+' ';
    if(this.props.location.address_state.length > 0)
        address += this.props.location.address_state+' ';
    if(this.props.location.address_zipcode)
        address += this.props.location.address_zipcode;
    return address;
  }

});

module.exports = ConstructionSite;