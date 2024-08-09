import CryptoJS from "react-native-crypto-js";


const config = {
    // TODO OBFUSCATE!!
    key: '6476b3f5ec6dcaddb637e9c9654aa687'
};

export function decrypt(data, iv) {

    const key = CryptoJS.enc.Hex.parse(config.key)
    const ivDecoded = CryptoJS.enc.Base64.parse(iv)
    const dataDecoded = CryptoJS.enc.Base64.parse(data);

    const encryptedCP = CryptoJS.lib.CipherParams.create({
        ciphertext: dataDecoded,
        formatter: CryptoJS.format.OpenSSL
    });

    const decryptedWA = CryptoJS.AES.decrypt(encryptedCP, key, { iv: ivDecoded});
    const decryptedUtf8 = decryptedWA.toString(CryptoJS.enc.Utf8);

    return decryptedUtf8

}

// TODO
export function encrpt(text='test') {

    const key = CryptoJS.enc.Hex.parse(config.key)
    // TODO GENERATE RANDOM IV
    // const iv = CryptoJS.enc.Base64.parse("kT+uMuPwUk2LH4cFbK0GiA==")

    const encrypted = CryptoJS.AES.encrypt(text, key, {mode: CryptoJS.mode.CBC, iv: iv});

    return encrypted.toString()
}




