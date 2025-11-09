import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './signUpPage.css'
import signUpData from "../../API/signUp";

const SignUpPage = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const userData = {
        name: name,
        email: email,
        password: password,
        confirmpassword: confirmPassword
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError("");

        if (password !== confirmPassword) {
            setError('Password Does Not Match')
        }

        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        try {

            const response = await signUpData(userData)
            

            if (response.error) {
                setError(response.error)
            } else {
                
                navigate("/");
            }

            window.location.reload();

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <div className="signup-container">
                <h2>Sign Up</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoComplete="name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit">Sign Up</button>
                </form>
                <p className="login-link">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </>
    )
};

export default SignUpPage;
