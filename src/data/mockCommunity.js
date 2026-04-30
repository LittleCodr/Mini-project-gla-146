export const mockResources = [
  {
    id: "r1",
    title: "The 2024 Fullstack Roadmap (High Signal)",
    upvotes: 124,
    comments_count: 12,
    creator_name: "Tanmay Singhal",
    link: "https://roadmap.sh/full-stack"
  },
  {
    id: "r2",
    title: "System Design: Scaling to 100M Users",
    upvotes: 89,
    comments_count: 5,
    creator_name: "Architect_Beta",
    link: "https://bytebytego.com"
  },
  {
    id: "r3",
    title: "Securing JWTs in Production Environments",
    upvotes: 56,
    comments_count: 8,
    creator_name: "Neural_Link_9",
    link: "https://auth0.com/blog"
  }
];

export const mockComments = {
  "r1": [
    { id: "c1", content: "This roadmap literally saved my career. The focus on Next.js 14 is spot on.", author: "Dev_Alpha", timestamp: "2h ago" },
    { id: "c2", content: "Needs more focus on database sharding for the later stages.", author: "DB_Ninja", timestamp: "1h ago" }
  ],
  "r2": [
    { id: "c3", content: "The section on horizontal vs vertical scaling is the clearest I've ever seen.", author: "SysAdmin_Pro", timestamp: "5h ago" }
  ]
};
