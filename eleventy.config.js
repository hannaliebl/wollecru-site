import fs from "node:fs";
import Image, { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import markdownIt from "markdown-it";

// Same settings as Eleventy's default Markdown renderer.
const md = markdownIt({ html: true });

const OUTPUT = "_site";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  // Copy files in `npm start` too (instead of serving them from src/), so the
  // optimized header photos below show up locally as they will on Netlify.
  eleventyConfig.setServerPassthroughCopyBehavior("copy");

  // Every <img> in the page is resized and converted to WebP at build time,
  // with a srcset so browsers download only the size they need. The originals
  // in src/img/ are untouched. width/height attributes keep the layout stable.
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp"],
    // "auto" adds the original size, so width/height match the original photo.
    widths: [600, 1200, 1800, 2400, "auto"],
    urlPath: "/img/opt/",
    outputDir: `${OUTPUT}/img/opt/`,
    htmlOptions: {
      imgAttributes: { loading: "lazy", decoding: "async", sizes: "100vw" },
    },
  });

  // CSS background photos (the big section headers) aren't <img> tags, so the
  // plugin above can't see them. Shrink them in place in the output instead,
  // keeping the same file names so styles.css doesn't change.
  eleventyConfig.on("eleventy.after", async () => {
    const css = fs.readFileSync("src/styles.css", "utf8");
    const backgrounds = [...css.matchAll(/url\(['"]?\/img\/([^'")]+)['"]?\)/g)].map((m) => m[1]);
    for (const name of new Set(backgrounds)) {
      await Image(`src/img/${name}`, {
        useCache: false,
        widths: [2400],
        formats: ["jpeg"],
        outputDir: `${OUTPUT}/img`,
        filenameFormat: () => name,
        sharpJpegOptions: { quality: 75, mozjpeg: true },
      });
    }

    // Link preview image for social media and messaging apps (1200×630).
    await Image("src/img/wollecru-sheep.jpg", {
      useCache: false,
      widths: [1200],
      formats: ["jpeg"],
      outputDir: `${OUTPUT}/img`,
      filenameFormat: () => "og-image.jpg",
      transform: (sharp) => sharp.resize(1200, 630, { fit: "cover" }),
      sharpJpegOptions: { quality: 80, mozjpeg: true },
    });

    // Favicons from the logo. iOS shows transparency as black, so the touch
    // icon gets the page background color.
    await Image("src/img/Wollecru__icon.png", {
      useCache: false,
      widths: [32],
      formats: ["png"],
      outputDir: OUTPUT,
      filenameFormat: () => "favicon-32.png",
    });
    await Image("src/img/Wollecru__icon.png", {
      useCache: false,
      widths: [180],
      formats: ["png"],
      outputDir: OUTPUT,
      filenameFormat: () => "apple-touch-icon.png",
      transform: (sharp) =>
        sharp.resize(150, 150, { fit: "contain", background: "#cfc8a0" })
          .extend({ top: 15, bottom: 15, left: 15, right: 15, background: "#cfc8a0" })
          .flatten({ background: "#cfc8a0" }),
    });
  });

  // For Markdown stored in data files (the CMS's rich-text fields).
  eleventyConfig.addFilter("markdown", (value) => md.render(String(value ?? "")));
  // Single-line fields that allow **bold**, *italic*, and links (no paragraphs).
  eleventyConfig.addFilter("markdownInline", (value) => md.renderInline(String(value ?? "")));

  // JSON for a <script type="application/ld+json"> block. Escapes "<" so text
  // can never close the script tag early.
  eleventyConfig.addFilter("jsonLd", (value) => JSON.stringify(value).replace(/</g, "\\u003c"));
}

export const config = {
  dir: {
    input: "src",
    output: OUTPUT,
    includes: "_includes",
    data: "_data",
  },
  htmlTemplateEngine: "njk",
};
