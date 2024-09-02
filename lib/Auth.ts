import {hash,compare} from 'bcrypt';

export async function hashPassword(password){
const hashPasswords=await hash(password,12)
return hashPasswords
}
export async function verifyPassword(plainPassword, hashedPassword) {
    return compare(plainPassword, hashedPassword);
  }