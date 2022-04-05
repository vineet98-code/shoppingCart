import React from 'react'
import './Product.css'


const Product = (props) => {
    const { username, title, imageUrl, description } = props
    
    return (
        <div className="product">
            <h4 className="product_text"><strong>{title} </strong></h4>
            <img className="product__image" src={imageUrl} alt={username} />
            <p className="product_text">{description}</p>
        </div>
    )
}

export default Product