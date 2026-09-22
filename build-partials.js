const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const localeDirs = [
  path.join(rootDir),
  path.join(rootDir, 'en'),
  path.join(rootDir, 'al')
];

const replacements = [
  {
    id: 'nav-container',
    file: 'nav.html',
    includeDir: 'includes'
  },
  {
    id: 'mobile-nav-container',
    file: 'mobileNav.html',
    includeDir: 'includes'
  },
  {
    id: 'footer-container',
    file: 'footer.html',
    includeDir: 'includes'
  },
  {
    id: 'cart-badge-container',
    file: 'cart-badge.html',
    includeDir: 'includes'
  }
];

function readFileIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return null;
  }
}

function getLocaleSpecificIncludesDir(pageDir) {
  const relativePath = path.relative(rootDir, pageDir);
  if (relativePath === 'en' || relativePath.startsWith('en' + path.sep)) {
    return path.join(rootDir, 'en', 'includes');
  }
  if (relativePath === 'al' || relativePath.startsWith('al' + path.sep)) {
    return path.join(rootDir, 'al', 'includes');
  }
  return path.join(rootDir, 'includes');
}

function collectHtmlFiles(dirPath) {
  const results = [];
  if (!fs.existsSync(dirPath)) return results;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'includes' || entry.name === 'assets' || entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.venv') {
        continue;
      }
      results.push(...collectHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      results.push(fullPath);
    }
  }

  return results;
}

function replaceGlobal(containerRegex, content, html) {
  return html.replace(containerRegex, content);
}

function buildPage(filePath) {
  const relative = path.relative(rootDir, filePath);
  const localeIncludesDir = getLocaleSpecificIncludesDir(path.dirname(filePath));

  let html = fs.readFileSync(filePath, 'utf8');
  let replacedCount = 0;

  for (const replacement of replacements) {
    const partialPath = path.join(localeIncludesDir, replacement.file);
    const partialContent = readFileIfExists(partialPath);
    if (!partialContent) {
      console.warn(`Missing partial for ${relative}: ${partialPath}`);
      continue;
    }

    const tagId = replacement.id;
    const containerRegex = new RegExp(`<div\\s+id="${tagId}"\\s*[^>]*>\\s*<\\/div>`, 'gi');
    const before = html;
    html = html.replace(containerRegex, partialContent.trim());
    if (html !== before) {
      replacedCount += 1;
    }
  }

  if (replacedCount > 0) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Updated ${relative}`);
  }
}

function main() {
  const htmlFiles = [...new Set(localeDirs.flatMap(collectHtmlFiles))];

  if (htmlFiles.length === 0) {
    console.log('No HTML files found to bake.');
    return;
  }

  htmlFiles.forEach(buildPage);
  console.log(`Baked partials into ${htmlFiles.length} HTML files.`);
}

main();
