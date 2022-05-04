import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import UserDetails from '../models/user.js'

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const existingUser = await UserDetails.findOne({ email })

        if(!existingUser) return res.status(404).json({ message: "User doesn't exist."})

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials." })

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'grey', { expiresIn: '1h' })

        res.status(200).json({ profileInfo: existingUser, token })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." })
    }
}

export const signup = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } =  req.body

    try {
        const existingUser = await UserDetails.findOne({ email })

        if(existingUser) return res.status(400).json({ message: "User already exists."})

        if(password != confirmPassword) return res.status(400).json({ message: "Passwords don't match"})

        const hashedPassword = await bcrypt.hash(password, 12)
        
        const profileInfo = await UserDetails.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` })

        const token = jwt.sign({ email: profileInfo.email, id: profileInfo._id }, 'grey', { expiresIn: '1h' })

        res.status(200).json({ profileInfo, token })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." })
    }
}