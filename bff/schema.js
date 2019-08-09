const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLSchema
} = require('graphql')
const {
    BASE_API_PATH
} = require('./constants/apiPaths')
const axios = require('axios')

const LaunchType = new GraphQLObjectType({
    name: 'Launch',
    fields: () => ({
        flight_number: {
            type: GraphQLInt
        },
        mission_name: {
            type: GraphQLString
        },
        launch_year: {
            type: GraphQLString
        },
        launch_date_local: {
            type: GraphQLString
        },
        launch_success: {
            type: GraphQLBoolean
        },
        rocket: {
            type: RocketType
        },
    })
})

const RocketType = new GraphQLObjectType({
    name: 'Rocket',
    fields: () => ({
        rocket_id: {
            type: GraphQLString
        },
        rocket_name: {
            type: GraphQLString
        },
        rocket_type: {
            type: GraphQLString
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        launches: {
            type: new GraphQLList(LaunchType),
            async resolve(parent, args) {
                const result = await axios.get(`${BASE_API_PATH}/launches`)
                return result.data
            }
        },
        launch: {
            type: LaunchType,
            args: {
                flight_number: {
                    type: GraphQLInt
                }
            },
            async resolve(parent, args) {
                const result = await axios(`${BASE_API_PATH}/${args.flight_number}`)
                return result.data;
            }
        },
        rockets: {
            type: new GraphQLList(LaunchType),
            async resolve(parent, args) {
                const result = await axios.get(`${BASE_API_PATH}/rockets`)
                return result.data
            }
        },
        rocket: {
            type: LaunchType,
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            async resolve(parent, args) {
                const result = await axios(`${BASE_API_PATH}/rockets/${args.id}`)
                return result.data;
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})