# 🚀 Playwright API Automation for Alpha Vantage  

This project automates the validation of **Alpha Vantage APIs** using [Playwright](https://playwright.dev/) with **TypeScript**.  

## 📌 APIs Covered  
1️⃣ **Stock Time Series Data API (`TIME_SERIES_DAILY`)**  
   - Provides **daily stock price data** (open, high, low, close, volume) for a given stock symbol.  

2️⃣ **Currency Exchange Rate API (`CURRENCY_EXCHANGE_RATE`)**  
   - Provides **real-time exchange rate data** between two currencies.  

The automation includes:  
✔ API response validation (structure & data)  
✔ Positive & negative test scenarios  
✔ Security headers

✔ Automated execution with **HTML reporting**

---

## 🔑 How to Get an API Key  

1. **Sign up** at [Alpha Vantage](https://www.alphavantage.co/support/#api-key).  
2. Generate a **free API key** from the dashboard.  
3. **Set your API key** in the `.env` file or set it in `config/env.ts` file:  
   ```
   ALPHA_VANTAGE_API_KEY=your_api_key_here
   ```

---

## 📂 Project Structure  

```
📦 playwright-api-automation
│── 📂 tests                            # Playwright test cases
│   │── stockTimeSeriesAPI.test.ts      # Tests for TIME_SERIES_DAILY API
│   │── currencyExchangeRate.test.ts    # Tests for CURRENCY_EXCHANGE_RATE API
│
│── 📂 utils                            # Helper functions
│   │── apiClient.ts                    # API request functions
|
│── 📂 config                           # Environment configurations
│   │── env.ts                          # Env configs
│
│── 📄 .env                             # Environment variables (API keys)
│── 📄 playwright.config.ts             # Playwright configuration
│── 📄 README.md                        # Project documentation
│── 📄 package-lock.json                # Ensures consistent dependency versions across environments
│── 📄 package.json                     # Project dependencies
```

---

## 🛠 Setup & Installation  

1️⃣ **Clone the repository**  
```sh
git clone https://github.com/binoy-d-shah/playwright-alphavantage-api-tests.git
cd playwright-alphavantage-api-tests
```

2️⃣ **Install dependencies**  
```sh
npm install
```

3️⃣ **Set up environment variables**  
Create a `.env` file and add your **API key**:  
```sh
ALPHA_VANTAGE_API_KEY=your_api_key_here
```

4️⃣ **Verify installation**  
Run Playwright setup to ensure required browsers are installed:  
```sh
npx playwright install
```

---

## ▶ How to Run Tests  

### ✅ **Run all tests**  
```sh
npx playwright test
```

### ✅ **Run a specific test file**  
```sh
npx playwright test tests/currencyExchangeRate.test.ts
```

### ✅ **Run tests with UI mode**  
```sh
npx playwright test --ui
```

---

## 📊 View HTML Report  

After test execution, generate and view an **interactive HTML report**:  

1️⃣ **Run tests and generate report**  
```sh
npx playwright test --reporter=html
```

2️⃣ **Open the report**  
```sh
npx playwright show-report
```

---

## 🚀 CI/CD Integration  

You can integrate Playwright tests with **GitHub Actions** for automated execution.  

Example **GitHub Actions workflow** (`.github/workflows/playwright.yml`):  
```yml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install dependencies
        run: npm install

      - name: Run Playwright tests
        run: npx playwright test

      - name: Generate Report
        run: npx playwright test --reporter=html
```

---

## 📌 Additional Features  
✔ **TypeScript Support** – Ensures type safety and better code organization.  
✔ **Environment Variables** – API keys are stored securely in `.env` files.  
✔ **Validation Helpers** – Common assertions are reusable across tests.  
✔ **Modular API Client** – Ensures separation of concerns between tests and API calls.  
✔ **Parallel Execution** – Playwright runs tests concurrently for faster execution.  

---

## 🤝 Contributing  

👥 Contributions are welcome! If you find an issue or want to improve the tests, feel free to open a **pull request**.  

📧 **For queries, contact:** binoy.d.shah@gmail.com  

---

## 📜 License  

This project is **MIT licensed**. Feel free to use and modify as needed!  
