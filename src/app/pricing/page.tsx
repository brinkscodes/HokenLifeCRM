import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoWithText } from "@/components/layout/logo";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "For individual agents getting started.",
    features: [
      "Up to 500 contacts",
      "Policy & claims tracking",
      "Lead pipeline",
      "Basic dashboard",
      "Email support",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=starter",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
    description: "For growing agencies and teams.",
    features: [
      "Unlimited contacts",
      "Everything in Starter",
      "Team collaboration",
      "Analytics dashboard",
      "Activity timeline",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=professional",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large agencies with custom needs.",
    features: [
      "Everything in Professional",
      "Custom integrations",
      "Dedicated account manager",
      "SSO & advanced security",
      "SLA guarantee",
      "Custom onboarding",
    ],
    cta: "Contact Sales",
    href: "mailto:sales@hokenlife.com",
    highlighted: false,
  },
];

const faqs = [
  {
    question: "How does the 14-day free trial work?",
    answer:
      "Sign up for any plan and get full access for 14 days — no credit card required. At the end of your trial, choose a plan to continue or your account will be paused.",
  },
  {
    question: "Can I switch plans later?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. All data is encrypted at rest and in transit. Row-level security ensures your organization's data is completely isolated.",
  },
  {
    question: "Do you offer annual billing?",
    answer:
      "Yes — annual plans save you 20%. Contact us or switch to annual billing from your account settings.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/">
            <LogoWithText />
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm text-foreground font-medium transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-gradient-to-r from-[#92FE9D] to-[#00C9FF] text-black font-semibold hover:opacity-90">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#92FE9D]/10 blur-3xl" />
        <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-[#00C9FF]/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Start free for 14 days. No credit card required. Upgrade when you&apos;re ready.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-8 ${
                  plan.highlighted
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border/50 bg-card/80 backdrop-blur-sm"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#92FE9D] to-[#00C9FF] px-4 py-1 text-xs font-semibold text-black">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <Link href={plan.href} className="mt-6 block">
                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-[#92FE9D] to-[#00C9FF] text-black font-semibold hover:opacity-90"
                        : ""
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.cta}
                    {plan.name !== "Enterprise" && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </Link>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border/50 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Frequently asked questions</h2>
            <p className="text-muted-foreground">
              Everything you need to know about HokenLife CRM.
            </p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-lg border border-border/50 bg-card/80 p-6 backdrop-blur-sm"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold">{faq.question}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to get started?</h2>
          <p className="mb-8 text-muted-foreground">
            Join insurance professionals who are closing more deals with HokenLife CRM.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-gradient-to-r from-[#92FE9D] to-[#00C9FF] text-black font-semibold hover:opacity-90 text-base px-8">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <LogoWithText />
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} HokenLife CRM. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
