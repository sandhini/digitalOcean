import React, { Component } from "react";
import logo from "./logo.svg";
import ReactDOM from "react-dom";
import { createBrowserHistory } from '../node_modules/history';



import "./App.css";
var url = "http://localhost:9000/testAPI"

class App extends Component {
    constructor(props) {
        super(props);
        this.handleSubmitY = this.handleSubmitY.bind(this);
        this.state = { apiResponse: "" , peopleList: [""], param: "", form: "Name"};
        this.handleChange = this.handleChange.bind(this);
        this.handleFormPick = this.handleFormPick.bind(this);
        const button = document.querySelector('#submitB')
        const input = document.querySelector('#myText')
        const form = document.querySelector('#myList')
        form.addEventListener('change', this.handleFormPick)
        input.addEventListener('change', this.handleChange)
        button.addEventListener('click', this.handleSubmitY)
    }

    handleSubmitY(event) {
      console.log('A name was submitted: ' + this.state.param + " "+this.state.form);
      url = "http://localhost:9000/con/"
      url += this.state.form+"/"+this.state.param
      console.log(url)
      event.preventDefault();
      this.componentDidMount()
  }

  handleFormPick(event){
    this.setState({form: event.target.value});
  }

  handleChange(event) {
    this.setState({param: event.target.value});
  }
    callAPI(url) {
        fetch(url)
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res },function() {
              this.creatList()
            } ))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI(url);
    }

    creatList(){
      var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&*+\.\/;<=>?@\[\]^_`{|}~]/g;
      var str = (this.state.apiResponse)
      var peopleList = str.split('],[')
      var finList = []
      var paramList = []
      var firstList = peopleList[0]
      firstList = firstList.split('","')
      for (var j = 0; j < firstList.length; j++){
        paramList[j] = firstList[j].replace(punctRE, '').trim()
     }
     console.log(paramList)
      for (var i = 1; i < peopleList.length; i++) {
        var tempList = peopleList[i].split('","')
        var tempDict = {}
        for (var j = 0; j < tempList.length; j++){
          tempList[j] = tempList[j].replace(punctRE, '').trim()
         tempDict[paramList[j]] = tempList[j]
       }
        finList.push(tempDict)
      }
      console.log(finList)
      this.setState({ peopleList: finList });
    }

    _renderObject(){
      const ob = this.state.peopleList
      return Object.entries(ob).map(([key, value], i) => {
        return (
          <tr id = "childTable">
          <td scope="row">{value.Name}</td>
          <td>{value.Position}</td>
          <td>{value.Team}</td>
          <td>{value.Projects}</td>
          <td>{value.Manager}</td>
          <td>{value.Oversees}</td>
          </tr>
            //<b>Position:</b> {value.Position}<br/>
          //  <b>Projects:</b> {value.Projects}<br/>
          //  <b>Manager:</b> {value.Manager}<br/>
          //  <b>Oversees: </b> {value.Oversees}<br/>

        )
      })
    }

    render() {
      return (
    <table  id = "parentP">
    <tbody>
    <tr id = "headTable">
    <th scope = "row">Name</th>
    <th>Position</th>
    <th>Team</th>
    <th>Projects</th>
    <th>Manager</th>
    <th>Oversees</th>
    </tr>
    {this._renderObject()}
     </tbody>
     </table>
    		)
    }
}

export default App;
