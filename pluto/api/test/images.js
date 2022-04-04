const axios = require("axios");
const expect = require("chai").expect;
const _ = require("lodash");
const nanoid = require('nanoid');
const log4js = require('log4js');
const logger = log4js.getLogger("Images-test");
describe("Images api ", async function() {
    this.timeout(45000);
    let xAccessToken;
    let payloadCreate = {
        "ImageID": "9475b4a7-24a9-4e99-ae55-c9f8f7d3b526",
        "Description": "amet irure nisi eu Ut",
        "ImageString": "non mollit sed laborum ut"
    };
    let payloadUpdate = {
        "ImageID": "9475b4a7-24a9-4e99-ae55-c9f8f7d3b526",
        "Description": "do officia cupidatat",
        "ImageString": ""
    };
    afterEach(function(done) {
        setTimeout(function() {
            done();
        }, 30000);
    });
    before(async () => {
        try {
            const email = `images${nanoid()}@fakeemail.com;`
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

    it("Creates Images", async function() {
        const response = await axios({
            method: 'post',
            url: "http://localhost:3000/images",
            data: payloadCreate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadCreate.objectType = "Images";
        expect(response.status).to.be.equal(200);
        expect(payloadCreate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Updates Images", async function() {
        const response = await axios({
            method: 'put',
            url: "http://localhost:3000/images",
            data: payloadUpdate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadUpdate.objectType = "Images";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets a Images by id", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/images/9475b4a7-24a9-4e99-ae55-c9f8f7d3b526",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        })
        payloadUpdate.objectType = "Images";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets all Imagess", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/imageslist",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(JSON.parse(response.data.objectBytes)).to.deep.include(payloadUpdate);

    });

    it("Deletes Images", async function() {
        const response = await axios({
            method: 'delete',
            url: "http://localhost:3000/images/9475b4a7-24a9-4e99-ae55-c9f8f7d3b526",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(response.data.objectBytes).to.be.equal('');
    });
});