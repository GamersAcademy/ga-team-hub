
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { mockApiIntegrations } from "@/data/mockData";
import { ApiIntegration } from "@/types";
import { DataTable } from "@/components/ui/DataTable";
import {
  CheckCircle2,
  Code,
  Copy,
  History,
  PlayCircle,
  Plus,
  RefreshCcw,
  Save,
  Settings,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DeveloperDashboard = () => {
  const [integrations, setIntegrations] = useState<ApiIntegration[]>(mockApiIntegrations);
  const [activeTab, setActiveTab] = useState("integrations");
  const [testEndpoint, setTestEndpoint] = useState("https://api.salla.dev/admin/v2/orders");
  const [testMethod, setTestMethod] = useState("GET");
  const [testHeaders, setTestHeaders] = useState('{\n  "Authorization": "Bearer YOUR_TOKEN_HERE",\n  "Content-Type": "application/json"\n}');
  const [testBody, setTestBody] = useState('{\n  "key": "value"\n}');
  const [testResponse, setTestResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingIntegration, setIsAddingIntegration] = useState(false);
  const [newIntegration, setNewIntegration] = useState<Partial<ApiIntegration>>({
    name: "",
    endpoint: "",
    authType: "api_key",
    status: "inactive"
  });
  
  // Integration status toggling
  const toggleIntegrationStatus = (id: string) => {
    setIntegrations(
      integrations.map((integration) => {
        if (integration.id === id) {
          const newStatus = integration.status === "active" ? "inactive" : "active";
          toast.success(`${integration.name} is now ${newStatus}`);
          return {
            ...integration,
            status: newStatus,
            lastSynced: newStatus === "active" ? new Date().toISOString() : integration.lastSynced
          };
        }
        return integration;
      })
    );
  };
  
  // Add new integration
  const handleAddIntegration = () => {
    if (!newIntegration.name || !newIntegration.endpoint) {
      toast.error("Please provide a name and endpoint");
      return;
    }
    
    const integration: ApiIntegration = {
      id: `api-${Date.now()}`,
      name: newIntegration.name || "",
      endpoint: newIntegration.endpoint || "",
      authType: newIntegration.authType as "api_key" | "oauth" | "basic",
      status: "inactive"
    };
    
    setIntegrations([...integrations, integration]);
    setIsAddingIntegration(false);
    setNewIntegration({
      name: "",
      endpoint: "",
      authType: "api_key",
      status: "inactive"
    });
    
    toast.success(`Added ${integration.name} integration`);
  };
  
  // Handle API request test
  const handleTestRequest = () => {
    setIsLoading(true);
    setTestResponse("");
    
    // Simulate API request delay
    setTimeout(() => {
      const success = Math.random() > 0.3;
      
      if (success) {
        const sampleResponse = {
          success: true,
          data: {
            orders: [
              {
                id: "123456",
                reference_id: "ORD-2023-001",
                status: "completed",
                total: 4500,
                created_at: new Date().toISOString()
              },
              {
                id: "123457",
                reference_id: "ORD-2023-002",
                status: "processing",
                total: 2300,
                created_at: new Date().toISOString()
              }
            ],
            pagination: {
              total: 2,
              count: 2,
              per_page: 10,
              current_page: 1,
              total_pages: 1
            }
          }
        };
        
        setTestResponse(JSON.stringify(sampleResponse, null, 2));
        toast.success("API request successful");
      } else {
        const errorResponse = {
          error: {
            code: 401,
            message: "Unauthorized. Invalid authentication credentials."
          }
        };
        
        setTestResponse(JSON.stringify(errorResponse, null, 2));
        toast.error("API request failed");
      }
      
      setIsLoading(false);
    }, 1500);
  };
  
  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };
  
  // Integration table columns
  const integrationColumns = [
    {
      key: "name",
      label: "Integration",
    },
    {
      key: "endpoint",
      label: "Endpoint",
      render: (value: string) => (
        <div className="truncate max-w-[200px]" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "authType",
      label: "Auth Type",
      render: (value: string) => value.toUpperCase(),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        value === "active" 
          ? <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
          : <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Inactive</Badge>
      ),
    },
    {
      key: "lastSynced",
      label: "Last Synced",
      render: (value: string) => value ? new Date(value).toLocaleString() : "Never",
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: ApiIntegration) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => toggleIntegrationStatus(row.id)}
          >
            {row.status === "active" ? (
              <XCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <span className="sr-only">
              {row.status === "active" ? "Deactivate" : "Activate"}
            </span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout allowedRoles={["developer"]}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Developer Dashboard</h1>
            <p className="text-muted-foreground">
              Manage API integrations and test endpoints
            </p>
          </div>
          
          <Dialog open={isAddingIntegration} onOpenChange={setIsAddingIntegration}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Integration</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Integration</DialogTitle>
                <DialogDescription>
                  Configure a new API integration for the system
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Integration Name*</Label>
                  <Input
                    id="name"
                    value={newIntegration.name || ""}
                    onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                    placeholder="e.g. Salla Platform"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="endpoint">API Endpoint*</Label>
                  <Input
                    id="endpoint"
                    value={newIntegration.endpoint || ""}
                    onChange={(e) => setNewIntegration({ ...newIntegration, endpoint: e.target.value })}
                    placeholder="https://api.example.com/v1"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="authType">Authentication Type</Label>
                  <Select
                    value={newIntegration.authType || "api_key"}
                    onValueChange={(value) => setNewIntegration({ ...newIntegration, authType: value as "api_key" | "oauth" | "basic" })}
                  >
                    <SelectTrigger id="authType">
                      <SelectValue placeholder="Select auth type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="api_key">API Key</SelectItem>
                      <SelectItem value="oauth">OAuth</SelectItem>
                      <SelectItem value="basic">Basic Auth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingIntegration(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddIntegration}>Add Integration</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="api-tester">API Tester</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="integrations" className="space-y-4 mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>API Integrations</CardTitle>
                <CardDescription>
                  Manage connections to external APIs and services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={integrationColumns}
                  data={integrations}
                  searchable={true}
                  searchKeys={["name", "endpoint"]}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api-tester" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle>API Request Tester</CardTitle>
                    <CardDescription>
                      Test API endpoints and see responses
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-1">
                        <Label htmlFor="endpoint">Endpoint URL</Label>
                        <Input
                          id="endpoint"
                          value={testEndpoint}
                          onChange={(e) => setTestEndpoint(e.target.value)}
                          placeholder="https://api.example.com/path"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="method">Method</Label>
                        <Select value={testMethod} onValueChange={setTestMethod}>
                          <SelectTrigger id="method">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="headers">Headers</Label>
                      <div className="relative">
                        <Textarea
                          id="headers"
                          value={testHeaders}
                          onChange={(e) => setTestHeaders(e.target.value)}
                          className="font-mono text-sm min-h-[100px]"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => copyToClipboard(testHeaders)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span className="sr-only">Copy headers</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="body">Request Body</Label>
                      <div className="relative">
                        <Textarea
                          id="body"
                          value={testBody}
                          onChange={(e) => setTestBody(e.target.value)}
                          className="font-mono text-sm min-h-[100px]"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => copyToClipboard(testBody)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span className="sr-only">Copy body</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleTestRequest}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      {isLoading ? (
                        <RefreshCcw className="h-4 w-4 animate-spin" />
                      ) : (
                        <PlayCircle className="h-4 w-4" />
                      )}
                      <span>{isLoading ? "Sending..." : "Send Request"}</span>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle>Response</CardTitle>
                    <CardDescription>
                      API response will appear here
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Textarea
                        value={testResponse}
                        readOnly
                        className="font-mono text-sm min-h-[400px] resize-none"
                        placeholder="Response will appear here after sending a request"
                      />
                      {testResponse && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => copyToClipboard(testResponse)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span className="sr-only">Copy response</span>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="docs" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>
                  Reference for the available API endpoints and integration options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Salla Platform Integration</h3>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge>GET</Badge>
                        <code className="text-sm">/admin/v2/orders</code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Retrieves a list of orders from the Salla platform with pagination
                      </p>
                      <div className="mt-3">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Code className="h-3.5 w-3.5" />
                          <span>View Example</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge>GET</Badge>
                        <code className="text-sm">/admin/v2/orders/{"{id}"}</code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Retrieves details for a specific order by ID
                      </p>
                      <div className="mt-3">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Code className="h-3.5 w-3.5" />
                          <span>View Example</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge>PUT</Badge>
                        <code className="text-sm">/admin/v2/orders/{"{id}"}/status</code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Updates the status of a specific order
                      </p>
                      <div className="mt-3">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Code className="h-3.5 w-3.5" />
                          <span>View Example</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Authentication</h3>
                  <div className="text-sm space-y-3">
                    <p>
                      To authenticate with the Salla API, you need to obtain an access token
                      using OAuth 2.0. The token should be included in the Authorization
                      header of each request:
                    </p>
                    <pre className="bg-gray-50 p-3 rounded-md overflow-x-auto text-xs">
                      <code>Authorization: Bearer YOUR_ACCESS_TOKEN</code>
                    </pre>
                    <p>
                      Tokens expire after 24 hours and will need to be refreshed using
                      the refresh token endpoint.
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Save className="h-4 w-4" />
                        <span>Download OpenAPI Spec</span>
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <History className="h-4 w-4" />
                        <span>View Changelog</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperDashboard;
