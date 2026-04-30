export const mockLessons = {
  "Modern HTML5 Mastery": {
    title: "Modern HTML5 Mastery",
    introduction: "Semantic HTML is the backbone of the modern web. It provides meaning to your markup, ensuring that both browsers and assistive technologies can interpret your content correctly.",
    sections: [
      {
        heading: "1. The Semantic Revolution",
        content: "HTML5 introduced a suite of semantic elements like `<article>`, `<section>`, and `<main>`. These tags tell the browser exactly what kind of content they contain, which is vital for SEO and accessibility."
      },
      {
        heading: "2. Accessibility (ARIA)",
        content: "When semantic tags aren't enough, we use ARIA roles. ARIA (Accessible Rich Internet Applications) attributes provide extra context to screen readers, such as `aria-expanded` for dropdowns."
      }
    ],
    tip: "Always use the most specific tag possible. Use `<nav>` for navigation, not just a `<div>` with a class."
  },
  "JavaScript ES2024+": {
    title: "JavaScript ES2024+",
    introduction: "JavaScript has evolved into a high-performance, multi-paradigm language. Mastering the latest ES2024+ features is essential for modern fullstack development.",
    sections: [
      {
        heading: "1. Asynchronous Mastery",
        content: "The `async/await` syntax transformed how we handle side effects. Combined with `Promise.allSettled()`, you can manage complex concurrent operations with ease."
      },
      {
        heading: "2. Optional Chaining & Nullish Coalescing",
        content: "Features like `?.` and `??` allow you to write much cleaner code by safely accessing deeply nested object properties without crashing."
      }
    ],
    tip: "Use `const` by default. Only use `let` if you explicitly need to reassign the variable."
  }
};

export const getFallbackLesson = (title) => {
  const key = Object.keys(mockLessons).find(k => 
    title.toLowerCase().includes(k.toLowerCase()) || 
    k.toLowerCase().includes(title.toLowerCase())
  );
  
  if (key) return mockLessons[key];

  // Generic Dynamic Content Generation
  return {
    title: title,
    introduction: `This specialized module deep-dives into the core mechanics of ${title}. It is designed to bridge the gap between theoretical knowledge and industrial application.`,
    sections: [
      {
        heading: "1. Foundational Architecture",
        content: `Mastering ${title} requires an understanding of its underlying architectural patterns. We explore how this concept integrates with modern development ecosystems.`
      },
      {
        heading: "2. Performance & Optimization",
        content: `When implementing ${title} at scale, performance is critical. We focus on minimizing execution overhead and optimizing resource allocation.`
      },
      {
        heading: "3. Real-world Implementation",
        content: "Practical examples and best practices for deploying this logic in production environments."
      }
    ],
    tip: `Focus on the 'Why' behind ${title} to truly master its 'How'.`
  };
};
