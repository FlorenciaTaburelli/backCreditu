const { Router } = require('express')
const router = Router()
const {checkNickname2, getAllPlayers, createPlayer, deletePlayer, modifyPlayer, chargePlayers, searchPlayer, checkNickname } = require('../controllers/functionPlayers')




router.get('/chargeDb', async (req, res) => {
  try {
    await chargePlayers()
    res.send('se cargaron correctamente')
  } catch (error) {
    res.status(401).json(error.message)
  }
})

router.get('/players', async (req, res) => {
  let { page = 0, size = 15, orderby} = req.query
  try {
    orderby = orderby !== 'asc' && orderby !== 'desc' ? 'desc' : orderby
    res.status(200).json(await getAllPlayers(page, size, orderby))      
  } catch (error) {
    res.status(401).json({
      name : error.name,
      msg : error.message
    })
  }
})

router.get('/searchplayer', async(req, res) =>{
  let {nickname, status, page = 0, size = 15, orderby} = req.query
  orderby = orderby !== 'asc' && orderby !== 'desc' ? 'desc' : orderby
  if(!nickname && !status) return res.status(400).json({message: 'Un nickname o status es requerido'})
  try {
    res.status(200).json(await searchPlayer(nickname, status, page, size, orderby))
  } catch (error) {
    res.status(401).json({
      name : error.name,
      msg : error.message
    })
  }
})


router.get('/checkNickname/:nickname', async (req, res) => {
  const {nickname} = req.params
  try {
    if(nickname){
      return res.status(200).json(await checkNickname(nickname))   
    }else{
      return res.status(400).json('Un nickname es requerido')
    }
  } catch (error) {
    res.status(400).json({
      name : error.name,
      msg : error.message
    })
  }
})

router.post('/players', async (req, res) =>{
  const {nickname, avatar, score, user_id} = req.body
  if(!user_id) return res.status(400).json({message: 'Debe enviar un user_id'})
  if(!nickname || !avatar) return res.status(400).json('El player debe tener un nickname y avatar')
  try {
    const nicknameFound = await checkNickname(nickname)
    if(nicknameFound) return res.status(400).json({message: 'El nickname ya existe'})
    res.status(201).json(await createPlayer(nickname, avatar, score, user_id))  
  } catch (error) {
    res.status(401).json({
      name : error.message,
      msg: error.message
    })
  }
})

router.delete('/players/', async (req, res) => {
  const {playerId, user_id} = req.body
  try {
    const deletedPlayer = await deletePlayer(playerId, user_id) 
    if(deletedPlayer === 1){
      return res.status(200).json('El player fue eliminado correctamente')    
    }else{
      return res.status(400).json('el player no existe')
    }     
  } catch (error) {
    res.status(401).json({
      name : error.name,
      msg : error.message
    })
  }
})

router.put('/players/:id', async (req, res) => {
  const {id} = req.params
  const { nickname, avatar, score, user_id } = req.body
  if(!user_id) return res.status(400).json({message: 'un user_id es requerido'})
  try {
    const players = await checkNickname2()
    const filtered = players.filter(p => parseInt(p.dataValues.id) !== parseInt(id))
    const isIn = filtered.find(p => p.dataValues.nickname === nickname)

    if(!isIn)
      return res.status(200).json(await modifyPlayer(id, nickname, avatar, score, user_id)) 
      
    return res.status(400).json({message: 'El nickname ya existe'})    
  } catch (error) {
    res.status(401).json({
      name : error.name,
      msg : error.message
    })
  }
})



module.exports = router
