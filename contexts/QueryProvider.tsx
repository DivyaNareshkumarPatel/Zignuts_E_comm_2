'use client';
import { QueryClient, QueryClientProvider, isServer } from "@tanstack/react-query";

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // to avoid refetching immediately on the client
                staleTime: 60 * 1000,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

// create a new query client if not exists
function getQueryClient() {
    if (isServer) {
        return makeQueryClient();
    } else {
        if (!browserQueryClient) {
            browserQueryClient = makeQueryClient();
        }
        return browserQueryClient;
    }
}

// The QueryClient manages the cache and coordinates all of your data fetching.
export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

// queryClient is for cache management, query state tracking.
// QueryClientProvider is for context distribution, lifecycle management, it makes the queryClient available to all child components