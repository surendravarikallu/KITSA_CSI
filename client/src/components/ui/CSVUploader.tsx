import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileSpreadsheet, Loader2 } from "lucide-react";

interface CSVUploaderProps {
    onUploadSuccess: () => void;
}

export function CSVUploader({ onUploadSuccess }: CSVUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        try {
            const text = await file.text();
            const rows = text.split("\n").map(row => row.trim()).filter(Boolean);

            // Assume CSV format: Name, Email, RollNumber
            // Skip the first row if it's a header (e.g., contains "Name" or "Email")
            const startIndex = rows[0].toLowerCase().includes("email") ? 1 : 0;

            const usersToImport = [];

            for (let i = startIndex; i < rows.length; i++) {
                const [name, email, rollNumber, role] = rows[i].split(",").map(val => val?.trim());
                if (name && email) {
                    let validRole = "student";
                    if (role && ["admin", "organizer", "student"].includes(role.toLowerCase())) {
                        validRole = role.toLowerCase();
                    }
                    usersToImport.push({ name, email, rollNumber: rollNumber || undefined, role: validRole });
                }
            }

            if (usersToImport.length === 0) {
                throw new Error("No valid data found in CSV. Expected: Name, Email, [RollNumber], [Role]");
            }

            const res = await fetch("/api/users/bulk-import", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usersToImport)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to import users.");
            }

            const result = await res.json();

            toast({
                title: "Import Successful",
                description: result.message,
            });

            onUploadSuccess();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Import Failed",
                description: error.message || "There was an issue processing the file.",
            });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="flex items-center gap-2">
            <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
            />
            <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
            >
                {isUploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                )}
                Import CSV
            </Button>
        </div>
    );
}
