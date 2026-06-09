import type { Metadata } from "next";
import Link from "next/link";
import {
  InformationPage,
  InformationSection,
} from "@/shared/components/content/InformationPage";

export const metadata: Metadata = {
  title: "Editorial Policy | Commercial News",
  description:
    "Read the editorial standards that guide reporting and corrections at Commercial News.",
};

export default function EditorialPolicyPage() {
  return (
    <InformationPage
      eyebrow="Editorial standards"
      title="How we approach our reporting"
      description="Our editorial policy explains how we pursue accuracy, independence, fairness, and transparency."
      updatedAt="June 9, 2026"
    >
      <InformationSection title="Accuracy comes first">
        <p>
          We aim to verify names, dates, figures, quotations, and technical
          claims before publication. When information cannot be independently
          confirmed, we identify the source and describe the uncertainty.
        </p>
      </InformationSection>

      <InformationSection title="Sources and attribution">
        <p>
          We prefer primary sources such as official documents, public data,
          direct interviews, and original research. We link to source material
          when it is useful and available to readers.
        </p>

        <p>
          Anonymous sources are used sparingly and only when the information
          serves a clear public interest and cannot reasonably be obtained on
          the record.
        </p>
      </InformationSection>

      <InformationSection title="Independence and conflicts">
        <p>
          Editorial decisions should not be influenced by advertisers,
          sponsors, investors, or personal relationships. Relevant conflicts of
          interest are disclosed to readers.
        </p>

        <p>
          Sponsored or partner content must be clearly labeled and kept
          distinct from independent reporting.
        </p>
      </InformationSection>

      <InformationSection title="Corrections and updates">
        <p>
          We correct meaningful factual errors promptly. Substantial
          corrections should explain what changed, while routine spelling or
          formatting fixes may be made without a note.
        </p>

        <p>
          To report a possible error, please use our{" "}
          <Link
            href="/contact"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            contact page
          </Link>
          .
        </p>
      </InformationSection>

      <InformationSection title="AI-assisted work">
        <p>
          Automation may assist with research, transcription, organization, or
          editing, but published work remains subject to human review.
          Journalists and editors remain responsible for accuracy, context, and
          final publication decisions.
        </p>
      </InformationSection>
    </InformationPage>
  );
}
