import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#2563EB", "#10B981", "#F97316", "#EF4444", "#64748B"];

// Donut chart showing asset breakdown by status (available, allocated, maintenance, etc.)
function AssetStatusChart({ data }) {
    const hasData = data && data.some((d) => d.value > 0);

    if (!hasData) {
        return (
            <div className="flex h-64 items-center justify-center text-sm text-slate-400">
                No asset data yet
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={260}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                >
                    {data.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                />
                <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12 }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

export default AssetStatusChart;