export function getApiErrorMessage(error: any): string {
  if (!error?.response?.data) return 'Unexpected error';

  const data = error.response.data;

  if (typeof data.message === 'string') return data.message;

  if (Array.isArray(data.message)) return data.message.join(', ');

  if (data.error) return data.error;

  return JSON.stringify(data);
}
