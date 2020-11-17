import puppeteer from 'puppeteer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });
const imgMatchConfit = {
  customDiffConfig: { threshold: 0.1 },
  customSnapshotIdentifier: 'productlist',
  failureThreshold: 0.01,
  failureThresholdType: 'percent',
};

// const BASE_URL = `http://localhost:${process.env.PORT || 8000}`;
const BASE_URL = `http://pei.nature-home.cn`;

describe('Product', () => {
  let page;
  let browser;
  const width = 1920;
  const height = 1080;

  beforeAll(async () => {
    jest.setTimeout(1000000);
    browser = await puppeteer.launch({
      slowMo: 250,
      // devtools: true,
      headless: false,
      executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      defaultViewport: {
        width,
        height,
      },
      args: [`--window-size=${width},${height}`],
    });
  });
  beforeEach(async () => {
    page = await browser.newPage();
    const url = `${BASE_URL}/product/list`;
    // await page.setViewport({ width, height });
    await page.goto(url, {
      waitUntil: 'networkidle2',
    });
  });
  afterAll(() => browser.close());

  it('test product list', async () => {
    await page.waitForResponse(`${BASE_URL}/site/goodsinfo/essearchgoodsinfolist`);
    await page.waitForSelector(
      '.antd-pro\\\\pages\\\\-front-site\\\\-product-component\\\\-product-productListItemImg img'
    );
    await page.evaluate(() => {
      const images = Array.from(
        document.querySelectorAll(
          '.antd-pro\\\\pages\\\\-front-site\\\\-product-component\\\\-product-productListItemImg img'
        )
      );
      return Promise.all(
        images.map(
          img =>
            new Promise(resolve => {
              if (img.complete) {
                resolve(img);
                return;
              }
              img.addEventListener('load', () => {
                resolve(img);
              });
            })
        )
      );
    });
    // await page.evaluate(() => {
    //   debugger;
    // });

    const screenshot = await page.screenshot({
      // path: 'screenshot/productList.png',
      fullPage: true,
    });
    // console.log(1);
    expect(screenshot).toMatchImageSnapshot(imgMatchConfit);
  });
});
