
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import LanguageToggle from "@/components/common/LanguageToggle";

const Login = () => {
  const { login, isLoading } = useAuth();
  const { t, direction } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  // Demo accounts
  const demoAccounts = [
    { role: t("admin"), email: "ahmed@orderflow.com", password: "password" },
    { role: t("employee"), email: "mohammed@orderflow.com", password: "password" },
    { role: t("developer"), email: "omar@orderflow.com", password: "password" },
  ];

  // Apply demo account credentials
  const applyDemoCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      <div className={cn(
        "w-full max-w-md space-y-6",
        direction === "rtl" && "text-right"
      )}>
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-background p-2 rounded-full shadow-sm">
              <CheckCircle2 className="h-8 w-8 text-teal-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">{t("app.name")}</h1>
          <p className="text-muted-foreground">
            {t("signIn")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("signIn")}</CardTitle>
            <CardDescription>
              {t("email")} {t("and")} {t("password")} {t("to")} {t("access")} {t("your")} {t("account")}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={direction === "rtl" ? "text-right" : ""}
                />
              </div>
              <div className="space-y-2">
                <div className={cn(
                  "flex items-center justify-between",
                  direction === "rtl" && "flex-row-reverse"
                )}>
                  <Label htmlFor="password">{t("password")}</Label>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {t("forgotPassword")}
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={direction === "rtl" ? "text-right" : ""}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("signingIn")}
                  </>
                ) : (
                  t("signIn")
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("demoAccounts")}</CardTitle>
            <CardDescription>
              {t("clickToFill")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((account) => (
                <Button
                  key={account.email}
                  variant="outline"
                  className={cn(
                    "justify-start text-left overflow-hidden h-auto py-2",
                    direction === "rtl" && "text-right justify-end"
                  )}
                  onClick={() => applyDemoCredentials(account.email)}
                >
                  <div>
                    <div className="font-medium">{account.role}</div>
                    <div className="text-xs truncate text-muted-foreground">
                      {account.email}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

// Import cn utility
function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}
