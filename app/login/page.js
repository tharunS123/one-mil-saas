'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) {
            setError(err.message);
            setLoading(false);
        } else {
            router.push('/dashboard');
        }
    };

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden',
        }}>
            {/* Background effects */}
            <div style={{
                position: 'absolute', inset: 0, background: 'var(--gradient-hero)', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', top: '30%', left: '20%', width: 300, height: 300,
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06), transparent 70%)',
                filter: 'blur(80px)', pointerEvents: 'none',
            }} />

            <div style={{
                position: 'relative', width: '100%', maxWidth: 420, margin: '0 24px',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 10, background: 'var(--gradient-accent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Zap size={22} color="white" />
                        </div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Apex</span>
                    </Link>
                    <h2 style={{ marginBottom: 8 }}>Welcome back</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Card */}
                <div className="card-glass" style={{ padding: 32 }}>
                    {/* Google OAuth */}
                    <button
                        onClick={handleGoogleLogin}
                        className="btn btn-secondary w-full"
                        style={{ marginBottom: 20, padding: '12px 20px', justifyContent: 'center' }}
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
                        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20,
                        color: 'var(--text-tertiary)', fontSize: '0.8125rem',
                    }}>
                        <div style={{ flex: 1, height: 1, background: 'var(--border-primary)' }} />
                        or
                        <div style={{ flex: 1, height: 1, background: 'var(--border-primary)' }} />
                    </div>

                    {error && (
                        <div style={{
                            padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                            background: 'var(--danger-subtle)', color: 'var(--danger)',
                            fontSize: '0.8125rem', marginBottom: 16,
                        }}>{error}</div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
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
                            {loading ? 'Signing in...' : 'Sign In'} {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>
                </div>

                <p style={{
                    textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-secondary)',
                }}>
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" style={{ color: 'var(--accent)', fontWeight: 500 }}>Create one</Link>
                </p>
            </div>
        </div>
    );
}
