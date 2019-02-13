const { Router } = require('express')
const router = Router()
const path = require('path')
const Image = require('../models/Image')
const { unlink } = require('fs-extra')

router.get('/', async (req, res) => {
    const images = await Image.find()
    console.log(images)
    res.render('index', {images: images})
})

router.get('/upload', (req, res) => {
    res.render('upload')
})

router.post('/upload', async (req, res) => {
    const image = new Image()
    image.title = req.body.title
    image.description = req.body.description
    image.filename = req.file.filename
    image.path = '/img/uploads/' + req.file.filename
    image.mimetype = req.file.mimetype
    image.originalname = req.file.originalname
    image.size = req.file.size

    await image.save()
    res.redirect('/')
})

router.get('/image/:id', async (req, res) => {
    const { id } = req.params
    const image = await Image.findById(id)
    console.log(image)
    res.render('profile', { image: image })
})

router.get('/image/:id/delete', async (req, res) => {
    const { id } = req.params
    const image = await Image.findByIdAndRemove(id)
    await unlink(path.resolve('./src/public' + image.path))
    res.redirect('/')
})

module.exports = router