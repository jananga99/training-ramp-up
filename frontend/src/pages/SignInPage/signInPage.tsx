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
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { User } from "../../utils/user";
import { signInUser } from "../SignUpPage/userSlice";
import { RootState } from "../../utils/store";

const styles = {
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
};

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

  return (
    <Box sx={styles.body}>
      <Box sx={styles.signInBox}>
        <Box sx={styles.signInTitle}>Sign In</Box>
        <Box sx={styles.inputRow}>
          <TextField
            sx={styles.inputData}
            label="Email"
            value={email}
            type="email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </Box>
        <Box sx={styles.inputRow}>
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

        <Box sx={styles.submitButtonRow}>
          <Button
            sx={styles.submitButton}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Sign In
          </Button>
        </Box>
        <Box sx={styles.loadingRow}>
          {signInLoading && <CircularProgress sx={styles.loadingProgress} />}
        </Box>
        <Box sx={styles.haveAccountTextRow}>
          <Typography onClick={handleAddNewClick}> Create New Account</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SignInPage;
