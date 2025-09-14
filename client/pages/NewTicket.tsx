import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/state/auth";
import * as api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { TicketCategory } from "@shared/api";

const schema = z.object({
  branch: z.string().min(1, "Branch is required"),
  name: z.string().min(1, "Name is required"),
  facultyName: z.string().min(1, "Faculty name is required"),
  coursePackage: z.string().min(1, "Course package is required"),
  courseStartDate: z.date({ required_error: "Course start date is required" }),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["Infrastructure", "Faculty", "Placement", "Certificate", "Fee"] as [TicketCategory, ...TicketCategory[]]),
});

type FormValues = z.infer<typeof schema>;

export default function NewTicket() {
  const { user } = useAuth();
  const nav = useNavigate();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { branch: "", name: user?.name ?? "", facultyName: "", coursePackage: "", description: "" } });

  async function onSubmit(values: FormValues) {
    if (!user) return;
    const payload = {
      studentName: user.name,
      studentEmail: user.email,
      branch: values.branch,
      facultyName: values.facultyName,
      coursePackage: values.coursePackage,
      courseStartDate: values.courseStartDate.toISOString(),
      description: values.description,
      category: values.category,
    };
    try {
      const ticket = await api.createTicket(payload);
      nav(`/tickets/${ticket._id || ticket.id}`);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Raise a new ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="branch" render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch of the institute</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Faridabad,Pune" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>z``
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="facultyName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Faculty Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Karan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="coursePackage" render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Package</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., AutoCad 2D" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="courseStartDate" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Course Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? new Date(field.value).toLocaleDateString() : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="Faculty">Faculty</SelectItem>
                      <SelectItem value="Placement">Placement</SelectItem>
                      <SelectItem value="Certificate">Certificate</SelectItem>
                      <SelectItem value="Fee">Fee</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Description of the complaint</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit">Submit Ticket</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
