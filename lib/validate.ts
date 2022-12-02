import * as Yup from 'yup';

export default async function validate<T extends Yup.AnySchema>(
	schema: T,
	data: any,
) {
	try {
		const result = await schema.validate(data, { abortEarly: false });
		return {
			success: true,
			errors: [],
			result,
		};
	} catch (error) {
		if (Yup.ValidationError.isError(error)) {
			return {
				success: false,
				errors: error.inner.map(error => ({
					message: error.message,
					path: error.path,
					type: error.type,
					value: error.value,
				})),
			};
		} else {
			throw error;
		}
	}
}
