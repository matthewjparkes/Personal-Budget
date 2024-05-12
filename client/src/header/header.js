
import { Link } from 'react-router-dom';
import './header.css';

function Header() {
    return (
        <header className="App-header">
          <div className='NavContainer'>
           <h1 className="Title">My Personal Budget</h1>
           <span className="NavBar"> 
                <div className="Totals">Total Budget: </div>
                <div className="Totals">Total Spent: </div>
                <div className='Totals'>Total Remaining: </div>
                <Link className='AddButton' to='/addEnvelope'>Add Envelope</Link>
            </span>
          </div>
        </header>
    );
  }
  
  export default Header;