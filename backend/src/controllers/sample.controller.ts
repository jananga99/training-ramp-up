import { Request, Response, NextFunction } from 'express'

async function getSamples(req: Request, res: Response, next: NextFunction) {
  res.status(200)
  res.json(['John', 'Jesse'])
}

async function createSample(req: Request, res: Response, next: NextFunction) {}

async function updateSample(req: Request, res: Response, next: NextFunction) {}

async function removeSample(req: Request, res: Response, next: NextFunction) {}

export { getSamples, createSample, updateSample, removeSample }
