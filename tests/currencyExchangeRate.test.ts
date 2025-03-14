import { test, expect } from "@playwright/test";
import { fetchExchangeRate, fetchExchangeRateWithoutApiKey } from "../utils/apiClient";

/**
 * Test suite for CURRENCY_EXCHANGE_RATE API.
 */

test.describe("Foreign Exchange Rates (FX) APIs - Alpha Vantage", () => {

    const BASE_CURRENCY = "USD";
    const BASE_CURRENCY_NAME = "United States Dollar";
    const TARGET_CURRENCY = "EUR";
    const TARGET_CURRENCY_NAME = "Euro";
    const INVALID_CURRENCY = "XYZ";

    test("TC-01: Ensure API returns correct exchange rate for valid currencies", async () => {
        
        const response = await fetchExchangeRate(BASE_CURRENCY, TARGET_CURRENCY);
        expect(response.status()).toBe(200);
    
        const responseBody = await response.json();
        const rateData = responseBody["Realtime Currency Exchange Rate"];

        // Verify currency meta data values
        validateCurrencyMetadata(rateData, BASE_CURRENCY, BASE_CURRENCY_NAME, TARGET_CURRENCY, TARGET_CURRENCY_NAME);

        // Validate Exchange Rate, Bid, and Ask Prices
        validateExchangeRates(rateData);

        // Fetch all response headers
        const headers = response.headers();
        const expectedHeaders = {
            "x-frame-options": /(DENY|SAMEORIGIN)/, // Protects against Clickjacking
            "x-content-type-options": "nosniff", // Prevents MIME-type sniffing
        };

        // Check each expected security header
        for (const [header, expectedValue] of Object.entries(expectedHeaders)) {
            expect(headers).toHaveProperty(header);

            if (expectedValue instanceof RegExp) {
                expect(headers[header]).toMatch(expectedValue);
            } else {
                expect(headers[header]).toBe(expectedValue);
            }
        }
    });

    test("TC-02: Ensure API returns data for various valid currency pairs", async () => {
        
        let BASE_CURRENCY = "GBP";
        let TARGET_CURRENCY = "JPY";
        let BASE_CURRENCY_NAME = "British Pound Sterling";
        let TARGET_CURRENCY_NAME = "Japanese Yen";
        
        const response = await fetchExchangeRate(BASE_CURRENCY, TARGET_CURRENCY);
        expect(response.status()).toBe(200);
    
        const responseBody = await response.json();
        const rateData = responseBody["Realtime Currency Exchange Rate"];

        // Verify currency meta data values
        validateCurrencyMetadata(rateData, BASE_CURRENCY, BASE_CURRENCY_NAME, TARGET_CURRENCY, TARGET_CURRENCY_NAME);

        // Validate Exchange Rate, Bid, and Ask Prices
        validateExchangeRates(rateData);
    });

    test("TC-03: Ensure API returns expected output when from_currency and to_currency are the same", async () => {
        
        let TARGET_CURRENCY = "USD";
        let TARGET_CURRENCY_NAME = "United States Dollar";
        
        const response = await fetchExchangeRate(BASE_CURRENCY, TARGET_CURRENCY);
        expect(response.status()).toBe(200);
    
        const responseBody = await response.json();
        const rateData = responseBody["Realtime Currency Exchange Rate"];

        // Verify currency meta data values
        validateCurrencyMetadata(rateData, BASE_CURRENCY, BASE_CURRENCY_NAME, TARGET_CURRENCY, TARGET_CURRENCY_NAME);

        // Validate Exchange Rate, Bid, and Ask Prices
        validateExchangeRatesForSameCurrency(rateData);
    });

    test("TC-04: Ensure API responds correctly if currency codes are lowercase or mixed case", async () => {
        
        let BASE_CURRENCY = "uSd";
        let TARGET_CURRENCY = "EuR";
        let BASE_CURRENCY_NAME = "United States Dollar";
        let TARGET_CURRENCY_NAME = "Euro";
        
        const response = await fetchExchangeRate(BASE_CURRENCY, TARGET_CURRENCY);
        expect(response.status()).toBe(200);
    
        const responseBody = await response.json();
        const rateData = responseBody["Realtime Currency Exchange Rate"];

        // Verify currency meta data values
        validateCurrencyMetadata(rateData, BASE_CURRENCY, BASE_CURRENCY_NAME, TARGET_CURRENCY, TARGET_CURRENCY_NAME);

        // Validate Exchange Rate, Bid, and Ask Prices
        validateExchangeRates(rateData);
    });

    test("TC-05: Check response when an invalid currency code is provided", async () => {
        
        const response = await fetchExchangeRate(INVALID_CURRENCY, TARGET_CURRENCY);
        expect(response.status()).toBe(200);
    
        const responseBody = await response.json();
        
        // Validate Error Message
        const errorMessage = responseBody["Error Message"];
        expect(errorMessage).toContain("Invalid API call.");
    });

    test("TC-06: Check behavior when API key is missing", async () => {
        const response = await fetchExchangeRateWithoutApiKey(INVALID_CURRENCY, TARGET_CURRENCY);
        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        // Validate Error Message
        const errorMessage = responseBody["Error Message"];
        expect(errorMessage).toContain("the parameter apikey is invalid or missing.");
    });

    // Helper function to validate currenty meta data
    function validateCurrencyMetadata(rateData: any, fromCurrency: string, fromCurrencyName: string, toCurrency: string, toCurrencyName: string) {
        expect(rateData["1. From_Currency Code"]).toBe(fromCurrency.toUpperCase());
        expect(rateData["2. From_Currency Name"]).toBe(fromCurrencyName);
        expect(rateData["3. To_Currency Code"]).toBe(toCurrency.toUpperCase());
        expect(rateData["4. To_Currency Name"]).toBe(toCurrencyName);
    }

    // Helper function to validate exchange rates
    function validateExchangeRates(rateData: any) {
        const exchangeRate = parseFloat(rateData["5. Exchange Rate"]);
        const bidPrice = parseFloat(rateData["8. Bid Price"]);
        const askPrice = parseFloat(rateData["9. Ask Price"]);
    
        // Exchange rate, Bid price, Ask price should be positive
        expect(exchangeRate).toBeGreaterThan(0);
        expect(bidPrice).toBeGreaterThan(0);
        expect(askPrice).toBeGreaterThan(0);
        // Bid <= Exchange Rate
        expect(bidPrice).toBeLessThanOrEqual(exchangeRate);
         // Ask >= Exchange Rate
        expect(askPrice).toBeGreaterThanOrEqual(exchangeRate);
    }

    // Helper function to validate exchange rates for same currency
    function validateExchangeRatesForSameCurrency(rateData: any) {
        const exchangeRate = parseFloat(rateData["5. Exchange Rate"]);
        const bidPrice = parseFloat(rateData["8. Bid Price"]);
        const askPrice = parseFloat(rateData["9. Ask Price"]);
    
        // Exchange rate, Bid price, Ask price should be positive
        expect(exchangeRate).toBe(1);
        expect(bidPrice).toBeGreaterThan(0);
        expect(askPrice).toBeGreaterThan(0);
        // Bid <= Exchange Rate
        expect(bidPrice).toBeLessThanOrEqual(exchangeRate);
         // Ask >= Exchange Rate
        expect(askPrice).toBeGreaterThanOrEqual(exchangeRate);
    }
    
});