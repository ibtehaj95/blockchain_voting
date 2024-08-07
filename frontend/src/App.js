import './App.css';
import { Route, Routes, Link } from 'react-router-dom';
import Root from './components/Root';
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Management from "./components/Management";
import Campaign from "./components/Campaign";
import NewCampaign from './components/NewCampaign';
import NotFound from "./components/NotFound";
import userContext from './utils/UserContext';
import PrivateRoutes from './utils/PrivateRoutes';
import PublicRoutes from './utils/PublicRoutes';
import { useState } from 'react';

function App() {

  const [userObj, setUserObj] = useState({
    name: "loggedOut",
    role: "loggedOut"
  });

  return (
    <div className="App">

      <Link to="/home">Home</Link>
      <span> </span>
      <Link to="/login">Login</Link>
      <span> </span>
      <Link to="/register">Register Yourself</Link>
      <span> </span>
      <Link to="/management">Admin Panel</Link>
      <span> </span>
      <Link to="/new-campaign">New Campaign</Link>
      <span> </span>
      {/* <Link to="/campaign/1">Vote for Campaign 1</Link>
      <span> </span>
      <Link to="/campaign/3">Vote for Campaign 3</Link>
      <span> </span>
      <Link to="/campaign/9">Vote for Campaign 9</Link> */}

      <userContext.Provider
        value={
          {
            userObj,
            setUserObj
          }
        }
      >
        <Routes>
          <Route element={<PublicRoutes></PublicRoutes>}>
            <Route path="/" element={<Root></Root>} ></Route>
            <Route path="/register" element={<Register></Register>} ></Route>
            <Route path="/login" element={<Login></Login>} ></Route>
            <Route path="*" element={<NotFound></NotFound>} ></Route>
          </Route>
          <Route element={<PrivateRoutes></PrivateRoutes>} >
            <Route path="/home" element={<Home></Home>}></Route>
            <Route path="/management" element={<Management></Management>}></Route>
            <Route path="/new-campaign" element={<NewCampaign></NewCampaign>}></Route>
            <Route path="/campaign/:id" element={<Campaign></Campaign>}></Route>
          </Route>
        </Routes>
      </userContext.Provider>

    </div>
  );
}

export default App;
