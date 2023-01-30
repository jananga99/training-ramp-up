import { FC, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userValidationSchema } from "../../utils/validation";
import { DetailedUser } from "../../utils/user";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(fas);
import "./SignUpPage.scss";
import { createUser } from "../SignInPage/authSlice";
import { RootState } from "../../utils/store";

const SignUpPage: FC = () => {
  useEffect(() => {
    document.title = "Sign Up";
  }, []);

  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const createLoading = useSelector((state: RootState) => state.auth.createLoading);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    userValidationSchema
      .validate(
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        },
        { abortEarly: false }
      )
      .then(() => {
        const newUser: DetailedUser = {
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
        };
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);
        dispatch(createUser(newUser));
      })
      .catch((err) => {
        alert(err.errors[0]);
      });
  };

  const handleHaveAccountClick = () => {
    navigate("/");
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              name="firstName"
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              name="lastName"
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              value={email}
              name="email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                name="password"
                onChange={(event) => setPassword(event.target.value)}
              />
              <FontAwesomeIcon
                icon="eye"
                className="eye"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <div className="password-description">
              *Password must be more than 8 characters with at least one lowercase letter, uppercase
              letter, number and symbol.
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                name="confirmPassword"
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              <FontAwesomeIcon
                icon="eye"
                className="eye"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
          </div>
          <button type="submit">Sign In</button>
        </form>
        <div className="sign-up-text" onClick={handleHaveAccountClick}>
          Already have an account?
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
