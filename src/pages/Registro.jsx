import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Nav from "../components/Nav";

function Registro() {
    const handleSubmit = (e) => {
        e.preventDefault();
    };

  return (
       <>
        
        <Nav></Nav>
            <main>
            <div className="registro-container"></div>
        
        <Footer></Footer>
        </main>

      </>
   );
}
export default Registro;