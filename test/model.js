"use strict"

const {walkSchemas} = require("../lib/model");
const {expect} = require('chai');

describe("Schema To Model", () => {

    it("Should walk a basic schema", () => {
        const schemaGen = walkSchemas({
            "Person": {
                type: "object",
                properties: {
                    id: { type: "integer", format: "int64" },
                    name: { type: "string" },
                    address: {
                        type: "object",
                        properties: {
                            line1: { type: "string" },
                            line2: { type: "string" }
                        }
                    },
                    emails: {
                        type: "array",
                        items: { type: "string", format: "email" }
                    }
                }
            }
        })

        let rootObjects = []

        for (const val of schemaGen) {
            rootObjects.push(val);
            console.log(val);
        }

        expect(rootObjects).to.have.length(2);

    })

})
