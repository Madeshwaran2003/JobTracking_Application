import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Globe2,
  HelpCircle,
  LayoutDashboard,
  Loader2,
  Lock,
  Mail,
  Menu,
  Plus,
  Rocket,
  Settings,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import ApplyNestLogo from '../UI/ApplyNestLogo';

const features = [
  {
    title: 'Dashboard',
    description: 'Manage and track all your job applications in one organized workspace with status updates, interviews, and recent activity.',
    icon: LayoutDashboard,
    tone: 'violet',
    image: '/auth-secondimage.png',
  },
  {
    title: 'Analytics',
    description: 'Visualize your application progress, response rates, interview activity, and job search performance with clear insights.',
    icon: BarChart3,
    tone: 'blue',
    image: '/auth-thirdimage.png',
  },
  {
    title: 'Settings',
    description: 'Customize themes and manage your application data seamlessly so your workspace matches your preferences and workflow.',
    icon: Settings,
    tone: 'rose',
    image: '/auth-fourth-image.png',
  },
  {
    title: 'Help',
    description: 'Learn the platform quickly with guidance, helpful details, and a smoother path through every important workflow.',
    icon: HelpCircle,
    tone: 'amber',
    image: '/auth-fifth-image.png',
  },
  {
    title: 'Mobile Responsive',
    description: 'Enjoy a seamless experience across desktop, tablet, and mobile devices with layouts that adapt to any screen.',
    icon: Briefcase,
    tone: 'emerald',
    image: '/auth-firstimage.png',
  },
  {
    title: 'Anywhere Access',
    description: 'Access and manage your applications anytime from anywhere, with your job search organized across devices.',
    icon: Globe2,
    tone: 'indigo',
    image: '/auth-firstimage.png',
  },
];

const faqs = [
  {
    question: 'What is ApplyNest?',
    answer:
      'ApplyNest is a smart job tracking platform that helps users organize applications, interviews, and job search progress in one workspace.',
  },
  {
    question: 'Can I track multiple job applications?',
    answer:
      'Yes, you can manage and monitor multiple applications with status tracking, notes, and analytics, whether you are tracking five applications or fifty.',
  },
  {
    question: 'Is ApplyNest mobile responsive?',
    answer:
      'Yes, ApplyNest is fully responsive and works smoothly across desktop, tablet, and mobile devices.',
  },
  {
    question: 'Can I customize the application theme?',
    answer:
      'Yes, users can personalize the dashboard experience with built-in themes and custom workspace preferences.',
  },
  {
    question: 'Does ApplyNest provide analytics?',
    answer:
      'Yes, the analytics dashboard helps visualize application progress, response rates, and interview statistics.',
  },
  {
    question: 'Can I access my applications from anywhere?',
    answer:
      'Yes, your application data can be accessed anytime through the app, so your job search stays organized wherever you are.',
  },
];

export default function AuthPage({ onSignIn, onSignUp, onResetPassword, authError, isConfigured = true }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(authError || '');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const isSignUp = mode === 'signup';
  const isForgot = mode === 'forgot';

  const authCopy = useMemo(() => {
    if (!isConfigured) {
      return {
        title: 'Configuration Required',
        subtitle: 'Add Supabase credentials before signing in.',
        button: 'Auth Unavailable',
      };
    }
    if (isForgot) {
      return {
        title: 'Reset Password',
        subtitle: 'Enter your email to receive a reset link.',
        button: 'Send Reset Link',
      };
    }
    if (isSignUp) {
      return {
        title: 'Create Account',
        subtitle: 'Sign up for your ApplyNest account.',
        button: 'Create Account',
      };
    }
    return {
      title: 'Welcome Back',
      subtitle: 'Sign in to your ApplyNest account.',
      button: 'Sign In',
    };
  }, [isConfigured, isForgot, isSignUp]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMessage(authError || '');
  }, [authError]);

  const selectMode = (nextMode) => {
    setMode(nextMode);
    setMessage('');
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isConfigured) {
      setMessage('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to job-tracker/.env, then restart the dev server.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      if (isForgot) {
        if (onResetPassword) await onResetPassword(email);
        setMessage('Password reset email sent. Check your inbox.');
        setMode('signin');
      } else if (isSignUp) {
        await onSignUp({ email, password });
        setMessage('Account created. Check your email if confirmation is enabled, then sign in.');
        setMode('signin');
      } else {
        await onSignIn({ email, password });
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-landing">
      <style>{authStyles}</style>

      <nav className={`auth-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="auth-navbar-inner">
          <a href="#top" className="auth-logo-link" aria-label="ApplyNest home">
            <ApplyNestLogo compact />
            <span className="auth-brand-title">ApplyNest — Smart Job Application Tracker</span>
          </a>

          <div className="auth-nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="auth-nav-cta">
            <button type="button" className="auth-btn ghost" onClick={() => selectMode('signin')}>
              Sign In
            </button>
            <button type="button" className="auth-btn primary" onClick={() => selectMode('signup')}>
              Get Started
            </button>
          </div>

          <button
            type="button"
            className="auth-mobile-toggle"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="auth-mobile-menu">
            <a href="#features" onClick={() => setMobileOpen(false)}>Features</a>
            <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
            <a href="#faq" onClick={() => setMobileOpen(false)}>FAQ</a>
            <button type="button" className="auth-btn ghost" onClick={() => selectMode('signin')}>Sign In</button>
            <button type="button" className="auth-btn primary" onClick={() => selectMode('signup')}>Get Started</button>
          </div>
        )}
      </nav>

      <main id="top">
        <section className="auth-hero">
          <div className="auth-bg" />
          <div className="auth-glow glow-one" />
          <div className="auth-glow glow-two" />
          <div className="auth-glow glow-three" />

          <div className="auth-float-card float-one">
            <div className="float-icon green"><CheckCircle2 size={20} /></div>
            <div>
              <strong>Application Sent</strong>
              <span>2 min ago</span>
            </div>
          </div>

          <div className="auth-float-card float-two">
            <div className="float-icon blue"><TrendingUp size={20} /></div>
            <div>
              <strong>Interview Rate</strong>
              <b>78%</b>
            </div>
          </div>

          <div className="auth-float-card float-three compact">
            <Sparkles size={16} />
            <strong>12 new matches</strong>
          </div>

          <div className="auth-hero-inner">
            <div className="auth-hero-copy">
              <div className="auth-pill">
                <Sparkles size={14} />
                Your Job Search Companion
              </div>

              <h1>
                Track Every <span>Job Application</span> in One Place
              </h1>

              <p>
                Organize applications, interviews, analytics, and progress with a modern productivity dashboard designed to streamline your entire job search.
              </p>

              <div className="auth-hero-actions">
                <button type="button" className="auth-hero-primary" onClick={() => selectMode('signup')}>
                  Start Free
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="auth-badges">
                <span><Briefcase size={14} />Application Tracking</span>
                <span><BarChart3 size={14} />Analytics</span>
                <span><Settings size={14} />Theme Customization</span>
                <span><Globe2 size={14} />Anywhere Access</span>
              </div>
            </div>

            <div className="auth-panel-column">
              <div className="auth-preview preview-one">
                <img src="/auth-secondimage.png" alt="ApplyNest dashboard preview" />
              </div>
              <div className="auth-preview preview-two">
                <img src="/auth-thirdimage.png" alt="ApplyNest analytics preview" />
              </div>

              <section className="auth-card" aria-label={authCopy.title}>
                <div className="auth-card-glow" />
                <div className="auth-card-head">
                  <h2>{authCopy.title}</h2>
                  <p>{authCopy.subtitle}</p>
                </div>

                {!isForgot && (
                  <div className="auth-mode-tabs" role="tablist" aria-label="Authentication mode">
                    <button
                      type="button"
                      className={mode === 'signin' ? 'active' : ''}
                      onClick={() => selectMode('signin')}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      className={mode === 'signup' ? 'active' : ''}
                      onClick={() => selectMode('signup')}
                    >
                      Sign Up
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                  <label className="input-wrap">
                    <Mail className="input-icon" size={16} />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Email address"
                    />
                  </label>

                  {!isForgot && (
                    <label className="input-wrap">
                      <Lock className="input-icon" size={16} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        autoComplete={isSignUp ? 'new-password' : 'current-password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </label>
                  )}

                  {!isForgot && !isSignUp && (
                    <div className="forgot-row">
                      <button type="button" onClick={() => selectMode('forgot')}>
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  {isForgot && (
                    <div className="forgot-row left">
                      <button type="button" onClick={() => selectMode('signin')}>
                        Back to Sign In
                      </button>
                    </div>
                  )}

                  {!isConfigured && (
                    <p className="auth-message warning">
                      Add your Supabase URL and anon key in <code>job-tracker/.env</code>, then restart localhost.
                    </p>
                  )}

                  {message && <p className="auth-message">{message}</p>}

                  <button type="submit" disabled={submitting || !isConfigured} className="signin-button">
                    {submitting && <Loader2 size={16} className="spin" />}
                    {authCopy.button}
                  </button>
                </form>

                {!isForgot && (
                  <p className="auth-footer-text">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button type="button" onClick={() => selectMode(isSignUp ? 'signin' : 'signup')}>
                      {isSignUp ? 'Sign in' : 'Sign up free'}
                    </button>
                  </p>
                )}
              </section>
            </div>
          </div>
        </section>

        <section className="auth-section" id="features">
          <div className="section-bg feature-bg" />
          <div className="auth-section-inner">
            <div className="section-header">
              <div className="auth-pill"><Sparkles size={14} />Features</div>
              <h2>Everything You Need to Organize Your <span>Job Search</span></h2>
              <p>Powerful tools designed to make your job search smarter, faster, and more organized than ever before.</p>
            </div>

            <div className="features-grid">
              {features.map(({ title, description, icon: Icon, tone, image }) => (
                <article className={`feature-card ${tone}`} key={title}>
                  <div className="feature-visual">
                    <img src={image} alt={`${title} screen`} />
                  </div>
                  <div className="feature-copy">
                    <div className="feature-icon"><Icon size={18} /></div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="auth-section compact-section" id="about">
          <div className="section-bg workflow-bg" />
          <div className="auth-section-inner narrow">
            <div className="section-header">
              <div className="auth-pill"><Rocket size={14} />How It Works</div>
              <h2>Your Job Search in <span>Three Simple Steps</span></h2>
              <p>Get started in minutes and take full control of your job search journey.</p>
            </div>

            <div className="workflow-grid">
              {[
                ['01', 'Add Applications', 'Quickly add job applications with company details, role, status, and notes.'],
                ['02', 'Track Progress', 'Monitor each stage from applied to interview to offer with clear status tracking.'],
                ['03', 'Get Better Opportunities', 'Use analytics and insights to improve response rates and focus your search.'],
              ].map(([number, title, description], index) => (
                <article className="workflow-step" key={number}>
                  <div className={`step-icon step-${index + 1}`}>
                    {index === 0 ? <Plus size={30} /> : index === 1 ? <TrendingUp size={30} /> : <Rocket size={30} />}
                    <span>{number}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="auth-section compact-section" id="faq">
          <div className="section-bg faq-bg" />
          <div className="auth-section-inner faq-inner">
            <div className="section-header">
              <div className="auth-pill"><HelpCircle size={14} />FAQ</div>
              <h2>Frequently Asked <span>Questions</span></h2>
              <p>Got questions? Find what you need to get started.</p>
            </div>

            <div className="faq-list">
              {faqs.map((item, index) => {
                const active = openFaq === index;
                return (
                  <article className={`faq-item ${active ? 'active' : ''}`} key={item.question}>
                    <button type="button" onClick={() => setOpenFaq(active ? null : index)}>
                      {item.question}
                      <ChevronDown size={20} />
                    </button>
                    <p>{item.answer}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="auth-footer">
        <div className="auth-footer-inner">
          <div>
            <a href="#top" className="auth-logo-link">
              <ApplyNestLogo compact />
              <span>ApplyNest</span>
            </a>
            <p>Your modern job tracking companion. Organize, track, and optimize your job search journey.</p>
          </div>

          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#faq">FAQ</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 ApplyNest. All rights reserved.</p>
          <div>
            <a href="#top">Privacy</a>
            <a href="#top">Terms</a>
            <a href="#top">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const authStyles = `
.auth-landing {
  --c1: #A6C0FE;
  --c2: #C3A6F0;
  --c3: #F68084;
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --pink: #F68084;
  --pink-dark: #e5676b;
  min-height: 100vh;
  color: #1e293b;
  background: #fff;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.6;
}

.auth-landing * { box-sizing: border-box; }
.auth-landing a { color: inherit; text-decoration: none; }
.auth-landing button { font-family: inherit; }

@keyframes authFloatOne { 0%, 100% { transform: translateY(-10px); } 50% { transform: translateY(10px); } }
@keyframes authFloatTwo { 0%, 100% { transform: translateY(10px); } 50% { transform: translateY(-10px); } }
@keyframes authGlow { 0%, 100% { opacity: .3; } 50% { opacity: .55; } }
@keyframes authInLeft { from { opacity: 0; transform: translateX(-34px); } to { opacity: 1; transform: translateX(0); } }
@keyframes authInRight { from { opacity: 0; transform: translateX(34px); } to { opacity: 1; transform: translateX(0); } }
@keyframes spin { to { transform: rotate(360deg); } }

.spin { animation: spin .9s linear infinite; }

.auth-navbar {
  position: fixed;
  top: 12px;
  left: 0;
  right: 0;
  z-index: 50;
  padding: 0 16px;
  pointer-events: none;
  transition: all .25s ease;
}

.auth-navbar.scrolled {
  transform: translateY(0);
}

.auth-navbar-inner {
  width: min(980px, 100%);
  min-height: 54px;
  margin: 0 auto;
  padding: 7px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  border: 1px solid rgba(148, 163, 184, .28);
  border-radius: 999px;
  background: rgba(255, 255, 255, .82);
  box-shadow: 0 12px 32px rgba(15, 23, 42, .12);
  backdrop-filter: blur(22px);
  pointer-events: auto;
}

.auth-logo-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: #1e293b;
  font-size: 15px;
  font-weight: 800;
}

.auth-logo-link > .auth-brand-title {
  max-width: 340px;
  overflow: hidden;
  color: #111827;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.auth-logo-link span:not(.auth-brand-title) {
  background: linear-gradient(90deg, var(--primary), var(--pink));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.auth-nav-links,
.auth-nav-cta {
  display: flex;
  align-items: center;
  gap: 18px;
}

.auth-nav-links a {
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  position: relative;
}

.auth-nav-links a:after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 0;
  height: 2px;
  border-radius: 999px;
  background: var(--primary);
  transition: width .2s ease;
}

.auth-nav-links a:hover {
  color: var(--primary);
}

.auth-nav-links a:hover:after {
  width: 100%;
}

.auth-btn,
.auth-mobile-toggle {
  border: 0;
  cursor: pointer;
}

.auth-btn {
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 700;
  transition: all .2s ease;
}

.auth-btn.ghost {
  background: transparent;
  color: #475569;
}

.auth-btn.ghost:hover {
  color: var(--primary);
  background: rgba(255, 255, 255, .28);
}

.auth-btn.primary {
  color: #fff;
  background: linear-gradient(90deg, var(--primary), var(--pink));
  box-shadow: 0 8px 18px rgba(240, 130, 132, .24);
}

.auth-btn.primary:hover,
.signin-button:hover,
.auth-hero-primary:hover {
  background: linear-gradient(90deg, var(--primary-dark), var(--pink-dark));
  box-shadow: 0 14px 28px rgba(240, 130, 132, .28);
}

.auth-mobile-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  color: #475569;
  background: rgba(255, 255, 255, .28);
}

.auth-mobile-menu {
  display: none;
  width: min(420px, calc(100% - 32px));
  margin: 8px auto 0;
  padding: 12px;
  border: 1px solid rgba(148, 163, 184, .25);
  border-radius: 22px;
  background: rgba(255, 255, 255, .9);
  box-shadow: 0 18px 36px rgba(15, 23, 42, .14);
  backdrop-filter: blur(20px);
  pointer-events: auto;
}

.auth-mobile-menu a,
.auth-mobile-menu button {
  width: 100%;
  display: block;
  margin-top: 6px;
  text-align: center;
}

.auth-mobile-menu a {
  padding: 10px 12px;
  border-radius: 8px;
  color: #475569;
  font-size: 14px;
  font-weight: 700;
}

.auth-hero {
  position: relative;
  min-height: 100vh;
  padding-top: 78px;
  overflow: hidden;
}

.auth-bg,
.section-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--c1) 0%, var(--c2) 50%, var(--c3) 100%);
}

.auth-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(120px);
  animation: authGlow 4s ease-in-out infinite;
}

.glow-one { top: 80px; left: 40px; width: 500px; height: 500px; background: rgba(166, 192, 254, .35); }
.glow-two { bottom: 80px; right: 40px; width: 410px; height: 410px; background: rgba(246, 128, 132, .3); }
.glow-three { top: 48%; left: 48%; width: 600px; height: 600px; background: rgba(195, 166, 240, .22); transform: translate(-50%, -50%); }

.auth-hero-inner {
  position: relative;
  z-index: 2;
  max-width: 1280px;
  min-height: calc(100vh - 64px);
  margin: 0 auto;
  padding: 48px 32px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(380px, 448px);
  align-items: center;
  gap: 64px;
}

.auth-hero-copy {
  animation: authInLeft .6s ease-out both;
}

.auth-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 22px;
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, .52);
  border-radius: 999px;
  background: rgba(255, 255, 255, .38);
  color: var(--primary);
  font-size: 12px;
  font-weight: 800;
  backdrop-filter: blur(8px);
}

.auth-hero h1,
.section-header h2 {
  margin: 0;
  color: #0f172a;
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: 0;
}

.auth-hero h1 {
  max-width: 700px;
  font-size: clamp(42px, 5vw, 66px);
}

.auth-hero h1 span,
.section-header h2 span {
  background: linear-gradient(90deg, var(--primary), var(--pink));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.auth-hero-copy > p,
.section-header p {
  max-width: 570px;
  margin: 24px 0 0;
  color: #475569;
  font-size: 18px;
}

.auth-hero-actions,
.auth-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.auth-hero-actions {
  margin-top: 32px;
}

.auth-hero-primary,
.signin-button {
  border: 0;
  cursor: pointer;
  border-radius: 12px;
  min-height: 46px;
  font-weight: 800;
  transition: all .2s ease;
}

.auth-hero-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 30px;
  font-size: 16px;
}

.auth-hero-primary {
  color: #fff;
  background: linear-gradient(90deg, var(--primary), var(--pink));
  box-shadow: 0 10px 20px rgba(240, 130, 132, .24);
}

.auth-badges {
  margin-top: 30px;
}

.auth-badges span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, .42);
  border-radius: 999px;
  background: rgba(255, 255, 255, .3);
  color: #475569;
  font-size: 12px;
  font-weight: 800;
  backdrop-filter: blur(8px);
}

.auth-badges svg {
  color: var(--primary);
}

.auth-panel-column {
  position: relative;
  animation: authInRight .65s ease-out both;
}

.auth-card {
  position: relative;
  z-index: 2;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, .52);
  border-radius: 24px;
  background: rgba(255, 255, 255, .44);
  box-shadow: 0 25px 50px -12px rgba(99, 102, 241, .22);
  backdrop-filter: blur(38px);
}

.auth-card-glow {
  position: absolute;
  inset: -1px;
  z-index: -1;
  border-radius: inherit;
  background: linear-gradient(90deg, rgba(166, 192, 254, .38), rgba(195, 166, 240, .25), rgba(246, 128, 132, .35));
  filter: blur(5px);
}

.auth-card-head {
  text-align: center;
}

.auth-card h2 {
  margin: 0;
  color: #1e293b;
  font-size: 22px;
  font-weight: 900;
}

.auth-card p {
  margin: 6px 0 0;
}

.auth-card-head p,
.auth-footer-text {
  color: #64748b;
  font-size: 14px;
}

.auth-mode-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 22px;
  padding: 5px;
  border: 1px solid rgba(255, 255, 255, .55);
  border-radius: 14px;
  background: rgba(255, 255, 255, .32);
}

.auth-mode-tabs button {
  border: 0;
  border-radius: 10px;
  padding: 9px 12px;
  color: #64748b;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
}

.auth-mode-tabs button.active {
  color: #fff;
  background: linear-gradient(90deg, var(--primary), var(--pink));
  box-shadow: 0 8px 16px rgba(99, 102, 241, .18);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
}

.input-wrap {
  position: relative;
  display: block;
}

.input-icon {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.input-wrap input {
  width: 100%;
  height: 46px;
  padding: 0 42px 0 42px;
  border: 1px solid rgba(255, 255, 255, .65);
  border-radius: 12px;
  outline: none;
  background: rgba(255, 255, 255, .54);
  color: #1e293b;
  font-size: 14px;
  transition: all .2s ease;
  backdrop-filter: blur(8px);
}

.input-wrap input::placeholder {
  color: #94a3b8;
}

.input-wrap input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(166, 192, 254, .3);
}

.password-toggle {
  position: absolute;
  right: 13px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  border: 0;
  color: #94a3b8;
  background: transparent;
  cursor: pointer;
}

.forgot-row {
  margin-top: -8px;
  text-align: right;
}

.forgot-row.left {
  text-align: left;
}

.forgot-row button,
.auth-footer-text button {
  border: 0;
  background: transparent;
  color: var(--primary);
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;
}

.auth-message {
  margin: 0;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, .58);
  border-radius: 12px;
  background: rgba(255, 255, 255, .36);
  color: #475569;
  font-size: 12px;
}

.auth-message.warning {
  color: #92400e;
  background: rgba(251, 191, 36, .18);
}

.auth-message code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.signin-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  color: #fff;
  background: linear-gradient(90deg, var(--primary), var(--pink));
  font-size: 14px;
  box-shadow: 0 8px 18px rgba(240, 130, 132, .24);
}

.signin-button:disabled {
  cursor: not-allowed;
  opacity: .6;
}

.auth-footer-text {
  text-align: center;
  margin-top: 20px;
}

.auth-float-card {
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, .42);
  border-radius: 16px;
  background: rgba(255, 255, 255, .3);
  box-shadow: 0 10px 24px rgba(15, 23, 42, .1);
  backdrop-filter: blur(12px);
}

.auth-float-card strong,
.auth-float-card b {
  display: block;
  color: #1e293b;
  font-size: 12px;
  font-weight: 900;
}

.auth-float-card b {
  color: var(--primary);
  font-size: 18px;
}

.auth-float-card span {
  color: #64748b;
  font-size: 10px;
}

.auth-float-card.compact strong {
  color: #475569;
  white-space: nowrap;
}

.auth-float-card.compact svg {
  color: #f59e0b;
}

.float-icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 12px;
}

.float-icon.green { color: #16a34a; background: rgba(34, 197, 94, .18); }
.float-icon.blue { color: var(--primary); background: rgba(99, 102, 241, .18); }
.float-one { top: 132px; left: 5%; animation: authFloatOne 6s ease-in-out infinite; }
.float-two { top: 122px; right: 3%; animation: authFloatTwo 7s ease-in-out infinite; }
.float-three { bottom: 86px; left: 8%; animation: authFloatOne 5s ease-in-out infinite; }

.auth-preview {
  position: absolute;
  z-index: 1;
  width: 142px;
  aspect-ratio: 16 / 10;
  border: 1px solid rgba(255, 255, 255, .5);
  border-radius: 14px;
  overflow: hidden;
  background: #f8fafc;
  box-shadow: 0 24px 45px -18px rgba(99, 102, 241, .42);
}

.auth-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-one { top: -44px; left: -170px; animation: authFloatTwo 8s ease-in-out infinite; }
.preview-two { right: -150px; bottom: -34px; animation: authFloatOne 7s ease-in-out infinite; }

.auth-section {
  position: relative;
  overflow: hidden;
  padding: 118px 32px;
}

.compact-section {
  padding-block: 110px;
}

.feature-bg {
  background: linear-gradient(180deg, var(--c1), var(--c3));
}

.workflow-bg {
  background: linear-gradient(90deg, var(--c1), var(--c3));
}

.faq-bg {
  background: linear-gradient(135deg, var(--c1), var(--c2), var(--c3));
}

.auth-section-inner {
  position: relative;
  z-index: 2;
  max-width: 1280px;
  margin: 0 auto;
}

.auth-section-inner.narrow {
  max-width: 1024px;
}

.faq-inner {
  max-width: 780px;
}

.section-header {
  max-width: 720px;
  margin: 0 auto 58px;
  text-align: center;
}

.section-header h2 {
  font-size: clamp(32px, 4vw, 46px);
}

.section-header p {
  margin-inline: auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.feature-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, .45);
  background: rgba(255, 255, 255, .5);
  box-shadow: 0 10px 22px rgba(226, 232, 240, .25);
  backdrop-filter: blur(16px);
  transition: transform .2s ease, box-shadow .2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 34px rgba(99, 102, 241, .18);
}

.feature-visual {
  min-height: 245px;
  padding: 18px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(166, 192, 254, .4), rgba(255,255,255,.2), rgba(246, 128, 132, .26));
}

.feature-visual img {
  width: 100%;
  max-width: 240px;
  aspect-ratio: 5 / 3.3;
  object-fit: cover;
  object-position: top center;
  border-radius: 12px;
  background: rgba(248, 250, 252, .9);
  box-shadow: 0 14px 30px rgba(15, 23, 42, .12);
}

.feature-copy {
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.feature-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: #fff;
  background: var(--primary);
  box-shadow: 0 8px 16px rgba(15, 23, 42, .12);
}

.feature-card.blue .feature-icon { background: #3b82f6; }
.feature-card.rose .feature-icon { background: #F68084; }
.feature-card.amber .feature-icon { background: #f59e0b; }
.feature-card.emerald .feature-icon { background: #10b981; }
.feature-card.indigo .feature-icon { background: #8b5cf6; }

.feature-copy h3,
.workflow-step h3 {
  margin: 14px 0 8px;
  color: #1e293b;
  font-size: 18px;
  font-weight: 900;
}

.feature-copy p,
.workflow-step p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.workflow-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 38px;
}

.workflow-step {
  text-align: center;
}

.step-icon {
  position: relative;
  width: 82px;
  height: 82px;
  margin: 0 auto 22px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  background: rgba(255, 255, 255, .28);
  color: var(--primary);
  box-shadow: 0 12px 24px rgba(15, 23, 42, .12);
  backdrop-filter: blur(8px);
}

.step-2 { color: #8b5cf6; }
.step-3 { color: #F68084; }

.step-icon span {
  position: absolute;
  top: -9px;
  right: -9px;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(135deg, var(--primary), var(--pink));
  font-size: 12px;
  font-weight: 900;
}

.faq-list {
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, .52);
  border-radius: 16px;
  background: rgba(255, 255, 255, .4);
  box-shadow: 0 10px 22px rgba(226, 232, 240, .25);
  backdrop-filter: blur(16px);
}

.faq-item {
  border-bottom: 1px solid rgba(226, 232, 240, .82);
  border-radius: 12px;
}

.faq-item:last-child {
  border-bottom: 0;
}

.faq-item.active {
  background: rgba(166, 192, 254, .12);
}

.faq-item button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 18px 16px;
  border: 0;
  background: transparent;
  color: #334155;
  cursor: pointer;
  font-size: 15px;
  font-weight: 900;
  text-align: left;
}

.faq-item svg {
  flex: 0 0 auto;
  color: #64748b;
  transition: transform .2s ease;
}

.faq-item.active svg {
  transform: rotate(180deg);
}

.faq-item p {
  max-height: 0;
  overflow: hidden;
  margin: 0;
  padding: 0 16px;
  color: #64748b;
  font-size: 14px;
  transition: max-height .25s ease, padding .25s ease;
}

.faq-item.active p {
  max-height: 180px;
  padding: 0 16px 18px;
}

.auth-footer {
  background: linear-gradient(90deg, rgba(166, 192, 254, .62), rgba(246, 128, 132, .62));
  border-top: 1px solid rgba(255, 255, 255, .35);
}

.auth-footer-inner,
.footer-bottom {
  max-width: 1280px;
  margin: 0 auto;
  padding-inline: 32px;
}

.auth-footer-inner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;
  padding-top: 42px;
  padding-bottom: 32px;
}

.auth-footer-inner p {
  max-width: 390px;
  margin: 14px 0 0;
  color: #475569;
  font-size: 14px;
}

.footer-links,
.footer-bottom div {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.footer-links a,
.footer-bottom a,
.footer-bottom p {
  color: #475569;
  font-size: 13px;
  font-weight: 700;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding-top: 24px;
  padding-bottom: 32px;
  border-top: 1px solid rgba(255, 255, 255, .35);
}

.footer-bottom p {
  margin: 0;
}

@media (max-width: 1100px) {
  .auth-float-card,
  .auth-preview {
    display: none;
  }

  .auth-hero-inner {
    grid-template-columns: 1fr;
    gap: 42px;
    text-align: center;
  }

  .auth-hero-copy > p,
  .auth-hero h1 {
    margin-left: auto;
    margin-right: auto;
  }

  .auth-hero-actions,
  .auth-badges {
    justify-content: center;
  }

  .auth-panel-column {
    width: min(448px, 100%);
    margin: 0 auto;
  }
}

@media (max-width: 780px) {
  .auth-navbar-inner {
    min-height: 52px;
    padding: 6px 8px;
    gap: 10px;
  }

  .auth-logo-link {
    font-size: 14px;
  }

  .auth-logo-link > .auth-brand-title {
    max-width: calc(100vw - 118px);
  }

  .auth-nav-links,
  .auth-nav-cta {
    display: none;
  }

  .auth-mobile-toggle,
  .auth-mobile-menu {
    display: flex;
  }

  .auth-mobile-menu {
    flex-direction: column;
  }

  .auth-hero-inner,
  .auth-section,
  .auth-footer-inner,
  .footer-bottom {
    padding-left: 16px;
    padding-right: 16px;
  }

  .auth-hero-inner {
    padding-top: 34px;
    padding-bottom: 52px;
  }

  .auth-hero h1 {
    font-size: 38px;
  }

  .auth-hero-copy > p,
  .section-header p {
    font-size: 16px;
  }

  .auth-hero-actions {
    flex-direction: column;
  }

  .auth-hero-primary {
    width: 100%;
  }

  .auth-card {
    padding: 24px;
    border-radius: 20px;
  }

  .features-grid,
  .workflow-grid {
    grid-template-columns: 1fr;
  }

  .feature-card {
    grid-template-columns: 1fr;
  }

  .feature-visual {
    min-height: 190px;
  }

  .auth-section,
  .compact-section {
    padding-top: 86px;
    padding-bottom: 86px;
  }

  .auth-footer-inner,
  .footer-bottom {
    flex-direction: column;
  }
}
`;
