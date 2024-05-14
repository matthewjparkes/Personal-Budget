import './updateEnvelope.css'
import React, {useState, useEffect, useCallback} from 'react';


const UpdateEnvelope = (props) => {

    const [envelopeToBeUpdated, setEnvelope] = useState()

    const fetchData = useCallback(() => {
        fetch('http://localhost:3001/api/envelope/' + props.envelopeId)
          .then((res) => res.json())
          .then((data) => {
            setEnvelope(data);
          });
      }, []);


    // const UpdataData = useCallback(() => {
    //     fetch('http://localhost:3001/api/envelope/' + props.envelopeId+ '/update', {
    //         method: "PUT",
    //         mode: "cors",
    //         headers: {
    //             "Content-Type": "application/json"

    //         },
    //         body: JSON.stringify({
               
    //         })


    //     })
    //       .then((res) => res.json())
    //       .then((data) => {
    //         fetchData()
    //       });
    //   }, []);

      useEffect(()=> {
        fetchData()
     }, [])



return (

    <div className='updateEnvelope'>

        <h1>update Envelope</h1>



    </div>




)
}

export default UpdateEnvelope;