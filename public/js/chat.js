const socket = io()

//Elemets
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const messageTemplateUser = document.querySelector('#message-template-user').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const locationMessageTemplateUser = document.querySelector('#location-message-template-user').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

//Sounds
var soundClick = new Howl({
    src: ['./assets/knob.mp3'],
    autoplay: false,
    loop: false,
    volume: 0.5
})
var soundMsg = new Howl({
    src: ['./assets/tweet.mp3'],
    autoplay: false,
    loop: false,
    volume: 0.2
})

const autoScroll = () => {
    // //Getting the last child
    // const $newMessage = $messages.lastElementChild

    // //Height of new message
    // const newMessageStyles = getComputedStyle($newMessage)
    // const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    // const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // //Visible height
    // const visibleHeight = $messages.offsetHeight

    // //Height of message container
    // const containerHeight = $messages.scrollHeight

    // //Height already scrolled
    // const scrollOffset = $messages.scrollTop + visibleHeight

    $messages.scrollTop = $messages.scrollHeight
}


socket.on('message', (message) => {
    // console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        username: message.username,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
    soundMsg.play()
})

socket.on('userMessage', (message) => {
    // console.log(message)
    const html = Mustache.render(messageTemplateUser, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
    soundMsg.play()
})

socket.on('locationMessage', (loc) => {
    // console.log(loc)
    const html = Mustache.render(locationMessageTemplate, {
        url: loc.url,
        username: loc.username,
        createdAt: moment(loc.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
    soundMsg.play()
})

socket.on('userLocationMessage', (loc) => {
    // console.log(loc)
    const html = Mustache.render(locationMessageTemplateUser, {
        url: loc.url,
        username: loc.username,
        createdAt: moment(loc.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
    soundMsg.play()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }
        // console.log('Message delivered')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!!')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            // console.log('Location Shared!')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})


var c = 1

const $sidebar = document.getElementById('sidebar')
const $chatMain = document.getElementById('chat__main')
const $toggleButton = document.getElementById('show__users')

function sidein() {
    soundClick.play()
    if (c % 2 != 0) {
        $sidebar.style.animation = 'sidein 0.5s ease forwards'
        $chatMain.style.animation = 'midout 0.5s ease forwards'
        $toggleButton.innerHTML = 'Close'
        c += 1
    }
    else {
        $sidebar.style.animation = 'sideout 0.5s ease forwards'
        $chatMain.style.animation = 'midin 0.5s ease forwards'
        $toggleButton.innerHTML = 'Show Users'
        c += 1
    }
}
