import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MessageSquare, ShieldCheck, Ticket, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute -top-48 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="container py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <Badge className="mb-4" variant="secondary">Student Support</Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Raise. Track. Resolve. Student Tickets made simple.</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-prose">
                A centralized ticketing system for our institute. Students can raise issues in Infrastructure, Faculty, Placement, Certificate or Fee, chat within each ticket, and track their status in real-time.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg"><Link to="/register">Create your account</Link></Button>
                <Button asChild variant="outline" size="lg"><Link to="/login">I already have an account</Link></Button>
              </div>
              <div className="mt-6 text-sm text-muted-foreground"></div>
            </div>
            <div className="grid gap-4">
              <Card className="border-primary/20">
                <CardContent className="p-6 flex items-start gap-4">
                  <Ticket className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Smart ticket forms</h3>
                    <p className="text-muted-foreground text-sm">Branch, Name, Faculty, Course, Start Date, Description, and Category — all required for accurate routing.</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-6 flex items-start gap-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Auto routing by email role</h3>
                    <p className="text-muted-foreground text-sm">Infrastructure/Faculty/Certificate/Fee to Admin. Placement to Placement Cell.</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-6 flex items-start gap-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Built‑in chat</h3>
                    <p className="text-muted-foreground text-sm">Discuss within each ticket with a clean, focused chat experience.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <section className="border-t bg-muted/30">
        <div className="container py-12 grid md:grid-cols-3 gap-6">
          <Feature icon={<Users className="h-6 w-6" />} title="Student dashboard" desc="View ongoing, pending and resolved tickets in one place." />
          <Feature icon={<CheckCircle2 className="h-6 w-6" />} title="Department views" desc="Admin and Placement dashboards show assigned tickets." />
          <Feature icon={<MessageSquare className="h-6 w-6" />} title="Persistent chat" desc="Every ticket has a chat history you can always revisit." />
        </div>
      </section>
      <section>
        <div className="container py-12 text-center">
          <h2 className="text-2xl font-bold">Ready to get started?</h2>
          <p className="text-muted-foreground mt-2">Create an account and raise your first ticket now.</p>
          <div className="mt-4">
            <Button asChild size="lg"><Link to="/register">Create account</Link></Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-primary">{icon}</div>
        <div className="mt-3 font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </CardContent>
    </Card>
  );
}
