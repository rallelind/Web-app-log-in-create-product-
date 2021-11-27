const { expect } = require("chai")
const chai = require("chai")
const chaiHttp = require("chai-http")
const app = require("../app")

chai.use(chaiHttp)

describe("routes test", () => {
    describe("GET /profile", () => {
        it("it should render ejs file", (done) => {
            chai
            .request(app)
            .get("/profile")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.equal(200)
                expect(res.text).to.contain("name")
                expect(res.body).to.be.an("object")
                expect(res.body).to.not.equal("array")
                done()
            })
        })
    })
})
