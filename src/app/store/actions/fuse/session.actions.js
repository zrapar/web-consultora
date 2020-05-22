export const OPEN_SESSION_DIALOG = '[SESSION] OPEN';
export const CLOSE_SESSION_DIALOG = '[SESSION] CLOSE';

export function closeSessionDialog() {
	return {
		type : CLOSE_SESSION_DIALOG
	};
}

export function openSessionDialog(options) {
	return {
		type : OPEN_SESSION_DIALOG
	};
}
