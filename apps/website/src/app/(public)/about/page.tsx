import type { Metadata } from "next";
import Link from "next/link";
import {
  InformationPage,
  InformationSection,
} from "@/shared/components/content/InformationPage";

export const metadata: Metadata = {
  title: "About Us | Commercial News",
  description:
    "Learn about the mission, coverage, and values behind Commercial News.",
};

const values = [
  {
    title: "Clarity",
    description:
      "We explain complex technology and business topics in language readers can use.",
  },
  {
    title: "Context",
    description:
      "We connect individual events to the larger products, markets, and decisions behind them.",
  },
  {
    title: "Trust",
    description:
      "We value accurate sourcing, transparent corrections, and a clear distinction between fact and opinion.",
  },
];

export default function AboutPage() {
  return (
    <InformationPage
      eyebrow="About us"
      title="News for people building the modern world"
      description="Commercial News covers technology, business, cloud, security, and AI for readers who want more than headlines."
    >
      <InformationSection title="Our mission">
        <p>
          Our mission is to make important developments easier to understand.
          We focus on what changed, why it matters, and how it may affect
          builders, teams, companies, and markets.
        </p>

        <p>
          Commercial News is designed for curious readers who care about both
          the technical detail and the business context around digital
          products.
        </p>
      </InformationSection>

      <InformationSection title="What we cover">
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            "Software and emerging technology",
            "Business strategy and digital markets",
            "Cloud infrastructure and operations",
            "Cybersecurity and privacy",
            "Artificial intelligence",
            "Product and engineering culture",
          ].map((topic) => (
            <li
              key={topic}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-700"
            >
              {topic}
            </li>
          ))}
        </ul>
      </InformationSection>

      <InformationSection title="Our values">
        <div className="grid gap-4 sm:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-slate-200 p-5"
            >
              <h3 className="font-bold text-slate-950">{value.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </InformationSection>

      <InformationSection title="Talk to us">
        <p>
          Have feedback, a correction, or a story worth investigating? Visit
          our{" "}
          <Link
            href="/contact"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            contact page
          </Link>
          .
        </p>
      </InformationSection>
    </InformationPage>
  );
}
