export async function getSession() {
  const apiResponse = await fetch("/api/users/session");

  if (apiResponse.ok) {
    return await apiResponse.json();
  } else return null;
}
