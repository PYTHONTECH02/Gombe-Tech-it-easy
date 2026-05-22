export const CYBER_TRACKS = [
  {
    id: 'recon',
    title: 'Recon & Basics',
    theme: 'green',
    lessons: [
      { id: 1, title: 'How the Internet Works', desc: 'DNS, IP addresses, TCP/IP, ports' },
      { id: 2, title: 'Linux Terminal Basics', desc: 'pwd, ls, cd, chmod, sudo, netstat' },
      { id: 3, title: 'Networking Fundamentals', desc: 'OSI 7 layers, HTTP/HTTPS/SSH, firewalls, Wireshark' },
      { id: 4, title: 'OSINT & Reconnaissance', desc: 'Google dorks, Shodan, HaveIBeenPwned, whois' },
      { id: 5, title: 'Threats, Attacks & Social Engineering', desc: 'malware types, phishing, MITM, SQL injection' }
    ]
  },
  {
    id: 'defence',
    title: 'Defence & Crypto',
    theme: 'yellow',
    lessons: [
      { id: 1, title: 'Cryptography Fundamentals', desc: 'symmetric vs asymmetric, AES, RSA, hashing' },
      { id: 2, title: 'Web Security Basics', desc: 'OWASP Top 10, XSS, CSRF, input validation' },
      { id: 3, title: 'Password Security & Auth', desc: 'hashing, salting, MFA, password managers' },
      { id: 4, title: 'Network Defence', desc: 'IDS/IPS, VPNs, DMZ, hardening' },
      { id: 5, title: 'Incident Response', desc: 'IR lifecycle, forensics basics, log analysis' }
    ]
  },
  {
    id: 'attack',
    title: 'Attack & CTF',
    theme: 'red',
    lessons: [
      { id: 1, title: 'Ethical Hacking Intro', desc: 'phases: recon, scan, exploit, post-exploit, report' },
      { id: 2, title: 'Scanning & Enumeration', desc: 'Nmap, Gobuster, Nikto, banner grabbing' },
      { id: 3, title: 'Exploitation Basics', desc: 'Metasploit, CVEs, buffer overflows intro' },
      { id: 4, title: 'CTF Strategies', desc: 'challenge types, tools: BurpSuite, Ghidra, CyberChef' },
      { id: 5, title: 'Report Writing', desc: 'executive summary, findings, CVSS scoring' }
    ]
  }
];

export const CODING_TRACKS = [
  {
    id: 'beginner',
    title: 'Foundations',
    theme: 'green',
    lessons: [
      { id: 1, title: 'What is a Computer?', desc: 'IPO cycle, CPU/RAM/Storage, binary, hardware vs software' },
      { id: 2, title: 'Intro to HTML', desc: 'tags, structure, headings, links, images, lists' },
      { id: 3, title: 'Styling with CSS', desc: 'selectors, box model, 3 ways to add CSS, classes vs IDs' },
      { id: 4, title: 'Python Basics', desc: 'print, variables, data types, input(), arithmetic' },
      { id: 5, title: 'Logic & Conditionals', desc: 'if/elif/else, comparison operators, loops' }
    ]
  },
  {
    id: 'intermediate',
    title: 'Building Up',
    theme: 'yellow',
    lessons: [
      { id: 1, title: 'JavaScript Fundamentals', desc: 'let/const/var, functions, arrays, objects' },
      { id: 2, title: 'DOM Manipulation', desc: 'getElementById, querySelector, events, createElement' },
      { id: 3, title: 'Python Functions & Lists', desc: 'def, return, append, comprehensions, dicts' },
      { id: 4, title: 'APIs & JSON', desc: 'fetch, async/await, response.json(), try/catch' },
      { id: 5, title: 'Git & Version Control', desc: 'init, add, commit, push, clone, branch' }
    ]
  },
  {
    id: 'pro',
    title: 'Advanced',
    theme: 'red',
    lessons: [
      { id: 1, title: 'React & Components', desc: 'JSX, useState, props vs state, re-renders' },
      { id: 2, title: 'Databases & SQL', desc: 'CREATE TABLE, SELECT, WHERE, INSERT, UPDATE, DELETE' },
      { id: 3, title: 'Algorithms & Big O', desc: 'O(1), O(n), O(n²), binary search, bubble sort' },
      { id: 4, title: 'Authentication & Security', desc: 'sessions, JWT, OAuth, HTTPS, SQL injection prevention' },
      { id: 5, title: 'Deploying Your App', desc: 'GitHub Pages, Vercel, env vars, CI/CD basics' }
    ]
  }
];

// ── CODING QUIZZES ───────────────────────────────────────────────────────────
// Each lesson in each track gets its own 5-question quiz.
// Key: `${trackId}_${lessonId}`

export const CODING_LESSON_NOTES: Record<string, { title: string; content: string[] }> = {
  beginner_1: {
    title: 'What is a Computer?',
    content: [
      '🖥️ A computer follows the IPO cycle: Input → Process → Output.',
      '🔢 Everything in a computer is stored as binary (0s and 1s). For example, the letter "A" = 01000001.',
      '🧠 CPU (Central Processing Unit) is the "brain" — it runs all calculations.',
      '💾 RAM is temporary memory (loses data when off). Storage (HDD/SSD) keeps data permanently.',
      '⚙️ Hardware = physical parts you can touch. Software = programs and apps you run.',
    ]
  },
  beginner_2: {
    title: 'Intro to HTML',
    content: [
      '🏷️ HTML uses tags like <h1>, <p>, <a>, <img> to structure a webpage.',
      '📄 Every HTML page has: <!DOCTYPE html>, <html>, <head>, and <body>.',
      '🔗 Links use <a href="url">text</a>. Images use <img src="path" alt="desc">.',
      '📋 Lists: <ul> = unordered (bullets), <ol> = ordered (numbers). Items use <li>.',
      '✅ Tags usually come in pairs: <p>Hello</p>. Self-closing: <br />, <img />.',
    ]
  },
  beginner_3: {
    title: 'Styling with CSS',
    content: [
      '🎨 CSS (Cascading Style Sheets) adds color, size, spacing to HTML.',
      '3 ways to add CSS: Inline (style=""), Internal (<style> in <head>), External (.css file).',
      '🔍 Selectors: tag (p {}), class (.box {}), ID (#title {}). IDs are unique, classes reusable.',
      '📦 The Box Model: every element has content, padding, border, and margin around it.',
      '⚡ CSS specificity order: inline > ID > class > tag.',
    ]
  },
  beginner_4: {
    title: 'Python Basics',
    content: [
      '🐍 Python is beginner-friendly. No curly braces — indentation matters!',
      '📢 print("Hello") outputs text. input("Enter name: ") reads user input.',
      '📦 Variables store data: name = "Gombe", age = 16, pi = 3.14, active = True.',
      '🔢 Data types: str (text), int (whole numbers), float (decimals), bool (True/False).',
      '➕ Arithmetic: +, -, *, / (divide), // (floor divide), % (remainder), ** (power).',
    ]
  },
  beginner_5: {
    title: 'Logic & Conditionals',
    content: [
      '🔀 if/elif/else lets your program make decisions.',
      '🔁 while loop runs as long as condition is True. for loop iterates over a range or list.',
      '⚖️ Comparison operators: ==, !=, <, >, <=, >= all return True or False.',
      '🔗 Logical operators: and (both true), or (either true), not (flips true/false).',
      '💡 Example: if age >= 18: print("Adult") else: print("Minor")',
    ]
  },
  intermediate_1: {
    title: 'JavaScript Fundamentals',
    content: [
      '⚡ JavaScript runs in the browser and makes pages interactive.',
      '📦 Variables: let (changeable), const (fixed), var (old — avoid). Use let/const.',
      '🔧 Functions: function greet(name) { return "Hello " + name; }',
      '📋 Arrays: let fruits = ["apple","mango","banana"]; fruits[0] = "apple"',
      '🗂️ Objects: let user = { name: "Ali", age: 15 }; user.name = "Ali"',
    ]
  },
  intermediate_2: {
    title: 'DOM Manipulation',
    content: [
      '🌳 The DOM (Document Object Model) is a tree of all HTML elements you can change with JS.',
      '🔍 Selecting: document.getElementById("id"), document.querySelector(".class")',
      '✏️ Changing content: element.textContent = "New text"; element.innerHTML = "<b>Bold</b>"',
      '🎯 Events: element.addEventListener("click", function() { alert("Clicked!") })',
      '➕ Creating elements: let div = document.createElement("div"); body.appendChild(div)',
    ]
  },
  intermediate_3: {
    title: 'Python Functions & Lists',
    content: [
      '🔧 Functions: def add(a, b): return a + b. Call it: result = add(3, 5)',
      '📋 Lists: nums = [1,2,3]. Add: nums.append(4). Remove: nums.pop(). Sort: nums.sort()',
      '🔄 List comprehension: squares = [x**2 for x in range(5)] → [0,1,4,9,16]',
      '📖 Dictionaries: student = {"name":"Ali","grade":"A"}. Access: student["name"]',
      '📦 Default parameter: def greet(name="World"): print("Hello", name)',
    ]
  },
  intermediate_4: {
    title: 'APIs & JSON',
    content: [
      '🌐 An API (Application Programming Interface) lets your app talk to servers/services.',
      '📡 fetch("url") returns a Promise. Use .then() or async/await to handle it.',
      '📦 JSON (JavaScript Object Notation) is how data is sent: {"name":"Ali","age":16}',
      '⚡ async function getData() { const res = await fetch(url); const data = await res.json(); }',
      '🛡️ Always wrap fetch in try/catch to handle network errors gracefully.',
    ]
  },
  intermediate_5: {
    title: 'Git & Version Control',
    content: [
      '📁 Git tracks changes to your code over time — like a save history.',
      '🚀 Basic flow: git init → git add . → git commit -m "message" → git push',
      '🌿 Branches: git branch feature → git checkout feature. Merge: git merge feature',
      '☁️ GitHub hosts your repos online. Clone: git clone <url>. Pull updates: git pull',
      '⚠️ git status shows what changed. git log shows commit history.',
    ]
  },
  pro_1: {
    title: 'React & Components',
    content: [
      '⚛️ React builds UIs from components — reusable blocks like functions that return HTML (JSX).',
      '🔄 State: const [count, setCount] = useState(0). Changing state re-renders the component.',
      '📦 Props pass data from parent to child: <Card title="Hello" /> → function Card({ title })',
      '🔁 JSX: write HTML-like code inside JS. Use {} for expressions: <p>{user.name}</p>',
      '⚡ useEffect runs side effects (fetching data, timers) after render.',
    ]
  },
  pro_2: {
    title: 'Databases & SQL',
    content: [
      '🗄️ SQL (Structured Query Language) communicates with relational databases like MySQL/PostgreSQL.',
      '🏗️ CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100), age INT);',
      '📖 SELECT * FROM users WHERE age > 15 ORDER BY name;',
      '➕ INSERT INTO users (name, age) VALUES ("Ali", 16);',
      '✏️ UPDATE users SET age = 17 WHERE name = "Ali"; DELETE FROM users WHERE id = 3;',
    ]
  },
  pro_3: {
    title: 'Algorithms & Big O',
    content: [
      '📊 Big O describes how fast an algorithm grows with input size n.',
      '⚡ O(1) = constant (instant). O(n) = linear (grows with n). O(n²) = slow (nested loops).',
      '🔍 Binary search on a sorted array: O(log n) — halves the search space each step.',
      '🫧 Bubble sort: compare pairs and swap. O(n²) worst case — fine for small data.',
      '💡 Always ask: "How does this scale if I have 1 million records?"',
    ]
  },
  pro_4: {
    title: 'Authentication & Security',
    content: [
      '🔐 Never store plain-text passwords. Hash them with bcrypt: hash + salt = secure storage.',
      '🎫 JWT (JSON Web Token): server issues a signed token after login. Client sends it in headers.',
      '🌐 OAuth lets users log in with Google/GitHub without you handling their password.',
      '🛡️ SQL injection: never concatenate user input into queries. Use parameterized queries.',
      '🔒 HTTPS encrypts data in transit. Always use it — never send passwords over HTTP.',
    ]
  },
  pro_5: {
    title: 'Deploying Your App',
    content: [
      '🚀 Vercel/Netlify: push to GitHub → auto-deploys. Free tier available.',
      '⚙️ Environment variables (.env): store secrets like API keys. Never commit .env to git!',
      '🔄 CI/CD (Continuous Integration/Deployment): code pushed → tests run → auto-deploy.',
      '📦 GitHub Pages: free static site hosting. Perfect for HTML/CSS/JS projects.',
      '🌍 Domain: point your domain\'s DNS to your host. CNAME for subdomain, A record for root.',
    ]
  },
};

export const CODING_QUIZ_QUESTIONS: Record<string, Array<{ q: string; options: string[]; correct: number }>> = {
  beginner_1: [
    { q: "What does IPO stand for in computing?", options: ["Input, Process, Output", "Internet, Protocol, Operation", "Install, Program, Open", "Index, Print, Organize"], correct: 0 },
    { q: "Which component is called the 'brain' of a computer?", options: ["RAM", "Hard Drive", "CPU", "GPU"], correct: 2 },
    { q: "What is 5 represented in binary?", options: ["110", "101", "011", "100"], correct: 1 },
    { q: "Which type of memory LOSES data when the computer is switched off?", options: ["SSD", "HDD", "ROM", "RAM"], correct: 3 },
    { q: "Which of these is an example of SOFTWARE?", options: ["Keyboard", "Monitor", "Microsoft Word", "Hard Disk Drive"], correct: 2 },
  ],
  beginner_2: [
    { q: "Which HTML tag creates the largest heading?", options: ["<h6>", "<heading>", "<h1>", "<head>"], correct: 2 },
    { q: "What attribute is used in <img> to describe an image for accessibility?", options: ["src", "href", "alt", "title"], correct: 2 },
    { q: "Which tag creates an unordered (bulleted) list?", options: ["<ol>", "<li>", "<list>", "<ul>"], correct: 3 },
    { q: "What does DOCTYPE in <!DOCTYPE html> tell the browser?", options: ["The page title", "The CSS to load", "The HTML version being used", "The author of the page"], correct: 2 },
    { q: "Which tag is used to make a hyperlink?", options: ["<link>", "<a>", "<href>", "<nav>"], correct: 1 },
  ],
  beginner_3: [
    { q: "Which CSS selector targets ALL <p> elements?", options: ["#p", ".p", "p {}", "*p"], correct: 2 },
    { q: "In the CSS box model, what is OUTSIDE the border?", options: ["Padding", "Content", "Margin", "Outline"], correct: 2 },
    { q: "Which method of adding CSS has the HIGHEST specificity?", options: ["External stylesheet", "Internal <style> tag", "Inline style attribute", "Browser default"], correct: 2 },
    { q: "How do you select an element with class name 'box' in CSS?", options: ["#box", "box", ".box", "*box"], correct: 2 },
    { q: "What does 'Cascading' mean in CSS?", options: ["Styles can animate", "Styles flow from top to bottom with priority rules", "CSS works on all browsers", "CSS is case-sensitive"], correct: 1 },
  ],
  beginner_4: [
    { q: "What will print('Hello' + ' ' + 'World') output in Python?", options: ["HelloWorld", "Hello World", "Hello + World", "Error"], correct: 1 },
    { q: "Which data type stores True or False in Python?", options: ["str", "int", "bool", "float"], correct: 2 },
    { q: "What does the % operator do in Python?", options: ["Division", "Power", "Remainder (modulo)", "Floor division"], correct: 2 },
    { q: "What function reads user input in Python?", options: ["read()", "scan()", "get()", "input()"], correct: 3 },
    { q: "Which of these is a valid Python variable name?", options: ["2name", "my-name", "my_name", "my name"], correct: 2 },
  ],
  beginner_5: [
    { q: "What keyword starts a conditional block in Python?", options: ["when", "if", "check", "case"], correct: 1 },
    { q: "What does this print? for i in range(3): print(i)", options: ["1 2 3", "0 1 2", "0 1 2 3", "1 2"], correct: 1 },
    { q: "Which operator checks if two values are EQUAL in Python?", options: ["=", "===", "==", "!="], correct: 2 },
    { q: "What does 'and' do in a condition?", options: ["Either condition must be true", "Flips true to false", "Both conditions must be true", "Used for addition"], correct: 2 },
    { q: "When does a while loop STOP?", options: ["After 10 iterations", "When condition becomes False", "When break is written inside it", "Both B and C"], correct: 3 },
  ],
  intermediate_1: [
    { q: "Which keyword declares a CONSTANT variable in JavaScript?", options: ["var", "let", "const", "static"], correct: 2 },
    { q: "What will typeof 42 return in JavaScript?", options: ["'integer'", "'number'", "'int'", "'42'"], correct: 1 },
    { q: "How do you access the FIRST element of array fruits = ['apple','mango']?", options: ["fruits[1]", "fruits.first()", "fruits[0]", "fruits.get(0)"], correct: 2 },
    { q: "What does this return? function add(a,b){ return a+b; } add(3,4)", options: ["'34'", "7", "undefined", "Error"], correct: 1 },
    { q: "How do you access the 'name' property of object user = {name:'Ali'}?", options: ["user->name", "user[name]", "user::name", "user.name"], correct: 3 },
  ],
  intermediate_2: [
    { q: "What does DOM stand for?", options: ["Document Object Model", "Data Output Method", "Dynamic Object Manager", "Document Order Map"], correct: 0 },
    { q: "Which method selects an element by its ID?", options: ["document.getClass('id')", "document.querySelector('#id')", "document.selectById('id')", "Both A and B"], correct: 1 },
    { q: "What does element.textContent = 'Hi' do?", options: ["Adds CSS to the element", "Changes the text inside the element", "Deletes the element", "Creates a new element"], correct: 1 },
    { q: "Which event fires when a user clicks a button?", options: ["'hover'", "'press'", "'click'", "'tap'"], correct: 2 },
    { q: "Which method adds a child element to the DOM?", options: ["addChild()", "insertElement()", "appendChild()", "pushElement()"], correct: 2 },
  ],
  intermediate_3: [
    { q: "How do you define a function in Python?", options: ["function myFunc():", "func myFunc():", "def myFunc():", "define myFunc():"], correct: 2 },
    { q: "What does nums.append(5) do?", options: ["Removes 5 from nums", "Inserts 5 at position 0", "Adds 5 to the end of nums", "Sorts the list"], correct: 2 },
    { q: "What is the output of [x*2 for x in [1,2,3]]?", options: ["[1,2,3]", "[2,4,6]", "[1,4,9]", "Error"], correct: 1 },
    { q: "How do you access value 'Gombe' from {'city':'Gombe'}?", options: ["d.city", "d->city", "d['city']", "d.get.city"], correct: 2 },
    { q: "What does the return keyword do?", options: ["Prints a value", "Ends the program", "Sends a value back from a function", "Repeats the function"], correct: 2 },
  ],
  intermediate_4: [
    { q: "What does API stand for?", options: ["Application Programming Interface", "Automated Program Integration", "App Process Installer", "Advanced Protocol Interface"], correct: 0 },
    { q: "What format does most modern APIs use to send data?", options: ["XML", "CSV", "JSON", "HTML"], correct: 2 },
    { q: "What does await fetch(url) do?", options: ["Immediately returns data", "Waits for the HTTP response before continuing", "Caches the URL locally", "Sends data to a server"], correct: 1 },
    { q: "Which method converts a fetch response to a JS object?", options: ["response.text()", "response.parse()", "response.json()", "response.data()"], correct: 2 },
    { q: "Why use try/catch with fetch?", options: ["It makes fetch faster", "It handles errors like network failures gracefully", "It is required by the browser", "It converts JSON automatically"], correct: 1 },
  ],
  intermediate_5: [
    { q: "What command initialises a new Git repository?", options: ["git start", "git create", "git new", "git init"], correct: 3 },
    { q: "What does git commit -m 'message' do?", options: ["Uploads code to GitHub", "Saves a snapshot of staged changes", "Creates a new branch", "Downloads updates"], correct: 1 },
    { q: "What command uploads your commits to GitHub?", options: ["git upload", "git send", "git push", "git deploy"], correct: 2 },
    { q: "What is a branch in Git?", options: ["A copy of the repo on GitHub", "An independent line of development", "A file inside the repo", "A commit message"], correct: 1 },
    { q: "What does git pull do?", options: ["Deletes the remote repo", "Creates a new branch", "Downloads and merges remote changes", "Reverts the last commit"], correct: 2 },
  ],
  pro_1: [
    { q: "What does JSX stand for in React?", options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extra"], correct: 0 },
    { q: "Which hook stores state in a React component?", options: ["useEffect", "useRef", "useMemo", "useState"], correct: 3 },
    { q: "How do you pass data from a parent to a child component?", options: ["Via state", "Via props", "Via useEffect", "Via context only"], correct: 1 },
    { q: "What triggers a React component to RE-RENDER?", options: ["A CSS change", "A state or prop change", "A comment in the code", "Refreshing the page"], correct: 1 },
    { q: "What is useEffect used for?", options: ["Storing component state", "Running side effects after render", "Creating new components", "Styling components"], correct: 1 },
  ],
  pro_2: [
    { q: "What SQL statement retrieves data from a table?", options: ["GET", "FETCH", "SELECT", "READ"], correct: 2 },
    { q: "What does SELECT * mean in SQL?", options: ["Select no columns", "Select the first column", "Select only numeric columns", "Select all columns"], correct: 3 },
    { q: "Which SQL keyword filters rows?", options: ["FILTER", "WHERE", "HAVING", "MATCH"], correct: 1 },
    { q: "How do you add a new row in SQL?", options: ["ADD INTO", "INSERT INTO", "PUT INTO", "APPEND INTO"], correct: 1 },
    { q: "What does DELETE FROM users WHERE id=3 do?", options: ["Deletes the users table", "Removes all rows", "Removes the row where id equals 3", "Updates id to 3"], correct: 2 },
  ],
  pro_3: [
    { q: "What is O(1) time complexity?", options: ["Grows linearly with n", "Gets slower with more data", "Always takes the same time regardless of input", "Only works for sorted data"], correct: 2 },
    { q: "Which has WORSE performance for large data: O(n) or O(n²)?", options: ["O(n)", "O(n²)", "They are equal", "Depends on the machine"], correct: 1 },
    { q: "What is the key requirement for binary search to work?", options: ["The array must have even length", "The array must be sorted", "The array must have no duplicates", "The array must be small"], correct: 1 },
    { q: "What is the time complexity of bubble sort in the worst case?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correct: 3 },
    { q: "What does O(log n) mean?", options: ["The algorithm never ends", "Performance is constant", "The problem size halves each step", "It runs n times then logs the result"], correct: 2 },
  ],
  pro_4: [
    { q: "Why should you NEVER store plain-text passwords?", options: ["It uses too much storage", "If the database is breached, all passwords are exposed", "Browsers don't support it", "It slows down login"], correct: 1 },
    { q: "What does JWT stand for?", options: ["Java Web Token", "JSON Web Token", "JavaScript Worker Thread", "Joint Web Transfer"], correct: 1 },
    { q: "What is a parameterized query used for?", options: ["Speeding up SQL queries", "Preventing SQL injection attacks", "Sorting database results", "Connecting to a remote database"], correct: 1 },
    { q: "What does OAuth allow a user to do?", options: ["Encrypt their password", "Log in using an existing account like Google", "Create a secure database", "Hash their email"], correct: 1 },
    { q: "What does HTTPS add compared to HTTP?", options: ["Faster loading", "Encryption of data in transit", "A nicer URL", "Server-side caching"], correct: 1 },
  ],
  pro_5: [
    { q: "What happens when you push to GitHub on Vercel/Netlify?", options: ["You must manually redeploy", "Nothing — you need CI/CD tools", "The site auto-deploys", "An email is sent to your team"], correct: 2 },
    { q: "Why should you NEVER commit a .env file to Git?", options: ["It causes merge conflicts", "It slows down deployment", "It contains secret keys that would be exposed publicly", "Git doesn't support .env files"], correct: 2 },
    { q: "What does CI/CD stand for?", options: ["Computer Interface / Code Deploy", "Continuous Integration / Continuous Deployment", "Code Inspection / Code Distribution", "Central Index / Code Directory"], correct: 1 },
    { q: "Which platform is best for hosting a static HTML/CSS website for FREE?", options: ["AWS EC2", "GitHub Pages", "Digital Ocean Droplet", "Heroku paid tier"], correct: 1 },
    { q: "What is a CNAME record used for in DNS?", options: ["Setting the server IP address", "Pointing a subdomain to another domain", "Encrypting your domain", "Registering a new domain"], correct: 1 },
  ],
};

export const CODING_EXAM_QUESTIONS: Record<string, Array<{ id: number; q: string; options: string[]; correct: number }>> = {
  beginner: [
    { id: 0, q: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Personal Unit", "Core Power Utility", "Central Program Updater"], correct: 0 },
    { id: 1, q: "What is 10 in binary?", options: ["0001", "1010", "1100", "0110"], correct: 1 },
    { id: 2, q: "Which HTML tag is a self-closing image tag?", options: ["<image>", "<picture>", "<img />", "<photo />"], correct: 2 },
    { id: 3, q: "Which CSS property changes text colour?", options: ["font-color", "text-color", "foreground", "color"], correct: 3 },
    { id: 4, q: "What does print() do in Python?", options: ["Reads input", "Saves to file", "Displays output to screen", "Creates a variable"], correct: 2 },
    { id: 5, q: "Which Python loop checks a condition BEFORE iterating?", options: ["do-while", "for", "while", "repeat"], correct: 2 },
    { id: 6, q: "What is the purpose of RAM?", options: ["Long-term storage", "Temporary fast memory while computer is on", "Running the display", "Connecting to internet"], correct: 1 },
    { id: 7, q: "Which HTML tag wraps ALL visible page content?", options: ["<head>", "<html>", "<body>", "<main>"], correct: 2 },
    { id: 8, q: "In CSS, what does 'padding' do?", options: ["Space outside the border", "Space inside the border, between content and border", "The border itself", "Shadow around the box"], correct: 1 },
    { id: 9, q: "What does age = age + 1 do in Python?", options: ["Compares age to 1", "Sets age to 1", "Increases age by 1", "Prints age plus 1"], correct: 2 },
  ],
  intermediate: [
    { id: 0, q: "Which keyword in JS prevents reassignment of a variable?", options: ["let", "var", "const", "fixed"], correct: 2 },
    { id: 1, q: "What does document.querySelector('.btn') return?", options: ["All elements with class btn", "The first element with class btn", "An element by ID", "A list of all buttons"], correct: 1 },
    { id: 2, q: "What is JSON primarily used for?", options: ["Styling web pages", "Structuring databases", "Exchanging data between servers and clients", "Writing Python scripts"], correct: 2 },
    { id: 3, q: "In Python, what does a list comprehension do?", options: ["Comprehends Python lists", "Creates a new list using a loop expression in one line", "Copies a list", "Sorts a list"], correct: 1 },
    { id: 4, q: "What does git clone <url> do?", options: ["Creates a new repo", "Downloads a copy of a remote repository", "Merges two branches", "Deletes a remote repo"], correct: 1 },
    { id: 5, q: "What is an event listener?", options: ["A function that runs when a specific event occurs on an element", "A CSS rule for hover effects", "A way to store events in a database", "An HTML attribute for forms"], correct: 0 },
    { id: 6, q: "What does async function mean in JavaScript?", options: ["The function runs in parallel always", "The function can use await inside it", "The function is disabled", "The function only runs once"], correct: 1 },
    { id: 7, q: "What does {} represent in Python?", options: ["A list", "A tuple", "A set or dictionary", "A function block"], correct: 2 },
    { id: 8, q: "Which Git command shows uncommitted changes?", options: ["git log", "git diff", "git status", "git show"], correct: 2 },
    { id: 9, q: "What does element.innerHTML = '<b>Hi</b>' do?", options: ["Displays 'Hi' as plain text", "Displays 'Hi' in bold HTML", "Breaks the element", "Removes the element"], correct: 1 },
  ],
  pro: [
    { id: 0, q: "In React, which hook runs after every render by default?", options: ["useState", "useRef", "useEffect", "useMemo"], correct: 2 },
    { id: 1, q: "What SQL clause is used to group rows with aggregate functions?", options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], correct: 2 },
    { id: 2, q: "What is the time complexity of accessing an element in an array by index?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correct: 3 },
    { id: 3, q: "What does 'salting' a password mean?", options: ["Encrypting it with AES", "Adding random data before hashing to prevent rainbow table attacks", "Storing it in plaintext", "Converting it to base64"], correct: 1 },
    { id: 4, q: "What does Vercel do with your code on git push?", options: ["Archives it", "Emails you a report", "Automatically builds and deploys it", "Only runs tests"], correct: 2 },
    { id: 5, q: "What is a React prop?", options: ["Internal mutable state", "A CSS class for components", "Data passed from parent to child component", "A lifecycle method"], correct: 2 },
    { id: 6, q: "What does SELECT COUNT(*) FROM users return?", options: ["All user data", "The number of rows in users table", "The first user", "An error"], correct: 1 },
    { id: 7, q: "Which sorting algorithm has O(n log n) average complexity?", options: ["Bubble sort", "Insertion sort", "Merge sort", "Selection sort"], correct: 2 },
    { id: 8, q: "What is HTTPS' main security benefit?", options: ["Faster page loads", "Blocks all hackers", "Encrypts data between browser and server", "Hides the URL"], correct: 2 },
    { id: 9, q: "What does CI/CD help development teams do?", options: ["Manually test code", "Automatically test and deploy code changes", "Write better documentation", "Manage Git branches"], correct: 1 },
  ],
};

// ── CYBER QUIZZES ────────────────────────────────────────────────────────────

export const CYBER_LESSON_NOTES: Record<string, { title: string; content: string[] }> = {
  recon_1: {
    title: 'How the Internet Works',
    content: [
      '🌐 The Internet is a global network of computers communicating via TCP/IP protocols.',
      '🔢 Every device has an IP address (e.g., 192.168.1.1). DNS converts domain names (google.com) to IPs.',
      '📡 TCP (Transmission Control Protocol) ensures reliable delivery. UDP is faster but no guarantee.',
      '🚪 Ports are like doors: Port 80 = HTTP, 443 = HTTPS, 22 = SSH, 21 = FTP.',
      '🔄 When you visit a website: Browser → DNS lookup → Server IP → TCP handshake → Data received.',
    ]
  },
  recon_2: {
    title: 'Linux Terminal Basics',
    content: [
      '📁 pwd = print working directory (shows where you are). ls = list files. cd = change directory.',
      '🔐 chmod changes permissions: chmod 755 file. sudo runs as root/administrator.',
      '🌐 netstat shows active network connections and open ports.',
      '📝 cat reads file contents. nano/vim edit files. grep searches inside files.',
      '💡 Linux is the OS of servers, hackers, and systems. Master the terminal = master computing.',
    ]
  },
  recon_3: {
    title: 'Networking Fundamentals',
    content: [
      '📚 OSI Model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.',
      '🌐 HTTP (port 80) = unencrypted web. HTTPS (port 443) = encrypted. SSH (port 22) = secure remote access.',
      '🔥 A firewall filters traffic based on rules — blocks unwanted connections.',
      '🦈 Wireshark captures and analyses network packets in real-time.',
      '🔄 A router connects networks. A switch connects devices within a network (LAN).',
    ]
  },
  recon_4: {
    title: 'OSINT & Reconnaissance',
    content: [
      '🔍 OSINT = Open Source Intelligence. Gathering public information legally.',
      '🌐 Google Dorks use advanced search operators: site:, filetype:, inurl: to find exposed info.',
      '📡 Shodan is a search engine for internet-connected devices — finds exposed cameras, servers, etc.',
      '📧 HaveIBeenPwned checks if your email appeared in a data breach.',
      '🔎 whois looks up domain registration info. nslookup finds DNS records.',
    ]
  },
  recon_5: {
    title: 'Threats, Attacks & Social Engineering',
    content: [
      '🦠 Malware types: Virus (attaches to files), Worm (self-spreads), Trojan (disguised), Ransomware (encrypts files).',
      '🎣 Phishing: fake emails/websites that trick you into giving credentials.',
      '👥 MITM (Man-in-the-Middle): attacker intercepts communication between two parties.',
      '💉 SQL Injection: inserting SQL code into input fields to manipulate databases. e.g., \' OR 1=1 --',
      '🧠 Social Engineering manipulates PEOPLE not systems — the weakest link is always the human.',
    ]
  },
  defence_1: {
    title: 'Cryptography Fundamentals',
    content: [
      '🔑 Symmetric encryption: same key encrypts and decrypts. AES is the standard (AES-256).',
      '🔐 Asymmetric encryption: public key encrypts, private key decrypts. RSA is the standard.',
      '#️⃣ Hashing converts data to a fixed-size string (hash). SHA-256, MD5. One-way — cannot decrypt.',
      '🤝 HTTPS uses TLS (Transport Layer Security) which combines symmetric + asymmetric crypto.',
      '📜 A digital certificate (SSL cert) proves a website\'s identity, issued by a Certificate Authority.',
    ]
  },
  defence_2: {
    title: 'Web Security Basics',
    content: [
      '🔟 OWASP Top 10: most critical web security risks. Includes SQL injection, XSS, broken auth, etc.',
      '📝 XSS (Cross-Site Scripting): injecting malicious scripts into web pages viewed by other users.',
      '🎭 CSRF (Cross-Site Request Forgery): tricks authenticated users into submitting malicious requests.',
      '✅ Input validation: always sanitize and validate user inputs on BOTH client and server side.',
      '🛡️ Content Security Policy (CSP) headers prevent XSS by restricting script sources.',
    ]
  },
  defence_3: {
    title: 'Password Security & Auth',
    content: [
      '🧂 Salting: adding random data to a password BEFORE hashing. Prevents rainbow table attacks.',
      '🔒 bcrypt is the recommended password hashing algorithm — it\'s slow by design.',
      '📱 MFA (Multi-Factor Authentication): something you know + something you have + something you are.',
      '🗝️ Password managers (Bitwarden, 1Password) generate and store strong unique passwords.',
      '⚠️ Never reuse passwords. A breach on one site exposes all accounts using that password.',
    ]
  },
  defence_4: {
    title: 'Network Defence',
    content: [
      '🔍 IDS (Intrusion Detection System) monitors and alerts. IPS (Intrusion Prevention System) blocks attacks.',
      '🌐 VPN (Virtual Private Network) encrypts all traffic and hides your IP address.',
      '🏰 DMZ (Demilitarized Zone): a network segment between the internet and internal network for public servers.',
      '🔒 Network hardening: disable unused ports, update firmware, use strong Wi-Fi encryption (WPA3).',
      '📊 SIEM (Security Information Event Management) aggregates logs for threat detection.',
    ]
  },
  defence_5: {
    title: 'Incident Response',
    content: [
      '📋 IR Lifecycle: Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned.',
      '🔍 Digital Forensics: preserving, collecting, and analysing digital evidence.',
      '🪵 Log analysis: review system, network, and application logs to trace attacker activity.',
      '🔒 Containment: isolate infected systems immediately to prevent spread.',
      '📝 Chain of custody: every piece of evidence must be documented from collection to court.',
    ]
  },
  attack_1: {
    title: 'Ethical Hacking Intro',
    content: [
      '⚖️ Ethical hacking = authorised testing of systems to find vulnerabilities before attackers do.',
      '📋 5 Phases: Reconnaissance → Scanning → Gaining Access → Maintaining Access → Reporting.',
      '📄 Always get written permission (scope document) before testing ANY system.',
      '🎯 Scope defines what you CAN and CANNOT test. Never go out of scope.',
      '🏆 Bug bounty programs: companies pay ethical hackers to find and report vulnerabilities.',
    ]
  },
  attack_2: {
    title: 'Scanning & Enumeration',
    content: [
      '🔍 Nmap scans for open ports and services: nmap -sV -p 1-1000 192.168.1.1',
      '📂 Gobuster brute-forces web directories: gobuster dir -u http://site.com -w wordlist.txt',
      '🌐 Nikto scans web servers for known vulnerabilities and misconfigurations.',
      '🪧 Banner grabbing: connecting to a port to read its service announcement (version info).',
      '📊 Enumeration maps: users, shares, services, software versions — all attack surface info.',
    ]
  },
  attack_3: {
    title: 'Exploitation Basics',
    content: [
      '🔧 Metasploit Framework: tool with pre-built exploits. msfconsole → search → use → set options → run.',
      '📋 CVE (Common Vulnerabilities and Exposures): database of known vulnerabilities. e.g., CVE-2021-44228.',
      '💾 Buffer overflow: sending more data than a program can handle, overwriting memory to run code.',
      '🎯 Payload: the code that runs after exploitation — reverse shell, add user, etc.',
      '⚠️ Only exploit systems you own or have explicit written permission to test.',
    ]
  },
  attack_4: {
    title: 'CTF Strategies',
    content: [
      '🏁 CTF (Capture the Flag): competitions where you find hidden "flags" by exploiting challenges.',
      '📂 CTF categories: Web, Cryptography, Reverse Engineering, Binary Exploitation, Forensics, OSINT.',
      '🔐 BurpSuite: intercepts and modifies HTTP requests. Essential for web challenges.',
      '🔬 Ghidra: free reverse engineering tool from NSA. Decompiles binaries.',
      '🍳 CyberChef: web tool for encoding/decoding, encryption, data analysis.',
    ]
  },
  attack_5: {
    title: 'Report Writing',
    content: [
      '📋 A pentest report has: Executive Summary, Scope, Methodology, Findings, Recommendations.',
      '📊 CVSS (Common Vulnerability Scoring System): scores vulnerabilities 0-10 (Critical, High, Medium, Low, Info).',
      '🎯 Each finding needs: title, severity, description, evidence (screenshots), remediation steps.',
      '👔 Executive Summary is for non-technical stakeholders — no jargon, focus on business risk.',
      '✅ Good report = client can reproduce the finding AND knows exactly how to fix it.',
    ]
  },
};

export const CYBER_QUIZ_QUESTIONS: Record<string, Array<{ q: string; options: string[]; correct: number }>> = {
  recon_1: [
    { q: "What does DNS stand for?", options: ["Data Network System", "Domain Name System", "Direct Network Service", "Digital Name Server"], correct: 1 },
    { q: "Which port does HTTPS use by default?", options: ["80", "21", "443", "8080"], correct: 2 },
    { q: "What protocol ensures RELIABLE data delivery on the internet?", options: ["UDP", "FTP", "TCP", "ICMP"], correct: 2 },
    { q: "What is an IP address?", options: ["A website's name", "A unique numerical address for a device on a network", "An encryption key", "A type of malware"], correct: 1 },
    { q: "Which port does SSH (Secure Shell) use?", options: ["80", "443", "21", "22"], correct: 3 },
  ],
  recon_2: [
    { q: "What does the Linux command pwd do?", options: ["Changes password", "Prints the current working directory", "Lists files", "Gives root access"], correct: 1 },
    { q: "Which command lists files in a directory?", options: ["dir", "ls", "show", "files"], correct: 1 },
    { q: "What does chmod 755 file do?", options: ["Deletes the file", "Encrypts the file", "Sets read/write/execute permissions", "Moves the file to root"], correct: 2 },
    { q: "What is the purpose of sudo in Linux?", options: ["Switch user to another account", "Run a command with administrator (root) privileges", "Show user details", "Scan open ports"], correct: 1 },
    { q: "Which command shows active network connections?", options: ["ifconfig", "ping", "tracert", "netstat"], correct: 3 },
  ],
  recon_3: [
    { q: "How many layers does the OSI model have?", options: ["4", "5", "6", "7"], correct: 3 },
    { q: "Which OSI layer handles IP addressing and routing?", options: ["Layer 2 – Data Link", "Layer 3 – Network", "Layer 4 – Transport", "Layer 5 – Session"], correct: 1 },
    { q: "What does a firewall primarily do?", options: ["Speeds up internet", "Filters network traffic based on rules", "Encrypts all data", "Assigns IP addresses"], correct: 1 },
    { q: "What is Wireshark used for?", options: ["Scanning for malware", "Cracking passwords", "Capturing and analysing network packets", "Brute-forcing logins"], correct: 2 },
    { q: "Which protocol provides ENCRYPTED remote access to a server?", options: ["FTP", "Telnet", "HTTP", "SSH"], correct: 3 },
  ],
  recon_4: [
    { q: "What does OSINT stand for?", options: ["Online Security Intelligence Network Tool", "Open Source Intelligence", "Offensive Security Internet Technique", "Operational System Information Tracker"], correct: 1 },
    { q: "What is Shodan?", options: ["A hacking tool that cracks passwords", "A search engine for internet-connected devices", "A Linux distribution for hackers", "A firewall bypass tool"], correct: 1 },
    { q: "Which Google dork finds files of a specific type?", options: ["site:", "inurl:", "filetype:", "cache:"], correct: 2 },
    { q: "What does whois look up?", options: ["Open ports on a server", "Domain registration information", "Malware signatures", "Wi-Fi passwords"], correct: 1 },
    { q: "HaveIBeenPwned is used to check if your…", options: ["Password is strong enough", "IP has been scanned", "Email appeared in a data breach", "Browser has been hijacked"], correct: 2 },
  ],
  recon_5: [
    { q: "Which malware encrypts your files and demands payment?", options: ["Trojan", "Worm", "Ransomware", "Spyware"], correct: 2 },
    { q: "What is a Man-in-the-Middle (MITM) attack?", options: ["Two hackers sharing a target", "Attacker intercepts communication between two parties", "Flooding a server with traffic", "Installing malware via USB"], correct: 1 },
    { q: "Which attack type manipulates PEOPLE rather than systems?", options: ["SQL injection", "Buffer overflow", "Social engineering", "Port scanning"], correct: 2 },
    { q: "What does a SQL injection attack target?", options: ["Network firewalls", "Email servers", "Database queries via input fields", "Operating system kernels"], correct: 2 },
    { q: "A phishing email typically aims to…", options: ["Scan your network", "Trick you into revealing credentials or clicking malicious links", "Encrypt your hard drive directly", "Crash your browser"], correct: 1 },
  ],
  defence_1: [
    { q: "Which encryption standard is used for symmetric encryption today?", options: ["DES", "MD5", "AES", "RSA"], correct: 2 },
    { q: "In asymmetric encryption, what encrypts the data?", options: ["The private key", "The session key", "The public key", "The hash"], correct: 2 },
    { q: "What is a hash function?", options: ["A function that encrypts and decrypts data", "A one-way function that converts data to a fixed-size string", "An asymmetric key generator", "A network packet filter"], correct: 1 },
    { q: "What does TLS provide in HTTPS?", options: ["Faster page loading", "IP address masking", "Encrypted communication between browser and server", "User authentication only"], correct: 2 },
    { q: "Which hashing algorithm is currently recommended for security use?", options: ["MD5", "SHA-1", "SHA-256", "CRC32"], correct: 2 },
  ],
  defence_2: [
    { q: "What does XSS stand for in web security?", options: ["Cross-Site Scripting", "Cross-Server Storage", "Extended Security System", "XML Style Syntax"], correct: 0 },
    { q: "What does CSRF attack force an authenticated user to do?", options: ["Download malware", "Submit unintended malicious requests", "Change their password", "Log out of their session"], correct: 1 },
    { q: "OWASP stands for…", options: ["Online Web App Security Protocol", "Open Web Application Security Project", "Offensive Web Attack Simulation Platform", "Open Worldwide Access Security Policy"], correct: 1 },
    { q: "Why must input validation happen on the SERVER side?", options: ["Client-side is too slow", "Browsers can't validate input", "Attackers can bypass client-side validation", "Server validation is optional"], correct: 2 },
    { q: "What does a Content Security Policy (CSP) header help prevent?", options: ["CSRF attacks", "DDoS attacks", "XSS attacks", "SQL injection"], correct: 2 },
  ],
  defence_3: [
    { q: "What is 'salting' in password security?", options: ["Encrypting a password with AES", "Adding random data to a password before hashing", "Storing the password in base64", "Using the same hash for all passwords"], correct: 1 },
    { q: "Why is bcrypt recommended for password hashing?", options: ["It's the fastest algorithm", "It produces shorter hashes", "It's intentionally slow, making brute force harder", "It uses asymmetric encryption"], correct: 2 },
    { q: "What does MFA stand for?", options: ["Multiple File Access", "Multi-Factor Authentication", "Managed Firewall Application", "Modular Function Array"], correct: 1 },
    { q: "What is a rainbow table attack?", options: ["Guessing passwords letter by letter", "Using pre-computed hash-to-password tables to crack hashes", "Flooding a server with login requests", "Stealing a password in transit"], correct: 1 },
    { q: "Why should you use unique passwords for every site?", options: ["Websites require it", "It makes passwords easier to remember", "A breach on one site won't expose your other accounts", "Reused passwords expire faster"], correct: 2 },
  ],
  defence_4: [
    { q: "What is the difference between IDS and IPS?", options: ["IDS blocks, IPS only alerts", "IDS only alerts, IPS actively blocks", "They are the same thing", "IDS is for networks, IPS for hosts only"], correct: 1 },
    { q: "What is a VPN primarily used for?", options: ["Speed up internet connection", "Encrypt traffic and hide your IP address", "Block malware downloads", "Scan for open ports"], correct: 1 },
    { q: "What is a DMZ (Demilitarized Zone)?", options: ["A region blocked by government firewalls", "A network segment for public-facing servers, isolated from internal network", "A type of malware", "A Wi-Fi dead zone"], correct: 1 },
    { q: "Which Wi-Fi encryption standard is most secure today?", options: ["WEP", "WPA", "WPA2", "WPA3"], correct: 3 },
    { q: "What does network hardening involve?", options: ["Making cables stronger", "Disabling unnecessary services and securing configurations", "Upgrading to faster routers", "Blocking social media sites"], correct: 1 },
  ],
  defence_5: [
    { q: "What is the FIRST step of the Incident Response lifecycle?", options: ["Containment", "Identification", "Preparation", "Recovery"], correct: 2 },
    { q: "What is the goal of the CONTAINMENT phase?", options: ["Remove the threat permanently", "Restore normal operations", "Prevent the incident from spreading further", "Document findings"], correct: 2 },
    { q: "What does digital forensics involve?", options: ["Building firewalls", "Collecting and analysing digital evidence", "Writing malware to catch attackers", "Patching vulnerabilities"], correct: 1 },
    { q: "What is 'chain of custody' in incident response?", options: ["The hacker's attack path", "Documenting handling of evidence from collection to court", "The sequence of firewall rules", "A list of compromised accounts"], correct: 1 },
    { q: "Log analysis helps security teams to…", options: ["Speed up their servers", "Trace attacker activity and identify affected systems", "Encrypt communications", "Block phishing emails"], correct: 1 },
  ],
  attack_1: [
    { q: "What is the FIRST phase of an ethical hacking engagement?", options: ["Exploitation", "Scanning", "Reconnaissance", "Reporting"], correct: 2 },
    { q: "What MUST you have before legally testing any system?", options: ["A Kali Linux installation", "A fast internet connection", "Written authorisation from the owner", "Administrator credentials"], correct: 2 },
    { q: "What is a bug bounty program?", options: ["A reward for fastest coding", "A program that pays ethical hackers to find and report vulnerabilities", "A government cybercrime unit", "An antivirus subscription"], correct: 1 },
    { q: "What does 'scope' define in a penetration test?", options: ["The attack tools to be used", "What systems and actions are authorised during testing", "The attacker's location", "The budget for the test"], correct: 1 },
    { q: "What happens in the POST-EXPLOITATION phase?", options: ["Initial system access is gained", "Open ports are discovered", "Maintaining access and gathering data after compromise", "The final report is submitted"], correct: 2 },
  ],
  attack_2: [
    { q: "What is Nmap primarily used for?", options: ["Password cracking", "Web directory brute forcing", "Port scanning and service detection", "Packet injection"], correct: 2 },
    { q: "What does Gobuster do?", options: ["Scans for malware on a system", "Brute-forces web directories and files", "Intercepts HTTP requests", "Cracks WPA2 passwords"], correct: 1 },
    { q: "What is banner grabbing used for?", options: ["Stealing login credentials", "Reading service version information from an open port", "Bypassing firewalls", "Injecting SQL code"], correct: 1 },
    { q: "Which Nmap flag detects service versions?", options: ["-p", "-A", "-sV", "-O"], correct: 2 },
    { q: "What does Nikto scan for?", options: ["Open Wi-Fi networks", "SQL injection points only", "Known vulnerabilities and misconfigurations in web servers", "Bluetooth devices"], correct: 2 },
  ],
  attack_3: [
    { q: "What is Metasploit?", options: ["A network monitoring tool", "A framework with pre-built exploits for penetration testing", "A password manager", "A web application firewall"], correct: 1 },
    { q: "What does CVE stand for?", options: ["Cyber Vulnerability Engine", "Common Vulnerabilities and Exposures", "Critical Virus Exploitation", "Computer Verification Engine"], correct: 1 },
    { q: "What is a buffer overflow attack?", options: ["Sending too many login requests", "Flooding a network with traffic", "Writing more data than a buffer can hold to overwrite memory", "Injecting scripts into a database"], correct: 2 },
    { q: "What is a 'payload' in hacking?", options: ["The vulnerable software", "The scanner used to find open ports", "The code that runs on the target after exploitation", "The attack report"], correct: 2 },
    { q: "Which file in Metasploit stores found credentials?", options: ["loot", "creds", "exploit", "sessions"], correct: 1 },
  ],
  attack_4: [
    { q: "CTF stands for…", options: ["Cyber Threat Framework", "Capture the Flag", "Central Task Force", "Code Test Function"], correct: 1 },
    { q: "What is BurpSuite used for?", options: ["Password cracking", "Intercepting and modifying HTTP requests", "Network packet analysis", "Port scanning"], correct: 1 },
    { q: "Which tool is used for reverse engineering binaries?", options: ["Wireshark", "Nmap", "Ghidra", "BurpSuite"], correct: 2 },
    { q: "What is CyberChef known as?", options: ["The Cyber Swiss Army Knife — encodes, decodes, and analyses data", "A network scanner", "A password cracker", "A malware analysis sandbox"], correct: 0 },
    { q: "Which CTF category involves breaking encryption and ciphers?", options: ["Web", "Forensics", "Binary Exploitation", "Cryptography"], correct: 3 },
  ],
  attack_5: [
    { q: "What does CVSS measure?", options: ["Network speed", "Vulnerability severity on a scale of 0–10", "Number of affected users", "Cost of a data breach"], correct: 1 },
    { q: "Which section of a pentest report is written for NON-TECHNICAL executives?", options: ["Technical Findings", "Appendix", "Executive Summary", "Methodology"], correct: 2 },
    { q: "A finding rated 9.8 on CVSS is…", options: ["Informational", "Medium", "High", "Critical"], correct: 3 },
    { q: "What must EVERY finding in a pentest report include?", options: ["Source code of the exploit", "A CVSS calculator link", "Description, evidence, and remediation steps", "A list of all CVEs ever found"], correct: 2 },
    { q: "What is the purpose of the scope section in a pentest report?", options: ["Explain the tools used", "Define what was and was not tested", "List all employees interviewed", "Show the final invoice"], correct: 1 },
  ],
};

export const CYBER_EXAM_QUESTIONS: Record<string, Array<{ id: number; q: string; options: string[]; correct: number }>> = {
  recon: [
    { id: 0, q: "Which layer of the OSI model handles IP addressing?", options: ["Layer 1", "Layer 2", "Layer 3", "Layer 4"], correct: 2 },
    { id: 1, q: "What port does HTTP use?", options: ["443", "22", "21", "80"], correct: 3 },
    { id: 2, q: "What command displays the current directory in Linux?", options: ["ls", "cd", "pwd", "dir"], correct: 2 },
    { id: 3, q: "Wireshark is a tool for…", options: ["Cracking passwords", "Capturing network packets", "Scanning ports", "Social engineering"], correct: 1 },
    { id: 4, q: "OSINT stands for…", options: ["Offensive System Intelligence", "Open Source Intelligence", "Online Security Internet Tool", "Operational Signal Interface"], correct: 1 },
    { id: 5, q: "Which Google Dork finds pages on a specific website?", options: ["filetype:", "inurl:", "site:", "cache:"], correct: 2 },
    { id: 6, q: "A trojan is malware that…", options: ["Self-replicates across networks", "Encrypts your files for ransom", "Disguises itself as legitimate software", "Monitors keystrokes only"], correct: 2 },
    { id: 7, q: "What does netstat show?", options: ["File permissions", "Active network connections and open ports", "Running processes", "DNS records"], correct: 1 },
    { id: 8, q: "Phishing attacks primarily target…", options: ["Server vulnerabilities", "Network infrastructure", "Human psychology to steal credentials", "Operating system bugs"], correct: 2 },
    { id: 9, q: "What does chmod 777 do to a file?", options: ["Deletes it", "Makes it hidden", "Gives full read/write/execute to all users", "Encrypts it"], correct: 2 },
  ],
  defence: [
    { id: 0, q: "Which is a SYMMETRIC encryption algorithm?", options: ["RSA", "ECC", "AES", "Diffie-Hellman"], correct: 2 },
    { id: 1, q: "XSS attacks inject malicious…", options: ["SQL queries", "Network packets", "Scripts into web pages", "Binary exploits"], correct: 2 },
    { id: 2, q: "What does MFA protect against?", options: ["DDoS attacks", "Network packet sniffing", "Compromised password attacks", "SQL injection"], correct: 2 },
    { id: 3, q: "What does an IPS do that an IDS does not?", options: ["Monitors traffic", "Generates alerts", "Actively blocks threats", "Logs events"], correct: 2 },
    { id: 4, q: "The FIRST step of incident response is…", options: ["Containment", "Eradication", "Recovery", "Preparation"], correct: 3 },
    { id: 5, q: "Salting a password before hashing prevents…", options: ["CSRF attacks", "Rainbow table attacks", "Port scanning", "Man-in-the-middle attacks"], correct: 1 },
    { id: 6, q: "What does a VPN do?", options: ["Speeds up internet", "Blocks all malware", "Encrypts traffic and masks your IP", "Replaces antivirus"], correct: 2 },
    { id: 7, q: "CSRF forces an authenticated user to…", options: ["Download malware", "Log out", "Submit unintended requests", "Change DNS settings"], correct: 2 },
    { id: 8, q: "SHA-256 is an example of a…", options: ["Symmetric cipher", "Hashing algorithm", "Asymmetric algorithm", "Key exchange protocol"], correct: 1 },
    { id: 9, q: "A DMZ is used to…", options: ["Block VPN traffic", "Isolate public-facing servers from internal network", "Store backups offsite", "Monitor employee activity"], correct: 1 },
  ],
  attack: [
    { id: 0, q: "What is Nmap primarily used for?", options: ["Web exploitation", "Password cracking", "Port scanning and service detection", "Wireless hacking"], correct: 2 },
    { id: 1, q: "A CVE number identifies a…", options: ["Hacking tool", "Known public vulnerability", "CTF challenge", "Type of malware"], correct: 1 },
    { id: 2, q: "Metasploit is a…", options: ["Network monitor", "Password manager", "Penetration testing framework", "Antivirus tool"], correct: 2 },
    { id: 3, q: "BurpSuite is used for…", options: ["Binary analysis", "Web request interception and modification", "Port scanning", "Log analysis"], correct: 1 },
    { id: 4, q: "What does a pentest report's executive summary focus on?", options: ["Technical exploit details", "Business risk in non-technical language", "Tool versions used", "CVE numbers"], correct: 1 },
    { id: 5, q: "Buffer overflow attacks exploit…", options: ["Weak passwords", "Open ports", "Memory handling errors in programs", "SQL databases"], correct: 2 },
    { id: 6, q: "Which CVSS score range is 'Critical'?", options: ["0.1–3.9", "4.0–6.9", "7.0–8.9", "9.0–10.0"], correct: 3 },
    { id: 7, q: "What does Gobuster brute force?", options: ["Login passwords", "Encryption keys", "Web directories and files", "SSH keys"], correct: 2 },
    { id: 8, q: "CTF competitions train skills through…", options: ["Theory only", "Real-world hacking of companies", "Solving security challenges to find hidden flags", "Reading textbooks"], correct: 2 },
    { id: 9, q: "The LAST phase of ethical hacking is…", options: ["Reconnaissance", "Exploitation", "Maintaining Access", "Reporting"], correct: 3 },
  ],
};

// Legacy exports kept for backward compatibility
export const MOCK_QUIZ_QUESTIONS = CODING_QUIZ_QUESTIONS['beginner_1'];
export const MOCK_EXAM_QUESTIONS = CODING_EXAM_QUESTIONS['beginner'];
