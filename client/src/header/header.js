
import { Link } from 'react-router-dom';
import './header.css';

const Header = props => {
    return (
        <header className="App-header">
          <div className='NavContainer'>
           <h1 className="Title">My Personal Budget</h1>
           <span className="NavBar"> 
                <div className="Totals">Total Budget: £{props.OverallBudget} </div>
                <div className="Totals">Total Spent: £{props.OverallSpent} </div>
                <div className='Totals'>Total Remaining: £{props.OverallBudget - props.OverallSpent} </div>
                <Link className='AddButton' to='/addEnvelope'>Add Envelope</Link>
            </span>
          </div>
        </header>
    );
  }
  
  export default Header;