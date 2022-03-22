import { Application as ApplicationType } from '../../utils'
import 'react-json-view-lite/dist/index.css'
import Table from '../Table/Table'

import { APPLICATIONS_HEADERS as applicationHeaders } from '../../utils/constants'

type TopicProps = {
    applications: ApplicationType[] | undefined
    myDID?: string
}

export default function Application({ applications, myDID }: TopicProps) {

    return (
        <div >
            <Table
                headers={applicationHeaders}
                dataRows={applications}
                location='Application'
            />
        </div>
    )
}
