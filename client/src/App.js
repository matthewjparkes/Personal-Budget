import logo from './logo.svg';
import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Header from './header/header';
import AddEnvelope from './addEnvelope/AddEnvelope';

function App() {

  let ArrayOfEnvelopes =['Groceries', 'Utilities', 'Car', 'test 4', 'test 5', 'test 6']
  const listItems = ArrayOfEnvelopes.map(e =>
    <div className='Envelopes'>
      <h3>{e}</h3>
        <div className='breakdownCategory'>
          <ul className='TitleList'>
            <li>Total Budget</li>
            <li>Total Spent</li>
            <li>Remaining</li>
          </ul>      
          <ul className='TotalList'>
            <li>£000.00</li>
            <li>£000.00</li>
            <li>£000.00</li>
          </ul>
        </div>
      <div className='UpdateButton'>Update</div>     
    </div>
  
  );







  

 
  return (
    <Router>
    <Header></Header>
    <Routes>
      <Route path='/' element = {
       <div className="App">
        <div className="body"> 
          {listItems}
        </div>
       </div>
      }>
      </Route>
      <Route path ='/addEnvelope' element = {<AddEnvelope/>} />
    </Routes>
  </Router>
  );
}

export default App;
