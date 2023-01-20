import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { TextField, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

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
});

const SignUpPage: FC = () => {
  useEffect(() => {
    document.title = "Sign Up";
  }, []);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = (): void => {
    // dispatch(set(nickname));
    navigate("/");
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
            type="password"
            onChange={(event) => setPassword(event.target.value)}
            sx={{ borderRadius: 10, margin: 2, width: 500 }}
          />
        </div>
        <div className={classes.inputRow}>
          <TextField
            className={classes.inputData}
            label="Confirm Password"
            value={confirmPassword}
            type="password"
            onChange={(event) => setConfirmPassword(event.target.value)}
            sx={{ borderRadius: 10, margin: 2, width: 500 }}
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
        <div className={classes.haveAccountTextRow}>
          <Typography onClick={handleHaveAccountClick}> Already have an account?</Typography>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
