import { useEffect } from "react";
import { useAuth } from "../../Context/authContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const { verifyEmail } = useAuth();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get("email");

        if (!email) {
            navigate("/login");
            return;
        }

        verifyEmail(email); 

        Swal.fire({
            icon: "success",
            title: "Correo verificado",
            text: "Tu correo ha sido verificado correctamente.",
            confirmButtonText: "OK",
        }).then(() => {
            navigate("/login"); 
        });

    }, [navigate, verifyEmail]);

    return (
        <div>
            <h2>Verificando tu correo...</h2>
        </div>
    );
};

export default VerifyEmail;

