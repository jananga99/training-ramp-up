import { Strategy, ExtractJwt } from 'passport-jwt'
import passport from 'passport'
import { getOne } from '../services/user.service'
import { Request } from 'express'

const cookieExtractorAccess = function (req: Request) {
  let token = null
  if (req && req.cookies) {
    token = req.cookies['jwt-access']
  }
  return token
}
const cookieExtractorRefresh = function (req: Request) {
  let token = null
  if (req && req.cookies) {
    token = req.cookies['jwt-refresh']
  }
  return token
}

const opts = {
  jwtFromRequest: cookieExtractorAccess,
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
}
const refreshOpts = {
  jwtFromRequest: cookieExtractorRefresh,
  secretOrKey: process.env.REFRESH_TOKEN_SECRET,
}

const jwtStrategy = new Strategy(opts, async function (jwt_payload, done) {
  const user = await getOne(jwt_payload.email)
  if (user) {
    return done(null, user)
  } else {
    return done(null, false)
  }
})

const jwtAdminStrategy = new Strategy(opts, async function (jwt_payload, done) {
  const user = await getOne(jwt_payload.email)
  if (user && user.isAdmin) {
    return done(null, user)
  } else {
    return done(null, false)
  }
})

const refreshStrategy = new Strategy(refreshOpts, async function (jwt_payload, done) {
  const user = await getOne(jwt_payload.email)
  if (user) {
    return done(null, user)
  } else {
    return done(null, false)
  }
})

passport.use('jwt', jwtStrategy)
passport.use('jwt-admin', jwtAdminStrategy)
passport.use('refresh', refreshStrategy)
