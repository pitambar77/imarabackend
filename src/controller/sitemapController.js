import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";

import Destinationdetails from "../models/DestinationDetails/Destinationdetails.js";

import Package from "../models/Packages/Package.js";
import Blog from "../models/Travelguide/Blog.js"
import Travelgroup from '../models/Traelgroup/Travelgroup.js'

export const generateSitemap = async (req, res) => {
  try {
    const baseUrl = "https://imarakilelenisafaris.com";

    const destinations = await Destinationdetails.find();
    const travelguide = await Blog.find();
    const packages = await Package.find();
    const travelgroup = await Travelgroup.find();


    const links = [];

    // Static Pages
    links.push({ url: "/", changefreq: "daily", priority: 1.0 });
    links.push({ url: "/about-us", changefreq: "monthly", priority: 0.8 });
    links.push({ url: "/safari-fleet", changefreq: "monthly", priority: 0.8 });
    links.push({ url: "/sustanbility", changefreq: "monthly", priority: 0.8 });
    links.push({ url: "/core-values", changefreq: "monthly", priority: 0.8 });
    links.push({ url: "/contact-us", changefreq: "monthly", priority: 0.8 });
    links.push({ url: "/tanzania-travel-guide", changefreq: "weekly", priority: 0.8 });
    links.push({ url: "/kilimanjaro-travel-guide", changefreq: "weekly", priority: 0.8 });
    links.push({ url: "/tanzania-destinations", changefreq: "weekly", priority: 0.8 });
    links.push({ url: "/tanzania-safaris", changefreq: "weekly", priority: 0.8 });
    links.push({ url: "/mount-kilimanjaro", changefreq: "weekly", priority: 0.8 });
    links.push({ url: "/zanzibar-beach", changefreq: "weekly", priority: 0.8 });
    links.push({ url: "/terms-and-conditions", changefreq: "weekly", priority: 0.8 });
    links.push({ url: "/privacy-policy", changefreq: "weekly", priority: 0.8 });





    // Dynamic Destinations
    destinations.forEach((item) => {
      links.push({
        url: `/tanzania-destinations/${item.slug}`,
        changefreq: "weekly",
        priority: 0.9,
        lastmod: item.updatedAt,
      });
    });




    // travel guide
    travelguide.forEach((item) => {
      links.push({
        url: `/travel-guide/${item.slug}`,
        changefreq: "weekly",
        priority: 0.8,
        lastmod: item.updatedAt,
      });
    });

    // Packages
    packages.forEach((item) => {
      links.push({
        url: `/package/${item.slug}`,
        changefreq: "weekly",
        priority: 0.8,
        lastmod: item.updatedAt,
      });
    });

     // travel group
    travelgroup.forEach((item) => {
      links.push({
        url: `/travelgroup/${item.slug}`,
        changefreq: "weekly",
        priority: 0.8,
        lastmod: item.updatedAt,
      });
    });


    const stream = new SitemapStream({ hostname: baseUrl });

    const xml = await streamToPromise(
      Readable.from(links).pipe(stream)
    ).then((data) => data.toString());

    res.header("Content-Type", "application/xml");
    res.send(xml);

  } catch (error) {
    console.error("Sitemap Error:", error);
    res.status(500).send("Error generating sitemap");
  }
};
