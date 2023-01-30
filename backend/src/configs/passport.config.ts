import { Strategy, ExtractJwt } from 'passport-jwt'
import passport from 'passport'
import { getOneUser } from '../services/auth.service'
import { Request } from 'express'

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
}

passport.use(
  'jwt',
  new Strategy(opts, async function (jwt_payload, done) {
    const user = await getOneUser(jwt_payload.email)
    if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  })
)

passport.use(
  'jwt-admin',
  new Strategy(opts, async function (jwt_payload, done) {
    const user = await getOneUser(jwt_payload.email)
    if (user && user.isAdmin) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  })
)

const cookieExtractor = function (req: Request) {
  let token = null
  if (req && req.cookies) {
    token = req.cookies['jwt']
  }
  return token
}

const refreshOpts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.REFRESH_TOKEN_SECRET,
}
const refreshStrategy = new Strategy(refreshOpts, async function (
  jwt_payload,
  done
) {
  const user = await getOneUser(jwt_payload.email)
  if (user) {
    return done(null, user)
  } else {
    return done(null, false)
  }
})

passport.use('refresh', refreshStrategy)
