/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Person from '@mui/icons-material/Person';
import Lock from '@mui/icons-material/Lock';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import agent from '../../../api/agent';
import { useContext, useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import SecureTextField from '../../common/SecureTextField';
import { LoginRequest } from '../../../models/users/loginRequest';
import Validator from '../../../common/utils';
import AuthContext from '../../context/AuthContext';

const USERNAME_REGEX = '^[a-zA-Z0-9_–-\\s&()\\.,/]*$';

const emptyLoginRequest: LoginRequest = {
  username: '',
  password: '',
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useContext(AuthContext);

  const rememberMeDefault = localStorage.getItem('remember-me');

  const [loginRequest, setLoginRequest] =
    useState<LoginRequest>(emptyLoginRequest);
  const [dirtyProps, setDirtyProps] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formValid, setFormValid] = useState<boolean>(false);
  const [submitFailed, setSubmitFailed] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(
    JSON.parse(rememberMeDefault),
  );

  const handleSubmit = async () => {
    const isValid = Object.values(validationSchema).every((x) => x.valid);
    setFormValid(isValid);

    setSubmitting(true);
    setSubmitFailed(false);
    if (!isValid) return;

    const result = await agent.Users.login(loginRequest);

    if (!result.isSuccess) {
      setSubmitFailed(true);
      setSubmitting(false);
      return;
    }

    setUserInfo(result.data);
    setSubmitting(false);

    if (rememberMe) {
      window.API.storeCredentials(loginRequest);
    } else {
      window.API.clearCredentials();
    }

    navigate('/');
  };

  const handleRememberMe = (e: any) => {
    localStorage.setItem('remember-me', e.target.checked);
    setRememberMe(e.target.checked);
  };

  const loadCredsAsync = async () => {
    const creds = await window.API.getCredentials();

    if (creds) {
      setLoginRequest(creds);
      setDirtyProps(['username', 'password']);
    }
  };

  useEffect(() => {
    // HACK: Fix for broken characters in <TextField>
    // Characters are broken after the app is packaged.
    document.querySelectorAll('.notranslate').forEach((e) => {
      e.innerHTML = '&ZeroWidthSpace;';
    });

    loadCredsAsync();
  }, []);

  const validationSchema = {
    username: Validator.validate(loginRequest!.username, [
      {
        match: USERNAME_REGEX,
        message: 'Please provide valid username!',
      },
      {
        max: 16,
        message: 'Maximum length is 16 characters!',
      },
    ]),
    password: Validator.validate(loginRequest!.password, [
      {
        max: 50,
        message: 'Maximum length is 50 characters!',
      },
      { match: '.*', message: 'This error will never appear!' },
    ]),
  };

  return (
    <>
      <Grid
        columnGap={2}
        rowGap={2}
        container
        columns={{ xs: 12 }}
        sx={{ mt: 12, pl: 2, pr: 2 }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <SecureTextField
            testId="username-input"
            value={loginRequest!.username}
            entity={loginRequest}
            setEntity={setLoginRequest}
            propertyName="username"
            dirtyProps={dirtyProps}
            setDirtyProps={setDirtyProps}
            validObj={validationSchema.username}
            submitting={submitting}
            disabled={submitting && formValid}
            size="small"
            inputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <SecureTextField
            testId="password-input"
            type="password"
            value={loginRequest!.password}
            entity={loginRequest}
            setEntity={setLoginRequest}
            propertyName="password"
            dirtyProps={dirtyProps}
            setDirtyProps={setDirtyProps}
            validObj={validationSchema.password}
            submitting={submitting}
            disabled={submitting && formValid}
            size="small"
            inputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sx={{ ml: 2 }}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox />}
              checked={rememberMe}
              onChange={handleRememberMe}
              label="Remember me?"
              sx={{ mt: -1 }}
            />
          </FormGroup>
        </Grid>
      </Grid>
      <Box
        sx={{
          width: '333px',
          position: 'fixed',
          bottom: 15,
          mr: 2,
        }}
      >
        <Grid
          columnGap={2}
          rowGap={2}
          container
          columns={{ xs: 12 }}
          sx={{
            pl: 2,
            pr: 2,
          }}
        >
          <Grid item xs={12} sx={{ mt: 5 }}>
            {submitFailed && (
              <Box
                sx={{
                  color: '#ff6e63',
                  textAlign: 'center',
                  mb: 1,
                }}
              >
                Invalid username or password!
              </Box>
            )}

            <LoadingButton
              sx={{
                transition: 'transform 0.2s ease-out',
                width: '100%',
                height: '70px',
                fontSize: 20,
              }}
              disabled={dirtyProps.length === 0}
              loading={submitting && formValid}
              loadingIndicator={
                <div className="loader" style={{ width: 20, height: 20 }}></div>
              }
              variant="contained"
              onClick={handleSubmit}
            >
              Login
            </LoadingButton>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: -0.5,
            }}
          >
            <span style={{ fontSize: 14 }}>
              <Link
                onClick={() => {
                  navigate('/register');
                }}
              >
                Register a free account
              </Link>{' '}
              or <Link>Play as Guest</Link>
            </span>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: -1.5,
            }}
          >
            <span style={{ fontSize: 14 }}>
              <Link>Can't log in?</Link>
            </span>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default LoginPage;
