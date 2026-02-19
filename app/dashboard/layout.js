'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard, Users, FolderKanban, FileText, BarChart3,
    Settings, LogOut, ChevronLeft,
    ChevronRight, Bell, Search
} from 'lucide-react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

/* ─── Brand Logo ─── */
function BrandLogo({ height = 18, color = '#000000' }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill={color} height={height} viewBox="0 0 131 34">
            <path fill={color} d="M.36 8.6h16.7v5.6H6.04c-.2 0-.35.16-.35.35v4.9c0 .2.16.35.35.35h11.02v5.6h-5.33c-.2 0-.35.16-.35.35v4.9c0 .2.16.35.35.35h4.98c.2 0 .35-.15.35-.35V25.4h5.34c.2 0 .35-.16.35-.35v-4.9c0-.2-.16-.35-.35-.35h-5.34v-5.6h5.34c.2 0 .35-.16.35-.35v-4.9c0-.2-.16-.35-.35-.35h-5.34V3.35c0-.2-.16-.35-.35-.35H.36c-.2 0-.36.16-.36.35v4.9c0 .2.16.35.36.35ZM44.41 14.7c-.5-.5-1.1-.9-1.76-1.18a5.62 5.62 0 0 0-4.6.17c-.73.37-1.32.91-1.75 1.62h-.17V8.59H34.1v16.83h2.04v-1.81h.17c.21.36.47.67.77.94.31.25.65.48 1.01.67.37.18.77.31 1.18.39a6.2 6.2 0 0 0 3.39-.24 5.36 5.36 0 0 0 3.02-3.1c.29-.75.44-1.62.44-2.6v-.47c0-.96-.16-1.83-.47-2.58-.3-.75-.7-1.4-1.23-1.9v-.01Zm-5.87.66a3.9 3.9 0 0 1 4.34.84c.36.35.64.8.83 1.3.2.5.3 1.07.3 1.7v.47c0 .64-.1 1.23-.3 1.74a3.75 3.75 0 0 1-2.06 2.15 4.27 4.27 0 0 1-3.12-.03 3.86 3.86 0 0 1-2.09-2.2c-.2-.52-.3-1.11-.3-1.75v-.29c0-.62.1-1.2.3-1.7v-.01c.21-.53.5-.99.84-1.36.36-.37.78-.66 1.26-.86ZM97.04 8.59H95v4.86h-2.94v1.86H95v8.17c0 .56.17 1.03.53 1.4.37.35.84.54 1.4.54h4.18v-1.87h-3.5c-.2 0-.33-.05-.43-.15-.1-.1-.14-.27-.14-.49v-7.6h4.65v-1.86h-4.65V8.59ZM114.61 15a5.48 5.48 0 0 0-1.8-1.33 5.6 5.6 0 0 0-2.57-.56 6.17 6.17 0 0 0-4.26 1.7 5.6 5.6 0 0 0-1.72 4.2v.57c0 .9.15 1.75.44 2.5a5.58 5.58 0 0 0 5.5 3.67c1.55 0 2.8-.35 3.72-1.04a5.35 5.35 0 0 0 1.91-2.73l.03-.07-1.94-.52-.02.07c-.11.33-.27.64-.46.94-.17.27-.4.52-.7.74-.28.22-.63.39-1.04.51-.41.13-.9.19-1.46.19a3.8 3.8 0 0 1-2.84-1.05 4.07 4.07 0 0 1-1.1-2.7h9.68v-1.6c0-.54-.11-1.12-.34-1.75a5.04 5.04 0 0 0-1.03-1.74Zm-8.25 3.21a3.8 3.8 0 0 1 1.22-2.25 4.19 4.19 0 0 1 3.99-.7c.44.16.83.38 1.17.66.34.27.62.62.82 1.02.21.38.34.8.38 1.27h-7.58ZM129.09 14.42a4.47 4.47 0 0 0-3.37-1.3c-.93 0-1.73.2-2.4.59-.64.39-1.15.97-1.52 1.74h-.17v-2h-2.04v11.97h2.04v-6.23c0-1.26.32-2.28.95-3.02a3.31 3.31 0 0 1 2.65-1.14c.94 0 1.7.3 2.24.9.56.6.83 1.52.83 2.74v6.75h2.04v-7.13c0-1.71-.42-3.02-1.25-3.87ZM88.1 15a5.48 5.48 0 0 0-1.78-1.33 5.6 5.6 0 0 0-2.58-.56 6.17 6.17 0 0 0-4.27 1.7 5.59 5.59 0 0 0-1.71 4.2v.56c0 .92.14 1.76.44 2.51a5.6 5.6 0 0 0 5.5 3.67c1.55 0 2.8-.35 3.72-1.04a5.36 5.36 0 0 0 1.91-2.73l.03-.07-1.94-.52-.03.07c-.1.32-.26.64-.45.94-.17.27-.4.52-.7.74-.29.21-.64.39-1.05.51-.4.12-.9.19-1.45.19a3.8 3.8 0 0 1-2.85-1.05 4.07 4.07 0 0 1-1.09-2.7h9.68v-1.61c0-.53-.12-1.12-.34-1.74A5.03 5.03 0 0 0 88.1 15Zm-8.24 3.21a3.83 3.83 0 0 1 1.22-2.25 4.2 4.2 0 0 1 3.99-.7c.44.16.83.38 1.16.66.35.27.62.62.83 1.02.2.38.33.8.37 1.27h-7.57ZM73.65 19.42a6.11 6.11 0 0 0-3.23-1.02 6.63 6.63 0 0 1-2.68-.58c-.47-.3-.7-.7-.7-1.25 0-.27.08-.5.21-.7.14-.2.33-.38.56-.52a4.05 4.05 0 0 1 1.78-.42c.85 0 1.54.21 2.06.63.53.41.83 1 .91 1.73l.01.1 1.95-.47-.01-.07c-.07-.45-.22-.91-.45-1.36a3.46 3.46 0 0 0-.94-1.2 4.6 4.6 0 0 0-1.52-.84 6.05 6.05 0 0 0-2.1-.34c-.58 0-1.13.07-1.65.22-.52.14-1 .36-1.43.65-.41.3-.74.66-.99 1.1a2.9 2.9 0 0 0-.37 1.49v.14c0 1.06.38 1.87 1.14 2.42a6.2 6.2 0 0 0 3.24.97c1.18.08 2.04.26 2.56.54.5.28.75.72.75 1.36 0 .6-.25 1.06-.78 1.4-.52.32-1.22.48-2.1.48a3.68 3.68 0 0 1-2.46-.79 3.13 3.13 0 0 1-1.04-2.14v-.09l-1.93.46h-.02v.07a4.4 4.4 0 0 0 3.1 4c.7.24 1.52.36 2.46.36.7 0 1.35-.09 1.93-.27.6-.16 1.12-.4 1.53-.72A3.38 3.38 0 0 0 74.8 22v-.14c0-1.07-.39-1.9-1.14-2.44ZM60.25 23.4c-.1-.1-.14-.27-.14-.49v-9.46h-2.05v1.85h-.16a3.78 3.78 0 0 0-1.61-1.63 4.62 4.62 0 0 0-2.26-.56c-.77 0-1.5.14-2.19.41a5.27 5.27 0 0 0-3.02 3.12c-.29.75-.44 1.63-.44 2.6v.38c0 .99.15 1.87.44 2.63.3.75.7 1.4 1.2 1.93a5.48 5.48 0 0 0 4.05 1.57c.8 0 1.51-.2 2.2-.58.69-.38 1.24-.97 1.63-1.75h.16v.06c0 .56.18 1.03.53 1.4.37.35.85.54 1.41.54h1.36v-1.87h-.68c-.2 0-.34-.05-.43-.15Zm-4.46.13c-.46.2-.97.3-1.52.3a3.68 3.68 0 0 1-2.75-1.09 4.42 4.42 0 0 1-1.05-3.12v-.38c0-.62.1-1.2.29-1.71a3.65 3.65 0 0 1 5-2.17c.47.2.88.49 1.21.86.35.37.62.83.8 1.36.2.5.3 1.08.3 1.7v.3c0 .63-.1 1.23-.3 1.76-.18.5-.45.96-.78 1.33-.33.37-.73.66-1.2.86Z" />
        </svg>
    );
}

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
                    width: 40, height: 40, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    animation: 'pulse-glow 2s ease infinite',
                    border: '1px solid var(--border-secondary)',
                }}>
                    <BrandLogo height={16} color="#000000" />
                </div>
            </div>
        );
    }

    const sidebarWidth = collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)';
    const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <AuthContext.Provider value={{ user, profile }}>
            <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
                {/* ─── Sidebar ─── */}
                <aside style={{
                    width: sidebarWidth,
                    transition: 'width 0.25s ease',
                    borderRight: '1px solid var(--border-primary)',
                    background: 'var(--bg-primary)',
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
                                <BrandLogo height={18} color="#000000" />
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
                                        fontSize: '0.8125rem', fontWeight: 600,
                                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        background: isActive ? 'var(--accent-subtle)' : 'transparent',
                                        borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                                        transition: 'all 0.15s',
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
                                    <item.icon size={18} style={{ flexShrink: 0 }} />
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
                            <div className="avatar" style={{ background: 'var(--accent)', flexShrink: 0, width: 34, height: 34, fontSize: '0.75rem', fontWeight: 800, color: '#000' }}>
                                {initials}
                            </div>
                            {!collapsed && (
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.8125rem', fontWeight: 700 }} className="truncate">{displayName}</div>
                                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }} className="truncate">{user?.email}</div>
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
                    transition: 'margin-left 0.25s ease',
                    display: 'flex', flexDirection: 'column',
                }}>
                    {/* Top bar */}
                    <header style={{
                        height: 'var(--topbar-height)',
                        borderBottom: '1px solid var(--border-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0 28px',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(12px)',
                        position: 'sticky', top: 0, zIndex: 40,
                    }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
                            padding: '8px 14px',
                            width: 300,
                        }}>
                            <Search size={16} color="var(--text-tertiary)" />
                            <input
                                placeholder="Search anything..."
                                style={{
                                    background: 'none', border: 'none', outline: 'none',
                                    color: 'var(--text-primary)', fontSize: '0.75rem', width: '100%',
                                    fontFamily: 'inherit',
                                }}
                            />
                            <kbd style={{
                                fontSize: '0.625rem', color: 'var(--text-tertiary)',
                                background: 'var(--bg-primary)', padding: '2px 6px',
                                border: '1px solid var(--border-primary)',
                                fontFamily: 'inherit', fontWeight: 600,
                            }}>⌘K</kbd>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button className="btn-icon btn-ghost" style={{ position: 'relative' }}>
                                <Bell size={18} />
                                <div style={{
                                    position: 'absolute', top: 6, right: 6,
                                    width: 7, height: 7, borderRadius: '50%',
                                    background: 'var(--accent)',
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
