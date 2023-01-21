import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Typography, TextField, Button, InputAdornment, IconButton } from "@mui/material";
import "./SignInPage.scss";
import { makeStyles } from "@mui/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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
});

const getPasswordType = (visible: boolean) => {
  return visible ? "text" : "password";
};

const SignInPage: FC = () => {
  useEffect(() => {
    document.title = "Sign In";
  }, []);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = (): void => {
    // dispatch(set(nickname));
    navigate("/home");
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
        <div className={classes.haveAccountTextRow}>
          <Typography onClick={handleAddNewClick}> Create New Account</Typography>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
