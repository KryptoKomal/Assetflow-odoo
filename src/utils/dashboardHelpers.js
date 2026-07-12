// Groups raw assets array into pie-chart-ready status buckets
export function buildAssetStatusData(assets) {
    const buckets = { Available: 0, Allocated: 0, "In Maintenance": 0, Retired: 0 };

    assets.forEach((asset) => {
        const status = (asset.status || "").toLowerCase();
        if (status === "available") buckets.Available += 1;
        else if (status === "allocated") buckets.Allocated += 1;
        else if (status === "maintenance") buckets["In Maintenance"] += 1;
        else if (status === "retired") buckets.Retired += 1;
        else buckets.Available += 1; // fallback bucket
    });

    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
}

// Groups allocations by month (last 6 months) for the trend chart
export function buildAllocationTrendData(allocations) {
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            key: `${d.getFullYear()}-${d.getMonth()}`,
            month: d.toLocaleString("default", { month: "short" }),
            count: 0,
        });
    }

    allocations.forEach((alloc) => {
        const date = alloc.allocatedDate?.toDate ? alloc.allocatedDate.toDate() : null;
        if (!date) return;
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const bucket = months.find((m) => m.key === key);
        if (bucket) bucket.count += 1;
    });

    return months.map(({ month, count }) => ({ month, count }));
}

// Formats a Firestore Timestamp (or missing value) into a relative "time ago" string
export function timeAgo(timestamp) {
    if (!timestamp?.toDate) return "just now";
    const date = timestamp.toDate();
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString();
}