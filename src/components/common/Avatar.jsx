
function Avatar({ name = "?", size = 32 }) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div
            className="flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary"
            style={{ width: size, height: size, fontSize: size * 0.38 }}
        >
            {initials || "?"}
        </div>
    );
}

export default Avatar;