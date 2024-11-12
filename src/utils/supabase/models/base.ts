import { createClient } from "../server";

type ClientInstance = ReturnType<typeof createClient>; // Replace this with the actual type if known

// Define generic types for the methods in `Base`
export abstract class Base {
  supabase: ClientInstance;

  constructor() {
    this.supabase = createClient();
  }
}
