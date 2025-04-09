
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const Index = () => {
  const { isAuthenticated, redirectBasedOnRole } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to their appropriate dashboard
  useEffect(() => {
    if (isAuthenticated) {
      redirectBasedOnRole();
    }
  }, [isAuthenticated, redirectBasedOnRole]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-teal-500" />
            <span className="font-bold text-xl">OrderFlow Team Hub</span>
          </div>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center py-16">
        <div className="container mx-auto grid md:grid-cols-2 gap-8 px-4">
          <div className="space-y-6 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Streamline Your Order Management Workflow
            </h1>
            <p className="text-lg text-muted-foreground">
              An all-in-one platform for managing orders, tracking team
              performance, and organizing knowledge within your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => navigate("/login")}>
                Get Started
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              <div className="border bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Recent Orders</h3>
                  <span className="text-xs text-muted-foreground">Today</span>
                </div>
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="border-b last:border-0 py-2 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">Order #{1000 + index}</div>
                      <div className="text-xs text-muted-foreground">
                        Customer #{2000 + index}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        index === 1
                          ? "bg-yellow-100 text-yellow-800"
                          : index === 2
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {index === 1
                        ? "Pending"
                        : index === 2
                        ? "In Progress"
                        : "Completed"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-900">8</div>
                  <div className="text-xs text-yellow-700">Pending</div>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-900">5</div>
                  <div className="text-xs text-blue-700">In Progress</div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-900">12</div>
                  <div className="text-xs text-green-700">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Features for Your Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Order Management</h3>
              <p className="text-muted-foreground">
                Track and manage all incoming orders from the Salla platform with
                real-time updates and notifications.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Team Performance</h3>
              <p className="text-muted-foreground">
                Monitor staff performance, track attendance, and manage schedules
                all in one centralized dashboard.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Knowledge Base</h3>
              <p className="text-muted-foreground">
                Create and organize guides, instructions, and resources to help
                your team work more efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-teal-400" />
              <span className="font-bold text-xl">OrderFlow Team Hub</span>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} OrderFlow Team Hub. All rights
              reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
