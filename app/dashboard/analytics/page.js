'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../layout';
import {
    BarChart3, TrendingUp, DollarSign, Users, Target,
    ArrowUpRight, ArrowDownRight, Sparkles
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const MONTHLY_DATA = [
    { month: 'Jan', revenue: 4200, expenses: 2800 },
    { month: 'Feb', revenue: 5800, expenses: 3200 },
    { month: 'Mar', revenue: 4900, expenses: 2900 },
    { month: 'Apr', revenue: 7200, expenses: 3500 },
    { month: 'May', revenue: 6800, expenses: 3800 },
    { month: 'Jun', revenue: 9400, expenses: 4100 },
    { month: 'Jul', revenue: 8100, expenses: 3600 },
    { month: 'Aug', revenue: 11200, expenses: 4500 },
    { month: 'Sep', revenue: 10500, expenses: 4200 },
    { month: 'Oct', revenue: 12800, expenses: 4800 },
    { month: 'Nov', revenue: 11900, expenses: 4600 },
    { month: 'Dec', revenue: 14500, expenses: 5200 },
];

const CLIENT_REVENUE = [
    { name: 'PixelCraft', revenue: 28500 },
    { name: 'Meridian', revenue: 22300 },
    { name: 'Apex Holdings', revenue: 18900 },
    { name: 'BoldAgency', revenue: 15600 },
    { name: 'TechFlow', revenue: 12400 },
    { name: 'Others', revenue: 26800 },
];

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#3b82f6', '#1e293b'];

const PROJECT_STATUS = [
    { name: 'Completed', value: 8, color: '#10b981' },
    { name: 'In Progress', value: 5, color: '#6366f1' },
    { name: 'Planning', value: 3, color: '#3b82f6' },
    { name: 'On Hold', value: 2, color: '#f59e0b' },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
        <div style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)',
            borderRadius: 'var(--radius-sm)', padding: '12px 16px', boxShadow: 'var(--shadow-lg)',
        }}>
            <p style={{ fontWeight: 600, fontSize: '0.8125rem', marginBottom: 6 }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ fontSize: '0.8125rem', color: p.color, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
                    {p.name}: ${p.value.toLocaleString()}
                </p>
            ))}
        </div>
    );
};

export default function AnalyticsPage() {
    const auth = useAuth();
    const [stats, setStats] = useState({ totalRevenue: 124500, avgDeal: 8200, growthRate: 23, activeClients: 48 });

    useEffect(() => {
        const fetchStats = async () => {
            if (!auth?.user) return;
            const { data: invoices } = await supabase.from('invoices').select('total, status').eq('user_id', auth.user.id);
            const { count: clientCount } = await supabase.from('clients').select('id', { count: 'exact' }).eq('user_id', auth.user.id);

            const paidTotal = (invoices || []).filter(i => i.status === 'paid').reduce((s, i) => s + (parseFloat(i.total) || 0), 0);
            const paidCount = (invoices || []).filter(i => i.status === 'paid').length;

            if (paidTotal > 0) {
                setStats({
                    totalRevenue: paidTotal,
                    avgDeal: paidCount > 0 ? Math.round(paidTotal / paidCount) : 0,
                    growthRate: 23,
                    activeClients: clientCount || 0,
                });
            }
        };
        fetchStats();
    }, [auth?.user]);

    const KPI_CARDS = [
        { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, change: '+23%', positive: true, icon: DollarSign, color: '#10b981' },
        { label: 'Average Deal Size', value: `$${stats.avgDeal.toLocaleString()}`, change: '+12%', positive: true, icon: Target, color: '#6366f1' },
        { label: 'Growth Rate', value: `${stats.growthRate}%`, change: '+5%', positive: true, icon: TrendingUp, color: '#8b5cf6' },
        { label: 'Active Clients', value: stats.activeClients.toString(), change: '+8', positive: true, icon: Users, color: '#3b82f6' },
    ];

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ marginBottom: 4 }}>Analytics</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Track your business performance and revenue insights</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-4" style={{ gap: 16, marginBottom: 24 }}>
                {KPI_CARDS.map(kpi => (
                    <div key={kpi.label} className="card" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 10, background: `${kpi.color}15`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <kpi.icon size={20} color={kpi.color} />
                            </div>
                            <span style={{
                                display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 500,
                                color: kpi.positive ? 'var(--success)' : 'var(--danger)',
                            }}>
                                {kpi.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {kpi.change}
                            </span>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{kpi.value}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{kpi.label}</div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
                {/* Revenue vs Expenses */}
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-primary)' }}>
                        <h4>Revenue vs Expenses</h4>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 2 }}>Monthly comparison</p>
                    </div>
                    <div style={{ padding: 16, height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MONTHLY_DATA} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#5c5c72', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5c5c72', fontSize: 12 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Revenue" />
                                <Bar dataKey="expenses" fill="#1e293b" radius={[4, 4, 0, 0]} name="Expenses" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Project Status */}
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-primary)' }}>
                        <h4>Project Status</h4>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 2 }}>Current breakdown</p>
                    </div>
                    <div style={{ padding: 16, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={PROJECT_STATUS} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                                    {PROJECT_STATUS.map((entry, i) => <Cell key={i} fill={entry.color} stroke="transparent" />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', borderRadius: 8, fontSize: '0.8125rem' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ padding: '0 24px 20px', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                        {PROJECT_STATUS.map(s => (
                            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                                {s.name} ({s.value})
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Revenue by Client */}
            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-primary)' }}>
                    <h4>Revenue by Client</h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 2 }}>Top clients by revenue contribution</p>
                </div>
                <div style={{ padding: 16, height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={CLIENT_REVENUE} layout="vertical" barSize={20}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#5c5c72', fontSize: 12 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8b8b9e', fontSize: 12 }} width={90} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="revenue" radius={[0, 6, 6, 0]} name="Revenue">
                                {CLIENT_REVENUE.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI Insights */}
            <div className="card" style={{ marginTop: 20, padding: 0 }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Sparkles size={18} color="var(--accent)" />
                    <h4>AI Revenue Forecast</h4>
                </div>
                <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    {[
                        { title: 'Projected Q1 Revenue', value: '$42,500', subtitle: 'Based on current pipeline', color: 'var(--accent)' },
                        { title: 'Expected Growth', value: '+28%', subtitle: 'Quarter over quarter', color: 'var(--success)' },
                        { title: 'Client Lifetime Value', value: '$18,400', subtitle: 'Average across all clients', color: '#8b5cf6' },
                    ].map(insight => (
                        <div key={insight.title} style={{
                            padding: 20, borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-glass)', border: '1px solid var(--border-primary)',
                        }}>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{insight.title}</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', color: insight.color }}>{insight.value}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>{insight.subtitle}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
