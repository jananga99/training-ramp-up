import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { userValidationSchema } from "../../utils/validation/validation";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createUser } from "./userSlice";
import { User } from "../../utils/user";
import { RootState } from "../../utils/store";

const useStyles = makeStyles({
  body: {
    backgroundColor: "#34b4eb",
    height: window.innerHeight,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  signUpBox: {
    width: "630px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "30px",
  },
  signUpTitle: {
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

const SignUpPage: FC = () => {
  useEffect(() => {
    document.title = "Sign Up";
  }, []);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const createLoading = useSelector((state: RootState) => state.user.createLoading);

  const handleSubmit = (): void => {
    // navigate("/");
    userValidationSchema
      .validate(
        {
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        },
        { abortEarly: false }
      )
      .then(() => {
        const newUser: User = {
          email: email,
          password: password,
        };
        dispatch(createUser(newUser));
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);
      })
      .catch((err) => {
        alert(err.errors[0]);
      });
  };

  const handleHaveAccountClick = () => {
    navigate("/");
  };

  const classes = useStyles();

  return (
    <div className={classes.body}>
      <div className={classes.signUpBox}>
        <div className={classes.signUpTitle}>Sign Up</div>
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
        <div className={classes.passwordTextRow}>
          <Typography className={classes.passwordText}>
            *Password must contain at least one lower case letter, upper case letter, number, and a
            symbol
          </Typography>
        </div>
        <div className={classes.inputRow}>
          <TextField
            className={classes.inputData}
            label="Confirm Password"
            value={confirmPassword}
            type={getPasswordType(showConfirmPassword)}
            onChange={(event) => setConfirmPassword(event.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
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
            Sign Up
          </Button>
        </div>
        <div className={classes.loadingRow}>
          {createLoading && <CircularProgress className={classes.loadingProgress} />}
        </div>
        <div className={classes.haveAccountTextRow}>
          <Typography onClick={handleHaveAccountClick}> Already have an account?</Typography>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
