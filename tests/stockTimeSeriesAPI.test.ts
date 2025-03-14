import { test, expect } from "@playwright/test";
import { fetchStockData, fetchStockDataWithoutApiKey } from "../utils/apiClient";


/**
 * Test suite for TIME_SERIES_DAILY API.
 */

test.describe("Time Series Stock Data APIs - Alpha Vantage", () => {

    test("TC-01: Ensure API returns correct stock data for a valid symbol", async () => {

        const start = Date.now();

        const response = await fetchStockData("IBM");
        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        // Validate Meta Data
        const metaData = responseBody["Meta Data"];
        validateMetaData(metaData, "IBM");

        // Validate Time Series Data
        const timeSeries = responseBody["Time Series (Daily)"];
        const lastRefreshed = metaData["3. Last Refreshed"];
        validateTimeSeriesData(timeSeries, lastRefreshed);

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

    test("TC-02: Ensure API returns data for various valid stock symbols", async () => {
        const response = await fetchStockData("AAPL");
        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        // Validate Meta Data
        const metaData = responseBody["Meta Data"];
        validateMetaData(metaData, "AAPL");

        // Validate Time Series Data
        const timeSeries = responseBody["Time Series (Daily)"];
        const lastRefreshed = metaData["3. Last Refreshed"];
        validateTimeSeriesData(timeSeries, lastRefreshed);
    });

    test("TC-03: Validate Case Insensitivity in Symbol Parameter", async () => {
        const response = await fetchStockData("ibm");
        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        // Validate Meta Data
        const metaData = responseBody["Meta Data"];
        validateMetaData(metaData, "ibm");

        // Validate Time Series Data
        const timeSeries = responseBody["Time Series (Daily)"];
        const lastRefreshed = metaData["3. Last Refreshed"];
        validateTimeSeriesData(timeSeries, lastRefreshed);
    });

    test("TC-04: Validate Response with Additional Optional Parameters", async () => {
        const response = await fetchStockData("GOOGL", "full");
        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        // Validate Meta Data
        const metaData = responseBody["Meta Data"];
        validateMetaData(metaData, "GOOGL", "Full size");

        // Validate Time Series Data
        const timeSeries = responseBody["Time Series (Daily)"];
        const lastRefreshed = metaData["3. Last Refreshed"];
        validateTimeSeriesData(timeSeries, lastRefreshed);
    });

    test("TC-05: Check response when an invalid stock symbol is provided", async () => {
        const response = await fetchStockData("INVALID123");
        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        // Validate Error Message
        const errorMessage = responseBody["Error Message"];
        expect(errorMessage).toContain("Invalid API call.");
    });

    test("TC-06: Check behavior when API key is missing", async () => {
        const response = await fetchStockDataWithoutApiKey("IBM");
        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        // Validate Error Message
        const errorMessage = responseBody["Error Message"];
        expect(errorMessage).toContain("the parameter apikey is invalid or missing.");
    });

    // Helper function to validate Meta Data
    function validateMetaData(metaData: any, expectedSymbol: string, outputsize: string = "Compact") {
        expect(metaData["1. Information"]).toBe("Daily Prices (open, high, low, close) and Volumes");
        expect(metaData["2. Symbol"]).toBe(expectedSymbol);
        expect(metaData["4. Output Size"]).toBe(outputsize);
        expect(metaData["5. Time Zone"]).toMatch("US/Eastern");
    }

    // Helper function to validate Time Series Data
    function validateTimeSeriesData(timeSeries: any, lastRefreshed: string) {
        expect(timeSeries).toHaveProperty(lastRefreshed);

        const latestData = timeSeries[lastRefreshed];

        // Validate numeric values
        const open = parseFloat(latestData["1. open"]);
        const high = parseFloat(latestData["2. high"]);
        const low = parseFloat(latestData["3. low"]);
        const close = parseFloat(latestData["4. close"]);
        const volume = parseInt(latestData["5. volume"], 10);

        expect(open).toBeGreaterThan(0);
        expect(high).toBeGreaterThan(0);
        expect(low).toBeGreaterThan(0);
        expect(close).toBeGreaterThan(0);
        expect(volume).toBeGreaterThanOrEqual(0);

        // Data Integrity Checks
        expect(open).toBeGreaterThanOrEqual(low);
        expect(open).toBeLessThanOrEqual(high);
        expect(close).toBeGreaterThanOrEqual(low);
        expect(close).toBeLessThanOrEqual(high);
    }

});