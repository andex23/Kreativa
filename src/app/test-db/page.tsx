'use client';

import { useEffect, useState } from 'react';

interface TestResult {
  test: string;
  status: 'success' | 'error';
  message: string;
  data?: any;
}

export default function TestDbPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runTests();
  }, []);

  async function runTests() {
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      setResults(data.results);
    } catch (error: any) {
      setResults([{
        test: 'API Connection',
        status: 'error',
        message: error.message || 'Failed to run tests',
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Database Connection Test
          </h1>
          <p className="text-gray-600 mb-8">
            Testing Supabase database schema and connectivity
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    result.status === 'success'
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {result.status === 'success' ? (
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-6 w-6 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {result.test}
                      </h3>
                      <p
                        className={`mt-1 text-sm ${
                          result.status === 'success'
                            ? 'text-green-700'
                            : 'text-red-700'
                        }`}
                      >
                        {result.message}
                      </p>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                            View data
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Summary
                </h2>
                <p className="text-gray-600">
                  {results.filter((r) => r.status === 'success').length} of{' '}
                  {results.length} tests passed
                </p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => {
                    setLoading(true);
                    setResults([]);
                    runTests();
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Run Tests Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
