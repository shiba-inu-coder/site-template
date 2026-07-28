export default defineNuxtPlugin(() => {
  let abortController = new AbortController();

  function createApiInstance() {
    return $fetch.create({
      signal: abortController.signal,
    });
  }

  let api = createApiInstance();

  const apiAbort = () => {
    abortController.abort();
    abortController = new AbortController();
    api = createApiInstance();
  };

  return {
    provide: {
      api: () => api, // Returns the latest API instance to ensure a fresh instance is used after calling apiAbort().
      apiAbort,
    },
  };
});
