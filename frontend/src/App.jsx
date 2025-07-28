import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login.jsx';
import Signup from './Pages/Signup.jsx';
import HomeLayout from './Pages/HomeLayout.jsx';
import First from './Pages/First.jsx';
import Form from './Pages/Form.jsx';
import Congrats from "./Pages/Congrats.jsx";
import Queue from "./Pages/Queue.jsx";

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<First />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<HomeLayout />} />
        <Route path='/form' element={<Form />} />
        <Route path="/congrats" element={<Congrats />} />
        <Route path="/queue" element={<Queue />} />
      </Routes>
    </div>
  );
}

export default App;
