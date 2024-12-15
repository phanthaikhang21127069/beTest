import { randomInt } from "crypto"

export function generateOtp(length: number = 6): string {
    const max = Math.pow(10, length)
    const randomNumber = randomInt(0, max)
    return randomNumber.toString().padStart(length, '0')
}