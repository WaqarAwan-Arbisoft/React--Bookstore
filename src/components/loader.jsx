import { Dna } from "react-loader-spinner";

const Loader = (props) => {
    return (
        <Dna
            visible={true}
            height={props.height ? props.height : 80}
            width={props.width ? props.width : 80}
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
        />
    )
}

export default Loader;