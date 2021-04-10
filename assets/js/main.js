import '../css/flatly.css'
import '../css/main.css'

import CountUp from './countUp.js'
import QRCode from 'qrcode'
// import bootoast from './bootoast'

let pillsBuyTab = document.getElementById('pills-buy-tab')
let pillsSellTab = document.getElementById('pills-sell-tab')
let refreshInfoBtn = document.getElementById('refreshInfo')

let buyRateInfo = document.getElementById('buyRateInfo')
let sellRateInfo = document.getElementById('sellRateInfo')
let reserveInfo = document.getElementById('reserveInfo')

let buyIdInput = document.querySelector('.id-buy-input')
let buyCoinsInput = document.querySelector('.amount-buy-coins')

let sellIdInput = document.querySelector('.id-sell-input')
let sellCoinsInput = document.querySelector('.amount-sell-coins')
let sellQiwiInput = document.querySelector('.sell-qiwi-phone')

let buyResultAmountCoins = document.querySelector('.buyResultAmountCoins')
let buyResultAmountPrice = document.querySelector('.buyResultAmountPrice')

let sellResultAmountCoins = document.querySelector('.sellResultAmountCoins')
let sellResultAmountPrice = document.querySelector('.sellResultAmountPrice')

let buyModalBtn = document.getElementById('buyModalBtn')
let sellModalBtn = document.getElementById('sellModalBtn')

let sellQrImg = document.querySelector('.sell-qr-img')
let sellCoinUrl = document.querySelector('.sell-coin-url')
let sellCheckLink = document.querySelector('.check-sell-link')

generateQR(sellCoinUrl.href)

async function generateQR(text) {
  try {
    sellQrImg.src = await QRCode.toDataURL(text)
  } catch (err) {
    console.error(err)
  }
}

let toggleTabs = () => {
	document.getElementById('pills-buy-tab').classList.toggle('active')
	document.getElementById('pills-sell-tab').classList.toggle('active')

	document.querySelectorAll('.tab-pane').forEach(item => {
		item.classList.toggle('show')
		item.classList.toggle('active')
	})
}

let getInfo = () => {
	fetch('/getinfo', {method:'post'})
	.then(response => response.json())
	.then(data => updatePriceList(data))
	.catch(e => console.error(e.message))
}

let buyOrder = (url, body) => {
    fetch(url, {method: 'post', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)})
	.then(response => response.json())
	.then(data => {
        window.open(data.paymentData.url, '_blank')
        window.location.href = '/order/' + data.detail.payload
    })
	.catch(e => console.log(e.message))
}

let sellOrder = (url, body) => {
	fetch(url, {method: 'post', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)})
	.then(response => response.json())
	.then(data => {
        // window.open(data.paymentData.url, '_blank')
        generateQR(data.paymentData.url)

        sellCoinUrl.setAttribute('href',data.paymentData.url)
        sellCoinUrl.innerText = data.paymentData.url
        sellCheckLink.setAttribute('href','/order/' + data.detail.payload)
        //дічь ot лохов
        sellModal.classList.add('active')
        document.querySelector('.modal-backdrop').classList.add('modal-show')
    })
	.catch(e => console.log(e.message))
}

buyCoinsInput.oninput = event => {
	let amount = event.target.value
    if(amount.length > 14) {
        event.preventDefault()
        return false
    }
    let price = Math.ceil((amount / 1000 * sellRateInfo.innerText / 1000) * 10) / 10

    buyResultAmountCoins.innerText = toCoinsFormat(amount)
    buyResultAmountPrice.innerText = price
}

sellCoinsInput.oninput = event => {
    let amount = event.target.value
    if(amount.length > 14) {
        event.preventDefault()
        return false
    }
    let price = Math.floor((amount / 1000 * buyRateInfo.innerText / 1000) * 100) / 100

    sellResultAmountCoins.innerText = toCoinsFormat(amount)
    sellResultAmountPrice.innerText = price
}

buyModalBtn.onclick = event => {
    event.preventDefault()

    let vkid = Number(buyIdInput.value)
    let amount = Number(buyCoinsInput.value)
    let reserve = Number(reserveInfo.innerText.replace(/\s+/g, ''))
    let price = Math.ceil((amount / 1000 * sellRateInfo.innerText / 1000) * 10) / 10

    console.log(`amount: ${amount} vs ${reserve}`)

    !vkid ? alert('Заполните поле id корректно - id вконтакте должен быть цифрами') :
    price < 1 ? alert('Cумма покупки должна быть больше 1 рубля') :
    amount > reserve ? alert('Покупка должна быть меньше резерва') :
    buyOrder('/buyorder', {vkid, amount})

    return false
}

sellModalBtn.onclick = event => {
    event.preventDefault()

    let vkid = Number(sellIdInput.value)
    let amount = Number(sellCoinsInput.value) * 1000
    let qiwi = Number(sellQiwiInput.value)
    let price = Math.ceil((amount / 1000 * buyRateInfo.innerText / 1000) * 10) / 10

    !vkid ? alert('Заполните поле id корректно - id вконтакте должен быть цифрами') :
    price < 1 ? alert('Cумма продажи должна быть больше 1 рубля') :
    !qiwi ? alert('Укажите ваш qiwi кошелек, на который придут средства') :
    sellOrder('/sellorder', {vkid, amount, qiwi})

    return false
}

let updatePriceList = (data) => {
	buyRateInfo.innerText = data.buy
	sellRateInfo.innerText = data.sell

    //let reserve = +data.reserve.replace(/[^.\d]+/g,"").replace( /^([^\.]*\.)|\./g, '$1' )

	let animateNumber = new CountUp('reserveInfo', +data.reserve, {decimalPlaces: 3, separator: ' '})
	animateNumber.start()
}

let toCoinsFormat = amount => Number(amount).toLocaleString('ru-RU')

//event listeners
pillsBuyTab.addEventListener('click', toggleTabs)
pillsSellTab.addEventListener('click', toggleTabs)
refreshInfoBtn.addEventListener('click', getInfo)

document.querySelector('.modal-close').addEventListener('click', e => {
    sellModal.classList.remove('active')
    document.querySelector('.modal-backdrop').classList.remove('modal-show')
})

// let mutations = document.querySelector('.mutation-elems')

// let observer = new MutationObserver(mutations => {

//     for(let mutation of mutations) {
//         console.log(mutations); // console.log(изменения)
//         mutation.target.innerText = toCoinsFormat(mutation.target.innerText)
//     }

// });

// // наблюдать за всем, кроме атрибутов
// observer.observe(mutations, {
//     childList: true, // наблюдать за непосредственными детьми
//     subtree: true, // и более глубокими потомками
//     characterDataOldValue: true // передавать старое значение в колбэк
// })

setInterval(getInfo, 25000)