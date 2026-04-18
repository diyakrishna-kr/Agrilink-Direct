const fs = require("fs");
const path = require("path");

const root = __dirname;
const buildDir = path.join(root, "ppt_build");
const pptDir = path.join(buildDir, "ppt");
const relsDir = path.join(buildDir, "_rels");
const docPropsDir = path.join(buildDir, "docProps");
const pptRelsDir = path.join(pptDir, "_rels");
const slidesDir = path.join(pptDir, "slides");
const slidesRelsDir = path.join(slidesDir, "_rels");
const layoutsDir = path.join(pptDir, "slideLayouts");
const layoutsRelsDir = path.join(layoutsDir, "_rels");
const mastersDir = path.join(pptDir, "slideMasters");
const mastersRelsDir = path.join(mastersDir, "_rels");
const themeDir = path.join(pptDir, "theme");
const mediaDir = path.join(pptDir, "media");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(relPath, content) {
  const filePath = path.join(buildDir, relPath);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function makeParagraph(text, opts = {}) {
  const level = opts.level ? `<a:pPr lvl="${opts.level}"/>` : "";
  const bold = opts.bold ? ' b="1"' : "";
  const size = opts.size ? ` sz="${opts.size}"` : "";
  const color = opts.color
    ? `<a:solidFill><a:srgbClr val="${opts.color}"/></a:solidFill>`
    : "";
  return `
      <a:p>
        ${level}
        <a:r>
          <a:rPr lang="en-US"${bold}${size} dirty="0" smtClean="0">${color}</a:rPr>
          <a:t>${xmlEscape(text)}</a:t>
        </a:r>
        <a:endParaRPr lang="en-US" dirty="0"/>
      </a:p>`;
}

function makeTextBox(id, name, x, y, cx, cy, paragraphs, options = {}) {
  const fontSize = options.fontSize || 2000;
  const bold = options.bold || false;
  const color = options.color || "1F2937";
  const anchor = options.anchor || "t";
  const align = options.align || "l";
  const body = paragraphs
    .map((p) =>
      makeParagraph(typeof p === "string" ? p : p.text, {
        level: typeof p === "string" ? 0 : p.level || 0,
        bold: typeof p === "string" ? bold : p.bold ?? bold,
        size: typeof p === "string" ? fontSize : p.size || fontSize,
        color: typeof p === "string" ? color : p.color || color,
      })
    )
    .join("");

  return `
    <p:sp>
      <p:nvSpPr>
        <p:cNvPr id="${id}" name="${xmlEscape(name)}"/>
        <p:cNvSpPr txBox="1"/>
        <p:nvPr/>
      </p:nvSpPr>
      <p:spPr>
        <a:xfrm>
          <a:off x="${x}" y="${y}"/>
          <a:ext cx="${cx}" cy="${cy}"/>
        </a:xfrm>
        <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
        <a:noFill/>
        <a:ln><a:noFill/></a:ln>
      </p:spPr>
      <p:txBody>
        <a:bodyPr wrap="square" anchor="${anchor}"/>
        <a:lstStyle/>
        ${body.replace(/<a:p>/g, `<a:p><a:pPr algn="${align}"/>`)}
      </p:txBody>
    </p:sp>`;
}

function makeRect(id, name, x, y, cx, cy, fill, line = fill) {
  return `
    <p:sp>
      <p:nvSpPr>
        <p:cNvPr id="${id}" name="${xmlEscape(name)}"/>
        <p:cNvSpPr/>
        <p:nvPr/>
      </p:nvSpPr>
      <p:spPr>
        <a:xfrm>
          <a:off x="${x}" y="${y}"/>
          <a:ext cx="${cx}" cy="${cy}"/>
        </a:xfrm>
        <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
        <a:solidFill><a:srgbClr val="${fill}"/></a:solidFill>
        <a:ln><a:solidFill><a:srgbClr val="${line}"/></a:solidFill></a:ln>
      </p:spPr>
      <p:txBody>
        <a:bodyPr/>
        <a:lstStyle/>
        <a:p><a:endParaRPr lang="en-US"/></a:p>
      </p:txBody>
    </p:sp>`;
}

function makePicture(id, name, relId, x, y, cx, cy) {
  return `
    <p:pic>
      <p:nvPicPr>
        <p:cNvPr id="${id}" name="${xmlEscape(name)}"/>
        <p:cNvPicPr/>
        <p:nvPr/>
      </p:nvPicPr>
      <p:blipFill>
        <a:blip r:embed="${relId}"/>
        <a:stretch><a:fillRect/></a:stretch>
      </p:blipFill>
      <p:spPr>
        <a:xfrm>
          <a:off x="${x}" y="${y}"/>
          <a:ext cx="${cx}" cy="${cy}"/>
        </a:xfrm>
        <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
      </p:spPr>
    </p:pic>`;
}

function makeSlideXml(parts) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      ${parts.join("\n")}
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sld>`;
}

function makeSlideRelXml(includeMedia = []) {
  const slideLayoutRel = `  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>`;
  const mediaRels = includeMedia
    .map(
      (item, index) =>
        `  <Relationship Id="rId${index + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/${item}"/>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${slideLayoutRel}
${mediaRels}
</Relationships>`;
}

function resetBuild() {
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true, force: true });
  }
  [
    buildDir,
    pptDir,
    relsDir,
    docPropsDir,
    pptRelsDir,
    slidesDir,
    slidesRelsDir,
    layoutsDir,
    layoutsRelsDir,
    mastersDir,
    mastersRelsDir,
    themeDir,
    mediaDir,
  ].forEach(ensureDir);
}

resetBuild();

const logoSrc = path.join(root, "public", "images", "agrilink-direct-logo.jpeg");
const erdSrc = path.join(root, "public", "uploads", "E-R-Diagram.png");
fs.copyFileSync(logoSrc, path.join(mediaDir, "logo.jpeg"));
fs.copyFileSync(erdSrc, path.join(mediaDir, "erd.png"));

const slides = [];

slides.push({
  file: "slide1.xml",
  rels: ["logo.jpeg"],
  xml: makeSlideXml([
    makeRect(2, "Background", 0, 0, 12192000, 6858000, "F6FBF4"),
    makeRect(3, "Accent", 0, 0, 12192000, 700000, "2F6B3B"),
    makePicture(4, "Logo", "rId2", 650000, 1100000, 2300000, 2300000),
    makeTextBox(5, "Title", 3400000, 1200000, 7500000, 1200000, ["Agrilink Direct"], {
      fontSize: 2800,
      bold: true,
      color: "234F2C",
    }),
    makeTextBox(
      6,
      "Subtitle",
      3400000,
      2500000,
      7000000,
      2000000,
      [
        { text: "Farmer-Customer Direct Market System", size: 1800, color: "4B5563" },
        { text: "10-slide project presentation", size: 1600, color: "6B7280" },
        { text: "A digital platform connecting farmers and customers for fresher, fairer trade", size: 1600, color: "6B7280" },
      ]
    ),
    makeTextBox(7, "Footer", 650000, 5800000, 10500000, 500000, ["Prepared from the current project workspace"], {
      fontSize: 1200,
      color: "4B5563",
    }),
  ]),
});

slides.push({
  file: "slide2.xml",
  rels: [],
  xml: makeSlideXml([
    makeRect(2, "Header", 0, 0, 12192000, 650000, "2F6B3B"),
    makeTextBox(3, "Title", 600000, 250000, 9000000, 500000, ["Problem Statement"], {
      fontSize: 2200,
      bold: true,
      color: "FFFFFF",
    }),
    makeTextBox(
      4,
      "Body",
      900000,
      1300000,
      10000000,
      4200000,
      [
        "Traditional produce sales often involve middlemen, reducing farmer profits.",
        "Customers struggle to access fresh, traceable products at transparent prices.",
        "Manual order handling makes stock tracking, payments, and delivery coordination difficult.",
        "Small farmers need a simple digital channel to showcase products and manage sales directly.",
      ],
      { fontSize: 1800, color: "1F2937" }
    ),
    makeRect(5, "Bottom Accent", 900000, 5400000, 9000000, 140000, "8DBB73"),
  ]),
});

slides.push({
  file: "slide3.xml",
  rels: [],
  xml: makeSlideXml([
    makeRect(2, "Header", 0, 0, 12192000, 650000, "2F6B3B"),
    makeTextBox(3, "Title", 600000, 250000, 9000000, 500000, ["Solution Overview"], {
      fontSize: 2200,
      bold: true,
      color: "FFFFFF",
    }),
    makeTextBox(
      4,
      "Body",
      850000,
      1250000,
      10400000,
      4300000,
      [
        "Agrilink Direct is a web-based marketplace that connects farmers and customers on one platform.",
        "Farmers list products, manage stock, and monitor orders through dedicated dashboards.",
        "Customers browse by category, search products, add items to bag, and place orders online.",
        "The system records payments, reviews, discounts near expiry, and role-based access for admin, farmer, and customer users.",
      ],
      { fontSize: 1700, color: "1F2937" }
    ),
    makeRect(5, "Callout", 820000, 5350000, 10300000, 650000, "E5F1DF", "E5F1DF"),
    makeTextBox(6, "Callout Text", 1050000, 5480000, 9800000, 350000, ["Core idea: remove friction between producer and buyer."], {
      fontSize: 1500,
      bold: true,
      color: "234F2C",
    }),
  ]),
});

slides.push({
  file: "slide4.xml",
  rels: [],
  xml: makeSlideXml([
    makeRect(2, "Header", 0, 0, 12192000, 650000, "2F6B3B"),
    makeTextBox(3, "Title", 600000, 250000, 9000000, 500000, ["User Roles"], {
      fontSize: 2200,
      bold: true,
      color: "FFFFFF",
    }),
    makeRect(4, "Card 1", 700000, 1500000, 3200000, 3200000, "F5FAF2", "8DBB73"),
    makeRect(5, "Card 2", 4500000, 1500000, 3200000, 3200000, "F5FAF2", "8DBB73"),
    makeRect(6, "Card 3", 8300000, 1500000, 3200000, 3200000, "F5FAF2", "8DBB73"),
    makeTextBox(7, "Farmer", 950000, 1750000, 2600000, 2500000, [
      { text: "Farmer", size: 1900, bold: true, color: "234F2C" },
      { text: "Registers on the platform", size: 1500 },
      { text: "Adds and updates products", size: 1500 },
      { text: "Tracks stock and orders", size: 1500 },
    ]),
    makeTextBox(8, "Customer", 4750000, 1750000, 2600000, 2500000, [
      { text: "Customer", size: 1900, bold: true, color: "234F2C" },
      { text: "Browses and searches produce", size: 1500 },
      { text: "Places orders and payments", size: 1500 },
      { text: "Leaves ratings and reviews", size: 1500 },
    ]),
    makeTextBox(9, "Admin", 8550000, 1750000, 2600000, 2500000, [
      { text: "Admin", size: 1900, bold: true, color: "234F2C" },
      { text: "Monitors platform activity", size: 1500 },
      { text: "Maintains trusted access", size: 1500 },
      { text: "Oversees marketplace data", size: 1500 },
    ]),
  ]),
});

slides.push({
  file: "slide5.xml",
  rels: [],
  xml: makeSlideXml([
    makeRect(2, "Header", 0, 0, 12192000, 650000, "2F6B3B"),
    makeTextBox(3, "Title", 600000, 250000, 9000000, 500000, ["Home Screen Screenshot"], {
      fontSize: 2200,
      bold: true,
      color: "FFFFFF",
    }),
    makeRect(4, "Browser", 800000, 1100000, 10500000, 4400000, "FFFFFF", "D1D5DB"),
    makeRect(5, "BrowserBar", 800000, 1100000, 10500000, 350000, "EEF2E8", "EEF2E8"),
    makeTextBox(6, "BrowserTitle", 1100000, 1180000, 4000000, 180000, ["Agrilink Direct"], {
      fontSize: 1200,
      bold: true,
      color: "234F2C",
    }),
    makeRect(7, "SearchBar", 1200000, 1750000, 3800000, 420000, "F6FBF4", "C7D2C2"),
    makeTextBox(8, "SearchText", 1350000, 1850000, 3200000, 180000, ["Search products, categories, or farmers..."], {
      fontSize: 1000,
      color: "6B7280",
    }),
    makeRect(9, "Filter1", 5200000, 1750000, 900000, 320000, "2F6B3B"),
    makeRect(10, "Filter2", 6200000, 1750000, 900000, 320000, "E5F1DF"),
    makeRect(11, "Filter3", 7200000, 1750000, 900000, 320000, "E5F1DF"),
    makeTextBox(12, "FilterText1", 5420000, 1825000, 500000, 120000, ["All"], { fontSize: 900, bold: true, color: "FFFFFF" }),
    makeTextBox(13, "FilterText2", 6320000, 1825000, 700000, 120000, ["Fruits"], { fontSize: 900, bold: true, color: "234F2C" }),
    makeTextBox(14, "FilterText3", 7300000, 1825000, 700000, 120000, ["Veg"], { fontSize: 900, bold: true, color: "234F2C" }),
    makeRect(15, "Card1", 1200000, 2450000, 2700000, 2300000, "F9FBF7", "D1D5DB"),
    makeRect(16, "Card2", 4200000, 2450000, 2700000, 2300000, "F9FBF7", "D1D5DB"),
    makeRect(17, "Card3", 7200000, 2450000, 2700000, 2300000, "F9FBF7", "D1D5DB"),
    makeRect(18, "Img1", 1400000, 2650000, 2300000, 900000, "B7D7A8", "B7D7A8"),
    makeRect(19, "Img2", 4400000, 2650000, 2300000, 900000, "F4C27A", "F4C27A"),
    makeRect(20, "Img3", 7400000, 2650000, 2300000, 900000, "B7D7A8", "B7D7A8"),
    makeTextBox(21, "Card1Text", 1400000, 3700000, 2200000, 800000, ["Tomato Red", "Rs. 48.00/kg", "4.7 rating"], {
      fontSize: 1100,
      color: "1F2937",
    }),
    makeTextBox(22, "Card2Text", 4400000, 3700000, 2200000, 800000, ["Paneer Fresh", "Rs. 120.00/kg", "Near expiry offer"], {
      fontSize: 1100,
      color: "1F2937",
    }),
    makeTextBox(23, "Card3Text", 7400000, 3700000, 2200000, 800000, ["Spinach", "Rs. 32.00/kg", "Buy Now"], {
      fontSize: 1100,
      color: "1F2937",
    }),
    makeTextBox(24, "Caption", 950000, 5750000, 10000000, 400000, ["Visual snapshot of the searchable product marketplace shown on the home page."], {
      fontSize: 1350,
      color: "4B5563",
    }),
  ]),
});

slides.push({
  file: "slide6.xml",
  rels: [],
  xml: makeSlideXml([
    makeRect(2, "Header", 0, 0, 12192000, 650000, "2F6B3B"),
    makeTextBox(3, "Title", 600000, 250000, 9000000, 500000, ["Farmer Dashboard Screenshot"], {
      fontSize: 2200,
      bold: true,
      color: "FFFFFF",
    }),
    makeRect(4, "Browser", 800000, 1100000, 10500000, 4400000, "FFFFFF", "D1D5DB"),
    makeRect(5, "BrowserBar", 800000, 1100000, 10500000, 350000, "EEF2E8", "EEF2E8"),
    makeTextBox(6, "DashTitle", 1200000, 1600000, 4500000, 300000, ["Farmer Dashboard"], {
      fontSize: 1700,
      bold: true,
      color: "1F2937",
    }),
    makeTextBox(7, "DashSub", 1200000, 1920000, 6000000, 260000, ["Track earnings, review incoming orders, and update fulfilment status."], {
      fontSize: 1000,
      color: "6B7280",
    }),
    makeRect(8, "Metric1", 1200000, 2450000, 1800000, 1000000, "F5FAF2", "D1D5DB"),
    makeRect(9, "Metric2", 3200000, 2450000, 1800000, 1000000, "F5FAF2", "D1D5DB"),
    makeRect(10, "Metric3", 5200000, 2450000, 1800000, 1000000, "F5FAF2", "D1D5DB"),
    makeRect(11, "Metric4", 7200000, 2450000, 1800000, 1000000, "F5FAF2", "D1D5DB"),
    makeTextBox(12, "Metric1Text", 1350000, 2600000, 1400000, 600000, ["Products Listed", "28"], { fontSize: 1100, color: "1F2937" }),
    makeTextBox(13, "Metric2Text", 3350000, 2600000, 1400000, 600000, ["Incoming Orders", "14"], { fontSize: 1100, color: "1F2937" }),
    makeTextBox(14, "Metric3Text", 5350000, 2600000, 1500000, 600000, ["Delivered Revenue", "Rs. 18,450"], { fontSize: 1100, color: "1F2937" }),
    makeTextBox(15, "Metric4Text", 7350000, 2600000, 1500000, 600000, ["Open Order Value", "Rs. 5,920"], { fontSize: 1100, color: "1F2937" }),
    makeRect(16, "TableHead", 1200000, 3800000, 7800000, 350000, "2F6B3B", "2F6B3B"),
    makeRect(17, "TableBody", 1200000, 4150000, 7800000, 900000, "FBFCFA", "D1D5DB"),
    makeTextBox(18, "TableHeadText", 1400000, 3880000, 7000000, 150000, ["Order   Product   Customer   Payment   Status"], {
      fontSize: 950,
      bold: true,
      color: "FFFFFF",
    }),
    makeTextBox(19, "TableRow1", 1400000, 4300000, 7000000, 180000, ["#1204   Tomato Red   Arun Nair   UPI   Packed"], {
      fontSize: 950,
      color: "1F2937",
    }),
    makeTextBox(20, "TableRow2", 1400000, 4550000, 7000000, 180000, ["#1205   Paneer Fresh   Meera Das   COD   Shipped"], {
      fontSize: 950,
      color: "1F2937",
    }),
    makeTextBox(21, "Caption", 950000, 5750000, 10000000, 400000, ["Visual snapshot of the farmer-side dashboard with metrics and incoming orders."], {
      fontSize: 1350,
      color: "4B5563",
    }),
  ]),
});

slides.push({
  file: "slide7.xml",
  rels: [],
  xml: makeSlideXml([
    makeRect(2, "Header", 0, 0, 12192000, 650000, "2F6B3B"),
    makeTextBox(3, "Title", 600000, 250000, 9000000, 500000, ["Customer Orders Screenshot"], {
      fontSize: 2200,
      bold: true,
      color: "FFFFFF",
    }),
    makeRect(4, "Browser", 800000, 1100000, 10500000, 4400000, "FFFFFF", "D1D5DB"),
    makeRect(5, "BrowserBar", 800000, 1100000, 10500000, 350000, "EEF2E8", "EEF2E8"),
    makeTextBox(6, "OrdersTitle", 1200000, 1600000, 4500000, 300000, ["My Bag and Order History"], {
      fontSize: 1700,
      bold: true,
      color: "1F2937",
    }),
    makeRect(7, "BagPanel", 1200000, 2100000, 3600000, 1350000, "F5FAF2", "D1D5DB"),
    makeTextBox(8, "BagText", 1400000, 2250000, 3000000, 900000, ["My Bag", "Tomato Red x 2 kg", "Paneer Fresh x 1 kg", "Cart total: Rs. 216.00"], {
      fontSize: 1100,
      color: "1F2937",
    }),
    makeRect(9, "CheckoutBtn", 3200000, 3150000, 1100000, 260000, "2F6B3B", "2F6B3B"),
    makeTextBox(10, "CheckoutText", 3380000, 3210000, 700000, 120000, ["Checkout"], {
      fontSize: 850,
      bold: true,
      color: "FFFFFF",
    }),
    makeRect(11, "HistoryHead", 5200000, 2100000, 4200000, 350000, "2F6B3B", "2F6B3B"),
    makeRect(12, "HistoryBody", 5200000, 2450000, 4200000, 1400000, "FBFCFA", "D1D5DB"),
    makeTextBox(13, "HistoryHeadText", 5450000, 2180000, 3600000, 150000, ["Order ID   Item   Farmer   Status"], {
      fontSize: 950,
      bold: true,
      color: "FFFFFF",
    }),
    makeTextBox(14, "HistoryRow1", 5450000, 2620000, 3600000, 180000, ["#1198   Spinach   S. Patil   Delivered"], {
      fontSize: 930,
      color: "1F2937",
    }),
    makeTextBox(15, "HistoryRow2", 5450000, 2870000, 3600000, 180000, ["#1201   Paneer   A. Nair   Packed"], {
      fontSize: 930,
      color: "1F2937",
    }),
    makeTextBox(16, "HistoryRow3", 5450000, 3120000, 3600000, 180000, ["#1204   Tomato   R. Singh   Shipped"], {
      fontSize: 930,
      color: "1F2937",
    }),
    makeRect(17, "RefundNote", 5200000, 4050000, 4200000, 450000, "FFF6D8", "E5D28C"),
    makeTextBox(18, "RefundText", 5450000, 4180000, 3600000, 180000, ["Refund policy: Placed 100%, Packed 75%, Shipped 50%"], {
      fontSize: 900,
      color: "6B5A1A",
    }),
    makeTextBox(19, "Caption", 950000, 5750000, 10000000, 400000, ["Visual snapshot of the customer-side bag, checkout, and order history experience."], {
      fontSize: 1350,
      color: "4B5563",
    }),
  ]),
});

slides.push({
  file: "slide8.xml",
  rels: ["erd.png"],
  xml: makeSlideXml([
    makeRect(2, "Header", 0, 0, 12192000, 650000, "2F6B3B"),
    makeTextBox(3, "Title", 600000, 250000, 9000000, 500000, ["System and Database Design"], {
      fontSize: 2200,
      bold: true,
      color: "FFFFFF",
    }),
    makeTextBox(4, "LeftText", 700000, 1200000, 4300000, 3800000, [
      { text: "Technology Stack", size: 1800, bold: true, color: "234F2C" },
      { text: "Express + EJS frontend rendering", size: 1450 },
      { text: "SQLite/MySQL/Oracle scripts present for data layer work", size: 1450 },
      { text: "Role-aware navigation, ordering, reviews, and inventory handling", size: 1450 },
      { text: "Entity structure covers farmers, customers, products, orders, payments, and related details", size: 1450 },
    ]),
    makePicture(5, "ERD", "rId2", 5400000, 1250000, 5700000, 3800000),
  ]),
});

slides.push({
  file: "slide9.xml",
  rels: [],
  xml: makeSlideXml([
    makeRect(2, "Header", 0, 0, 12192000, 650000, "2F6B3B"),
    makeTextBox(3, "Title", 600000, 250000, 9000000, 500000, ["Benefits and Future Scope"], {
      fontSize: 2200,
      bold: true,
      color: "FFFFFF",
    }),
    makeTextBox(
      4,
      "Body",
      900000,
      1250000,
      10400000,
      4500000,
      [
        "Improves farmer income by reducing dependency on intermediaries.",
        "Gives customers access to fresher products and clearer product information.",
        "Supports waste reduction through expiry tracking and discounting.",
        "Creates a scalable base for digital agriculture commerce.",
        "Future enhancements can include delivery tracking, online payment gateways, analytics, multilingual support, and mobile apps.",
      ],
      { fontSize: 1650, color: "1F2937" }
    ),
  ]),
});

slides.push({
  file: "slide10.xml",
  rels: ["logo.jpeg"],
  xml: makeSlideXml([
    makeRect(2, "Background", 0, 0, 12192000, 6858000, "F6FBF4"),
    makeRect(3, "Accent", 0, 0, 12192000, 700000, "2F6B3B"),
    makePicture(4, "Logo", "rId2", 950000, 1800000, 1800000, 1800000),
    makeTextBox(5, "Title", 3400000, 1900000, 6500000, 1000000, ["Thank You"], {
      fontSize: 2600,
      bold: true,
      color: "234F2C",
    }),
    makeTextBox(6, "Subtitle", 3400000, 2900000, 6500000, 1500000, [
      { text: "Agrilink Direct", size: 1800, bold: true, color: "234F2C" },
      { text: "Connecting farmers and customers directly through a digital marketplace", size: 1500, color: "4B5563" },
      { text: "Questions and discussion", size: 1500, color: "4B5563" },
    ]),
  ]),
});

writeFile(
  "[Content_Types].xml",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="jpeg" ContentType="image/jpeg"/>
  <Default Extension="jpg" ContentType="image/jpeg"/>
  <Default Extension="png" ContentType="image/png"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
  <Override PartName="/ppt/presProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presProps+xml"/>
  <Override PartName="/ppt/viewProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml"/>
  <Override PartName="/ppt/tableStyles.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  ${slides
    .map(
      (_, index) =>
        `<Override PartName="/ppt/slides/slide${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`
    )
    .join("\n  ")}
</Types>`
);

writeFile(
  "_rels/.rels",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`
);

writeFile(
  "docProps/app.xml",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
 xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Microsoft Office PowerPoint</Application>
  <Slides>${slides.length}</Slides>
  <Notes>0</Notes>
  <HiddenSlides>0</HiddenSlides>
  <MMClips>0</MMClips>
  <ScaleCrop>false</ScaleCrop>
  <HeadingPairs>
    <vt:vector size="2" baseType="variant">
      <vt:variant><vt:lpstr>Theme</vt:lpstr></vt:variant>
      <vt:variant><vt:i4>1</vt:i4></vt:variant>
    </vt:vector>
  </HeadingPairs>
  <TitlesOfParts>
    <vt:vector size="1" baseType="lpstr">
      <vt:lpstr>Agrilink Direct Presentation</vt:lpstr>
    </vt:vector>
  </TitlesOfParts>
  <Company>Codex</Company>
  <LinksUpToDate>false</LinksUpToDate>
  <SharedDoc>false</SharedDoc>
  <HyperlinksChanged>false</HyperlinksChanged>
  <AppVersion>16.0000</AppVersion>
</Properties>`
);

const now = new Date().toISOString();
writeFile(
  "docProps/core.xml",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
 xmlns:dc="http://purl.org/dc/elements/1.1/"
 xmlns:dcterms="http://purl.org/dc/terms/"
 xmlns:dcmitype="http://purl.org/dc/dcmitype/"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Agrilink Direct Presentation</dc:title>
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`
);

writeFile(
  "ppt/presentation.xml",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
 saveSubsetFonts="1" autoCompressPictures="0">
  <p:sldMasterIdLst>
    <p:sldMasterId id="2147483648" r:id="rId1"/>
  </p:sldMasterIdLst>
  <p:sldIdLst>
    ${slides
      .map((_, index) => `<p:sldId id="${256 + index}" r:id="rId${index + 4}"/>`)
      .join("\n    ")}
  </p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000"/>
  <p:notesSz cx="6858000" cy="9144000"/>
  <p:defaultTextStyle>
    <a:defPPr>
      <a:defRPr lang="en-US"/>
    </a:defPPr>
    <a:lvl1pPr marL="0" indent="0"/>
  </p:defaultTextStyle>
</p:presentation>`
);

writeFile(
  "ppt/_rels/presentation.xml.rels",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/presProps" Target="presProps.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/viewProps" Target="viewProps.xml"/>
  ${slides
    .map(
      (_, index) =>
        `<Relationship Id="rId${index + 4}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${index + 1}.xml"/>`
    )
    .join("\n  ")}
  <Relationship Id="rId${slides.length + 4}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/tableStyles" Target="tableStyles.xml"/>
</Relationships>`
);

writeFile(
  "ppt/slideMasters/slideMaster1.xml",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld name="Office Theme">
    <p:bg>
      <p:bgPr>
        <a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill>
        <a:effectLst/>
      </p:bgPr>
    </p:bg>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
    </p:spTree>
  </p:cSld>
  <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  <p:sldLayoutIdLst>
    <p:sldLayoutId id="1" r:id="rId1"/>
  </p:sldLayoutIdLst>
  <p:txStyles>
    <p:titleStyle>
      <a:lvl1pPr algn="l"/>
    </p:titleStyle>
    <p:bodyStyle>
      <a:lvl1pPr marL="0" indent="0"/>
    </p:bodyStyle>
    <p:otherStyle>
      <a:lvl1pPr marL="0" indent="0"/>
    </p:otherStyle>
  </p:txStyles>
</p:sldMaster>`
);

writeFile(
  "ppt/slideMasters/_rels/slideMaster1.xml.rels",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>
</Relationships>`
);

writeFile(
  "ppt/slideLayouts/slideLayout1.xml",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
 type="blank" preserve="1">
  <p:cSld name="Blank">
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sldLayout>`
);

writeFile(
  "ppt/slideLayouts/_rels/slideLayout1.xml.rels",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>`
);

writeFile(
  "ppt/theme/theme1.xml",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme">
  <a:themeElements>
    <a:clrScheme name="Office">
      <a:dk1><a:srgbClr val="000000"/></a:dk1>
      <a:lt1><a:srgbClr val="FFFFFF"/></a:lt1>
      <a:dk2><a:srgbClr val="1F2937"/></a:dk2>
      <a:lt2><a:srgbClr val="F6FBF4"/></a:lt2>
      <a:accent1><a:srgbClr val="2F6B3B"/></a:accent1>
      <a:accent2><a:srgbClr val="8DBB73"/></a:accent2>
      <a:accent3><a:srgbClr val="234F2C"/></a:accent3>
      <a:accent4><a:srgbClr val="E5F1DF"/></a:accent4>
      <a:accent5><a:srgbClr val="4B5563"/></a:accent5>
      <a:accent6><a:srgbClr val="9CA3AF"/></a:accent6>
      <a:hlink><a:srgbClr val="0563C1"/></a:hlink>
      <a:folHlink><a:srgbClr val="954F72"/></a:folHlink>
    </a:clrScheme>
    <a:fontScheme name="Office">
      <a:majorFont><a:latin typeface="Aptos Display"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont>
      <a:minorFont><a:latin typeface="Aptos"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont>
    </a:fontScheme>
    <a:fmtScheme name="Office">
      <a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst>
      <a:lnStyleLst><a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst>
      <a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst>
      <a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst>
    </a:fmtScheme>
  </a:themeElements>
  <a:objectDefaults/>
  <a:extraClrSchemeLst/>
</a:theme>`
);

writeFile(
  "ppt/presProps.xml",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentationPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"/>`
);

writeFile(
  "ppt/viewProps.xml",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:viewPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:normalViewPr>
    <p:restoredLeft sz="15620"/>
    <p:restoredTop sz="94660"/>
  </p:normalViewPr>
  <p:slideViewPr>
    <p:cSldViewPr snapToGrid="1" snapToObjects="1" showGuides="1"/>
  </p:slideViewPr>
  <p:notesTextViewPr>
    <p:cViewPr varScale="1">
      <p:scale sx="100" sy="100"/>
      <p:origin x="0" y="0"/>
    </p:cViewPr>
  </p:notesTextViewPr>
  <p:gridSpacing cx="72008" cy="72008"/>
</p:viewPr>`
);

writeFile(
  "ppt/tableStyles.xml",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:tblStyleLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" def="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"/>`
);

slides.forEach((slide, index) => {
  writeFile(`ppt/slides/slide${index + 1}.xml`, slide.xml);
  writeFile(
    `ppt/slides/_rels/slide${index + 1}.xml.rels`,
    makeSlideRelXml(slide.rels)
  );
});

console.log(`Created PPTX build files in ${buildDir}`);
