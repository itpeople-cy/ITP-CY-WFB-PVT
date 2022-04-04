const axios = require("axios");
const expect = require("chai").expect;
const _ = require("lodash");
const nanoid = require('nanoid');
const log4js = require('log4js');
const logger = log4js.getLogger("ProductProfile-test");
describe("ProductProfile api ", async function() {
    this.timeout(45000);
    let xAccessToken;
    let payloadCreate = {
        "ProductProfileID": "6324715b-dcb1-4cbe-8c2a-60a528aef2e4",
        "Name": "",
        "Size": "ullamco eu",
        "Weight": "esse veniam do exercitation el",
        "BrandID": "dolor consequat",
        "Description": "veniam officia ut incididunt",
        "ImageIDs": ["cupidatat do id irure", "aute", "nisi", "in"]
    };
    let payloadUpdate = {
        "ProductProfileID": "6324715b-dcb1-4cbe-8c2a-60a528aef2e4",
        "Name": "mollit do",
        "Size": "deserunt esse enim",
        "Weight": "id cillum voluptate dolor officia",
        "BrandID": "velit",
        "Description": "qui ullamco exercitation anim",
        "ImageIDs": ["aliquip nostrud"]
    };
    afterEach(function(done) {
        setTimeout(function() {
            done();
        }, 30000);
    });
    before(async () => {
        try {
            const email = `productprofile${nanoid()}@fakeemail.com;`
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

    it("Creates ProductProfile", async function() {
        const response = await axios({
            method: 'post',
            url: "http://localhost:3000/productprofile",
            data: payloadCreate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadCreate.objectType = "ProductProfile";
        expect(response.status).to.be.equal(200);
        expect(payloadCreate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Updates ProductProfile", async function() {
        const response = await axios({
            method: 'put',
            url: "http://localhost:3000/productprofile",
            data: payloadUpdate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadUpdate.objectType = "ProductProfile";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets a ProductProfile by id", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/productprofile/6324715b-dcb1-4cbe-8c2a-60a528aef2e4",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        })
        payloadUpdate.objectType = "ProductProfile";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets all ProductProfiles", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/productprofilelist",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(JSON.parse(response.data.objectBytes)).to.deep.include(payloadUpdate);

    });

    it("Deletes ProductProfile", async function() {
        const response = await axios({
            method: 'delete',
            url: "http://localhost:3000/productprofile/6324715b-dcb1-4cbe-8c2a-60a528aef2e4",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(response.data.objectBytes).to.be.equal('');
    });
});