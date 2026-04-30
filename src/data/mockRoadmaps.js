export const mockRoadmaps = {
  "Web Development": [
    { id: "1", title: "Modern HTML5 Mastery", description: "Master semantic structures, accessibility (ARIA), and SEO best practices.", status: "pending" },
    { id: "2", title: "Advanced CSS & Grid", description: "Deep dive into CSS Grid, Flexbox, and complex animation patterns using Framer Motion.", status: "pending" },
    { id: "3", title: "JavaScript ES2024+", description: "Master closures, prototypes, async/await, and the latest ECMAScript features.", status: "pending" },
    { id: "4", title: "React Architecture", description: "State management, Custom Hooks, and high-performance rendering patterns.", status: "pending" },
    { id: "5", title: "Fullstack Integration", description: "Connecting to REST/GraphQL APIs and managing database persistence.", status: "pending" }
  ],
  "Blockchain": [
    { id: "1", title: "Cryptography Fundamentals", description: "Hashing, public/private keys, and digital signatures.", status: "pending" },
    { id: "2", title: "Ethereum & EVM", description: "How the world computer works and the architecture of the EVM.", status: "pending" },
    { id: "3", title: "Solidity Deep Dive", description: "Writing secure smart contracts, gas optimization, and design patterns.", status: "pending" },
    { id: "4", title: "DApp Development", description: "Building frontends with Ethers.js and Wagmi for wallet integration.", status: "pending" },
    { id: "5", title: "DeFi Protocols", description: "Understanding liquidity pools, AMMs, and yield farming mechanics.", status: "pending" }
  ],
  "UI/UX Design": [
    { id: "1", title: "Visual Hierarchy", description: "The laws of layout, typography, and color theory for premium interfaces.", status: "pending" },
    { id: "2", title: "Prototyping in Figma", description: "Advanced component sets, auto-layout, and interactive prototyping.", status: "pending" },
    { id: "3", title: "User Research", description: "Conducting interviews, heatmaps, and building user personas.", status: "pending" },
    { id: "4", title: "Design Systems", description: "Building scalable libraries, tokens, and documentation for engineering teams.", status: "pending" },
    { id: "5", title: "Micro-animations", description: "Using After Effects and Lottie to enhance the user experience.", status: "pending" }
  ],
  "Cyber Security": [
    { id: "1", title: "Network Security Protocols", description: "Mastering TCP/IP, SSL/TLS, and firewall architectures.", status: "pending" },
    { id: "2", title: "Ethical Hacking Foundations", description: "Understanding the mindset of an attacker and common vulnerability patterns.", status: "pending" },
    { id: "3", title: "Penetration Testing", description: "Using Kali Linux, Metasploit, and Nmap for security auditing.", status: "pending" },
    { id: "4", title: "Identity & Access Management", description: "Implementing OAuth2, JWT, and Multi-Factor Authentication (MFA).", status: "pending" },
    { id: "5", title: "Security Operations (SOC)", description: "Incident response, log analysis, and threat intelligence mapping.", status: "pending" }
  ],
  "AI & Machine Learning": [
    { id: "1", title: "Mathematical Foundations", description: "Linear algebra, calculus, and probability for AI modeling.", status: "pending" },
    { id: "2", title: "Supervised Learning", description: "Mastering Regression, Decision Trees, and Support Vector Machines.", status: "pending" },
    { id: "3", title: "Deep Learning & Neural Nets", description: "Building multi-layer perceptrons and understanding backpropagation.", status: "pending" },
    { id: "4", title: "Natural Language Processing", description: "Transformers, BERT, and LLM architecture fundamentals.", status: "pending" },
    { id: "5", title: "Computer Vision", description: "Convolutional Neural Networks (CNNs) and image recognition patterns.", status: "pending" }
  ]
};

export const getRandomRoadmap = (interest) => {
  // Check if we have a direct match
  const key = Object.keys(mockRoadmaps).find(k => 
    interest.toLowerCase().includes(k.toLowerCase()) || 
    k.toLowerCase().includes(interest.toLowerCase())
  );
  
  if (key) return mockRoadmaps[key];
  
  // Default fallback if nothing matches
  return [
    { id: "1", title: `Introduction to ${interest}`, description: `Foundational concepts and terminology for ${interest}.`, status: "pending" },
    { id: "2", title: "Core Principles", description: "Mastering the fundamental building blocks and architectural patterns.", status: "pending" },
    { id: "3", title: "Advanced Implementation", description: "Practical application in complex real-world scenarios.", status: "pending" },
    { id: "4", title: "Performance Optimization", description: "Ensuring scalability, efficiency, and high-speed execution.", status: "pending" },
    { id: "5", title: "Capstone Project", description: "Building a production-ready application to demonstrate mastery.", status: "pending" }
  ];
};
