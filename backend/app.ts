import Server from './index'

const port: number = Number(process.env.PORT) || 3001

const serverInstance: Server = new Server()
serverInstance.start(port)

export default serverInstance.app
