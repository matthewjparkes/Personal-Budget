import './updateEnvelope.css';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const UpdateEnvelope = () => {
  const [envelopeToBeUpdated, setEnvelope] = useState(null);
  const [updateType, setUpdateType] = useState('AddExpenditure');
  const [updatedName, setName] = useState();
  const [updateBudget, setBudget] = useState();
  const [updateExpenditure, setExpenditure] = useState('AddExpenditure');
  const location = useLocation();
  const { envelopeid } = location.state || {};
  const [refresh, setRefresh] = useState(false)

  const handleFormSubmit = (e) => {

    e.preventDefault();

    let envelopeId = envelopeToBeUpdated.id
    console.log(envelopeId)
    //Clear Error Message
    
    
    fetch(`http://localhost:3001/api/envelope/${envelopeId}/update`, {
        method: "PUT", 
        mode: "cors",
        headers: {
            "Content-Type": "application/json"

        },
        body: JSON.stringify({
          "type": updateType, 
          "name": updatedName, 
          "totalBudget": updateBudget, 
          "changeBudget": updateBudget,
          "changeExpenditure": updateExpenditure
      
      })
    }).then((res) => {
      if (res.ok) {
        return res.text();
      }
      throw new Error('Something went wrong');
        //   throw new Error({errorMessage: 'Something went wrong', response: res.body})

    }).then((data) => {
        
      console.log('Success:', data);
      setRefresh(true)
      
    }).catch((err) => {
        console.log('Caught Error' + err.message)
       


    }
    )
}

  useEffect(() => {
    setRefresh(false)
    if (envelopeid) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/envelope/${envelopeid}`);
          const data = await response.json();
          setEnvelope(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [refresh]);

  if (!envelopeid) {
    return <div>Envelope ID is missing</div>;
  }

  if (!envelopeToBeUpdated) {
    return <div>Loading...</div>;
  }

  const handleDropDown = (e) => {
    console.log(e.target.value)
    setUpdateType(e.target.value)
  }

  const handleNameChange = (e) => {
    console.log(e.target.value)
    setName(e.target.value)
  }

  const handleBudgetChange = (e) => {
    console.log(e.target.value)
    setBudget(e.target.value)
  }

  const handleExpenditureChange = (e) => {
    console.log(e.target.value)
    setExpenditure(e.target.value)
  }


  


  return (
    <div className='updateEnvelope'>
      <h1>Update Envelope {envelopeToBeUpdated.name}</h1>
      <form>
        <label htmlFor="ChangeType">What do you want to update?</label>
        <select id="ChangeType" name="ChangeType" onChange={handleDropDown}>
          <option value="changeName">Change Name of Budget</option>
          <option value="AddExpenditure">Add Expenditure</option>
          <option value="changeBudget">Change value of Budget</option>
        </select>
        <div>
          <label hidden={updateType === 'changeName'? false: true} htmlFor='NameEnvelope'>Name of Envelope</label>
          <input
            type={updateType === 'changeName'? 'text': 'hidden'}
            id='NameEnvelope'
            defaultValue={envelopeToBeUpdated?.name || 'Envelope Name'}
            onChange={handleNameChange}
          />
          <br />
        </div>
        <div>
          <label hidden={updateType === 'changeBudget'? false: true} htmlFor='Budget' id='Budget'>Total Budget</label>
          <input
            type={updateType === 'changeBudget'? 'number': 'hidden'}
            id='Budget'
            defaultValue={envelopeToBeUpdated?.totalBudget || 0}
            onChange={handleBudgetChange}
          />
        </div>
        <div>
          <label hidden={updateType === 'AddExpenditure'? false: true} htmlFor='expend' id='expend'>Add Expenditure</label>
          <input type={updateType === 'AddExpenditure'? 'number': 'hidden' } id='expend' onChange={handleExpenditureChange} />
        </div>
        <div>
          <button type='submit' className='SubmitButton'  onClick={handleFormSubmit} >Submit</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEnvelope;
