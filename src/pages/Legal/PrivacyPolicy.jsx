import React from 'react';
import { LegalLayout, Section, SubSection, ListItem, Table } from './LegalLayout';

export const PrivacyPolicy = () => {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="Learn how Xalora collects, uses, and protects your personal data"
    >
      <Section title="1. Introduction">
        <p>
          Xalora ("Company," "we," "us," or "our") operates the Xalora platform including the website and mobile applications. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform.
        </p>
        <p>
          <strong>Please read this Privacy Policy carefully.</strong> If you do not agree with our policies and practices, please do not use our Platform.
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <SubSection title="2.1 Information You Provide Directly">
          <p className="font-semibold text-gray-800">Account Registration:</p>
          <ul className="space-y-1 mb-4">
            <ListItem>Full name, Email address, Password (encrypted)</ListItem>
            <ListItem>Phone number (optional), Date of birth, Gender (optional)</ListItem>
            <ListItem>Profile picture, Education level, Years of experience</ListItem>
            <ListItem>Skills and interests, Resume/CV (PDF files)</ListItem>
          </ul>

          <p className="font-semibold text-gray-800 mt-4">Interview & Practice Data:</p>
          <ul className="space-y-1 mb-4">
            <ListItem>Code submissions and solutions</ListItem>
            <ListItem>Problem-solving attempts, Interview session recordings</ListItem>
            <ListItem>Quiz responses and scores</ListItem>
            <ListItem>Performance metrics and progress</ListItem>
          </ul>

          <p className="font-semibold text-gray-800 mt-4">Payment Information:</p>
          <ul className="space-y-1">
            <ListItem>Billing name and address</ListItem>
            <ListItem>Subscription tier selected, Purchase history</ListItem>
            <ListItem>(Note: Credit card details are NOT stored - handled by Razorpay)</ListItem>
          </ul>
        </SubSection>

        <SubSection title="2.2 Information Collected Automatically">
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-gray-800">Device & Technical Information:</p>
              <p className="text-gray-700">IP address, Device type, Operating system, Browser type, Device identifiers, Mobile network information</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Usage Information:</p>
              <p className="text-gray-700">Pages visited, Features used, Search queries, Problems attempted, Code editor activity, Download activity</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Cookies & Tracking:</p>
              <p className="text-gray-700">Session cookies, Persistent cookies, Web beacons, Analytics cookies, Third-party cookies</p>
            </div>
          </div>
        </SubSection>

        <SubSection title="2.3 Information from Third Parties">
          <ul className="space-y-1">
            <ListItem><strong>Google OAuth:</strong> Email, Full name, Profile picture, Public profile information</ListItem>
            <ListItem><strong>Razorpay (Payment):</strong> Payment status, Transaction ID, Card type (last 4 digits only)</ListItem>
            <ListItem><strong>Email Service (Resend):</strong> Email delivery status, Email open rates</ListItem>
          </ul>
        </SubSection>
      </Section>

      <Section title="3. How We Use Your Information">
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-gray-800">Platform Functionality</p>
            <p className="text-gray-700">Create and maintain your account, Authenticate your identity, Provide access to problems and interviews, Store and sync your progress</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Personalization</p>
            <p className="text-gray-700">Recommend problems based on skill level, Customize your dashboard, Display relevant content</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Communication</p>
            <p className="text-gray-700">Send transactional emails, Respond to support requests, Send notifications about results</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Analytics & Improvement</p>
            <p className="text-gray-700">Analyze platform usage patterns, Identify popular features, Debug technical issues, Improve user experience</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Safety & Security</p>
            <p className="text-gray-700">Prevent fraud and errors, Enforce our Terms of Service, Protect against malicious activity, Comply with legal obligations</p>
          </div>
        </div>
      </Section>

      <Section title="4. Who We Share Your Information With">
        <SubSection title="4.1 Service Providers (Data Processors)">
          <ul className="space-y-1">
            <ListItem><strong>Cloud Services:</strong> MongoDB Atlas (Database), Upstash/Redis (Caching)</ListItem>
            <ListItem><strong>Communication:</strong> Resend (Email delivery)</ListItem>
            <ListItem><strong>Payments:</strong> Razorpay (Payment processing)</ListItem>
            <ListItem><strong>AI Services:</strong> Google Cloud (Gemini, Vertex AI), Groq</ListItem>
            <ListItem><strong>CDN & Security:</strong> Cloudflare (DDoS protection)</ListItem>
            <ListItem><strong>Monitoring:</strong> New Relic/DataDog (Performance monitoring)</ListItem>
          </ul>
        </SubSection>

        <SubSection title="4.2 Analytics & Marketing">
          <ul className="space-y-1">
            <ListItem>Google Analytics (Platform analytics)</ListItem>
            <ListItem>Mixpanel (User behavior tracking)</ListItem>
            <ListItem>Google Ads (Conversion tracking)</ListItem>
            <ListItem>Facebook Pixel (Audience building)</ListItem>
          </ul>
        </SubSection>

        <SubSection title="4.3 Organizations (B2B)">
          <p className="text-gray-700">
            If you use the Platform through an organization (school, company):
          </p>
          <ul className="space-y-1">
            <ListItem>Organization admins can see your participation and scores</ListItem>
            <ListItem>Organization may receive aggregated performance reports</ListItem>
            <ListItem>Some profile information may be visible to other organization members</ListItem>
          </ul>
        </SubSection>

        <SubSection title="4.4 Legal Requirements">
          <p className="text-gray-700">
            We may disclose your information if required by law enforcement, government agencies, or to enforce our Terms of Service.
          </p>
        </SubSection>
      </Section>

      <Section title="5. Data Retention">
        <Table
          headers={['Data Type', 'Retention Period', 'Reason']}
          rows={[
            ['Account & Profile', 'Until account deletion', 'Service provision'],
            ['Code Submissions', '3 years', 'Portfolio, statistics'],
            ['Interview Recordings', '1 year', 'Review and feedback'],
            ['Payment Records', '7 years', 'Tax and legal compliance'],
            ['Support Tickets', '2 years', 'Issue resolution tracking'],
            ['Cookies', '1-24 months', 'See Cookie Policy'],
            ['Log Files', '90 days', 'Security and debugging'],
            ['Analytics Data', '26 months', 'Platform improvement'],
          ]}
        />
        <p className="text-sm text-gray-600 mt-4">
          <strong>Note:</strong> You can request deletion of your account anytime. Deleted accounts cannot be recovered.
        </p>
      </Section>

      <Section title="6. Data Security">
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-gray-800">Security Measures:</p>
            <ul className="space-y-1">
              <ListItem>Encryption in Transit: All data via HTTPS/TLS 1.2+</ListItem>
              <ListItem>Encryption at Rest: Sensitive data encrypted in database</ListItem>
              <ListItem>Password Security: Bcrypt hashing with salt</ListItem>
              <ListItem>Access Control: Role-based access control (RBAC)</ListItem>
              <ListItem>API Security: Rate limiting, CORS protection, input validation</ListItem>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="7. Your Rights & Choices">
        <SubSection title="7.1 Data Access & Deletion">
          <p className="text-gray-700">
            <strong>Right to Access:</strong> Get all data we hold about you<br/>
            <strong>Right to Delete:</strong> Request deletion of your account and data<br/>
            <strong>Right to Correct:</strong> Update inaccurate information<br/>
            <strong>Submitted within:</strong> 30 days of request
          </p>
        </SubSection>

        <SubSection title="7.2 Opt-Out Options">
          <ul className="space-y-1">
            <ListItem>Unsubscribe from marketing emails (link in every email)</ListItem>
            <ListItem>Disable cookies (browser settings)</ListItem>
            <ListItem>Disable analytics (Google Analytics opt-out)</ListItem>
            <ListItem>Disable location sharing (device settings)</ListItem>
          </ul>
        </SubSection>

        <SubSection title="7.3 Marketing Communications">
          <ul className="space-y-1">
            <ListItem>Opt-out of all marketing emails</ListItem>
            <ListItem>Opt-out of push notifications</ListItem>
            <ListItem>Opt-out of SMS (if applicable)</ListItem>
          </ul>
        </SubSection>
      </Section>

      <Section title="8. GDPR & CCPA Rights">
        <SubSection title="8.1 GDPR Rights (EU Users)">
          <p className="text-gray-700">You have the right to:</p>
          <ul className="space-y-1">
            <ListItem><strong>Access:</strong> Obtain copy of your personal data</ListItem>
            <ListItem><strong>Rectification:</strong> Correct inaccurate data</ListItem>
            <ListItem><strong>Erasure:</strong> Request deletion ("right to be forgotten")</ListItem>
            <ListItem><strong>Restrict:</strong> Limit how we process your data</ListItem>
            <ListItem><strong>Portability:</strong> Get data in portable format</ListItem>
            <ListItem><strong>Object:</strong> Object to certain processing</ListItem>
            <ListItem><strong>Withdraw Consent:</strong> Withdraw marketing consent anytime</ListItem>
          </ul>
          <p className="text-sm text-gray-600 mt-3">Email: <a href="mailto:privacy@xalora.com" className="text-indigo-600">privacy@xalora.com</a></p>
        </SubSection>

        <SubSection title="8.2 CCPA Rights (California Residents)">
          <p className="text-gray-700">You have the right to:</p>
          <ul className="space-y-1">
            <ListItem><strong>Know:</strong> What personal information is collected</ListItem>
            <ListItem><strong>Delete:</strong> Delete your personal information</ListItem>
            <ListItem><strong>Opt-Out:</strong> Opt-out of selling personal information</ListItem>
            <ListItem><strong>Correct:</strong> Correct inaccurate information</ListItem>
          </ul>
          <p className="text-sm text-gray-600 mt-3">
            <strong>Important:</strong> We do NOT sell personal information to third parties. Email: <a href="mailto:privacy@xalora.com" className="text-indigo-600">privacy@xalora.com</a>
          </p>
        </SubSection>
      </Section>

      <Section title="9. Contact Us">
        <div className="bg-gray-100 p-6 rounded-lg space-y-3">
          <div>
            <p className="font-semibold text-gray-900">Privacy Inquiries</p>
            <p className="text-gray-700">Email: <a href="mailto:privacy@xalora.com" className="text-indigo-600 hover:underline">privacy@xalora.com</a></p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">General Support</p>
            <p className="text-gray-700">Email: <a href="mailto:support@xalora.com" className="text-indigo-600 hover:underline">support@xalora.com</a></p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Response Time</p>
            <p className="text-gray-700">Within 30 days of request</p>
          </div>
        </div>
      </Section>

      <Section title="10. Policy Updates">
        <p>
          We may update this Privacy Policy anytime. Material changes will be notified via email. Your continued use of the Platform = acceptance of updated policy.
        </p>
        <p className="text-sm text-gray-600">
          <strong>Document Version:</strong> 1.0<br/>
          <strong>Last Updated:</strong> January 2025<br/>
          <strong>Next Review:</strong> January 2026
        </p>
      </Section>
    </LegalLayout>
  );
};

export default PrivacyPolicy;
