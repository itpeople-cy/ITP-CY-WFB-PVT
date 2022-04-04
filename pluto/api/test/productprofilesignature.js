const axios = require("axios");
const expect = require("chai").expect;
const _ = require("lodash");
const nanoid = require('nanoid');
const log4js = require('log4js');
const logger = log4js.getLogger("ProductProfileSignature-test");
describe("ProductProfileSignature api ", async function() {
    this.timeout(45000);
    let xAccessToken;
    let payloadCreate = {
        "ProductProfileID": "17017b5d-4337-489a-bea4-273b41fd7a2c",
        "SignatureDocument": "id cillum"
    };
    let payloadUpdate = {
        "ProductProfileID": "17017b5d-4337-489a-bea4-273b41fd7a2c",
        "SignatureDocument": "aliqua enim"
    };
    afterEach(function(done) {
        setTimeout(function() {
            done();
        }, 30000);
    });
    before(async () => {
        try {
            const email = `productprofilesignature${nanoid()}@fakeemail.com;`
            await axios({
                method: 'post',
                url: "http://localhost:3000/users/register",
                data: {
                    email,
                    password: "p@ssw0rd",
                    org: "org1",
                    role: "manufacturer"
                },
                headers: {
                    "content-type": "application/json"
                }
            })
            let response = await axios({
                method: 'post',
                url: "http://localhost:3000/users/login",
                data: {
                    email,
                    password: "p@ssw0rd",
                    org: "org1"
                },
                headers: {
                    "content-type": "application/json"
                }
            })
            xAccessToken = response.data.accessToken;
        } catch (error) {
            logger.error(error)
        }
    });

    it("Creates ProductProfileSignature", async function() {
        const response = await axios({
            method: 'post',
            url: "http://localhost:3000/productprofilesignature",
            data: payloadCreate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadCreate.objectType = "ProductProfileSignature";
        expect(response.status).to.be.equal(200);
        expect(payloadCreate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Updates ProductProfileSignature", async function() {
        const response = await axios({
            method: 'put',
            url: "http://localhost:3000/productprofilesignature",
            data: payloadUpdate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadUpdate.objectType = "ProductProfileSignature";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets a ProductProfileSignature by id", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/productprofilesignature/17017b5d-4337-489a-bea4-273b41fd7a2c",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        })
        payloadUpdate.objectType = "ProductProfileSignature";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets all ProductProfileSignatures", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/productprofilesignaturelist",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(JSON.parse(response.data.objectBytes)).to.deep.include(payloadUpdate);

    });

    it("Deletes ProductProfileSignature", async function() {
        const response = await axios({
            method: 'delete',
            url: "http://localhost:3000/productprofilesignature/17017b5d-4337-489a-bea4-273b41fd7a2c",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(response.data.objectBytes).to.be.equal('');
    });
});