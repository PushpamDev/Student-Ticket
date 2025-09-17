import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/state/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState<"Faridabad" | "Pune">();
  const nav = useNavigate();

  const isStudent = !email.endsWith("@rvmcad.com");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register(name.trim(), email.trim(), password, isStudent ? branch : undefined);
      nav("/dashboard");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container py-12 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            {isStudent && (
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select onValueChange={(v) => setBranch(v as any)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Faridabad">Faridabad</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Create account</Button>
          </form>
          <div className="text-xs text-muted-foreground mt-3">Admins and placement emails are configured in environment variables.</div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">Already have an account? <Link className="underline ml-1" to="/login">Log in</Link></CardFooter>
      </Card>
    </div>
  );
}