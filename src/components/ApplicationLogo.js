import Image from "next/image"

const ApplicationLogo = props => (
    <Image src={require("../../public/paymarsu.png")} alt="PayMarSU Logo" height={40} />
)

export default ApplicationLogo
