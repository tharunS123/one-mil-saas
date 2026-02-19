'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ─── Brand Logo ─── */
function BrandLogo({ height = 20, color = '#000000' }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill={color} height={height} viewBox="0 0 131 34">
            <path fill={color} d="M.36 8.6h16.7v5.6H6.04c-.2 0-.35.16-.35.35v4.9c0 .2.16.35.35.35h11.02v5.6h-5.33c-.2 0-.35.16-.35.35v4.9c0 .2.16.35.35.35h4.98c.2 0 .35-.15.35-.35V25.4h5.34c.2 0 .35-.16.35-.35v-4.9c0-.2-.16-.35-.35-.35h-5.34v-5.6h5.34c.2 0 .35-.16.35-.35v-4.9c0-.2-.16-.35-.35-.35h-5.34V3.35c0-.2-.16-.35-.35-.35H.36c-.2 0-.36.16-.36.35v4.9c0 .2.16.35.36.35ZM44.41 14.7c-.5-.5-1.1-.9-1.76-1.18a5.62 5.62 0 0 0-4.6.17c-.73.37-1.32.91-1.75 1.62h-.17V8.59H34.1v16.83h2.04v-1.81h.17c.21.36.47.67.77.94.31.25.65.48 1.01.67.37.18.77.31 1.18.39a6.2 6.2 0 0 0 3.39-.24 5.36 5.36 0 0 0 3.02-3.1c.29-.75.44-1.62.44-2.6v-.47c0-.96-.16-1.83-.47-2.58-.3-.75-.7-1.4-1.23-1.9v-.01Zm-5.87.66a3.9 3.9 0 0 1 4.34.84c.36.35.64.8.83 1.3.2.5.3 1.07.3 1.7v.47c0 .64-.1 1.23-.3 1.74a3.75 3.75 0 0 1-2.06 2.15 4.27 4.27 0 0 1-3.12-.03 3.86 3.86 0 0 1-2.09-2.2c-.2-.52-.3-1.11-.3-1.75v-.29c0-.62.1-1.2.3-1.7v-.01c.21-.53.5-.99.84-1.36.36-.37.78-.66 1.26-.86ZM97.04 8.59H95v4.86h-2.94v1.86H95v8.17c0 .56.17 1.03.53 1.4.37.35.84.54 1.4.54h4.18v-1.87h-3.5c-.2 0-.33-.05-.43-.15-.1-.1-.14-.27-.14-.49v-7.6h4.65v-1.86h-4.65V8.59ZM114.61 15a5.48 5.48 0 0 0-1.8-1.33 5.6 5.6 0 0 0-2.57-.56 6.17 6.17 0 0 0-4.26 1.7 5.6 5.6 0 0 0-1.72 4.2v.57c0 .9.15 1.75.44 2.5a5.58 5.58 0 0 0 5.5 3.67c1.55 0 2.8-.35 3.72-1.04a5.35 5.35 0 0 0 1.91-2.73l.03-.07-1.94-.52-.02.07c-.11.33-.27.64-.46.94-.17.27-.4.52-.7.74-.28.22-.63.39-1.04.51-.41.13-.9.19-1.46.19a3.8 3.8 0 0 1-2.84-1.05 4.07 4.07 0 0 1-1.1-2.7h9.68v-1.6c0-.54-.11-1.12-.34-1.75a5.04 5.04 0 0 0-1.03-1.74Zm-8.25 3.21a3.8 3.8 0 0 1 1.22-2.25 4.19 4.19 0 0 1 3.99-.7c.44.16.83.38 1.17.66.34.27.62.62.82 1.02.21.38.34.8.38 1.27h-7.58ZM129.09 14.42a4.47 4.47 0 0 0-3.37-1.3c-.93 0-1.73.2-2.4.59-.64.39-1.15.97-1.52 1.74h-.17v-2h-2.04v11.97h2.04v-6.23c0-1.26.32-2.28.95-3.02a3.31 3.31 0 0 1 2.65-1.14c.94 0 1.7.3 2.24.9.56.6.83 1.52.83 2.74v6.75h2.04v-7.13c0-1.71-.42-3.02-1.25-3.87ZM88.1 15a5.48 5.48 0 0 0-1.78-1.33 5.6 5.6 0 0 0-2.58-.56 6.17 6.17 0 0 0-4.27 1.7 5.59 5.59 0 0 0-1.71 4.2v.56c0 .92.14 1.76.44 2.51a5.6 5.6 0 0 0 5.5 3.67c1.55 0 2.8-.35 3.72-1.04a5.36 5.36 0 0 0 1.91-2.73l.03-.07-1.94-.52-.03.07c-.1.32-.26.64-.45.94-.17.27-.4.52-.7.74-.29.21-.64.39-1.05.51-.4.12-.9.19-1.45.19a3.8 3.8 0 0 1-2.85-1.05 4.07 4.07 0 0 1-1.09-2.7h9.68v-1.61c0-.53-.12-1.12-.34-1.74A5.03 5.03 0 0 0 88.1 15Zm-8.24 3.21a3.83 3.83 0 0 1 1.22-2.25 4.2 4.2 0 0 1 3.99-.7c.44.16.83.38 1.16.66.35.27.62.62.83 1.02.2.38.33.8.37 1.27h-7.57ZM73.65 19.42a6.11 6.11 0 0 0-3.23-1.02 6.63 6.63 0 0 1-2.68-.58c-.47-.3-.7-.7-.7-1.25 0-.27.08-.5.21-.7.14-.2.33-.38.56-.52a4.05 4.05 0 0 1 1.78-.42c.85 0 1.54.21 2.06.63.53.41.83 1 .91 1.73l.01.1 1.95-.47-.01-.07c-.07-.45-.22-.91-.45-1.36a3.46 3.46 0 0 0-.94-1.2 4.6 4.6 0 0 0-1.52-.84 6.05 6.05 0 0 0-2.1-.34c-.58 0-1.13.07-1.65.22-.52.14-1 .36-1.43.65-.41.3-.74.66-.99 1.1a2.9 2.9 0 0 0-.37 1.49v.14c0 1.06.38 1.87 1.14 2.42a6.2 6.2 0 0 0 3.24.97c1.18.08 2.04.26 2.56.54.5.28.75.72.75 1.36 0 .6-.25 1.06-.78 1.4-.52.32-1.22.48-2.1.48a3.68 3.68 0 0 1-2.46-.79 3.13 3.13 0 0 1-1.04-2.14v-.09l-1.93.46h-.02v.07a4.4 4.4 0 0 0 3.1 4c.7.24 1.52.36 2.46.36.7 0 1.35-.09 1.93-.27.6-.16 1.12-.4 1.53-.72A3.38 3.38 0 0 0 74.8 22v-.14c0-1.07-.39-1.9-1.14-2.44ZM60.25 23.4c-.1-.1-.14-.27-.14-.49v-9.46h-2.05v1.85h-.16a3.78 3.78 0 0 0-1.61-1.63 4.62 4.62 0 0 0-2.26-.56c-.77 0-1.5.14-2.19.41a5.27 5.27 0 0 0-3.02 3.12c-.29.75-.44 1.63-.44 2.6v.38c0 .99.15 1.87.44 2.63.3.75.7 1.4 1.2 1.93a5.48 5.48 0 0 0 4.05 1.57c.8 0 1.51-.2 2.2-.58.69-.38 1.24-.97 1.63-1.75h.16v.06c0 .56.18 1.03.53 1.4.37.35.85.54 1.41.54h1.36v-1.87h-.68c-.2 0-.34-.05-.43-.15Zm-4.46.13c-.46.2-.97.3-1.52.3a3.68 3.68 0 0 1-2.75-1.09 4.42 4.42 0 0 1-1.05-3.12v-.38c0-.62.1-1.2.29-1.71a3.65 3.65 0 0 1 5-2.17c.47.2.88.49 1.21.86.35.37.62.83.8 1.36.2.5.3 1.08.3 1.7v.3c0 .63-.1 1.23-.3 1.76-.18.5-.45.96-.78 1.33-.33.37-.73.66-1.2.86Z" />
        </svg>
    );
}

export default function SignupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error: err } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (err) {
            setError(err.message);
            setLoading(false);
        } else {
            router.push('/dashboard');
        }
    };

    const handleGoogleSignup = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            background: 'var(--bg-primary)',
        }}>
            {/* Left panel - branding */}
            <div style={{
                flex: '0 0 45%', background: '#000000', color: '#FFFFFF',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                padding: '48px',
            }}>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <BrandLogo height={20} color="#FFFFFF" />
                </Link>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 16, color: '#FFFFFF' }}>
                        Start<br />building<span style={{ color: 'var(--accent)' }}>.</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 320 }}>
                        14-day free trial. No credit card required. Start managing your clients and revenue today.
                    </p>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6875rem' }}>
                    © 2026 Apex. All rights reserved.
                </p>
            </div>

            {/* Right panel - form */}
            <div style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '48px',
            }}>
                <div style={{ width: '100%', maxWidth: 400 }}>
                    <h2 style={{ marginBottom: 8, fontSize: '1.5rem' }}>Create your account</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: 32 }}>
                        Start your 14-day free trial — no credit card required
                    </p>

                    {/* Google OAuth */}
                    <button
                        onClick={handleGoogleSignup}
                        className="btn btn-secondary w-full"
                        style={{ marginBottom: 24, padding: '12px 20px', justifyContent: 'center' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24,
                        color: 'var(--text-tertiary)', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                        <div style={{ flex: 1, height: 1, background: 'var(--border-secondary)' }} />
                        or
                        <div style={{ flex: 1, height: 1, background: 'var(--border-secondary)' }} />
                    </div>

                    {error && (
                        <div style={{
                            padding: '10px 14px',
                            background: 'var(--danger-subtle)', color: 'var(--danger)',
                            fontSize: '0.8125rem', marginBottom: 16,
                            border: '1px solid rgba(229,57,53,0.15)',
                        }}>{error}</div>
                    )}

                    <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} style={{
                                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                                    color: 'var(--text-tertiary)',
                                }} />
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    required
                                    style={{ paddingLeft: 38 }}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{
                                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                                    color: 'var(--text-tertiary)',
                                }} />
                                <input
                                    type="email"
                                    className="input"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    style={{ paddingLeft: 38 }}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{
                                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                                    color: 'var(--text-tertiary)',
                                }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="input"
                                    placeholder="Min 8 characters"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    style={{ paddingLeft: 38, paddingRight: 38 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                        color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer',
                                    }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                            style={{ padding: '12px 20px', marginTop: 4 }}
                        >
                            {loading ? 'Creating account...' : 'Create Account'} {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>

                    <p style={{
                        textAlign: 'center', marginTop: 24, fontSize: '0.8125rem', color: 'var(--text-secondary)',
                    }}>
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: 'var(--text-primary)', fontWeight: 700, borderBottom: '1px solid var(--accent)' }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
