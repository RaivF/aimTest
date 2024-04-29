import './style.css'
import './style.table.css'
//инициализация блока с изображениями
const result = document.getElementById('result')
const falseStart = document.getElementById('false-start')
const waiting = document.getElementById('waiting')
const waitingClick = document.getElementById('waitingClick')
const reaction = document.getElementById('reaction')
const main = document.getElementById('main')
const tableFill = document.getElementById('table-fill')
//инициализация блока с главной кнопкой

//инициализация блока информации
const averageSpan = document.getElementById('average')
const info = document.getElementById('info')
const trySpan = document.getElementById('try')
const txtUnderImg = document.getElementById('txt-under-img')
const tableHover = document.getElementById('table-hover')

//инициализация кнопок
const buttonClear = document.getElementById('buttonClear')
const buttonShow = document.getElementById('buttonShow')

//установка цвета фона кнопки
main.classList.add('dark-green')
info.classList.add('dark-green')

result.classList.add('non-active')
falseStart.classList.add('non-active')
waiting.classList.add('non-active')
waitingClick.classList.add('non-active')
reaction.classList.add('active')

let stage = 0
let average = []
let startDate = 0
let hide = false
let error = false
let averageSession
let arrToSessionAverage = []
let reactionTime = 0
let reactionTimes = []
let countSuccessfulTry = 0

let arrAverageReactionTime = JSON.parse(
	localStorage.getItem('AverageReactionTime')
)

if (arrAverageReactionTime === null) {
	arrAverageReactionTime = [{ average: 'время', date: 'дата' }]
}
tableFill.classList.add('non-active')

let refreshTable = () => {
	tableHover.innerHTML = ''
	arrAverageReactionTime.map(item => {
		tableHover.insertAdjacentHTML(
			'afterbegin',
			`
    	<tr>
				<td class="text-left"> ${item.date}</td>
				<td class="text-left">${item.average} мс</td>
			</tr>
`
		)
	})
}

if (arrAverageReactionTime != null) {
	refreshTable()
}

function randomDelay(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}
//функция обработчика клика
const clickHandler = () => {
	if (stage === 0) {
		result.classList.remove('active')
		result.classList.add('non-active')

		reaction.classList.remove('active')
		reaction.classList.add('non-active')

		waiting.classList.remove('non-active')
		waiting.classList.add('active')

		main.classList.remove('dark-green')
		main.classList.add('orange')
		info.classList.add('orange')

		setTimeout(startTimer, randomDelay(1000, 3000))
	}
	if (stage === 2) {
		stopTimer()
	}
}

let startTimer = () => {
	if (error) {
		waiting.classList.remove('active')
		waiting.classList.add('non-active')

		main.classList.remove('orange')
		info.classList.remove('orange')

		main.classList.add('dark-green')
		info.classList.add('dark-green')

		falseStart.classList.remove('non-active')
		falseStart.classList.add('active')
		console.log('ошибка')
		stopTimer()
	} else {
		startDate = Date.now()

		waiting.classList.remove('active')
		waiting.classList.add('non-active')

		waitingClick.classList.remove('non-active')
		waitingClick.classList.add('active')

		main.classList.remove('orange')
		info.classList.remove('orange')

		main.classList.add('green')
		info.classList.add('green')

		stage = 2
	}
}
let errorClickHandler = () => {
	error = true
}

let restartClickHandler = () => {
	error = false
	falseStart.classList.remove('active')
	falseStart.classList.add('non-active')

	reaction.classList.remove('non-active')
	reaction.classList.add('active')

	stage = 0
}
let addReactionTimeToObj = (reactionTime, date) => {
	reactionTimes.push({ date, reactionTime })
	txtUnderImg.textContent = `${reactionTime} мс`
	countSuccessfulTry++
	trySpan.textContent = ` попытка ${countSuccessfulTry} / 5 `
	arrToSessionAverage.push(reactionTime)

	averageSession =
		arrToSessionAverage.reduce((a, b) => a + b) / arrToSessionAverage.length
	averageSpan.textContent = ` среднее время реакции ${averageSession.toFixed()} mc `

	if (countSuccessfulTry === 5) {
		averageSession = 0
		countSuccessfulTry = 0

		const lastFive = reactionTimes.slice(-5)
		const time = lastFive.map(i => {
			return i.reactionTime
		})

		const sum = time.reduce((a, b) => a + b, 0)
		average = sum / time.length || 0

		let today = new Date()
		let dd = String(today.getDate()).padStart(2, '0')
		let mm = String(today.getMonth() + 1).padStart(2, '0')
		let hours = today.getHours()
		let minutes = today.getMinutes()

		let currentDate = mm + '/' + dd + '  ' + hours + ':' + minutes

		arrAverageReactionTime.push({ average: average, date: currentDate })
		if (arrAverageReactionTime[0].date === 'дата') {
			arrAverageReactionTime.shift()
		}
		localStorage.setItem(
			'AverageReactionTime',
			JSON.stringify(arrAverageReactionTime)
		)

		refreshTable()
	}
}

let stopTimer = () => {
	reactionTime = Date.now() - startDate

	if (!error) {
		main.classList.remove('green')
		main.classList.add('dark-green')

		info.classList.remove('green')
		info.classList.add('dark-green')

		waitingClick.classList.remove('active')
		waitingClick.classList.add('non-active')

		result.classList.remove('non-active')
		result.classList.add('active')
		stage = 0
		addReactionTimeToObj(reactionTime, startDate)
	}
}

let buttonShowClickHandler = () => {
	if (hide) {
		tableFill.classList.remove('active')
		tableFill.classList.add('non-active')
		hide = false
	} else {
		tableFill.classList.remove('non-active')
		tableFill.classList.add('active')
		hide = true
	}
}
let buttonClearClickHandler = () => {
	localStorage.clear()
	arrAverageReactionTime = [{ average: 'время', date: 'дата' }]
	refreshTable()
}

//функция обработчика клика
reaction.addEventListener('click', clickHandler)
waitingClick.addEventListener('click', clickHandler)
result.addEventListener('click', clickHandler)
waiting.addEventListener('click', errorClickHandler)
falseStart.addEventListener('click', restartClickHandler)
buttonShow.addEventListener('click', buttonShowClickHandler)
buttonClear.addEventListener('click', buttonClearClickHandler)
