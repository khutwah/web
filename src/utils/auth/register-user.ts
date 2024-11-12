import { createClient } from "../supabase/server";
import { RegisterUserArgs } from "@/models/register-user";
import { User } from "../supabase/models/user";
import { Students } from "../supabase/models/students";

export async function registerUser({
  email,
  name,
  password,
  role,
  virtual_account,
}: RegisterUserArgs) {
  const supabase = await createClient();

  const response = await supabase.auth.signUp({
    email,
    password,
  });

  if (response.error) throw response.error;

  const user = new User();
  const createUserResponse = await user.create({
    email,
    name,
    role,
    sb_user_id: response.data.user?.id ?? "",
  });

  if (createUserResponse.error) {
    throw createUserResponse.error;
  }

  const userId = createUserResponse.data?.[0]?.id;
  const student = new Students();
  const createStudentResponse = await student.create({
    virtual_account,
    parent_id: userId,
  });

  if (createStudentResponse.error) {
    throw createStudentResponse.error;
  }

  return true;
}
