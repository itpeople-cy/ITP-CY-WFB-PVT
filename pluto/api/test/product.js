const axios = require("axios");
const expect = require("chai").expect;
const _ = require("lodash");
const nanoid = require('nanoid');
const log4js = require('log4js');
const logger = log4js.getLogger("Product-test");
describe("Product api ", async function() {
    this.timeout(45000);
    let xAccessToken;
    let payloadCreate = {
        "ProductID": "d52c3e52-560c-4788-a943-ceac3b302894",
        "SKUID": "proident et in in ut",
        "UPCode": "in ullamco",
        "ProfileID": "laboris Lorem id",
        "FactoryID": "mo",
        "OrderNumber": "sed",
        "RetailerID": "commodo",
        "Color": "deserunt adipisicing officia est",
        "MSRP": "nostrud ex",
        "ManufactureDate": "dolore aliquip",
        "ImageIDs": ["eu nostrud nulla tempor sed", "dolor velit incididunt sint", "qui ea occaecat dolore do"]
    };
    let payloadUpdate = {
        "ProductID": "d52c3e52-560c-4788-a943-ceac3b302894",
        "SKUID": "fugiat consectetur laborum veniam",
        "UPCode": "do sed",
        "ProfileID": "qui nulla",
        "FactoryID": "officia Lorem ut dolor",
        "OrderNumber": "ad veniam cillum Lorem",
        "RetailerID": "nulla",
        "Color": "qu",
        "MSRP": "quis sed sint",
        "ManufactureDate": "ad ipsum exercitation irure dolore",
        "ImageIDs": ["nostrud in Ut sit consequat", "tempor consectetur id ullamco sunt", "qui", "do exercitation ex irure"]
    };
    afterEach(function(done) {
        setTimeout(function() {
            done();
        }, 30000);
    });
    before(async () => {
        try {
            const email = `product${nanoid()}@fakeemail.com;`
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

    it("Creates Product", async function() {
        const response = await axios({
            method: 'post',
            url: "http://localhost:3000/product",
            data: payloadCreate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadCreate.objectType = "Product";
        expect(response.status).to.be.equal(200);
        expect(payloadCreate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Updates Product", async function() {
        const response = await axios({
            method: 'put',
            url: "http://localhost:3000/product",
            data: payloadUpdate,
            json: true,
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        payloadUpdate.objectType = "Product";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets a Product by id", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/product/d52c3e52-560c-4788-a943-ceac3b302894",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        })
        payloadUpdate.objectType = "Product";
        expect(response.status).to.be.equal(200);
        expect(payloadUpdate).to.be.deep.equal(JSON.parse(response.data.objectBytes));
    });

    it("Gets all Products", async function() {
        const response = await axios({
            method: 'get',
            url: "http://localhost:3000/productlist",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(JSON.parse(response.data.objectBytes)).to.deep.include(payloadUpdate);

    });

    it("Deletes Product", async function() {
        const response = await axios({
            method: 'delete',
            url: "http://localhost:3000/product/d52c3e52-560c-4788-a943-ceac3b302894",
            headers: {
                "content-type": "application/json",
                "x-access-token": xAccessToken
            }
        });
        expect(response.status).to.be.equal(200);
        expect(response.data.objectBytes).to.be.equal('');
    });
});