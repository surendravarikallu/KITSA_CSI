import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CSVUploader } from "@/components/ui/CSVUploader";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ImportUsers() {
    const handleDownloadTemplate = () => {
        const templateContent = "Name,Email,RollNumber,Role\nJohn Doe,john@example.com,123456,student\nJane Smith,jane@example.com,654321,admin\nBob Wilson,bob@example.com,987654,organizer";
        const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "student_import_template.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Import Users</h1>
                    <p className="text-muted-foreground">Bulk import student members using a CSV file.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Download Template</CardTitle>
                            <CardDescription>
                                Download the standard CSV template. Ensure your data matches the exact column headers: Name, Email, RollNumber, Role.
                                Valid Roles are: student, organizer, admin.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={handleDownloadTemplate} className="gap-2">
                                <Download className="w-4 h-4" />
                                Download CSV Template
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>2. Upload Roster</CardTitle>
                            <CardDescription>
                                Upload the populated CSV file. The system will create student accounts with a default password and auto-approve them.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CSVUploader onUploadSuccess={() => {
                                window.location.href = "/admin/members";
                            }} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
