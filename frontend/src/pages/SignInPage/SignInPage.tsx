import { FC, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../utils/store";
import { studentValidationSchema, userValidationSchema } from "../../utils/validation";
import { User } from "../../utils/user";
import { TextBox } from "@progress/kendo-react-inputs";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(fas);
import { Button } from "@progress/kendo-react-buttons";
import "..//SignUpPage/SignUpPage.scss";

const getPasswordType = (visible: boolean) => {
  return visible ? "text" : "password";
};

const SignInPage: FC = () => {
  useEffect(() => {
    document.title = "Sign Up";
  }, []);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  // const dispatch = useDispatch();

  // const createLoading = useSelector((state: RootState) => state.user.createLoading);

  const createLoading = false;

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const newUser: User = {
      email: email,
      password: password,
    };
    console.log(newUser);
    // dispatch(createUser(newUser));
    setEmail("");
    setPassword("");

    setShowPassword(false);
  };

  const handleDontHaveAccountClick = () => {
    navigate("/signup");
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-box">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
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
          </div>
          <button type="submit">Sign In</button>
        </form>
        <div className="sign-up-text" onClick={handleDontHaveAccountClick}>
          Don&apos;t have an account yet
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
