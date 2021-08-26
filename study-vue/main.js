var app = new Vue({
    el: '#app',
    data: {
        message: {
            value : '', // 이렇게 정의한 message는 변화를 감지할 수 있게 됨.
        },
        // list: ['딸기', '바나나', '사과'],
        fruits: [
            { 
                name: '딸기',
                color: 'red'
            },
            { 
                name: '바나나',
                color: 'yellow'
            },
            { 
                name: '사과',
                color: 'red'
            },
        ],
        num : 0,
        show: true,
        count: 0,
        radius: 10,
    },
    methods: {
        increment: function() {
            this.count += 1
        }
        doAdd: function() {
            this.fruits.push()
        }
    }
    
})