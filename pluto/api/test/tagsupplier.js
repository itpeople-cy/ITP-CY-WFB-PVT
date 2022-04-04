const axios = require("axios");
const expect = require("chai").expect;
const _ = require("lodash");
const nanoid = require('nanoid');
const log4js = require('log4js');
const logger = log4js.getLogger("TagSupplier-test");
describe("TagSupplier api ", async function() {
    this.timeout(45000);
    let xAccessToken;
    let payloadCreate = {
        "TagSupplierID": "1417cfe2-3c64-48eb-aded-73a1f29e4cc4",
        "Name": "dolore",
        "TagTechnology": "ipsum mollit",
        "ScanTechnology": "incididunt velit dolore dolor in"
    };
    let payloadUpdate = {
        "TagSupplierID": "1417cfe2-3c64-48eb-aded-73a1f29e4cc4",
        "Name": "esse amet velit aliqua consectetur",
        "TagTechnology": "sit esse",
        "ScanTechnology": "eiusmod aliqua mo"
    };
    afterEach(function(done) {
        setTimeout(function() {
            done();
        }, 30000);
    });
    before(async () => {
        try {
            const email = `tagsupplier${nanoid()}@fakeemail.com;`
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

    it("Creates TagSupplier", async function() {
        const response = await axios({
            method: 'post',
            url: "http://localhost:3000/tagsupplier",
            data: payloadCreate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadCreate.objectType = "TagSupplier";
        expect(response.status).to.be.equal(200);
        expect(payloadCreate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Updates TagSupplier", async function() {
        const response = await axios({
            method: 'put',
            url: "http://localhost:3000/tagsupplier",
            data: payloadUpdate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadUpdate.objectType = "TagSupplier";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets a TagSupplier by id", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/tagsupplier/1417cfe2-3c64-48eb-aded-73a1f29e4cc4",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        })
        payloadUpdate.objectType = "TagSupplier";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets all TagSuppliers", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/tagsupplierlist",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(JSON.parse(response.data.objectBytes)).to.deep.include(payloadUpdate);

    });

    it("Deletes TagSupplier", async function() {
        const response = await axios({
            method: 'delete',
            url: "http://localhost:3000/tagsupplier/1417cfe2-3c64-48eb-aded-73a1f29e4cc4",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(response.data.objectBytes).to.be.equal('');
    });
});