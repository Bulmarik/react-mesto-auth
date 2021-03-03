import React from 'react';
import { withRouter } from 'react-router-dom';
import * as auth from '../utils/auth';

class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
  }

  handleChange(e) {
    const {name, value} = e.target;
    this.setState({
      [name]: value 
    });
  }

  handleSubmit(e){
    e.preventDefault();
    const {password, email} = this.state;
    if (!email || !password){
      return;
    }
    auth.authorize(password, email)
      .then((data) => {
        if (data.token){
          this.setState({email: '', password: ''} ,() => {
            this.props.onLogin();
            this.props.history.push('/mesto');
          })
        }  
      })
      .catch(err => console.log(err));
  }

  render(){
    return (
      <div className="login">
        <form className="login__form" onSubmit={this.handleSubmit} id="login-form" action="#" method="post">
          <h3 className="login__title">Вход</h3>
          <input className="login__input login__input_type_email" onChange={this.handleChange} value={this.state.email} name="email" placeholder="Email" type="email" required />
          <span className="login__error" id="email-error" />
          <input className="login__input login__input_type_password" onChange={this.handleChange} value={this.state.password} name="password" maxLength="30" minLength="7" placeholder="Пароль" type="password" required />
          <span className="login__error" id="password-error" />
          <button className="login__submit-btn" type="submit">Войти</button>
        </form>
      </div>
    )
  }
}

export default withRouter(Login);