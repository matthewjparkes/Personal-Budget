import './AddEnvelope.css';
import React,  {useState}from "react";
import { useNavigate } from "react-router-dom";


function AddEnvelope(){

    const [nameOfEnvelope, setNameOfEnvelope] = useState()
    const [TotalBudget, setTotalBudget] = useState()
    const [ErrorMessage, setErrorMessage] = useState()
    const history = useNavigate();

    const handleNameChange = (e) => {
        console.log(e.target.value)
        setNameOfEnvelope(e.target.value)
        console.log(nameOfEnvelope)
    }

    const handleTotalChange = (e) => {
        console.log(e.target.value)
        setTotalBudget(e.target.value); 
        console.log(TotalBudget)
    }


    const handleFormSubmit = (e) => {
        //Clear Error Message
        setErrorMessage(null);
        
        fetch('http://localhost:3001/api/envelope', {
            method: "POST", 
            mode: "cors",
            headers: {
                "Content-Type": "application/json"

            },
            body: JSON.stringify({
                "name": nameOfEnvelope, 
                "totalBudget": TotalBudget
            })
        }).then((res) => {
            if (res) {
                return res.text()
              }
            //   throw new Error({errorMessage: 'Something went wrong', response: res.body})

        }).then((data) => {
            if(data.includes('Envelope Added')){
                history("/")
            } else {
                console.log( 'Error message' + data)
                setErrorMessage(data)
            }
        }).catch((err) => {
            console.log('Caught Error' + err.errorMessage)
           


        }
        )
    }

    return(
        <div className="AddContainer">
            <div className='FormContainer'>
                <h1>Add Envelope</h1>
                <form>
                        <div>
                            <label for='NameEnvelope'>Name of Envelope</label>
                            <input type= 'text' id='NameEnvelope' onChange={handleNameChange}></input> <br/>
                        </div>
                        <div>
                            <label for='Budget' id ='Budget'>Total Budget</label>
                            <input type= 'number' id='Budget' onChange={handleTotalChange}></input>
                        </div>
                        <div>
                           <div className='SubmitButton' onClick={handleFormSubmit}>Submit</div>
                        </div>
                        <div>
                            <span className='ErrorMessage'>{ErrorMessage}</span>
                        </div>



                </form>
            </div>



        </div>
    )

}

export default AddEnvelope;