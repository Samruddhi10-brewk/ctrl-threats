interface MetadataConfig {
    [key: string]: {
      title: string;
      description: string;
      keywords: string;
    };
  }
  
  export const metadata: MetadataConfig = {
    '/': {
      title: 'Ctrl Threats | Cybersecurity & Threat Detection',
      description: "Protect your business with Ctrl Threats' cybersecurity solutions, including web vulnerability scanning and email threat detection.",
      keywords: 'cybersecurity solutions, threat detection, cyber threats, network security, risk management, malware protection, penetration testing'
    },
    '/about': {
      title: 'About Ctrl Threats | Cybersecurity Experts',
      description: "Learn about Ctrl Threats' mission and expertise in cybersecurity, providing cutting-edge digital security solutions.",
      keywords: 'about Ctrl Threats, cybersecurity experts, IT security, cyber risk management, digital security solutions, company mission, security consulting'
    },
    '/webscan': {
      title: 'WebScan | Web Vulnerability Assessment Tool',
      description: "Scan and secure your website from vulnerabilities with WebScan by Ctrl Threats, ensuring complete online protection.",
      keywords: 'WebScan, web vulnerability assessment, penetration testing, website security, cyber threats, security audits, malware detection, ethical hacking'
    },
    '/emaildetection': {
      title: 'Email Threat Detection | Secure Communications',
      description: "Prevent phishing, malware, and cyber threats with Ctrl Threats' advanced email security and threat detection services.",
      keywords: 'email threat detection, phishing protection, email security, malware analysis, secure email, cyber risk management, spam filtering.'
    },
    '/contact': {
      title: 'Contact Ctrl Threats | Cybersecurity Solutions',
      description: "Get in touch with Ctrl Threats for expert cybersecurity consulting, web security, and email threat protection.",
      keywords: 'contact Ctrl Threats, cybersecurity solutions, get in touch, security consulting, cyber protection services, network security support'
    },
    '/login': {
      title: 'Ctrl Threats Login | Secure Account Access',
      description: "Log in to your Ctrl Threats account to access security services, monitor threats, and manage your cybersecurity solutions.",
      keywords: 'Ctrl Threats login, secure access, account security, cybersecurity dashboard, user authentication, security services, protected login'
    },
  };