'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './layout';
import {
    DollarSign, Users, FolderKanban, FileText,
    TrendingUp, TrendingDown, ArrowUpRight, Plus,
    Clock, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import Link from 'next/link';

// Demo chart data
const REVENUE_DATA = [
    { month: 'Jan', revenue: 4200, target: 5000 },
    { month: 'Feb', revenue: 5800, target: 5500 },
    { month: 'Mar', revenue: 4900, target: 6000 },
    { month: 'Apr', revenue: 7200, target: 6500 },
    { month: 'May', revenue: 6800, target: 7000 },
    { month: 'Jun', revenue: 9400, target: 7500 },
    { month: 'Jul', revenue: 8100, target: 8000 },
    { month: 'Aug', revenue: 11200, target: 8500 },
    { month: 'Sep', revenue: 10500, target: 9000 },
    { month: 'Oct', revenue: 12800, target: 9500 },
    { month: 'Nov', revenue: 11900, target: 10000 },
    { month: 'Dec', revenue: 14500, target: 10500 },
];

const RECENT_ACTIVITY = [
    { action: 'Invoice #INV-0042 was paid', entity: 'PixelCraft Studio', type: 'success', time: '2 hours ago' },
    { action: 'New project created', entity: 'Brand Redesign', type: 'info', time: '4 hours ago' },
    { action: 'Client onboarded', entity: 'Meridian Corp', type: 'accent', time: '6 hours ago' },
    { action: 'Invoice #INV-0041 sent', entity: 'Apex Holdings', type: 'warning', time: '1 day ago' },
    { action: 'Project completed', entity: 'Website Redesign', type: 'success', time: '2 days ago' },
];

const AI_INSIGHTS = [
    { title: 'Revenue Trend', desc: 'Revenue is up 23% this quarter. Your top client contributes 35% of total revenue.', type: 'positive' },
    { title: 'Churn Risk', desc: 'TechFlow Inc hasn\'t had activity in 45 days. Consider reaching out.', type: 'warning' },
    { title: 'Invoice Alert', desc: '3 invoices totaling $12,400 are overdue. Send follow-ups to reduce aging.', type: 'danger' },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
        <div style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)',
            borderRadius: 'var(--radius-sm)', padding: '12px 16px',
            boxShadow: 'var(--shadow-lg)',
        }}>
            <p style={{ fontWeight: 600, fontSize: '0.8125rem', marginBottom: 8 }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ fontSize: '0.8125rem', color: p.color, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
                    {p.name}: ${p.value.toLocaleString()}
                </p>
            ))}
        </div>
    );
};

export default function DashboardPage() {
    const auth = useAuth();
    const [stats, setStats] = useState({ clients: 0, projects: 0, invoices: 0, revenue: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            if (!auth?.user) return;
            const uid = auth.user.id;

            const [clientsRes, projectsRes, invoicesRes] = await Promise.all([
                supabase.from('clients').select('id', { count: 'exact' }).eq('user_id', uid),
                supabase.from('projects').select('id', { count: 'exact' }).eq('user_id', uid),
                supabase.from('invoices').select('total, status').eq('user_id', uid),
            ]);

            const paidTotal = (invoicesRes.data || [])
                .filter(i => i.status === 'paid')
                .reduce((sum, i) => sum + (parseFloat(i.total) || 0), 0);

            setStats({
                clients: clientsRes.count || 0,
                projects: projectsRes.count || 0,
                invoices: (invoicesRes.data || []).filter(i => i.status !== 'paid' && i.status !== 'cancelled').length,
                revenue: paidTotal,
            });
        };
        fetchStats();
    }, [auth?.user]);

    const KPI_CARDS = [
        { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, change: '+23%', positive: true, icon: DollarSign, color: '#10b981' },
        { label: 'Active Clients', value: stats.clients.toString(), change: '+5', positive: true, icon: Users, color: '#6366f1' },
        { label: 'Open Projects', value: stats.projects.toString(), change: '+2', positive: true, icon: FolderKanban, color: '#3b82f6' },
        { label: 'Pending Invoices', value: stats.invoices.toString(), change: '$18.2K', positive: false, icon: FileText, color: '#f59e0b' },
    ];

    const greeting = (() => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    })();

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ marginBottom: 4 }}>{greeting}, {auth?.profile?.full_name?.split(' ')[0] || 'there'} 👋</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                    Here&apos;s what&apos;s happening with your business today.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-4" style={{ gap: 16, marginBottom: 24 }}>
                {KPI_CARDS.map((kpi, i) => (
                    <div key={kpi.label} className="card" style={{
                        display: 'flex', flexDirection: 'column', gap: 12,
                        animationDelay: `${i * 0.05}s`,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 10,
                                background: `${kpi.color}15`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <kpi.icon size={20} color={kpi.color} />
                            </div>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 4,
                                fontSize: '0.75rem', fontWeight: 500,
                                color: kpi.positive ? 'var(--success)' : 'var(--warning)',
                            }}>
                                {kpi.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                {kpi.change}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{kpi.value}</div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{kpi.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                {/* Revenue Chart */}
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4>Revenue Overview</h4>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 2 }}>Monthly revenue vs target</p>
                        </div>
                        <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }} /> Revenue
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#a855f7' }} /> Target
                            </span>
                        </div>
                    </div>
                    <div style={{ padding: '16px 16px 8px', height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={REVENUE_DATA}>
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#a855f7" stopOpacity={0.15} />
                                        <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#5c5c72', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5c5c72', fontSize: 12 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="target" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#targetGradient)" name="Target" />
                                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGradient)" name="Revenue" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI Insights */}
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Sparkles size={18} color="var(--accent)" />
                        <h4>AI Insights</h4>
                    </div>
                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {AI_INSIGHTS.map((insight, i) => (
                            <div key={i} style={{
                                padding: '14px 16px', borderRadius: 'var(--radius-sm)',
                                background: insight.type === 'positive' ? 'var(--success-subtle)' :
                                    insight.type === 'warning' ? 'var(--warning-subtle)' : 'var(--danger-subtle)',
                                border: `1px solid ${insight.type === 'positive' ? 'rgba(16,185,129,0.15)' :
                                    insight.type === 'warning' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)'}`,
                            }}>
                                <div style={{
                                    fontWeight: 600, fontSize: '0.8125rem', marginBottom: 4,
                                    color: insight.type === 'positive' ? 'var(--success)' :
                                        insight.type === 'warning' ? 'var(--warning)' : 'var(--danger)',
                                }}>{insight.title}</div>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{insight.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card" style={{ marginTop: 20, padding: 0 }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>Recent Activity</h4>
                    <Link href="/dashboard/analytics" className="btn btn-ghost btn-sm" style={{ gap: 4 }}>
                        View All <ArrowUpRight size={14} />
                    </Link>
                </div>
                <div>
                    {RECENT_ACTIVITY.map((activity, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px',
                            borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid var(--border-primary)' : 'none',
                        }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                background: activity.type === 'success' ? 'var(--success-subtle)' :
                                    activity.type === 'warning' ? 'var(--warning-subtle)' :
                                        activity.type === 'info' ? 'var(--info-subtle)' : 'var(--accent-subtle)',
                            }}>
                                {activity.type === 'success' ? <CheckCircle2 size={16} color="var(--success)" /> :
                                    activity.type === 'warning' ? <AlertCircle size={16} color="var(--warning)" /> :
                                        <Clock size={16} color="var(--info)" />}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{activity.action}</div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{activity.entity}</div>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', flexShrink: 0 }}>{activity.time}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 20 }}>
                {[
                    { label: 'Add Client', icon: Users, href: '/dashboard/clients', color: '#6366f1' },
                    { label: 'New Project', icon: FolderKanban, href: '/dashboard/projects', color: '#8b5cf6' },
                    { label: 'Create Invoice', icon: FileText, href: '/dashboard/invoices', color: '#a855f7' },
                ].map(action => (
                    <Link key={action.label} href={action.href} className="card" style={{
                        display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                    }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 10,
                            background: `${action.color}15`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Plus size={20} color={action.color} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{action.label}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Quick action</div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
