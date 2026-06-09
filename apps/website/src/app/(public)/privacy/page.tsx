import type { Metadata } from "next";
import Link from "next/link";
import {
  InformationPage,
  InformationSection,
} from "@/shared/components/content/InformationPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Commercial News",
  description:
    "Learn how Commercial News handles account, usage, and communication data.",
};

export default function PrivacyPage() {
  return (
    <InformationPage
      eyebrow="Privacy"
      title="Privacy policy"
      description="This policy describes the information Commercial News may collect and how it is used, protected, and managed."
      updatedAt="June 9, 2026"
    >
      <InformationSection title="Information we collect">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Account information such as your name, email address, and profile
            details.
          </li>
          <li>
            Activity associated with your account, including likes, comments,
            preferences, and saved content.
          </li>
          <li>
            Technical and usage information such as browser type, device data,
            IP address, and pages visited.
          </li>
          <li>
            Messages and supporting information you send through support,
            editorial, or privacy channels.
          </li>
        </ul>
      </InformationSection>

      <InformationSection title="How we use information">
        <p>
          We use information to provide and secure accounts, operate site
          features, personalize the reading experience, understand product
          performance, communicate with users, and comply with legal
          obligations.
        </p>
      </InformationSection>

      <InformationSection title="Cookies and session data">
        <p>
          Commercial News may use cookies and similar browser technologies to
          maintain sessions, remember preferences, protect accounts, and
          measure how the service is used. Browser settings can be used to
          control cookies, although some features may stop working correctly.
        </p>
      </InformationSection>

      <InformationSection title="Sharing and service providers">
        <p>
          Information may be shared with vendors that help operate hosting,
          analytics, email delivery, security, and customer support. These
          providers should only process information for the services they
          provide.
        </p>

        <p>
          Information may also be disclosed when required by law, to protect
          users and the service, or as part of a business reorganization.
        </p>
      </InformationSection>

      <InformationSection title="Retention and security">
        <p>
          We retain information for as long as reasonably necessary for the
          purposes described in this policy. We use administrative and
          technical safeguards, but no online service can guarantee absolute
          security.
        </p>
      </InformationSection>

      <InformationSection title="Your choices">
        <p>
          Depending on your location, you may have rights to access, correct,
          delete, or restrict the use of personal information. Contact{" "}
          <Link
            href="mailto:minhquy073@gmail.com"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            minhquy073@gmail.com
          </Link>{" "}
          to submit a request.
        </p>
      </InformationSection>
    </InformationPage>
  );
}
