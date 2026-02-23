import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileIcon, Loader2 } from "lucide-react";

export function IDCardUploader() {
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!identifier.trim()) {
            return toast({
                variant: "destructive",
                title: "Missing Information",
                description: "Please provide a Roll Number or Name to identify the student.",
            });
        }

        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            return toast({
                variant: "destructive",
                title: "Missing File",
                description: "Please select an ID Card image or PDF to upload.",
            });
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("identifier", identifier);
        formData.append("idCard", file);

        try {
            const res = await fetch("/api/upload-id-card", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to upload ID Card");
            }

            const result = await res.json();

            toast({
                title: "Upload Successful",
                description: result.message,
            });

            setIsOpen(false);
            setIdentifier("");
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: error.message || "There was an issue uploading the file.",
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload ID Card
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Student ID Card</DialogTitle>
                    <DialogDescription>
                        Assign an ID card to a student by entering their exact name or roll number. Max file size: 5MB (Image/PDF).
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="identifier">Student Name or Roll Number</Label>
                        <Input
                            id="identifier"
                            placeholder="e.g. John Doe or S12345"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            disabled={isUploading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>ID Card File</Label>
                        <Input
                            type="file"
                            accept="image/*, application/pdf"
                            ref={fileInputRef}
                            disabled={isUploading}
                            className="file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold hover:file:bg-slate-100"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isUploading}>
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            "Upload and Assign"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
