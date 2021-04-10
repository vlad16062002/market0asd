const { Router } = require('express')
const router = Router()
const config = require('../config')

const vkcoin = require('../models/vkcoin.js')
const order = require('../models/order.js')

// router.get('/set/vkcoin', async (req, res) => {
// 	let status = await vkcoin.api.setCallback('https://f90b78ff.ngrok.io/callback/vkcoin')
// 	res.status(200).json(status) 

router.post('/qiwi', async (req, res) => {

	let { payment } = req.body

	if (payment) {
		let result = await order.findOne({
			comment: payment.comment,
			amount: payment.sum.amount,
			vk: { from: payment.account, to: config.myQiwi },
			status: 'Ожидание оплаты'
		})

		result.status = 'Оплачено'
		result.save()

		if (result) {
			try {
				let resPayCoin = await vkcoin.api.sendPayment(result.vk.to, result.amount, true) // 1 коин = 1000 ед.

				console.log(resPayCoin)
				//if err then throw

				result.status = 'Успех'
				result.save()
			} catch (e) {
				console.log('vernut sheykeli')

				result.status = 'Возврат'
				result.save()
			}	
		}
		else {
			console.log('not found order')
		}

	}

	res.sendStatus(200)
})

module.exports = router