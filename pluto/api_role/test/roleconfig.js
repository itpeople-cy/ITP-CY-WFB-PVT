const axios = require("axios");
const expect = require("chai").expect;
const _ = require("lodash");
const uuid = require('uuid/v4');
const log4js = require('log4js');
const logger = log4js.getLogger("RoleConfig-test");
describe("RoleConfig api ", async function() {
    this.timeout(45000);
    let xAccessToken;
    let payloadCreate = {
        "ChainCodeID": "5754977f-3c52-4cbe-ba90-ca76a32a998d",
        "AccessList": "labore laborum sunt nisi anim"
    };
    let payloadUpdate = {
        "ChainCodeID": "5754977f-3c52-4cbe-ba90-ca76a32a998d",
        "AccessList": "dolor"
    };
    afterEach(function(done) {
        setTimeout(function() {
            done();
        }, 30000);
    });
    before(async () => {
        try {
            const email = `roleconfig${uuid()}@fakeemail.com;`
            await axios({
                method: 'post',
                url: "http://localhost:3000/users/register",
                data: {
                    email,
                    password: "p@ssw0rd",
                    org: "org1",
                    role: ""
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

    it("Creates RoleConfig", async function() {
        const response = await axios({
            method: 'post',
            url: "http://localhost:3000/roleconfig",
            data: payloadCreate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadCreate.objectType = "RoleConfig";
        expect(response.status).to.be.equal(200);
        expect(payloadCreate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Updates RoleConfig", async function() {
        const response = await axios({
            method: 'put',
            url: "http://localhost:3000/roleconfig",
            data: payloadUpdate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadUpdate.objectType = "RoleConfig";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets a RoleConfig by id", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/roleconfig/5754977f-3c52-4cbe-ba90-ca76a32a998d",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        })
        payloadUpdate.objectType = "RoleConfig";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets all RoleConfigs", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/roleconfiglist",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(JSON.parse(response.data.objectBytes)).to.deep.include(payloadUpdate);

    });

    it("Deletes RoleConfig", async function() {
        const response = await axios({
            method: 'delete',
            url: "http://localhost:3000/roleconfig/5754977f-3c52-4cbe-ba90-ca76a32a998d",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(response.data.objectBytes).to.be.equal('');
    });
});