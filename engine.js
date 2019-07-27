(function (window, $) {
    'use strict';


    // This function will contain all our code
    function myLibrary() {
        var _myLibraryObject = {};
        var sprites = {}
        var spriteImg = {};
        _myLibraryObject.Stage = function ({
            height: height = 500,
            width: width = 500,
            color: color = undefined,
            canvas: canvas = document.getElementById("game")
        } = {
            height: 500,
            width: 500,
            color: undefined,
            canvas: document.getElementById("game")
        }) {
            canvas.height = height
            canvas.width = width
            setInterval(() => {
                var context = canvas.getContext("2d");
                context.clearRect(0, 0, canvas.width, canvas.height);
                if (color != undefined) {
                    context.fillStyle = color
                    context.fillRect(0, 0, canvas.width, canvas.height);
                }
                for (var i in sprites) {
                    if (!(Object.keys(spriteImg).includes(sprites[i].image))) {
                        spriteImg[i] = new Image()
                        spriteImg[i].src = sprites[i].image;
                        spriteImg[i]["data-i"] = i
                        spriteImg[i]["data-image"] = sprites[i].image
                        spriteImg[i].onload = function (ev) {
                            spriteImg[ev.currentTarget["data-image"]] = spriteImg[ev.currentTarget["data-i"]]
                            context.drawImage(spriteImg[ev.currentTarget["data-image"]], sprites[ev.currentTarget["data-i"]].x, sprites[ev.currentTarget["data-i"]].y)
                        }
                    } else {
                        context.drawImage(spriteImg[sprites[i].image], sprites[i].x, sprites[i].y)
                    }

                }
            })
        }
        _myLibraryObject.Sprite = function ([x, y, degree] = [0, 0, 0], image = "") {
            this.x = x
            this.y = y
            this.degree = degree
            this.id = (function () {
                if (Object.keys(sprites) == []) {
                    return 0;
                }
                for (var x in Object.keys(sprites)) {
                    if (x != (sprites[x] === undefined ? undefined : sprites[x].id)) {
                        return x;
                    }
                }
                return Object.keys(sprites).length
            })()
            this.image = image
            this.physics = {}
            this.delete = function () {
                var pairs = Object.keys(this)
                for (var x in pairs) {
                    delete this[pairs[x]]
                }
                delete sprites[this.id]
            }
            //Physics
            this.togglePhysics = function ({
                velocity = 0,
                acceleration = 0,
                velocityLoss = 0,
                accelerationLoss = 0,
                degree = 0,
                gravityVelocity = 0,
                gravityAcceleration = 0,
                gravityDegree = 90
            } = {
                velocity: 0,
                acceleration: 0,
                velocityLoss: 0,
                accelerationLoss: 0,
                degree: 0,
                gravityVelocity: 0,
                gravityAcceleration: 0,
                gravityDegree: 90
            }) {
                this.physics.velocity = velocity // Starting velocity
                this.physics.acceleration = acceleration // Starting acceleration
                this.physics.velocityLoss = velocityLoss // Velocity Loss
                this.physics.accelerationLoss = accelerationLoss // Acceleration Loss
                this.physics.degree = degree // Degree to move to
                this.physics.gravityAcceleration = gravityAcceleration // Gravity acceleration
                this.physics.gravityVelocity = gravityVelocity // Gravity velocity
                this.physics.gravityDegree = gravityDegree // Degree to move to
                setInterval(() => {
                    //Gravity movement calculation(No loss)
                    this.physics.gravityVelocity += this.physics.gravityAcceleration / 1000
                    this.x += this.physics.gravityVelocity / 1000 * Math.cos(rad(this.physics.gravityDegree));
                    this.y += this.physics.gravityVelocity / 1000 * Math.sin(rad(this.physics.gravityDegree));
                    //Normal movement calculation(With loss)
                    this.physics.velocity += this.physics.acceleration / 1000
                    this.physics.velocity -= (this.physics.velocity - this.physics.velocityLoss / 1000 < 0 ? this.physics.velocity : this.physics.velocityLoss / 1000)
                    this.physics.acceleration -= (this.physics.acceleration - this.physics.accelerationLoss / 1000 < 0 ? this.physics.acceleration : this.physics.accelerationLoss / 1000)
                    this.x += this.physics.velocity / 1000 * Math.cos(rad(this.physics.degree));
                    this.y += this.physics.velocity / 1000 * Math.sin(rad(this.physics.degree));
                }, 1)
            }
            sprites[this.id] = this
        }
        _myLibraryObject.sprites = function () {
            return clone(sprites)
        }
        return _myLibraryObject;
    }
    if (typeof (window.myWindowGlobalLibraryName) === 'undefined') {
        window.BCGE = myLibrary();
    }
})(window, $);