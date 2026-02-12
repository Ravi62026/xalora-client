import React from 'react';
import { LegalLayout, Section, SubSection, ListItem } from './LegalLayout';

export const AcceptableUsePolicy = () => {
  return (
    <LegalLayout
      title="Acceptable Use Policy"
      description="Guidelines for acceptable use of the Xalora platform"
    >
      <Section title="1. Purpose & Scope">
        <p>
          This Acceptable Use Policy establishes guidelines for all users of the Xalora platform. This Policy applies to all content, conduct, and activities on or related to the Platform.
        </p>
      </Section>

      <Section title="2. Prohibited Activities">
        <SubSection title="2.1 Illegal & Harmful Activities">
          <p className="text-gray-700 font-semibold mb-2">You may NOT:</p>
          <ul className="space-y-1">
            <ListItem>Use the Platform for illegal purposes or facilitate illegal activity</ListItem>
            <ListItem>Violate any local, state, national, or international law</ListItem>
            <ListItem>Engage in fraud, scams, or deceptive practices</ListItem>
            <ListItem>Create threats of violence or harm</ListItem>
            <ListItem>Harass, stalk, or incite violence against individuals</ListItem>
            <ListItem>Distribute or sell illegal substances</ListItem>
            <ListItem>Hack, breach, or compromise computer systems</ListItem>
            <ListItem>Engage in money laundering or financial crimes</ListItem>
          </ul>
          <p className="text-gray-700 mt-4 text-sm">
            <strong>Reporting:</strong> Contact law enforcement and abuse@xalora.com
          </p>
        </SubSection>

        <SubSection title="2.2 Abuse & Harassment">
          <p className="text-gray-700 font-semibold mb-2">You may NOT:</p>
          <ul className="space-y-1">
            <ListItem>Use slurs, insults, or abusive language targeting individuals or groups</ListItem>
            <ListItem>Engage in harassment, bullying, or cyberbullying</ListItem>
            <ListItem>Make threats of violence, harm, or property damage</ListItem>
            <ListItem>Dox (publicly share private information) other users</ListItem>
            <ListItem>Engage in sexual harassment or unwanted sexual advances</ListItem>
            <ListItem>Impersonate or pretend to be someone else</ListItem>
            <ListItem>Stalk or follow users without consent</ListItem>
            <ListItem>Engage in discrimination based on protected characteristics</ListItem>
          </ul>
          <p className="text-gray-700 mt-4 text-sm">
            <strong>Consequence:</strong> Account suspension or permanent ban
          </p>
        </SubSection>

        <SubSection title="2.3 Intellectual Property Violations">
          <p className="text-gray-700 font-semibold mb-2">You may NOT:</p>
          <ul className="space-y-1">
            <ListItem>Upload or reproduce copyrighted content without permission</ListItem>
            <ListItem>Submit code or problems that violate third-party copyrights</ListItem>
            <ListItem>Use code from others without proper attribution</ListItem>
            <ListItem>Violate open-source license terms (GPL, MIT, Apache, etc.)</ListItem>
            <ListItem>Infringe on patents or trademarks</ListItem>
            <ListItem>Plagiarize or submit work as your own</ListItem>
            <ListItem>Attempt to bypass copyright protection mechanisms</ListItem>
          </ul>
          <p className="text-gray-700 mt-4 text-sm">
            <strong>Attribution Requirement:</strong> Always attribute code and ideas to original sources<br/>
            <strong>Reporting:</strong> Contact copyright@xalora.com with details and evidence
          </p>
        </SubSection>

        <SubSection title="2.4 Platform Exploitation & Hacking">
          <p className="text-gray-700 font-semibold mb-2">You may NOT:</p>
          <ul className="space-y-1">
            <ListItem>Attempt to hack, breach, or penetrate the Platform</ListItem>
            <ListItem>Probe for vulnerabilities or security weaknesses</ListItem>
            <ListItem>Perform denial-of-service (DoS) or DDoS attacks</ListItem>
            <ListItem>Create or distribute malware, viruses, or trojans</ListItem>
            <ListItem>Brute-force login credentials or recovery methods</ListItem>
            <ListItem>Bypass authentication or authorization controls</ListItem>
            <ListItem>Reverse-engineer, decompile, or disassemble Platform code</ListItem>
            <ListItem>Attempt to extract API keys, tokens, or credentials</ListItem>
            <ListItem>Create automated bots or scrapers without permission</ListItem>
          </ul>
          <p className="text-gray-700 mt-4 text-sm">
            <strong>Security Researcher Exception:</strong> If you discover a vulnerability:
          </p>
          <ul className="space-y-1 ml-4 text-sm">
            <ListItem>Report directly to security@xalora.com</ListItem>
            <ListItem>Don't publicly disclose before we patch (90 days max)</ListItem>
            <ListItem>We may offer bug bounty rewards</ListItem>
            <ListItem>You'll receive credit in security advisory</ListItem>
          </ul>
        </SubSection>

        <SubSection title="2.5 Cheating & Academic Integrity">
          <p className="text-gray-700 font-semibold mb-2">You may NOT:</p>
          <ul className="space-y-1">
            <ListItem>Cheat during timed quizzes or interviews</ListItem>
            <ListItem>Use unauthorized resources during assessments</ListItem>
            <ListItem>Share quiz questions and answers with others</ListItem>
            <ListItem>Have someone else take a quiz or interview for you</ListItem>
            <ListItem>Allow others to use your account during assessments</ListItem>
            <ListItem>Copy-paste solutions from other users without attribution</ListItem>
            <ListItem>Use third-party solvers (LLMs, AI, external tools) without disclosure</ListItem>
            <ListItem>Manipulate timestamps or submission data</ListItem>
          </ul>
          <p className="text-gray-700 mt-4 text-sm">
            <strong>Consequence:</strong> Score invalidation, account suspension, ban from competitions<br/>
            <strong>Academic Institutions:</strong> Students must follow their institution's academic integrity policies
          </p>
        </SubSection>

        <SubSection title="2.6 Commercial Misuse">
          <p className="text-gray-700 font-semibold mb-2">You may NOT:</p>
          <ul className="space-y-1">
            <ListItem>Use the Platform for commercial purposes without authorization</ListItem>
            <ListItem>Sell or distribute solutions from the Platform</ListItem>
            <ListItem>Resell Platform access or credentials</ListItem>
            <ListItem>Create competing platforms using our content</ListItem>
            <ListItem>Scrape or bulk-download problems and solutions</ListItem>
            <ListItem>Use Platform for client projects without explicit permission</ListItem>
            <ListItem>Advertise or promote competing products without consent</ListItem>
          </ul>
        </SubSection>
      </Section>

      <Section title="3. Interview Conduct Standards">
        <SubSection title="3.1 Interview Behavior">
          <p className="text-gray-700 font-semibold mb-2">In interviews, you must:</p>
          <ul className="space-y-1">
            <ListItem>Treat interviewers and candidates with respect</ListItem>
            <ListItem>Follow professional conduct standards</ListItem>
            <ListItem>Speak clearly and maintain eye contact (if video enabled)</ListItem>
            <ListItem>Dress appropriately</ListItem>
            <ListItem>Choose a quiet, professional environment</ListItem>
            <ListItem>Ensure proper lighting and camera angle</ListItem>
            <ListItem>Have stable internet connection</ListItem>
            <ListItem>Be on time (log in 5 minutes early)</ListItem>
          </ul>
        </SubSection>

        <SubSection title="3.2 Recording & Privacy">
          <ul className="space-y-1">
            <ListItem>All interviews are recorded for feedback and quality assurance</ListItem>
            <ListItem>Recording used only for coaching and improvement</ListItem>
            <ListItem>You can request deletion of recording (retained 1 year)</ListItem>
            <ListItem>Recordings not shared publicly except with your consent</ListItem>
          </ul>
        </SubSection>
      </Section>

      <Section title="4. Code Submission Guidelines">
        <SubSection title="4.1 Allowed Code">
          <p className="text-gray-700">You may submit:</p>
          <ul className="space-y-1">
            <ListItem>Original code you wrote</ListItem>
            <ListItem>Code inspired by public tutorials (with attribution)</ListItem>
            <ListItem>Code from open-source libraries (within license terms)</ListItem>
            <ListItem>Code from textbooks (with citation)</ListItem>
            <ListItem>Code from your own previous projects</ListItem>
          </ul>
        </SubSection>

        <SubSection title="4.2 Fair Use Attribution">
          <p className="text-gray-700 text-sm">
            If using code from external sources, include comment:<br/>
            <code className="bg-gray-100 px-2 py-1 rounded">// Based on: [source name/URL]</code><br/>
            <br/>
            <strong>AI Usage Disclosure:</strong><br/>
            <code className="bg-gray-100 px-2 py-1 rounded">{"# AI assisted: Generated with [AI tool]"}</code>
          </p>
        </SubSection>
      </Section>

      <Section title="5. Reporting Violations">
        <SubSection title="5.1 Report Abuse">
          <p className="text-gray-700 font-semibold mb-2">To report violations:</p>
          <ul className="space-y-1">
            <ListItem><strong>Via Platform:</strong> Click "Report" button on content</ListItem>
            <ListItem><strong>Via Email:</strong> abuse@xalora.com</ListItem>
            <ListItem><strong>Include:</strong> URL or screenshot, clear description, incident date/time</ListItem>
          </ul>
        </SubSection>

        <SubSection title="5.2 What We Investigate">
          <ul className="space-y-1">
            <ListItem>Plagiarism and cheating</ListItem>
            <ListItem>Harassment and abuse</ListItem>
            <ListItem>Illegal content</ListItem>
            <ListItem>Copyright violations</ListItem>
            <ListItem>Hacking/security breaches</ListItem>
            <ListItem>Fraud and deception</ListItem>
            <ListItem>Content violations</ListItem>
          </ul>
        </SubSection>

        <SubSection title="5.3 Investigation Process">
          <ol className="space-y-1">
            <li className="text-gray-700"><strong>1. Report Received:</strong> You get confirmation email</li>
            <li className="text-gray-700"><strong>2. Initial Review:</strong> 1-2 days to assess validity</li>
            <li className="text-gray-700"><strong>3. Investigation:</strong> 3-7 days to gather evidence</li>
            <li className="text-gray-700"><strong>4. Decision:</strong> 7 days to determine violation</li>
            <li className="text-gray-700"><strong>5. Action:</strong> Implement consequence</li>
            <li className="text-gray-700"><strong>6. Appeal:</strong> 30 days to appeal</li>
          </ol>
        </SubSection>
      </Section>

      <Section title="6. Consequences & Enforcement">
        <SubSection title="6.1 Violation Severity">
          <div className="space-y-3">
            <div className="border-l-4 border-yellow-500 pl-4">
              <p className="font-semibold text-gray-900">Minor Violations</p>
              <p className="text-sm text-gray-700">Spam, mild harassment, poor code comments</p>
              <p className="text-sm text-gray-700"><strong>Consequence:</strong> Warning + 1-day suspension</p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <p className="font-semibold text-gray-900">Moderate Violations</p>
              <p className="text-sm text-gray-700">Cheating, harassment, plagiarism</p>
              <p className="text-sm text-gray-700"><strong>Consequence:</strong> 7-30 day suspension + retest</p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <p className="font-semibold text-gray-900">Severe Violations</p>
              <p className="text-sm text-gray-700">Hacking, sexual harassment, hate speech, fraud</p>
              <p className="text-sm text-gray-700"><strong>Consequence:</strong> Permanent ban</p>
            </div>
          </div>
        </SubSection>

        <SubSection title="6.2 Two-Strike Policy">
          <ul className="space-y-1 text-sm text-gray-700">
            <ListItem><strong>1st violation:</strong> Warning + explanation</ListItem>
            <ListItem><strong>2nd violation:</strong> Temporary suspension (7-30 days)</ListItem>
            <ListItem><strong>3rd violation:</strong> Permanent ban</ListItem>
          </ul>
          <p className="text-sm text-gray-700 mt-3">
            <strong>Exceptions:</strong> Severe violations (CSAM, hacking, fraud) lead to immediate bans
          </p>
        </SubSection>

        <SubSection title="6.3 Appeals Process">
          <ol className="space-y-1 text-sm text-gray-700">
            <li><strong>1. Submit Appeal:</strong> Email support@xalora.com within 30 days</li>
            <li><strong>2. Include:</strong> Account email, case #, explanation, evidence</li>
            <li><strong>3. Review:</strong> Appeals team reviews in 5-10 days</li>
            <li><strong>4. Decision:</strong> Email with outcome (Upheld/Modified/Reversed)</li>
            <li><strong>5. Final:</strong> Appeals decision usually final</li>
          </ol>
        </SubSection>
      </Section>

      <Section title="7. Contact & Support">
        <div className="bg-gray-100 p-6 rounded-lg space-y-3">
          <div>
            <p className="font-semibold text-gray-900">Abuse Reports</p>
            <p className="text-gray-700">Email: <a href="mailto:abuse@xalora.com" className="text-indigo-600 hover:underline">abuse@xalora.com</a></p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Copyright Claims</p>
            <p className="text-gray-700">Email: <a href="mailto:copyright@xalora.com" className="text-indigo-600 hover:underline">copyright@xalora.com</a></p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Security Issues</p>
            <p className="text-gray-700">Email: <a href="mailto:security@xalora.com" className="text-indigo-600 hover:underline">security@xalora.com</a></p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Appeals</p>
            <p className="text-gray-700">Email: <a href="mailto:support@xalora.com" className="text-indigo-600 hover:underline">support@xalora.com</a> (mark as "APPEAL")</p>
          </div>
        </div>
      </Section>

      <Section title="8. Summary">
        <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
          <p className="font-semibold text-gray-900 mb-3">What NOT to do:</p>
          <div className="space-y-1 text-sm text-gray-700">
            <p>❌ Don't hack or probe the Platform</p>
            <p>❌ Don't cheat on quizzes or interviews</p>
            <p>❌ Don't copy others' code without attribution</p>
            <p>❌ Don't harass or abuse other users</p>
            <p>❌ Don't attempt fraud or deception</p>
            <p>❌ Don't upload malware or viruses</p>
            <p>❌ Don't violate copyright or intellectual property</p>
            <p>❌ Don't spam or advertise</p>
          </div>
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

export default AcceptableUsePolicy;
