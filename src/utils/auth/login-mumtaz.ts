import { MUMTAZ_AUTH_API } from "@/models/auth";
import { LoginMumtazArgs } from "@/models/login-mumtaz";

export async function loginMumtaz({ username, password }: LoginMumtazArgs) {
  try {
    const response = await fetch(MUMTAZ_AUTH_API, {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    if (json.status === 200 && json.user.verified === true) {
      return json.user;
    }

    throw new Error(json);
  } catch (error) {
    console.error(error);
  }
  return null;
}
