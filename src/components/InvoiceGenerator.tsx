import React, { useState, useRef, useCallback } from 'react'
import { Plus, Trash2, Download, Printer, RotateCcw, FileText, Zap } from 'lucide-react'

interface InvoiceItem {
  id: string
  name: string
  description: string
  quantity: number
  unitPrice: number
}

interface InvoiceData {
  companyName: string
  companyAddress: string
  companyEmail: string
  companyPhone: string
  clientName: string
  clientAddress: string
  clientEmail: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  items: InvoiceItem[]
  taxEnabled: boolean
  notes: string
}

const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const generateId = () => Math.random().toString(36).slice(2, 9)

const defaultData: InvoiceData = {
  companyName: 'VOM Industry Group',
  companyAddress: 'Jl. Industri Raya No. 88, Jakarta Selatan 12930',
  companyEmail: 'info@vomindustry.com',
  companyPhone: '+62 21 8888 9999',
  clientName: '',
  clientAddress: '',
  clientEmail: '',
  invoiceNumber: 'INV-001',
  invoiceDate: new Date().toISOString().slice(0, 10),
  dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  items: [
    { id: generateId(), name: '', description: '', quantity: 1, unitPrice: 0 },
  ],
  taxEnabled: false,
  notes: 'Pembayaran dapat dilakukan melalui transfer bank. Terima kasih atas kepercayaan Anda.',
}

function InvoicePreview({ data, previewRef }: { data: InvoiceData; previewRef: React.RefObject<HTMLDivElement | null> }) {
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const tax = data.taxEnabled ? subtotal * 0.11 : 0
  const grandTotal = subtotal + tax

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  return (
    <div
      ref={previewRef}
      id="invoice-preview"
      className="invoice-preview"
      style={{
        width: '100%',
        minHeight: '297mm',
        padding: '40px',
        background: 'white',
        color: '#1e293b',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: '14px' }}>V</span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
              {data.companyName || 'VOM Industry Group'}
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6', maxWidth: '220px' }}>
            {data.companyAddress && <div>{data.companyAddress}</div>}
            {data.companyEmail && <div>{data.companyEmail}</div>}
            {data.companyPhone && <div>{data.companyPhone}</div>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-2px', color: '#0f172a', marginBottom: '4px' }}>
            INVOICE
          </div>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            color: 'white',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}>
            {data.invoiceNumber || 'INV-001'}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, #7c3aed, #4f46e5, #0891b2)',
        borderRadius: '2px',
        marginBottom: '32px',
      }} />

      {/* Date + Client grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7c3aed', marginBottom: '12px' }}>
            Tagihan Kepada
          </div>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a', marginBottom: '4px' }}>{data.clientName || '—'}</div>
          <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
            {data.clientAddress && <div>{data.clientAddress}</div>}
            {data.clientEmail && <div>{data.clientEmail}</div>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7c3aed', marginBottom: '12px' }}>
            Detail Invoice
          </div>
          <div style={{ fontSize: '12px', color: '#475569', lineHeight: '2' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <span style={{ color: '#94a3b8' }}>Tanggal:</span>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>{formatDate(data.invoiceDate)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <span style={{ color: '#94a3b8' }}>Jatuh Tempo:</span>
              <span style={{ fontWeight: 600, color: '#dc2626' }}>{formatDate(data.dueDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 80px 120px 120px',
          gap: '8px',
          padding: '10px 16px',
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          borderRadius: '10px',
          marginBottom: '8px',
        }}>
          {['Produk / Layanan', 'Qty', 'Harga Satuan', 'Total'].map((h) => (
            <div key={h} style={{ fontSize: '10px', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: h === 'Produk / Layanan' ? 'left' : 'right' }}>
              {h}
            </div>
          ))}
        </div>
        {data.items.map((item, idx) => (
          <div
            key={item.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 80px 120px 120px',
              gap: '8px',
              padding: '12px 16px',
              background: idx % 2 === 0 ? 'rgba(124, 58, 237, 0.04)' : 'transparent',
              borderRadius: '8px',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#0f172a' }}>{item.name || '—'}</div>
              {item.description && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{item.description}</div>}
            </div>
            <div style={{ textAlign: 'right', fontSize: '13px', color: '#334155', alignSelf: 'center' }}>{item.quantity}</div>
            <div style={{ textAlign: 'right', fontSize: '13px', color: '#334155', alignSelf: 'center' }}>{formatRupiah(item.unitPrice)}</div>
            <div style={{ textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#0f172a', alignSelf: 'center' }}>{formatRupiah(item.quantity * item.unitPrice)}</div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
        <div style={{ minWidth: '280px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px', color: '#64748b' }}>
            <span>Subtotal</span>
            <span style={{ fontWeight: 500, color: '#334155' }}>{formatRupiah(subtotal)}</span>
          </div>
          {data.taxEnabled && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px', color: '#64748b' }}>
              <span>PPN 11%</span>
              <span style={{ fontWeight: 500, color: '#334155' }}>{formatRupiah(tax)}</span>
            </div>
          )}
          <div style={{
            display: 'flex', justifyContent: 'space-between', padding: '14px 16px',
            marginTop: '8px',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            borderRadius: '10px',
          }}>
            <span style={{ fontWeight: 700, fontSize: '14px', color: 'white' }}>Grand Total</span>
            <span style={{ fontWeight: 800, fontSize: '16px', color: 'white' }}>{formatRupiah(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div style={{
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '10px',
          borderLeft: '3px solid #7c3aed',
          marginBottom: '40px',
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7c3aed', marginBottom: '6px' }}>
            Catatan
          </div>
          <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.7' }}>{data.notes}</div>
        </div>
      )}

      {/* Signature */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ textAlign: 'center', minWidth: '200px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '60px' }}>Hormat kami,</div>
          <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '8px' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{data.companyName || 'VOM Industry Group'}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Authorized Signature</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', textAlign: 'center', fontSize: '10px', color: '#cbd5e1' }}>
        Generated by VOM Industry Group Invoice System
      </div>
    </div>
  )
}

export default function InvoiceGenerator() {
  const [data, setData] = useState<InvoiceData>(defaultData)
  const [isGenerating, setIsGenerating] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const builderRef = useRef<HTMLDivElement>(null)

  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const tax = data.taxEnabled ? subtotal * 0.11 : 0
  const grandTotal = subtotal + tax

  const updateField = useCallback(<K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => {
    setData(prev => ({ ...prev, [field]: value }))
  }, [])

  const addItem = useCallback(() => {
    setData(prev => ({
      ...prev,
      items: [...prev.items, { id: generateId(), name: '', description: '', quantity: 1, unitPrice: 0 }],
    }))
  }, [])

  const removeItem = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }))
  }, [])

  const updateItem = useCallback((id: string, field: keyof InvoiceItem, value: string | number) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item),
    }))
  }, [])

  const handleReset = useCallback(() => {
    setData({ ...defaultData, items: [{ id: generateId(), name: '', description: '', quantity: 1, unitPrice: 0 }] })
  }, [])

  const handleDownloadPDF = useCallback(async () => {
    if (!previewRef.current) return
    setIsGenerating(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const { jsPDF } = await import('jspdf')
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = (canvas.height * pdfW) / canvas.width
      const pageH = pdf.internal.pageSize.getHeight()
      let y = 0
      while (y < pdfH) {
        if (y > 0) pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, -y, pdfW, pdfH)
        y += pageH
      }
      pdf.save(`invoice-${data.invoiceNumber || 'export'}.pdf`)
    } finally {
      setIsGenerating(false)
    }
  }, [data.invoiceNumber])

  const handlePrint = useCallback(() => {
    const content = previewRef.current?.innerHTML
    if (!content) return
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`
      <!DOCTYPE html><html><head>
      <title>Invoice ${data.invoiceNumber}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: white; color: #1e293b; }
        @media print { body { margin: 0; } }
      </style></head>
      <body>${content}</body></html>
    `)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 500)
  }, [data.invoiceNumber])

  return (
    <div className="min-h-screen hero-gradient">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden">
        {/* Orbs */}
        <div className="orb" style={{ width: 600, height: 600, top: '-10%', left: '-15%', background: 'rgba(124, 58, 237, 0.25)', animationDelay: '0s' }} />
        <div className="orb" style={{ width: 400, height: 400, top: '10%', right: '-10%', background: 'rgba(79, 70, 229, 0.2)', animationDelay: '2s' }} />
        <div className="orb" style={{ width: 300, height: 300, bottom: '5%', left: '30%', background: 'rgba(8, 145, 178, 0.15)', animationDelay: '4s' }} />

        <div className="relative z-10 text-center animate-fadeInUp" style={{ maxWidth: '720px' }}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8" style={{ animationDelay: '0.1s' }}>
            <Zap size={13} style={{ color: '#a78bfa' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#c4b5fd', letterSpacing: '0.05em' }}>Invoice Generator</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '1.5rem' }}>
            <span className="gradient-text">VOM Industry</span>
            <br />
            <span style={{ color: '#f8fafc' }}>Group</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'rgba(148, 163, 184, 0.9)', marginBottom: '3rem', lineHeight: 1.6, fontWeight: 400 }}>
            Create beautiful, professional invoices in seconds.<br />
            <span style={{ color: 'rgba(167, 139, 250, 0.8)' }}>Real-time preview. PDF export. Zero friction.</span>
          </p>

          {/* CTA */}
          <button
            onClick={() => builderRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary rounded-2xl px-10 py-4 text-base font-semibold inline-flex items-center gap-3"
          >
            <FileText size={18} />
            <span>Start Creating</span>
          </button>

          {/* Mock preview card */}
          <div className="glass-strong rounded-2xl mt-16 mx-auto overflow-hidden card-hover" style={{ maxWidth: 520 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
              {['#ef4444', '#f59e0b', '#22c55e'].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
              ))}
              <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginLeft: 8 }} />
            </div>
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Invoice #', value: 'INV-2025-001' },
                { label: 'Grand Total', value: 'Rp 22.500.000' },
                { label: 'Client', value: 'PT Maju Bersama' },
                { label: 'Due Date', value: '30 Juni 2025' },
              ].map(item => (
                <div key={item.label} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', animation: 'float 2s ease-in-out infinite' }}>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(139, 92, 246, 0.6), transparent)', margin: '0 auto' }} />
        </div>
      </section>

      {/* Builder */}
      <section ref={builderRef} className="px-4 py-16" style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 24 }} className="lg-grid">

          {/* LEFT: Form */}
          <div className="glass rounded-2xl p-6 card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Company Info */}
            <div>
              <div className="section-title">Informasi Perusahaan</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <FormField label="Nama Perusahaan" value={data.companyName} onChange={v => updateField('companyName', v)} placeholder="VOM Industry Group" />
                <FormField label="Alamat" value={data.companyAddress} onChange={v => updateField('companyAddress', v)} placeholder="Jl. Industri Raya No. 88, Jakarta" textarea />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <FormField label="Email" value={data.companyEmail} onChange={v => updateField('companyEmail', v)} placeholder="info@company.com" type="email" />
                  <FormField label="Telepon" value={data.companyPhone} onChange={v => updateField('companyPhone', v)} placeholder="+62 21 8888 9999" />
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div>
              <div className="section-title">Informasi Klien</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <FormField label="Nama Klien" value={data.clientName} onChange={v => updateField('clientName', v)} placeholder="PT Maju Bersama" />
                <FormField label="Alamat Klien" value={data.clientAddress} onChange={v => updateField('clientAddress', v)} placeholder="Jl. Sudirman No. 1, Jakarta Pusat" textarea />
                <FormField label="Email Klien" value={data.clientEmail} onChange={v => updateField('clientEmail', v)} placeholder="client@company.com" type="email" />
              </div>
            </div>

            {/* Invoice Details */}
            <div>
              <div className="section-title">Detail Invoice</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <FormField label="No. Invoice" value={data.invoiceNumber} onChange={v => updateField('invoiceNumber', v)} placeholder="INV-001" />
                <FormField label="Tanggal" value={data.invoiceDate} onChange={v => updateField('invoiceDate', v)} type="date" />
                <FormField label="Jatuh Tempo" value={data.dueDate} onChange={v => updateField('dueDate', v)} type="date" />
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="section-title">Item / Layanan</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {data.items.map((item, idx) => (
                  <div key={item.id} className="glass rounded-xl p-4 item-row-enter card-hover" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(167,139,250,0.8)', letterSpacing: '0.06em' }}>ITEM #{idx + 1}</span>
                      {data.items.length > 1 && (
                        <button onClick={() => removeItem(item.id)} className="btn-danger rounded-lg p-1.5">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <FormField label="Nama Produk / Layanan" value={item.name} onChange={v => updateItem(item.id, 'name', v)} placeholder="Nama produk atau jasa" />
                      <FormField label="Deskripsi" value={item.description} onChange={v => updateItem(item.id, 'description', v)} placeholder="Deskripsi singkat (opsional)" />
                      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 8 }}>
                        <FormField label="Qty" value={item.quantity} onChange={v => updateItem(item.id, 'quantity', Math.max(0, Number(v)))} type="number" placeholder="1" />
                        <FormField label="Harga Satuan (Rp)" value={item.unitPrice} onChange={v => updateItem(item.id, 'unitPrice', Math.max(0, Number(v)))} type="number" placeholder="0" />
                        <div>
                          <label className="form-label">Total</label>
                          <div className="form-input px-3 py-2.5 text-sm font-semibold" style={{ background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.2)', color: '#c4b5fd', cursor: 'default' }}>
                            {formatRupiah(item.quantity * item.unitPrice)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addItem}
                  className="btn-secondary rounded-xl py-3 w-full flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Plus size={15} />
                  Tambah Item
                </button>
              </div>
            </div>

            {/* Tax */}
            <div>
              <div className="section-title">Pajak</div>
              <div className="glass rounded-xl p-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#f1f5f9' }}>PPN 11%</div>
                  <div style={{ fontSize: '12px', color: 'rgba(148,163,184,0.7)', marginTop: 2 }}>Pajak Pertambahan Nilai</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={data.taxEnabled} onChange={e => updateField('taxEnabled', e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>

            {/* Summary */}
            <div className="glass rounded-xl p-4" style={{ border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(148,163,184,0.8)' }}>
                  <span>Subtotal</span>
                  <span style={{ color: '#e2e8f0' }}>{formatRupiah(subtotal)}</span>
                </div>
                {data.taxEnabled && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(148,163,184,0.8)' }}>
                    <span>PPN 11%</span>
                    <span style={{ color: '#e2e8f0' }}>{formatRupiah(tax)}</span>
                  </div>
                )}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700 }}>
                  <span className="gradient-text">Grand Total</span>
                  <span className="gradient-text">{formatRupiah(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <div className="section-title">Catatan</div>
              <FormField label="Catatan / Syarat Pembayaran" value={data.notes} onChange={v => updateField('notes', v)} placeholder="Catatan untuk klien, cara pembayaran, ucapan terima kasih..." textarea rows={4} />
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="btn-primary rounded-xl py-3 flex flex-col items-center gap-1.5 text-xs font-semibold"
              >
                <Download size={16} />
                <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
              </button>
              <button onClick={handlePrint} className="btn-secondary rounded-xl py-3 flex flex-col items-center gap-1.5 text-xs font-semibold">
                <Printer size={16} />
                <span>Print</span>
              </button>
              <button onClick={handleReset} className="btn-danger rounded-xl py-3 flex flex-col items-center gap-1.5 text-xs font-semibold">
                <RotateCcw size={15} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Preview */}
          <div className="glass rounded-2xl overflow-hidden" style={{ height: 'fit-content', position: 'sticky', top: 24 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(148,163,184,0.8)', letterSpacing: '0.05em' }}>LIVE PREVIEW</span>
            </div>
            <div style={{ padding: '12px', overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
              <div style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
                <InvoicePreview data={data} previewRef={previewRef} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive styles injected */}
      <style>{`
        @media (max-width: 1023px) {
          .lg-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .lg-grid > div:last-child { position: static !important; }
        }
      `}</style>
    </div>
  )
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  textarea = false,
  rows = 2,
}: {
  label: string
  value: string | number
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  textarea?: boolean
  rows?: number
}) {
  const cls = `form-input px-3 py-2.5 text-sm`
  return (
    <div>
      <label className="form-label">{label}</label>
      {textarea ? (
        <textarea
          className={cls}
          value={String(value)}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          style={{ resize: 'vertical', minHeight: rows * 32 }}
        />
      ) : (
        <input
          className={cls}
          type={type}
          value={String(value)}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  )
}
