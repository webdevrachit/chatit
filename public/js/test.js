import { Howl, Howler } from 'howler'

var sound = new Howl({
    src: ['./knob.mp3'],
    onend: function () {
        console.log('finished')
    }
})

sound.play()