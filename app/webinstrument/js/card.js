class card {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.imgs = []
        this.locationsX = []
        this.locationsY = []
        this.data = []
        this.baseData = {
            "id": "2ihneCwliFo",
            "created_at": "2020-02-17T02:03:30-05:00",
            "updated_at": "2021-12-12T03:10:24-05:00",
            "promoted_at": null,
            "width": 3500,
            "height": 2333,
            "color": "#f3f3f3",
            "blur_hash": "L@N0;rbbIVoe00WURkofR:aes.kC",
            "description": "Vintage oldtimer classic car – stereotype decoration 70s items wobble dog toy and crocheted toilet paper hat",
            "alt_description": "white and black dog lying on green and blue textile",
            "urls": {
                "raw": "https://images.unsplash.com/photo-1581922730118-2c9bcc450def?ixid=MnwyODE0NDJ8MHwxfHNlYXJjaHwyfHx3b2JibGV8ZW58MHwwfHx8MTYzOTI5ODI3MA&ixlib=rb-1.2.1",
                "full": "https://images.unsplash.com/photo-1581922730118-2c9bcc450def?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyODE0NDJ8MHwxfHNlYXJjaHwyfHx3b2JibGV8ZW58MHwwfHx8MTYzOTI5ODI3MA&ixlib=rb-1.2.1&q=85",
                "regular": "https://images.unsplash.com/photo-1581922730118-2c9bcc450def?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE0NDJ8MHwxfHNlYXJjaHwyfHx3b2JibGV8ZW58MHwwfHx8MTYzOTI5ODI3MA&ixlib=rb-1.2.1&q=80&w=1080",
                "small": "https://images.unsplash.com/photo-1581922730118-2c9bcc450def?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE0NDJ8MHwxfHNlYXJjaHwyfHx3b2JibGV8ZW58MHwwfHx8MTYzOTI5ODI3MA&ixlib=rb-1.2.1&q=80&w=400",
                "thumb": "https://images.unsplash.com/photo-1581922730118-2c9bcc450def?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE0NDJ8MHwxfHNlYXJjaHwyfHx3b2JibGV8ZW58MHwwfHx8MTYzOTI5ODI3MA&ixlib=rb-1.2.1&q=80&w=200"
            },
            "links": {
                "self": "https://api.unsplash.com/photos/2ihneCwliFo",
                "html": "https://unsplash.com/photos/2ihneCwliFo",
                "download": "https://unsplash.com/photos/2ihneCwliFo/download?ixid=MnwyODE0NDJ8MHwxfHNlYXJjaHwyfHx3b2JibGV8ZW58MHwwfHx8MTYzOTI5ODI3MA",
                "download_location": "https://api.unsplash.com/photos/2ihneCwliFo/download?ixid=MnwyODE0NDJ8MHwxfHNlYXJjaHwyfHx3b2JibGV8ZW58MHwwfHx8MTYzOTI5ODI3MA"
            },
            "categories": [],
            "likes": 7,
            "liked_by_user": false,
            "current_user_collections": [],
            "sponsorship": null,
            "topic_submissions": {},
            "user": {
                "id": "A7mKxgipFc8",
                "updated_at": "2021-12-12T03:07:53-05:00",
                "username": "markusspiske",
                "name": "Markus Spiske",
                "first_name": "Markus",
                "last_name": "Spiske",
                "twitter_username": null,
                "portfolio_url": "https://freeforcommercialuse.net",
                "bio": "Petty & everyday imagery – digital (5d IV) & analog (Leica R7). NO flights. NO overtourism instagram travel hotspots. NO social media. Thanks for your donation. 🙏 ",
                "location": "Upper Franconia, Bavaria, Germany",
                "links": {
                    "self": "https://api.unsplash.com/users/markusspiske",
                    "html": "https://unsplash.com/@markusspiske",
                    "photos": "https://api.unsplash.com/users/markusspiske/photos",
                    "likes": "https://api.unsplash.com/users/markusspiske/likes",
                    "portfolio": "https://api.unsplash.com/users/markusspiske/portfolio",
                    "following": "https://api.unsplash.com/users/markusspiske/following",
                    "followers": "https://api.unsplash.com/users/markusspiske/followers"
                },
                "profile_image": {
                    "small": "https://images.unsplash.com/profile-1468003870880-1d44bae203c5?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32",
                    "medium": "https://images.unsplash.com/profile-1468003870880-1d44bae203c5?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64",
                    "large": "https://images.unsplash.com/profile-1468003870880-1d44bae203c5?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128"
                },
                "instagram_username": null,
                "total_collections": 22,
                "total_likes": 5613,
                "total_photos": 3740,
                "accepted_tos": true,
                "for_hire": true,
                "social": {
                    "instagram_username": null,
                    "portfolio_url": "https://freeforcommercialuse.net",
                    "twitter_username": null,
                    "paypal_email": null
                }
            },
            "tags": [{
                "type": "search",
                "title": "nürnberg"
            },
            {
                "type": "search",
                "title": "deutschland"
            },
            {
                "type": "search",
                "title": "hat"
            }
            ]
        }
    }

    initCards(p, cropAndResizeImage) {
        for (let index = 0; index < 6; index++) {
            if (this.imgs.length > 5) {
                this.imgs = []
                this.data = []
            }
            p.loadImage(this.baseData.urls.thumb, _img => {
                let gridSpaceX = p.windowWidth / 32
                let gridSpaceY = p.windowHeight / 32
                let processedImage

                if (p.windowWidth > p.windowHeight) {
                    // 'landscape';
                    processedImage = cropAndResizeImage(_img, gridSpaceX * 6, gridSpaceY * 6)
                } else {
                    // 'portrait';
                    processedImage = cropAndResizeImage(_img, gridSpaceX * 6, gridSpaceY * 6)

                }
                this.imgs.push(processedImage)
                this.data.push(this.baseData)


                this.locationsX[index] = processedImage.width / 2 + gridSpaceX + ((processedImage.width + gridSpaceX) * (index % 3)) + this.x;
                if (index < 3) {
                    this.locationsY[index] = (processedImage.height / 2) + ((processedImage.height) * (0)) + this.y;
                } else {
                    this.locationsY[index] = (processedImage.height / 2) + ((processedImage.height + gridSpaceY) * (1)) + this.y;
                }
            })
        }
    }

    initCardsLocations(p) {
        let gridSpaceX = p.windowWidth / 32
        let gridSpaceY = p.windowHeight / 32
        for (let index = 0; index < 6; index++) {
            this.locationsX[index] = this.imgs[index].width / 2 + gridSpaceX + ((this.imgs[index].width + gridSpaceX) * (index % 3)) + this.x;
            if (index < 3) {
                this.locationsY[index] = (this.imgs[index].height / 2) + ((this.imgs[index].height) * (0)) + this.y;
            } else {
                this.locationsY[index] = (this.imgs[index].height / 2) + ((this.imgs[index].height + gridSpaceY) * (1)) + this.y;
            }
        }
    }

    checkPressed(p, index) {
        if (p.mouseX > this.locationsX[index] - this.imgs[index].width / 2 && p.mouseX < this.locationsX[index] + this.imgs[index].width / 2) {
            if (p.mouseY > this.locationsY[index] - this.imgs[index].height / 2 && p.mouseY < this.locationsY[index] + this.imgs[index].height / 2) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    checkOver(p, imgDragged, card, index) {
        if (this.locationsX[imgDragged] > card.locationsX[index] - card.imgs[index].width / 2 && this.locationsX[imgDragged] < card.locationsX[index] + card.imgs[index].width ||
            p.mouseX > card.locationsX[index] - card.imgs[index].width / 2 && p.mouseX < card.locationsX[index] + card.imgs[index].width) {
            if (this.locationsY[imgDragged] > card.locationsY[index] - card.imgs[index].height / 2 && this.locationsY[imgDragged] < card.locationsY[index] + card.imgs[index].height ||
                p.mouseY > card.locationsY[index] - card.imgs[index].height / 2 && p.mouseY < card.locationsY[index] + card.imgs[index].height) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    makeHexString = (length = 6) => {
        let result = ''
        let characters = 'ABCDEF0123456789'
        let charactersLength = characters.length
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
    }

    show(p) {
        for (let index = 0; index < 6; index++) {
            if (this.imgs[index] == undefined) return
            p.image(this.imgs[index], this.locationsX[index], this.locationsY[index])
        }
    }
}