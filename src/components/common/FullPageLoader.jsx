import Spinner from "./Spinner";

function FullPageLoader() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50">
            <Spinner size={40} />
        </div>
    );
}

export default FullPageLoader;