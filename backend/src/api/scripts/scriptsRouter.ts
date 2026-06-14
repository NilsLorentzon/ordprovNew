import express, { NextFunction } from "express";
import axios from "axios";
import puppeteer from "puppeteer";
import fs from "fs";
import * as cheerio from "cheerio";
import { WordModel } from "../../Models/WordModel";

const scriptsRouter = express.Router();

//   <url>
//       <loc>https://ordprov.com/ordlista/tidigare-högskoleprov/ord</loc>
//       <lastmod>2026-06-14</lastmod>
//     </url>


scriptsRouter.get("/generate-xml-sitemap-for-all-words", async (req, res) => {
    const words = await WordModel.find({}, {
        word: 1,
    })
    const dateYearMonthDayFormat = new Date().toISOString().split("T")[0];
    const urls = words.map((word) => {
        return `
        <url>
            <loc>https://ordprov.com/ordlista/tidigare-högskoleprov/${word.word}</loc>
            <lastmod>${dateYearMonthDayFormat}</lastmod>
        </url>
        `
    } ).join("\n");
    const xmlSitemap = urls
    fs.writeFileSync("words/sitemap.xml", xmlSitemap);
    res.send("XML sitemap generated successfully");
});

export default scriptsRouter;
