import React, { useState } from 'react'
import './sass/boocking/boocking.scss'

function boocking() {
    // const [stap, setStap] = useState();
  return (
    <div className='boocking'>
        {
        <div>
            <label htmlFor="">Nom complet <span>*</span></label>
            <input type="text" placeholder='Taper votre réponse ici' />
        </div>
        }
        <div className='buttons'>
            <button>previous</button>
            <button>next</button>
        </div>
    </div>
  )
}

export default boocking