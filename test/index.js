var test = require("tape")

var virtualHyperscript = require("../index")

test("virtualHyperscript is a function", function (assert) {
    assert.equal(typeof virtualHyperscript, "function")
    assert.end()
})
