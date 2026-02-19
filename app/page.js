'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, FileText, ArrowRight, Check,
  Shield, TrendingUp, Star, ChevronRight, Sparkles,
  Layout, CreditCard, PieChart, Clock, Terminal
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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
  },
  {
    icon: Layout,
    title: 'Project Tracking',
    desc: 'Kanban boards, task management, and real-time progress tracking for every project.',
  },
  {
    icon: FileText,
    title: 'Smart Invoicing',
    desc: 'Create, send, and track invoices with automated reminders and payment tracking.',
  },
  {
    icon: PieChart,
    title: 'Revenue Analytics',
    desc: 'AI-powered insights into revenue trends, client profitability, and growth opportunities.',
  },
  {
    icon: Clock,
    title: 'Time Tracking',
    desc: 'Log billable hours, generate timesheets, and automate billing workflows.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    desc: 'Bank-grade encryption, SOC 2 compliance, and role-based access controls.',
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
  },
  {
    name: 'Marcus Johnson',
    role: 'Creative Director, BoldAgency',
    text: 'The AI insights are like having a virtual CFO. We spotted a churn risk early and saved a $50K account.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Freelance Consultant',
    text: 'I went from spreadsheets to Apex and saved 10+ hours a week. The invoicing alone is worth the price.',
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

/* ─── Brand Logo Component ─── */
function BrandLogo({ height = 20, color = '#000000' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill={color} height={height} viewBox="0 0 131 34">
      <path fill={color} d="M.36 8.6h16.7v5.6H6.04c-.2 0-.35.16-.35.35v4.9c0 .2.16.35.35.35h11.02v5.6h-5.33c-.2 0-.35.16-.35.35v4.9c0 .2.16.35.35.35h4.98c.2 0 .35-.15.35-.35V25.4h5.34c.2 0 .35-.16.35-.35v-4.9c0-.2-.16-.35-.35-.35h-5.34v-5.6h5.34c.2 0 .35-.16.35-.35v-4.9c0-.2-.16-.35-.35-.35h-5.34V3.35c0-.2-.16-.35-.35-.35H.36c-.2 0-.36.16-.36.35v4.9c0 .2.16.35.36.35ZM44.41 14.7c-.5-.5-1.1-.9-1.76-1.18a5.62 5.62 0 0 0-4.6.17c-.73.37-1.32.91-1.75 1.62h-.17V8.59H34.1v16.83h2.04v-1.81h.17c.21.36.47.67.77.94.31.25.65.48 1.01.67.37.18.77.31 1.18.39a6.2 6.2 0 0 0 3.39-.24 5.36 5.36 0 0 0 3.02-3.1c.29-.75.44-1.62.44-2.6v-.47c0-.96-.16-1.83-.47-2.58-.3-.75-.7-1.4-1.23-1.9v-.01Zm-5.87.66a3.9 3.9 0 0 1 4.34.84c.36.35.64.8.83 1.3.2.5.3 1.07.3 1.7v.47c0 .64-.1 1.23-.3 1.74a3.75 3.75 0 0 1-2.06 2.15 4.27 4.27 0 0 1-3.12-.03 3.86 3.86 0 0 1-2.09-2.2c-.2-.52-.3-1.11-.3-1.75v-.29c0-.62.1-1.2.3-1.7v-.01c.21-.53.5-.99.84-1.36.36-.37.78-.66 1.26-.86ZM97.04 8.59H95v4.86h-2.94v1.86H95v8.17c0 .56.17 1.03.53 1.4.37.35.84.54 1.4.54h4.18v-1.87h-3.5c-.2 0-.33-.05-.43-.15-.1-.1-.14-.27-.14-.49v-7.6h4.65v-1.86h-4.65V8.59ZM114.61 15a5.48 5.48 0 0 0-1.8-1.33 5.6 5.6 0 0 0-2.57-.56 6.17 6.17 0 0 0-4.26 1.7 5.6 5.6 0 0 0-1.72 4.2v.57c0 .9.15 1.75.44 2.5a5.58 5.58 0 0 0 5.5 3.67c1.55 0 2.8-.35 3.72-1.04a5.35 5.35 0 0 0 1.91-2.73l.03-.07-1.94-.52-.02.07c-.11.33-.27.64-.46.94-.17.27-.4.52-.7.74-.28.22-.63.39-1.04.51-.41.13-.9.19-1.46.19a3.8 3.8 0 0 1-2.84-1.05 4.07 4.07 0 0 1-1.1-2.7h9.68v-1.6c0-.54-.11-1.12-.34-1.75a5.04 5.04 0 0 0-1.03-1.74Zm-8.25 3.21a3.8 3.8 0 0 1 1.22-2.25 4.19 4.19 0 0 1 3.99-.7c.44.16.83.38 1.17.66.34.27.62.62.82 1.02.21.38.34.8.38 1.27h-7.58ZM129.09 14.42a4.47 4.47 0 0 0-3.37-1.3c-.93 0-1.73.2-2.4.59-.64.39-1.15.97-1.52 1.74h-.17v-2h-2.04v11.97h2.04v-6.23c0-1.26.32-2.28.95-3.02a3.31 3.31 0 0 1 2.65-1.14c.94 0 1.7.3 2.24.9.56.6.83 1.52.83 2.74v6.75h2.04v-7.13c0-1.71-.42-3.02-1.25-3.87ZM88.1 15a5.48 5.48 0 0 0-1.78-1.33 5.6 5.6 0 0 0-2.58-.56 6.17 6.17 0 0 0-4.27 1.7 5.59 5.59 0 0 0-1.71 4.2v.56c0 .92.14 1.76.44 2.51a5.6 5.6 0 0 0 5.5 3.67c1.55 0 2.8-.35 3.72-1.04a5.36 5.36 0 0 0 1.91-2.73l.03-.07-1.94-.52-.03.07c-.1.32-.26.64-.45.94-.17.27-.4.52-.7.74-.29.21-.64.39-1.05.51-.4.12-.9.19-1.45.19a3.8 3.8 0 0 1-2.85-1.05 4.07 4.07 0 0 1-1.09-2.7h9.68v-1.61c0-.53-.12-1.12-.34-1.74A5.03 5.03 0 0 0 88.1 15Zm-8.24 3.21a3.83 3.83 0 0 1 1.22-2.25 4.2 4.2 0 0 1 3.99-.7c.44.16.83.38 1.16.66.35.27.62.62.83 1.02.2.38.33.8.37 1.27h-7.57ZM73.65 19.42a6.11 6.11 0 0 0-3.23-1.02 6.63 6.63 0 0 1-2.68-.58c-.47-.3-.7-.7-.7-1.25 0-.27.08-.5.21-.7.14-.2.33-.38.56-.52a4.05 4.05 0 0 1 1.78-.42c.85 0 1.54.21 2.06.63.53.41.83 1 .91 1.73l.01.1 1.95-.47-.01-.07c-.07-.45-.22-.91-.45-1.36a3.46 3.46 0 0 0-.94-1.2 4.6 4.6 0 0 0-1.52-.84 6.05 6.05 0 0 0-2.1-.34c-.58 0-1.13.07-1.65.22-.52.14-1 .36-1.43.65-.41.3-.74.66-.99 1.1a2.9 2.9 0 0 0-.37 1.49v.14c0 1.06.38 1.87 1.14 2.42a6.2 6.2 0 0 0 3.24.97c1.18.08 2.04.26 2.56.54.5.28.75.72.75 1.36 0 .6-.25 1.06-.78 1.4-.52.32-1.22.48-2.1.48a3.68 3.68 0 0 1-2.46-.79 3.13 3.13 0 0 1-1.04-2.14v-.09l-1.93.46h-.02v.07a4.4 4.4 0 0 0 3.1 4c.7.24 1.52.36 2.46.36.7 0 1.35-.09 1.93-.27.6-.16 1.12-.4 1.53-.72A3.38 3.38 0 0 0 74.8 22v-.14c0-1.07-.39-1.9-1.14-2.44ZM60.25 23.4c-.1-.1-.14-.27-.14-.49v-9.46h-2.05v1.85h-.16a3.78 3.78 0 0 0-1.61-1.63 4.62 4.62 0 0 0-2.26-.56c-.77 0-1.5.14-2.19.41a5.27 5.27 0 0 0-3.02 3.12c-.29.75-.44 1.63-.44 2.6v.38c0 .99.15 1.87.44 2.63.3.75.7 1.4 1.2 1.93a5.48 5.48 0 0 0 4.05 1.57c.8 0 1.51-.2 2.2-.58.69-.38 1.24-.97 1.63-1.75h.16v.06c0 .56.18 1.03.53 1.4.37.35.85.54 1.41.54h1.36v-1.87h-.68c-.2 0-.34-.05-.43-.15Zm-4.46.13c-.46.2-.97.3-1.52.3a3.68 3.68 0 0 1-2.75-1.09 4.42 4.42 0 0 1-1.05-3.12v-.38c0-.62.1-1.2.29-1.71a3.65 3.65 0 0 1 5-2.17c.47.2.88.49 1.21.86.35.37.62.83.8 1.36.2.5.3 1.08.3 1.7v.3c0 .63-.1 1.23-.3 1.76-.18.5-.45.96-.78 1.33-.33.37-.73.66-1.2.86Z" />
    </svg>
  );
}

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      {/* ─── Navbar ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-primary)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64,
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BrandLogo height={22} color="#000000" />
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} style={{
                fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)',
                transition: 'color 0.15s', cursor: 'pointer',
              }}
                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >{link.label}</a>
            ))}
            <Link href="/login" style={{
              fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)',
              transition: 'color 0.15s',
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
        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px',
              border: '1px solid var(--border-secondary)',
              marginBottom: 32,
              fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)',
              letterSpacing: '0.02em', textTransform: 'uppercase',
            }}
          >
            <Terminal size={14} color="var(--accent)" /> Now with AI-Powered Insights
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', fontWeight: 800,
              letterSpacing: '-0.05em', lineHeight: 1.0, marginBottom: 24,
            }}
          >
            Manage Clients.{' '}
            <span style={{ color: 'var(--accent)' }}>
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
              fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 580,
              margin: '0 auto 40px', lineHeight: 1.7,
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
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link href="/signup" className="btn btn-primary btn-lg" style={{ fontSize: '0.875rem' }}>
              Start Free — 14 Day Trial <ArrowRight size={16} />
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg" style={{ fontSize: '0.875rem' }}>
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
              fontSize: '0.75rem', color: 'var(--text-tertiary)',
            }}
          >
            {['No credit card required', '14-day free trial', 'Cancel anytime'].map((t) => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Check size={14} color="var(--accent)" /> {t}
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
            background: '#FAFAFA', border: '1px solid var(--border-secondary)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.08)',
            overflow: 'hidden', aspectRatio: '16/9',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Mock browser chrome */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
              borderBottom: '1px solid var(--border-primary)',
              background: '#FFFFFF',
            }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
              <div style={{
                flex: 1, marginLeft: 12, padding: '6px 16px',
                background: '#F5F5F5', fontSize: '0.6875rem', color: 'var(--text-tertiary)',
                border: '1px solid var(--border-primary)',
              }}>app.apex.io/dashboard</div>
            </div>
            {/* Mock dashboard content */}
            <div style={{ flex: 1, display: 'flex' }}>
              {/* Mini sidebar */}
              <div style={{
                width: 200, borderRight: '1px solid var(--border-primary)',
                padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4,
                background: '#FFFFFF',
              }}>
                {['Dashboard', 'Clients', 'Projects', 'Invoices', 'Analytics'].map((item, i) => (
                  <div key={item} style={{
                    padding: '8px 12px', fontSize: '0.75rem', fontWeight: 600,
                    background: i === 0 ? 'var(--accent-subtle)' : 'transparent',
                    color: i === 0 ? '#0a8f44' : 'var(--text-secondary)',
                    borderLeft: i === 0 ? '2px solid var(--accent)' : '2px solid transparent',
                  }}>{item}</div>
                ))}
              </div>
              {/* Mini content */}
              <div style={{ flex: 1, padding: 20, background: '#FAFAFA' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
                  {[
                    { label: 'Revenue', val: '$124,500', color: 'var(--accent)' },
                    { label: 'Clients', val: '48', color: 'var(--text-primary)' },
                    { label: 'Projects', val: '12', color: 'var(--text-primary)' },
                    { label: 'Invoices', val: '$18,200', color: 'var(--accent)' }
                  ].map(kpi => (
                    <div key={kpi.label} style={{
                      padding: '14px',
                      background: '#FFFFFF', border: '1px solid var(--border-primary)',
                    }}>
                      <div style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: kpi.color }}>{kpi.val}</div>
                    </div>
                  ))}
                </div>
                {/* Chart placeholder */}
                <div style={{
                  height: 140,
                  background: '#FFFFFF', border: '1px solid var(--border-primary)',
                  display: 'flex', alignItems: 'flex-end', padding: '16px', gap: 6,
                }}>
                  {[40, 55, 35, 65, 50, 80, 70, 90, 75, 95, 85, 100].map((h, i) => (
                    <div key={i} style={{
                      flex: 1, height: `${h}%`,
                      background: i >= 10 ? 'var(--accent)' : `rgba(25,231,110,${0.2 + (i * 0.06)})`,
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
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: 500, margin: '0 auto' }}>
            From client onboarding to revenue optimization — Apex has you covered.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border-primary)' }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              custom={i}
              style={{
                padding: 32, cursor: 'default',
                background: 'var(--bg-primary)',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-primary)'}
            >
              <div style={{
                width: 40, height: 40,
                border: '1px solid var(--border-secondary)',
                display: 'flex',
                alignItems: 'center', justifyContent: 'center', marginBottom: 20,
              }}>
                <f.icon size={20} color="var(--accent)" />
              </div>
              <h4 style={{ marginBottom: 8, fontSize: '0.9375rem' }}>{f.title}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.7 }}>{f.desc}</p>
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
                fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em',
                color: 'var(--text-primary)',
              }}>{stat.val}</div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
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
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: 460, margin: '0 auto 24px' }}>
            Start free for 14 days. No credit card required. Upgrade when you&apos;re ready.
          </p>
          <div style={{
            display: 'inline-flex', background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)', padding: 3,
          }}>
            {['monthly', 'yearly'].map(cycle => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                style={{
                  padding: '8px 20px', fontSize: '0.75rem',
                  fontWeight: 600, transition: 'all 0.15s',
                  background: billingCycle === cycle ? 'var(--text-primary)' : 'transparent',
                  color: billingCycle === cycle ? 'var(--text-inverse)' : 'var(--text-secondary)',
                }}
              >
                {cycle === 'yearly' ? 'Yearly (Save 20%)' : 'Monthly'}
              </button>
            ))}
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--border-secondary)' }}>
          {PRICING_TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              custom={i}
              style={{
                background: tier.popular ? '#F8FFF8' : 'var(--bg-primary)',
                borderRight: i < 2 ? '1px solid var(--border-secondary)' : 'none',
                padding: 32, position: 'relative',
              }}
            >
              {tier.popular && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: 2, background: 'var(--accent)',
                }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <h3>{tier.name}</h3>
                {tier.popular && (
                  <span style={{
                    background: 'var(--accent)', color: '#000',
                    padding: '2px 8px', fontSize: '0.625rem',
                    fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>Popular</span>
                )}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: 20 }}>{tier.desc}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em' }}>
                  ${billingCycle === 'yearly' ? Math.round(tier.price * 0.8) : tier.price}
                </span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>/month</span>
              </div>
              <Link
                href="/signup"
                className={`btn ${tier.popular ? 'btn-primary' : 'btn-secondary'} w-full`}
                style={{ marginBottom: 24, justifyContent: 'center' }}
              >
                {tier.cta} <ChevronRight size={14} />
              </Link>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tier.features.map(f => (
                  <li key={f} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontSize: '0.8125rem', color: 'var(--text-secondary)',
                  }}>
                    <Check size={14} color="var(--accent)" style={{ flexShrink: 0 }} /> {f}
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
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            See why thousands of businesses choose Apex.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border-primary)' }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              custom={i}
              style={{
                padding: 32, cursor: 'default',
                background: 'var(--bg-primary)',
              }}
            >
              <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="var(--accent)" color="var(--accent)" />)}
              </div>
              <p style={{
                color: 'var(--text-secondary)', fontSize: '0.875rem',
                lineHeight: 1.7, marginBottom: 24,
              }}>&ldquo;{t.text}&rdquo;</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="avatar" style={{ background: 'var(--accent-subtle)', color: '#0a8f44', fontWeight: 800 }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.8125rem' }}>{t.name}</div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{
        padding: '100px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden',
        borderTop: '1px solid var(--border-primary)',
        background: '#000000', color: '#FFFFFF',
      }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          style={{ position: 'relative' }}
        >
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 16, color: '#FFFFFF' }}>
            Ready to Scale Your Business?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9375rem', maxWidth: 480, margin: '0 auto 32px' }}>
            Join 12,000+ professionals who use Apex to manage clients, track revenue, and grow smarter.
          </p>
          <Link href="/signup" className="btn btn-primary btn-lg" style={{ fontSize: '0.875rem' }}>
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
          <BrandLogo height={18} color="#000000" />
          <div style={{ display: 'flex', gap: 32, fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
            <a href="#">Contact</a>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            © 2026 Apex. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
