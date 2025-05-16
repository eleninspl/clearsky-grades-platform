export default function LoginButtonRow() {
    return (
      <div className="login-buttons-row">
        <button type="submit" className="login-btn">Login</button>
        <span className="login-or">or</span>
        <button type="button" className="login-btn google">
          Login with <span className="google-text">Google</span>
        </button>
      </div>
    );
  }
  