import logo from './logo.svg';
import React, {useState, useEffect, useCallback} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Header from './header/header';
import AddEnvelope from './addEnvelope/AddEnvelope';
import UpdateEnvelope from './updateEnvelope/updateEnvelope';

function App() {

  const [ArrayOfEnvelopes, setArray] = useState(['No Envelopes'])
  const [OverallBudget, setOverallBudget] = useState();
  const [OverallSpent, setOverallSpent] = useState();



  
  const fetchData = useCallback(() => {
    fetch('http://localhost:3001/api/envelope')
      .then((res) => res.json())
      .then((data) => {
        setArray(data);

        let accBud = 0;
        let accSpent = 0;

        data.forEach((e) => {
          accBud += +e.totalBudget;
          accSpent += +e.totalSpent;
        });

        setOverallBudget(accBud);
        setOverallSpent(accSpent);
      });
  }, []);
  

    useEffect(()=> {
      fetchData()
   }, [ArrayOfEnvelopes, fetchData])
  

 
  const listItems = ArrayOfEnvelopes.map(e =>
    <div className='Envelopes'>
      <h3>{e.name}</h3>
        <div className='breakdownCategory'>
          <ul className='TitleList'>
            <li>Total Budget</li>
            <li>Total Spent</li>
            <li>Remaining</li>
          </ul>      
          <ul className='TotalList'>
            <li>{'£'+ e.totalBudget}</li>
            <li>{'£'+ e.totalSpent}</li>
            <li>{'£'+ (e.totalBudget - e.totalSpent)}</li>
          </ul>
        </div>
      <Link className='UpdateButton' to='/updateEnvelope' envelopeId = {e.id}>Update</Link>     
    </div>
  
  );







  

 
  return (
    <Router>
    <Header OverallBudget = {OverallBudget}  OverallSpent = {OverallSpent}></Header>
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
      <Route path ='/updateEnvelope' element = {<updateEnvelope/>} />
    </Routes>
  </Router>
  );
}

export default App;
