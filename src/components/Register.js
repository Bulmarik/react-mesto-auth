import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as auth from '../utils/auth';
import success from '../images/ok.png';
import fail from '../images/x.png';

class Register extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      password: '',
      email: ''
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
    auth.register(password, email)
      .then((res) => {
        if(res.status === 201){
          this.props.onInfoTooltip({
            message: 'Вы успешно зарегистрировались!',
            icon: success
          });
          this.props.history.push('/sign-in');
        } else {
          this.props.onInfoTooltip({
            message: 'Что-то пошло не так! Попробуйте ещё раз',
            icon: fail
          })
        }
      })
  }

  render() {
    return (
      <div className="register">
          <form className="register__form" onSubmit={this.handleSubmit} id="register-form" action="#" method="post">
            <h3 className="register__title">Регистрация</h3>
            <input className="register__input register__input_type_email" onChange={this.handleChange} value={this.state.email} name="email" placeholder="Email" type="email" required />
            <span className="register__error" id="email-error" />
            <input className="register__input register__input_type_password" onChange={this.handleChange} value={this.state.password} name="password" placeholder="Пароль" type="password" maxLength="30" minLength="7" required />
            <span className="register__error" id="password-error" />
            <button className="register__submit-btn" type="submit">Зарегистрироваться</button>
            <p className="register__question">Уже зарегистрированы? <Link to="/sign-in" className="register__link" src="">Войти</Link></p>
          </form>
      </div>
    )
  }  
}

export default withRouter(Register);