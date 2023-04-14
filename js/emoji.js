const eyes = document.getElementById("eyes")
const mouth = document.getElementById("mouth")
const skin = document.getElementById("skin")

const eyeValues = ["closed", "laughing", "long", "normal", "rolling", "winking"]
const mouthValues = ["open", "sad", "smiling", "straight", "surprise", "teeth"]
const skinValues = ["green", "red", "yellow"]

let e = 0;
let m = 0;
let s = 0;

// I could definitely do this better with a circular queue but it would take more effort to implement than just doing this
function cycleArray(name, num) {
    switch (name) {
        case "eyes":
            e = Number.prototype.clamp(e + num, 0, eyeValues.length - 1)
            break;

        case "mouth":
            m = Number.prototype.clamp(m + num, 0, mouthValues.length - 1)
            break;

        case "skin":
            s = Number.prototype.clamp(s + num, 0, skinValues.length - 1)
            break;

        default:
            console.log("Error: no cycle chosen")
    }

    eyes.src = "./src/emojis/eyes/" + eyeValues[e] + ".png"
    mouth.src = "./src/emojis/mouth/" + mouthValues[m] + ".png"
    skin.src = "./src/emojis/skin/" + skinValues[s] + ".png"

    document.getElementById("e-val").value = eyeValues[e]
    document.getElementById("m-val").value = mouthValues[m]
    document.getElementById("s-val").value = skinValues[s]
}

// Util
Number.prototype.clamp = (val, min, max) => Math.min(Math.max(val, min), max)