/* ===================================================
   The Ethnic Touch ΓÇö Login Page Logic
   Firebase Google Auth + Email/Password Auth
   =================================================== */

// ΓöÇΓöÇΓöÇ Firebase Configuration ΓöÇΓöÇΓöÇ
// TODO: Replace with your actual Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyDSrS3zywg8ao1lvK9NWmy1RDR33Nim2h8",
    authDomain: "the-ethnic-touch.firebaseapp.com",
    projectId: "the-ethnic-touch",
    storageBucket: "the-ethnic-touch.firebasestorage.app",
    messagingSenderId: "***REMOVED***",
    appId: "***REMOVED***",
    measurementId: "***REMOVED***"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Add scopes for user profile
googleProvider.addScope('profile');
googleProvider.addScope('email');

// ΓöÇΓöÇΓöÇ DOM Elements ΓöÇΓöÇΓöÇ
const googleSignInBtn = document.getElementById('google-signin-btn');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('login-email');
const passwordInput = document.getElementById('login-password');
const togglePasswordBtn = document.getElementById('toggle-password');
const messageBox = document.getElementById('message-box');
const submitBtn = document.getElementById('email-signin-btn');
const particlesContainer = document.getElementById('particles');
const signupLink = document.getElementById('signup-link');
const signupPromptText = document.getElementById('signup-prompt-text');
const submitButtonLabel = submitBtn.querySelector('.btn-content span');
let isSignUpMode = false;
let authFlowInProgress = false;
let initialAuthStateResolved = false;

// ΓöÇΓöÇΓöÇ Floating Particles Animation ΓöÇΓöÇΓöÇ
function createParticles() {
    const colors = [
        'rgba(212, 163, 115, 0.3)',  // gold
        'rgba(255, 229, 217, 0.4)',  // peach
        'rgba(216, 226, 220, 0.4)',  // mint
        'rgba(232, 232, 242, 0.35)', // lavender
        'rgba(208, 225, 249, 0.3)',  // blue
    ];

    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 12 + 4;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 15 + 15;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = color;
        particle.style.left = `${left}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;

        particlesContainer.appendChild(particle);
    }
}

createParticles();

// ΓöÇΓöÇΓöÇ Typewriter Effect for Welcome Title ΓöÇΓöÇΓöÇ
function typewriterEffect() {
    const titleEl = document.getElementById('welcome-title');
    const greetings = ['Welcome back', 'Namaste Γ£ª', 'Hello, gorgeous'];
    let currentIndex = 0;

    function animateText(text) {
        titleEl.style.opacity = '0';
        titleEl.style.transform = 'translateY(8px)';

        setTimeout(() => {
            titleEl.textContent = text;
            titleEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            titleEl.style.opacity = '1';
            titleEl.style.transform = 'translateY(0)';
        }, 300);
    }

    // Cycle through greetings every 4 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % greetings.length;
        animateText(greetings[currentIndex]);
    }, 4000);
}

typewriterEffect();

// ΓöÇΓöÇΓöÇ Toggle Password Visibility ΓöÇΓöÇΓöÇ
togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';

    const eyeOpen = togglePasswordBtn.querySelector('.eye-open');
    const eyeClosed = togglePasswordBtn.querySelector('.eye-closed');

    eyeOpen.style.display = isPassword ? 'none' : 'block';
    eyeClosed.style.display = isPassword ? 'block' : 'none';
});

// ΓöÇΓöÇΓöÇ Show Message ΓöÇΓöÇΓöÇ
function showMessage(text, type = 'error') {
    messageBox.textContent = text;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = 'block';

    // Auto-hide success messages
    if (type === 'success') {
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 5000);
    }
}

function hideMessage() {
    messageBox.style.display = 'none';
}

// ΓöÇΓöÇΓöÇ Button Loading State ΓöÇΓöÇΓöÇ
function setButtonLoading(loading) {
    const btnContent = submitBtn.querySelector('.btn-content');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    if (loading) {
        btnContent.style.display = 'none';
        btnLoader.style.display = 'flex';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.8';
    } else {
        btnContent.style.display = 'flex';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
}

function setAuthMode(signUpMode) {
    isSignUpMode = signUpMode;
    submitButtonLabel.textContent = signUpMode ? 'Create Account' : 'Sign In';
    signupPromptText.textContent = signUpMode ? 'Already have an account?' : 'New to The Ethnic Touch?';
    signupLink.textContent = signUpMode ? 'Sign in' : 'Create an account';
    passwordInput.autocomplete = signUpMode ? 'new-password' : 'current-password';
    hideMessage();
}

// ΓöÇΓöÇΓöÇ Post-Login Redirect ΓöÇΓöÇΓöÇ
function onLoginSuccess(user) {
    showMessage(`Welcome, ${user.displayName || user.email}! Redirecting...`, 'success');

    // Add a nice ripple animation on success
    document.querySelector('.form-container').style.animation = 'fadeOutUp 0.6s ease forwards';

    setTimeout(() => {
        window.location.href = './index.html#/profile';
    }, 1500);
}

// Fade-out animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOutUp {
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(fadeOutStyle);

// ΓöÇΓöÇΓöÇ Friendly Error Messages ΓöÇΓöÇΓöÇ
function getFriendlyError(errorCode) {
    const errorMessages = {
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/user-disabled': 'This account has been disabled. Contact support.',
        'auth/user-not-found': 'No account found with this email. Sign up instead?',
        'auth/wrong-password': 'Incorrect password. Try again or reset it.',
        'auth/email-already-in-use': 'An account already exists with this email.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/popup-closed-by-user': 'Sign-in popup was closed. Try again.',
        'auth/popup-blocked': 'Pop-up blocked by your browser. Allow popups and try again.',
        'auth/network-request-failed': 'Network error. Check your connection.',
        'auth/cancelled-popup-request': 'Only one sign-in popup can be open at a time.',
        'auth/invalid-credential': 'Invalid credentials. Please check and try again.',
        'auth/invalid-login-credentials': 'Invalid email or password. Please try again.',
        'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase Authentication.',
        'auth/unauthorized-domain': 'This address is not authorized in Firebase. Add localhost and 127.0.0.1 to Firebase Authentication’s Authorized domains.',
        'auth/invalid-api-key': 'Firebase configuration is invalid. Please check the project API key.',
        'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
    };

    return errorMessages[errorCode] || `Sign-in could not be completed${errorCode ? ` (${errorCode})` : ''}. Please try again.`;
}

// ΓöÇΓöÇΓöÇ Google Sign-In ΓöÇΓöÇΓöÇ
googleSignInBtn.addEventListener('click', async () => {
    hideMessage();
    authFlowInProgress = true;

    // Add button loading effect
    googleSignInBtn.disabled = true;
    googleSignInBtn.style.opacity = '0.7';
    googleSignInBtn.querySelector('.google-btn-text').textContent = 'Signing in...';

    try {
        const result = await auth.signInWithPopup(googleProvider);
        onLoginSuccess(result.user);
    } catch (error) {
        console.error('Google sign-in error:', error);
        authFlowInProgress = false;
        showMessage(getFriendlyError(error.code));

        // Reset button
        googleSignInBtn.disabled = false;
        googleSignInBtn.style.opacity = '1';
        googleSignInBtn.querySelector('.google-btn-text').textContent = 'Continue with Google';
    }
});

// ΓöÇΓöÇΓöÇ Email/Password Sign-In ΓöÇΓöÇΓöÇ
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessage();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Basic validation
    if (!email) {
        document.getElementById('email-input-group').classList.add('error');
        showMessage('Please enter your email address.');
        emailInput.focus();
        return;
    }

    if (!password) {
        document.getElementById('password-input-group').classList.add('error');
        showMessage('Please enter your password.');
        passwordInput.focus();
        return;
    }

    // Clear error states
    document.getElementById('email-input-group').classList.remove('error');
    document.getElementById('password-input-group').classList.remove('error');

    setButtonLoading(true);

    try {
        authFlowInProgress = true;
        const result = isSignUpMode
            ? await auth.createUserWithEmailAndPassword(email, password)
            : await auth.signInWithEmailAndPassword(email, password);
        onLoginSuccess(result.user);
    } catch (error) {
        console.error('Email sign-in error:', error);
        authFlowInProgress = false;
        setButtonLoading(false);

        // Highlight relevant field
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
            document.getElementById('email-input-group').classList.add('error');
        } else if (error.code === 'auth/wrong-password') {
            document.getElementById('password-input-group').classList.add('error');
        }

        showMessage(getFriendlyError(error.code));
    }
});

signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    setAuthMode(!isSignUpMode);
});

// ΓöÇΓöÇΓöÇ Clear Error State on Input ΓöÇΓöÇΓöÇ
emailInput.addEventListener('input', () => {
    document.getElementById('email-input-group').classList.remove('error');
    hideMessage();
});

passwordInput.addEventListener('input', () => {
    document.getElementById('password-input-group').classList.remove('error');
    hideMessage();
});

// ΓöÇΓöÇΓöÇ Forgot Password Handler ΓöÇΓöÇΓöÇ
document.getElementById('forgot-password-link').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email) {
        showMessage('Enter your email first, then click "Forgot password?"');
        document.getElementById('email-input-group').classList.add('error');
        emailInput.focus();
        return;
    }

    try {
        await auth.sendPasswordResetEmail(email);
        showMessage(`Password reset email sent to ${email}. Check your inbox!`, 'success');
    } catch (error) {
        showMessage(getFriendlyError(error.code));
    }
});

// ΓöÇΓöÇΓöÇ Auth State Observer ΓöÇΓöÇΓöÇ
// Redirect only if the page was opened with an existing session. A newly
// completed sign-in must keep the success animation and Profile redirect.
auth.onAuthStateChanged((user) => {
    if (!initialAuthStateResolved) {
        initialAuthStateResolved = true;
    } else {
        return;
    }

    if (user && !authFlowInProgress) {
        window.location.href = './index.html';
    }
});

// ΓöÇΓöÇΓöÇ Input Micro-Animations ΓöÇΓöÇΓöÇ
document.querySelectorAll('.input-wrapper input').forEach((input) => {
    input.addEventListener('focus', () => {
        input.closest('.input-wrapper').style.transform = 'scale(1.01)';
        input.closest('.input-wrapper').style.transition = 'transform 0.2s ease';
    });

    input.addEventListener('blur', () => {
        input.closest('.input-wrapper').style.transform = 'scale(1)';
    });
});
