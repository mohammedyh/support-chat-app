import * as Yup from 'yup';

export const registerSchema = Yup.object({
	name: Yup.string().required('Name is required'),
	email: Yup.string().email().required('Email is required'),
	company: Yup.string().required('Company is required'),
	password: Yup.string().min(8).required('Password is required'),
});

export const loginSchema = Yup.object({
	email: Yup.string().email().required('Email is required'),
	password: Yup.string().min(8).required('Password is required'),
});

export const messageSchema = Yup.object({
	message: Yup.string()
		.transform(value => value?.trim())
		.min(100, 'Message must have a minimum of 100 characters')
		.required('Message is required'),
});
