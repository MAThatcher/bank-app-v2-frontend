import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ApiConfig from "../Misc/ApiBaseUrl";

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const apiBaseUrl = ApiConfig.getBaseUrl();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/users/verify-email/${token}`
        );
        setMessage(response.data.message);
        setVerified(true);
      } catch (error) {
        setMessage("Invalid or expired token.");
      }
    };

    verifyEmail();
  }, [token]);

  useEffect(() => {
    if (verified) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            navigate("/");
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [verified, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{message}</h1>
      {verified && (
        <>
          <p>
            You will be redirected to the login page in {countdown} seconds.
          </p>
          <button onClick={() => navigate("/")}>Go to Login Now</button>
        </>
      )}
    </div>
  );
};

export default EmailVerification;
