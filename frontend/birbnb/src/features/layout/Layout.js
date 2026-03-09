import { Outlet } from "react-router";
import { Header } from "../../components/header/HeaderHuesped";
import Footer from "../../components/footer/Footer";
import "./Layout.css"

const Layout = () => {
    return(
      <div className="layout">
        <Header></Header>
        <div className="content">
          <Outlet />
        </div>
        <Footer/>
      </div>
    )
}

export default Layout;