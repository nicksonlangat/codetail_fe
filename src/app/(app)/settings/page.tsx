"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState("Demo User");
  const [email, setEmail] = useState("user@codetail.dev");
  const [language, setLanguage] = useState("Python");
  const [notifications, setNotifications] = useState(false);
  const [aiHints, setAiHints] = useState(true);
  const [autoRun, setAutoRun] = useState(true);

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-foreground tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your account and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Profile</CardTitle>
            <CardDescription className="text-xs">Your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="language" className="text-xs">Preferred Language</Label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full h-9 text-sm bg-transparent px-3 rounded-lg ring-1 ring-border/50 hover:ring-border outline-none transition-all cursor-pointer"
              >
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
                <option value="Go">Go</option>
              </select>
            </div>
            <Button size="sm" className="mt-2">
              Save profile
            </Button>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Preferences</CardTitle>
            <CardDescription className="text-xs">Customize your experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Dark mode</Label>
                <p className="text-[10px] text-muted-foreground mt-0.5">Toggle between light and dark theme</p>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">AI hints</Label>
                <p className="text-[10px] text-muted-foreground mt-0.5">Show hints when you're stuck</p>
              </div>
              <Switch checked={aiHints} onCheckedChange={setAiHints} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Auto-run code</Label>
                <p className="text-[10px] text-muted-foreground mt-0.5">Run code automatically after changes</p>
              </div>
              <Switch checked={autoRun} onCheckedChange={setAutoRun} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Email notifications</Label>
                <p className="text-[10px] text-muted-foreground mt-0.5">Receive weekly progress reports</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Account</CardTitle>
            <CardDescription className="text-xs">Manage your account settings.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <div className="flex-1">
              <span className="text-sm text-foreground">Sign out</span>
              <p className="text-[10px] text-muted-foreground mt-0.5">End your current session</p>
            </div>
            <Button variant="outline" size="sm">
              Sign out
            </Button>
            <div className="w-px h-8 bg-border/50" />
            <div className="flex-1">
              <span className="text-sm text-destructive">Delete account</span>
              <p className="text-[10px] text-muted-foreground mt-0.5">Permanently remove your data</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
