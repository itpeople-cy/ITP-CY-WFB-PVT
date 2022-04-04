const axios = require("axios");
const expect = require("chai").expect;
const _ = require("lodash");
const nanoid = require('nanoid');
const log4js = require('log4js');
const logger = log4js.getLogger("Brand-test");
describe("Brand api ", async function() {
    this.timeout(45000);
    let xAccessToken;
    let payloadCreate = {
        "BrandID": "9263b278-45da-4d4a-a797-35919c0f95ee",
        "Name": "mini",
        "Logo": "dolore irure velit non incididunt",
        "ManufacturerID": "cupidatat aute ut veniam enim"
    };
    let payloadUpdate = {
        "BrandID": "9263b278-45da-4d4a-a797-35919c0f95ee",
        "Name": "l",
        "Logo": "in ipsum qui dolore",
        "ManufacturerID": "proident elit"
    };
    afterEach(function(done) {
        setTimeout(function() {
            done();
        }, 30000);
    });
    before(async () => {
        try {
            const email = `brand${nanoid()}@fakeemail.com;`
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

    it("Creates Brand", async function() {
        const response = await axios({
            method: 'post',
            url: "http://localhost:3000/brand",
            data: payloadCreate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadCreate.objectType = "Brand";
        expect(response.status).to.be.equal(200);
        expect(payloadCreate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Updates Brand", async function() {
        const response = await axios({
            method: 'put',
            url: "http://localhost:3000/brand",
            data: payloadUpdate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadUpdate.objectType = "Brand";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets a Brand by id", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/brand/9263b278-45da-4d4a-a797-35919c0f95ee",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        })
        payloadUpdate.objectType = "Brand";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets all Brands", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/brandlist",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(JSON.parse(response.data.objectBytes)).to.deep.include(payloadUpdate);

    });

    it("Deletes Brand", async function() {
        const response = await axios({
            method: 'delete',
            url: "http://localhost:3000/brand/9263b278-45da-4d4a-a797-35919c0f95ee",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(response.data.objectBytes).to.be.equal('');
    });
});