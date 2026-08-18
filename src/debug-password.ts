import { comparePassword, hashPassword } from "./utils/password.utils";

async function main() {
  const password = "123456";
  const hash = await hashPassword(password);

  console.log("Password:", password);
  console.log("Hash:", hash);

  const isCorrect = await comparePassword("123456", hash);
  const isIncorrect = await comparePassword("otra-password", hash);

  console.log("Coincide password correcta:", isCorrect);
  console.log("Coincide password incorrecta:", isIncorrect);
}

main();
