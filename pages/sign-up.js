import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import Router from 'next/router';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  StepConnector,
  withStyles,
  makeStyles,
  Zoom,
  Grid,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import {
  ArrowBack,
  Check,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import { useForm } from 'react-hook-form';

import { Slides, Slide } from '../components/slides';
import AvatarEdit from '../components/AvatarEdit';
import RegisterInfo from '../components/RegisterInfo/RegisterInfo';
import firebase from '../utils/firebase';

const Connector = withStyles((theme) => ({
  alternativeLabel: {
    top: 10,
    color: 'currentColor',
  },
  active: {
    '& $line': {
      borderColor: theme.palette.primary.main,
    },
  },
  completed: {
    '& $line': {
      borderColor: theme.palette.primary.main,
    },
  },
  line: {
    transition: theme.transitions.create('border-color', {
      duration: theme.transitions.duration.short,
    }),
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1.5,
  },
}))(StepConnector);

const useStepIconStyles = makeStyles((theme) => ({
  root: {
    color: '#eaeaf0',
    height: 22,
    position: 'relative',
    '& > *': {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    },
  },
  active: {
    color: theme.palette.primary.main,
  },
  circle: {
    width: theme.spacing(1.5),
    height: theme.spacing(1.5),
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  hideCircle: {
    opacity: 0,
  },
  completed: {
    transition: theme.transitions.create('transform'),
    color: theme.palette.primary.main,
    zIndex: 1,
    fontSize: theme.spacing(3),
  },
}));

function StepIcon(props) {
  const classes = useStepIconStyles();
  const { active, completed } = props;

  return (
    <div className={clsx(classes.root, active && classes.active)}>
      <div>
        <Zoom in={completed}>
          <Check className={classes.completed} />
        </Zoom>
      </div>
      <div>
        <Zoom in={active}>
          <div>
            <div className={classes.circle} />
          </div>
        </Zoom>
      </div>
      <div>
        <div
          className={clsx(
            classes.circle,
            (active || completed) && classes.hideCircle
          )}
        />
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  nav: {
    padding: theme.spacing(0, 1),
    position: 'fixed',
    top: 0,
    left: 0,
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(var(--vh, 1vh) * 100)',
  },
  stepper: {
    padding: theme.spacing(2, 0),
  },
  textField: {
    width: '100%',
    maxWidth: 300,
    margin: theme.spacing(1, 0),
    [theme.breakpoints.up(300 + 2 * theme.spacing(3))]: {
      minWidth: 300,
    },
  },
  card: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(3),
    maxWidth: 600,
    margin: 'auto',
    overflow: 'hidden',
  },
  cardContent: {
    padding: theme.spacing(1, 0),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 350,
  },
  avatarEditContainer: {
    width: '100%',
    maxWidth: 250,
    marginBottom: theme.spacing(2),
  },
  avatarEdit: {
    borderRadius: '50%',
    overflow: 'hidden',
  },
  doneIcon: {
    color: theme.palette.primary.main,
    width: '50%',
    height: '50%',
  },
  confirmButtonsContainer: {
    paddingTop: theme.spacing(4),
  },
  confirmButton: {
    display: 'block',
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const steps = [
    'Sign Up',
    'What should we call you?',
    'What do you look like?',
  ];
  const [activeStep, setActiveStep] = useState(0);
  const [prevActiveStep, setPrevActiveStep] = useState(-1);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    avatar: '',
  });

  const credentialsForm = useForm();
  const nameForm = useForm();
  const avatarForm = useForm();

  const submitCredentialsFormRef = useRef(null);
  const submitNameFormRef = useRef(null);
  const submitAvatarFormRef = useRef(null);

  async function submitCredentialsForm() {
    await credentialsForm.trigger();

    const isValid = credentialsForm.formState.isValid;

    submitCredentialsFormRef.current?.dispatchEvent(new Event('submit'));

    return isValid
      ? Promise.resolve({ values: credentialsForm.getValues() })
      : Promise.reject({ errors: credentialsForm.formState.errors });
  }

  async function submitNameForm() {
    await nameForm.trigger();

    const isValid = nameForm.formState.isValid;

    submitNameFormRef.current?.dispatchEvent(new Event('submit'));

    return isValid
      ? Promise.resolve({ values: nameForm.getValues() })
      : Promise.reject({ errors: nameForm.formState.errors });
  }

  async function submitAvatarForm() {
    await avatarForm.trigger();

    submitAvatarFormRef.current?.dispatchEvent(new Event('submit'));

    const isValid = avatarForm.formState.isValid;

    return isValid
      ? Promise.resolve({ values: avatarForm.getValues() })
      : Promise.reject({ errors: avatarForm.formState.errors });
  }

  function onSubmitCredentials({ email, password }) {
    setFormData((formData) => ({ ...formData, email, password }));
  }

  function onSubmitName({ name }) {
    setFormData((formData) => ({ ...formData, name }));
  }

  function onSubmitAvatar({ avatar }) {
    setFormData((formData) => ({ ...formData, avatar }));
  }

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function onTogglePasswordVisibility() {
    setIsPasswordVisible((isVisible) => !isVisible);
  }

  async function onRegister() {
    try {
      const auth = firebase.auth();
      await auth.createUserWithEmailAndPassword(
        formData.email,
        formData.password
      );
      const { user } = await auth.signInWithEmailAndPassword(
        formData.email,
        formData.password
      );
      const storage = firebase.storage();
      if (formData.avatar && formData.avatar[0]) {
        const storageRef = await storage.ref();
        console.log({ formData });
        const fileUploadPath = `avatars/users/${user.uid}/${formData.avatar[0].name}`;
        const uploadResult = await storageRef
          // @ts-ignore
          .child(fileUploadPath)
          // @ts-ignore
          .put(formData.avatar[0]);

        const photoURL = await storageRef
          .child(fileUploadPath)
          .getDownloadURL();

        await user.updateProfile({
          displayName: formData.name,
          photoURL,
        });
      }
      Router.push('/todos');
    } catch (err) {
      console.error(err);
    }
  }

  async function onNextStep() {
    try {
      if (activeStep === 0) {
        await submitCredentialsForm();
      } else if (activeStep === 1) {
        await submitNameForm();
      } else if (activeStep === 2) {
        await submitAvatarForm();
      }

      setPrevActiveStep(activeStep);
      setActiveStep((step) => step + 1);
    } catch (err) {
      console.error(err);
    }
  }

  function onPrevStep() {
    setPrevActiveStep(activeStep);
    setActiveStep((step) => step - 1);
  }

  useEffect(() => {
    if (activeStep === 0) {
      credentialsForm.setValue('email', formData.email);
      credentialsForm.setValue('password', formData.password);
    } else if (activeStep === 1) {
      nameForm.setValue('name', formData.name);
    } else if (activeStep === 2) {
      avatarForm.setValue('avatar', formData.avatar);
    }
  }, [activeStep]);

  useEffect(() => {
    if (prevActiveStep === 0) {
      const { email, password } = credentialsForm.getValues();
      setFormData((formData) => ({ ...formData, email, password }));
    } else if (prevActiveStep === 1) {
      const { name } = nameForm.getValues();
      setFormData((formData) => ({ ...formData, name }));
    } else if (prevActiveStep === 2) {
      const { avatar } = avatarForm.getValues();
      setFormData((formData) => ({ ...formData, avatar }));
    }
  }, [prevActiveStep]);

  return (
    <>
      <nav className={classes.nav}>
        <Button
          onClick={() => Router.push('/sign-in')}
          color="primary"
          startIcon={<ArrowBack />}
        >
          Back to sign in
        </Button>
      </nav>

      <main>
        <div className={classes.root}>
          <div className={classes.card}>
            <Stepper
              className={classes.stepper}
              activeStep={activeStep}
              connector={<Connector />}
              alternativeLabel
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={StepIcon}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Slides>
              <Slide
                index={0}
                activeStep={activeStep}
                prevActiveStep={prevActiveStep}
              >
                <div className={classes.cardContent}>
                  <form
                    onSubmit={credentialsForm.handleSubmit(onSubmitCredentials)}
                    ref={submitCredentialsFormRef}
                  >
                    <Grid
                      container
                      direction="column"
                      justify="center"
                      alignItems="center"
                    >
                      <Grid item>
                        <TextField
                          className={classes.textField}
                          variant="outlined"
                          label="Email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          error={credentialsForm.formState.errors.email}
                          helperText={
                            credentialsForm.formState.errors?.email?.message
                          }
                          inputProps={{
                            ...credentialsForm.register('email', {
                              required: 'Email is required',
                            }),
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          className={classes.textField}
                          variant="outlined"
                          label="Password"
                          name="password"
                          autoComplete="new-password"
                          type={isPasswordVisible ? 'text' : 'password'}
                          error={credentialsForm.formState.errors.password}
                          helperText={
                            credentialsForm.formState.errors?.password?.message
                          }
                          inputProps={{
                            ...credentialsForm.register('password', {
                              required: 'Password is required',
                            }),
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Tooltip title="Show password">
                                  <IconButton
                                    aria-label="Show password"
                                    aria-pressed={isPasswordVisible}
                                    onClick={onTogglePasswordVisibility}
                                  >
                                    {isPasswordVisible ? (
                                      <VisibilityOff />
                                    ) : (
                                      <Visibility />
                                    )}
                                  </IconButton>
                                </Tooltip>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </form>
                </div>
              </Slide>

              <Slide
                index={1}
                activeStep={activeStep}
                prevActiveStep={prevActiveStep}
              >
                <div className={classes.cardContent}>
                  <form
                    onSubmit={nameForm.handleSubmit(onSubmitName)}
                    ref={submitNameFormRef}
                  >
                    <Grid
                      container
                      direction="column"
                      justify="center"
                      alignItems="center"
                    >
                      <Grid item>
                        <TextField
                          className={classes.textField}
                          variant="outlined"
                          label="Name"
                          name="name"
                          type="name"
                          autoComplete="name"
                          error={nameForm.formState.errors.name}
                          helperText={nameForm.formState.errors?.name?.message}
                          inputProps={{
                            ...nameForm.register('name', {
                              required: 'Name is required',
                            }),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </form>
                </div>
              </Slide>

              <Slide
                index={2}
                activeStep={activeStep}
                prevActiveStep={prevActiveStep}
              >
                <div className={classes.cardContent}>
                  <form
                    onSubmit={avatarForm.handleSubmit(onSubmitAvatar)}
                    ref={submitAvatarFormRef}
                  >
                    <div className={classes.avatarEditContainer}>
                      <AvatarEdit
                        className={classes.avatarEdit}
                        register={avatarForm.register}
                      />
                    </div>
                  </form>
                </div>
              </Slide>

              <Slide
                index={3}
                activeStep={activeStep}
                prevActiveStep={prevActiveStep}
              >
                <div className={classes.cardContent}>
                  <RegisterInfo
                    avatar={formData.avatar[0]}
                    name={formData.name}
                    email={formData.email}
                  />
                </div>
              </Slide>
            </Slides>

            <div
              style={activeStep > steps.length ? { visibility: 'hidden' } : {}}
            >
              <Button
                color="primary"
                variant="text"
                disabled={activeStep === 0}
                onClick={onPrevStep}
              >
                back
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={activeStep === steps.length ? onRegister : onNextStep}
              >
                {activeStep < steps.length - 1
                  ? 'next'
                  : activeStep === steps.length - 1
                  ? 'done'
                  : 'confirm'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
