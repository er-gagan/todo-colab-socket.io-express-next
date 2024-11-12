import toast from "react-hot-toast";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions<T> {
    method: RequestMethod;
    endpoint: string;
    payload?: T | FormData;
    headers?: HeadersInit;
    token?: string; // Optional if you have authentication needs
}
const host = process.env.NEXT_PUBLIC_API_URL;
async function fetchApi<T>(options: FetchOptions<T>): Promise<any> {
    const { method, endpoint, payload, headers, token } = options;

    // Configure headers and add default Content-Type if not FormData
    const config: RequestInit = {
        method,
        headers: {
            ...headers,
            ...(payload instanceof FormData ? {} : { "Content-Type": "application/json" }),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    };

    // Attach payload for non-GET requests
    if (payload) {
        config.body = payload instanceof FormData ? payload : JSON.stringify(payload);
    }

    try {
        const response = await fetch(`${host}${endpoint}`, config);

        // Check if response is ok
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "An error occurred while fetching data.");
        }

        // Handle response data type
        const isJsonResponse = response.headers.get("content-type")?.includes("application/json");
        return isJsonResponse ? response.json() : response.text();
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.message === "Invalid token") {
                localStorage.clear()
                window.location.href = '/login'
                return {
                    statusCode: 401, message: error.message
                }
            }
            return {
                statusCode: 500, message: error.message
            }
        } else {
            return {
                statusCode: 500, message: "An unknown error occurred"
            }
        }
    }
}

export default fetchApi;
