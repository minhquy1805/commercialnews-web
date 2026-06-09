import type { Metadata } from "next";
import Link from "next/link";
import {
  InformationPage,
  InformationSection,
} from "@/shared/components/content/InformationPage";

export const metadata: Metadata = {
  title: "Contact Us | Commercial News",
  description:
    "Contact Commercial News about stories, corrections, support, or privacy.",
};

const contactOptions = [
  {
    title: "General enquiries",
    description: "Questions about Commercial News or its coverage.",
    email: "minhquy073@gmail.com",
  },
  {
    title: "Editorial and corrections",
    description: "Story ideas, source material, or a correction request.",
    email: "minhquy073@gmail.com",
  },
  {
    title: "Privacy",
    description: "Questions about personal data or privacy requests.",
    email: "minhquy073@gmail.com",
  },
];

export default function ContactPage() {
  return (
    <InformationPage
      eyebrow="Contact us"
      title="We would like to hear from you"
      description="Choose the contact that best matches your question. Clear details and relevant links help us respond more effectively."
    >
      <InformationSection title="Get in touch">
        <div className="grid gap-4 md:grid-cols-3">
          {contactOptions.map((option) => (
            <div
              key={option.title}
              className="flex flex-col rounded-2xl border border-slate-200 p-5"
            >
              <h3 className="font-bold text-slate-950">{option.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                {option.description}
              </p>
              <Link
                href={`mailto:${option.email}`}
                className="mt-4 break-all text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                {option.email}
              </Link>
            </div>
          ))}
        </div>
      </InformationSection>

      <InformationSection title="For correction requests">
        <p>
          Please include the article URL, the information you believe is
          incorrect, and supporting evidence when available. We review
          correction requests according to our{" "}
          <Link
            href="/editorial-policy"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            editorial policy
          </Link>
          .
        </p>
      </InformationSection>

      <InformationSection title="Response times">
        <p>
          We aim to review time-sensitive editorial and account-related
          messages first. Response times may vary depending on the nature and
          volume of requests.
        </p>
      </InformationSection>
    </InformationPage>
  );
}
