// app/api-docs/page.tsx
"use client";

import { useEffect, useState } from "react";
import SimpleApiDocs from "@/components/SimpleAPIDocs";

interface OpenAPISchema {
  type?: string;
  properties?: Record<string, OpenAPISchema>;
  items?: OpenAPISchema;
  $ref?: string;
}

interface OpenAPIEndpoint {
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: Array<{
    name: string;
    in: string;
    description?: string;
    required?: boolean;
    schema?: OpenAPISchema;
  }>;
  requestBody?: Record<string, { schema: OpenAPISchema }>;
  responses: Record<
    string,
    {
      description: string;
      content?: Record<string, { schema: OpenAPISchema }>;
    }
  >;
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

export default function ApiDocsPage() {
  const [swaggerSpec, setSwaggerSpec] = useState<OpenAPISpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/swagger.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load API documentation");
        }
        return res.json();
      })
      .then((spec) => {
        setSwaggerSpec(spec);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading API documentation...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!swaggerSpec) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading API documentation...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <SimpleApiDocs spec={swaggerSpec} />
    </div>
  );
}
