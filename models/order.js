const {Schema, model} = require('mongoose')

const orderSchema = new Schema({
	status: {
		type: String,
		default: 'Ожидание'
	},
	vk: {
		from: Number,
		to: Number
	},
	amount: {
		type: Number,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	qiwi: {
		from: Number,
		to: Number
	},
	exchangeRate: Number,
	price: Number,
	trade: {
		cl: String,
		tip: String,
		buy: Boolean,
		sell: Boolean 
	},
	comment: {
		type: String,
		required: true,
		//unique: true
	},
	date: {
		full: Date,
		mounths: Number,
		days: Number,
		hours: Number,
		minutes: Number,
		seconds: Number
	}
});

module.exports = model('order', orderSchema)