import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { User } from "../../utils/user";
import { signInUser } from "../SignUpPage/userSlice";
import { RootState } from "../../utils/store";
import jwt from "jsonwebtoken";

const useStyles = makeStyles({
  body: {
    backgroundColor: "#34b4eb",
    height: window.innerHeight,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  signInBox: {
    width: "630px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "30px",
  },
  signInTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#34b4eb",
    fontWeight: "bold",
    fontSize: "35px",
    padding: "5px",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputData: {
    borderColor: "grey",
    borderRadius: "5px",
    margin: "20px",
    padding: "10px",
    width: "400px",
  },
  submitButtonRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    borderStyle: "none",
    borderRadius: "60px",
    margin: "10px 0 40px 0",
    padding: "10px 40px 10px 40px",
    color: "white",
  },
  haveAccountTextRow: {
    display: "flex",
    alignItems: "right",
    justifyContent: "center",
  },
  passwordTextRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  passwordText: {
    width: "400px",
  },
  loadingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingProgress: {},
});

const getPasswordType = (visible: boolean) => {
  return visible ? "text" : "password";
};

jwt.verify(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InFAcS5jb20iLCJpYXQiOjE2NzQzMjM1NDcsImV4cCI6MTY3NDMyNDE0N30.4rFwhi_qi2z8QUNd5EcQ48j6SLdaQD74e1cTc0HxUlY",
  "gghj4hjdf@#^d"
);

const SignInPage: FC = () => {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  useEffect(() => {
    document.title = "Sign In";

    testa();
  }, []);

  const testa = async () => {
    console.log(process.env.REACT_APP_ACCESS_TOKEN_SECRET);
    console.log(accessToken);
    // const decoded = await jwt.verify(
    //   accessToken as string,
    //   process.env.REACT_APP_ACCESS_TOKEN_SECRET as string
    // );
    // console.log(decoded);
  };

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const signInLoading = useSelector((state: RootState) => state.user.signInLoading);

  const handleSubmit = (): void => {
    const newUser: User = {
      email: email,
      password: password,
    };
    dispatch(signInUser(newUser));
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  const handleAddNewClick = () => {
    navigate("/signup");
  };

  const classes = useStyles();

  return (
    <div className={classes.body}>
      <div className={classes.signInBox}>
        <div className={classes.signInTitle}>Sign In</div>
        <div className={classes.inputRow}>
          <TextField
            className={classes.inputData}
            label="Email"
            value={email}
            type="email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className={classes.inputRow}>
          <TextField
            className={classes.inputData}
            label="Password"
            value={password}
            type={getPasswordType(showPassword)}
            onChange={(event) => setPassword(event.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div className={classes.submitButtonRow}>
          <Button
            className={classes.submitButton}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Sign In
          </Button>
        </div>
        <div className={classes.loadingRow}>
          {signInLoading && <CircularProgress className={classes.loadingProgress} />}
        </div>
        <div className={classes.haveAccountTextRow}>
          <Typography onClick={handleAddNewClick}> Create New Account</Typography>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
