'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard, Users, FolderKanban, FileText, BarChart3,
    Settings, LogOut, ChevronLeft, Zap, Bell, Search,
    ChevronRight, Menu
} from 'lucide-react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Clients', href: '/dashboard/clients' },
    { icon: FolderKanban, label: 'Projects', href: '/dashboard/projects' },
    { icon: FileText, label: 'Invoices', href: '/dashboard/invoices' },
    { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user: u } } = await supabase.auth.getUser();
            setUser(u);
            if (u) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', u.id)
                    .single();
                setProfile(data);
            }
            setLoading(false);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
            if (!session?.user) router.push('/login');
        });

        return () => subscription.unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-primary)',
            }}>
                <div style={{
                    width: 40, height: 40, borderRadius: 10, background: 'var(--gradient-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'pulse-glow 2s ease infinite',
                }}>
                    <Zap size={22} color="white" />
                </div>
            </div>
        );
    }

    const sidebarWidth = collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)';
    const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <AuthContext.Provider value={{ user, profile }}>
            <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
                {/* ─── Sidebar ─── */}
                <aside style={{
                    width: sidebarWidth,
                    transition: 'width 0.3s cubic-bezier(0.22,1,0.36,1)',
                    borderRight: '1px solid var(--border-primary)',
                    background: 'var(--bg-secondary)',
                    display: 'flex', flexDirection: 'column',
                    position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50,
                    overflow: 'hidden',
                }}>
                    {/* Logo area */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between',
                        padding: collapsed ? '16px 0' : '16px 20px',
                        height: 'var(--topbar-height)', borderBottom: '1px solid var(--border-primary)',
                    }}>
                        {!collapsed && (
                            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-accent)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <Zap size={18} color="white" />
                                </div>
                                <span style={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Apex</span>
                            </Link>
                        )}
                        <button onClick={() => setCollapsed(!collapsed)} className="btn-icon btn-ghost" style={{ flexShrink: 0 }}>
                            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        </button>
                    </div>

                    {/* Nav items */}
                    <nav style={{ flex: 1, padding: collapsed ? '12px 8px' : '12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {NAV_ITEMS.map(item => {
                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    style={{
                                        display: 'flex', alignItems: 'center',
                                        gap: 12, padding: collapsed ? '10px 0' : '10px 14px',
                                        justifyContent: collapsed ? 'center' : 'flex-start',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.875rem', fontWeight: 500,
                                        color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                                        background: isActive ? 'var(--accent-subtle)' : 'transparent',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'var(--bg-glass-hover)';
                                            e.currentTarget.style.color = 'var(--text-primary)';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = 'var(--text-secondary)';
                                        }
                                    }}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <item.icon size={20} style={{ flexShrink: 0 }} />
                                    {!collapsed && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div style={{
                        padding: collapsed ? '12px 8px' : '12px 16px',
                        borderTop: '1px solid var(--border-primary)',
                    }}>
                        <div style={{
                            display: 'flex', alignItems: 'center',
                            gap: 10, justifyContent: collapsed ? 'center' : 'flex-start',
                        }}>
                            <div className="avatar" style={{ background: 'var(--accent)', flexShrink: 0, width: 34, height: 34, fontSize: '0.8125rem' }}>
                                {initials}
                            </div>
                            {!collapsed && (
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.8125rem', fontWeight: 600 }} className="truncate">{displayName}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }} className="truncate">{user?.email}</div>
                                </div>
                            )}
                            {!collapsed && (
                                <button onClick={handleLogout} className="btn-icon btn-ghost" title="Sign out" style={{ flexShrink: 0 }}>
                                    <LogOut size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </aside>

                {/* ─── Main Content ─── */}
                <div style={{
                    flex: 1, marginLeft: sidebarWidth,
                    transition: 'margin-left 0.3s cubic-bezier(0.22,1,0.36,1)',
                    display: 'flex', flexDirection: 'column',
                }}>
                    {/* Top bar */}
                    <header style={{
                        height: 'var(--topbar-height)',
                        borderBottom: '1px solid var(--border-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0 28px',
                        background: 'rgba(10,10,15,0.6)',
                        backdropFilter: 'blur(12px)',
                        position: 'sticky', top: 0, zIndex: 40,
                    }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            background: 'var(--bg-glass)', border: '1px solid var(--border-primary)',
                            borderRadius: 'var(--radius-sm)', padding: '8px 14px',
                            width: 300,
                        }}>
                            <Search size={16} color="var(--text-tertiary)" />
                            <input
                                placeholder="Search anything..."
                                style={{
                                    background: 'none', border: 'none', outline: 'none',
                                    color: 'var(--text-primary)', fontSize: '0.8125rem', width: '100%',
                                }}
                            />
                            <kbd style={{
                                fontSize: '0.6875rem', color: 'var(--text-tertiary)',
                                background: 'var(--bg-glass)', padding: '2px 6px', borderRadius: 4,
                                border: '1px solid var(--border-primary)',
                            }}>⌘K</kbd>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button className="btn-icon btn-ghost" style={{ position: 'relative' }}>
                                <Bell size={18} />
                                <div style={{
                                    position: 'absolute', top: 6, right: 6,
                                    width: 7, height: 7, borderRadius: '50%',
                                    background: 'var(--danger)',
                                }} />
                            </button>
                        </div>
                    </header>

                    {/* Page content */}
                    <main style={{ flex: 1, padding: 28 }}>
                        {children}
                    </main>
                </div>
            </div>
        </AuthContext.Provider>
    );
}
