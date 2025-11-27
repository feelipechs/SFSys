import argon2 from 'argon2';

export async function hashPassword(password) {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3, // número de iterações
    parallelism: 1, // número de threads
  });
}

export async function comparePassword(candidatePassword, hashedPassword) {
  try {
    return await argon2.verify(hashedPassword, candidatePassword);
  } catch (err) {
    return false;
  }
}
