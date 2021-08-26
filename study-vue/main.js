var scroll = new SmoothScroll()
var app = new Vue({
    el: '#app',
    data: {
        message: {
            value : '', // 이렇게 정의한 message는 변화를 감지할 수 있게 됨.
        },
        // list: ['딸기', '바나나', '사과'],
        fruits: [
            { 
                id: 1,
                name: '딸기',
                color: 'red'
            },
            { 
                id: 2,
                name: '바나나',
                color: 'yellow'
            },
            { 
                id: 3,
                name: '사과',
                color: 'red'
            },
        ],
        num : 0,
        show: true,
        count: 0,
        radius: 10,
        scrollY: 0,
        timer: null
    },
    created: function() {
        // 핸들러 등록하기
        window.addEventListener('scroll', this.handleScroll)
    },
    mounted: function() {
        // console.log(this.$el), // <div id="app"></div>
        console.log(this.$refs.specialSpan) //<span ref="specialSpan">얘 이름은 special-span임</span>
    },
    beforeDestroy: function() {
        // 핸들러 제거하기(컴포넌트 또는 SPA의 경우 절대 잊지 말아 주세요!!)
        window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
        increment: function() {
            this.count += 1
        },
        // 위화감을 느끼지 않을 200ms 간격으로 scroll 데이터 변경하는 예
        handleScroll: function() {
            if (this.timer === null) {
                this.timer = setTimeout(function() {
                    this.scrollY = window.scrollY
                    clearTimeout(this.timer)
                    this.timer = null
                }.bind(this),200)
            }
        },
        // 부드러운 스크롤 적용
        scrollTop: function() {
            scroll.animateScroll(0)
        },
    },
})