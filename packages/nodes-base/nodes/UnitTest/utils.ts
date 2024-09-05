export function generateTestId(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	const length = 8;
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * length));
	}

	return result;
}
