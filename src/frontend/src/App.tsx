import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  BarChart2,
  ChevronDown,
  DollarSign,
  Facebook,
  Instagram,
  LayoutDashboard,
  Linkedin,
  Loader2,
  LogOut,
  Menu,
  Search,
  Shield,
  Star,
  TrendingUp,
  Twitter,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetDeals, useGetOffers, useGetStats } from "./hooks/useQueries";

type View = "home" | "dashboard";

const FALLBACK_OFFERS = [
  {
    title: "TechGear Pro Subscription",
    category: "Technology",
    commissionPercentage: 30n,
    description:
      "Premium tech accessories and subscriptions with high conversion rates.",
  },
  {
    title: "HealthFirst Supplements",
    category: "Health & Wellness",
    commissionPercentage: 25n,
    description:
      "Top-rated supplements and wellness products with recurring commissions.",
  },
  {
    title: "FinanceEdge Platform",
    category: "Finance",
    commissionPercentage: 40n,
    description:
      "Award-winning personal finance tool with generous affiliate payouts.",
  },
  {
    title: "LearnPro Online Courses",
    category: "Education",
    commissionPercentage: 35n,
    description:
      "In-demand online courses across 50+ categories, high-ticket commissions.",
  },
];

const FALLBACK_DEALS = [
  {
    title: "Black Friday Mega Sale",
    badgeLabel: "HOT DEAL",
    tagLabel: "E-Commerce",
    image: "/assets/generated/deal-ecommerce.dim_600x400.jpg",
  },
  {
    title: "Digital Marketing Bundle",
    badgeLabel: "TRENDING",
    tagLabel: "Marketing",
    image: "/assets/generated/deal-marketing.dim_600x400.jpg",
  },
  {
    title: "Wellness & Fitness Pack",
    badgeLabel: "NEW",
    tagLabel: "Health",
    image: "/assets/generated/deal-wellness.dim_600x400.jpg",
  },
];

const DEAL_IMAGES = [
  "/assets/generated/deal-ecommerce.dim_600x400.jpg",
  "/assets/generated/deal-marketing.dim_600x400.jpg",
  "/assets/generated/deal-wellness.dim_600x400.jpg",
];

const HOW_IT_WORKS = [
  {
    icon: UserPlus,
    step: "01",
    title: "Sign Up Free",
    description:
      "Create your affiliate account in minutes. No credit card required. Instant access to our full dashboard.",
  },
  {
    icon: Search,
    step: "02",
    title: "Choose Offers",
    description:
      "Browse hundreds of high-converting offers across dozens of categories. Filter by niche, payout, and EPC.",
  },
  {
    icon: DollarSign,
    step: "03",
    title: "Promote & Earn",
    description:
      "Share your unique links. Track performance in real-time. Get paid on time, every time, guaranteed.",
  },
];

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Offers", href: "#offers" },
  { label: "Deals", href: "#deals" },
  { label: "Blog", href: "#blog" },
  { label: "Company", href: "#company", hasDropdown: true },
];

const SOCIAL_LINKS = [
  { Icon: Twitter, label: "Twitter", href: "https://twitter.com" },
  { Icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { Icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { Icon: Instagram, label: "Instagram", href: "https://instagram.com" },
];

const FOOTER_COLS = [
  {
    heading: "Resources",
    links: [
      "Affiliate Guide",
      "API Documentation",
      "Tracking Setup",
      "Creative Assets",
      "Postback URLs",
    ],
  },
  {
    heading: "Company",
    links: ["About Us", "Careers", "Press Kit", "Partners", "Contact"],
  },
  {
    heading: "Legal",
    links: [
      "Privacy Policy",
      "Terms of Service",
      "Cookie Policy",
      "GDPR Compliance",
    ],
  },
];

function formatStat(
  val: bigint | number | undefined,
  prefix = "",
  suffix = "",
) {
  if (val === undefined) return "–";
  const n = typeof val === "bigint" ? Number(val) : val;
  if (n >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(1)}M${suffix}`;
  if (n >= 1_000) return `${prefix}${(n / 1_000).toFixed(0)}K${suffix}`;
  return `${prefix}${n}${suffix}`;
}

function truncatePrincipal(principal: string): string {
  if (principal.length <= 10) return principal;
  return `${principal.slice(0, 5)}...${principal.slice(-3)}`;
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [view, setView] = useState<View>("home");

  const { identity, login, clear, isLoggingIn, isLoginSuccess } =
    useInternetIdentity();

  useEffect(() => {
    if (isLoginSuccess) {
      setSignUpOpen(false);
      setView("dashboard");
    }
  }, [isLoginSuccess]);

  const handleLogout = () => {
    clear();
    setView("home");
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const { data: offers } = useGetOffers();
  const { data: deals } = useGetDeals();
  const { data: stats } = useGetStats();

  const displayOffers = offers && offers.length > 0 ? offers : FALLBACK_OFFERS;
  const displayDeals =
    deals && deals.length > 0
      ? deals.map((d, i) => ({
          ...d,
          image: DEAL_IMAGES[i % DEAL_IMAGES.length],
        }))
      : FALLBACK_DEALS;

  const totalAffiliates = stats?.totalAffiliates ?? 48200n;
  const totalOffers = stats?.totalOffers ?? 1340n;
  const totalPayouts = stats?.totalPayouts ?? 9200000n;

  const principalText = identity
    ? truncatePrincipal(identity.getPrincipal().toText())
    : null;

  // Navbar is shared between home and dashboard views
  const Navbar = (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-xs">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          type="button"
          className="flex items-center gap-2 shrink-0"
          onClick={() => setView("home")}
          data-ocid="nav.link"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "oklch(0.22 0.09 264)" }}
          >
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span
            className="text-lg font-bold"
            style={{ color: "oklch(0.22 0.09 264)" }}
          >
            AffiliateHub
          </span>
        </button>

        {/* Desktop Nav */}
        {view === "home" && (
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-1 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                data-ocid="nav.link"
              >
                {link.label}
                {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
              </a>
            ))}
          </nav>
        )}

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {identity ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 font-medium"
                style={{
                  color:
                    view === "dashboard"
                      ? "oklch(0.68 0.19 47)"
                      : "oklch(0.36 0.14 264)",
                }}
                onClick={() =>
                  setView(view === "dashboard" ? "home" : "dashboard")
                }
                data-ocid="nav.dashboard.button"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
              <span
                className="text-sm font-medium px-3 py-1.5 rounded-lg"
                style={{
                  background: "oklch(0.22 0.09 264 / 0.08)",
                  color: "oklch(0.22 0.09 264)",
                }}
              >
                {principalText}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50 gap-1.5"
                onClick={handleLogout}
                data-ocid="nav.logout.button"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-navy-deep text-navy-deep hover:bg-navy-deep hover:text-white"
                onClick={() => setSignUpOpen(true)}
                data-ocid="nav.login.button"
              >
                Login
              </Button>
              <Button
                size="sm"
                className="text-white font-semibold px-5"
                style={{ background: "oklch(0.68 0.19 47)" }}
                onClick={() => setSignUpOpen(true)}
                data-ocid="nav.joinnow.button"
              >
                Join Now
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md text-foreground/70"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-ocid="nav.toggle"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t border-border px-6 py-4 flex flex-col gap-4"
        >
          {view === "home" &&
            NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
                data-ocid="nav.link"
              >
                {link.label}
              </a>
            ))}
          <div className="flex gap-3 pt-2">
            {identity ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 gap-1.5"
                  style={{ color: "oklch(0.36 0.14 264)" }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setView(view === "dashboard" ? "home" : "dashboard");
                  }}
                  data-ocid="nav.dashboard.button"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 gap-1.5"
                  onClick={handleLogout}
                  data-ocid="nav.logout.button"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-navy-deep text-navy-deep"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSignUpOpen(true);
                  }}
                  data-ocid="nav.login.button"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  className="flex-1 text-white"
                  style={{ background: "oklch(0.68 0.19 47)" }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSignUpOpen(true);
                  }}
                  data-ocid="nav.joinnow.button"
                >
                  Join Now
                </Button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );

  // Dashboard view
  if (view === "dashboard" && identity) {
    return (
      <div className="min-h-screen bg-background font-sans">
        {Navbar}
        <Dashboard identity={identity} onBack={() => setView("home")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ── SIGN UP MODAL ── */}
      <Dialog open={signUpOpen} onOpenChange={setSignUpOpen}>
        <DialogContent className="sm:max-w-md" data-ocid="signup.dialog">
          <DialogHeader>
            <div
              className="mx-auto mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "oklch(0.22 0.09 264)" }}
            >
              <Shield className="w-7 h-7 text-white" />
            </div>
            <DialogTitle
              className="text-center text-2xl font-bold"
              style={{ color: "oklch(0.22 0.09 264)" }}
            >
              Join AffiliateHub
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground mt-1">
              Sign up or log in with Internet Identity — secure, private, no
              password needed.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex flex-col gap-4">
            <Button
              size="lg"
              className="w-full text-white font-semibold text-base py-6 rounded-xl"
              style={{ background: "oklch(0.68 0.19 47)" }}
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="signup.primary_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Continue with Internet Identity
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Free to join. No monthly fees.
            </p>

            <div
              className="rounded-xl p-4 text-xs text-muted-foreground"
              style={{ background: "oklch(0.97 0.005 264)" }}
            >
              <p
                className="font-semibold mb-1"
                style={{ color: "oklch(0.22 0.09 264)" }}
              >
                Why Internet Identity?
              </p>
              <ul className="space-y-1 list-disc list-inside">
                <li>No username or password to remember</li>
                <li>Cryptographically secure authentication</li>
                <li>Your data stays private and decentralized</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {Navbar}

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ minHeight: 520 }}>
        <div className="flex flex-col md:flex-row min-h-[520px]">
          {/* Left: dark gradient panel */}
          <div className="hero-gradient flex-1 md:w-[55%] flex items-center px-8 md:px-16 py-16 md:py-20 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-xl"
            >
              <Badge
                className="mb-5 text-xs font-semibold px-3 py-1"
                style={{
                  background: "oklch(0.68 0.19 47 / 0.2)",
                  color: "oklch(0.68 0.19 47)",
                  border: "1px solid oklch(0.68 0.19 47 / 0.4)",
                }}
              >
                <Star className="w-3 h-3 mr-1" /> #1 Affiliate Marketing
                Platform
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-[52px] font-bold text-white leading-tight mb-5">
                Earn More with
                <br />
                <span style={{ color: "oklch(0.68 0.19 47)" }}>
                  Top Affiliate
                </span>
                <br />
                Offers &amp; Deals
              </h1>
              <p className="text-white/75 text-base md:text-lg mb-8 leading-relaxed">
                Join over 48,000 affiliates earning passive income. Access
                exclusive high-converting offers, real-time analytics, and
                on-time payouts every month.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-white font-semibold px-8 py-3 rounded-lg text-base"
                  style={{ background: "oklch(0.68 0.19 47)" }}
                  onClick={() => setSignUpOpen(true)}
                  data-ocid="hero.primary_button"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/40 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-lg text-base"
                  onClick={() => scrollTo("offers")}
                  data-ocid="hero.secondary_button"
                >
                  Browse Offers
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right: lifestyle image with orange accent */}
          <div
            className="md:w-[45%] relative overflow-hidden"
            style={{ minHeight: 320 }}
          >
            <img
              src="/assets/generated/hero-laptop-person.dim_800x600.jpg"
              alt="Affiliate marketer working on laptop"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Orange curved accent on right edge */}
            <svg
              aria-hidden="true"
              className="absolute right-0 top-0 h-full"
              width="80"
              viewBox="0 0 80 520"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M80,0 C20,130 20,390 80,520 L80,0 Z"
                fill="oklch(0.68 0.19 47)"
              />
            </svg>
            {/* Dark overlay for blending */}
            <div className="absolute inset-0 bg-navy-deep/30" />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-b border-border bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
          >
            {(
              [
                {
                  icon: Users,
                  value: formatStat(totalAffiliates, "", "+"),
                  label: "Active Affiliates",
                  color: "oklch(0.36 0.14 264)",
                },
                {
                  icon: TrendingUp,
                  value: formatStat(totalOffers),
                  label: "Available Offers",
                  color: "oklch(0.68 0.19 47)",
                },
                {
                  icon: BarChart2,
                  value: formatStat(totalPayouts, "$", ""),
                  label: "Total Payouts Made",
                  color: "oklch(0.36 0.14 264)",
                },
              ] as const
            ).map(({ icon: Icon, value, label, color }) => (
              <div
                key={label}
                className="flex items-center justify-center gap-4"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: `${color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold" style={{ color }}>
                    {value}
                  </div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED OFFERS ── */}
      <section id="offers" className="py-16 md:py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ color: "oklch(0.22 0.09 264)" }}
            >
              Featured Products &amp; Offers
            </h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              Hand-picked high-converting offers with top commission rates
              across every niche.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayOffers.slice(0, 4).map((offer, i) => (
              <motion.div
                key={offer.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="rounded-xl border border-border bg-white shadow-card overflow-hidden flex flex-col"
                data-ocid={`offers.item.${i + 1}`}
              >
                <div
                  className="h-36 relative overflow-hidden"
                  style={{ background: "oklch(0.36 0.14 264 / 0.08)" }}
                >
                  <img
                    src={`https://picsum.photos/seed/offer${i + 10}/400/200`}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge
                      className="text-xs font-bold text-white"
                      style={{ background: "oklch(0.68 0.19 47)" }}
                    >
                      {Number(offer.commissionPercentage)}% Commission
                    </Badge>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <span
                    className="text-xs font-medium mb-1"
                    style={{ color: "oklch(0.45 0.13 264)" }}
                  >
                    {offer.category}
                  </span>
                  <h3 className="font-semibold text-foreground text-sm mb-2 leading-snug">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
                    {offer.description}
                  </p>
                  <Button
                    size="sm"
                    className="w-full text-white text-xs font-semibold"
                    style={{ background: "oklch(0.22 0.09 264)" }}
                    data-ocid={`offers.promote.button.${i + 1}`}
                  >
                    Promote Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {displayOffers.length === 0 && (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="offers.empty_state"
            >
              No offers available yet. Check back soon.
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        className="py-16 md:py-20"
        style={{ background: "oklch(0.97 0.005 264)" }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ color: "oklch(0.22 0.09 264)" }}
            >
              How It Works
            </h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              Three simple steps to start earning with AffiliateHub.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ icon: Icon, step, title, description }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative text-center"
                data-ocid={`steps.item.${i + 1}`}
              >
                {/* Connector line */}
                {i < 2 && (
                  <div
                    className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px"
                    style={{ background: "oklch(0.68 0.19 47 / 0.3)" }}
                  />
                )}
                <div
                  className="relative z-10 mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-card"
                  style={{ background: "oklch(0.22 0.09 264)" }}
                >
                  <Icon className="w-8 h-8 text-white" />
                  <span
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center"
                    style={{ background: "oklch(0.68 0.19 47)" }}
                  >
                    {i + 1}
                  </span>
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: "oklch(0.22 0.09 264)" }}
                >
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP DEALS ── */}
      <section id="deals" className="py-16 md:py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ color: "oklch(0.22 0.09 264)" }}
            >
              Top Deals Showcase
            </h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              This week&apos;s hottest deals with the highest earning potential
              for affiliates.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {displayDeals.slice(0, 3).map((deal, i) => (
              <motion.div
                key={deal.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className="group rounded-2xl overflow-hidden border border-border shadow-card relative cursor-pointer"
                data-ocid={`deals.item.${i + 1}`}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Badge overlay */}
                  <div className="absolute top-4 left-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ background: "oklch(0.68 0.19 47)" }}
                    >
                      {deal.badgeLabel}
                    </span>
                  </div>
                  {/* Bottom text overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-bold text-lg leading-tight mb-2">
                      {deal.title}
                    </p>
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium text-white/90"
                      style={{ background: "oklch(0.36 0.14 264 / 0.8)" }}
                    >
                      {deal.tagLabel}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Limited time offer
                  </span>
                  <Button
                    size="sm"
                    className="text-white text-xs font-semibold"
                    style={{ background: "oklch(0.22 0.09 264)" }}
                    data-ocid={`deals.promote.button.${i + 1}`}
                  >
                    Claim Deal
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {displayDeals.length === 0 && (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="deals.empty_state"
            >
              No deals available right now.
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section
        className="py-16 md:py-20"
        style={{ background: "oklch(0.97 0.005 264)" }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl p-12 md:p-16 text-center navy-gradient"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Earning?
              <br />
              <span style={{ color: "oklch(0.68 0.19 47)" }}>
                Join AffiliateHub Today.
              </span>
            </h2>
            <p className="text-white/70 text-base md:text-lg mb-8 max-w-xl mx-auto">
              Over 48,000 affiliates trust AffiliateHub for reliable payouts,
              premium offers, and the tools to scale their income.
            </p>
            <Button
              size="lg"
              className="text-white font-bold text-base px-12 py-4 rounded-xl"
              style={{ background: "oklch(0.68 0.19 47)" }}
              onClick={() => setSignUpOpen(true)}
              data-ocid="cta.primary_button"
            >
              Join AffiliateHub Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="mt-4 text-white/50 text-sm">
              Free to join. No monthly fees. Start earning today.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "oklch(0.18 0.07 264)" }}>
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            {/* Brand column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "oklch(0.68 0.19 47)" }}
                >
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">
                  AffiliateHub
                </span>
              </div>
              <p className="text-white/55 text-sm leading-relaxed max-w-xs">
                The leading affiliate marketing platform connecting publishers
                with premium advertisers since 2018.
              </p>
              <div className="flex gap-4 mt-6">
                {SOCIAL_LINKS.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    style={{ background: "oklch(1 0 0 / 0.07)" }}
                    data-ocid="footer.link"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {FOOTER_COLS.map(({ heading, links }) => (
              <div key={heading}>
                <h4 className="text-white font-semibold text-sm mb-4">
                  {heading}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-white/55 text-sm hover:text-white transition-colors"
                        data-ocid="footer.link"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/40 text-sm">
              &copy; {new Date().getFullYear()} AffiliateHub. All rights
              reserved.
            </p>
            <p className="text-white/40 text-sm">
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 transition-colors underline underline-offset-2"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
