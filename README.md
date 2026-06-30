# 🚀 Demo Creation Pipelines

This project is a self-service demo generator. It makes it incredibly easy for anyone on the team to run automated tests against web and mobile applications to instantly populate their BrowserStack Dashboards with rich, impressive test data for customer demos!

## 🧪 Testing Pillars

Our testing framework is powered by **WebdriverIO** and focuses on two core areas:

- **🎨 Percy (Visual Testing):** Checks how things **look**. It takes snapshots of apps and compares them to Figma designs to catch visual glitches. It uses AI to ignore unimportant dynamic differences (like a live clock) so we don't get false alarms.
- **⚙️ End-to-End (Functional Testing):** Checks how things **work**. It acts like a real user clicking through the app. It automatically populates the dashboard with network logs, Lighthouse performance audits, and uses AI-powered failure analysis and self-healing.

---

## 📁 Project Structure

To keep everything clean and scalable, the framework is strictly divided by platform and testing type. **Please ensure your test scripts and Page Objects are placed in their respective directories:**

```text
📦 gh-actions-demo-creation
 ┣ 📂 config/                  # WebdriverIO configurations (shared, web, android, ios)
 ┗ 📂 test/
   ┣ 📂 pageobjects/           # Page Object Model (POM) classes
   ┃ ┣ 📂 web/                 # Web locators and methods
   ┃ ┗ 📂 mobile/              # Android and iOS locators
   ┗ 📂 specs/                 # Test script execution files
     ┣ 📂 e2e-web/             # Functional web user journeys
     ┣ 📂 e2e-mobile/          # Functional mobile app user journeys (Android/iOS)
     ┣ 📂 percy-web/           # Visual testing scripts for web
     ┗ 📂 percy-mobile/        # Visual testing scripts for mobile

```

---

## ⚙️ Prerequisites & Setup

1. **Install Node.js:** Ensure you have Node.js (v18+) installed on your machine.
2. **Clone the Repository:** Clone this project to your local machine.
3. **Install Dependencies:** Run the following command in the root folder to install all required packages:

```bash
npm install

```

### Authentication

Before running any tests, you must authenticate with BrowserStack. You can pass your credentials directly in your terminal command.

_Get your credentials from the [BrowserStack Account Settings](https://www.browserstack.com/accounts/profile/details)._

---

## 🚀 Running the Tests

We have pre-configured `npm` scripts to target specific environments and testing types. Replace `YOUR_USERNAME` and `YOUR_ACCESS_KEY` with your actual BrowserStack credentials.

### 1. Functional E2E Web

Executes functional test journeys against web browsers.
**Mac/Linux:**

```bash
BROWSERSTACK_USERNAME="YOUR_USERNAME" BROWSERSTACK_ACCESS_KEY="YOUR_ACCESS_KEY" npm run wdio:web

```

**Windows:**

```powershell
$env:BROWSERSTACK_USERNAME="YOUR_USERNAME"; $env:BROWSERSTACK_ACCESS_KEY="YOUR_ACCESS_KEY"; npm run wdio:web

```

### 2. Functional E2E Mobile (Android & iOS)

Executes functional app journeys on real mobile devices.

```bash
# For Android
BROWSERSTACK_USERNAME="YOUR_USERNAME" BROWSERSTACK_ACCESS_KEY="YOUR_ACCESS_KEY" npm run wdio:android

# For iOS
BROWSERSTACK_USERNAME="YOUR_USERNAME" BROWSERSTACK_ACCESS_KEY="YOUR_ACCESS_KEY" npm run wdio:ios

```

### 3. Percy Visual Web

Executes WebdriverIO tests wrapped in Percy to capture visual snapshots.

```bash
# Note: You will also need a PERCY_TOKEN exported for this to work!
BROWSERSTACK_USERNAME="YOUR_USERNAME" BROWSERSTACK_ACCESS_KEY="YOUR_ACCESS_KEY" PERCY_TOKEN="YOUR_PERCY_TOKEN" npm run percy:web

```

---

## 📝 Writing New Tests

When contributing to this framework, please follow these guidelines:

1. **Use Page Objects:** Keep locators out of the spec files. Define them in the `test/pageobjects/` folders.
2. **Keep it Platform-Specific:** Never mix web locators with mobile locators.
3. **Use Descriptive Names:** Ensure your `describe()` and `it()` blocks to clearly explain what the test is demonstrating (e.g., "should simulate an image upload and monitor app performance"), as this text shows up directly on the BrowserStack demo dashboards!
