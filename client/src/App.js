import logo from './logo.svg';
import React from 'react';
import './App.css';

function App() {

  const [data, setData] = React.useState(null);


  React.useEffect(() => {


    fetch("/api/envelope")
      .then((res) => res.json())
      
      .then((data) => 
        setData(data[0].name)
      
       );



  }, []);

 function handleClick() {
    fetch("/api/envelope")
      .then((res) => res.json())
      
      .then((data) => 
        setData(data[0].totalBudget)
      
       );

  }






  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
        <button onClick={handleClick()}>Show How Much Money is in the Budget</button>
      </header>
    </div>
  );
}

export default App;
