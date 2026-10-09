import {
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Heart,
  LoaderCircle,
  Menu,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Target,
  TrendingUp,
  UsersRound,
  X,
} from 'lucide-react'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { contactConfig } from './config/contact'
import { defaultContent } from './data/defaultContent'
import { useReveal } from './hooks/useReveal'

const stats = [
  { icon: CalendarDays, value: 'TODO', label: 'سنوات الخبرة' },
  { icon: UsersRound, value: 'TODO', label: 'عدد المتخصصين' },
  { icon: Heart, value: 'TODO', label: 'عدد الأطفال المستفيدين' },
]

const reasons = [
  { icon: CalendarDays, title: 'متابعة دورية', body: 'للتقدم والتطور' },
  { icon: Heart, title: 'اهتمام فردي', body: 'بكل طفل وأسرته' },
  { icon: UsersRound, title: 'خبرة واسعة', body: 'مع مختلف حالات الأطفال' },
  { icon: ShieldCheck, title: 'أساليب علاجية حديثة', body: 'ومبنية على أسس علمية' },
]

const journeySteps = [
  { icon: MessageCircle, title: 'اللقاء الأول', body: 'نستمع إليكم ونتعرف على احتياجات طفلك وتحدياته.' },
  { icon: ClipboardCheck, title: 'التقييم المتخصص', body: 'نقيّم المهارات ونحدد نقاط القوة والجوانب التي تحتاج إلى دعم.' },
  { icon: Target, title: 'الخطة الفردية', body: 'نصمم برنامجًا مناسبًا لقدرات طفلك وأهدافه خطوة بخطوة.' },
  { icon: TrendingUp, title: 'المتابعة والتطور', body: 'نقيس التقدم باستمرار ونشارك الأسرة النتائج والتوصيات.' },
]

const SHOW_TEAM_SECTION = false // TODO: Enable this when real team content is available.
const SHOW_STATS = false // TODO: Add verified years, specialist, and children-served figures before enabling.

function AccessibilityIcon({ size = 34, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="4" r="2" />
      <path d="M5 8.5c4.5-1.6 9.5-1.6 14 0M12 8.5v5M8 21l4-7 4 7M7 12l5-3.5L17 12" />
    </svg>
  )
}

const serviceIcons = {
  Accessibility: AccessibilityIcon,
  MessageCircle,
  UsersRound,
  Brain,
  BookOpen,
}

function SectionHeading({ title, subtitle, align = 'center' }) {
  return (
    <div className={`section-heading section-heading--${align} reveal-item`}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  )
}

const Button = forwardRef(function Button(
  { children, icon: Icon, variant = 'primary', href, iconOnly = false, className = '', type = 'button', ...props },
  ref
) {
  const Component = href ? 'a' : 'button'
  const classes = [
    'button',
    `button--${variant}`,
    iconOnly ? 'button--icon-only' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <Component ref={ref} className={classes} href={href} type={href ? undefined : type} {...props}>
      <Icon aria-hidden="true" />
      {children && <span>{children}</span>}
    </Component>
  )
})

function Header({ onBook }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const menuBtnRef = useRef(null)
  const navRef = useRef(null)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY
          setScrolled(scrollY > 8)

          // Scroll spy: dynamically track the section in view
          const sectionIds = ['home', 'services', 'about']
          if (SHOW_TEAM_SECTION) sectionIds.push('team')

          const scrollPosition = scrollY + 120
          let current = 'home'

          for (const id of sectionIds) {
            const el = document.getElementById(id)
            if (el && el.offsetTop <= scrollPosition) {
              current = id
            }
          }

          setActiveSection(current)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  useEffect(() => {
    if (!open) return undefined

    const navEl = navRef.current
    const btnEl = menuBtnRef.current
    if (!navEl) return undefined

    const focusables = navEl.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
    const firstFocusable = focusables[0]
    const lastFocusable = focusables[focusables.length - 1]

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        btnEl?.focus()
        return
      }
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable || document.activeElement === btnEl) {
            e.preventDefault()
            lastFocusable?.focus()
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault()
            firstFocusable?.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    firstFocusable?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const toggleMenu = () => {
    if (open) {
      setOpen(false)
      menuBtnRef.current?.focus()
    } else {
      setOpen(true)
    }
  }

  const handleNavClick = (sectionId) => {
    if (sectionId) {
      setActiveSection(sectionId)
    }
    if (open) {
      setOpen(false)
      menuBtnRef.current?.focus()
    }
  }

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container header-inner">
        <a className="brand" href="#home" aria-label="مركز وصال" onClick={() => handleNavClick('home')}>
          <img src="/wasal/assets/wasal-logo.png" alt="شعار مركز وصال" />
        </a>
        <Button
          ref={menuBtnRef}
          className="menu-btn"
          variant="secondary"
          icon={open ? X : Menu}
          iconOnly
          onClick={toggleMenu}
          aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
          aria-expanded={open}
          aria-controls="primary-nav"
        />
        <nav
          ref={navRef}
          id="primary-nav"
          className={open ? 'nav open' : 'nav'}
        >
          <a
            className={`nav-link${activeSection === 'home' ? ' active' : ''}`}
            href="#home"
            onClick={() => handleNavClick('home')}
          >
            الرئيسية
          </a>
          <a
            className={`nav-link${activeSection === 'services' ? ' active' : ''}`}
            href="#services"
            onClick={() => handleNavClick('services')}
          >
            خدماتنا
          </a>
          <a
            className={`nav-link${activeSection === 'about' ? ' active' : ''}`}
            href="#about"
            onClick={() => handleNavClick('about')}
          >
            من نحن
          </a>
          {SHOW_TEAM_SECTION && (
            <a
              className={`nav-link${activeSection === 'team' ? ' active' : ''}`}
              href="#team"
              onClick={() => handleNavClick('team')}
            >
              فريق العمل
            </a>
          )}
        </nav>
        <Button variant="primary-sm" icon={CalendarDays} onClick={onBook}>احجز موعد</Button>
      </div>
    </header>
  )
}

function Hero({ section, onBook }) {
  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow hero-load-item">{section.eyebrow}</p>
          <h1 className="hero-load-item">{section.title}</h1>
          <p className="hero-subtitle hero-load-item">{section.subtitle}</p>
          <p className="hero-description hero-load-item">{section.body}</p>
          <div className="hero-actions hero-load-item">
            <Button onClick={onBook} variant="primary" icon={CalendarDays}>{section.cta_label}</Button>
            <Button href="#contact" variant="secondary" icon={Phone}>تواصل معنا</Button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-visual-motion">
            <div className="hero-float-wrapper">
              <div className="photo-blob hero-photo"><img src={section.data?.image_url || '/wasal/assets/hero-child.png'} alt="طفل يطوّر مهاراته أثناء اللعب" /></div>
            </div>
          </div>
          <span className="float-heart" aria-hidden="true">♥</span>
        </div>
      </div>
    </section>
  )
}

function Services({ section, items }) {
  return (
    <section className="services section" id="services">
      <div className="container">
        <SectionHeading title={section.title} subtitle={section.subtitle} />
        <div className="service-grid">
          {items.map((item, index) => {
            const Icon = serviceIcons[item.icon] || Brain
            return (
              <article className="service-card reveal-item" key={item.id || item.slug} style={{ '--reveal-index': index }}>
                <div className="icon-badge"><Icon aria-hidden="true" /></div>
                <h3>{item.title}</h3><p>{item.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function About({ section }) {
  return (
    <section className="about section" id="about">
      <div className="container about-grid">
        <div className="about-copy reveal-item reveal-from-start">
          <SectionHeading title={section.title} align="start" />
          <p>{section.body}</p>
          {SHOW_STATS && (
            <div className="stats">
              {stats.map(({ icon: Icon, value, label }) => (
                <div className="stat" key={label}><div className="icon-badge"><Icon aria-hidden="true" /></div><strong>{value}</strong><span>{label}</span></div>
              ))}
            </div>
          )}
        </div>
        <div className="about-visual reveal-item reveal-from-end">
          <div className="photo-blob about-photo"><img src={section.data?.image_url || '/wasal/assets/about-child.png'} alt="طفلة تتعلم من خلال اللعب بالمكعبات" /></div>
          <span className="float-star" aria-hidden="true">★</span>
        </div>
      </div>
    </section>
  )
}

function WhyUs({ section }) {
  return (
    <section className="why section">
      <div className="container">
        <SectionHeading title={section.title} />
        <div className="reason-grid">
          {reasons.map(({ icon: Icon, title, body }, index) => (
            <article className="reason reveal-item" key={title} style={{ '--reveal-index': index }}>
              <div className="icon-badge"><Icon aria-hidden="true" /></div>
              <div><h3>{title}</h3><p>{body}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Journey({ section, onBook }) {
  return (
    <section className="journey section" id="journey">
      <div className="container">
        <SectionHeading title={section.title} subtitle={section.subtitle} />
        <div className="journey-grid">
          {journeySteps.map(({ icon: Icon, title, body }, index) => (
            <article className="journey-step reveal-item" key={title} style={{ '--reveal-index': index }}>
              <span className="journey-number">{index + 1}</span>
              <div className="icon-badge journey-icon"><Icon aria-hidden="true" /></div>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="journey-cta reveal-item">
          <p>ابدأ بالخطوة الأولى</p>
          <Button variant="primary" icon={CalendarDays} onClick={onBook}>احجز موعد</Button>
        </div>
      </div>
    </section>
  )
}

function Footer({ section, services = [], onBook }) {
  const info = contactConfig
  const phoneHref = info.phone.replace(/[^\d+]/g, '')

  return (
    <footer className="footer" id="contact">
      <div className="container footer-grid">
        <div className="footer-col footer-col--brand reveal-item reveal-fade-only" style={{ '--reveal-index': 0 }}>
          <a className="footer-logo" href="#home" aria-label="مركز وصال">
            <img src="/wasal/assets/wasal-logo.png" alt="مركز وصال" />
          </a>
          <p className="footer-desc">{section.body}</p>
          <div className="footer-tagline">
            <Heart aria-hidden="true" />
            <span>معًا نبني مستقبلًا أفضل لأطفالنا</span>
          </div>
        </div>

        <div className="footer-col reveal-item reveal-fade-only" style={{ '--reveal-index': 1 }}>
          <h4 className="footer-title">روابط سريعة</h4>
          <ul className="footer-links">
            <li><a href="#home">الرئيسية</a></li>
            <li><a href="#services">خدماتنا</a></li>
            <li><a href="#about">من نحن</a></li>
            <li><a href="#journey">رحلة طفلك</a></li>
          </ul>
        </div>

        <div className="footer-col reveal-item reveal-fade-only" style={{ '--reveal-index': 2 }}>
          <h4 className="footer-title">برامج التأهيل</h4>
          <ul className="footer-links">
            {services.map((item) => (
              <li key={item.id || item.slug}>
                <a href="#services">{item.title}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col footer-col--contact reveal-item reveal-fade-only" style={{ '--reveal-index': 3 }}>
          <h4 className="footer-title">تواصل معنا</h4>
          <p className="footer-contact-intro">فريقنا مستعد للإجابة على جميع استفساراتكم وتقديم الدعم لطفلكم.</p>
          <div className="footer-contact-list">
            <a className="footer-contact-pill" href={`tel:${phoneHref}`} dir="ltr">
              <Phone aria-hidden="true" />
              <span>{info.phone}</span>
            </a>
            <a
              className="footer-contact-pill"
              href={`https://wa.me/${info.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" />
              <span>واتساب مباشر</span>
            </a>
          </div>
          <Button
            className="footer-cta-btn"
            variant="primary"
            icon={CalendarDays}
            onClick={onBook}
          >
            احجز موعد الآن
          </Button>
        </div>
      </div>
      <div className="container copyright">
        <div>جميع الحقوق محفوظة © مركز وصال</div>
        <span>صُنع بحب لأطفالنا</span>
      </div>
    </footer>
  )
}

function AppointmentModal({ open, onClose, services }) {
  const [form, setForm] = useState({ parent_name: '', phone: '', child_age: '', service: '', message: '', website: '' })
  const [state, setState] = useState({ type: 'idle', message: '' })

  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', closeOnEscape)
    document.body.classList.add('modal-open')
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.classList.remove('modal-open')
    }
  }, [open, onClose])

  if (!open) return null

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  function submit(event) {
    event.preventDefault()
    if (form.website) return

    const details = [
      `اسم ولي الأمر: ${form.parent_name.trim()}`,
      `رقم الهاتف: ${form.phone.trim()}`,
      form.child_age && `عمر الطفل: ${form.child_age}`,
      form.service && `الخدمة: ${form.service}`,
      form.message.trim() && `الرسالة: ${form.message.trim()}`,
    ].filter(Boolean).join('\n')

    const whatsapp = contactConfig.whatsapp
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(details)}`, '_blank', 'noopener,noreferrer')

    setState({ type: 'success', message: 'تم إرسال طلبك بنجاح، وسنتواصل معك في أقرب وقت.' })
    setForm({ parent_name: '', phone: '', child_age: '', service: '', message: '', website: '' })
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
        <Button className="modal-close" variant="secondary" icon={X} iconOnly onClick={onClose} aria-label="إغلاق" />
        <div className="modal-heading"><div className="modal-icon"><CalendarDays aria-hidden="true" /></div><div><h2 id="booking-title">احجز موعدًا</h2><p>اترك بياناتك وسيتواصل معك فريقنا.</p></div></div>
        {state.type === 'success' ? (
          <div className="success-message"><CheckCircle2 aria-hidden="true" /><h3>شكرًا لك</h3><p>{state.message}</p><Button variant="secondary" icon={X} onClick={onClose}>إغلاق</Button></div>
        ) : (
          <form className="booking-form" onSubmit={submit}>
            <label>اسم ولي الأمر<input name="parent_name" value={form.parent_name} onChange={update} minLength="2" maxLength="100" required placeholder="الاسم بالكامل" /></label>
            <label>رقم الهاتف<input name="phone" value={form.phone} onChange={update} minLength="7" maxLength="30" required inputMode="tel" dir="ltr" placeholder="01xxxxxxxxx" /></label>
            <div className="form-row">
              <label>عمر الطفل<input name="child_age" value={form.child_age} onChange={update} type="number" min="1" max="18" placeholder="5" /></label>
              <label>الخدمة<select name="service" value={form.service} onChange={update}><option value="">اختر الخدمة</option>{services.map((item) => <option key={item.id || item.slug} value={item.title}>{item.title}</option>)}</select></label>
            </div>
            <label>رسالتك <span>(اختياري)</span><textarea name="message" value={form.message} onChange={update} maxLength="1000" rows="3" placeholder="أخبرنا باختصار كيف يمكننا مساعدتك" /></label>
            <input className="honeypot" name="website" value={form.website} onChange={update} tabIndex="-1" autoComplete="off" />
            {state.type === 'error' && <p className="form-error">{state.message}</p>}
            <Button className="submit-btn" type="submit" variant="primary" icon={state.type === 'loading' ? LoaderCircle : Send} disabled={state.type === 'loading'}>{state.type === 'loading' ? 'جارٍ الإرسال...' : 'إرسال طلب الحجز'}</Button>
          </form>
        )}
      </section>
    </div>
  )
}

export default function App() {
  const content = defaultContent
  const [bookingOpen, setBookingOpen] = useState(false)
  const openBooking = () => setBookingOpen(true)

  useReveal()

  return (
    <>
      <Header onBook={openBooking} />
      <main>
        <Hero section={content.sections.hero} onBook={openBooking} />
        <Services section={content.sections.services} items={content.services} />
        <About section={content.sections.about} />
        <WhyUs section={content.sections.why} />
        <Journey section={content.sections.journey} onBook={openBooking} />
      </main>
      <Footer section={content.sections.footer} services={content.services} onBook={openBooking} />
      <AppointmentModal open={bookingOpen} onClose={() => setBookingOpen(false)} services={content.services} />
    </>
  )
}
