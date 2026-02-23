import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema } from "@shared/schema";
import type { InsertContactMessage } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
    const { toast } = useToast();

    const form = useForm<InsertContactMessage>({
        resolver: zodResolver(insertContactSchema),
        defaultValues: {
            name: '',
            email: '',
            message: ''
        }
    });

    const mutation = useMutation({
        mutationFn: async (data: InsertContactMessage) => {
            const res = await fetch(api.contact.submit.path, {
                method: api.contact.submit.method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to send message");
            }
            return res.json();
        },
        onSuccess: () => {
            toast({
                title: "Message Sent",
                description: "We've received your message and will get back to you soon.",
            });
            form.reset();
        },
        onError: (error: Error) => {
            toast({
                variant: "destructive",
                title: "Error Sending Message",
                description: error.message,
            });
        },
    });

    const onSubmit = (data: InsertContactMessage) => {
        mutation.mutate(data);
    };

    return (
        <div className="py-16">
            {/* Header Section */}
            <div className="bg-slate-900 text-white py-16 mb-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-display font-bold text-4xl mb-4">Contact Us</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-lg">
                        Have questions about membership, upcoming events, or partnering with us? We'd love to hear from you.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Contact Information */}
                    <div className="md:col-span-1 space-y-6">
                        <h3 className="text-2xl font-bold font-display text-slate-900">Get in Touch</h3>
                        <p className="text-slate-600">
                            Reach out to our core team for any queries. We usually reply within a couple of days.
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-start space-x-4">
                                <MapPin className="w-6 h-6 text-primary mt-1" />
                                <div>
                                    <h4 className="font-semibold text-slate-900">Address</h4>
                                    <p className="text-slate-600">NH 16, Yanamadala (V & P),<br />Opp. Katuri Medical College,<br />Guntur Dist, Andhra Pradesh 522019</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <Mail className="w-6 h-6 text-primary mt-1" />
                                <div>
                                    <h4 className="font-semibold text-slate-900">Email</h4>
                                    <p className="text-slate-600">principal@kitsakshar.ac.in</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <Phone className="w-6 h-6 text-primary mt-1" />
                                <div>
                                    <h4 className="font-semibold text-slate-900">Phone</h4>
                                    <p className="text-slate-600">0863-2288886, 0863-2288887</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <span className="text-primary mt-1 text-xl leading-none">🌐</span>
                                <div>
                                    <h4 className="font-semibold text-slate-900">Website</h4>
                                    <a href="https://www.kitsakshar.ac.in" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-primary transition-colors">www.kitsakshar.ac.in</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        <Card className="shadow-lg border-slate-100">
                            <CardHeader>
                                <CardTitle>Send us a Message</CardTitle>
                                <CardDescription>Fill out the form below and we will get back to you.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Your Name</Label>
                                            <Input id="name" {...form.register("name")} placeholder="John Doe" />
                                            {form.formState.errors.name && (
                                                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" type="email" {...form.register("email")} placeholder="john@example.com" />
                                            {form.formState.errors.email && (
                                                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            {...form.register("message")}
                                            placeholder="How can we help you?"
                                            className="min-h-[150px]"
                                        />
                                        {form.formState.errors.message && (
                                            <p className="text-sm text-red-500">{form.formState.errors.message.message}</p>
                                        )}
                                    </div>

                                    <Button type="submit" className="w-full md:w-auto mt-4" disabled={mutation.isPending}>
                                        {mutation.isPending ? "Sending..." : "Send Message"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
