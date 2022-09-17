import Loader from "./loader"

const FullPageLoader = () => {
    return (
        <div class="loader-overlay">
            <Loader width="200" height="200" />
        </div>
    )
}

export default FullPageLoader;