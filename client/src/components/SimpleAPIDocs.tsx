// components/SimpleApiDocs.tsx
"use client";

import { useState } from "react";

interface OpenAPISchema {
  type?: string;
  properties?: Record<string, OpenAPISchema>;
  items?: OpenAPISchema;
  $ref?: string;
}

interface OpenAPIParameter {
  name: string;
  in: string;
  description?: string;
  required?: boolean;
  schema?: OpenAPISchema;
  type?: string;
}

interface OpenAPIResponse {
  description: string;
  content?: Record<string, { schema: OpenAPISchema }>;
}

interface OpenAPIEndpoint {
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: OpenAPIParameter[];
  requestBody?: Record<string, { schema: OpenAPISchema }>;
  responses: Record<string, OpenAPIResponse>;
  security?: Record<string, string[]>[];
}

interface OpenAPISpec {
  info: {
    title: string;
    version: string;
    description?: string;
  };
  paths: Record<string, Record<string, OpenAPIEndpoint>>;
  components?: {
    schemas: Record<string, OpenAPISchema>;
  };
  tags?: Array<{ name: string; description?: string }>;
}

interface ApiDocsProps {
  spec: OpenAPISpec;
}

interface EndpointProps {
  path: string;
  method: string;
  endpoint: OpenAPIEndpoint;
}

const MethodBadge = ({ method }: { method: string }) => {
  const colors = {
    get: "bg-blue-100 text-blue-800",
    post: "bg-green-100 text-green-800",
    put: "bg-yellow-100 text-yellow-800",
    patch: "bg-orange-100 text-orange-800",
    delete: "bg-red-100 text-red-800",
  };

  return <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${colors[method as keyof typeof colors] || "bg-gray-100 text-gray-800"}`}>{method}</span>;
};

const Endpoint = ({ path, method, endpoint }: EndpointProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <div className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3">
          <MethodBadge method={method} />
          <code className="text-sm font-mono">{path}</code>
          <span className="text-gray-600">{endpoint.summary}</span>
        </div>
        <svg className={`w-5 h-5 transform transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="space-y-4">
            {endpoint.description && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{endpoint.description}</p>
              </div>
            )}

            {endpoint.parameters && endpoint.parameters.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Parameters</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Required</th>
                        <th className="text-left p-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {endpoint.parameters?.map((param: OpenAPIParameter, idx: number) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2 font-mono">{param.name}</td>
                          <td className="p-2">{param.schema?.type || param.type}</td>
                          <td className="p-2">{param.required ? "Yes" : "No"}</td>
                          <td className="p-2">{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {endpoint.requestBody && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Request Body</h4>
                <div className="bg-gray-100 p-3 rounded text-sm">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(endpoint.requestBody, null, 2)}</pre>
                </div>
              </div>
            )}

            {endpoint.responses && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Responses</h4>
                <div className="space-y-2">
                  {Object.entries(endpoint.responses).map(([status, response]: [string, OpenAPIResponse]) => (
                    <div key={status} className="border border-gray-300 rounded">
                      <div className="bg-gray-100 p-2 font-semibold">
                        Status: {status} - {response.description}
                      </div>
                      {response.content && (
                        <div className="p-3">
                          <pre className="text-xs bg-white p-2 rounded overflow-x-auto">{JSON.stringify(response.content, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {endpoint.security && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Security</h4>
                <div className="bg-yellow-50 p-3 rounded text-sm">
                  <span className="text-yellow-800">🔒 Authentication required</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function SimpleApiDocs({ spec }: ApiDocsProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  if (!spec) return <div>Loading...</div>;

  const paths = spec.paths || {};
  const tags = spec.tags || [];

  // Group endpoints by tag
  const endpointsByTag: { [key: string]: Array<{ path: string; method: string; endpoint: OpenAPIEndpoint }> } = {};

  Object.entries(paths).forEach(([path, methods]: [string, Record<string, OpenAPIEndpoint>]) => {
    Object.entries(methods).forEach(([method, endpoint]: [string, OpenAPIEndpoint]) => {
      const tag = endpoint.tags?.[0] || "Other";
      if (!endpointsByTag[tag]) {
        endpointsByTag[tag] = [];
      }
      endpointsByTag[tag].push({ path, method, endpoint });
    });
  });

  const filteredTags = selectedTag ? [selectedTag] : Object.keys(endpointsByTag);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{spec.info?.title || "API Documentation"}</h1>
        <p className="text-gray-600 mb-4">{spec.info?.description || "API Documentation"}</p>
        <div className="text-sm text-gray-500">Version: {spec.info?.version || "1.0.0"}</div>
      </div>

      {/* Tag Filter */}
      {tags.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Categories:</h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedTag(null)} className={`px-3 py-1 rounded text-sm ${!selectedTag ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
              All
            </button>
            {Object.keys(endpointsByTag).map((tag) => (
              <button key={tag} onClick={() => setSelectedTag(tag)} className={`px-3 py-1 rounded text-sm ${selectedTag === tag ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Endpoints */}
      <div className="space-y-8">
        {filteredTags.map((tag) => (
          <div key={tag}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">{tag}</h2>
            <div className="space-y-2">
              {endpointsByTag[tag]?.map(({ path, method, endpoint }, idx) => (
                <Endpoint key={`${path}-${method}-${idx}`} path={path} method={method} endpoint={endpoint} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Schemas */}
      {spec.components?.schemas && (
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Models</h2>
          <div className="grid gap-4">
            {Object.entries(spec.components.schemas).map(([name, schema]: [string, OpenAPISchema]) => (
              <div key={name} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{name}</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{JSON.stringify(schema, null, 2)}</pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
