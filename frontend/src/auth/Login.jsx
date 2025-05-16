import './Login.css';
import logo from '../assets/clearSKY-logo.png';
import LoginForm from './LoginForm';

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-logo-bar">
        <img src={logo} alt="clearSKY logo" className="login-img-logo" />
      </div>
      <main className="login-main">
        <section className="login-form-section">
          <div className="login-form-box">
            <div className="login-form-title">Please enter your credentials</div>
            <LoginForm />
          </div>
        </section>
      </main>
    </div>
  );
}
