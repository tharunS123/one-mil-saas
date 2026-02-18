'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../layout';
import {
    FileText, Plus, Search, DollarSign, Calendar,
    X, Send, Eye, Trash2, Download
} from 'lucide-react';

const STATUS_MAP = {
    draft: { className: 'badge-default', label: 'Draft' },
    sent: { className: 'badge-info', label: 'Sent' },
    paid: { className: 'badge-success', label: 'Paid' },
    overdue: { className: 'badge-danger', label: 'Overdue' },
    cancelled: { className: 'badge-default', label: 'Cancelled' },
};

export default function InvoicesPage() {
    const auth = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [showPreview, setShowPreview] = useState(null);
    const [form, setForm] = useState({
        client_id: '', due_date: '', notes: '', tax_rate: 0,
        items: [{ description: '', quantity: 1, unit_price: 0 }],
    });
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        if (!auth?.user) return;
        const uid = auth.user.id;
        const [invRes, clientRes] = await Promise.all([
            supabase.from('invoices').select('*, clients(name, avatar_color, email)').eq('user_id', uid).order('created_at', { ascending: false }),
            supabase.from('clients').select('id, name, email').eq('user_id', uid).order('name'),
        ]);
        setInvoices(invRes.data || []);
        setClients(clientRes.data || []);
    };

    useEffect(() => { fetchData(); }, [auth?.user]);

    const generateInvoiceNumber = () => {
        const num = String(invoices.length + 1).padStart(4, '0');
        return `INV-${num}`;
    };

    const calculateTotal = () => {
        const subtotal = form.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
        const tax = subtotal * (form.tax_rate / 100);
        return { subtotal, tax, total: subtotal + tax };
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { subtotal, tax, total } = calculateTotal();

        const { data: inv, error } = await supabase.from('invoices').insert({
            user_id: auth.user.id,
            client_id: form.client_id || null,
            invoice_number: generateInvoiceNumber(),
            status: 'draft',
            due_date: form.due_date || null,
            subtotal,
            tax_rate: form.tax_rate,
            total,
            notes: form.notes,
        }).select().single();

        if (inv && form.items.length > 0) {
            const items = form.items.filter(i => i.description).map(i => ({
                invoice_id: inv.id,
                description: i.description,
                quantity: i.quantity,
                unit_price: i.unit_price,
                total: i.quantity * i.unit_price,
            }));
            if (items.length > 0) await supabase.from('invoice_items').insert(items);
        }

        setShowModal(false);
        setForm({ client_id: '', due_date: '', notes: '', tax_rate: 0, items: [{ description: '', quantity: 1, unit_price: 0 }] });
        setLoading(false);
        fetchData();
    };

    const updateStatus = async (id, status) => {
        await supabase.from('invoices').update({ status }).eq('id', id);
        fetchData();
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this invoice?')) return;
        await supabase.from('invoice_items').delete().eq('invoice_id', id);
        await supabase.from('invoices').delete().eq('id', id);
        fetchData();
    };

    const addItem = () => setForm({ ...form, items: [...form.items, { description: '', quantity: 1, unit_price: 0 }] });
    const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
    const updateItem = (i, field, value) => {
        const items = [...form.items];
        items[i][field] = field === 'quantity' || field === 'unit_price' ? parseFloat(value) || 0 : value;
        setForm({ ...form, items });
    };

    const filtered = invoices.filter(inv => {
        const matchSearch = inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
            (inv.clients?.name && inv.clients.name.toLowerCase().includes(search.toLowerCase()));
        const matchFilter = filter === 'all' || inv.status === filter;
        return matchSearch && matchFilter;
    });

    const totals = {
        all: invoices.reduce((s, i) => s + parseFloat(i.total || 0), 0),
        paid: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + parseFloat(i.total || 0), 0),
        pending: invoices.filter(i => i.status === 'sent').reduce((s, i) => s + parseFloat(i.total || 0), 0),
        overdue: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + parseFloat(i.total || 0), 0),
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h2 style={{ marginBottom: 4 }}>Invoices</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={16} /> New Invoice
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-4" style={{ gap: 12, marginBottom: 24 }}>
                {[
                    { label: 'Total Invoiced', val: totals.all, color: 'var(--text-primary)' },
                    { label: 'Paid', val: totals.paid, color: 'var(--success)' },
                    { label: 'Pending', val: totals.pending, color: 'var(--warning)' },
                    { label: 'Overdue', val: totals.overdue, color: 'var(--danger)' },
                ].map(s => (
                    <div key={s.label} className="card" style={{ padding: 16 }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: '1.375rem', fontWeight: 700, color: s.color }}>${s.val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'var(--bg-glass)', border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-sm)', padding: '8px 14px', flex: 1, maxWidth: 360,
                }}>
                    <Search size={16} color="var(--text-tertiary)" />
                    <input placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.875rem', width: '100%' }} />
                </div>
                <div style={{ display: 'flex', gap: 4, background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', padding: 4, border: '1px solid var(--border-primary)' }}>
                    {['all', 'draft', 'sent', 'paid', 'overdue'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            padding: '6px 14px', borderRadius: 6, fontSize: '0.8125rem', fontWeight: 500,
                            background: filter === f ? 'var(--accent)' : 'transparent',
                            color: filter === f ? 'white' : 'var(--text-secondary)',
                            transition: 'all 0.2s', textTransform: 'capitalize',
                        }}>{f}</button>
                    ))}
                </div>
            </div>

            {/* Invoice Table */}
            {filtered.length === 0 ? (
                <div className="empty-state">
                    <FileText size={48} />
                    <h3>No invoices found</h3>
                    <p>Create your first invoice to get started</p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr><th>Invoice</th><th>Client</th><th>Status</th><th>Date</th><th>Due Date</th><th>Amount</th><th></th></tr>
                        </thead>
                        <tbody>
                            {filtered.map(inv => (
                                <tr key={inv.id}>
                                    <td style={{ fontWeight: 600 }}>{inv.invoice_number}</td>
                                    <td>
                                        {inv.clients ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div className="avatar avatar-sm" style={{ background: inv.clients.avatar_color || '#6366f1' }}>{inv.clients.name[0]}</div>
                                                <span style={{ color: 'var(--text-secondary)' }}>{inv.clients.name}</span>
                                            </div>
                                        ) : <span style={{ color: 'var(--text-tertiary)' }}>—</span>}
                                    </td>
                                    <td><span className={`badge ${STATUS_MAP[inv.status]?.className}`}>{STATUS_MAP[inv.status]?.label}</span></td>
                                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{new Date(inv.created_at).toLocaleDateString()}</td>
                                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '—'}</td>
                                    <td style={{ fontWeight: 600 }}>${parseFloat(inv.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            {inv.status === 'draft' && <button className="btn btn-sm btn-secondary" onClick={() => updateStatus(inv.id, 'sent')} title="Mark as sent"><Send size={12} /></button>}
                                            {inv.status === 'sent' && <button className="btn btn-sm btn-secondary" onClick={() => updateStatus(inv.id, 'paid')} title="Mark as paid"><DollarSign size={12} /></button>}
                                            <button className="btn-icon btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(inv.id)}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create Invoice Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
                    <div className="modal" style={{ maxWidth: 640 }}>
                        <div className="modal-header">
                            <h3>Create Invoice</h3>
                            <button className="btn-icon btn-ghost" onClick={() => setShowModal(false)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="input-group">
                                    <label>Client</label>
                                    <select className="input" value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })}>
                                        <option value="">Select client</option>
                                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Due Date</label>
                                    <input className="input" type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
                                </div>
                            </div>

                            {/* Line Items */}
                            <div>
                                <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>Line Items</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {form.items.map((item, i) => (
                                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 80px 100px auto', gap: 8, alignItems: 'center' }}>
                                            <input className="input" placeholder="Description" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} />
                                            <input className="input" type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} min="0" step="0.5" />
                                            <input className="input" type="number" placeholder="Price" value={item.unit_price} onChange={e => updateItem(i, 'unit_price', e.target.value)} min="0" step="0.01" />
                                            <button type="button" className="btn-icon btn-ghost" onClick={() => removeItem(i)} style={{ color: 'var(--danger)' }}><X size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" className="btn btn-ghost btn-sm" onClick={addItem} style={{ marginTop: 8 }}>
                                    <Plus size={14} /> Add Item
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="input-group">
                                    <label>Tax Rate (%)</label>
                                    <input className="input" type="number" value={form.tax_rate} onChange={e => setForm({ ...form, tax_rate: parseFloat(e.target.value) || 0 })} min="0" step="0.5" />
                                </div>
                                <div className="input-group">
                                    <label>Notes</label>
                                    <input className="input" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Payment terms..." />
                                </div>
                            </div>

                            {/* Totals */}
                            <div style={{ background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', padding: 16, border: '1px solid var(--border-primary)' }}>
                                {(() => {
                                    const { subtotal, tax, total } = calculateTotal(); return (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                <span>Tax ({form.tax_rate}%)</span><span>${tax.toFixed(2)}</span>
                                            </div>
                                            <div style={{ height: 1, background: 'var(--border-primary)' }} />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 700 }}>
                                                <span>Total</span><span>${total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Invoice'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
