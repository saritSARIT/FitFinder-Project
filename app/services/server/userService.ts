// app/services/userService.ts
import { Db, ObjectId } from "mongodb";

export type UserType = "trainer" | "Trainee";

export interface BaseUser {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
}

// פונקציות גנריות
export async function findUserByEmail(email: string, db: Db, type: UserType) {
  const collection = type === "trainer" ? "trainer" : "Trainee";
  return await db.collection<BaseUser>(collection).findOne({ email });
}

export async function createUser(user: BaseUser, db: Db, type: UserType) {
  const collection = type === "trainer" ? "trainer" : "Trainee";
  const result = await db.collection<BaseUser>(collection).insertOne(user);
  return result.insertedId;
}
