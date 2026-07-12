import { QRCodeSVG } from "qrcode.react";
import { Download, MapPin, Hash, Tag, Package } from "lucide-react";
import Drawer from "../../components/common/Drawer";
import StatusBadge from "../../components/common/StatusBadge";

function AssetDetailDrawer({ isOpen, onClose, asset, categoryName }) {
    if (!asset) return null;

    function downloadQRCode() {
        const svg = document.getElementById(`qr-${asset.id}`);
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const pngUrl = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = pngUrl;
            link.download = `${asset.assetTag}-qr.png`;
            link.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }

    const DetailRow = ({ icon: Icon, label, value }) => (
        <div className="flex items-start gap-3 py-2.5">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{value || "—"}</p>
            </div>
        </div>
    );

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title="Asset Details">
            {asset.photo ? (
                <img
                    src={asset.photo}
                    alt={asset.assetName}
                    className="mb-4 h-48 w-full rounded-xl object-cover"
                />
            ) : (
                <div className="mb-4 flex h-48 w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                    <Package className="h-10 w-10 text-slate-300" />
                </div>
            )}

            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{asset.assetName}</h3>
                <StatusBadge status={asset.status} />
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <DetailRow icon={Hash} label="Asset Tag" value={asset.assetTag} />
                <DetailRow icon={Tag} label="Category" value={categoryName} />
                <DetailRow icon={Hash} label="Serial Number" value={asset.serialNumber} />
                <DetailRow icon={MapPin} label="Location" value={asset.location} />
                <DetailRow icon={Package} label="Condition" value={asset.condition} />
                <DetailRow icon={Package} label="Shared Resource" value={asset.shared ? "Yes — bookable" : "No"} />
            </div>

            {/* QR Code */}
            <div className="mt-5 flex flex-col items-center rounded-xl border border-slate-200 p-5 dark:border-slate-800">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                    Scan to identify asset
                </p>
                <QRCodeSVG
                    id={`qr-${asset.id}`}
                    value={JSON.stringify({ id: asset.id, tag: asset.assetTag, name: asset.assetName })}
                    size={160}
                    level="M"
                />
                <button
                    onClick={downloadQRCode}
                    className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    <Download className="h-3.5 w-3.5" /> Download QR Code
                </button>
            </div>
        </Drawer>
    );
}

export default AssetDetailDrawer;