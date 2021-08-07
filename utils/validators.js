module.exports.validateRegisterInput = (
    username, 
    email, 
    password, 
    confirmPassword
) => {
    const errors = {};

    if (username.trim() === '') {
        errors.username = 'Username must not be empty';
    }

    if (email.trim() === '') {
        errors.email = 'Email must not be empty';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = 'Email must be valid email address';
        }
    }

    if (password.trim() === '') {
        errors.password = 'Password must not be empty';
    } 
    if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords must match';
    }

    return {
        errors,
        // If there is no key in errors obj then the form is valid
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (username, password) => {
    const errors = {};

    if (username.trim() === '') {
        errors.username = 'Username must not be empty';
    }

    if (password.trim() === '') {
        errors.password = 'Password must not be empty';
    }

    return {
        errors,
        // If there is no key in errors obj then the form is valid
        valid: Object.keys(errors).length < 1
    }
}