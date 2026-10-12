import assert from "node:assert";
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildWebApplicationSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildTechArticleSchema,
} from "../src/lib/seo.ts";

console.log("🔍 Validating JSON-LD Structured Data Schemas...");

// 1. Validate Organization Schema
const org = buildOrganizationSchema();
assert.strictEqual(org["@context"], "https://schema.org", "Organization missing @context");
assert.strictEqual(org["@type"], "Organization", "Organization missing @type");
assert.ok(org.name, "Organization missing name");
assert.ok(org.url, "Organization missing url");
assert.ok(org.contactPoint.email, "Organization missing contactPoint email");
console.log("  ✔ Organization schema valid");

// 2. Validate WebSite Schema
const website = buildWebSiteSchema();
assert.strictEqual(website["@context"], "https://schema.org", "WebSite missing @context");
assert.strictEqual(website["@type"], "WebSite", "WebSite missing @type");
assert.ok(website.name, "WebSite missing name");
assert.ok(website.url, "WebSite missing url");
console.log("  ✔ WebSite schema valid");

// 3. Validate WebApplication Schema & enforce NO fake reviews/ratings
const webapp = buildWebApplicationSchema({ path: "/script", name: "YouTube Script Engine" });
assert.strictEqual(webapp["@context"], "https://schema.org", "WebApplication missing @context");
assert.strictEqual(webapp["@type"], "WebApplication", "WebApplication missing @type");
assert.ok(webapp.name, "WebApplication missing name");
assert.ok(webapp.applicationCategory, "WebApplication missing applicationCategory");
assert.ok(webapp.operatingSystem, "WebApplication missing operatingSystem");
assert.ok(webapp.featureList.length >= 5, "WebApplication featureList too short");

// STRICT RULE: No aggregateRating or Review allowed unless verifiable
assert.strictEqual(
  webapp.aggregateRating,
  undefined,
  "HONESTY VIOLATION: aggregateRating must not be present without verifiable reviews"
);
assert.strictEqual(
  webapp.review,
  undefined,
  "HONESTY VIOLATION: review must not be present without verifiable reviews"
);
console.log("  ✔ WebApplication schema valid (Zero fake reviews/ratings confirmed)");

// 4. Validate Breadcrumb Schema
const breadcrumbs = buildBreadcrumbSchema([
  { name: "Guides", path: "/guides" },
  { name: "Retention", path: "/guides/audience-retention" },
]);
assert.strictEqual(breadcrumbs["@context"], "https://schema.org", "BreadcrumbList missing @context");
assert.strictEqual(breadcrumbs["@type"], "BreadcrumbList", "BreadcrumbList missing @type");
assert.strictEqual(breadcrumbs.itemListElement.length, 3, "Breadcrumbs items count mismatch");
assert.strictEqual(breadcrumbs.itemListElement[0].position, 1, "Breadcrumbs position 1 missing");
console.log("  ✔ BreadcrumbList schema valid");

// 5. Validate FAQPage Schema
const faq = buildFaqSchema([
  {
    question: "Is YT Agent Studio free to use?",
    answer: "Yes, YT Agent Studio is 100% free and open-source under the MIT license.",
  },
  {
    question: "Does YT Agent Studio upload videos to my YouTube channel?",
    answer: "No. The application does not connect via OAuth and never publishes anything.",
  },
]);
assert.strictEqual(faq["@context"], "https://schema.org", "FAQPage missing @context");
assert.strictEqual(faq["@type"], "FAQPage", "FAQPage missing @type");
assert.strictEqual(faq.mainEntity.length, 2, "FAQPage mainEntity length mismatch");
assert.strictEqual(faq.mainEntity[0]["@type"], "Question", "FAQ item missing Question type");
assert.strictEqual(faq.mainEntity[0].acceptedAnswer["@type"], "Answer", "FAQ item missing Answer type");
console.log("  ✔ FAQPage schema valid");

// 6. Validate TechArticle Schema
const article = buildTechArticleSchema({
  title: "How to Read Your YouTube Retention Graph",
  description: "Diagnose hook leak, cliff drops, and middle slide rates.",
  path: "/guides/audience-retention",
  datePublished: "2026-10-13",
  dateModified: "2026-10-13",
});
assert.strictEqual(article["@context"], "https://schema.org", "TechArticle missing @context");
assert.strictEqual(article["@type"], "TechArticle", "TechArticle missing @type");
assert.ok(article.headline, "TechArticle missing headline");
assert.ok(article.datePublished, "TechArticle missing datePublished");
assert.ok(article.author, "TechArticle missing author");
console.log("  ✔ TechArticle schema valid");

console.log("\n🎉 ALL JSON-LD SCHEMAS PASSED VALIDATION WITH ZERO ERRORS.\n");
