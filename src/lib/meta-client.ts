export const trackMetaEvent = async (
  eventName: string,
  customData: any = {},
  userData: any = {}
) => {
  // Always trigger browser pixel first if available
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, customData);
  }

  // Then trigger CAPI via our API route
  try {
    const fbp = typeof document !== 'undefined' ? document.cookie
      .split('; ')
      .find(row => row.startsWith('_fbp='))
      ?.split('=')[1] : undefined;

    const fbc = typeof document !== 'undefined' ? document.cookie
      .split('; ')
      .find(row => row.startsWith('_fbc='))
      ?.split('=')[1] : undefined;

    await fetch('/api/meta-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        eventSourceUrl: typeof window !== 'undefined' ? window.location.href : '',
        userData: {
          ...userData,
          fbp,
          fbc,
        },
        customData,
        // Optional: generate a unique eventId for deduplication if needed
        // eventId: crypto.randomUUID(), 
      }),
    });
  } catch (error) {
    console.error('Error tracking Meta event via CAPI:', error);
  }
};
