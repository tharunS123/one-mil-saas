'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../layout';
import {
    Users, Plus, Search, Mail, Phone, Building2,
    MoreVertical, X, Filter, Grid3x3, List, Pencil, Trash2
} from 'lucide-react';

const AVATAR_COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e', '#10b981', '#3b82f6', '#f59e0b'];

export default function ClientsPage() {
    const auth = useAuth();
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [showModal, setShowModal] = useState(false);
    const [editClient, setEditClient] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', status: 'active', notes: '' });
    const [loading, setLoading] = useState(false);

    const fetchClients = async () => {
        if (!auth?.user) return;
        const { data } = await supabase
            .from('clients')
            .select('*')
            .eq('user_id', auth.user.id)
            .order('created_at', { ascending: false });
        setClients(data || []);
    };

    useEffect(() => { fetchClients(); }, [auth?.user]);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

        if (editClient) {
            await supabase.from('clients').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editClient.id);
        } else {
            await supabase.from('clients').insert({ ...form, user_id: auth.user.id, avatar_color: color });
        }
        setShowModal(false);
        setEditClient(null);
        setForm({ name: '', email: '', phone: '', company: '', status: 'active', notes: '' });
        setLoading(false);
        fetchClients();
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this client? This action cannot be undone.')) return;
        await supabase.from('clients').delete().eq('id', id);
        fetchClients();
    };

    const openEdit = (client) => {
        setEditClient(client);
        setForm({ name: client.name, email: client.email || '', phone: client.phone || '', company: client.company || '', status: client.status, notes: client.notes || '' });
        setShowModal(true);
    };

    const filtered = clients.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
            (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase()));
        const matchFilter = filter === 'all' || c.status === filter;
        return matchSearch && matchFilter;
    });

    const statusBadge = (status) => {
        const map = { active: 'badge-success', inactive: 'badge-default', lead: 'badge-info' };
        return <span className={`badge ${map[status] || 'badge-default'}`}>{status}</span>;
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h2 style={{ marginBottom: 4 }}>Clients</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {clients.length} total client{clients.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditClient(null); setForm({ name: '', email: '', phone: '', company: '', status: 'active', notes: '' }); setShowModal(true); }}>
                    <Plus size={16} /> Add Client
                </button>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'var(--bg-glass)', border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-sm)', padding: '8px 14px', flex: 1, maxWidth: 360,
                }}>
                    <Search size={16} color="var(--text-tertiary)" />
                    <input
                        placeholder="Search clients..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.875rem', width: '100%' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: 4, background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', padding: 4, border: '1px solid var(--border-primary)' }}>
                    {['all', 'active', 'inactive', 'lead'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            padding: '6px 14px', borderRadius: 6, fontSize: '0.8125rem', fontWeight: 500,
                            background: filter === f ? 'var(--accent)' : 'transparent',
                            color: filter === f ? 'white' : 'var(--text-secondary)',
                            transition: 'all 0.2s', textTransform: 'capitalize',
                        }}>{f}</button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 4, background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', padding: 4, border: '1px solid var(--border-primary)' }}>
                    <button onClick={() => setViewMode('grid')} className="btn-icon" style={{ background: viewMode === 'grid' ? 'var(--accent-subtle)' : 'transparent', color: viewMode === 'grid' ? 'var(--accent)' : 'var(--text-tertiary)', borderRadius: 6, padding: 6 }}>
                        <Grid3x3 size={16} />
                    </button>
                    <button onClick={() => setViewMode('list')} className="btn-icon" style={{ background: viewMode === 'list' ? 'var(--accent-subtle)' : 'transparent', color: viewMode === 'list' ? 'var(--accent)' : 'var(--text-tertiary)', borderRadius: 6, padding: 6 }}>
                        <List size={16} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {filtered.length === 0 ? (
                <div className="empty-state">
                    <Users size={48} />
                    <h3>No clients found</h3>
                    <p>Add your first client to get started</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-3" style={{ gap: 16 }}>
                    {filtered.map(client => (
                        <div key={client.id} className="card" style={{ cursor: 'default' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div className="avatar avatar-lg" style={{ background: client.avatar_color || '#6366f1' }}>
                                        {client.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                    </div>
                                    <div>
                                        <h4>{client.name}</h4>
                                        {client.company && <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{client.company}</p>}
                                    </div>
                                </div>
                                {statusBadge(client.status)}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                                {client.email && <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}><Mail size={14} /> {client.email}</div>}
                                {client.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}><Phone size={14} /> {client.phone}</div>}
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => openEdit(client)}><Pencil size={14} /> Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(client.id)}><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Client</th><th>Email</th><th>Company</th><th>Status</th><th>Revenue</th><th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(client => (
                                <tr key={client.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className="avatar avatar-sm" style={{ background: client.avatar_color || '#6366f1' }}>{client.name[0]}</div>
                                            <span style={{ fontWeight: 500 }}>{client.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{client.email || '—'}</td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{client.company || '—'}</td>
                                    <td>{statusBadge(client.status)}</td>
                                    <td style={{ fontWeight: 500 }}>${(parseFloat(client.total_revenue) || 0).toLocaleString()}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            <button className="btn-icon btn-ghost" onClick={() => openEdit(client)}><Pencil size={14} /></button>
                                            <button className="btn-icon btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(client.id)}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
                    <div className="modal">
                        <div className="modal-header">
                            <h3>{editClient ? 'Edit Client' : 'Add New Client'}</h3>
                            <button className="btn-icon btn-ghost" onClick={() => setShowModal(false)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="input-group">
                                <label>Name *</label>
                                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Client name" required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="input-group">
                                    <label>Email</label>
                                    <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
                                </div>
                                <div className="input-group">
                                    <label>Phone</label>
                                    <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="input-group">
                                    <label>Company</label>
                                    <input className="input" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
                                </div>
                                <div className="input-group">
                                    <label>Status</label>
                                    <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="lead">Lead</option>
                                    </select>
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Notes</label>
                                <textarea className="input" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any notes about this client..." rows={3} style={{ resize: 'vertical' }} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : editClient ? 'Update Client' : 'Add Client'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
