const { expect } = require("chai")
const chai = require("chai")
const chaiHttp = require("chai-http")
const app = require("../app")

chai.use(chaiHttp)

describe("test requirement 6", () => {
    describe("GET /", () => {
        it("it should render index.ejs file and data", (done) => {
            chai
            .request(app)
            .get("/")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.equal(200)
                expect(res.text).to.contain("name")
                expect(res.body).to.be.an("object")
                expect(res.body).to.not.be.an("array")
                done()
            })
        })
    })
    describe("POST /", () => {
        it("it should post product info", (done) => {
            const product = {
                description: "t-shirt",
                price: "2$",
                category: "clothes",
                img: "random"
            }     
            chai
            .request(app)
            .post("/")
            .send(product)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an("object")
                expect(res.body).to.not.be.an("array")
                expect(product).to.have.property("description").eq("t-shirt")
                expect(product).to.have.property("price").eq("2$")
                expect(product).to.have.property("category").eq("clothes")
                expect(product).to.have.property("img").eq("random")
                done()
            })
        })
    })
})
