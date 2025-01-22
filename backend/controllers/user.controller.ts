import { Request, Response } from 'express'
import { Pool } from 'pg'
import bcrypt from 'bcrypt'

export default class UserController {
  private dbConnection: Pool

  constructor(db: Pool) {
    this.dbConnection = db
  }

  public userSignUp = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        username,
        email,
        password,
      }: { username: string; email: string; password: string } = req.body

      if (!username.trim() || !email.trim() || !password.trim()) {
        res.status(400).json({ message: `All credentials are required` })
      }

      const emailCheckQuery = `SELECT * FROM users WHERE email = $1`
      const emailCheckResult = await this.dbConnection.query(emailCheckQuery, [
        email,
      ])
      if (emailCheckResult.rows.length > 0) {
        res.status(400).json({ message: `Email is already registered` })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const insertQuery = `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, username, email
      `
      const values = [username, email, hashedPassword]
      const result = await this.dbConnection.query(insertQuery, values)

      res.status(201).json({
        message: `User created successfully`,
        user: result.rows[0],
      })
    } catch (error) {
      console.error(`Error in createUser:`, error)
      res
        .status(500)
        .json({ message: `Something went wrong while creating a user` })
    }
  }
  public userSignIn = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ message: 'Credentials are required' })
      return
    }

    const emailCheckQuery = `SELECT * FROM users WHERE email = $1`
    const emailCheckResult = await this.dbConnection.query(emailCheckQuery, [
      email,
    ])

    if (emailCheckResult.rows.length === 0) {
      res.status(404).json({ message: 'User is not registered' })
      return
    }

    const user = emailCheckResult.rows[0]
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }
    // we can definetly set it to cookies but that would only overengineer the assignment. So just sending back the response ✌
    res.status(200).json({
      message: 'User signed in successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })
  }
}
