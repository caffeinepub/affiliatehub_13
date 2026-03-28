import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Identity } from "@icp-sdk/core/agent";
import {
  ArrowLeft,
  BarChart2,
  Check,
  Copy,
  DollarSign,
  ExternalLink,
  Link2,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Offer } from "../backend.d";
import { useGetOffers } from "../hooks/useQueries";

const FALLBACK_OFFERS: Offer[] = [
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

const CATEGORY_COLORS: Record<string, string> = {
  Technology: "oklch(0.36 0.14 264)",
  "Health & Wellness": "oklch(0.52 0.15 160)",
  Finance: "oklch(0.55 0.15 47)",
  Education: "oklch(0.48 0.14 300)",
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildRefLink(principal: string, offerTitle: string): string {
  const shortHash = principal.replace(/-/g, "").slice(0, 8);
  const slug = slugify(offerTitle);
  return `https://affiliatehub.app/ref/${shortHash}/${slug}`;
}

function truncatePrincipal(principal: string): string {
  if (principal.length <= 12) return principal;
  return `${principal.slice(0, 6)}...${principal.slice(-4)}`;
}

interface DashboardProps {
  identity: Identity;
  onBack: () => void;
}

export default function Dashboard({ identity, onBack }: DashboardProps) {
  const principal = identity.getPrincipal().toText();
  const { data: offers } = useGetOffers();
  const displayOffers = offers && offers.length > 0 ? offers : FALLBACK_OFFERS;

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (link: string, index: number) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // fallback silently
    }
  };

  const STATS = [
    {
      icon: Link2,
      label: "Active Links",
      value: displayOffers.length.toString(),
      suffix: "",
      color: "oklch(0.36 0.14 264)",
      bg: "oklch(0.36 0.14 264 / 0.08)",
    },
    {
      icon: TrendingUp,
      label: "Total Clicks",
      value: "1,247",
      suffix: "",
      color: "oklch(0.68 0.19 47)",
      bg: "oklch(0.68 0.19 47 / 0.08)",
    },
    {
      icon: DollarSign,
      label: "Total Earnings",
      value: "$342.50",
      suffix: "",
      color: "oklch(0.48 0.16 160)",
      bg: "oklch(0.48 0.16 160 / 0.08)",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen"
      style={{ background: "oklch(0.97 0.005 264)" }}
    >
      {/* Dashboard Header */}
      <div
        style={{ background: "oklch(0.22 0.09 264)" }}
        className="pt-10 pb-12 px-6"
      >
        <div className="max-w-[1200px] mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 mb-6 -ml-2"
            onClick={onBack}
            data-ocid="dashboard.back_button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                My Dashboard
              </h1>
              <p className="text-white/60 text-sm font-mono">
                Welcome back, {truncatePrincipal(principal)}
              </p>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium self-start sm:self-auto"
              style={{
                background: "oklch(1 0 0 / 0.08)",
                color: "oklch(0.68 0.19 47)",
              }}
            >
              <BarChart2 className="w-4 h-4" />
              Affiliate Dashboard
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 -mt-6">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          data-ocid="dashboard.panel"
        >
          {STATS.map(({ icon: Icon, label, value, color, bg }, i) => (
            <Card
              key={label}
              className="border-0 shadow-sm"
              data-ocid={`dashboard.item.${i + 1}`}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-2xl font-bold" style={{ color }}>
                      {value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Affiliate Links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card className="border-0 shadow-sm mb-10">
            <CardHeader className="pb-4">
              <CardTitle
                className="text-xl font-bold"
                style={{ color: "oklch(0.22 0.09 264)" }}
              >
                Your Affiliate Links
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Share these unique links to earn commissions on every sale.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {displayOffers.map((offer, i) => {
                  const refLink = buildRefLink(principal, offer.title);
                  const isCopied = copiedIndex === i;
                  const catColor =
                    CATEGORY_COLORS[offer.category] ?? "oklch(0.45 0.1 240)";

                  return (
                    <motion.div
                      key={offer.title}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.07, duration: 0.35 }}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5 hover:bg-muted/30 transition-colors"
                      data-ocid={`links.item.${i + 1}`}
                    >
                      {/* Offer info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-sm text-foreground">
                            {offer.title}
                          </span>
                          <Badge
                            className="text-xs font-semibold px-2 py-0 text-white border-0"
                            style={{ background: catColor }}
                          >
                            {offer.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs font-semibold px-2 py-0"
                            style={{
                              color: "oklch(0.68 0.19 47)",
                              borderColor: "oklch(0.68 0.19 47 / 0.4)",
                            }}
                          >
                            {Number(offer.commissionPercentage)}% Commission
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-sm">
                          {offer.description}
                        </p>
                      </div>

                      {/* Link + actions */}
                      <div className="flex items-center gap-2 sm:shrink-0">
                        <div
                          className="flex-1 sm:w-64 text-xs font-mono px-3 py-2 rounded-lg truncate"
                          style={{
                            background: "oklch(0.97 0.005 264)",
                            color: "oklch(0.36 0.14 264)",
                          }}
                        >
                          {refLink}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="shrink-0 gap-1.5 transition-all"
                          onClick={() => handleCopy(refLink, i)}
                          data-ocid={`links.copy.button.${i + 1}`}
                          style={
                            isCopied
                              ? {
                                  borderColor: "oklch(0.48 0.16 160)",
                                  color: "oklch(0.48 0.16 160)",
                                }
                              : {}
                          }
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {isCopied ? (
                              <motion.span
                                key="copied"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-1.5 text-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Copied!
                              </motion.span>
                            ) : (
                              <motion.span
                                key="copy"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-1.5 text-xs"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                Copy
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </Button>
                        <Button
                          size="sm"
                          className="shrink-0 text-white text-xs"
                          style={{ background: "oklch(0.22 0.09 264)" }}
                          asChild
                          data-ocid={`links.open.button.${i + 1}`}
                        >
                          <a
                            href={refLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
