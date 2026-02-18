'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../layout';
import {
    Settings as SettingsIcon, User, Building2, CreditCard,
    Bell, Shield, Save, Check, Crown, Zap, ArrowRight
} from 'lucide-react';

const PLANS = [
    {
        name: 'Starter',
        price: 29,
        features: ['10 clients', '5 projects', 'Basic invoicing', 'Email support'],
        current: false,
    },
    {
        name: 'Pro',
        price: 79,
        features: ['Unlimited clients', 'Unlimited projects', 'AI insights', 'Team (5 seats)', 'Priority support'],
        current: true,
    },
    {
        name: 'Enterprise',
        price: 199,
        features: ['Everything in Pro', 'Unlimited seats', 'API access', 'SSO', 'Dedicated manager'],
        current: false,
    },
];

export default function SettingsPage() {
    const auth = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState({ full_name: '', company_name: '' });
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (auth?.profile) {
            setProfile({
                full_name: auth.profile.full_name || '',
                company_name: auth.profile.company_name || '',
            });
        }
    }, [auth?.profile]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        await supabase.from('profiles').update({
            full_name: profile.full_name,
            company_name: profile.company_name,
            updated_at: new Date().toISOString(),
        }).eq('id', auth.user.id);
        setLoading(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ marginBottom: 4 }}>Settings</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Manage your account preferences</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
                {/* Tabs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                                fontSize: '0.875rem', fontWeight: 500, textAlign: 'left',
                                background: activeTab === tab.id ? 'var(--accent-subtle)' : 'transparent',
                                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
                                transition: 'all 0.2s',
                            }}
                        >
                            <tab.icon size={18} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div>
                    {activeTab === 'profile' && (
                        <div className="card">
                            <h3 style={{ marginBottom: 4 }}>Profile Settings</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 24 }}>Update your personal information</p>

                            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
                                <div className="input-group">
                                    <label>Email</label>
                                    <input className="input" value={auth?.user?.email || ''} disabled style={{ opacity: 0.5 }} />
                                </div>
                                <div className="input-group">
                                    <label>Full Name</label>
                                    <input className="input" value={profile.full_name} onChange={e => setProfile({ ...profile, full_name: e.target.value })} placeholder="John Doe" />
                                </div>
                                <div className="input-group">
                                    <label>Company Name</label>
                                    <input className="input" value={profile.company_name} onChange={e => setProfile({ ...profile, company_name: e.target.value })} placeholder="Acme Inc." />
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {saved ? <><Check size={16} /> Saved!</> : loading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'billing' && (
                        <div>
                            {/* Current Plan */}
                            <div className="card" style={{ marginBottom: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                                    <Crown size={20} color="var(--accent)" />
                                    <h3>Current Plan</h3>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 20 }}>
                                    You are on the <strong style={{ color: 'var(--accent)' }}>Pro</strong> plan
                                </p>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                                    <span style={{ fontSize: '2rem', fontWeight: 800 }}>$79</span>
                                    <span style={{ color: 'var(--text-tertiary)' }}>/month</span>
                                </div>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Next billing date: March 18, 2026</p>
                            </div>

                            {/* Plans */}
                            <div className="grid grid-3" style={{ gap: 16 }}>
                                {PLANS.map(plan => (
                                    <div key={plan.name} className="card" style={{
                                        border: plan.current ? '1px solid var(--accent)' : undefined,
                                        position: 'relative',
                                    }}>
                                        {plan.current && (
                                            <div className="badge badge-accent" style={{ position: 'absolute', top: -8, right: 16, fontSize: '0.6875rem' }}>Current</div>
                                        )}
                                        <h4 style={{ marginBottom: 4 }}>{plan.name}</h4>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>${plan.price}</span>
                                            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>/mo</span>
                                        </div>
                                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                                            {plan.features.map(f => (
                                                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                                    <Check size={14} color="var(--success)" /> {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            className={`btn ${plan.current ? 'btn-secondary' : 'btn-primary'} w-full btn-sm`}
                                            disabled={plan.current}
                                        >
                                            {plan.current ? 'Current Plan' : 'Upgrade'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="card">
                            <h3 style={{ marginBottom: 4 }}>Notification Preferences</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 24 }}>Choose how you want to be notified</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
                                {[
                                    { label: 'Invoice paid', desc: 'Get notified when a client pays an invoice' },
                                    { label: 'New client activity', desc: 'Activity updates from your clients' },
                                    { label: 'Project deadlines', desc: 'Reminders for upcoming project deadlines' },
                                    { label: 'Weekly digest', desc: 'Weekly summary of your business metrics' },
                                    { label: 'Marketing emails', desc: 'Tips, product updates, and offers' },
                                ].map((notif, i) => (
                                    <div key={notif.label} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '14px 0', borderBottom: '1px solid var(--border-primary)',
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{notif.label}</div>
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{notif.desc}</div>
                                        </div>
                                        <label style={{ position: 'relative', width: 44, height: 24, cursor: 'pointer' }}>
                                            <input type="checkbox" defaultChecked={i < 3} style={{ opacity: 0, width: 0, height: 0 }} />
                                            <span style={{
                                                position: 'absolute', inset: 0, borderRadius: 12,
                                                background: i < 3 ? 'var(--accent)' : 'var(--bg-glass)',
                                                border: '1px solid var(--border-primary)', transition: 'all 0.2s',
                                            }}>
                                                <span style={{
                                                    position: 'absolute', top: 2, left: i < 3 ? 22 : 2,
                                                    width: 18, height: 18, borderRadius: '50%',
                                                    background: 'white', transition: 'all 0.2s',
                                                }} />
                                            </span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="card">
                            <h3 style={{ marginBottom: 4 }}>Security Settings</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 24 }}>Manage your account security</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
                                <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-glass)', border: '1px solid var(--border-primary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Two-Factor Authentication</div>
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 2 }}>Add an extra layer of security</div>
                                        </div>
                                        <button className="btn btn-secondary btn-sm">Enable</button>
                                    </div>
                                </div>
                                <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-glass)', border: '1px solid var(--border-primary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Change Password</div>
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 2 }}>Update your password regularly</div>
                                        </div>
                                        <button className="btn btn-secondary btn-sm">Update</button>
                                    </div>
                                </div>
                                <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', background: 'var(--danger-subtle)', border: '1px solid rgba(239,68,68,0.15)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--danger)' }}>Delete Account</div>
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 2 }}>Permanently delete your account and data</div>
                                        </div>
                                        <button className="btn btn-danger btn-sm">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
