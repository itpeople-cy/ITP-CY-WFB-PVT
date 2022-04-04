const axios = require("axios");
const expect = require("chai").expect;
const _ = require("lodash");
const nanoid = require('nanoid');
const log4js = require('log4js');
const logger = log4js.getLogger("Manufacturer-test");
describe("Manufacturer api ", async function() {
    this.timeout(45000);
    let xAccessToken;
    let payloadCreate = {
        "ManufacturerID": "0a5cdd6a-a995-4dc0-9966-a0e7aed9f48f",
        "Name": "eu in nulla consectetur cillum",
        "Location": {
            "LocationID": "deserunt anim dolore do",
            "Name": "cillum fugiat"
        }
    };
    let payloadUpdate = {
        "ManufacturerID": "0a5cdd6a-a995-4dc0-9966-a0e7aed9f48f",
        "Name": "ex consectetur dolore",
        "Location": {
            "LocationID": "aliquip voluptate sunt",
            "Name": "est"
        }
    };
    afterEach(function(done) {
        setTimeout(function() {
            done();
        }, 30000);
    });
    before(async () => {
        try {
            const email = `manufacturer${nanoid()}@fakeemail.com;`
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

    it("Creates Manufacturer", async function() {
        const response = await axios({
            method: 'post',
            url: "http://localhost:3000/manufacturer",
            data: payloadCreate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadCreate.objectType = "Manufacturer";
        expect(response.status).to.be.equal(200);
        expect(payloadCreate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Updates Manufacturer", async function() {
        const response = await axios({
            method: 'put',
            url: "http://localhost:3000/manufacturer",
            data: payloadUpdate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadUpdate.objectType = "Manufacturer";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets a Manufacturer by id", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/manufacturer/0a5cdd6a-a995-4dc0-9966-a0e7aed9f48f",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        })
        payloadUpdate.objectType = "Manufacturer";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets all Manufacturers", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/manufacturerlist",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(JSON.parse(response.data.objectBytes)).to.deep.include(payloadUpdate);

    });

    it("Deletes Manufacturer", async function() {
        const response = await axios({
            method: 'delete',
            url: "http://localhost:3000/manufacturer/0a5cdd6a-a995-4dc0-9966-a0e7aed9f48f",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(response.data.objectBytes).to.be.equal('');
    });
});