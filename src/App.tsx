import React, { useContext } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import axios from 'axios';
import Colors from './components/global/themes/colors';
import { Toggler, Navbar, Loader } from './components';
import { ThemeContext } from './components/global/context/ThemeProvider';
import Dashboard from './screens/large/Dashboard';
import Patient from './screens/large/Patient';
import Medication from './screens/large/Medication';
import Treatment from './screens/large/Treatment';
import Users from './screens/large/Users';
import Login from './screens/large/Login';
import { UserContext } from './components/global/context/UserProvider';
import { baseURL } from './helpers/api/backend';

function App():JSX.Element {
  const { theme } = useContext(ThemeContext);
  const { user, setUser } = useContext(UserContext);
  const [auth, setAuth] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    async function checkAuth():Promise<void> {
      const path = window.location.href.split('/');
      try {
        axios.defaults.withCredentials = true;
        const result = await axios.get(`${baseURL}/checkauth`, {
          withCredentials: true,
        });
        setAuth(true);
        setUser({
          name: result.data.name,
          type: result.data.type,
        });
      } catch (e) {
        setAuth(true);
        // eslint-disable-next-line max-len
        if (path[path.length - 1] === 'login' || path[path.length - 1] === 'login#') { setError('This user is not authenticated! Try with another user'); }
        throw e;
      }
    }
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!auth) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '200px',
      }}
      >
        <Loader />
        <br />
        <span>Authenticating</span>
      </div>
    );
  }
  return (
    <div
      className="App"
      style={{
        backgroundColor: Colors.background[theme],
      }}
    >
      {
      !user.name || !user.type
        ? <Login error={error} />
        : (
          <Router>
            <div id="space">
              <div id="nav-space">
                <Navbar />
              </div>
              <div id="body-space">
                <span id="toggler">
                  <Toggler />
                </span>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/patient" element={<Patient />} />
                  <Route path="/medication" element={<Medication />} />
                  <Route path="/treatment" element={<Treatment />} />
                  <Route path="/users" element={<Users />} />
                </Routes>
              </div>
            </div>
          </Router>
        )
    }
    </div>

  );
}

export default App;
