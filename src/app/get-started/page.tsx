"use client";

import { useFormState } from "react-dom";
import { action } from "./actions";

export default function GetStarted() {
  const [state, formAction] = useFormState(action, { message: "" });

  return (
    <div>
      <form action={formAction}>
        <label htmlFor="pin">Secure your account by creating a PIN:</label>
        <input id="pin" name="pin" type="number" minLength={6} maxLength={6} />
        <div>{state?.message}</div>
      </form>
    </div>
  );
}
