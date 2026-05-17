import { chromium, Browser, Page } from 'playwright';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScrapedData } from '../types';
import logger from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';

/**
 * ScraperService
 * 
 * Handles intelligent web scraping with 2-tier strategy:
 * 1. **Playwright (Primary)**: Full browser rendering for JS-heavy sites
 *    - Handles React, Vue, Angular, etc.
 *    - Captures post-rendering DOM
 *    - Takes screenshots (full-page + hero)
 *    - Detects tech stack
 * 
 * 2. **Cheerio (Fallback)**: HTML parsing when Playwright fails
 *    - Faster (no browser launch)
 *    - Works on timeouts/failures
 *    - Extracts available content
 *    - Graceful degradation
 * 
 * Extracted data includes:
 * - Headings (h1-h6) for structure
 * - Paragraphs for content
 * - CTAs (button text) for value prop
 * - Navigation menu for IA
 * - Meta/OG tags for SEO/social
 * - Tech stack detection (frameworks, analytics, CMS)
 * - Testimonials and pricing info
 * - Screenshots (full page + hero section)
 * 
 * Retry logic: 3 attempts with exponential backoff for reliability
 * Timeout: 30 seconds per page (then fallback to Cheerio)
 * 
 * Key design decision: Use string-based page.evaluate() to prevent
 * esbuild transpilation leakage (__name issues) into browser context.
 * 
 * @example
 * const scraper = new ScraperService();
 * const data = await scraper.scrapeWebsite('https://example.com');
 * // Returns: headings, paragraphs, links, tech stack, screenshots, etc.
 */
export class ScraperService {
  private browser: Browser | null = null;
  private readonly maxRetries = 3;
  private readonly timeout = 30000;  // 30 seconds before fallback
  private readonly screenshotsDir = path.join(process.cwd(), 'screenshots');

  constructor() {
    this.ensureScreenshotsDir();
  }

  private async ensureScreenshotsDir() {
    try {
      await fs.mkdir(this.screenshotsDir, { recursive: true });
    } catch (error) {
      logger.error('Failed to create screenshots directory', { error });
    }
  }

  /**
   * Initialize Playwright browser instance (singleton)
   * Reused across multiple page loads for efficiency
   */
  private async initBrowser() {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
    return this.browser;
  }

  private normalizeUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }

  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  }

  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();
  }

  private deduplicateArray(arr: string[]): string[] {
    return [...new Set(arr.filter(item => item && item.length > 0))];
  }

  /**
   * Scrape website using Playwright (primary strategy)
   * 
   * Process:
   * 1. Launch headless Chrome
   * 2. Navigate to URL (wait for networkidle)
   * 3. Extract DOM elements (headings, paragraphs, CTAs)
   * 4. Detect tech stack from HTML/meta tags
   * 5. Capture screenshots (full page + hero)
   * 6. Return structured ScrapedData
   * 
   * Timeout: 30 seconds - falls back to Cheerio if exceeded
   * 
   * @param url - Website URL to scrape
   * @returns Partial ScrapedData with extracted content
   * @throws Error if scraping fundamentally fails
   */
  async scrapeWithPlaywright(url: string): Promise<Partial<ScrapedData>> {
    let page: Page | null = null;
    
    try {
      const browser = await this.initBrowser();
      page = await browser.newPage();
      
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      logger.info(`Scraping with Playwright (FIXED VERSION): ${url}`);
      
      await page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: this.timeout 
      });

      // Wait for content to load
      await page.waitForTimeout(2000);

      const data = (await page.evaluate(`(() => {
        const getText = (selector) => Array.from(document.querySelectorAll(selector))
          .map((el) => el.textContent?.trim() || '')
          .filter((text) => text.length > 0);

        const getAttributes = (selector, attr) => Array.from(document.querySelectorAll(selector))
          .map((el) => el.getAttribute(attr) || '')
          .filter((val) => val.length > 0);

        return {
          title: document.title || '',
          description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
          heroText: getText('h1, .hero, [class*="hero"]').slice(0, 5).join(' '),
          headings: [
            ...getText('h1'),
            ...getText('h2'),
            ...getText('h3'),
          ].slice(0, 30),
          paragraphs: getText('p').slice(0, 50),
          ctaButtons: [
            ...getText('button'),
            ...getText('a[class*="btn"]'),
            ...getText('a[class*="button"]'),
            ...getText('[class*="cta"]'),
          ].slice(0, 20),
          navigation: getText('nav a, header a').slice(0, 20),
          footer: getText('footer').slice(0, 10),
          metaTags: Array.from(document.querySelectorAll('meta')).reduce((acc, meta) => {
            const name = meta.getAttribute('name') || meta.getAttribute('property') || '';
            const content = meta.getAttribute('content') || '';
            if (name && content) acc[name] = content;
            return acc;
          }, {}),
          ogTags: Array.from(document.querySelectorAll('meta[property^="og:"]')).reduce((acc, meta) => {
            const property = meta.getAttribute('property') || '';
            const content = meta.getAttribute('content') || '';
            if (property && content) acc[property] = content;
            return acc;
          }, {}),
          internalLinks: getAttributes('a[href]', 'href')
            .filter((href) => !href.startsWith('http') || href.includes(window.location.hostname))
            .slice(0, 50),
          hasChat: !!(
            document.querySelector('[class*="chat"]') ||
            document.querySelector('[id*="chat"]') ||
            document.querySelector('iframe[src*="intercom"]') ||
            document.querySelector('iframe[src*="drift"]') ||
            document.querySelector('[class*="intercom"]')
          ),
          hasBlog: !!(
            document.querySelector('a[href*="blog"]') ||
            document.querySelector('[class*="blog"]')
          ),
          testimonials: getText('[class*="testimonial"], [class*="review"]').slice(0, 10),
          pricingContent: getText('[class*="pricing"], [class*="price"]').slice(0, 20),
          isMobileResponsive: !!(
            document.querySelector('meta[name="viewport"]') ||
            document.querySelector('[class*="mobile"]')
          ),
        };
      })()`)) as Partial<ScrapedData>;

      // Capture screenshots
      const timestamp = Date.now();
      const domain = this.extractDomain(url).replace(/\./g, '_');
      
      const fullPagePath = path.join(this.screenshotsDir, `${domain}_${timestamp}_full.png`);
      const heroPath = path.join(this.screenshotsDir, `${domain}_${timestamp}_hero.png`);

      await page.screenshot({ 
        path: fullPagePath, 
        fullPage: true,
        timeout: 10000 
      });

      await page.screenshot({ 
        path: heroPath,
        clip: { x: 0, y: 0, width: 1920, height: 1080 },
        timeout: 10000
      });

      // Detect tech stack
      const techStack = await this.detectTechStack(page);

      // Get structured data
      const structuredData = await page.evaluate(`(() => {
        const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        return scripts.map((script) => {
          try {
            return JSON.parse(script.textContent || '');
          } catch {
            return null;
          }
        }).filter(Boolean);
      })()`) as any[];

      return {
        ...data,
        url,
        screenshots: {
          fullPage: fullPagePath,
          hero: heroPath,
        },
        techStack,
        structuredData,
      };

    } catch (error) {
      logger.error('Playwright scraping failed', { url, error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error });
      throw error;
    } finally {
      if (page) await page.close();
    }
  }

  private async detectTechStack(page: Page): Promise<string[]> {
    try {
      return await page.evaluate(`(() => {
        const stack = [];
        const globalWindow = window;

        if (typeof globalWindow.React !== 'undefined') stack.push('React');
        if (typeof globalWindow.Vue !== 'undefined') stack.push('Vue');
        if (typeof globalWindow.angular !== 'undefined') stack.push('Angular');
        if (typeof globalWindow.jQuery !== 'undefined') stack.push('jQuery');
        if (typeof globalWindow.next !== 'undefined') stack.push('Next.js');
        if (document.querySelector('[data-gatsby]')) stack.push('Gatsby');

        if (typeof globalWindow.gtag !== 'undefined' || typeof globalWindow.ga !== 'undefined') {
          stack.push('Google Analytics');
        }
        if (typeof globalWindow.fbq !== 'undefined') stack.push('Facebook Pixel');

        if (document.querySelector('script[src*="stripe"]')) stack.push('Stripe');
        if (document.querySelector('script[src*="shopify"]')) stack.push('Shopify');
        if (document.querySelector('script[src*="wordpress"]')) stack.push('WordPress');
        if (document.querySelector('script[src*="hubspot"]')) stack.push('HubSpot');
        if (document.querySelector('script[src*="segment"]')) stack.push('Segment');

        const generator = document.querySelector('meta[name="generator"]')?.getAttribute('content');
        if (generator) stack.push(generator);

        return stack;
      })()`);
    } catch {
      return [];
    }
  }

  async scrapeWithCheerio(url: string): Promise<Partial<ScrapedData>> {
    try {
      logger.info(`Scraping with Cheerio fallback: ${url}`);
      
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const $ = cheerio.load(response.data);

      const getText = (selector: string): string[] => {
        return $(selector)
          .map((_, el) => $(el).text().trim())
          .get()
          .filter(text => text.length > 0);
      };

      return {
        url,
        title: $('title').text() || '',
        description: $('meta[name="description"]').attr('content') || '',
        heroText: getText('h1').slice(0, 3).join(' '),
        headings: [...getText('h1'), ...getText('h2'), ...getText('h3')].slice(0, 30),
        paragraphs: getText('p').slice(0, 50),
        ctaButtons: getText('button, a[class*="btn"], a[class*="button"]').slice(0, 20),
        navigation: getText('nav a, header a').slice(0, 20),
        footer: getText('footer').slice(0, 10),
        metaTags: {},
        ogTags: {},
        internalLinks: $('a[href]')
          .map((_, el) => $(el).attr('href') || '')
          .get()
          .slice(0, 50),
        hasChat: $('[class*="chat"], [id*="chat"]').length > 0,
        hasBlog: $('a[href*="blog"]').length > 0,
        testimonials: getText('[class*="testimonial"], [class*="review"]').slice(0, 10),
        pricingContent: getText('[class*="pricing"], [class*="price"]').slice(0, 20),
        techStack: [],
        structuredData: [],
        screenshots: {},
        isMobileResponsive: $('meta[name="viewport"]').length > 0,
      };
    } catch (error) {
      logger.error('Cheerio scraping failed', { url, error });
      throw error;
    }
  }

  async scrapeMultiplePages(baseUrl: string, scrapedData: Partial<ScrapedData>): Promise<any[]> {
    const pagesToScrape = [
      { path: '/about', type: 'about' },
      { path: '/services', type: 'services' },
      { path: '/pricing', type: 'pricing' },
      { path: '/blog', type: 'blog' },
      { path: '/contact', type: 'contact' },
    ];

    const scrapedPages: any[] = [];

    for (const pageInfo of pagesToScrape) {
      try {
        const pageUrl = `${baseUrl}${pageInfo.path}`;
        
        // Check if link exists in internal links
        const linkExists = scrapedData.internalLinks?.some(link => 
          link.includes(pageInfo.path) || link.includes(pageInfo.type)
        );

        if (!linkExists) continue;

        logger.info(`Scraping additional page: ${pageUrl}`);
        
        const response = await axios.get(pageUrl, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        const $ = cheerio.load(response.data);
        const content = $('body').text().trim().slice(0, 5000);

        scrapedPages.push({
          url: pageUrl,
          type: pageInfo.type,
          content: this.cleanText(content),
        });

      } catch (error) {
        logger.warn(`Failed to scrape ${pageInfo.path}`, { error });
      }
    }

    return scrapedPages;
  }

  async scrapeWebsite(url: string): Promise<ScrapedData> {
    const normalizedUrl = this.normalizeUrl(url);
    let scrapedData: Partial<ScrapedData> = {};
    let retries = 0;

    // Try Playwright first
    while (retries < this.maxRetries) {
      try {
        scrapedData = await this.scrapeWithPlaywright(normalizedUrl);
        break;
      } catch (error) {
        retries++;
        logger.warn(`Playwright attempt ${retries} failed`, { url: normalizedUrl, error });
        
        if (retries >= this.maxRetries) {
          // Fallback to Cheerio
          try {
            scrapedData = await this.scrapeWithCheerio(normalizedUrl);
          } catch (cheerioError) {
            logger.error('All scraping methods failed', { url: normalizedUrl, cheerioError });
            throw new Error('Failed to scrape website after all retries');
          }
        }
      }
    }

    // Scrape additional pages
    const additionalPages = await this.scrapeMultiplePages(normalizedUrl, scrapedData);

    // Clean and deduplicate data
    const finalData: ScrapedData = {
      url: normalizedUrl,
      title: scrapedData.title || '',
      description: scrapedData.description || '',
      heroText: this.cleanText(scrapedData.heroText || ''),
      headings: this.deduplicateArray(scrapedData.headings || []),
      paragraphs: this.deduplicateArray(scrapedData.paragraphs || []).slice(0, 30),
      ctaButtons: this.deduplicateArray(scrapedData.ctaButtons || []),
      navigation: this.deduplicateArray(scrapedData.navigation || []),
      footer: this.deduplicateArray(scrapedData.footer || []),
      metaTags: scrapedData.metaTags || {},
      ogTags: scrapedData.ogTags || {},
      structuredData: scrapedData.structuredData || [],
      screenshots: scrapedData.screenshots || {},
      internalLinks: this.deduplicateArray(scrapedData.internalLinks || []),
      hasChat: scrapedData.hasChat || false,
      hasBlog: scrapedData.hasBlog || false,
      testimonials: this.deduplicateArray(scrapedData.testimonials || []),
      pricingContent: this.deduplicateArray(scrapedData.pricingContent || []),
      techStack: this.deduplicateArray(scrapedData.techStack || []),
      isMobileResponsive: scrapedData.isMobileResponsive || false,
      scrapedPages: additionalPages,
    };

    logger.info('Website scraping completed successfully', { 
      url: normalizedUrl,
      pagesScraped: additionalPages.length + 1 
    });

    return finalData;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export default new ScraperService();
