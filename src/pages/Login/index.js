import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography
} from '@material-ui/core';
import { useDispatch, useSelector } from "react-redux";
import firebase from '../../config/firebase';
import LoginLogo from './LoginLogo';
import GroupLogo from './GroupLogo';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <Helmet>
        <title>Samsat Admin Dashboard</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: 'samsatdashboard@gmail.com',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={(values) => {
              console.log("submit")
              firebase
                .auth()
                .signInWithEmailAndPassword(values.email, values.password)
                .then(() => {
                  dispatch({type: 'LOGIN'});
                  navigate('/app/vehicles');
                })
                .catch(error => {
                  console.log(error.message);
                });
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form onSubmit={handleSubmit}>
                <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 6 }}>
                  <LoginLogo/>
                </Box>
                <Grid container  spacing={3} >
                </Grid>
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    // disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in
                  </Button>
                </Box>
            {/* <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 6 }}>
                  <GroupLogo/>
                </Box> */}
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default Login;
