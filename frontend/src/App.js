import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/homePage';
import CreateUser from './components/adminSide/createUser';
import SignIn from './components/adminSide/logIn';
import TableComponent from './components/adminSide/userList';
import LogIn from './components/userSide/UserLogin';
import SpeedometerComponent from './components/userSide/userPerformance';
import CardComponent from './components/adminSide/Card';
import UserSideStats from './components/userSide/userStats';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={ <HomePage />} />
      <Route path='/admin/logIn' element={ <SignIn />} />
      <Route path='/admin/userListing' element={<TableComponent />} />
      <Route path='/createUser' element={<CreateUser />} />
      <Route path='/stats' element={<CardComponent />} />
      <Route path='/user/logIn' element={<LogIn />} />
      <Route path='/user/userPerformance' element={<SpeedometerComponent />} />
      <Route path='/user/userStats' element={<UserSideStats />} />
  </Routes>
    </BrowserRouter>
  );
}

export default App;
