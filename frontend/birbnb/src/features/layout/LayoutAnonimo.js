import { Outlet } from "react-router";
import  {Header} from "../../components/header/HeaderDeAuntenticacion"
import Footer from "../../components/footer/Footer";

const LayoutAnonimo = () => {
    return(
        <>
          <Header></Header>
          <Outlet />
          <Footer/>
        </>
    )
}

export default LayoutAnonimo;