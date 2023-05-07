export const fetchCountries = name => {
  const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`;
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`Failed to fetch countries for ${name}`);
    }
    return response.json();
  });
};

