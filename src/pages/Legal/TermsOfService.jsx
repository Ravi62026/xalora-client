import React from 'react';
import { LegalLayout, Section, SubSection, ListItem, Table } from './LegalLayout';

export const TermsOfService = () => {
  return (
    <LegalLayout
      title="Terms of Service"
      description="Our service terms and conditions for using Xalora"
    >
      <Section title="1. Acceptance of Terms">
        <p>
          By accessing and using the Xalora platform, website, and mobile applications (collectively, the "Platform"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Platform.
        </p>
        <p>
          <strong>Age Requirement:</strong> You must be at least 13 years old (COPPA) or, if higher in your jurisdiction, the age of majority.
        </p>
      </Section>

      <Section title="2. Service Description">
        <p>Xalora provides:</p>
        <ul className="space-y-1">
          <ListItem><strong>Coding Practice Platform:</strong> DSA problems with code execution</ListItem>
          <ListItem><strong>Online Judge:</strong> Code submission, compilation, and testing</ListItem>
          <ListItem><strong>Interview Simulator:</strong> AI-powered mock interviews with video/audio</ListItem>
          <ListItem><strong>Quizzes:</strong> Technology assessments and knowledge tests</ListItem>
          <ListItem><strong>Internship Portal:</strong> Job postings and application tracking</ListItem>
          <ListItem><strong>Resume AI:</strong> Skill extraction and resume improvement</ListItem>
          <ListItem><strong>Leaderboards & Achievements:</strong> Gamification and performance tracking</ListItem>
        </ul>
      </Section>

      <Section title="3. User Accounts">
        <SubSection title="3.1 Account Registration">
          <ul className="space-y-1">
            <ListItem>You agree to provide accurate, complete, and truthful information</ListItem>
            <ListItem>You are responsible for maintaining confidentiality of your password</ListItem>
            <ListItem>You agree not to share your login credentials with others</ListItem>
            <ListItem>You are responsible for all activities under your account</ListItem>
          </ul>
        </SubSection>

        <SubSection title="3.2 Account Suspension & Termination">
          <p className="text-gray-700 mb-2">
            We may suspend or terminate your account if you:
          </p>
          <ul className="space-y-1">
            <ListItem>Violate any terms in this agreement</ListItem>
            <ListItem>Engage in fraudulent or illegal activity</ListItem>
            <ListItem>Abuse other users or the platform</ListItem>
            <ListItem>Fail to pay subscription fees (30 days notice)</ListItem>
          </ul>
        </SubSection>

        <SubSection title="3.3 Account Termination Effect">
          <ul className="space-y-1">
            <ListItem>Loss of access to the Platform</ListItem>
            <ListItem>Deletion of account data after 30-day grace period</ListItem>
            <ListItem>Loss of purchased credits or premium access</ListItem>
            <ListItem>Forfeiture of achievements and rankings</ListItem>
          </ul>
        </SubSection>
      </Section>

      <Section title="4. Intellectual Property Rights">
        <SubSection title="4.1 Platform Content">
          <p className="text-gray-700">
            Xalora retains all rights to platform source code, UI/UX design, logos, branding, problem statements, quiz content, and video tutorials.
          </p>
          <p className="text-gray-700 mt-2">
            <strong>License Granted:</strong> Limited, non-exclusive, non-transferable license to access and use the Platform for personal, non-commercial purposes.
          </p>
        </SubSection>

        <SubSection title="4.2 Your Submissions">
          <ul className="space-y-1">
            <ListItem><strong>Code Ownership:</strong> You retain ownership of code you submit</ListItem>
            <ListItem><strong>Right to Display:</strong> We may display your code anonymously in leaderboards</ListItem>
            <ListItem><strong>Right to Analyze:</strong> We may analyze your code for plagiarism detection</ListItem>
            <ListItem><strong>Portfolio Use:</strong> You may use your solutions in your portfolio</ListItem>
            <ListItem><strong>AI Training:</strong> We may use anonymized submissions to train AI models (opt-out available)</ListItem>
          </ul>
        </SubSection>

        <SubSection title="4.3 User-Generated Content">
          <p className="text-gray-700">
            If you contribute problems, solutions, or content to Xalora:
          </p>
          <ul className="space-y-1">
            <ListItem>You grant Xalora a non-exclusive, royalty-free license to use it</ListItem>
            <ListItem>You represent it doesn't infringe third-party rights</ListItem>
            <ListItem>You allow modification and redistribution</ListItem>
          </ul>
        </SubSection>
      </Section>

      <Section title="5. Acceptable Use Policy">
        <SubSection title="5.1 Prohibited Activities">
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-gray-800">Illegal Activities:</p>
              <p className="text-gray-700">Do not use the Platform for illegal purposes, violate laws, engage in fraud, create fake accounts, or distribute malware.</p>
            </div>

            <div>
              <p className="font-semibold text-gray-800">Abuse & Harassment:</p>
              <p className="text-gray-700">Do not harass, threaten, or intimidate other users. No hate speech, racism, or discrimination.</p>
            </div>

            <div>
              <p className="font-semibold text-gray-800">Intellectual Property Violations:</p>
              <p className="text-gray-700">Do not upload copyrighted content, plagiarize, or violate open-source licenses.</p>
            </div>

            <div>
              <p className="font-semibold text-gray-800">Platform Exploitation:</p>
              <p className="text-gray-700">Do not hack, exploit, reverse-engineer, or perform DoS attacks.</p>
            </div>

            <div>
              <p className="font-semibold text-gray-800">Cheating & Academic Integrity:</p>
              <p className="text-gray-700">Do not cheat during quizzes, copy solutions without attribution, or use unauthorized tools during assessments.</p>
            </div>

            <div>
              <p className="font-semibold text-gray-800">Commercial Misuse:</p>
              <p className="text-gray-700">Do not use the Platform for commercial purposes without authorization or create competing platforms using our content.</p>
            </div>
          </div>
        </SubSection>
      </Section>

      <Section title="6. Interview Conduct Guidelines">
        <SubSection title="6.1 Interview Etiquette">
          <ul className="space-y-1">
            <ListItem>Be on time for scheduled interviews</ListItem>
            <ListItem>Use appropriate language and conduct</ListItem>
            <ListItem>Maintain professional appearance</ListItem>
            <ListItem>Treat interviewers and candidates respectfully</ListItem>
            <ListItem>No harassment or discrimination</ListItem>
          </ul>
        </SubSection>

        <SubSection title="6.2 Recording & Privacy">
          <ul className="space-y-1">
            <ListItem>All interviews are recorded for quality assurance</ListItem>
            <ListItem>Recording used only for feedback and coaching</ListItem>
            <ListItem>You can request deletion of recording (retained 1 year)</ListItem>
            <ListItem>Recordings not shared publicly except with your consent</ListItem>
          </ul>
        </SubSection>
      </Section>

      <Section title="7. Code Compiler & Execution">
        <SubSection title="7.1 Code Submission Terms">
          <ul className="space-y-1">
            <ListItem>You submit code at your own risk</ListItem>
            <ListItem>Code executed in sandboxed environment</ListItem>
            <ListItem><strong>Time limit:</strong> 10 seconds per submission</ListItem>
            <ListItem><strong>Memory limit:</strong> 512 MB per execution</ListItem>
            <ListItem><strong>Output limit:</strong> 10 MB</ListItem>
            <ListItem><strong>Rate limit:</strong> 1 submission per 5 seconds</ListItem>
          </ul>
        </SubSection>

        <SubSection title="7.2 Execution Results">
          <p className="text-gray-700">
            <strong>Accepted</strong> = All test cases passed<br/>
            <strong>Wrong Answer</strong> = Output doesn't match<br/>
            <strong>Time Limit Exceeded</strong> = Execution took too long<br/>
            <strong>Memory Limit Exceeded</strong> = Used too much memory<br/>
            <strong>Runtime Error</strong> = Crash or exception<br/>
            <strong>Compilation Error</strong> = Syntax error
          </p>
        </SubSection>
      </Section>

      <Section title="8. Subscription & Billing">
        <SubSection title="8.1 Pricing & Payment">
          <ul className="space-y-1">
            <ListItem>Prices displayed in USD (or local currency)</ListItem>
            <ListItem>Prices subject to change with 30 days notice</ListItem>
            <ListItem>Payment processed monthly/annually based on plan</ListItem>
            <ListItem>Taxes/VAT added where applicable</ListItem>
            <ListItem>All prices non-refundable except per Refund Policy</ListItem>
          </ul>
        </SubSection>

        <SubSection title="8.2 Refund Policy">
          <ul className="space-y-1">
            <ListItem><strong>30-Day Money Back:</strong> Full refund if you cancel within 30 days</ListItem>
            <ListItem><strong>Pro-Rata Refund:</strong> Unused portion refunded if you cancel mid-cycle</ListItem>
            <ListItem><strong>No Refund For:</strong> Violations of Terms, free tier usage, disputes</ListItem>
            <ListItem><strong>Request:</strong> Email billing@xalora.com</ListItem>
            <ListItem><strong>Processing:</strong> 5-7 business days</ListItem>
          </ul>
        </SubSection>

        <SubSection title="8.3 Cancellation">
          <ul className="space-y-1">
            <ListItem>Cancel anytime in account settings</ListItem>
            <ListItem>Cancellation effective at end of billing cycle</ListItem>
            <ListItem>No charges after cancellation</ListItem>
            <ListItem>You retain access until cycle ends</ListItem>
          </ul>
        </SubSection>
      </Section>

      <Section title="9. Service Availability & Limitations">
        <SubSection title="9.1 As-Is Service">
          <p className="text-gray-700">
            The Platform is provided "AS-IS" and "AS-AVAILABLE":
          </p>
          <ul className="space-y-1">
            <ListItem>We don't guarantee uninterrupted service</ListItem>
            <ListItem>We don't guarantee error-free operation</ListItem>
            <ListItem>Features may be added, modified, or removed</ListItem>
            <ListItem>No warranties, express or implied</ListItem>
          </ul>
        </SubSection>

        <SubSection title="9.2 Maintenance & Downtime">
          <ul className="space-y-1">
            <ListItem><strong>Scheduled:</strong> Sunday 2-4 AM UTC</ListItem>
            <ListItem><strong>Target Uptime:</strong> 99.9% SLA</ListItem>
            <ListItem><strong>Notice:</strong> We notify users of scheduled downtime</ListItem>
            <ListItem><strong>Emergency:</strong> May occur without notice</ListItem>
          </ul>
        </SubSection>

        <SubSection title="9.3 Liability Limitations">
          <p className="text-gray-700 mb-2">
            <strong>We are NOT liable for:</strong>
          </p>
          <ul className="space-y-1">
            <ListItem>Indirect, incidental, or consequential damages</ListItem>
            <ListItem>Loss of data, revenue, or profits</ListItem>
            <ListItem>Loss of opportunities or third-party claims</ListItem>
          </ul>
          <p className="text-gray-700 mt-3">
            <strong>Maximum Liability:</strong> Limited to amount paid in past 12 months or $100 USD, whichever is greater.
          </p>
        </SubSection>
      </Section>

      <Section title="10. Dispute Resolution">
        <SubSection title="10.1 Informal Resolution">
          <ul className="space-y-1">
            <ListItem>Contact: support@xalora.com</ListItem>
            <ListItem>Response: Within 5 business days</ListItem>
            <ListItem>Resolution: Within 30 days</ListItem>
          </ul>
        </SubSection>

        <SubSection title="10.2 Arbitration (US Users)">
          <p className="text-gray-700">
            If not resolved, disputes will be resolved by binding arbitration under JAMS rules, held in English language, each party pays own costs.
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Exception:</strong> You may sue in small claims court for personal disputes under $5,000.
          </p>
        </SubSection>

        <SubSection title="10.3 GDPR Users (EU)">
          <p className="text-gray-700">
            GDPR users may pursue claims in EU courts. Arbitration clause does not apply to GDPR-protected rights.
          </p>
        </SubSection>
      </Section>

      <Section title="11. General Provisions">
        <SubSection title="11.1 Entire Agreement">
          <p className="text-gray-700">
            These Terms, Privacy Policy, and Cookie Policy constitute the entire agreement regarding the Platform.
          </p>
        </SubSection>

        <SubSection title="11.2 Amendments">
          <ul className="space-y-1">
            <ListItem>We may modify these Terms anytime</ListItem>
            <ListItem>Material changes require 30 days notice</ListItem>
            <ListItem>Continued use = acceptance of new Terms</ListItem>
          </ul>
        </SubSection>

        <SubSection title="11.3 Governing Law">
          <ul className="space-y-1">
            <ListItem><strong>General Users:</strong> Laws of [YOUR_COUNTRY/STATE]</ListItem>
            <ListItem><strong>GDPR Users (EU):</strong> GDPR Regulations apply</ListItem>
            <ListItem><strong>CCPA Users (CA):</strong> California law applies</ListItem>
          </ul>
        </SubSection>
      </Section>

      <Section title="12. Contact & Support">
        <div className="bg-gray-100 p-6 rounded-lg space-y-3">
          <div>
            <p className="font-semibold text-gray-900">General Support</p>
            <p className="text-gray-700">Email: <a href="mailto:support@xalora.com" className="text-indigo-600 hover:underline">support@xalora.com</a></p>
            <p className="text-gray-700">Response: Within 24 hours</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Legal Inquiries</p>
            <p className="text-gray-700">Email: <a href="mailto:legal@xalora.com" className="text-indigo-600 hover:underline">legal@xalora.com</a></p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Billing</p>
            <p className="text-gray-700">Email: <a href="mailto:billing@xalora.com" className="text-indigo-600 hover:underline">billing@xalora.com</a></p>
          </div>
        </div>
      </Section>

      <Section title="13. Acknowledgment">
        <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
          <p className="text-gray-900">
            <strong>BY USING THE PLATFORM, YOU ACKNOWLEDGE THAT:</strong><br/>
            ✓ You have read and understood these Terms<br/>
            ✓ You agree to be bound by these Terms<br/>
            ✓ You understand the limitations of liability<br/>
            ✓ You have 30 days to cancel subscription (full refund)
          </p>
        </div>
      </Section>

      <div className="mt-8 text-sm text-gray-500 text-center">
        <p><strong>Document Version:</strong> 1.0</p>
        <p><strong>Last Updated:</strong> January 2025</p>
        <p><strong>Next Review:</strong> January 2026</p>
      </div>
    </LegalLayout>
  );
};

export default TermsOfService;
