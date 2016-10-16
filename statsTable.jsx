// TODO: Add a crop option
// that shortens the list to
// the top 10 or 50 users

import React from 'react';
import ReactDOM from 'react-dom';

// this array used for testing before making API calls
var data = [
  {"username":"sjames1958gm","img":"https://avatars.githubusercontent.com/u/4639625?v=3","alltime":3100,"recent":626,"lastUpdate":"2016-09-22T20:10:51.786Z"},
  {"username":"ndburrus","img":"https://avatars.githubusercontent.com/u/15148847?v=3","alltime":1891,"recent":480,"lastUpdate":"2016-09-19T18:46:08.545Z"},
  {"username":"wearenotgroot","img":"https://avatars.githubusercontent.com/u/16578279?v=3","alltime":1439,"recent":338,"lastUpdate":"2016-09-19T18:41:51.953Z"},
  {"username":"Chrono79","img":"https://avatars.githubusercontent.com/u/9571508?v=3","alltime":1808,"recent":255,"lastUpdate":"2016-09-19T18:45:53.410Z"},
  {"username":"maz-net-au","img":"https://avatars.githubusercontent.com/u/9792899?v=3","alltime":958,"recent":234,"lastUpdate":"2016-09-19T18:45:53.409Z"},
  {"username":"Masd925","img":"https://avatars.githubusercontent.com/u/9335367?v=3","alltime":2248,"recent":231,"lastUpdate":"2016-09-19T18:42:52.185Z"},
  {"username":"moigithub","img":"https://avatars.githubusercontent.com/u/7305974?v=3","alltime":1821,"recent":224,"lastUpdate":"2016-09-19T18:42:07.010Z"},
  {"username":"revisualize","img":"https://avatars.githubusercontent.com/u/1588399?v=3","alltime":1588,"recent":187,"lastUpdate":"2016-09-19T18:43:22.342Z"},
  {"username":"diomed","img":"https://avatars.githubusercontent.com/u/72777?v=3","alltime":647,"recent":187,"lastUpdate":"2016-09-19T18:58:00.817Z"} ];

// Parent component
var StatsTable = React.createClass({
  getInitialState: function(){
    return {
      stateData: [],
      headerboardData: '',
      userToggle: false,
      scoreToggle: false,
      recentToggle: false,
      cuttOffNum: 100
    }
  },
  
  // poll the API for top 100 users
  loadStatsFromServer: function(){
    console.log('loading data...')
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({
          stateData: data,
          headerboardData: data.sort((a,b)=>{
            return b.recent - a.recent;
            })[0]
    })
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  
  // load data from API
  // refresh rate is defined via prop
  componentDidMount: function(){
    this.loadStatsFromServer();
    setInterval(this.loadStatsFromServer, this.props.pollInterval); },
  
  // function to sort via Total Score
  clickScore: function(){
    // toggle state of scoreToggle
    this.setState({scoreToggle: !this.state.scoreToggle})
    // flip array to ascending / descending order
    if (this.state.scoreToggle){
      this.setState({
      stateData: this.state.stateData.sort(function(a,b){
        return a.alltime - b.alltime;
      })
    })
    } else {
      this.setState({
        stateData: this.state.stateData.sort(function(a,b){
          return b.alltime-a.alltime;
        })
      })
    } }, 
  // function to sort via Username
  clickUsername: function(){
    this.setState({
      userToggle: !this.state.userToggle,
      stateData: this.state.stateData.sort((a,b)=>{
        let nameA = a.username.toLowerCase(), 
            nameB = b.username.toLowerCase();
        if (this.state.userToggle) return (nameA < nameB ? -1 : 1);
        else return (nameA > nameB ? -1 : 1);
      }),
    }) },
  
  // function to sort via Recent Score
  clickRecent: function(){
    this.setState({
      recentToggle: !this.state.recentToggle,
      stateData: this.state.stateData.sort((a,b)=>{
        if (this.state.recentToggle){
          return a.recent - b.recent;
        } else {
          return b.recent - a.recent;
        }
      })
    })},
  
  render: function(){
    
    // create an array of table rows for
    // each user entry in the data object
    var rows=[];
    this.state.stateData.forEach(function(user){
      rows.push(<UserRow username={user.username} recent={user.recent} alltime={user.alltime}/>);
    })
    
    //the HeaderBoard takes the headerboardData state
    // as a prop.  Updates the "first place" state
    // automatically through the loadStatsFromServer function
    return (
    <div>
        <HeaderBoard Hdata={this.state.headerboardData} />
        <div className="container maintable">
          <h4> <p>(Showing top 100 users)</p></h4>
    <table>
      <tr>
        <th><div className= "thead" onClick={(e)=>{
              e.preventDefault;
              this.clickUsername();
            }}>Username <i className="fa fa-sort" aria-hidden="true" ></i></div></th>
        <th><div className= "thead" onClick={(e)=>{
            e.preventDefault;
            this.clickScore();
          }}>Total Score <i className="fa fa-sort" aria-hidden="true"></i></div></th>
        <th><div className= "thead" onClick={(e)=>{
            e.preventDefault;
            this.clickRecent();
          }}>Recent <i className="fa fa-sort" aria-hidden="true"></i></div></th>
      </tr>
      <tbody>{rows}</tbody>
    </table>
          </div>
    </div>
    )
  }
})

// create each row for the table,
// using a forEach on the data object
// props come from parent component
var UserRow = React.createClass({
  render: function(){
    return (
    <tr>
        <td>{this.props.username}</td>
        <td>{this.props.alltime}</td>
        <td>{this.props.recent}</td>
    </tr>
    )
  }
})

// the "leaderboard" section that displays first place
// and info about FCC
var HeaderBoard = React.createClass({
  getInitialState: function(){
    return {
      headerInfo: "awaiting data..."
    }
  },
  
  render: function(){
    // use media queries to hide p tags on small screens
    return(
    <div className="well FCCLeaderBoard grad">
        <LeaderBoardHeading titleValue="FCC LEADER BOARD" />
        <p></p>
        <p>FreeCodeCamp is an online community that teaches people of all skills,
         ages, and abilities to code.  Users gain points by completing challenges 
         and also helping other users work through problems.</p>
        <b>TOP SCORE:</b><div><img src={this.props.Hdata.img}></img></div>
        <span>{this.props.Hdata.username}</span> <div>with a current score of</div> <span>{this.props.Hdata.alltime} </span>
        <LeaderBoardFooting />
    </div>
    )
  }
})

// create leaderboard title style
var LeaderBoardHeading = React.createClass({
  // create an array to apply style to each character
  render: function(){
    var titleArr = this.props.titleValue.split('');
    var titleArr2 = titleArr.map((c,i,a)=>{
      if (c == " "){
        var spanStyle = {"border":"none", "background":"#222"}
      } else {
        var spanStyle = {"border":"#555 solid 1px", "background":"#333333"}
      }
      return (
       <span className="letterboard" style={spanStyle} >
          {c}
        </span>
      )
    })
    
    return (
    <div>
    {titleArr2}
    </div>)
  }
})

// Created in React with API from FCC
var LeaderBoardFooting = React.createClass({
  render: function(){
    return(
    <div className="leader-footer">
      Created in React.js with API from FCC 
    </div>)
  }
})


ReactDOM.render(
<StatsTable data={data} url="https://fcctop100.herokuapp.com/api/fccusers/top/alltime" pollInterval={10000} />, document.getElementById('app'))

/*
// JSON obj for recent points
https://fcctop100.herokuapp.com/api/fccusers/top/recent

// JSON obj for all time points
https://fcctop100.herokuapp.com/api/fccusers/top/alltime
*/