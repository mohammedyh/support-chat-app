import * as Yup from 'yup';

export const registerSchema = Yup.object({
	name: Yup.string().required('Name is required'),
	email: Yup.string().email().required('Email is required'),
	password: Yup.string().min(8).required('Password is required'),
});
