// ======introCanvas=====
const introCanvas = document.querySelector('.intro-container')
const blockCanvas = document.getElementsByClassName('block-canvas')[0]
const blocks = document.getElementsByClassName('blocks')
// 當載入網頁時，增加元素方塊
$(document).ready(function() {
    for (let e = 1; e < 200; e++) {
        blockCanvas.innerHTML += `<div class="blocks"></div>`
        blocks[e].style.animationDelay = `${e*0.05}s`
        setTimeout(function(){
            introCanvas.style.opacity = 0
        }, 13000)
    };
});

// ========Jquery==NavBar=for=RWD========
$(window).bind({
    scroll: function() {
        const scrolledY = window.scrollY
        if (scrolledY > 10){
            $('header').addClass('change_header')
            $('.cart').addClass('op-1')
            introCanvas.style.opacity = 0
        } else {
            $('header').removeClass('change_header')
            $('.cart').removeClass('op-1')
        }
    },
    click: function(e){
        const el = $(e.target)
        const target = $('.btn-menu')
        const btn = $('.nav-btn')
        const cl = 'display-block'
        // 判斷是否點擊到該元素，並且檢查有無該屬性
        if (el.is(target) && btn.hasClass(cl) == false ){
            btn.addClass('display-block')
        } else {
            btn.removeClass('display-block')
        }
    }
});

// =======BasicJavaScript====CountdownTimer=======
const daysEl = document.getElementById('days')
const hoursEl = document.getElementById('hours')
const minutesEl = document.getElementById('minutes')
const secondsEl = document.getElementById('seconds')
// 到數時間到2022
const newYears = "1 Jan 2022";
// initial call
countdownTimer();
setInterval(countdownTimer, 1000);
// 計算到明年還有多少時間
function countdownTimer() {
    const newYearsDate = new Date(newYears)
    const currentDate = new Date()
    // 總毫秒換算成總秒數
    const totalSeconds = (newYearsDate - currentDate) / 1000
    // 換算各剩餘時間
    const days = Math.floor(totalSeconds / 3600 / 24)
    const hours = Math.floor(totalSeconds / 3600) % 24
    const minutes = Math.floor(totalSeconds / 60) % 60
    const seconds = Math.floor(totalSeconds) % 60
    daysEl.innerText = days
    hoursEl.innerText = hours
    minutesEl.innerText = minutes
    secondsEl.innerText = seconds
};


// ======JavaScript=Only===WeatherForcast==============
const weatherBox = document.querySelector('.weatherBox')
const weatherBtns = document.querySelectorAll('.w_btn')
const weatherAPI = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-B5282D9D-8FDD-40E9-AD48-B1DF3270465D';
// initial call
getWeatherData();

// 非同步函式
async function getWeatherData() {
    const response = await fetch(weatherAPI)
    const data = await response.json()
    const dataLocation = data.records.location
    // 先載入基本資訊
    const locationResult = dataLocation.filter( element => element.locationName === "臺北市")
    getWeatherDetail(locationResult);
    // 當點擊各地區對應按鈕時，顯示對應的天氣資料
    weatherBtns.forEach( btn => {
        btn.onclick = function() {
            btnRemoveActive();
            this.classList.add('active')
            const filterResult = dataLocation.filter( element => element.locationName === `${this.dataset.id}`)
            getWeatherDetail(filterResult);
        }
    });
};
// 將擷取細部資料的部分整理成一個函式
function getWeatherDetail(resource){
    resource.forEach( element => {
        const locationName = element.locationName
        const weatherWx = element.weatherElement[0].time[1].parameter.parameterName
        const weatherPoP = element.weatherElement[1].time[1].parameter.parameterName
        const weatherMinT = element.weatherElement[2].time[1].parameter.parameterName
        const weatherCI = element.weatherElement[3].time[1].parameter.parameterName
        const weatherMaxT = element.weatherElement[4].time[1].parameter.parameterName
        showWeatherCard(weatherWx, weatherMaxT, weatherMinT, weatherCI, weatherPoP, locationName);
    })
};
// 天氣卡片內容呈現
function showWeatherCard(weather, maxTemp, minTemp, weatherCI, rainPoP, locationName){
    weatherBox.innerHTML = `
    <div class="weatherCard">
        <div class="card_head">
            <div class="weatherLocation">
                <p>地區 : ${locationName}</p>
            </div>
        </div>
        <div class="card_body">
            <div class="card_body_icon">
                <img src="./images/temperature.png" alt="">
            </div>
            <div class="card_body_text">明日天氣時段 <br>AM 6:00 - PM 6:00</div>
        </div>
        <div class="card_foot">
            <ul class="weatherHour">
                <li class="weather">
                    <h3>天氣現象</h3>
                    <p>${weather}</p>
                </li>
                <li class="weatherPoP">
                    <h3>降雨機率</h3>
                    ${rainWarning(rainPoP)}
                </li>
                <li class="maxTemp">
                    <h3>預測最高溫度</h3>
                    <p>${maxTemp} ℃</p>
                </li>
                <li class="minTemp">
                    <h3>預測最低溫度</h3>
                    ${minTempWarning(minTemp)}
                </li>
                <li class="weatherCI">
                    <h3>舒適度</h3>
                    <p>${weatherCI}</p>
                </li>
            </ul>
        </div>
    </div>
    `
};

function minTempWarning(temp){
    if(temp > 25){
        return `<p> ${temp} ℃ , <br>可以考慮開冷氣囉~</p>`
    } else if (25 >= temp > 14){
        return `<p> ${temp} ℃ , <br>還算舒適</p>`
    } else {
        return `<p> ${temp} ℃ , <br>多喝熱水，穿暖一點喔!</p>`
    }
};

function rainWarning(p){
    if (p >= 100) {
        return `<p>${p} % <br>要下大雨啦!</p>`
    } else {
        if (p > 50){
            return `<p>${p} %< <br> 還是帶把傘吧! </p>`
        } else if (p > 25) {
            return `<p>${p} % <br> 把命運交給老天爺吧! </p>`
        } else {
            return `<p>${p} % <br> 免驚，風和日麗! </p>`
        }
    }
};
// 移除點擊天氣按鈕時的CSS
function btnRemoveActive() {
    for (let i=0; i<weatherBtns.length; i++){
        weatherBtns[i].classList.remove('active')
    }
};

//=====================Vue+weatherAPI=========================
const app = new Vue({
    el: '#app',
    data: function() {
        return {
            cityFound: false,
            visible: false,
            citySearch: '',
            imgUrl: './images/sunny.png',
            weather:{
                cityName: '城市',
                weatherWx: '天氣現象',
                maxTemp: 100,
                minTemp: 0,
                rainPop: 33,
                description: '體感舒適度',
            }
        }
    },
    methods: {
        getWeather: async function(){
            const base_url = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-B5282D9D-8FDD-40E9-AD48-B1DF3270465D'
            try {
                const response = await fetch(base_url)
                const data = await response.json()
                const dataArray = data.records.location
                const cityFilter = dataArray.filter(data => data.locationName.match(`${this.citySearch}`))
                this.citySearch = ""
                this.weather.cityName = cityFilter[0].locationName
                this.weather.weatherWx = cityFilter[0].weatherElement[0].time[0].parameter.parameterName
                this.weather.rainPop = Math.round(cityFilter[0].weatherElement[1].time[0].parameter.parameterName)
                this.weather.minTemp = Math.round(cityFilter[0].weatherElement[2].time[0].parameter.parameterName)
                this.weather.description = cityFilter[0].weatherElement[3].time[0].parameter.parameterName
                this.weather.maxTemp = Math.round(cityFilter[0].weatherElement[4].time[0].parameter.parameterName)
    
                const weather_Wx = cityFilter[0].weatherElement[0].time[0].parameter.parameterName
                // 偷懶只用了四種狀況切換圖片
                if (weather_Wx.includes('雨')){
                    this.imgUrl = './images/rainy.png';
                } else if (weather_Wx.includes('陰')){
                    this.imgUrl = './images/cloudy.png';
                } else if (weather_Wx.includes('雲')){
                    this.imgUrl = './images/cloudy-day.png';
                } else if (weather_Wx.includes('晴')){
                    this.imgUrl = './images/sunny.png';
                } else {
                    this.imgUrl = './images/windy.png';
                };
                this.visible = true
                this.cityFound = false
            } catch (error) {
                console.log(error)
                this.visible = false
                this.cityFound = true
            }
        },
    }
})

// ======Swiper===========================

const swiper = new Swiper('.swiper-container', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
        rotate: 40,
        stretch: 0,
        depth: 200,
        modifier: 1,
        slideShadows: true,
    },
    pagination: {
        el: '.swiper-pagination',
    },
    loop: true,
    autoplay: {
        delay: 1000,
        disableOnInteraction: false,
    }
});

// =========componets==shoppingCart=====
// 將產品內容拆分成元件
Vue.component('products', {
    data: function() {
        return {
            showModal: false,
            modalData: {},
            modalAmount: 1,
        }
    },
    props: ['productsData', 'cart', 'tax', 'cartSubTotal', 'cartTotal'],
    methods: {
        // 開啟相對應的資料並轉換成json格式
        activeModal: function(data) {
            this.modalData = (JSON.parse(JSON.stringify(data)))
            this.showModal = true
        },
        hideModal: function() {
            this.modalData = {}
            this.showModal = false
        },
        // 如果資料有多的圖片，可以選取並更換相對應的圖片
        changeImage: function(image) {
            this.modalData.image = image
        },
        // 藉由order編號執行event時切換資料
        changeProductOrder: function(direction) {
            const productLength = shopApp.productsData.length
            const currentOrder = this.modalData.order
            let newOrder
            if (direction === 'prev'){
                // console.log(currentOrder,productLength)
                newOrder = currentOrder - 1
                if (newOrder === 0){
                    newOrder = productLength
                }
            } else if (direction === 'next'){
                newOrder = currentOrder + 1
                if (newOrder > productLength ){
                    newOrder = 1
                }
            }
            for (let i=0; i<productLength; i++){
                if (shopApp.productsData[i].order === newOrder){
                    this.activeModal(shopApp.productsData[i])
                }
            }
        },
        // 加入購物車
        addToCart: function(product) {
            let found = false
            for (let i = 0; i < shopApp.cart.length; i ++) {
                if(shopApp.cart[i].order === product.order){
                    let newProduct = shopApp.cart[i]
                    newProduct.quantity += 1
                    shopApp.$set(shopApp.cart, i, newProduct)
                    found = true
                    break;
                }
            }
            
            if(!found){
                product.quantity = 1
                shopApp.cart.push(product)
            }
            shopApp.cartSubTotal += product.price
            shopApp.cartTotal = shopApp.cartSubTotal + (shopApp.tax * shopApp.cartSubTotal)
            shopApp.checkoutBool = true
        },
        // 從彈出視窗加入購物車
        modalAddToCart: function(modalData) {
            for(let i = 0; i < this.modalAmount; i++) {
              this.addToCart(modalData);
            }
            this.modalAmount = 1;
        }
    },
    template: 
    `<div>
        <div class="products"> 
            <div class="product_card" v-for="product in productsData" track-by="$index">
                <div class="card_image" @click="activeModal(product)" v-bind:style=product.image></div>
                <div class="card_text">
                    <h3>{{product.name}}</h3>
                    <p>{{product.text}}</p>
                    <div class="productPrice"> ＄{{product.price}} USD </div>
                    <button @click="addToCart(product)">Add to Cart</button>
                </div>
            </div>
        </div> 
        <div class="productModal" v-show="showModal">
            <div class="overlay" @click="hideModal()"></div>
            <div class="modal">
                <p><span @click="hideModal()">X</span></p>
                <div class="imageContainer">
                    <div class="image" v-bind:style="modalData.image"></div>
                </div>
                <div class="moreImages" v-if="modalData.images">
                    <div v-for="images in modalData.images" class="additionImage" v-bind:style="images.image" @click="changeImage(images.image)"></div>
                </div>
                <div class="modalText">
                    <div class="prev_product" @click="changeProductOrder('prev')"> ＜ </div>
                    <div class="next_product" @click="changeProductOrder('next')"> ＞ </div>
                    <h3>{{modalData.name}}</h3>
                    <p>{{modalData.text}}</p>
                    <div class="detail"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{modalData.details}}</div>
                    <div class="price">＄ {{modalData.price}} USD</div>
                </div>
                <div class="addCart">
                    <label for="modalAmount">QTY</label>
                    <input id="modalAmount" value="1" v-model="modalAmount" @keyup.enter="modalAddToCart(modalData),hideModal()" type="number" min="1" max="99">
                    <button @click="modalAddToCart(modalData), hideModal()"> Add to Cart</button>
                </div>
            </div>
        </div>
    </div>`
})
// 將購物車內容拆分成元件
Vue.component('cart', {
    data: function() {
        return {
            showCart: false,
        }
    },
    props: ['cart', 'cartQty', 'checkoutBool', 'cartSubTotal', 'cartTotal', 'tax'],
    filters: {
        cartQty: function(cart) {
            let cartQty = 0;
            for (var i = 0; i < cart.length; i++) {
                cartQty += cart[i].quantity
            }
            return cartQty;
        }
    },
    methods: {
        // 從購物車移除商品清單
        removeProduct: function(product) {
            // remove index from array
            for (let i = 0; i < shopApp.cart.length; i ++) {
                if(shopApp.cart[i].order === product.order) {
                    shopApp.cart.splice(i,1)
                }
            }
            shopApp.cartSubTotal -= (product.price * product.quantity)
            shopApp.cartTotal = shopApp.cartSubTotal + (shopApp.cartSubTotal * shopApp.tax)
            if(shopApp.cart.length <= 0) {
                shopApp.cartSubTotal = 0
                shopApp.cartTotal = 0
                shopApp.checkoutBool = false
                this.showCart = false
            }
        },
        clearCart: function() {
            shopApp.cart = [];
            shopApp.cartSubTotal = 0
            shopApp.cartTotal = 0
            shopApp.checkoutBool = false
            this.showCart = false
        },
        // 增加或刪減商品數量
        quantityChange: function(product, direction) {
            for (let i = 0; i < shopApp.cart.length; i++) {
                if (shopApp.cart[i].order === product.order) {
                    let newProduct = shopApp.cart[i]
                    if(direction === "incriment") {
                        newProduct.quantity += 1;
                        shopApp.$set(shopApp.cart, i, newProduct)
                    } else {
                        newProduct.quantity -= 1
                        if(newProduct.quantity == 0) {
                            shopApp.cart.splice(i, 1)
                        } else {
                            shopApp.$set(shopApp.cart, i, newProduct)
                        }
                    }
                }
            }
            if(direction === "incriment") {
                shopApp.cartSubTotal += product.price
            } else {
                shopApp.cartSubTotal -= product.price
            }
            shopApp.cartTotal = shopApp.cartSubTotal + (shopApp.tax * shopApp.cartSubTotal)
      
            if(shopApp.cart.length <= 0) {
                shopApp.checkoutBool = false
                this.showCart = false
            }
        },
    },
    template: `
    <div>
        <div class="cart">
            <div class="cart-image" @click="showCart =! showCart">
                <div class="image" style="background-image: url('./images/shopping-cart.png');"></div>
                <p class="cart_quantity"> {{cart | cartQty}} </p>
            </div>
            <table v-if="showCart">
                <tbody>
                    <tr v-for="product in cart">
                        <td>
                            <div class="image" v-bind:style="product.image" @click="removeProduct(product)">
                                <p>x</p>
                            </div>
                            <span @click="quantityChange(product, 'decriment')"> — </span>
                            <div class="quantity"> {{product.quantity}} </div>
                            <span @click="quantityChange(product, 'incriment')"> ＋ </span>
                            <div class="name"> {{product.name}} </div>
                            <div class="price"> ＄ {{product.price}} USD </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="total" v-show="showCart"> ＄ {{cartSubTotal}} USD </div>
            <button v-show="showCart" @click="clearCart()"> clear cart</button>
        </div>
    </div>`
})
// initial call
const shopApp = new Vue({
    el: '#shopApp',
    data: {
        checkoutBool: false,
        cart: [],
        cartSubTotal: 0,
        tax: 0.06,
        cartTotal: 0,
        productsData: [
            {
                order: 1,
                name: "狗狗",
                image: "background-image: url('./images/dog-1.jpg');",
                images: [
                    { image: "background-image: url('./images/dog-2.jpg')" },
                    { image: "background-image: url('./images/dog-3.jpg')" },
                    { image: "background-image: url('./images/dog-4.jpg')" },
                    { image: "background-image: url('./images/dog-5.jpg')" }
                ],
                text: "這是一隻狗",
                details: "這是John wick的狗, 別搞砸了!!",
                price: 7
            },
            {
                order: 2,
                name: "貓咪",
                image: "background-image: url('./images/kitten-1.jpg')",
                images: [
                    {image: "background-image: url('./images/kitten-1.jpg')"},
                    {image: "background-image: url('./images/kitten-2.jpg')"},
                    {image: "background-image: url('./images/kitten-3.jpg')"}
                ],
                text: "這是貓咪",
                details: "這裡會放置有關貓咪的詳細資訊，這些貓咪很可愛對吧?",
                price: 10
            },
            {
                order: 3,
                name: "鯊魚",
                image: "background-image: url('./images/guragwar.jpg')",
                text: "小心，鯊魚!",
                details: "這裡會放置有關鯊魚的詳細資訊，AAA.",
                price: 666
            },
            {
                order: 4,
                name: "義大利麵",
                image: "background-image: url('./images/pasta.jpg')",
                text: "這是義大利麵",
                details: "這裡會放置有關義大利麵的詳細資訊，是不是看起來很可口?",
                price: 5
            },
            {
                order: 5,
                name: "咖啡",
                image: "background-image: url('./images/coffee-2.jpg')",
                text: "這是咖啡",
                details: "這裡會放置有關咖啡的詳細資訊，時間到了要不要來一杯咖啡?",
                price: 9.9
            }
        ]
    },
    // TODO: 結帳畫面
    // events: {
    //     "checkoutRequest": function() {
    //         vue.$broadcast("checkoutRequest");
    //     }
    // }
})