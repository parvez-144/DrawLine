import React from 'react'
import "./Features.css"

function Features({img,heading,paragraph}) {
  return (
    <div className='Feature__wrapper'>
        <img src={img} alt=""  />
        <h1>{heading}</h1>
        <p>{paragraph}</p>
    </div>
  )
}

export default Features