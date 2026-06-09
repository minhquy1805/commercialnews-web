import type { Metadata } from "next";
import Link from "next/link";
import {
  InformationPage,
  InformationSection,
} from "@/shared/components/content/InformationPage";

export const metadata: Metadata = {
  title: "Terms of Use | Commercial News",
  description:
    "Review the terms that apply when using Commercial News and its account features.",
};

export default function TermsPage() {
  return (
    <InformationPage
      eyebrow="Terms"
      title="Terms of use"
      description="These terms describe the rules that apply when you access Commercial News or create an account."
      updatedAt="June 9, 2026"
    >
      <InformationSection title="Acceptance of these terms">
        <p>
          By accessing or using Commercial News, you agree to these terms and
          our{" "}
          <Link
            href="/privacy"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            privacy policy
          </Link>
          . If you do not agree, you should not use the service.
        </p>
      </InformationSection>

      <InformationSection title="Accounts">
        <p>
          You are responsible for providing accurate registration information,
          protecting your password, and activity performed through your
          account. Please notify us promptly if you believe your account has
          been compromised.
        </p>
      </InformationSection>

      <InformationSection title="Acceptable use">
        <p>You may not use Commercial News to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Break applicable laws or violate another person&apos;s rights.</li>
          <li>Harass others or publish unlawful, harmful, or deceptive content.</li>
          <li>Attempt to bypass security or disrupt the service.</li>
          <li>
            Scrape, copy, or redistribute substantial content without
            permission.
          </li>
          <li>Impersonate another person or misrepresent your affiliation.</li>
        </ul>
      </InformationSection>

      <InformationSection title="Content and intellectual property">
        <p>
          Commercial News and its original content, branding, design, and
          software are protected by intellectual property laws. Limited links
          and quotations may be used where legally permitted and properly
          attributed.
        </p>

        <p>
          You retain ownership of content you submit, but grant Commercial News
          permission to host, display, and process it as needed to provide the
          service.
        </p>
      </InformationSection>

      <InformationSection title="Service availability">
        <p>
          We may change, suspend, or discontinue features and may remove
          content or restrict accounts when reasonably necessary. The service
          is provided on an as-available basis without a guarantee that it will
          always be uninterrupted or error-free.
        </p>
      </InformationSection>

      <InformationSection title="Changes and contact">
        <p>
          These terms may be updated as the service evolves. Continued use
          after an update means the revised terms apply. Questions can be sent
          through our{" "}
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
