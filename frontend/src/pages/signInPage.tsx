import { FC, useEffect, useState } from "react";

import { TextField, Button, InputAdornment, IconButton, Box } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import jwt from "jsonwebtoken";

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

// jwt.verify(
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InFAcS5jb20iLCJpYXQiOjE2NzQzMjM1NDcsImV4cCI6MTY3NDMyNDE0N30.4rFwhi_qi2z8QUNd5EcQ48j6SLdaQD74e1cTc0HxUlY",
//     "gghj4hjdf@#^d"
// );

const SignInPage: FC = () => {
  useEffect(() => {
    document.title = "Sign In";
  }, []);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = (): void => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    try {
      const res = jwt.verify(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InFAcS5jb20iLCJpYXQiOjE2NzQzMjM1NDcsImV4cCI6MTY3NDMyNDE0N30.4rFwhi_qi2z8QUNd5EcQ48j6SLdaQD74e1cTc0HxUlY",
        "gghj4hjdf@#^d"
      );
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <Box component="div" sx={styles.body}>
      <Box component="div" sx={styles.signInBox}>
        <Box component="div" sx={styles.signInTitle}>
          Sign In
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

        <Box component="div" sx={styles.submitButtonRow}>
          <Button
            sx={styles.submitButton}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SignInPage;
