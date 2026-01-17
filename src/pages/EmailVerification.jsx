import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const EmailVerification = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [resending, setResending] = useState(false);
    const [message, setMessage] = useState('');
    const [pendingUser, setPendingUser] = useState(null);

    const token = searchParams.get('token');

    useEffect(() => {
        // Check if we have a pending verification user from login
        const pendingUserData = localStorage.getItem('pending_verification_user');
        if (pendingUserData) {
            try {
                const user = JSON.parse(pendingUserData);
                setPendingUser(user);
                localStorage.removeItem('pending_verification_user'); // Clean up
            } catch (error) {
                console.error('Error parsing pending user data:', error);
            }
        }

        if (token) {
            handleVerification(token);
        }
    }, [token]);

    const handleVerification = async (verificationToken) => {
        setVerifying(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/email/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: verificationToken }),
            });

            const data = await response.json();

            if (response.ok) {
                setVerified(true);
                setMessage('Email verified successfully! You can now log in.');
                // Store user data in localStorage for future use
                localStorage.setItem('hireveu_user', JSON.stringify(data.data.user));
            } else {
                setMessage(data.message || 'Verification failed. Please try again.');
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    const handleResendVerification = async () => {
        const email = pendingUser?.email || prompt('Please enter your email address:');
        if (!email) return;

        setResending(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/email/resend-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Verification email sent successfully! Please check your inbox.');
            } else {
                setMessage(data.message || 'Failed to send verification email.');
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
        } finally {
            setResending(false);
        }
    };

    const handleRequestVerification = async () => {
        const email = pendingUser?.email || prompt('Please enter your email address:');
        if (!email) return;

        setResending(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/email/send-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Verification email sent successfully! Please check your inbox.');
            } else {
                setMessage(data.message || 'Failed to send verification email.');
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
        } finally {
            setResending(false);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    if (verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Verifying your email...
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Please wait while we verify your email address.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (verified) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Email Verified!
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            {message}
                        </p>
                        <div className="mt-8">
                            <Button
                                onClick={handleLoginRedirect}
                                className="w-full"
                            >
                                Continue to Login
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // If we have a pending user but no token, show request verification UI
    if (pendingUser && !token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Email Verification Required
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Your account ({pendingUser.email}) needs email verification before you can log in.
                        </p>

                        {message && (
                            <div className={`mt-4 p-4 rounded-md ${message.includes('successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                {message}
                            </div>
                        )}

                        <div className="mt-8 space-y-4">
                            <Button
                                onClick={handleRequestVerification}
                                disabled={resending}
                                className="w-full"
                            >
                                {resending ? 'Sending...' : 'Send Verification Email'}
                            </Button>

                            <Button
                                onClick={handleLoginRedirect}
                                variant="outline"
                                className="w-full"
                            >
                                Back to Login
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Check Your Email
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        We've sent you a verification link. Please check your email and click the link to verify your account.
                    </p>

                    {message && (
                        <div className={`mt-4 p-4 rounded-md ${message.includes('successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                            {message}
                        </div>
                    )}

                    <div className="mt-8 space-y-4">
                        <Button
                            onClick={handleResendVerification}
                            disabled={resending}
                            variant="outline"
                            className="w-full"
                        >
                            {resending ? 'Sending...' : 'Resend Verification Email'}
                        </Button>

                        <Button
                            onClick={handleLoginRedirect}
                            className="w-full"
                        >
                            Back to Login
                        </Button>
                    </div>

                    <p className="mt-4 text-center text-xs text-gray-500">
                        Didn't receive the email? Check your spam folder or click "Resend" above.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
