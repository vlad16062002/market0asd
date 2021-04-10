const { check } = require('express-validator')

exports.buyValidator = [
	check('vkid', 'Ваш ID вконтакте должен быть в цифровом виде').isInt({min: 1}),
	check('amount', 'Сумма должна быть не менее 1000 или не более резерва').isInt({min: 1e3, max: 1e30})
]

exports.sellValidator = [
	check('vkid', 'Ваш ID вконтакте должен быть в цифровом виде').isInt({min: 1}),
	check('amount', 'Сумма должна быть не менее 1000 или количество указано не верно').isInt({min: 1e3, max: 1e30}),
	check('qiwi', 'Ваш QIWI кошелек указан неверно').isMobilePhone(['uk-UA', 'ru-RU'])
]