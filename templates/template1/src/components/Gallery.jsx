import React, { useState } from 'react'
export default function Gallery({ images = [] }) {
    const [active, setActive] = useState(0)
    return (
        <div className="gallery">
            <div className="preview">
                {images[active] ? <img src={images[active].url} alt={images[active].alt || ''} /> : <div className="empty">No image</div>}
            </div>
            <div className="thumbs">
                {images.map((img, i) => (
                    <button key={i} className={`thumb ${i === active ? 'active' : ''}`} onClick={() => setActive(i)}>
                        <img src={img.url} alt={img.alt || ''} />
                    </button>
                ))}
            </div>
        </div>
    )
}