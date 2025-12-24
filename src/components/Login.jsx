import '../App.css'
import {React, useState} from 'react'
import { Box, Typography, Alert, Fade, Grid, Paper, Stack } from '@mui/material'
import MyTextField from './forms/MyTextField'
import MyPassField from './forms/MyPassField'
import MyButton from './forms/MyButton'
import {Link} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import AxiosInstance from './AxiosInstance'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.svg'
import backgroundImage from '../assets/background-login.jpg'

// Couleurs de l'entreprise
const COMPANY_COLORS = {
  darkCyan: '#003C3f',
  vividOrange: '#DA4A0E',
  black: '#000000',
  darkCyanLight: 'rgba(0, 60, 63, 0.1)',
  vividOrangeLight: 'rgba(218, 74, 14, 0.1)',
  darkCyanTransparent: 'rgba(0, 60, 63, 0.8)'
}

const Login = () => {
    const navigate = useNavigate()
    
    const { handleSubmit, control } = useForm({
        defaultValues: {
            email: '', 
            password: ''
        }
    });

    const [showMessage, setShowMessage] = useState(false)
    const [messageText, setMessageText] = useState('')
    const [messageType, setMessageType] = useState('error')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (data) => {
        setLoading(true)
        setShowMessage(false)
        console.log('🔐 Attempting login with:', data.email)
        
        try {
            const response = await AxiosInstance.post('login/', {
                email: data.email, 
                password: data.password,
            })
            
            console.log('✅ Login successful')
            console.log('✅ User data:', response.data.user)
            console.log('✅ Token received:', response.data.token ? 'YES' : 'NO')
            
            // Stocker le token et les données utilisateur
            localStorage.setItem('Token', response.data.token)
            localStorage.setItem('User', JSON.stringify(response.data.user))
            
            // Vérifier ce qui est stocké
            console.log('💾 Stored Token:', localStorage.getItem('Token'))
            console.log('💾 Stored User:', localStorage.getItem('User'))
            
            // ✅ REDIRECTION VERS DASHBOARD
            navigate('/dashboard')
            
        } catch (error) {
            console.error('❌ Login error:', error)
            
            let errorMessage = 'Login failed. Please try again.'
            
            if (error.response) {
                console.error('📡 Server response:', error.response.status)
                console.error('📡 Server data:', error.response.data)
                
                if (error.response.status === 401) {
                    errorMessage = 'Invalid email or password'
                } else if (error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error
                } else {
                    errorMessage = 'Login failed. Please try again.'
                }
            } else if (error.request) {
                console.error('🌐 No response received')
                errorMessage = 'Cannot connect to server. Please check your connection.'
            } else {
                console.error('⚙️ Request error:', error.message)
                errorMessage = 'Login failed. Please try again.'
            }
            
            setMessageText(errorMessage)
            setMessageType('error')
            setShowMessage(true)
            
            // Auto-hide message after 5 seconds
            setTimeout(() => {
                setShowMessage(false)
            }, 5000)
        } finally {
            setLoading(false)
        }
    }

    return(
        <Box 
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                }
            }}
        >
            {/* Message Alert */}
            <Fade in={showMessage}>
                <Box sx={{ 
                    position: 'fixed',
                    top: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                    width: '90%',
                    maxWidth: 400
                }}>
                    <Alert 
                        severity={messageType}
                        onClose={() => setShowMessage(false)}
                        sx={{
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            backgroundColor: 'white',
                            fontWeight: 500,
                            borderLeft: messageType === 'error' ? `4px solid ${COMPANY_COLORS.vividOrange}` : '4px solid #4caf50',
                        }}
                    >
                        {messageText}
                    </Alert>
                </Box>
            </Fade>
            
            {/* Conteneur principal avec deux colonnes */}
            <Grid 
                container 
                sx={{
                    maxWidth: 1200,
                    width: '90%',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    height: { xs: 'auto', md: 650 },
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Colonne gauche - Image */}
                <Grid 
                    item 
                    xs={12} 
                    md={6}
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(135deg, ${COMPANY_COLORS.darkCyanTransparent} 0%, rgba(0, 60, 63, 0.6) 100%)`,
                        }
                    }}
                >
                    {/* Contenu superposé sur l'image */}
                    <Box
                        sx={{
                            position: 'relative',
                            zIndex: 2,
                            padding: 6,
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography 
                            variant="h3" 
                            sx={{ 
                                fontWeight: 700,
                                mb: 3,
                                fontSize: { md: '2.5rem', lg: '3rem' }
                            }}
                        >
                            Welcome Back
                        </Typography>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                mb: 4,
                                opacity: 0.9,
                                fontWeight: 300,
                                lineHeight: 1.6
                            }}
                        >
                            Sign in to access your dashboard and continue your journey with us.
                        </Typography>
                        <Box sx={{ mt: 4 }}>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    opacity: 0.8,
                                    fontStyle: 'italic'
                                }}
                            >
                                "The only way to do great work is to love what you do."
                            </Typography>
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    opacity: 0.6,
                                    display: 'block',
                                    mt: 1
                                }}
                            >
                                - Steve Jobs
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Colonne droite - Formulaire */}
                <Grid 
                    item 
                    xs={12} 
                    md={6}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: { xs: 4, md: 6 },
                        backgroundColor: 'white'
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            width: '100%',
                            maxWidth: 450,
                            background: 'transparent',
                            padding: 0
                        }}
                    >
                        <form onSubmit={handleSubmit(handleLogin)}>
                            <Box 
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    mb: 4
                                }}
                            >
                                {/* Logo */}
                                <Box sx={{ 
                                    mb: 3,
                                    padding: '16px',
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    boxShadow: `0 8px 30px ${COMPANY_COLORS.darkCyanLight}`,
                                    width: '100px',
                                    height: '100px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: `1px solid ${COMPANY_COLORS.darkCyanLight}`
                                }}>
                                    <img 
                                        src={logo} 
                                        alt="Logo" 
                                        style={{ 
                                            width: '70px', 
                                            height: '70px',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </Box>
                                
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        textAlign: 'center', 
                                        mb: 1,
                                        fontWeight: 700,
                                        color: COMPANY_COLORS.darkCyan
                                    }}
                                >
                                    Welcome Back
                                </Typography>
                                <Typography variant="body1" sx={{ 
                                    color: COMPANY_COLORS.black, 
                                    textAlign: 'center',
                                    mb: 4,
                                    opacity: 0.7
                                }}>
                                    Sign in to access your dashboard
                                </Typography>
                            </Box>

                            {/* Email Field */}
                            <Box sx={{ mb: 3 }}>
                                <MyTextField
                                    label="Email Address"
                                    name="email"
                                    control={control}
                                    rules={{ 
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    }}
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            backgroundColor: 'white',
                                            '&:hover fieldset': {
                                                borderColor: COMPANY_COLORS.darkCyan,
                                                borderWidth: '2px'
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: COMPANY_COLORS.darkCyan,
                                                borderWidth: '2px'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: COMPANY_COLORS.black,
                                            opacity: 0.7,
                                            '&.Mui-focused': {
                                                color: COMPANY_COLORS.darkCyan
                                            }
                                        }
                                    }}
                                />
                            </Box>

                            {/* Password Field */}
                            <Box sx={{ mb: 3 }}>
                                <MyPassField
                                    label="Password"
                                    name="password"
                                    control={control}
                                    rules={{ 
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        }
                                    }}
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            backgroundColor: 'white',
                                            '&:hover fieldset': {
                                                borderColor: COMPANY_COLORS.darkCyan,
                                                borderWidth: '2px'
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: COMPANY_COLORS.darkCyan,
                                                borderWidth: '2px'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: COMPANY_COLORS.black,
                                            opacity: 0.7,
                                            '&.Mui-focused': {
                                                color: COMPANY_COLORS.darkCyan
                                            }
                                        }
                                    }}
                                />
                            </Box>

                            {/* Lien "Forgot Password" */}
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'flex-end',
                                mb: 4
                            }}>
                                <Link 
                                    to="/request/password_reset" 
                                    style={{
                                        color: COMPANY_COLORS.darkCyan,
                                        textDecoration: 'none',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            color: COMPANY_COLORS.vividOrange,
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Forgot your password?
                                </Link>
                            </Box>

                            {/* Login Button */}
                            <Box sx={{ mb: 3 }}>
                                <MyButton 
                                    label={loading ? "Logging in..." : "Login to Dashboard"}
                                    type="submit"
                                    disabled={loading}
                                    loading={loading}
                                    fullWidth
                                    sx={{
                                        height: '56px',
                                        backgroundColor: `${COMPANY_COLORS.darkCyan} !important`,
                                        color: 'white !important',
                                        fontWeight: '600 !important',
                                        fontSize: '16px !important',
                                        textTransform: 'none',
                                        borderRadius: '12px !important',
                                        boxShadow: `0 8px 25px ${COMPANY_COLORS.darkCyan}40 !important`,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important',
                                        '&:hover': {
                                            backgroundColor: `${COMPANY_COLORS.vividOrange} !important`,
                                            boxShadow: `0 12px 30px ${COMPANY_COLORS.vividOrange}40 !important`,
                                            transform: 'translateY(-3px) !important'
                                        },
                                        '&:active': {
                                            transform: 'translateY(0) !important'
                                        },
                                        '&:disabled': {
                                            backgroundColor: '#e0e0e0 !important',
                                            color: '#9e9e9e !important',
                                            boxShadow: 'none !important',
                                            transform: 'none !important'
                                        }
                                    }}
                                />
                            </Box>

                            {/* Lien "Register" */}
                            <Box sx={{ 
                                textAlign: 'center',
                                mb: 4
                            }}>
                                <Typography variant="body2" sx={{ color: COMPANY_COLORS.black, mb: 1, opacity: 0.7 }}>
                                    Don't have an account?
                                </Typography>
                                <Link 
                                    to="/register" 
                                    style={{
                                        color: COMPANY_COLORS.vividOrange,
                                        textDecoration: 'none',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease',
                                        padding: '8px 24px',
                                        borderRadius: '25px',
                                        backgroundColor: COMPANY_COLORS.vividOrangeLight,
                                        display: 'inline-block',
                                        '&:hover': {
                                            color: 'white',
                                            backgroundColor: COMPANY_COLORS.vividOrange,
                                            textDecoration: 'none',
                                            transform: 'translateY(-1px)',
                                            boxShadow: `0 4px 15px ${COMPANY_COLORS.vividOrange}40`
                                        }
                                    }}
                                >
                                    Create account
                                </Link>
                            </Box>

                            {/* Séparateur */}
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                mb: 4,
                                opacity: 0.5
                            }}>
                                <Box sx={{ flex: 1, height: '1px', backgroundColor: COMPANY_COLORS.darkCyanLight }} />
                                <Typography variant="body2" sx={{ mx: 2, color: COMPANY_COLORS.darkCyan }}>
                                    OR
                                </Typography>
                                <Box sx={{ flex: 1, height: '1px', backgroundColor: COMPANY_COLORS.darkCyanLight }} />
                            </Box>

                            {/* Liens supplémentaires */}
                            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                                <Link 
                                    to="/privacy" 
                                    style={{
                                        color: COMPANY_COLORS.darkCyan,
                                        textDecoration: 'none',
                                        fontSize: '0.8rem',
                                        fontWeight: '500',
                                        '&:hover': {
                                            color: COMPANY_COLORS.vividOrange,
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Privacy Policy
                                </Link>
                                <Typography variant="caption" sx={{ color: COMPANY_COLORS.darkCyan, opacity: 0.5 }}>•</Typography>
                                <Link 
                                    to="/terms" 
                                    style={{
                                        color: COMPANY_COLORS.darkCyan,
                                        textDecoration: 'none',
                                        fontSize: '0.8rem',
                                        fontWeight: '500',
                                        '&:hover': {
                                            color: COMPANY_COLORS.vividOrange,
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Terms of Service
                                </Link>
                                <Typography variant="caption" sx={{ color: COMPANY_COLORS.darkCyan, opacity: 0.5 }}>•</Typography>
                                <Link 
                                    to="/contact" 
                                    style={{
                                        color: COMPANY_COLORS.darkCyan,
                                        textDecoration: 'none',
                                        fontSize: '0.8rem',
                                        fontWeight: '500',
                                        '&:hover': {
                                            color: COMPANY_COLORS.vividOrange,
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Contact Support
                                </Link>
                            </Stack>

                            {/* Footer */}
                            <Box sx={{ 
                                pt: 3,
                                borderTop: `1px solid ${COMPANY_COLORS.darkCyanLight}`,
                                textAlign: 'center'
                            }}>
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: COMPANY_COLORS.black,
                                        opacity: 0.6,
                                        fontSize: '0.8rem',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    Secure authentication system • © {new Date().getFullYear()}
                                </Typography>
                            </Box>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Login