import markdownIt from "markdown-it";

// Same settings as Eleventy's default Markdown renderer.
const md = markdownIt({ html: true });

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/styles.css");

  // For Markdown stored in data files (the CMS's rich-text fields).
  eleventyConfig.addFilter("markdown", (value) => md.render(String(value ?? "")));
  // Single-line fields that allow **bold**, *italic*, and links (no paragraphs).
  eleventyConfig.addFilter("markdownInline", (value) => md.renderInline(String(value ?? "")));

  // Multi-line plain text fields (e.g. the address): one line per line.
  eleventyConfig.addFilter("lines", (value) =>
    String(value ?? "").trim().split(/\r?\n/).map((line) => line.trim()),
  );
}

export const config = {
  dir: {
    input: "src",
    includes: "_includes",
    data: "_data",
  },
  htmlTemplateEngine: "njk",
};
