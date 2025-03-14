import { request } from "@playwright/test";
import { API_BASE_URL, API_KEY } from "../config/env";

export async function fetchStockData(symbol: string, outputSize: string = "compact") {
    const context = await request.newContext();
    const response = await context.get(API_BASE_URL, {
        params: {
            function: "TIME_SERIES_DAILY",
            symbol,
            outputsize: outputSize,
            apikey: API_KEY
        }
    });

    return response;
}

export async function fetchStockDataWithoutApiKey(symbol: string, outputSize: string = "compact") {
    const context = await request.newContext();
    const response = await context.get(API_BASE_URL, {
        params: {
            function: "TIME_SERIES_DAILY",
            symbol,
            outputsize: outputSize
        }
    });

    return response;
}

export async function fetchExchangeRate(fromCurrency: string, toCurrency: string) {
    const context = await request.newContext();
    
    const response = await context.get(API_BASE_URL, {
        params: {
            function: "CURRENCY_EXCHANGE_RATE",
            from_currency: fromCurrency,
            to_currency: toCurrency,
            apikey: API_KEY
        }
    });

    return response;
}

export async function fetchExchangeRateWithoutApiKey(fromCurrency: string, toCurrency: string) {
    const context = await request.newContext();
    
    const response = await context.get(API_BASE_URL, {
        params: {
            function: "CURRENCY_EXCHANGE_RATE",
            from_currency: fromCurrency,
            to_currency: toCurrency
        }
    });

    return response;
}