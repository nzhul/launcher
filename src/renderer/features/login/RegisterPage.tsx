/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Person from '@mui/icons-material/Person';
import Lock from '@mui/icons-material/Lock';
import Email from '@mui/icons-material/Email';
import LoadingButton from '@mui/lab/LoadingButton';
import { Grid, InputAdornment, Box, Link } from '@mui/material';
import SecureTextField from '../../common/SecureTextField';
import { RegisterRequest } from '../../../models/users/registerRequest';
import { useEffect, useState } from 'react';
import Validator from '../../../common/utils';
import { useNavigate } from 'react-router-dom';

const USERNAME_REGEX = '^[a-zA-Z0-9_–-\\s&()\\.,/]*$';
const EMAIL_REGEX =
  '^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\\.(?!\\.))|[-!#\\$%&\\*\\+/=\\?\\^`\\{\\}\\|~\\w])*)(?<=[-_0-9a-z])@))(?(\\[)(\\[(\\d{1,3}\\.){3}\\d{1,3}\\])|(([0-9a-z][-0-9a-z]*[0-9a-z]*\\.)+[a-z0-9][\\-a-z0-9]{0,22}[a-z0-9]))$';

const emptyRegisterRequest: RegisterRequest = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const RegisterPage = () => {
  const navigate = useNavigate();

  const [registerRequest, setRegisterRequest] =
    useState<RegisterRequest>(emptyRegisterRequest);
  const [dirtyProps, setDirtyProps] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formValid, setFormValid] = useState<boolean>(false);
  const [submitFailed, setSubmitFailed] = useState<boolean>(false);

  const handleSubmit = async () => {
    console.log('Submit register form!');
  };

  useEffect(() => {
    // HACK: Fix for broken characters in <TextField>
    // Characters are broken after the app is packaged.
    document.querySelectorAll('.notranslate').forEach((e) => {
      e.innerHTML = '&ZeroWidthSpace;';
    });
  }, []);

  const validationSchema = {
    username: Validator.validate(registerRequest!.username, [
      {
        match: USERNAME_REGEX,
        message: 'Please provide valid username!',
      },
      {
        max: 16,
        message: 'Maximum length is 16 characters!',
      },
    ]),
    email: Validator.validate(registerRequest!.email, [
      {
        match: EMAIL_REGEX,
        message: 'Please provide valid email!',
      },
      {
        max: 50,
        message: 'Maximum length is 50 characters!',
      },
    ]),
    password: Validator.validate(registerRequest!.password, [
      {
        max: 50,
        message: 'Maximum length is 50 characters!',
      },
      { match: '.*', message: 'This error will never appear!' },
    ]),
    confirmPassword: Validator.validate(registerRequest!.confirmPassword, [
      {
        max: 50,
        message: 'Maximum length is 50 characters!',
      },
      { match: '.*', message: 'This error will never appear!' },
    ]),
    // TODO: Add matching validator that can be used to compare both passwords!
    // Add it to the confirmPassword field.
  };

  return (
    <>
      <Grid
        columnGap={2}
        rowGap={2}
        container
        columns={{ xs: 12 }}
        sx={{ mt: 8, pl: 2, pr: 2 }}
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
            value={registerRequest!.username}
            entity={registerRequest}
            setEntity={setRegisterRequest}
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
            testId="email-input"
            value={registerRequest!.email}
            entity={registerRequest}
            setEntity={setRegisterRequest}
            propertyName="email"
            dirtyProps={dirtyProps}
            setDirtyProps={setDirtyProps}
            validObj={validationSchema.email}
            submitting={submitting}
            disabled={submitting && formValid}
            size="small"
            inputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
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
            value={registerRequest!.password}
            entity={registerRequest}
            setEntity={setRegisterRequest}
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
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <SecureTextField
            testId="confirmPassword-input"
            type="password"
            value={registerRequest!.confirmPassword}
            entity={registerRequest}
            setEntity={setRegisterRequest}
            propertyName="confirmPassword"
            dirtyProps={dirtyProps}
            setDirtyProps={setDirtyProps}
            validObj={validationSchema.confirmPassword}
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
              Register
            </LoadingButton>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 0,
            }}
          >
            <span style={{ fontSize: 14 }}>
              <Link
                onClick={() => {
                  navigate('/login');
                }}
              >
                Back to login
              </Link>
            </span>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default RegisterPage;
