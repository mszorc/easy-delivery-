import React from 'react';
import axios from 'axios';

let url = "http://localhost:3000/"

export default class AddAuthorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: ''
    }
  }
  
  changeHandler = event => {
      this.setState({
        [event.target.name]:event.target.value  
      });
  }

  submitHandler = event => {
    axios.post(url + "author", {
      firstName: this.state.firstName,
      lastName: this.state.lastName 
    });
    
    event.preventDefault();
  }

   render() {
      return (
        <form onSubmit={this.submitHandler} className="inputForm">

          <div className="form-group">
            <label>First name </label>
            <input type="text" name="firstName" value={this.state.firstName} onChange={this.changeHandler} />
          </div>

          <div className="form-group">
            <label>Last name</label>
            <input type="text" name="lastName" value={this.state.lastName} onChange={this.changeHandler} />
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary" >Submit</button>
          </div>
            
        </form>      
      );
  }
}