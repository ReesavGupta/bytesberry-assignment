import { Request } from 'express'
import { Pool } from 'pg'

export default class TodoController {
  private dbConnection: Pool
  constructor(db: Pool) {
    this.dbConnection = db
  }
  public getTodos = async (req: Request, res: Response): Promise<void> => {
    console.log(`do something`)
  }
}
