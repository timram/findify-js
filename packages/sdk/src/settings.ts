const common = {
  timeout: 5000,
  jsonpCallback: 'findifyCallback',
};

export const staging = {
  ...common,
  url: 'https://search-staging.findify.io/v3',
  // usually you don't want to
  // retry failed requests on staging
  retryCount: 1,
};

export const production = {
  ...common,
  url: 'https://api-v3.findify.io/v3',
  retryCount: 3,
};

export const development = staging;
