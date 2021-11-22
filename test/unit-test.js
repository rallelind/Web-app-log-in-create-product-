const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");

chai.should()

chai.use(chaiHttp);

describe("rest API", () => {
    describe("POST /", () => {
        it("It should POST a new product", (done) => {
            const product = {
                description: "t-shirt",
                price: "2$",
                category: "clothes",
                image: "img"
            };
            chai.request(server)
                .post("/")
                .send(product)
                .end((res, err) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("description")
                    res.body.should.have.property("price")
                    res.body.should.have.property("category")
                    res.body.should.have.property("img")
                done()
                })
        })
    })
})