const axios = require("axios");
const expect = require("chai").expect;
const _ = require("lodash");
const nanoid = require('nanoid');
const log4js = require('log4js');
const logger = log4js.getLogger("Tag-test");
describe("Tag api ", async function() {
    this.timeout(45000);
    let xAccessToken;
    let payloadCreate = {
        "TagID": "23d90767-7104-4ca8-ab95-c47f09efb010",
        "TagSupplierID": "in aliquip ipsum amet",
        "ProductID": "do adipisicing minim",
        "Status": "minim in sunt ea do",
        "Pattern": "id culpa nostrud"
    };
    let payloadUpdate = {
        "TagID": "23d90767-7104-4ca8-ab95-c47f09efb010",
        "TagSupplierID": "enim",
        "ProductID": "do",
        "Status": "minim deserunt labore incididunt",
        "Pattern": "D"
    };
    afterEach(function(done) {
        setTimeout(function() {
            done();
        }, 30000);
    });
    before(async () => {
        try {
            const email = `tag${nanoid()}@fakeemail.com;`
            await axios({
                method: 'post',
                url: "http://localhost:3000/users/register",
                data: {
                    email,
                    password: "p@ssw0rd",
                    org: "org1",
                    role: "tagsupplier"
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

    it("Creates Tag", async function() {
        const response = await axios({
            method: 'post',
            url: "http://localhost:3000/tag",
            data: payloadCreate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadCreate.objectType = "Tag";
        expect(response.status).to.be.equal(200);
        expect(payloadCreate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Updates Tag", async function() {
        const response = await axios({
            method: 'put',
            url: "http://localhost:3000/tag",
            data: payloadUpdate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadUpdate.objectType = "Tag";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets a Tag by id", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/tag/23d90767-7104-4ca8-ab95-c47f09efb010",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        })
        payloadUpdate.objectType = "Tag";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets all Tags", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/taglist",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(JSON.parse(response.data.objectBytes)).to.deep.include(payloadUpdate);

    });

    it("Deletes Tag", async function() {
        const response = await axios({
            method: 'delete',
            url: "http://localhost:3000/tag/23d90767-7104-4ca8-ab95-c47f09efb010",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(response.data.objectBytes).to.be.equal('');
    });
});