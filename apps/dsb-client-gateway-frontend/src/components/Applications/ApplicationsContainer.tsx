import { Application as ApplicationType } from '../../utils'
import Application from './Applications'

type ApplicationContainerProps = {
    auth?: string
    applications: ApplicationType[]
    did?: string
}

export const ApplicationContainer = ({ applications, did }: ApplicationContainerProps) => {
    return <Application applications={applications} myDID={did} />
}