const fs = require("fs");

module.exports = function (eleventyConfig) {
  // Copy these folders into the finished site exactly as they are
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/Assets");

  // Turns a date into "16 November 2026" (used on the Resources pages)
  eleventyConfig.addFilter("readableDate", (date) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date)
  );

  // JBS gallery: every picture placed in src/Assets/images/jbs/ shows up automatically
  eleventyConfig.addGlobalData("jbsGallery", () => {
    try {
      return fs
        .readdirSync("src/Assets/images/jbs")
        .filter((f) => /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(f))
        .sort()
        .map((file) => ({ file }));
    } catch (err) {
      return [];
    }
  });

  // Takes the first N items of a list (used for "latest 3" on the home page)
  eleventyConfig.addFilter("head", (array, n) => array.slice(0, n));

  // A "resources" collection, newest first
  eleventyConfig.addCollection("resourcesNewestFirst", (collectionApi) =>
    collectionApi.getFilteredByTag("resources").reverse()
  );

  // Service units in the order set by "order" in each unit's file
  eleventyConfig.addCollection("serviceUnitsOrdered", (collectionApi) =>
    collectionApi
      .getFilteredByTag("serviceUnits")
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99))
  );

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
