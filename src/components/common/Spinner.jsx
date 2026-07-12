
function Spinner({ size = 24 }) {
    return (
        <div
            className="animate-spin rounded-full border-4 border-slate-200 border-t-primary"
            style={{ width: size, height: size }}
        />
    );
}

export default Spinner;