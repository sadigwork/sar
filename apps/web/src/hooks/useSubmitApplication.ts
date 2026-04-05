import { useState } from 'react';

export function useSubmitApplication() {
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);

      const res = await fetch('/api/applications/submit', {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Submit failed');

      return true;
    } catch (e) {
      console.error(e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading };
}
