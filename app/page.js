'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap, BarChart3, Users, FileText, ArrowRight, Check,
  Shield, TrendingUp, Globe, Star, ChevronRight, Sparkles,
  Layout, CreditCard, PieChart, Clock
} from 'lucide-react';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
];

const FEATURES = [
  {
    icon: Users,
    title: 'Client Management',
    desc: 'Organize clients, track relationships, and manage contacts in one intelligent CRM.',
    color: '#6366f1',
  },
  {
    icon: Layout,
    title: 'Project Tracking',
    desc: 'Kanban boards, task management, and real-time progress tracking for every project.',
    color: '#8b5cf6',
  },
  {
    icon: FileText,
    title: 'Smart Invoicing',
    desc: 'Create, send, and track invoices with automated reminders and payment tracking.',
    color: '#a855f7',
  },
  {
    icon: PieChart,
    title: 'Revenue Analytics',
    desc: 'AI-powered insights into revenue trends, client profitability, and growth opportunities.',
    color: '#6366f1',
  },
  {
    icon: Clock,
    title: 'Time Tracking',
    desc: 'Log billable hours, generate timesheets, and automate billing workflows.',
    color: '#8b5cf6',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    desc: 'Bank-grade encryption, SOC 2 compliance, and role-based access controls.',
    color: '#a855f7',
  },
];

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: 29,
    desc: 'Perfect for freelancers getting started',
    features: ['Up to 10 clients', '5 active projects', 'Basic invoicing', 'Revenue dashboard', 'Email support'],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Pro',
    price: 79,
    desc: 'For growing agencies and consultants',
    features: ['Unlimited clients', 'Unlimited projects', 'Advanced invoicing & automation', 'AI-powered insights', 'Team collaboration (5 seats)', 'Priority support', 'Custom branding'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 199,
    desc: 'For large teams with advanced needs',
    features: ['Everything in Pro', 'Unlimited team seats', 'Advanced analytics & forecasting', 'API access', 'SSO & SAML', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Founder, PixelCraft Studio',
    text: 'Apex completely transformed how we manage client relationships. Revenue is up 40% since we started using it.',
    avatar: '#6366f1',
  },
  {
    name: 'Marcus Johnson',
    role: 'Creative Director, BoldAgency',
    text: 'The AI insights are like having a virtual CFO. We spotted a churn risk early and saved a $50K account.',
    avatar: '#8b5cf6',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Freelance Consultant',
    text: 'I went from spreadsheets to Apex and saved 10+ hours a week. The invoicing alone is worth the price.',
    avatar: '#a855f7',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* ─── Navbar ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-primary)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64,
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={18} color="white" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Apex</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} style={{
                fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)',
                transition: 'color 0.2s', cursor: 'pointer',
              }}
                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >{link.label}</a>
            ))}
            <Link href="/login" style={{
              fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)',
              transition: 'color 0.2s',
            }}>Sign in</Link>
            <Link href="/signup" className="btn btn-primary btn-sm">
              Get Started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section style={{
        position: 'relative', paddingTop: 160, paddingBottom: 120,
        overflow: 'hidden', textAlign: 'center',
      }}>
        {/* Background meshes */}
        <div style={{
          position: 'absolute', inset: 0, background: 'var(--gradient-hero)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '20%', left: '10%', width: 400, height: 400,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '15%', width: 300, height: 300,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.06), transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px',
              borderRadius: 'var(--radius-full)', background: 'var(--accent-subtle)',
              border: '1px solid rgba(99,102,241,0.2)', marginBottom: 24,
              fontSize: '0.8125rem', fontWeight: 500, color: 'var(--accent-hover)',
            }}
          >
            <Sparkles size={14} /> Now with AI-Powered Insights
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 20 }}
          >
            Manage Clients.{' '}
            <span style={{
              background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Track Revenue.
            </span>
            <br />Grow Your Business.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            style={{
              fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: 560,
              margin: '0 auto 36px', lineHeight: 1.7,
            }}
          >
            The all-in-one platform for agencies and freelancers to manage clients,
            track projects, send invoices, and unlock AI-driven revenue insights.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link href="/signup" className="btn btn-primary btn-lg" style={{ fontSize: '1rem' }}>
              Start Free — 14 Day Trial <ArrowRight size={16} />
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg" style={{ fontSize: '1rem' }}>
              See How It Works
            </a>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            style={{
              display: 'flex', gap: 24, justifyContent: 'center', marginTop: 32,
              fontSize: '0.8125rem', color: 'var(--text-tertiary)',
            }}
          >
            {['No credit card required', '14-day free trial', 'Cancel anytime'].map((t) => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Check size={14} color="var(--success)" /> {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxWidth: 1100, margin: '80px auto 0', padding: '0 24px',
          }}
        >
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-secondary)',
            boxShadow: '0 20px 80px rgba(0,0,0,0.5), var(--shadow-glow)',
            overflow: 'hidden', aspectRatio: '16/9',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Mock browser chrome */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
              borderBottom: '1px solid var(--border-primary)',
            }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
              <div style={{
                flex: 1, marginLeft: 12, padding: '6px 16px', borderRadius: 6,
                background: 'var(--bg-glass)', fontSize: '0.75rem', color: 'var(--text-tertiary)',
              }}>app.apex.io/dashboard</div>
            </div>
            {/* Mock dashboard content */}
            <div style={{ flex: 1, display: 'flex' }}>
              {/* Mini sidebar */}
              <div style={{
                width: 200, borderRight: '1px solid var(--border-primary)',
                padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                {['Dashboard', 'Clients', 'Projects', 'Invoices', 'Analytics'].map((item, i) => (
                  <div key={item} style={{
                    padding: '8px 12px', borderRadius: 6, fontSize: '0.8125rem', fontWeight: 500,
                    background: i === 0 ? 'var(--accent-subtle)' : 'transparent',
                    color: i === 0 ? 'var(--accent)' : 'var(--text-secondary)',
                  }}>{item}</div>
                ))}
              </div>
              {/* Mini content */}
              <div style={{ flex: 1, padding: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
                  {[
                    { label: 'Revenue', val: '$124,500', color: 'var(--success)' },
                    { label: 'Clients', val: '48', color: 'var(--accent)' },
                    { label: 'Projects', val: '12', color: 'var(--info)' },
                    { label: 'Invoices', val: '$18,200', color: 'var(--warning)' }
                  ].map(kpi => (
                    <div key={kpi.label} style={{
                      padding: '14px', borderRadius: 8,
                      background: 'var(--bg-glass)', border: '1px solid var(--border-primary)',
                    }}>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>{kpi.label}</div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 700, color: kpi.color }}>{kpi.val}</div>
                    </div>
                  ))}
                </div>
                {/* Chart placeholder */}
                <div style={{
                  height: 140, borderRadius: 8, background: 'var(--bg-glass)',
                  border: '1px solid var(--border-primary)',
                  display: 'flex', alignItems: 'flex-end', padding: '16px', gap: 6,
                }}>
                  {[40, 55, 35, 65, 50, 80, 70, 90, 75, 95, 85, 100].map((h, i) => (
                    <div key={i} style={{
                      flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0',
                      background: `linear-gradient(to top, rgba(99,102,241,0.6), rgba(139,92,246,0.3))`,
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <h2 style={{ marginBottom: 16 }}>Everything You Need to Scale</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', maxWidth: 500, margin: '0 auto' }}>
            From client onboarding to revenue optimization — Apex has you covered.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              custom={i}
              className="card"
              style={{ cursor: 'default' }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: `${f.color}15`, display: 'flex',
                alignItems: 'center', justifyContent: 'center', marginBottom: 16,
              }}>
                <f.icon size={22} color={f.color} />
              </div>
              <h4 style={{ marginBottom: 8 }}>{f.title}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section style={{
        padding: '60px 24px', borderTop: '1px solid var(--border-primary)',
        borderBottom: '1px solid var(--border-primary)',
      }}>
        <div style={{
          maxWidth: 1000, margin: '0 auto',
          display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 40,
        }}>
          {[
            { val: '12,000+', label: 'Active Users' },
            { val: '$2.4B', label: 'Revenue Tracked' },
            { val: '99.99%', label: 'Uptime SLA' },
            { val: '4.9/5', label: 'Customer Rating' },
          ].map(stat => (
            <motion.div
              key={stat.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              style={{ textAlign: 'center' }}
            >
              <div style={{
                fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.03em',
                background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{stat.val}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h2 style={{ marginBottom: 16 }}>Simple, Transparent Pricing</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', maxWidth: 460, margin: '0 auto 24px' }}>
            Start free for 14 days. No credit card required. Upgrade when you&apos;re ready.
          </p>
          <div style={{
            display: 'inline-flex', background: 'var(--bg-glass)', borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-primary)', padding: 4,
          }}>
            {['monthly', 'yearly'].map(cycle => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                style={{
                  padding: '8px 20px', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem',
                  fontWeight: 500, transition: 'all 0.2s',
                  background: billingCycle === cycle ? 'var(--accent)' : 'transparent',
                  color: billingCycle === cycle ? 'white' : 'var(--text-secondary)',
                }}
              >
                {cycle === 'yearly' ? 'Yearly (Save 20%)' : 'Monthly'}
              </button>
            ))}
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'start' }}>
          {PRICING_TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              custom={i}
              style={{
                background: tier.popular ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                border: tier.popular ? '1px solid var(--accent)' : '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-lg)', padding: 32, position: 'relative',
                boxShadow: tier.popular ? 'var(--shadow-glow)' : 'none',
                transform: tier.popular ? 'scale(1.03)' : 'none',
              }}
            >
              {tier.popular && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--gradient-accent)', padding: '4px 16px',
                  borderRadius: 'var(--radius-full)', fontSize: '0.75rem',
                  fontWeight: 600, color: 'white',
                }}>Most Popular</div>
              )}
              <h3 style={{ marginBottom: 4 }}>{tier.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 20 }}>{tier.desc}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                  ${billingCycle === 'yearly' ? Math.round(tier.price * 0.8) : tier.price}
                </span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>/month</span>
              </div>
              <Link
                href="/signup"
                className={`btn ${tier.popular ? 'btn-primary' : 'btn-secondary'} w-full`}
                style={{ marginBottom: 24 }}
              >
                {tier.cta} <ChevronRight size={14} />
              </Link>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {tier.features.map(f => (
                  <li key={f} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontSize: '0.875rem', color: 'var(--text-secondary)',
                  }}>
                    <Check size={16} color="var(--success)" style={{ flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section id="testimonials" style={{ padding: '80px 24px 100px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h2 style={{ marginBottom: 16 }}>Loved by Teams Worldwide</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem' }}>
            See why thousands of businesses choose Apex.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              custom={i}
              className="card"
              style={{ cursor: 'default' }}
            >
              <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p style={{
                color: 'var(--text-secondary)', fontSize: '0.9375rem',
                lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic',
              }}>&ldquo;{t.text}&rdquo;</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="avatar" style={{ background: t.avatar }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.name}</div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{
        padding: '100px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          style={{ position: 'relative' }}
        >
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
            Ready to Scale Your Business?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', maxWidth: 480, margin: '0 auto 32px' }}>
            Join 12,000+ professionals who use Apex to manage clients, track revenue, and grow smarter.
          </p>
          <Link href="/signup" className="btn btn-primary btn-lg" style={{ fontSize: '1rem' }}>
            Get Started Free <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{
        borderTop: '1px solid var(--border-primary)', padding: '48px 24px',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7, background: 'var(--gradient-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={14} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Apex</span>
          </div>
          <div style={{ display: 'flex', gap: 32, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
            <a href="#">Contact</a>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
            © 2026 Apex. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
