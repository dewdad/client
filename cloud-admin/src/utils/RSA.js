import {getModulus} from '@/service/user.js';
class RSA {
    constructor() {
        this.init();
    }

    init () {

        if (!window.RSAUtils) {
            throw new Error('系统内部错误：加密失败');
        }

        this.RSAUtils = window.RSAUtils;

        this.checkKey();
    }

    async checkKey() {

        var modulus = window.sessionStorage.getItem('modulus');
        var exponent = window.sessionStorage.getItem('exponent');
        if (!modulus || !exponent) {
            await this.getModulus();
        } else {
            this.modulus = modulus;
            this.exponent = exponent;
        }
    }

    async getModulus () {
        let ret = await getModulus();
        console.log('getModulus',ret);
        if (ret && ret.modulus && ret.exponent) {
            window.sessionStorage.setItem('modulus', ret.modulus);
            window.sessionStorage.setItem('exponent', ret.exponent);
            this.modulus = ret.modulus;
            this.exponent = ret.exponent;
        }
    }

    /**
     * 每次加密之前需要检测密钥是否存在
     */
    async getEncryptKey() {
        await this.checkKey();
        return this.RSAUtils.getKeyPair(this.exponent, '', this.modulus);
    }

    // 加密
    async encrypt(pwd) {
        if (!pwd) {
            return pwd;
        }
        var encryptKey = await this.getEncryptKey();
        if (encryptKey) {
            return this.RSAUtils.encryptedString(encryptKey, pwd);
        }
    }
}
export default new RSA();
