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
  Box,
} from "@mui/material";
import { userValidationSchema } from "../../utils/validation/validation";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createUser } from "./userSlice";
import { User } from "../../utils/user";
import { RootState } from "../../utils/store";

const styles = {
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
};

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

  return (
    <Box component="div" sx={styles.body}>
      <Box component="div" sx={styles.signUpBox}>
        <Box component="div" sx={styles.signUpTitle}>
          Sign Up
        </Box>
        <Box component="div" sx={styles.inputRow}>
          <TextField
            sx={styles.inputData}
            label="Email"
            value={email}
            type="email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </Box>
        <Box component="div" sx={styles.inputRow}>
          <TextField
            sx={styles.inputData}
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
        </Box>
        <Box component="div" sx={styles.passwordTextRow}>
          <Typography sx={styles.passwordText}>
            *Password must contain at least one lower case letter, upper case letter, number, and a
            symbol
          </Typography>
        </Box>
        <Box component="div" sx={styles.inputRow}>
          <TextField
            sx={styles.inputData}
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
        </Box>
        <Box component="div" sx={styles.submitButtonRow}>
          <Button
            sx={styles.submitButton}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
        </Box>
        <Box component="div" sx={styles.loadingRow}>
          {createLoading && <CircularProgress sx={styles.loadingProgress} />}
        </Box>
        <Box component="div" sx={styles.haveAccountTextRow}>
          <Typography onClick={handleHaveAccountClick}> Already have an account?</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUpPage;
