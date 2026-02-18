'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../layout';
import {
    FolderKanban, Plus, Search, Calendar, DollarSign,
    X, MoreVertical, Pencil, Trash2, GripVertical
} from 'lucide-react';

const STATUS_COLORS = {
    planning: { bg: 'var(--info-subtle)', color: 'var(--info)', label: 'Planning' },
    in_progress: { bg: 'var(--accent-subtle)', color: 'var(--accent)', label: 'In Progress' },
    review: { bg: 'var(--warning-subtle)', color: 'var(--warning)', label: 'Review' },
    completed: { bg: 'var(--success-subtle)', color: 'var(--success)', label: 'Completed' },
    on_hold: { bg: 'var(--danger-subtle)', color: 'var(--danger)', label: 'On Hold' },
};

const COLUMNS = ['planning', 'in_progress', 'review', 'completed'];

export default function ProjectsPage() {
    const auth = useAuth();
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editProject, setEditProject] = useState(null);
    const [form, setForm] = useState({
        name: '', description: '', client_id: '', status: 'planning',
        budget: '', deadline: '', progress: 0,
    });
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        if (!auth?.user) return;
        const uid = auth.user.id;
        const [projRes, clientRes] = await Promise.all([
            supabase.from('projects').select('*, clients(name, avatar_color)').eq('user_id', uid).order('created_at', { ascending: false }),
            supabase.from('clients').select('id, name').eq('user_id', uid).order('name'),
        ]);
        setProjects(projRes.data || []);
        setClients(clientRes.data || []);
    };

    useEffect(() => { fetchData(); }, [auth?.user]);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = {
            ...form,
            budget: form.budget ? parseFloat(form.budget) : null,
            progress: parseInt(form.progress) || 0,
            client_id: form.client_id || null,
            deadline: form.deadline || null,
        };

        if (editProject) {
            await supabase.from('projects').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editProject.id);
        } else {
            await supabase.from('projects').insert({ ...payload, user_id: auth.user.id });
        }
        setShowModal(false);
        setEditProject(null);
        setForm({ name: '', description: '', client_id: '', status: 'planning', budget: '', deadline: '', progress: 0 });
        setLoading(false);
        fetchData();
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this project?')) return;
        await supabase.from('projects').delete().eq('id', id);
        fetchData();
    };

    const handleStatusChange = async (id, newStatus) => {
        const progress = newStatus === 'completed' ? 100 : undefined;
        const update = { status: newStatus, updated_at: new Date().toISOString() };
        if (progress !== undefined) update.progress = progress;
        await supabase.from('projects').update(update).eq('id', id);
        fetchData();
    };

    const openEdit = (p) => {
        setEditProject(p);
        setForm({
            name: p.name, description: p.description || '', client_id: p.client_id || '',
            status: p.status, budget: p.budget?.toString() || '', deadline: p.deadline || '', progress: p.progress || 0,
        });
        setShowModal(true);
    };

    const filtered = projects.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h2 style={{ marginBottom: 4 }}>Projects</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditProject(null); setForm({ name: '', description: '', client_id: '', status: 'planning', budget: '', deadline: '', progress: 0 }); setShowModal(true); }}>
                    <Plus size={16} /> New Project
                </button>
            </div>

            {/* Search */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--bg-glass)', border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-sm)', padding: '8px 14px', maxWidth: 360, marginBottom: 24,
            }}>
                <Search size={16} color="var(--text-tertiary)" />
                <input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.875rem', width: '100%' }} />
            </div>

            {/* Kanban Board */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignItems: 'start' }}>
                {COLUMNS.map(col => {
                    const colProjects = filtered.filter(p => p.status === col);
                    const info = STATUS_COLORS[col];
                    return (
                        <div key={col}>
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                marginBottom: 12, padding: '0 4px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: info.color }} />
                                    <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{info.label}</span>
                                </div>
                                <span className="badge badge-default" style={{ fontSize: '0.6875rem' }}>{colProjects.length}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 200 }}>
                                {colProjects.map(p => (
                                    <div key={p.id} className="card" style={{ padding: 16, cursor: 'default' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                            <h4 style={{ fontSize: '0.875rem', lineHeight: 1.4 }}>{p.name}</h4>
                                            <div style={{ display: 'flex', gap: 2 }}>
                                                <button className="btn-icon btn-ghost" style={{ padding: 4 }} onClick={() => openEdit(p)}><Pencil size={12} /></button>
                                                <button className="btn-icon btn-ghost" style={{ padding: 4, color: 'var(--danger)' }} onClick={() => handleDelete(p.id)}><Trash2 size={12} /></button>
                                            </div>
                                        </div>
                                        {p.description && <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>{p.description.slice(0, 80)}{p.description.length > 80 ? '...' : ''}</p>}

                                        {/* Progress */}
                                        <div style={{ marginBottom: 10 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>
                                                <span>Progress</span><span>{p.progress}%</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${p.progress}%` }} />
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            {p.clients?.name ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <div className="avatar avatar-sm" style={{ background: p.clients.avatar_color || '#6366f1', width: 20, height: 20, fontSize: '0.5rem' }}>{p.clients.name[0]}</div>
                                                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{p.clients.name}</span>
                                                </div>
                                            ) : <div />}
                                            {p.deadline && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                                                    <Calendar size={10} /> {new Date(p.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {colProjects.length === 0 && (
                                    <div style={{ padding: '20px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)', border: '1px dashed var(--border-primary)', borderRadius: 'var(--radius-sm)' }}>
                                        No projects
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
                    <div className="modal" style={{ maxWidth: 560 }}>
                        <div className="modal-header">
                            <h3>{editProject ? 'Edit Project' : 'New Project'}</h3>
                            <button className="btn-icon btn-ghost" onClick={() => setShowModal(false)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="input-group">
                                <label>Project Name *</label>
                                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Website Redesign" required />
                            </div>
                            <div className="input-group">
                                <label>Description</label>
                                <textarea className="input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." rows={3} style={{ resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="input-group">
                                    <label>Client</label>
                                    <select className="input" value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })}>
                                        <option value="">No client</option>
                                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Status</label>
                                    <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                        {Object.entries(STATUS_COLORS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="input-group">
                                    <label>Budget ($)</label>
                                    <input className="input" type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} placeholder="10000" />
                                </div>
                                <div className="input-group">
                                    <label>Deadline</label>
                                    <input className="input" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Progress ({form.progress}%)</label>
                                <input type="range" min="0" max="100" value={form.progress} onChange={e => setForm({ ...form, progress: e.target.value })} style={{ width: '100%', accentColor: 'var(--accent)' }} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : editProject ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
