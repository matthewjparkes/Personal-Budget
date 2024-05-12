import './AddEnvelope.css';


function AddEnvelope(){

    return(
        <div className="AddContainer">
            <div className='FormContainer'>
                <h1>Add Envelope</h1>
                <form>
                        <div>
                            <label for='NameEnvelope'>Name of Envelope</label>
                            <input type= 'text' id='NameEnvelope'></input> <br/>
                        </div>
                        <div>
                            <label for='Budget' id ='Budget'>Total Budget</label>
                            <input type= 'number' id='Budget'></input>
                        </div>



                </form>
            </div>



        </div>
    )

}

export default AddEnvelope;