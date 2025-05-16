import Login from './auth/Login';
import RoleRouter from './routing/RoleRouter';
import { BrowserRouter } from 'react-router-dom';

function App() {
  localStorage.removeItem('role'); // reset on every reload
  const role = localStorage.getItem('role');

  return (
    <BrowserRouter>
      {!role ? <Login /> : <RoleRouter role={role} />}
    </BrowserRouter>
  );
}

export default App;
