import React, { useState } from 'react'
export default function Details({ data, onOrder }) {
    const [size, setSize] = useState(data.sizes && data.sizes[0])
    return (
        <div className="details">
            <div className="row">
                <div className="price">Price: <strong>{data.price}</strong></div>
                <div className="size">
                    <label>Available Sizes:</label>
                    <select value={size} onChange={e => setSize(e.target.value)}>
                        {(data.sizes || []).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
            <p className="contact">Contact: <strong>{data.contact}</strong></p>
            <div className="desc">
                {data.description.split('\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="actions">
                <button className="btn primary" onClick={onOrder}>Place Order</button>
            </div>
        </div>
    )
}