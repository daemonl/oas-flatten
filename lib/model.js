"use strict";

function* walkSchemas(schemas) {

    for (const name in schemas) {
        yield* walkSchemaObject({
			schema: schemas[name],
			name: name,
			namePath: [name],
			parent: null
		})
    }
}

function* walkProperty(property) {
	if (property.schema.type === 'object') {
		yield* walkSchemaObject(property)
		return
	}

	if (property.schema.type === 'array') {
		yield* walkProperty(Object.assign({}, property, {
			schema: property.schema.items
		}))
		return
	}
}

function* walkSchemaObject(parent) {

	parent.properties = [];

	for (const propertyName in parent.schema.properties) {
		const propertySchema = parent.schema.properties[propertyName];

		yield* walkProperty({
			schema: propertySchema,
			parent: parent,
			name: propertyName,
			namePath: parent.namePath.concat([propertyName])
		})

		parent.properties.push({
			schema: propertySchema,
			name: propertyName
		})
	}
	yield parent;
}

module.exports = {
    walkSchemas: walkSchemas
}
/*
    let state = {
        schema: schema,
        parent: null,
        name: '',
    }

    if (typeof state.depth === 'undefined') state = getDefaultState();
    if ((schema === null) || (typeof schema === 'undefined')) return schema;
    if (typeof schema.$ref !== 'undefined') {
        let temp = {$ref:schema.$ref};
        callback(temp,parent,state);
        return temp; // all other properties SHALL be ignored
    }

    if (state.combine) {
        if (schema.allOf && Array.isArray(schema.allOf) && schema.allOf.length === 1) {
            schema = Object.assign({},schema.allOf[0],schema);
            delete schema.allOf;
        }
        if (schema.anyOf && Array.isArray(schema.anyOf) && schema.anyOf.length === 1) {
            schema = Object.assign({},schema.anyOf[0],schema);
            delete schema.anyOf;
        }
        if (schema.oneOf && Array.isArray(schema.oneOf) && schema.oneOf.length === 1) {
            schema = Object.assign({},schema.oneOf[0],schema);
            delete schema.oneOf;
        }
    }

    callback(schema,parent,state);
    if (state.seen.has(schema)) {
        return schema;
    }
    //else
    if ((typeof schema === 'object') && (schema !== null)) state.seen.set(schema,true);
    state.top = false;
    state.depth++;

    if (typeof schema.items !== 'undefined') {
        walkSchema(schema.items,schema,subState(state,schema,'items'),callback);
    }
    if (schema.additionalItems) {
        if (typeof schema.additionalItems === 'object') {
            walkSchema(schema.additionalItems,schema,subState(state,schema,'additionalItems'),callback);
        }
    }
    if (schema.additionalProperties) {
        if (typeof schema.additionalProperties === 'object') {
            walkSchema(schema.additionalProperties,schema,subState(state,schema,'additionalProperties'),callback);
        }
    }
    if (schema.properties) {
        for (let prop in schema.properties) {
            let subSchema = schema.properties[prop];
            walkSchema(subSchema,schema,subState(state,schema,'properties/'+prop),callback);
        }
    }
    if (schema.patternProperties) {
        for (let prop in schema.patternProperties) {
            let subSchema = schema.patternProperties[prop];
            walkSchema(subSchema,schema,subState(state,schema,'pathProperties/'+prop),callback);
        }
    }
    if (schema.allOf) {
        for (let index in schema.allOf) {
            let subSchema = schema.allOf[index];
            walkSchema(subSchema,schema,subState(state,schema,'allOf/'+index),callback);
        }
    }
    if (schema.anyOf) {
        for (let index in schema.anyOf) {
            let subSchema = schema.anyOf[index];
            walkSchema(subSchema,schema,subState(state,schema,'anyOf/'+index),callback);
        }
    }
    if (schema.oneOf) {
        for (let index in schema.oneOf) {
            let subSchema = schema.oneOf[index];
            walkSchema(subSchema,schema,subState(state,schema,'oneOf/'+index),callback);
        }
    }
    if (schema.not) {
        walkSchema(schema.not,schema,subState(state,schema,'not'),callback);
    }
    state.depth--;
    return schema;
}*/
