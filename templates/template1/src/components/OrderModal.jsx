// src/components/OrderModal.jsx
import React, { useState, useEffect } from 'react'

export default function OrderModal({open, onClose, data}) {
  const [form, setForm] = useState({ name:'', address:'', pincode:'', method:'cod', size: (data.sizes && data.sizes[0]) || '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(()=>{
    // reset when opened
    if(open){
      setForm({ name:'', address:'', pincode:'', method:'cod', size: (data.sizes && data.sizes[0]) || '' })
      setMessage(null)
      setLoading(false)
    }
  }, [open, data])

  if(!open) return null

  const setField = (k,v) => setForm(prev => ({...prev, [k]: v}) )

  const validate = () => {
    if(!form.name.trim()) return "Name is required"
    if(!form.address.trim()) return "Address is required"
    if(!form.pincode.trim()) return "Pincode is required"
    if(!form.size) return "Please choose a size"
    return null
  }

  const handleConfirm = async () => {
    const v = validate()
    if(v){ setMessage({ type:'error', text: v }); return }
    setLoading(true)
    setMessage(null)

    const payload = {
      template_id: data.template_id || 'product-card',
      product: {
        heading: data.heading,
        price: data.price
      },
      order: {
        name: form.name,
        address: form.address,
        pincode: form.pincode,
        payment_method: form.method,
        size: form.size,
        quantity: 1,
        contact: data.contact || null
      },
      // optionally include the deployment id or product id if you have one
      metadata: { ts: new Date().toISOString() }
    }

    try {
      const res = await fetch('http://localhost:8080/placeorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if(!res.ok) {
        const text = await res.text().catch(()=>null)
        throw new Error(text || `Server error ${res.status}`)
      }

      const json = await res.json().catch(()=>null)
      setMessage({ type:'success', text: json && json.message ? json.message : 'Order confirmed!' })
      setLoading(false)

      // optionally auto close after a delay
      setTimeout(()=>{ onClose() }, 1400)

    } catch(err){
      console.error("Place order error:", err)
      setMessage({ type:'error', text: err.message || 'Failed to place order' })
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3>Choose Payment & Address</h3>

        <label>Name:</label>
        <input value={form.name} onChange={e=>setField('name', e.target.value)} />

        <label>Delivery Address:</label>
        <textarea value={form.address} onChange={e=>setField('address', e.target.value)} />

        <label>Pincode:</label>
        <input value={form.pincode} onChange={e=>setField('pincode', e.target.value)} />

        <label>Size:</label>
        <select value={form.size} onChange={e=>setField('size', e.target.value)}>
          {(data.sizes||[]).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <label>Payment Method:</label>
        <div className="pay-row">
          <button className={`chip ${form.method==='cod'? 'sel':''}`} onClick={()=>setField('method','cod')}>Cash on Delivery</button>
          <button className={`chip ${form.method==='upi'? 'sel':''}`} onClick={()=>setField('method','upi')}>UPI Payment</button>
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Placing...' : 'Confirm Order'}
          </button>
        </div>

        {message && (
          <div style={{ marginTop: 12, color: message.type === 'error' ? 'crimson' : 'green' }}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}
