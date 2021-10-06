export const baseUrl = `http://localhost:8000/api/`;

export function doPost({ method = "POST", body, path = "" }) {
  const token = localStorage.getItem("token");

  const headers = {
    "content-type": "application/json",
    "accept": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method: method,
    headers: headers,
    body: JSON.stringify(body),
  };
  const url = new URL(path, baseUrl).toString();
  return fetch(url, options);
}

export function doGet({ query = {}, path = "" }) {
  
  const token = localStorage.getItem("token");

  const cleanedQuery = Object.keys(query)
  .filter((key) => query[key] != null )
  .reduce((object, key) => ({ ...object, [key]: query[key] }), {});

  const params = new URLSearchParams(cleanedQuery).toString();
  const url = new URL(path, baseUrl).toString();
  const headers = {
    accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(`${url}?${params}`, options);
}
