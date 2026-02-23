import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export function StatCard({ title, value, icon: Icon, description, trend }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <Icon className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                    {(description || trend) && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            {trend && (
                                <span className={trend.isPositive ? "text-green-500" : "text-red-500"}>
                                    {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                                </span>
                            )}
                            {description}
                        </p>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
