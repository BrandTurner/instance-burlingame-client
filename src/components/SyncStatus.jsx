// NOTE: This component is not currently in use!!!!

var React = require('react');
var jQuery = require('jquery');
var $ = jQuery;
var StateManager = require('./Statemanager.js');
var Sendqueue = require('./Sendqueue.js');
var ConstructionSitesList = require('./ConstructionSitesList.jsx');

var SyncStatus = React.createClass({

  render: function() {

    var uploadList = [];
    $.each(Sendqueue.getAll(), function(idx, inspection){
        uploadList.push(<li>{ inspection.data.project_name } on { inspection.data.current_inspection_date }</li>);
    });
    if(uploadList.length == 0)
        uploadList.push(<li><em>All inspections have been upload to CloudCompli</em></li>);
    else
        uploadList.push(<li><button onClick={this.uploadHandler} className={('button-success full-width')}>Upload Now</button></li>);
    
    return <div>
        <h2 className={('bottom-space')}>Sync Status</h2>
        <h4>Latest Download</h4>
        <ul>
            <li><strong>User:</strong> {this._getStateDataDate('user')}</li>
            <li><strong>Construction Locations:</strong> {this._getStateDataDate('constructionLocations')}</li>
        </ul>
        <h4>Awaiting Upload</h4>
        <ul>
            { uploadList }
        </ul>
        <button onClick={this.constructionSitesListHandler} className={('button-default full-width')}>Back to Construction Sites</button>
    </div>;
  },

  _getStateDataDate: function(stateDataName){
    var stateData = StateManager.getStored(stateDataName);
    if(stateData && stateData.synced_on){
        var date = new Date(stateData.synced_on),
            hours = parseInt(date.getHours()),
            minutes = date.getMinutes().toString(),
            ampm = 'AM';
        if(hours > 12){
            ampm = 'PM';
            hours = hours - 12;
        }else if(hours == 12){
            ampm = 'PM';
        }else if(hours == 0){
            hours = 12;
        }
        if(minutes.length == 1){
            minutes = '0'+minutes;
        }
        return ''+date.getMonth()+'/'+date.getDay()+'/'+date.getFullYear()+' '+hours+':'+minutes+' '+ampm;
    }else{
        return '';
    }
  },

  constructionSitesListHandler: function(){
    var constructionSitesList = <ConstructionSitesList app={this.props.app} />;
    this.props.app.setState({
        component: constructionSitesList
    });
  },

  uploadHandler: function(){
    Sendqueue.sendAll();
    this.constructionSitesListHandler();
  }

});

module.exports = SyncStatus;