import crypto from 'crypto'

interface dbInfo {
    passwordHash: String,
    salt: String,
}

const genRandomBytes = (lenght: Number) => {
    return crypto.randomBytes(Math.ceil(Number(lenght)/2))
    .toString('hex')
    .slice(0, Number(lenght))
}

const sha512 = (password: String, salt: String) => {
    const hash = crypto.createHmac('sha512', String(salt))
    hash.update(String(password))
    const value = hash.digest('hex')
    return {
        salt: salt,
        passwordHash: value,
    }
}

export const saltHashPassword = (userpass: String) => {
    const salt = genRandomBytes(16)
    const passwordsave = sha512(userpass, salt)
    return passwordsave
}

export const validadePass = (userpass: String, dbInfo: dbInfo) => {
    const packInfo = {
        Hash: dbInfo.passwordHash,
        salt: dbInfo.salt
    }
    const hashUpdate = sha512(userpass, packInfo.salt)
    const validation =  hashUpdate.passwordHash === packInfo.Hash ? true : false
    return validation
}