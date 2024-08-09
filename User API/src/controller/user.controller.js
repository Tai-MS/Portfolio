import userService from '../service/user.service.js'

async function signUp(req, res, next){
    const fields = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        confirmPass: req.body.confirmPass
    }
    const callToService = await userService.signUp(fields)
    if(callToService === 'M'){
        return res.status(400).send('Missing fields')
    }else if(callToService === 'A'){
        return res.status(409).send('Email already in use.')
    }else if(callToService === 'P'){
        return res.status(400).send(`Password doesn't match.`)
    }
    return res.status(201).send({ message: callToService });
}

async function login(req, res, next){
    const fields = {
        email: req.body.email,
        password: req.body.password
    }
    const callToService = await userService.login(fields)

    if(callToService === 'M'){
        return res.status(400).send(callToService)
    }else if(callToService === 'P'){
    return res.status(401).send(callToService)
    }else if(callToService === 'logged in'){
        return res.status(200).send(callToService)
    }
    
    return res.status(500).send(callToService)
}

async function update(req, res, next){
    const callToService = await userService.update(req.body)
    return callToService    
}

async function deleteUser(req, res, next){
    const callToService = await userService.deleteUser(req.body.email)
    return callToService
}

async function getUser(req, res, next){
    const email = req.params.user
    const callToService = await userService.getUser(email)
    if(callToService === 'D'){
        return res.status(400).send(callToService)
    }
    return res.status(200).send(callToService)
}

export default {
    getUser,
    deleteUser,
    signUp,
    login,
    update
}