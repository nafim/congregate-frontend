import React, { useEffect, useState } from 'react';
import {
    CircularProgress,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Typography
} from '@material-ui/core';
import ArrowForward from '@material-ui/icons/ArrowForward';
import { makeStyles } from '@material-ui/core/styles';
import { getUserToken, register } from '../../api/HTTPRequests';
import { useHistory, useLocation } from 'react-router';
import { useSnackbar } from 'notistack';
import constants from '../../constants';

const useStyles = makeStyles((theme) => ({
    heroContent: {
        padding: theme.spacing(8, 0, 6),
    },
    menuContainer: {
        border: '2px solid rgba(0, 0, 0, 0.12)',
        padding: theme.spacing(2,2,0),
        display: 'inline-flex',
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    introTitle: {
        color: theme.palette.primary.dark,
        "font-family": "Arial, cursive",
        "font-size": "4.7rem",
        "text-align": "center",
        marginBottom: theme.spacing(8)
    },
    item: {
        margin: theme.spacing(0, 0, 2)
    }
}));

function Intro() {
    const classes = useStyles();
    const query = new URLSearchParams(useLocation().search);
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();

    const [promptUsername, setPromptUsername] = useState(false);

    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorText, setUsernameErrorText] = useState("");

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
        setUsernameError(false);
        setUsernameErrorText("");
    }

    const isValidUsername = () => {
        if (!username) {
            setUsernameError(true);
            setUsernameErrorText("Please enter a username")
            return false;
        } else {
            return true;
        }
    }

    const handleEnterUsername = () => {
        if (isValidUsername()) {
            register(username, query.get("key")!)
            .then(data => {
                if (data.errors) {
                    if (data.errors.length > 0) {
                        const error = data.errors[0];
                        if (error.param === 'username') {
                            setUsernameError(true);
                            setUsernameErrorText(error.msg);
                        } else {
                            enqueueSnackbar(constants.ERROR_MESSAGE, { 
                                variant: 'error',
                            })
                        }
                    }
                } else {
                    history.push('/');
                }
            })
            .catch(err => {
                enqueueSnackbar(constants.ERROR_MESSAGE, { 
                    variant: 'error',
                })
            })
        }
    }

    useEffect(() => {
        // if theres no query key, then 
        if (!query.get("key")) {
            return history.push('/');
        }
        getUserToken(query.get("key")!)
        .then(data => {
            if (data.error) {
                // if there is an error it has to be invalid key, so just reroute home
                return history.push('/');
            }
            if (data.registered) {
                return history.push('/');
            } else {
                setPromptUsername(true);
            }
        })
        .catch(err => {
            enqueueSnackbar(constants.ERROR_MESSAGE, { 
                variant: 'error',
            })
        })
    },[])

    return (
        <div className={classes.heroContent}>
            <div>
                <Typography className={classes.introTitle}>{process.env.REACT_APP_WEBSITE_NAME!}</Typography>
            </div>
            <div className={classes.centered}>
                <div className={classes.menuContainer}>
                    {!promptUsername &&
                        <div>
                            <div className={classes.centered}>
                                <Typography className={classes.item} color='textSecondary'>
                                    Verifying ...
                                </Typography>
                            </div>
                            <div className={classes.centered}>
                                <CircularProgress className={classes.item} />
                            </div>
                        </div>
                    }
                    {promptUsername &&
                        <div>
                            <Typography variant='subtitle1' align='center' color='textSecondary'>
                                Create your username:
                            </Typography>
                            <form className={classes.item} noValidate autoComplete="off" onSubmit={(e) => {
                                e.preventDefault();
                                handleEnterUsername();
                            }}>
                                <FormControl error={usernameError}>
                                    <OutlinedInput
                                        id="gameID"
                                        type='text'
                                        placeholder='Username'
                                        value={username}
                                        onChange={handleUsernameChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="submit login info"
                                                edge="end"
                                                onClick={handleEnterUsername}
                                                >
                                                    <ArrowForward />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    <FormHelperText id="username-error-text">{usernameErrorText}</FormHelperText>
                                </FormControl>
                            </form>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Intro;