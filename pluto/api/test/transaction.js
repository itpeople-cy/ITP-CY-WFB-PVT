const axios = require("axios");
const expect = require("chai").expect;
const _ = require("lodash");
const nanoid = require('nanoid');
const log4js = require('log4js');
const logger = log4js.getLogger("Transaction-test");
describe("Transaction api ", async function() {
    this.timeout(45000);
    let xAccessToken;
    let payloadCreate = {
        "TransactionID": "5424d224-f1b0-4f8b-87df-21feb1bce102",
        "RetailerID": "mollit",
        "ProductID": "culpa eiusmod",
        "SKUCode": "fugiat eu nostrud non Ut",
        "UPCode": "officia pariatur",
        "Location": {
            "LocationID": "in aliqua ullamco proident",
            "Name": "anim minim in"
        },
        "GPS": "quis",
        "Date": "cillum elit Ut incididunt adipisicing",
        "Registration": {
            "TransactionID": "ad",
            "EmailID": "consequat exercitation sit pariatur incididunt",
            "CertificateHash": "ut do ex et"
        }
    };
    let payloadUpdate = {
        "TransactionID": "5424d224-f1b0-4f8b-87df-21feb1bce102",
        "RetailerID": "dolor laborum",
        "ProductID": "id velit tempor aliquip enim",
        "SKUCode": "labore irure magna consectetur",
        "UPCode": "proident laborum anim Lorem occaecat",
        "Location": {
            "LocationID": "id occaecat labore",
            "Name": "aliqua"
        },
        "GPS": "cupidatat",
        "Date": "deserunt voluptate officia incididunt",
        "Registration": {
            "TransactionID": "eiusmod non anim",
            "EmailID": "in reprehenderit eiusmod",
            "CertificateHash": "eiusmod"
        }
    };
    afterEach(function(done) {
        setTimeout(function() {
            done();
        }, 30000);
    });
    before(async () => {
        try {
            const email = `transaction${nanoid()}@fakeemail.com;`
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

    it("Creates Transaction", async function() {
        const response = await axios({
            method: 'post',
            url: "http://localhost:3000/transaction",
            data: payloadCreate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadCreate.objectType = "Transaction";
        expect(response.status).to.be.equal(200);
        expect(payloadCreate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Updates Transaction", async function() {
        const response = await axios({
            method: 'put',
            url: "http://localhost:3000/transaction",
            data: payloadUpdate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadUpdate.objectType = "Transaction";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets a Transaction by id", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/transaction/5424d224-f1b0-4f8b-87df-21feb1bce102",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        })
        payloadUpdate.objectType = "Transaction";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets all Transactions", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/transactionlist",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(JSON.parse(response.data.objectBytes)).to.deep.include(payloadUpdate);

    });

    it("Deletes Transaction", async function() {
        const response = await axios({
            method: 'delete',
            url: "http://localhost:3000/transaction/5424d224-f1b0-4f8b-87df-21feb1bce102",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(response.data.objectBytes).to.be.equal('');
    });
});