import React, { useEffect, useState } from 'react'
import Gallery from './components/Gallery'
import Details from './components/Details'
import OrderModal from './components/OrderModal'


export default function App() {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)


    useEffect(() => {
        fetch('./data.json')
            .then(res => {
                if (!res.ok) throw new Error('data.json not found')
                return res.json()
            })
            .then(d => setData(d))
            .catch(err => setError(err.message))
    }, [])


    if (error) return <div className="wrap"><p className="error">Error: {error}</p></div>
    if (!data) return <div className="wrap"><p>Loading…</p></div>


    return (
        <div className="wrap">
            <div className="card">
                <h2 className="title">{data.heading}</h2>
                <div className="top">
                    <Gallery images={data.gallery || []} />
                    <Details data={data} onOrder={() => setModalOpen(true)} />
                </div>
            </div>
            <OrderModal open={modalOpen} onClose={() => setModalOpen(false)} data={data} />
        </div>
    )
}