import { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { COLLECTIONS } from "../../constants/collections";
import { cancelBooking } from "../../services/bookingService";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import BookingFormModal from "./BookingFormModal";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
    format, parse, startOfWeek, getDay, locales,
});

function Bookings() {
    const { currentUser } = useAuth();
    const { data: bookings } = useFirestoreCollection(COLLECTIONS.BOOKINGS);
    const { data: assets } = useFirestoreCollection(COLLECTIONS.ASSETS);
    const { data: employees } = useFirestoreCollection(COLLECTIONS.USERS);

    const [formOpen, setFormOpen] = useState(false);
    const [initialSlot, setInitialSlot] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    const sharedAssets = assets.filter((a) => a.shared);

    function assetLabel(id) {
        const a = assets.find((x) => x.id === id);
        return a ? a.assetName : "Resource";
    }
    function employeeName(id) {
        return employees.find((e) => e.id === id)?.name || "Unknown";
    }

    const events = useMemo(
        () =>
            bookings
                .filter((b) => b.status !== "cancelled")
                .map((b) => ({
                    id: b.id,
                    title: `${assetLabel(b.resourceId)} — ${employeeName(b.employeeId)}`,
                    start: b.startTime?.toDate ? b.startTime.toDate() : new Date(),
                    end: b.endTime?.toDate ? b.endTime.toDate() : new Date(),
                    resource: b,
                })),
        [bookings, assets, employees]
    );

    function handleSelectSlot({ start, end }) {
        setInitialSlot({ start, end });
        setFormOpen(true);
    }

    function handleSelectEvent(event) {
        setSelectedEvent(event);
    }

    async function handleCancel() {
        setCancelling(true);
        try {
            await cancelBooking(selectedEvent.id, currentUser.uid);
            toast.success("Booking cancelled");
            setSelectedEvent(null);
        } catch (err) {
            toast.error("Failed to cancel booking");
            console.error(err);
        } finally {
            setCancelling(false);
        }
    }

    return (
        <div>
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Bookings</h1>
                    <p className="mt-1 text-sm text-slate-500">Book shared resources — click a slot to create a booking</p>
                </div>
                <Button icon={Plus} onClick={() => { setInitialSlot(null); setFormOpen(true); }}>
                    New Booking
                </Button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="h-[650px]" style={{ "--rbc-color": "#2563EB" }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        selectable
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectEvent}
                        style={{ height: "100%" }}
                        eventPropGetter={() => ({ style: { backgroundColor: "#2563EB", borderRadius: 6, border: "none" } })}
                    />
                </div>
            </div>

            <BookingFormModal
                isOpen={formOpen}
                onClose={() => setFormOpen(false)}
                sharedAssets={sharedAssets}
                employees={employees}
                initialSlot={initialSlot}
            />

            {/* Simple event detail / cancel popover */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelectedEvent(null)}>
                    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Booking Details</h3>
                            <button onClick={() => setSelectedEvent(null)}><X className="h-4 w-4 text-slate-400" /></button>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{selectedEvent.title}</p>
                        <p className="mt-1 text-xs text-slate-400">
                            {selectedEvent.start.toLocaleString()} — {selectedEvent.end.toLocaleString()}
                        </p>
                        <Button variant="danger" className="mt-4 w-full" loading={cancelling} onClick={handleCancel}>
                            Cancel Booking
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Bookings;