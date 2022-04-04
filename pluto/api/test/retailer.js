const axios = require("axios");
const expect = require("chai").expect;
const _ = require("lodash");
const nanoid = require('nanoid');
const log4js = require('log4js');
const logger = log4js.getLogger("Retailer-test");
describe("Retailer api ", async function() {
    this.timeout(45000);
    let xAccessToken;
    let payloadCreate = {
        "RetailerID": "99b1c6ab-dca3-4e1a-a40f-87fb6d930429",
        "Name": "dolore",
        "Location": {
            "LocationID": "id et sed sint",
            "Name": "do ea culpa"
        }
    };
    let payloadUpdate = {
        "RetailerID": "99b1c6ab-dca3-4e1a-a40f-87fb6d930429",
        "Name": "tempor voluptate incididunt consequat",
        "Location": {
            "LocationID": "laboris",
            "Name": "id dolore irure non"
        }
    };
    afterEach(function(done) {
        setTimeout(function() {
            done();
        }, 30000);
    });
    before(async () => {
        try {
            const email = `retailer${nanoid()}@fakeemail.com;`
            await axios({
                method: 'post',
                url: "http://localhost:3000/users/register",
                data: {
                    email,
                    password: "p@ssw0rd",
                    org: "org1",
                    role: "retailer"
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

    it("Creates Retailer", async function() {
        const response = await axios({
            method: 'post',
            url: "http://localhost:3000/retailer",
            data: payloadCreate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadCreate.objectType = "Retailer";
        expect(response.status).to.be.equal(200);
        expect(payloadCreate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Updates Retailer", async function() {
        const response = await axios({
            method: 'put',
            url: "http://localhost:3000/retailer",
            data: payloadUpdate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadUpdate.objectType = "Retailer";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets a Retailer by id", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/retailer/99b1c6ab-dca3-4e1a-a40f-87fb6d930429",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        })
        payloadUpdate.objectType = "Retailer";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets all Retailers", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/retailerlist",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(JSON.parse(response.data.objectBytes)).to.deep.include(payloadUpdate);

    });

    it("Deletes Retailer", async function() {
        const response = await axios({
            method: 'delete',
            url: "http://localhost:3000/retailer/99b1c6ab-dca3-4e1a-a40f-87fb6d930429",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(response.data.objectBytes).to.be.equal('');
    });
});