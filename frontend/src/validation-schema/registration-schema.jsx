import * as Yup from 'yup'

export const registrationSchema = Yup.object({
    email: Yup.string().email().required("Please enter your email"), 
    password: Yup.string().min(6).max(15).required("Password is required"), 
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
})