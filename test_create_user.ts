import { adminCreateUser } from "./src/app/actions/admin"

async function test() {
  try {
    await adminCreateUser("test333@example.com", "Test User", "student", "Pass123!")
    console.log("Success")
  } catch (err) {
    console.error("Error:", err)
  }
}
test()