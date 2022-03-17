import { config } from '../config'

export const PARENT_NAMESPACE = config.iam.parentNamespace
export const USER_ROLE = `user.roles.${PARENT_NAMESPACE}`
export const MESSAGEBROKER_ROLE = `messagebroker.roles.${PARENT_NAMESPACE}`
export const TOPIC_HEADERS = [
    {
        Header: 'VERSION',
        accessor: 'version',
        filter: 'includes',
    },
    {
        Header: 'TOPIC NAME',
        accessor: 'name',
        filter: 'fuzzyText',
    },
    {
        Header: 'SCHEMA TYPE',
        accessor: 'schemaType',
        filter: 'fuzzyText',
    },

    {
        Header: 'UPDATED DATE',
        accessor: 'updatedDate',
        filter: 'includes',
    }
]


export const APPLICATIONS_HEADERS = [
    {
        Header: 'APPLICATION NAME',
        accessor: 'appName',
        filter: 'includes',
    },
    {
        Header: 'APPLICATION NAMESPACE',
        accessor: 'applicationNameSpace',
        filter: 'fuzzyText',
    },
    {
        Header: 'NO. OF TOPICS',
        accessor: 'topicsCount',
    }
]